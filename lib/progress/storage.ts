import type { LessonProgress, TaskItemId, ProgressState } from "@/lib/types";
import {
  MAX_CHECKS_PER_LESSON,
  TASK_ITEM_IDS,
  isLessonSlug,
} from "@/lib/course-registry";

export { isLessonSlug };

export type StorageStatus = "ok" | "unavailable";
export type SyncIndex = Record<string, string>;

export const STORAGE_KEY = "lastminute.progress.v2";
export const LEGACY_STORAGE_KEY = "lastminute.progress.v1";
/** Safety copy of the local state taken just before the first account merge. */
export const BACKUP_KEY = "lastminute.progress.backup";
/** Per-lesson time of the last accepted local write: slug -> ISO timestamp. */
export const SYNC_INDEX_KEY = "lastminute.progress.sync-index";
export const MAX_PROOF = 280;
export const MAX_BYTES = 65536;
export const EPOCH = "1970-01-01T00:00:00.000Z";
export const ID_PATTERN = /^[a-z][a-z0-9-]{0,40}$/;

/** Compatibility alias for the dynamic tick list. */
export const TICK_IDS: readonly TaskItemId[] = TASK_ITEM_IDS;

/** null = not tested, true = usable, false = stop all storage for the session. */
let available: boolean | null = null;

const CONTROL_CHARS = /[\u0000-\u0009\u000B-\u001F\u007F]/g;
const MAX_OPTION_ID = 64;

export interface ReadProgressResult {
  state: ProgressState;
  status: StorageStatus;
}

/** A frozen-friendly empty state. The update time defaults to the fixed epoch. */
export function createEmptyState(updatedAt: string = EPOCH): ProgressState {
  return {
    version: 2,
    lessons: {},
    lastLessonSlug: null,
    lastSectionId: null,
    updatedAt,
  };
}

/** Strip control characters except a newline, then cut to the proof limit. */
export function normaliseProofNote(value: string): string {
  return value.replace(CONTROL_CHARS, "").slice(0, MAX_PROOF);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isIsoString(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return false;
  try {
    return new Date(parsed).toISOString() === value;
  } catch {
    return false;
  }
}

/** Validate one untrusted lesson entry. Shared with the remote row converter. */
export function normaliseEntry(raw: Record<string, unknown>): LessonProgress {
  const status: LessonProgress["status"] =
    raw.status === "repaired" ? "repaired" : "in-progress";

  const checkAnswers: Record<string, { selectedOptionId: string }> = {};
  if (isPlainObject(raw.checkAnswers)) {
    for (const [id, answer] of Object.entries(raw.checkAnswers)) {
      if (Object.keys(checkAnswers).length >= MAX_CHECKS_PER_LESSON) break;
      if (!ID_PATTERN.test(id) || !isPlainObject(answer)) continue;
      const selectedOptionId = answer.selectedOptionId;
      if (
        typeof selectedOptionId !== "string" ||
        selectedOptionId.length === 0 ||
        selectedOptionId.length > MAX_OPTION_ID
      ) {
        continue;
      }
      checkAnswers[id] = { selectedOptionId };
    }
  }

  const rawTicks: unknown[] = Array.isArray(raw.taskTicks) ? raw.taskTicks : [];
  const taskTicks = TASK_ITEM_IDS.filter((tick) => rawTicks.includes(tick));

  const proofNote =
    typeof raw.proofNote === "string" ? normaliseProofNote(raw.proofNote) : "";

  const repairedAt = isIsoString(raw.repairedAt) ? raw.repairedAt : null;

  return { status, checkAnswers, taskTicks: [...taskTicks], proofNote, repairedAt };
}

/**
 * Validate and normalise an untrusted value into a version 2 ProgressState.
 * A version 1 payload maps across unchanged, because every old slug still
 * exists. Every rejection falls back to a safe value; this function never throws.
 */
export function normalise(value: unknown): ProgressState {
  try {
    if (
      !isPlainObject(value) ||
      (value.version !== 1 && value.version !== 2)
    ) {
      return createEmptyState();
    }

    const lessons: Record<string, LessonProgress> = {};
    if (isPlainObject(value.lessons)) {
      for (const [key, entry] of Object.entries(value.lessons)) {
        if (!isLessonSlug(key) || !isPlainObject(entry)) continue;
        lessons[key] = normaliseEntry(entry);
      }
    }

    const lastLessonSlug = isLessonSlug(value.lastLessonSlug) ? value.lastLessonSlug : null;
    const lastSectionId =
      typeof value.lastSectionId === "string" && ID_PATTERN.test(value.lastSectionId)
        ? value.lastSectionId
        : null;
    const updatedAt = isIsoString(value.updatedAt) ? value.updatedAt : EPOCH;

    return { version: 2, lessons, lastLessonSlug, lastSectionId, updatedAt };
  } catch {
    return createEmptyState();
  }
}

function parseProgress(raw: string): ProgressState {
  try {
    return normalise(JSON.parse(raw));
  } catch {
    return createEmptyState();
  }
}

/** Return the browser storage, or null on the server and after any failure. */
function getStorage(): Storage | null {
  if (available === false) return null;
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    available = false;
    return null;
  }
}

function storageUnavailable(): boolean {
  return available === false;
}

function readKey(storage: Storage, key: string): string | null {
  try {
    return storage.getItem(key);
  } catch {
    available = false;
    return null;
  }
}

export function readProgress(): ReadProgressResult {
  const storage = getStorage();
  if (!storage) {
    return {
      state: createEmptyState(),
      status: available === false ? "unavailable" : "ok",
    };
  }

  const rawV2 = readKey(storage, STORAGE_KEY);
  if (available === false) {
    return { state: createEmptyState(), status: "unavailable" };
  }
  if (rawV2 !== null) {
    return { state: parseProgress(rawV2), status: "ok" };
  }

  const rawV1 = readKey(storage, LEGACY_STORAGE_KEY);
  if (storageUnavailable()) {
    return { state: createEmptyState(), status: "unavailable" };
  }
  if (rawV1 !== null) {
    const state = parseProgress(rawV1);
    // Write the mapped state to v2 and leave v1 untouched.
    writeProgress(state);
    return { state, status: "ok" };
  }

  return { state: createEmptyState(), status: "ok" };
}

export function writeProgress(state: ProgressState): StorageStatus {
  const storage = getStorage();
  if (!storage) {
    return available === false ? "unavailable" : "ok";
  }

  let json: string;
  try {
    json = JSON.stringify(state);
  } catch {
    return "unavailable";
  }

  let bytes: number;
  try {
    bytes = new TextEncoder().encode(json).length;
  } catch {
    bytes = json.length;
  }
  if (bytes > MAX_BYTES) {
    available = false;
    return "unavailable";
  }

  try {
    storage.setItem(STORAGE_KEY, json);
    return "ok";
  } catch {
    available = false;
    return "unavailable";
  }
}

/**
 * Reset progress by writing an empty v2 state. The version 1 key stays
 * untouched, and the empty v2 state wins on the next read.
 */
export function resetProgress(): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(
      STORAGE_KEY,
      JSON.stringify(createEmptyState(new Date().toISOString())),
    );
  } catch {
    available = false;
  }
}

/** Keep a safety copy of the local state just before an account merge. */
export function backupProgress(state: ProgressState): void {
  const storage = getStorage();
  if (!storage) return;

  let json: string;
  try {
    json = JSON.stringify(state);
  } catch {
    return;
  }

  let bytes: number;
  try {
    bytes = new TextEncoder().encode(json).length;
  } catch {
    bytes = json.length;
  }
  if (bytes > MAX_BYTES) return;

  try {
    storage.setItem(BACKUP_KEY, json);
  } catch {
    available = false;
  }
}

/** Read and validate the per-lesson local write index. Corrupt data reads as empty. */
export function readSyncIndex(): SyncIndex {
  const storage = getStorage();
  if (!storage) return {};

  const raw = readKey(storage, SYNC_INDEX_KEY);
  if (raw === null) return {};

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isPlainObject(parsed)) return {};

    const index: SyncIndex = {};
    for (const [slug, value] of Object.entries(parsed)) {
      if (isLessonSlug(slug) && isIsoString(value)) index[slug] = value;
    }
    return index;
  } catch {
    return {};
  }
}

/** Record the last accepted local write for one lesson. */
export function writeSyncIndex(slug: string, timestamp: string): void {
  if (!isLessonSlug(slug) || !isIsoString(timestamp)) return;

  const storage = getStorage();
  if (!storage) return;

  const index = readSyncIndex();
  index[slug] = timestamp;

  try {
    storage.setItem(SYNC_INDEX_KEY, JSON.stringify(index));
  } catch {
    available = false;
  }
}

function removeKey(storage: Storage, key: string): void {
  try {
    storage.removeItem(key);
  } catch {
    available = false;
  }
}

/**
 * Clear the local account footprint: an empty v2 state (which also shadows any
 * legacy v1 payload), the sync index and the pre-merge backup.
 */
export function clearProgress(): void {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.setItem(
      STORAGE_KEY,
      JSON.stringify(createEmptyState(new Date().toISOString())),
    );
  } catch {
    available = false;
  }
  removeKey(storage, SYNC_INDEX_KEY);
  removeKey(storage, BACKUP_KEY);
}

/** Listen for cross-tab storage changes on either key. Returns an unsubscribe function. */
export function subscribeToStorage(onChange: () => void): () => void {
  if (typeof window === "undefined" || getStorage() === null) {
    return () => {};
  }
  try {
    const handler = (event: StorageEvent): void => {
      if (
        event.key === null ||
        event.key === STORAGE_KEY ||
        event.key === LEGACY_STORAGE_KEY
      ) {
        onChange();
      }
    };
    window.addEventListener("storage", handler);
    return () => {
      try {
        window.removeEventListener("storage", handler);
      } catch {
        // A missing removeEventListener leaves a harmless listener behind.
      }
    };
  } catch {
    return () => {};
  }
}
