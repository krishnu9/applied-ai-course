import type { LessonProgress, LessonSlug, ProgressState, TaskItemId } from "@/lib/types";
import {
  EPOCH,
  ID_PATTERN,
  TICK_IDS,
  createEmptyState,
  isLessonSlug,
  normaliseProofNote,
  readProgress,
  resetProgress,
  subscribeToStorage,
  writeProgress,
  type StorageStatus,
} from "./storage";

export type ProgressSnapshot = Readonly<{
  state: ProgressState;
  ready: boolean;
  storage: StorageStatus;
}>;

export type ProgressStore = {
  getSnapshot(): ProgressSnapshot;
  subscribe(listener: () => void): () => void;
  hydrate(): void;
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
};

export const EMPTY_SNAPSHOT: ProgressSnapshot = Object.freeze(EMPTY_SNAPSHOT_VALUE);

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
  return (TICK_IDS as readonly string[]).includes(value);
}

function statesEqual(a: ProgressState, b: ProgressState): boolean {
  return a === b || JSON.stringify(a) === JSON.stringify(b);
}

export function createStore(initial: ProgressSnapshot): ProgressStore {
  let snapshot: ProgressSnapshot = initial;
  let hydrated = false;
  const listeners = new Set<() => void>();

  function emit(): void {
    for (const listener of [...listeners]) listener();
  }

  function publish(next: ProgressSnapshot): void {
    snapshot = Object.freeze(next);
    emit();
  }

  /** Persist one accepted state, then publish it. The action writes once. */
  function commit(state: ProgressState): void {
    const storage = writeProgress(state);
    publish({ state, ready: snapshot.ready, storage });
  }

  function commitEntry(slug: LessonSlug, entry: LessonProgress): void {
    commit({
      ...snapshot.state,
      lessons: { ...snapshot.state.lessons, [slug]: entry },
      updatedAt: now(),
    });
  }

  function handleStorageChange(): void {
    const { state, status } = readProgress();
    if (status === snapshot.storage && statesEqual(state, snapshot.state)) return;
    publish({ state, ready: true, storage: status });
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
    snapshot = Object.freeze<ProgressSnapshot>({ state, ready: true, storage: status });
    subscribeToStorage(handleStorageChange);
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
    commit({
      ...snapshot.state,
      lessons: { ...snapshot.state.lessons, [slug]: nextEntry },
      lastLessonSlug: slug,
      lastSectionId: null,
      updatedAt: timestamp,
    });
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
    if (!existing && Object.keys(answers).length >= 3) return;
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

    const taskTicks = TICK_IDS.filter((tick) => ticks.has(tick));
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
  }

  function reset(): void {
    if (!snapshot.ready) return;
    resetProgress();
    snapshot = Object.freeze<ProgressSnapshot>({
      state: createEmptyState(now()),
      ready: snapshot.ready,
      storage: snapshot.storage,
    });
    emit();
  }

  return {
    getSnapshot,
    subscribe,
    hydrate,
    repair,
    setCheck,
    toggleTask,
    setProof,
    setPosition,
    reset,
  };
}
