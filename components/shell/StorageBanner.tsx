"use client";

import { Button } from "@/components/ui";
import { cn } from "@/lib/cn";
import { useProgress } from "@/lib/progress";

export type StorageBannerProps = {
  className?: string;
};

/**
 * Always-mounted polite region between the header and `main`. It reports a
 * storage failure, or the account sync state for a signed-in reader. The region
 * exists before any message, so screen readers announce later changes.
 */
export function StorageBanner({ className }: StorageBannerProps) {
  const { storage, sync, user, retrySync } = useProgress();

  const isUnavailable = storage === "unavailable";
  const signedIn = user !== null;
  const isError = !isUnavailable && signedIn && sync === "error";
  const isSaving = !isUnavailable && signedIn && sync === "loading";
  const isSynced = !isUnavailable && signedIn && sync === "synced";
  const isWarning = isUnavailable || isError;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={cn(
        isWarning &&
          "border-b border-[var(--hairline)] bg-[var(--warning-bg)] text-[var(--warning)]",
        className,
      )}
    >
      {isUnavailable ? (
        <p className="mx-auto w-full max-w-[var(--main-max)] px-4 py-2 text-[length:var(--text-small)] md:px-6 lg:px-8">
          Progress cannot be saved in this browser. You can still read every lesson.
        </p>
      ) : isError ? (
        <p className="mx-auto flex w-full max-w-[var(--main-max)] flex-wrap items-center gap-x-2 px-4 py-1 text-[length:var(--text-small)] md:px-6 lg:px-8">
          <span>Could not sync.</span>
          <Button variant="quiet" size="sm" onClick={retrySync}>
            Retry
          </Button>
        </p>
      ) : isSaving ? (
        <p className="mx-auto w-full max-w-[var(--main-max)] px-4 py-2 text-[length:var(--text-small)] text-[var(--ink-muted)] md:px-6 lg:px-8">
          Saving to your account…
        </p>
      ) : isSynced ? (
        <p className="mx-auto w-full max-w-[var(--main-max)] px-4 py-2 text-[length:var(--text-small)] text-[var(--ink-muted)] md:px-6 lg:px-8">
          Progress saved to your account
        </p>
      ) : null}
    </div>
  );
}
