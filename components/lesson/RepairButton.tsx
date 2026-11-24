"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui";
import { useProgress } from "@/lib/progress";
import { formatPercent, formatSeconds, formatUsd } from "@/lib/format";
import type { LessonSlug, SampleMetrics } from "@/lib/types";
import { deriveRepairGate, type RepairCheck } from "./repairGate";

export type { RepairCheck };

export type RepairButtonProps = {
  slug: LessonSlug;
  layerName: string;
  checks: readonly RepairCheck[];
  taskItemIds: readonly string[];
  declared: SampleMetrics;
  /** True when the lesson moves no capstone stage. */
  announceGeneric?: boolean;
};

/** The completion gate and the repair action. */
export function RepairButton({
  slug,
  layerName,
  checks,
  taskItemIds,
  declared,
  announceGeneric = false,
}: RepairButtonProps) {
  const { state, ready, repair } = useProgress();
  const [announcement, setAnnouncement] = useState("");
  const baseId = useId();
  const headingId = `${baseId}-repair-title`;

  const { repaired, canRepair } = deriveRepairGate(
    state,
    ready,
    slug,
    checks,
    taskItemIds,
  );

  function handleRepair() {
    repair(slug);
    setAnnouncement(
      announceGeneric
        ? "Lesson repaired."
        : `Layer repaired. ${formatPercent(declared.passRate)} pass, ${formatUsd(
            declared.costPer1k,
          )} per 1k, p95 ${formatSeconds(declared.p95Ms)}.`,
    );
  }

  return (
    <section
      aria-labelledby={headingId}
      className="mt-6 min-w-0 rounded-[var(--radius-2)] border border-[var(--hairline)] bg-[var(--surface)] p-4 md:p-6"
    >
      <h3 id={headingId}>Repair this layer</h3>
      <p className="mt-1 text-[length:var(--text-small)] text-[var(--ink-muted)]">
        Layer: {layerName}
      </p>
      <Button
        className="mt-3"
        disabled={!canRepair}
        onClick={handleRepair}
      >
        {repaired ? "Layer repaired" : "Mark layer repaired"}
      </Button>
      {!canRepair && !repaired ? (
        <p className="mt-2 text-[length:var(--text-small)] text-[var(--ink-muted)]">
          Pass every check, tick all 5 steps and write a proof note.
        </p>
      ) : null}
      <p
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={
          announcement
            ? "mt-3 text-[length:var(--text-small)] text-[var(--success)]"
            : "sr-only"
        }
      >
        {announcement}
      </p>
    </section>
  );
}
