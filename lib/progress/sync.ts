import type { LessonProgress, LessonSlug, ProgressState, TaskItemId } from "@/lib/types";
import { TASK_ITEM_IDS } from "@/lib/course-registry";
import type {
  LessonRowPayload,
  MetaRowPayload,
  RemoteLessonRow,
  RemoteMetaRow,
} from "./remote";
import {
  EPOCH,
  ID_PATTERN,
  normaliseEntry,
  normaliseProofNote,
  isLessonSlug,
  type SyncIndex,
} from "./storage";

/**
 * Pure progress merge and row conversion. No storage, no network, no throw:
 * the store owns side effects, this module only decides the merged state.
 */

export interface LessonUpload {
  slug: LessonSlug;
  entry: LessonProgress;
}

export interface MergeResult {
  /** The local-plus-remote state to write and publish. */
  state: ProgressState;
  /** Lessons that are only local or newer locally, so they must be pushed. */
  lessonUploads: LessonUpload[];
  /** The meta row to push, or null when the remote position already wins. */
  metaUpload: MetaRowPayload | null;
}

/** Convert one remote row into a validated local entry. */
export function rowToEntry(row: RemoteLessonRow): LessonProgress {
  return normaliseEntry({
    status: row.status,
    checkAnswers: row.check_answers,
    taskTicks: row.task_ticks,
    proofNote: row.proof_note,
    repairedAt: row.repaired_at,
  });
}

/** Convert one local entry into the fields of a remote row. */
export function entryToRowPayload(
  slug: LessonSlug,
  entry: LessonProgress,
): LessonRowPayload {
  return {
    lesson_slug: slug,
    status: entry.status,
    check_answers: entry.checkAnswers,
    task_ticks: [...entry.taskTicks],
    proof_note: normaliseProofNote(entry.proofNote),
    repaired_at: entry.repairedAt,
  };
}

/** Convert the local position into the fields of the meta row. */
export function entryToMetaPayload(state: ProgressState): MetaRowPayload {
  return {
    last_lesson_slug: state.lastLessonSlug,
    last_section_id: state.lastSectionId,
  };
}

function parseTime(value: string | null | undefined): number {
  if (typeof value !== "string") return 0;
  const ms = Date.parse(value);
  return Number.isNaN(ms) ? 0 : ms;
}

function toIso(ms: number): string {
  return new Date(ms).toISOString();
}

/** The earliest valid timestamp, normalised to ISO; null when none is valid. */
function earliestRepairedAt(
  local: string | null,
  remote: string | null,
): string | null {
  let bestMs = Number.POSITIVE_INFINITY;
  for (const value of [local, remote]) {
    if (typeof value !== "string") continue;
    const ms = Date.parse(value);
    if (!Number.isNaN(ms) && ms < bestMs) bestMs = ms;
  }
  return Number.isFinite(bestMs) ? toIso(bestMs) : null;
}

/** Newest valid timestamp, normalised to ISO; the fixed epoch when none is valid. */
function newestTimestamp(values: readonly (string | null | undefined)[]): string {
  let bestMs = parseTime(EPOCH);
  for (const value of values) {
    if (typeof value !== "string") continue;
    const ms = Date.parse(value);
    if (!Number.isNaN(ms) && ms >= bestMs) bestMs = ms;
  }
  return toIso(bestMs);
}

function mergeTicks(
  local: readonly TaskItemId[],
  remote: readonly TaskItemId[],
): TaskItemId[] {
  const union = new Set<TaskItemId>([...local, ...remote]);
  return TASK_ITEM_IDS.filter((tick) => union.has(tick));
}

function answersEqual(
  left: LessonProgress["checkAnswers"],
  right: LessonProgress["checkAnswers"],
): boolean {
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  if (leftKeys.length !== rightKeys.length) return false;
  return leftKeys.every(
    (key) => right[key]?.selectedOptionId === left[key]?.selectedOptionId,
  );
}

function entriesEqual(left: LessonProgress, right: LessonProgress): boolean {
  return (
    left.status === right.status &&
    left.repairedAt === right.repairedAt &&
    left.proofNote === right.proofNote &&
    left.taskTicks.length === right.taskTicks.length &&
    left.taskTicks.every((tick) => right.taskTicks.includes(tick)) &&
    answersEqual(left.checkAnswers, right.checkAnswers)
  );
}

function validSectionId(value: string | null): string | null {
  return value !== null && ID_PATTERN.test(value) ? value : null;
}

/**
 * Merge local progress with the account at first sign-in or a later re-attach.
 *
 * Rules:
 * - a repaired lesson wins, and keeps the earliest `repairedAt`;
 * - task ticks are a union, filtered against the lesson's item ids;
 * - check answers and the note are last-write-wins by the local sync index
 *   against the row `updated_at`;
 * - only-local lessons are uploaded, only-remote lessons are adopted;
 * - position and last lesson follow the newer `updatedAt`.
 */
export function mergeProgress(
  local: ProgressState,
  remoteRows: readonly RemoteLessonRow[],
  remoteMeta: RemoteMetaRow | null,
  localSyncIndex: SyncIndex,
): MergeResult {
  const remoteBySlug = new Map<string, RemoteLessonRow>();
  for (const row of remoteRows) {
    if (isLessonSlug(row.lesson_slug)) remoteBySlug.set(row.lesson_slug, row);
  }

  const slugs = new Set<string>([
    ...Object.keys(local.lessons),
    ...remoteBySlug.keys(),
  ]);

  const lessons: Record<string, LessonProgress> = {};
  const lessonUploads: LessonUpload[] = [];

  for (const slug of slugs) {
    if (!isLessonSlug(slug)) continue;

    const localEntry = local.lessons[slug];
    const remoteRow = remoteBySlug.get(slug);

    if (!remoteRow) {
      if (localEntry) {
        lessons[slug] = localEntry;
        lessonUploads.push({ slug, entry: localEntry });
      }
      continue;
    }

    const remoteEntry = rowToEntry(remoteRow);

    if (!localEntry) {
      lessons[slug] = remoteEntry;
      continue;
    }

    const localNewer =
      parseTime(localSyncIndex[slug]) > parseTime(remoteRow.updated_at);

    const merged: LessonProgress = {
      status:
        localEntry.status === "repaired" || remoteEntry.status === "repaired"
          ? "repaired"
          : "in-progress",
      checkAnswers: localNewer ? localEntry.checkAnswers : remoteEntry.checkAnswers,
      taskTicks: mergeTicks(localEntry.taskTicks, remoteEntry.taskTicks),
      proofNote: localNewer ? localEntry.proofNote : remoteEntry.proofNote,
      repairedAt: earliestRepairedAt(localEntry.repairedAt, remoteEntry.repairedAt),
    };

    lessons[slug] = merged;
    if (!entriesEqual(merged, remoteEntry)) {
      lessonUploads.push({ slug, entry: merged });
    }
  }

  const remotePosition = remoteMeta
    ? {
        lastLessonSlug: isLessonSlug(remoteMeta.last_lesson_slug)
          ? remoteMeta.last_lesson_slug
          : null,
        lastSectionId: validSectionId(remoteMeta.last_section_id),
        updatedAt: remoteMeta.updated_at,
      }
    : null;

  const localPositionWins =
    remotePosition === null ||
    parseTime(local.updatedAt) > parseTime(remotePosition.updatedAt);

  const position = localPositionWins
    ? { lastLessonSlug: local.lastLessonSlug, lastSectionId: local.lastSectionId }
    : {
        lastLessonSlug: remotePosition.lastLessonSlug,
        lastSectionId: remotePosition.lastSectionId,
      };

  let metaUpload: MetaRowPayload | null = null;
  if (localPositionWins) {
    const hasPosition =
      position.lastLessonSlug !== null || position.lastSectionId !== null;
    const differs =
      remotePosition === null ||
      remotePosition.lastLessonSlug !== position.lastLessonSlug ||
      remotePosition.lastSectionId !== position.lastSectionId;
    if (differs && (hasPosition || remotePosition !== null)) {
      metaUpload = {
        last_lesson_slug: position.lastLessonSlug,
        last_section_id: position.lastSectionId,
      };
    }
  }

  const updatedAt = newestTimestamp([
    local.updatedAt,
    remotePosition?.updatedAt ?? null,
    ...remoteRows.map((row) => row.updated_at),
  ]);

  return {
    state: {
      version: 2,
      lessons,
      lastLessonSlug: position.lastLessonSlug,
      lastSectionId: position.lastSectionId,
      updatedAt,
    },
    lessonUploads,
    metaUpload,
  };
}
