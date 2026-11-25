import Link from "next/link";
import { EXPECTED_LESSON_COUNT, getChapterForSlug } from "@/lib/course-registry";
import type { Lesson } from "@/lib/types";
import { MetaRow } from "./MetaRow";

export type LessonHeaderProps = {
  lesson: Lesson;
};

/** Breadcrumb, chapter line, H1, outcome, artifact line, meta row and terms. */
export function LessonHeader({ lesson }: LessonHeaderProps) {
  const chapter = getChapterForSlug(lesson.slug);
  const terms = lesson.terms ?? [];

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
        Lesson {lesson.order} of {EXPECTED_LESSON_COUNT}
      </p>
      {chapter ? (
        <p className="mt-1 [font-family:var(--font-mono-stack)] text-[length:var(--text-micro)] text-[var(--ink-muted)]">
          Chapter {chapter.number} · {chapter.title}
        </p>
      ) : null}
      <h1 className="mt-2 text-balance">{lesson.title}</h1>
      <p className="mt-3 max-w-[var(--measure)] [font-family:var(--font-serif-stack)] text-[length:var(--text-body)]">
        {lesson.outcome}
      </p>
      <p className="mt-2 max-w-[var(--measure)] text-[length:var(--text-small)] text-[var(--ink-muted)]">
        <span className="font-medium text-[var(--ink)]">You will leave with:</span>{" "}
        {lesson.artifact}
      </p>

      <MetaRow lesson={lesson} />

      {terms.length > 0 ? (
        <div className="mt-5 max-w-[var(--measure)] min-w-0">
          <p
            id="lesson-terms-label"
            className="[font-family:var(--font-mono-stack)] text-[length:var(--text-micro)] uppercase tracking-[var(--tracking-micro)] text-[var(--ink-muted)]"
          >
            Terms
          </p>
          <dl
            aria-labelledby="lesson-terms-label"
            className="mt-2 grid min-w-0 grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2"
          >
            {terms.map((term) => (
              <div key={term.term} className="min-w-0">
                <dt className="break-words [font-family:var(--font-mono-stack)] text-[length:var(--text-small)] font-semibold leading-snug text-[var(--ink)]">
                  {term.term}
                </dt>
                <dd className="m-0 break-words text-[length:var(--text-small)] leading-snug text-[var(--ink-muted)]">
                  {term.definition}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}
    </header>
  );
}
