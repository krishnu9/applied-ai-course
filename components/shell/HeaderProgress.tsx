"use client";

import { getCourse } from "@/content";
import { cn } from "@/lib/cn";
import { isRepaired, useProgress } from "@/lib/progress";

export type HeaderProgressProps = {
  className?: string;
};

/** Live lessons only: a draft lesson cannot be repaired. */
const LIVE_SLUGS = getCourse().lessons.map((lesson) => lesson.slug);
const TOTAL = LIVE_SLUGS.length;

/**
 * Shows the repaired lesson count. At 768 px and above the full sentence is
 * visible; below it the compact `N/M` shows and the full sentence stays
 * available to assistive technology. No live region: the first hydrate would
 * announce it.
 */
export function HeaderProgress({ className }: HeaderProgressProps) {
  const { state } = useProgress();
  const count = LIVE_SLUGS.filter((slug) => isRepaired(state, slug)).length;
  const sentence = `${count} of ${TOTAL} lessons`;

  return (
    <span
      className={cn(
        "[font-family:var(--font-mono-stack)] text-[length:var(--text-small)] tabular-nums text-[var(--ink-muted)]",
        className,
      )}
    >
      <span className="hidden md:inline">{sentence}</span>
      <span className="md:hidden" aria-hidden="true">
        {count}/{TOTAL}
      </span>
      <span className="sr-only md:hidden">{sentence}</span>
    </span>
  );
}
