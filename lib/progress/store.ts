import type { SupabaseClient } from "@supabase/supabase-js";
import type { LessonProgress, LessonSlug, ProgressState, TaskItemId } from "@/lib/types";
import { MAX_CHECKS_PER_LESSON, TASK_ITEM_IDS } from "@/lib/course-registry";
import { createClient } from "@/lib/supabase/client";
import {
  backupProgress,
  clearProgress,
  EPOCH,
  ID_PATTERN,
  createEmptyState,
  isLessonSlug,
  normaliseProofNote,
  readProgress,
  readSyncIndex,
  subscribeToStorage,
  writeProgress,
  writeSyncIndex,
  type StorageStatus,
} from "./storage";
import {
  deleteProgress,
  fetchProgress,
  upsertLesson,
  upsertMeta,
} from "./remote";
import { entryToMetaPayload, entryToRowPayload, mergeProgress } from "./sync";

export type SyncStatus = "local" | "loading" | "synced" | "error";

export interface ProgressUser {
  id: string;
  email: string | null;
}

export type ProgressSnapshot = Readonly<{
  state: ProgressState;
  ready: boolean;
  storage: StorageStatus;
  sync: SyncStatus;
  user: ProgressUser | null;
}>;

export type ProgressStore = {
  getSnapshot(): ProgressSnapshot;
  subscribe(listener: () => void): () => void;
  hydrate(): void;
  attachUser(user: ProgressUser): void;
  detachUser(): void;
  retrySync(): void;
  clearLocal(): void;
  repair(slug: LessonSlug): void;
  setCheck(slug: LessonSlug, checkId: string, selectedOptionId: string): void;
  toggleTask(slug: LessonSlug, itemId: string): void;
  setProof(slug: LessonSlug, text: string): void;
  setPosition(slug: LessonSlug, sectionId: string): void;
  reset(): void;
};

const EMPTY_LESSONS: Record<string, LessonProgress> = Object.freeze({});

const EMPTY_STATE_VALUE: ProgressState = {
  ...createEmptyState(EPOCH),
  lessons: EMPTY_LESSONS,
};

/** The empty state keeps one identity for the server and first client render. */
export const EMPTY_STATE: ProgressState = Object.freeze(EMPTY_STATE_VALUE);

const EMPTY_SNAPSHOT_VALUE: ProgressSnapshot = {
  state: EMPTY_STATE,
  ready: false,
  storage: "ok",
  sync: "local",
  user: null,
};

export const EMPTY_SNAPSHOT: ProgressSnapshot = Object.freeze(EMPTY_SNAPSHOT_VALUE);

/** How long one accepted lesson write waits before its remote upsert. */
const SYNC_DELAY_MS = 800;

function now(): string {
  return new Date().toISOString();
}

function createEntry(): LessonProgress {
  return {
    status: "in-progress",
    checkAnswers: {},
    taskTicks: [],
    proofNote: "",
    repairedAt: null,
  };
}

function isTickId(value: string): value is TaskItemId {
  return (TASK_ITEM_IDS as readonly string[]).includes(value);
}

function statesEqual(a: ProgressState, b: ProgressState): boolean {
  return a === b || JSON.stringify(a) === JSON.stringify(b);
}

/** The browser Supabase client, or null when it is unavailable or unconfigured. */
function getClient(): SupabaseClient | null {
  if (typeof window === "undefined") return null;
  try {
    return createClient();
  } catch {
    return null;
  }
}

export function createStore(initial: ProgressSnapshot): ProgressStore {
  let snapshot: ProgressSnapshot = initial;
  let hydrated = false;
  const listeners = new Set<() => void>();

  // Guards a merge against local edits made while the remote fetch was in flight.
  let revision = 0;
  // Identifies the current attach attempt; a stale attempt must not publish.
  let attachToken = 0;
  let pagehideBound = false;

  const lessonTimers = new Map<string, ReturnType<typeof setTimeout>>();
  const pendingLessons = new Set<string>();
  let metaTimer: ReturnType<typeof setTimeout> | null = null;
  let metaPending = false;

  function emit(): void {
    for (const listener of [...listeners]) listener();
  }

  function publish(patch: Partial<ProgressSnapshot>): void {
    snapshot = Object.freeze({ ...snapshot, ...patch });
    emit();
  }

  function setSync(next: SyncStatus): void {
    if (snapshot.sync !== next) publish({ sync: next });
  }

  /** Persist one accepted state, then publish it. The action writes once. */
  function commit(state: ProgressState): void {
    const storage = writeProgress(state);
    revision += 1;
    publish({ state, storage });
  }

  function commitEntry(slug: LessonSlug, entry: LessonProgress): void {
    const timestamp = now();
    writeSyncIndex(slug, timestamp);
    commit({
      ...snapshot.state,
      lessons: { ...snapshot.state.lessons, [slug]: entry },
      updatedAt: timestamp,
    });
    queueLesson(slug);
  }

  function isCurrent(token: number, user: ProgressUser): boolean {
    return token === attachToken && snapshot.user?.id === user.id;
  }

  function settleSync(): void {
    if (snapshot.sync === "loading") return;
    if (pendingLessons.size === 0 && !metaPending) setSync("synced");
  }

  function clearQueues(): void {
    for (const timer of lessonTimers.values()) clearTimeout(timer);
    lessonTimers.clear();
    if (metaTimer !== null) {
      clearTimeout(metaTimer);
      metaTimer = null;
    }
    pendingLessons.clear();
    metaPending = false;
  }

  function queueLesson(slug: LessonSlug): void {
    if (!snapshot.user) return;
    if (snapshot.sync === "loading" || snapshot.sync === "local") return;

    pendingLessons.add(slug);
    const existing = lessonTimers.get(slug);
    if (existing !== undefined) clearTimeout(existing);
    lessonTimers.set(
      slug,
      setTimeout(() => {
        lessonTimers.delete(slug);
        void flushLesson(slug);
      }, SYNC_DELAY_MS),
    );
  }

  function queueMeta(): void {
    if (!snapshot.user) return;
    if (snapshot.sync === "loading" || snapshot.sync === "local") return;

    metaPending = true;
    if (metaTimer !== null) clearTimeout(metaTimer);
    metaTimer = setTimeout(() => {
      metaTimer = null;
      void flushMeta();
    }, SYNC_DELAY_MS);
  }

  async function flushLesson(slug: LessonSlug): Promise<void> {
    const attached = snapshot.user;
    if (!attached || snapshot.sync === "loading") return;

    const entry = snapshot.state.lessons[slug];
    if (!entry) {
      pendingLessons.delete(slug);
      settleSync();
      return;
    }

    const client = getClient();
    if (!client) {
      pendingLessons.add(slug);
      setSync("error");
      return;
    }

    const result = await upsertLesson(
      client,
      attached.id,
      entryToRowPayload(slug, entry),
    );
    if (snapshot.user?.id !== attached.id) return;

    if (!result.ok) {
      pendingLessons.add(slug);
      setSync("error");
      return;
    }

    pendingLessons.delete(slug);
    settleSync();
  }

  async function flushMeta(): Promise<void> {
    const attached = snapshot.user;
    if (!attached || snapshot.sync === "loading") return;

    const client = getClient();
    if (!client) {
      metaPending = true;
      setSync("error");
      return;
    }

    const result = await upsertMeta(
      client,
      attached.id,
      entryToMetaPayload(snapshot.state),
    );
    if (snapshot.user?.id !== attached.id) return;

    if (!result.ok) {
      metaPending = true;
      setSync("error");
      return;
    }

    metaPending = false;
    settleSync();
  }

  async function uploadMerged(
    client: SupabaseClient,
    attached: ProgressUser,
    token: number,
    merged: ReturnType<typeof mergeProgress>,
  ): Promise<void> {
    let failed = false;

    for (const upload of merged.lessonUploads) {
      const result = await upsertLesson(
        client,
        attached.id,
        entryToRowPayload(upload.slug, upload.entry),
      );
      if (!isCurrent(token, attached)) return;
      if (result.ok) pendingLessons.delete(upload.slug);
      else {
        pendingLessons.add(upload.slug);
        failed = true;
      }
    }

    if (merged.metaUpload) {
      const result = await upsertMeta(client, attached.id, merged.metaUpload);
      if (!isCurrent(token, attached)) return;
      if (result.ok) metaPending = false;
      else {
        metaPending = true;
        failed = true;
      }
    }

    if (failed) setSync("error");
    else settleSync();
  }

  async function runAttach(attached: ProgressUser, token: number): Promise<void> {
    const client = getClient();
    if (!client) {
      if (isCurrent(token, attached)) setSync("error");
      return;
    }

    const revisionAtFetch = revision;
    const remote = await fetchProgress(client, attached.id);
    if (!isCurrent(token, attached)) return;
    if (!remote.ok) {
      setSync("error");
      return;
    }

    let merged = mergeProgress(
      snapshot.state,
      remote.data.rows,
      remote.data.meta,
      readSyncIndex(),
    );
    // A local edit landed while the fetch was in flight: merge the latest state again.
    if (revision !== revisionAtFetch) {
      merged = mergeProgress(
        snapshot.state,
        remote.data.rows,
        remote.data.meta,
        readSyncIndex(),
      );
    }

    const storage = writeProgress(merged.state);
    const stamp = now();
    for (const upload of merged.lessonUploads) {
      writeSyncIndex(upload.slug, stamp);
    }

    publish({ state: merged.state, storage, sync: "synced" });
    await uploadMerged(client, attached, token, merged);
  }

  function attachUser(nextUser: ProgressUser): void {
    hydrate();

    if (snapshot.user?.id === nextUser.id) {
      if (snapshot.user.email !== nextUser.email) publish({ user: nextUser });
      return;
    }

    const token = ++attachToken;
    clearQueues();
    publish({ user: nextUser, sync: "loading" });
    backupProgress(snapshot.state);
    void runAttach(nextUser, token);
  }

  function detachUser(): void {
    if (snapshot.user === null && snapshot.sync === "local") return;
    attachToken += 1;
    clearQueues();
    publish({ user: null, sync: "local" });
  }

  function retrySync(): void {
    const attached = snapshot.user;
    if (!attached) return;
    const token = ++attachToken;
    publish({ sync: "loading" });
    void runAttach(attached, token);
  }

  function clearLocal(): void {
    attachToken += 1;
    clearQueues();
    clearProgress();
    revision += 1;
    const { state, status } = readProgress();
    publish({ state, storage: status, sync: "local", user: null });
  }

  function handleStorageChange(): void {
    const { state, status } = readProgress();
    if (status === snapshot.storage && statesEqual(state, snapshot.state)) return;
    publish({ state, ready: true, storage: status });
  }

  function handlePageHide(): void {
    if (!snapshot.user) return;
    for (const timer of lessonTimers.values()) clearTimeout(timer);
    lessonTimers.clear();
    if (metaTimer !== null) {
      clearTimeout(metaTimer);
      metaTimer = null;
    }
    for (const slug of [...pendingLessons]) void flushLesson(slug);
    if (metaPending) void flushMeta();
  }

  function bindPageHide(): void {
    if (pagehideBound || typeof window === "undefined") return;
    pagehideBound = true;
    try {
      window.addEventListener("pagehide", handlePageHide);
    } catch {
      // A missing listener only costs the final flush.
    }
  }

  function getSnapshot(): ProgressSnapshot {
    return snapshot;
  }

  function subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }

  function hydrate(): void {
    if (hydrated) return;
    hydrated = true;
    const { state, status } = readProgress();
    snapshot = Object.freeze<ProgressSnapshot>({
      ...snapshot,
      state,
      ready: true,
      storage: status,
    });
    subscribeToStorage(handleStorageChange);
    bindPageHide();
    emit();
  }

  function repair(slug: LessonSlug): void {
    if (!snapshot.ready || !isLessonSlug(slug)) return;
    const entry = snapshot.state.lessons[slug];
    if (!entry || entry.status === "repaired") return;

    const timestamp = now();
    const nextEntry: LessonProgress = {
      ...entry,
      status: "repaired",
      repairedAt: timestamp,
    };
    writeSyncIndex(slug, timestamp);
    commit({
      ...snapshot.state,
      lessons: { ...snapshot.state.lessons, [slug]: nextEntry },
      lastLessonSlug: slug,
      lastSectionId: null,
      updatedAt: timestamp,
    });
    queueLesson(slug);
    queueMeta();
  }

  function setCheck(slug: LessonSlug, checkId: string, selectedOptionId: string): void {
    if (!snapshot.ready || !isLessonSlug(slug)) return;
    if (typeof checkId !== "string" || !ID_PATTERN.test(checkId)) return;
    if (
      typeof selectedOptionId !== "string" ||
      selectedOptionId.length === 0 ||
      selectedOptionId.length > 64
    ) {
      return;
    }

    const entry = snapshot.state.lessons[slug] ?? createEntry();
    const answers = entry.checkAnswers;
    const existing = answers[checkId];
    if (!existing && Object.keys(answers).length >= MAX_CHECKS_PER_LESSON) return;
    if (existing && existing.selectedOptionId === selectedOptionId) return;

    const nextEntry: LessonProgress = {
      ...entry,
      checkAnswers: { ...answers, [checkId]: { selectedOptionId } },
    };
    commitEntry(slug, nextEntry);
  }

  function toggleTask(slug: LessonSlug, itemId: string): void {
    if (!snapshot.ready || !isLessonSlug(slug) || !isTickId(itemId)) return;

    const entry = snapshot.state.lessons[slug] ?? createEntry();
    const ticks = new Set<TaskItemId>(entry.taskTicks);
    if (ticks.has(itemId)) ticks.delete(itemId);
    else ticks.add(itemId);

    const taskTicks = TASK_ITEM_IDS.filter((tick) => ticks.has(tick));
    const nextEntry: LessonProgress = { ...entry, taskTicks: [...taskTicks] };
    commitEntry(slug, nextEntry);
  }

  function setProof(slug: LessonSlug, text: string): void {
    if (!snapshot.ready || !isLessonSlug(slug)) return;

    const entry = snapshot.state.lessons[slug] ?? createEntry();
    const nextNote = normaliseProofNote(typeof text === "string" ? text : "");
    if (nextNote === entry.proofNote) return;

    const nextEntry: LessonProgress = { ...entry, proofNote: nextNote };
    commitEntry(slug, nextEntry);
  }

  function setPosition(slug: LessonSlug, sectionId: string): void {
    if (!snapshot.ready || !isLessonSlug(slug)) return;
    if (typeof sectionId !== "string" || !ID_PATTERN.test(sectionId)) return;
    if (snapshot.state.lastLessonSlug === slug && snapshot.state.lastSectionId === sectionId) {
      return;
    }

    const existing = snapshot.state.lessons[slug];
    const lessons = existing
      ? snapshot.state.lessons
      : { ...snapshot.state.lessons, [slug]: createEntry() };

    commit({
      ...snapshot.state,
      lessons,
      lastLessonSlug: slug,
      lastSectionId: sectionId,
      updatedAt: now(),
    });
    queueMeta();
  }

  function reset(): void {
    if (!snapshot.ready) return;

    const attached = snapshot.user;
    const token = ++attachToken;
    clearQueues();

    clearProgress();
    revision += 1;
    const { state, status } = readProgress();
    publish({ state, storage: status });

    if (!attached) {
      setSync("local");
      return;
    }

    const client = getClient();
    if (!client) {
      setSync("error");
      return;
    }

    setSync("loading");
    void deleteProgress(client, attached.id).then((result) => {
      if (!isCurrent(token, attached)) return;
      setSync(result.ok ? "synced" : "error");
    });
  }

  return {
    getSnapshot,
    subscribe,
    hydrate,
    attachUser,
    detachUser,
    retrySync,
    clearLocal,
    repair,
    setCheck,
    toggleTask,
    setProof,
    setPosition,
    reset,
  };
}
