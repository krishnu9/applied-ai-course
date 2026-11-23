"use client";

import { Badge, Panel, ScoreValue } from "@/components/ui";
import { getCourse, scoreSummary } from "@/content";
import { cn } from "@/lib/cn";
import { formatPercent, formatSeconds, formatUsd } from "@/lib/format";
import { isRepaired, useProgress } from "@/lib/progress";

const LESSONS = getCourse().lessons;
const TOTAL = LESSONS.length;

export type RunPanelProps = {
  className?: string;
};

/**
 * The run scoreboard. Values come from `scoreSummary` over the repaired
 * lessons, so an empty store shows the frozen baseline. The sample-data label
 * is always visible.
 */
export function RunPanel({ className }: RunPanelProps) {
  const { state, ready } = useProgress();

  const repaired = LESSONS.filter((lesson) =>
    isRepaired(state, lesson.slug),
  ).map((lesson) => lesson.slug);
  const metrics = scoreSummary(repaired);
  const count = repaired.length;
  const isBroken = count === 0;

  return (
    <Panel as="section" labelledBy="run-heading" className={cn(className)}>
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3 border-b border-[var(--hairline)] pb-4">
        <div className="min-w-0">
          <h2
            id="run-heading"
            className="[font-family:var(--font-mono-stack)] text-[length:var(--text-micro)] font-medium uppercase tracking-[var(--tracking-micro)] text-[var(--ink-muted)]"
          >
            The run
          </h2>
          <h3 className="mt-1">Triage 40 support tickets</h3>
        </div>
        <Badge tone={isBroken ? "danger" : "success"}>
          {isBroken ? "Broken" : `${count} of ${TOTAL} layers repaired`}
        </Badge>
      </div>

      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="min-w-0">
          <dt className="text-[length:var(--text-small)] text-[var(--ink-muted)]">
            Pass rate
          </dt>
          <dd className="mt-1 [font-family:var(--font-mono-stack)] text-[length:var(--text-h2)] leading-none tabular-nums">
            <ScoreValue value={formatPercent(metrics.passRate)} ready={ready} />
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-[length:var(--text-small)] text-[var(--ink-muted)]">
            Cost per 1k requests
          </dt>
          <dd className="mt-1 [font-family:var(--font-mono-stack)] text-[length:var(--text-h2)] leading-none tabular-nums">
            <ScoreValue value={formatUsd(metrics.costPer1k)} ready={ready} />
            {" / 1k"}
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-[length:var(--text-small)] text-[var(--ink-muted)]">
            p95 latency
          </dt>
          <dd className="mt-1 [font-family:var(--font-mono-stack)] text-[length:var(--text-h2)] leading-none tabular-nums">
            <ScoreValue value={formatSeconds(metrics.p95Ms)} ready={ready} />
          </dd>
        </div>
      </dl>

      {isBroken ? (
        <p className="mt-5 max-w-[var(--measure)] text-[length:var(--text-small)] text-[var(--ink-muted)]">
          No layers repaired yet. Start with retrieval.
        </p>
      ) : null}

      <p className="mt-5 [font-family:var(--font-mono-stack)] text-[length:var(--text-micro)] text-[var(--ink-muted)]">
        Sample evaluation. Fixed data.
      </p>
    </Panel>
  );
}
