"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { buttonStyles } from "@/components/ui";
import { getAllLessons } from "@/content";
import { cn } from "@/lib/cn";
import { isRepaired, useProgress } from "@/lib/progress";

/** Draft lessons are never a target: the course entry opens a live lesson only. */
const LIVE_LESSONS = getAllLessons().filter(
  (lesson) => lesson.status === "live",
);
const FIRST_LIVE = LIVE_LESSONS[0] ?? null;

export type HomeActionProps = {
  className?: string;
};

/**
 * The course entry controls. Signed-out visitors get the sign-in action, which
 * carries the roadmap as the post-login target. Signed-in readers get the last
 * live lesson that is still open, then the first live lesson. The server
 * snapshot is signed out, so the first paint is stable and hydration upgrades
 * it.
 */
export function HomeAction({ className }: HomeActionProps) {
  const { state } = useProgress();
  const { user, loading } = useAuth();

  if (loading || !user) {
    return (
      <div
        role="group"
        aria-label="Course actions"
        className={cn("flex flex-col items-start gap-3", className)}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/login?next=/roadmap"
            className={buttonStyles({ variant: "primary" })}
          >
            Sign in to start
          </Link>
          <Link href="/roadmap" className={buttonStyles({ variant: "quiet" })}>
            See the roadmap
          </Link>
        </div>
      </div>
    );
  }

  const lastSlug = state.lastLessonSlug;
  const resume = lastSlug
    ? LIVE_LESSONS.find(
        (lesson) =>
          lesson.slug === lastSlug && !isRepaired(state, lesson.slug),
      )
    : undefined;

  const primary = resume ?? FIRST_LIVE;
  const primaryHref = primary
    ? `/lessons/${primary.slug}${
        resume && state.lastSectionId ? `#${state.lastSectionId}` : ""
      }`
    : "/roadmap";
  const primaryLabel = resume ? "Continue lesson" : "Start with lesson 1";
  const showStart =
    FIRST_LIVE !== null && primary !== null && primary.slug !== FIRST_LIVE.slug;

  return (
    <div
      role="group"
      aria-label="Course actions"
      className={cn("flex flex-col items-start gap-3", className)}
    >
      <div className="flex flex-wrap items-center gap-3">
        <Link href={primaryHref} className={buttonStyles({ variant: "primary" })}>
          {primaryLabel}
        </Link>
        {showStart && FIRST_LIVE ? (
          <Link
            href={`/lessons/${FIRST_LIVE.slug}`}
            className={buttonStyles({ variant: "secondary" })}
          >
            Start with lesson 1
          </Link>
        ) : null}
        <Link href="/roadmap" className={buttonStyles({ variant: "quiet" })}>
          See the roadmap
        </Link>
      </div>
      {resume ? (
        <p className="[font-family:var(--font-mono-stack)] text-[length:var(--text-small)] text-[var(--ink-muted)]">
          Resume: {resume.title}
        </p>
      ) : null}
    </div>
  );
}
