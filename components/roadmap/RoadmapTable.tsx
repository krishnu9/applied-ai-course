"use client";

import Link from "next/link";
import { Badge } from "@/components/ui";
import { getChapters, getLesson } from "@/content";
import { cn } from "@/lib/cn";
import { isRepaired, useProgress } from "@/lib/progress";
import type { Lesson, ProgressState } from "@/lib/types";

const CHAPTERS = getChapters();

export type RoadmapTableProps = {
  className?: string;
};

function stateWord(lesson: Lesson, state: ProgressState): string {
  if (lesson.status === "draft") return "Writing";
  const status = state.lessons[lesson.slug]?.status;
  if (status === "repaired") return "Repaired";
  if (status === "in-progress") return "In progress";
  return "Not started";
}

/**
 * All 24 lessons, grouped by chapter. Each row shows the lesson number, title,
 * outcome, time and state. A draft row is marked "Writing" and links to its
 * in-progress panel. Rows are hairlines, so they stack cleanly on a phone.
 */
export function RoadmapTable({ className }: RoadmapTableProps) {
  const { state } = useProgress();

  return (
    <div className={cn("space-y-10", className)}>
      {CHAPTERS.map((chapter) => {
        const lessons = chapter.lessonSlugs
          .map((slug) => getLesson(slug))
          .filter((lesson): lesson is Lesson => lesson !== undefined);

        return (
          <section
            key={chapter.id}
            aria-labelledby={`roadmap-${chapter.id}`}
            className="min-w-0"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-[var(--hairline-strong)] pb-2">
              <h2
                id={`roadmap-${chapter.id}`}
                className="flex min-w-0 items-baseline gap-3 text-[length:var(--text-h3)]"
              >
                <span className="[font-family:var(--font-mono-stack)] text-[length:var(--text-micro)] tabular-nums text-[var(--ink-muted)]">
                  {String(chapter.number).padStart(2, "0")}
                </span>
                <span className="min-w-0 break-words">{chapter.title}</span>
              </h2>
              <span className="[font-family:var(--font-mono-stack)] text-[length:var(--text-micro)] tabular-nums text-[var(--ink-muted)]">
                {lessons.length} {lessons.length === 1 ? "lesson" : "lessons"}
              </span>
            </div>

            <ol className="mt-3 border-t border-[var(--hairline)]">
              {lessons.map((lesson) => {
                const isDraft = lesson.status === "draft";
                const repaired = !isDraft && isRepaired(state, lesson.slug);

                return (
                  <li
                    key={lesson.slug}
                    className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-4 gap-y-2 border-b border-[var(--hairline)] py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto]"
                  >
                    <span className="pt-1 [font-family:var(--font-mono-stack)] text-[length:var(--text-micro)] tabular-nums text-[var(--ink-muted)]">
                      {String(lesson.order).padStart(2, "0")}
                    </span>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/lessons/${lesson.slug}`}
                          className="inline-flex min-h-11 items-center break-words [font-family:var(--font-serif-stack)] text-[length:var(--text-h3)] font-semibold text-[var(--ink)] no-underline hover:underline"
                        >
                          {lesson.title}
                        </Link>
                        {isDraft ? <Badge tone="neutral">Writing</Badge> : null}
                      </div>
                      <p className="mt-1 text-[length:var(--text-small)] text-[var(--ink-muted)]">
                        {lesson.outcome}
                      </p>
                    </div>

                    <div className="col-start-2 flex flex-wrap items-center gap-x-4 gap-y-1 sm:col-start-3 sm:justify-end">
                      {isDraft ? (
                        <span className="[font-family:var(--font-mono-stack)] text-[length:var(--text-small)] tabular-nums text-[var(--ink-muted)]">
                          <span aria-hidden="true">—</span>
                          <span className="sr-only">
                            Reading time not available
                          </span>
                        </span>
                      ) : (
                        <span className="[font-family:var(--font-mono-stack)] text-[length:var(--text-small)] tabular-nums">
                          {`${lesson.readingMinutes} min`}
                        </span>
                      )}
                      <span
                        className={cn(
                          "text-[length:var(--text-small)]",
                          repaired
                            ? "text-[var(--success)]"
                            : "text-[var(--ink-muted)]",
                        )}
                      >
                        {stateWord(lesson, state)}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}
    </div>
  );
}
