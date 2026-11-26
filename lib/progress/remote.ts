import type { SupabaseClient } from "@supabase/supabase-js";
import { EPOCH } from "./storage";

/**
 * The remote adapter. It reads and writes the two progress tables with the
 * browser Supabase client. Every function returns a typed result and never
 * throws into the UI; callers decide how to show a failure.
 */

/** One row of `lesson_progress`, snake_case as stored, after validation. */
export interface RemoteLessonRow {
  lesson_slug: string;
  status: "in-progress" | "repaired";
  check_answers: Record<string, unknown>;
  task_ticks: string[];
  proof_note: string;
  repaired_at: string | null;
  updated_at: string;
}

/** The user's single `progress_meta` row, after validation. */
export interface RemoteMetaRow {
  last_lesson_slug: string | null;
  last_section_id: string | null;
  updated_at: string;
}

export interface RemoteSnapshot {
  rows: RemoteLessonRow[];
  meta: RemoteMetaRow | null;
}

export type RemoteResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

/** The fields written for one lesson row. `user_id` is added by the adapter. */
export interface LessonRowPayload {
  lesson_slug: string;
  status: "in-progress" | "repaired";
  check_answers: Record<string, { selectedOptionId: string }>;
  task_ticks: string[];
  proof_note: string;
  repaired_at: string | null;
}

/** The fields written for the meta row. `user_id` is added by the adapter. */
export interface MetaRowPayload {
  last_lesson_slug: string | null;
  last_section_id: string | null;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

function asStringOrNull(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function parseLessonRow(value: unknown): RemoteLessonRow | null {
  if (!isPlainObject(value)) return null;
  if (typeof value.lesson_slug !== "string") return null;

  return {
    lesson_slug: value.lesson_slug,
    status: value.status === "repaired" ? "repaired" : "in-progress",
    check_answers: isPlainObject(value.check_answers) ? value.check_answers : {},
    task_ticks: Array.isArray(value.task_ticks)
      ? value.task_ticks.filter((tick): tick is string => typeof tick === "string")
      : [],
    proof_note: asString(value.proof_note, ""),
    repaired_at: asStringOrNull(value.repaired_at),
    updated_at: asString(value.updated_at, EPOCH),
  };
}

function parseMetaRow(value: unknown): RemoteMetaRow | null {
  if (!isPlainObject(value)) return null;

  return {
    last_lesson_slug: asStringOrNull(value.last_lesson_slug),
    last_section_id: asStringOrNull(value.last_section_id),
    updated_at: asString(value.updated_at, EPOCH),
  };
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (isPlainObject(error) && typeof error.message === "string") {
    return error.message;
  }
  return "Progress sync failed.";
}

function fail<T>(error: unknown): RemoteResult<T> {
  return { ok: false, error: errorMessage(error) };
}

/** Fetch every lesson row and the meta row for one signed-in user. */
export async function fetchProgress(
  client: SupabaseClient,
  userId: string,
): Promise<RemoteResult<RemoteSnapshot>> {
  try {
    const lessons = await client
      .from("lesson_progress")
      .select(
        "lesson_slug,status,check_answers,task_ticks,proof_note,repaired_at,updated_at",
      )
      .eq("user_id", userId);

    if (lessons.error) return fail(lessons.error);

    const meta = await client
      .from("progress_meta")
      .select("last_lesson_slug,last_section_id,updated_at")
      .eq("user_id", userId)
      .maybeSingle();

    if (meta.error) return fail(meta.error);

    const rows = Array.isArray(lessons.data)
      ? lessons.data
          .map(parseLessonRow)
          .filter((row): row is RemoteLessonRow => row !== null)
      : [];

    return {
      ok: true,
      data: { rows, meta: parseMetaRow(meta.data) },
    };
  } catch (error: unknown) {
    return fail(error);
  }
}

/** Insert or update one lesson row for the user. */
export async function upsertLesson(
  client: SupabaseClient,
  userId: string,
  payload: LessonRowPayload,
): Promise<RemoteResult<null>> {
  try {
    const { error } = await client
      .from("lesson_progress")
      .upsert(
        { user_id: userId, ...payload },
        { onConflict: "user_id,lesson_slug" },
      );
    return error ? fail(error) : { ok: true, data: null };
  } catch (error: unknown) {
    return fail(error);
  }
}

/** Insert or update the user's meta row. */
export async function upsertMeta(
  client: SupabaseClient,
  userId: string,
  payload: MetaRowPayload,
): Promise<RemoteResult<null>> {
  try {
    const { error } = await client
      .from("progress_meta")
      .upsert({ user_id: userId, ...payload }, { onConflict: "user_id" });
    return error ? fail(error) : { ok: true, data: null };
  } catch (error: unknown) {
    return fail(error);
  }
}

/** Delete every progress row for the user. Both tables are attempted. */
export async function deleteProgress(
  client: SupabaseClient,
  userId: string,
): Promise<RemoteResult<null>> {
  try {
    const lessons = await client
      .from("lesson_progress")
      .delete()
      .eq("user_id", userId);
    const meta = await client
      .from("progress_meta")
      .delete()
      .eq("user_id", userId);

    if (lessons.error) return fail(lessons.error);
    if (meta.error) return fail(meta.error);
    return { ok: true, data: null };
  } catch (error: unknown) {
    return fail(error);
  }
}
