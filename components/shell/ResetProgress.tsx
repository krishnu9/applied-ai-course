"use client";

import { useState } from "react";
import { Button, LiveRegion } from "@/components/ui";
import { cn } from "@/lib/cn";
import { repairedCount, useProgress } from "@/lib/progress";

export type ResetProgressProps = {
  className?: string;
};

/**
 * Quiet reset control for `/roadmap`. Disabled until ready and at least one
 * layer is repaired. A click resets the store and fills the live region.
 */
export function ResetProgress({ className }: ResetProgressProps) {
  const { ready, state, reset } = useProgress();
  const [message, setMessage] = useState("");

  const disabled = !ready || repairedCount(state) === 0;

  function handleClick(): void {
    reset();
    setMessage("Progress reset on this device.");
  }

  return (
    <div className={cn(className)}>
      <Button
        variant="quiet"
        onClick={handleClick}
        disabled={disabled}
        aria-describedby="reset-progress-desc"
      >
        Reset progress
      </Button>
      <span id="reset-progress-desc" className="sr-only">
        This removes all saved progress on this device.
      </span>
      <LiveRegion message={message} />
    </div>
  );
}
