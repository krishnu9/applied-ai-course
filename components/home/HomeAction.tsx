"use client";

import Link from "next/link";
import { buttonStyles } from "@/components/ui";
import { getCourse } from "@/content";
import { cn } from "@/lib/cn";
import { isRepaired, useProgress } from "@/lib/progress";
import type { LessonSlug } from "@/lib/types";

const LESSONS = getCourse().lessons;
const DEFAULT_SLUG: LessonSlug = LESSONS[0]?.slug ?? "evaluation";

export type HomeActionProps = {
  className?: string;
};

/**
 * The course entry controls. The primary target follows saved progress: the
 * last visited lesson when one exists, otherwise the first unrepaired lesson,
 * otherwise lesson 1. The server snapshot is empty, so the first paint reads
 * "Start with lesson 1" and hydration upgrades it.
 */
export function HomeAction({ className }: HomeActionProps) {
  const { state } = useProgress();

  const resumeSlug = state.lastLessonSlug;
  const resumeLesson = resumeSlug
    ? LESSONS.find((lesson) => lesson.slug === resumeSlug)
    : undefined;
  const firstUnrepaired = LESSONS.find(
    (lesson) => !isRepaired(state, lesson.slug),
  );

  let href = `/lessons/${DEFAULT_SLUG}`;
  let label = "Start with lesson 1";

  if (resumeSlug) {
    const section = state.lastSectionId;
    href = `/lessons/${resumeSlug}${section ? `#${section}` : ""}`;
    label = "Resume lesson";
  } else if (firstUnrepaired) {
    href = `/lessons/${firstUnrepaired.slug}`;
  }

  return (
    <div
      role="group"
      aria-label="Course actions"
      className={cn("flex flex-col items-start gap-3", className)}
    >
      <div className="flex flex-wrap items-center gap-3">
        <Link href={href} className={buttonStyles({ variant: "primary" })}>
          {label}
        </Link>
        <Link
          href="/lessons/retrieval"
          className={buttonStyles({ variant: "secondary" })}
        >
          Fix retrieval first
        </Link>
        <Link
          href="/roadmap"
          className={buttonStyles({ variant: "quiet" })}
        >
          See the roadmap
        </Link>
      </div>
      {resumeLesson ? (
        <p className="[font-family:var(--font-mono-stack)] text-[length:var(--text-small)] text-[var(--ink-muted)]">
          Resume: {resumeLesson.title}
        </p>
      ) : null}
    </div>
  );
}
