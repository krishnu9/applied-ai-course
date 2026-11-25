import { getChapterForSlug } from "@/lib/course-registry";
import type { Difficulty, Lesson } from "@/lib/types";

export type MetaRowProps = {
  lesson: Lesson;
};

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  starter: "Starter",
  core: "Core",
  advanced: "Advanced",
};

/** Read time, difficulty and chapter position for the lesson header. */
export function MetaRow({ lesson }: MetaRowProps) {
  const chapter = getChapterForSlug(lesson.slug);
  const chapterPosition = chapter
    ? chapter.lessonSlugs.indexOf(lesson.slug) + 1
    : null;
  const chapterLabel =
    chapter && chapterPosition !== null
      ? `Chapter ${chapter.number} · ${chapter.title} · Lesson ${chapterPosition} of ${chapter.lessonSlugs.length}`
      : null;

  return (
    <ul className="mt-4 flex min-w-0 list-none flex-wrap gap-x-4 gap-y-1 p-0 text-[length:var(--text-small)] text-[var(--ink-muted)]">
      {chapterLabel ? (
        <>
          <li>{chapterLabel}</li>
          <li aria-hidden="true">·</li>
        </>
      ) : null}
      <li>About {lesson.readingMinutes} minutes</li>
      <li aria-hidden="true">·</li>
      <li>{DIFFICULTY_LABELS[lesson.difficulty]}</li>
    </ul>
  );
}
