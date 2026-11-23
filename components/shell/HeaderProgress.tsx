"use client";

import { getCourse } from "@/content";
import { cn } from "@/lib/cn";
import { repairedCount, useProgress } from "@/lib/progress";

export type HeaderProgressProps = {
  className?: string;
};

const TOTAL = getCourse().lessons.length;

/**
 * Shows the repaired count. At 768 px and above the full sentence is visible;
 * below it the compact `N/6` shows and the full sentence is available to
 * assistive technology. No live region: the first hydrate would announce it.
 */
export function HeaderProgress({ className }: HeaderProgressProps) {
  const { state } = useProgress();
  const count = repairedCount(state);

  return (
    <span
      className={cn(
        "[font-family:var(--font-mono-stack)] text-[length:var(--text-small)] tabular-nums text-[var(--ink-muted)]",
        className,
      )}
    >
      <span className="hidden md:inline">
        {count} of {TOTAL} layers repaired
      </span>
      <span className="md:hidden" aria-hidden="true">
        {count}/{TOTAL}
      </span>
      <span className="sr-only md:hidden">
        {count} of {TOTAL} layers repaired
      </span>
    </span>
  );
}
