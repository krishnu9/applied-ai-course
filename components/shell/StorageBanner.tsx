"use client";

import { cn } from "@/lib/cn";
import { useProgress } from "@/lib/progress";

export type StorageBannerProps = {
  className?: string;
};

/**
 * Always-mounted polite region between the header and `main`. It holds the
 * message only when storage failed after mount, so the region exists before the
 * message and no dismiss control is offered.
 */
export function StorageBanner({ className }: StorageBannerProps) {
  const { storage } = useProgress();
  const isUnavailable = storage === "unavailable";

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={cn(
        isUnavailable &&
          "border-b border-[var(--hairline)] bg-[var(--warning-bg)] text-[var(--warning)]",
        className,
      )}
    >
      {isUnavailable ? (
        <p className="mx-auto w-full max-w-[var(--main-max)] px-4 py-2 text-[length:var(--text-small)] md:px-6 lg:px-8">
          Progress cannot be saved in this browser. You can still read every lesson.
        </p>
      ) : null}
    </div>
  );
}
