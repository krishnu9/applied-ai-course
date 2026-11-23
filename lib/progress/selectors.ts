import type { Lesson, LessonSlug, ProgressState } from "@/lib/types";

/** True when the lesson entry is marked repaired. */
export function isRepaired(progress: ProgressState, slug: LessonSlug): boolean {
  return progress.lessons[slug]?.status === "repaired";
}

/** True when the stored option matches the lesson's correct option. */
export function isCheckCorrect(
  lesson: Lesson,
  progress: ProgressState,
  checkId: string,
): boolean {
  const check = lesson.checks.find((candidate) => candidate.id === checkId);
  if (!check) return false;
  const answer = progress.lessons[lesson.slug]?.checkAnswers[checkId];
  return answer?.selectedOptionId === check.correctOptionId;
}

/** The completion gate: every check correct, all five ticks, a non-empty note. */
export function canRepair(lesson: Lesson, progress: ProgressState): boolean {
  const entry = progress.lessons[lesson.slug];
  if (!entry || entry.status === "repaired") return false;

  const checksCorrect = lesson.checks.every((check) =>
    isCheckCorrect(lesson, progress, check.id),
  );
  if (!checksCorrect) return false;

  const requiredTicks = lesson.task.items.map((item) => item.id);
  const allTicks =
    requiredTicks.length > 0 &&
    requiredTicks.every((tick) => entry.taskTicks.includes(tick));
  if (!allTicks) return false;

  return entry.proofNote.trim().length > 0;
}

/** Count the repaired lesson entries. */
export function repairedCount(progress: ProgressState): number {
  return Object.values(progress.lessons).filter((entry) => entry.status === "repaired").length;
}

/** The last lesson and section the reader visited, or null. */
export function resumeTarget(
  progress: ProgressState,
): { slug: LessonSlug; sectionId: string | null } | null {
  if (!progress.lastLessonSlug) return null;
  return { slug: progress.lastLessonSlug, sectionId: progress.lastSectionId };
}
