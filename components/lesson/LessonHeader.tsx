import Link from "next/link";
import type { Lesson } from "@/lib/types";

export type LessonHeaderProps = {
  lesson: Lesson;
};

/** Breadcrumb, H1, outcome sentence and artifact line. */
export function LessonHeader({ lesson }: LessonHeaderProps) {
  return (
    <header className="min-w-0">
      <nav aria-label="Breadcrumb">
        <ol className="flex min-w-0 list-none flex-wrap items-center gap-2 p-0 text-[length:var(--text-small)] text-[var(--ink-muted)]">
          <li>
            <Link href="/" className="inline-flex min-h-11 items-center">
              Course
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <span aria-current="page">Lesson {lesson.order}</span>
          </li>
        </ol>
      </nav>

      <p className="mt-4 [font-family:var(--font-mono-stack)] text-[length:var(--text-micro)] uppercase tracking-[var(--tracking-micro)] text-[var(--ink-muted)]">
        Lesson {lesson.order} of 6
      </p>
      <h1 className="mt-1 text-balance">{lesson.title}</h1>
      <p className="mt-3 max-w-[var(--measure)] [font-family:var(--font-serif-stack)] text-[length:var(--text-body)]">
        {lesson.outcome}
      </p>
      <p className="mt-2 max-w-[var(--measure)] text-[length:var(--text-small)] text-[var(--ink-muted)]">
        <span className="font-medium text-[var(--ink)]">You will leave with:</span>{" "}
        {lesson.artifact}
      </p>
    </header>
  );
}
