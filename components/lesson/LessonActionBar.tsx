"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, buttonStyles } from "@/components/ui";
import { cn } from "@/lib/cn";
import { formatPercent, formatSeconds, formatUsd } from "@/lib/format";
import { useProgress } from "@/lib/progress";
import type { LessonSlug, LessonSummary, SampleMetrics } from "@/lib/types";
import { deriveRepairGate, type RepairCheck } from "./repairGate";

export type LessonActionBarProps = {
  slug: LessonSlug;
  checks: readonly RepairCheck[];
  taskItemIds: readonly string[];
  next: LessonSummary | null;
  /** The repaired stage pair, or null when the lesson moves no stage. */
  declared: SampleMetrics | null;
};

function isField(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

/**
 * Phone-only sticky action bar: the repair gate and the next lesson stay one tap
 * away. It hides while a form field has focus, so it never covers a field.
 */
export function LessonActionBar({
  slug,
  checks,
  taskItemIds,
  next,
  declared,
}: LessonActionBarProps) {
  const { state, ready, repair } = useProgress();
  const gate = deriveRepairGate(state, ready, slug, checks, taskItemIds);
  const [fieldFocused, setFieldFocused] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    function handleFocusIn(event: FocusEvent): void {
      if (isField(event.target)) setFieldFocused(true);
    }
    function handleFocusOut(event: FocusEvent): void {
      if (isField(event.target)) setFieldFocused(false);
    }
    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);
    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  function handleRepair(): void {
    repair(slug);
    setAnnouncement(
      declared
        ? `Layer repaired. ${formatPercent(declared.passRate)} pass, ${formatUsd(
            declared.costPer1k,
          )} per 1k, p95 ${formatSeconds(declared.p95Ms)}.`
        : "Lesson repaired.",
    );
  }

  return (
    <div
      role="group"
      aria-label="Lesson actions"
      data-lesson-actionbar=""
      className={cn(
        "lesson-actionbar fixed inset-x-0 bottom-0 z-30 border-t border-[var(--hairline)] bg-[var(--bg)] pb-[env(safe-area-inset-bottom)] md:hidden",
        fieldFocused && "hidden",
      )}
    >
      <div className="mx-auto flex min-h-[var(--actionbar-h)] w-full max-w-[var(--main-max)] items-center gap-2 px-4 py-1">
        <Button
          className="flex-1"
          disabled={!gate.canRepair}
          onClick={handleRepair}
        >
          {gate.repaired ? "Layer repaired" : "Mark layer repaired"}
        </Button>
        <Link
          href={next ? `/lessons/${next.slug}` : "/roadmap"}
          className={cn(buttonStyles({ variant: "secondary" }), "shrink-0")}
        >
          {next ? "Next" : "Roadmap"}
        </Link>
      </div>
      <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}
