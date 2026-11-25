"use client";

import Link from "next/link";
import { Badge } from "@/components/ui";
import { getChapters, getLesson } from "@/content";
import { cn } from "@/lib/cn";
import { isRepaired, useProgress } from "@/lib/progress";
import type { ChapterId, Lesson, ProgressState } from "@/lib/types";

const CHAPTERS = getChapters();

/** One line per chapter. Counts and times come from content, never from here. */
const CHAPTER_SUMMARIES: Record<ChapterId, string> = {
  "ch-01": "The application, model and infrastructure layers, and who owns a failure.",
  "ch-02": "Tokens, scaling, post-training and the reasons a model varies or invents.",
  "ch-03": "Metrics, frozen eval sets and judges that you can defend.",
  "ch-04": "Criteria, slices and a model choice made with evidence.",
  "ch-05": "Prompt contracts, structured output and a context budget.",
  "ch-06": "Retrieval, retrieval quality and agents with stop rules.",
  "ch-07": "When to fine-tune, and the memory maths behind LoRA.",
  "ch-08": "Data quality, coverage, splits and synthetic data.",
  "ch-09": "Latency, throughput, goodput and cheaper serving.",
  "ch-10": "Guardrails, gateways, fallbacks and user feedback.",
};

export type CourseIndexProps = {
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
 * The course index, grouped by the registry chapters. A draft lesson is never
 * repaired: it shows "Writing" and links to its in-progress panel. Rows are
 * hairlines, not cards.
 */
export function CourseIndex({ className }: CourseIndexProps) {
  const { state } = useProgress();

  return (
    <section aria-labelledby="course-index-heading" className={cn(className)}>
      <h2 id="course-index-heading">Course index</h2>

      <div className="mt-6 space-y-10">
        {CHAPTERS.map((chapter) => {
          const lessons = chapter.lessonSlugs
            .map((slug) => getLesson(slug))
            .filter((lesson): lesson is Lesson => lesson !== undefined);
          const summary = CHAPTER_SUMMARIES[chapter.id];

          return (
            <section
              key={chapter.id}
              aria-labelledby={`chapter-${chapter.id}`}
              className="min-w-0"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-[var(--hairline-strong)] pb-2">
                <h3
                  id={`chapter-${chapter.id}`}
                  className="flex min-w-0 items-baseline gap-3 text-[length:var(--text-h3)]"
                >
                  <span className="[font-family:var(--font-mono-stack)] text-[length:var(--text-micro)] tabular-nums text-[var(--ink-muted)]">
                    {String(chapter.number).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 break-words">{chapter.title}</span>
                </h3>
                <span className="[font-family:var(--font-mono-stack)] text-[length:var(--text-micro)] tabular-nums text-[var(--ink-muted)]">
                  {lessons.length} {lessons.length === 1 ? "lesson" : "lessons"}
                </span>
              </div>

              {summary ? (
                <p className="mt-2 max-w-[var(--measure)] text-[length:var(--text-small)] text-[var(--ink-muted)]">
                  {summary}
                </p>
              ) : null}

              <ol className="mt-3 border-t border-[var(--hairline)]">
                {lessons.map((lesson) => {
                  const isDraft = lesson.status === "draft";
                  const repaired = !isDraft && isRepaired(state, lesson.slug);

                  return (
                    <li
                      key={lesson.slug}
                      className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-4 gap-y-1 border-b border-[var(--hairline)] py-3 sm:grid-cols-[auto_minmax(0,1fr)_auto]"
                    >
                      <span className="pt-1 [font-family:var(--font-mono-stack)] text-[length:var(--text-micro)] tabular-nums text-[var(--ink-muted)]">
                        {String(lesson.order).padStart(2, "0")}
                      </span>

                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <Link
                          href={`/lessons/${lesson.slug}`}
                          className="inline-flex min-h-11 items-center break-words [font-family:var(--font-serif-stack)] text-[length:var(--text-body)] font-semibold text-[var(--ink)] no-underline hover:underline"
                        >
                          {lesson.title}
                        </Link>
                        {isDraft ? <Badge tone="neutral">Writing</Badge> : null}
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
    </section>
  );
}
