import Link from "next/link";
import { getChapterForSlug } from "@/lib/course-registry";
import type { LessonSlug, LessonSummary } from "@/lib/types";

export type PrevNextProps = {
  currentSlug: LessonSlug;
  prev: LessonSummary | null;
  next: LessonSummary | null;
};

const linkClass =
  "mt-1 inline-block min-h-11 [font-family:var(--font-serif-stack)] text-[length:var(--text-h3)] font-semibold text-[var(--accent)]";

const eyebrowClass =
  "[font-family:var(--font-mono-stack)] text-[length:var(--text-micro)] uppercase tracking-[var(--tracking-micro)] text-[var(--ink-muted)]";

/**
 * Previous and next lesson in course order. When the next lesson opens a new
 * chapter, the heading names that chapter.
 */
export function PrevNext({ currentSlug, prev, next }: PrevNextProps) {
  const currentChapter = getChapterForSlug(currentSlug);
  const nextChapter = next ? getChapterForSlug(next.slug) : undefined;
  const nextHeading =
    next && nextChapter && nextChapter.id !== currentChapter?.id
      ? `Next chapter: ${nextChapter.title}`
      : "Next";

  return (
    <nav
      aria-label="Lesson navigation"
      className="mt-10 grid min-w-0 gap-6 border-t border-[var(--hairline)] pt-6 sm:grid-cols-2"
    >
      <div className="min-w-0">
        <p className={eyebrowClass}>Previous</p>
        {prev ? (
          <Link href={`/lessons/${prev.slug}`} className={linkClass}>
            {prev.title}
          </Link>
        ) : (
          <p className="mt-1 text-[length:var(--text-small)] text-[var(--ink-muted)]">
            Start of the path
          </p>
        )}
      </div>

      <div className="min-w-0 sm:text-right">
        <p className={eyebrowClass}>{nextHeading}</p>
        {next ? (
          <Link href={`/lessons/${next.slug}`} className={linkClass}>
            {next.title}
          </Link>
        ) : (
          <div>
            <p className="mt-1 text-[length:var(--text-small)] text-[var(--ink-muted)]">
              End of the path
            </p>
            <Link href="/roadmap" className={linkClass}>
              Open the roadmap
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
