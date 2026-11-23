import type { LessonProgress, LessonSlug, ProgressState } from "@/lib/types";

export type StorageStatus = "ok" | "unavailable";

export const STORAGE_KEY = "lastminute.progress.v1";
export const MAX_PROOF = 280;
export const MAX_BYTES = 8192;
export const EPOCH = "1970-01-01T00:00:00.000Z";
export const ID_PATTERN = /^[a-z][a-z0-9-]{0,40}$/;
export const TICK_IDS = ["item-1", "item-2", "item-3", "item-4", "item-5"] as const;

/** null = not tested, true = usable, false = stop all storage for the session. */
let available: boolean | null = null;

const LESSON_SLUGS = [
  "evaluation",
  "prompt-contract",
  "retrieval",
  "agents",
  "fine-tuning",
  "cost",
] as const satisfies readonly LessonSlug[];

const CONTROL_CHARS = /[\u0000-\u0009\u000B-\u001F\u007F]/g;
const MAX_OPTION_ID = 64;

export interface ReadProgressResult {
  state: ProgressState;
  status: StorageStatus;
}

/** A frozen-friendly empty state. The update time defaults to the fixed epoch. */
export function createEmptyState(updatedAt: string = EPOCH): ProgressState {
  return {
    version: 1,
    lessons: {},
    lastLessonSlug: null,
    lastSectionId: null,
    updatedAt,
  };
}

export function isLessonSlug(value: unknown): value is LessonSlug {
  return typeof value === "string" && (LESSON_SLUGS as readonly string[]).includes(value);
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

function normaliseEntry(raw: Record<string, unknown>): LessonProgress {
  const status: LessonProgress["status"] =
    raw.status === "repaired" ? "repaired" : "in-progress";

  const checkAnswers: Record<string, { selectedOptionId: string }> = {};
  if (isPlainObject(raw.checkAnswers)) {
    for (const [id, answer] of Object.entries(raw.checkAnswers)) {
      if (Object.keys(checkAnswers).length >= 3) break;
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
  const taskTicks = TICK_IDS.filter((tick) => rawTicks.includes(tick));

  const proofNote =
    typeof raw.proofNote === "string" ? normaliseProofNote(raw.proofNote) : "";

  const repairedAt = isIsoString(raw.repairedAt) ? raw.repairedAt : null;

  return { status, checkAnswers, taskTicks: [...taskTicks], proofNote, repairedAt };
}

/**
 * Validate and normalise an untrusted value into a ProgressState.
 * Every rejection falls back to a safe value; this function never throws.
 */
export function normalise(value: unknown): ProgressState {
  try {
    if (!isPlainObject(value) || value.version !== 1) {
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

    return { version: 1, lessons, lastLessonSlug, lastSectionId, updatedAt };
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

export function readProgress(): ReadProgressResult {
  const storage = getStorage();
  if (!storage) {
    return {
      state: createEmptyState(),
      status: available === false ? "unavailable" : "ok",
    };
  }

  let raw: string | null;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    available = false;
    return { state: createEmptyState(), status: "unavailable" };
  }

  if (raw === null) {
    return { state: createEmptyState(), status: "ok" };
  }

  return { state: parseProgress(raw), status: "ok" };
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

export function resetProgress(): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
    available = false;
  }
}

/** Listen for cross-tab storage changes on this key. Returns an unsubscribe function. */
export function subscribeToStorage(onChange: () => void): () => void {
  if (typeof window === "undefined" || getStorage() === null) {
    return () => {};
  }
  try {
    const handler = (event: StorageEvent): void => {
      if (event.key === null || event.key === STORAGE_KEY) onChange();
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
