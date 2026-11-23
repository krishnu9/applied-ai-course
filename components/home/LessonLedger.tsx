"use client";

import Link from "next/link";
import { getCourse } from "@/content";
import { cn } from "@/lib/cn";
import { useProgress } from "@/lib/progress";

const LESSONS = getCourse().lessons;

export type LessonLedgerProps = {
  className?: string;
};

function stateWord(status: string | undefined): string {
  if (status === "repaired") return "Repaired";
  if (status === "in-progress") return "In progress";
  return "Not started";
}

/**
 * The course index as a ledger: six hairline rows, not a card grid. Each row
 * pairs the lesson with its outcome, its reading time and its stored state.
 */
export function LessonLedger({ className }: LessonLedgerProps) {
  const { state } = useProgress();

  return (
    <section aria-labelledby="ledger-heading" className={cn(className)}>
      <h2 id="ledger-heading">Lessons</h2>
      <ol className="mt-4 border-t border-[var(--hairline)]">
        {LESSONS.map((lesson) => {
          const status = state.lessons[lesson.slug]?.status;
          const word = stateWord(status);

          return (
            <li
              key={lesson.slug}
              className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-4 gap-y-2 border-b border-[var(--hairline)] py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto]"
            >
              <span className="pt-1 [font-family:var(--font-mono-stack)] text-[length:var(--text-micro)] tabular-nums text-[var(--ink-muted)]">
                {String(lesson.order).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <Link
                  href={`/lessons/${lesson.slug}`}
                  className="break-words [font-family:var(--font-serif-stack)] text-[length:var(--text-h3)] font-semibold text-[var(--ink)] no-underline hover:underline"
                >
                  {lesson.title}
                </Link>
                <p className="mt-1 text-[length:var(--text-small)] text-[var(--ink-muted)]">
                  {lesson.outcome}
                </p>
              </div>
              <div className="col-start-2 flex flex-wrap items-center gap-x-4 gap-y-1 sm:col-start-3 sm:justify-end">
                <span className="[font-family:var(--font-mono-stack)] text-[length:var(--text-small)] tabular-nums">
                  {`${lesson.readingMinutes} min`}
                </span>
                <span
                  className={cn(
                    "text-[length:var(--text-small)]",
                    status === "repaired"
                      ? "text-[var(--success)]"
                      : "text-[var(--ink-muted)]",
                  )}
                >
                  {word}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
