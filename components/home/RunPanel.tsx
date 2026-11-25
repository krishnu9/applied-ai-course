"use client";

import Link from "next/link";
import { Badge, Panel, ScoreValue } from "@/components/ui";
import { getEvaluationStages, scoreSummary } from "@/content";
import { cn } from "@/lib/cn";
import { formatPercent, formatSeconds, formatUsd } from "@/lib/format";
import { isRepaired, useProgress } from "@/lib/progress";

const STAGES = getEvaluationStages();
const STAGE_COUNT = STAGES.length;

export type RunPanelProps = {
  className?: string;
};

/**
 * The capstone scoreboard. The six stages carry fixed sample scores. Only a
 * repaired capstone lesson adds its stage to the run, so no other lesson can
 * move the summary. The sample-data label is always visible.
 */
export function RunPanel({ className }: RunPanelProps) {
  const { state, ready } = useProgress();

  const repairedStages = STAGES.filter((stage) =>
    isRepaired(state, stage.lessonSlug),
  );
  const metrics = scoreSummary(
    repairedStages.map((stage) => stage.lessonSlug),
  );
  const repairedCount = repairedStages.length;
  const complete = repairedCount === STAGE_COUNT;

  return (
    <Panel as="section" labelledBy="capstone-heading" className={cn(className)}>
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3 border-b border-[var(--hairline)] pb-4">
        <div className="min-w-0">
          <h2
            id="capstone-heading"
            className="[font-family:var(--font-mono-stack)] text-[length:var(--text-small)] font-medium tracking-[var(--tracking-micro)] text-[var(--ink-muted)]"
          >
            Capstone evaluation
          </h2>
          <h3 className="mt-1">Triage support tickets</h3>
        </div>
        <Badge tone={complete ? "success" : "neutral"}>
          {repairedCount} of {STAGE_COUNT} stages repaired
        </Badge>
      </div>

      <p className="mt-4 [font-family:var(--font-mono-stack)] text-[length:var(--text-small)] tabular-nums text-[var(--ink-muted)]">
        Current run:{" "}
        <ScoreValue
          value={formatPercent(metrics.passRate)}
          ready={ready}
          className="text-[var(--ink)]"
        />{" "}
        pass ·{" "}
        <ScoreValue
          value={formatUsd(metrics.costPer1k)}
          ready={ready}
          className="text-[var(--ink)]"
        />{" "}
        per 1k ·{" "}
        <ScoreValue
          value={formatSeconds(metrics.p95Ms)}
          ready={ready}
          className="text-[var(--ink)]"
        />{" "}
        p95
      </p>

      <table className="mt-4 w-full border-collapse text-left">
        <caption className="sr-only">
          Capstone stages with their fixed sample scores.
        </caption>
        <thead>
          <tr className="[font-family:var(--font-mono-stack)] text-[length:var(--text-micro)] uppercase tracking-[var(--tracking-micro)] text-[var(--ink-muted)]">
            <th scope="col" className="pb-2 pr-2 font-medium">
              Stage
            </th>
            <th scope="col" className="pb-2 pr-2 text-right font-medium">
              Pass
            </th>
            <th scope="col" className="pb-2 pr-2 text-right font-medium">
              $ / 1k
            </th>
            <th scope="col" className="pb-2 text-right font-medium">
              p95
            </th>
          </tr>
        </thead>
        <tbody>
          {STAGES.map((stage) => {
            const repaired = isRepaired(state, stage.lessonSlug);
            const tone = repaired
              ? "text-[var(--ink)]"
              : "text-[var(--ink-muted)]";

            return (
              <tr
                key={stage.id}
                className="border-t border-[var(--hairline)] align-top"
              >
                <th
                  scope="row"
                  className={cn(
                    "py-2 pr-2 text-[length:var(--text-small)] font-normal",
                    tone,
                  )}
                >
                  <Link
                    href={`/lessons/${stage.lessonSlug}`}
                    className="inline-flex flex-wrap items-baseline gap-x-2 no-underline hover:underline"
                  >
                    <span className="[font-family:var(--font-mono-stack)] text-[length:var(--text-micro)] tabular-nums text-[var(--ink-muted)]">
                      {String(stage.order).padStart(2, "0")}
                    </span>
                    <span>{stage.name}</span>
                    {repaired ? <span className="sr-only">repaired</span> : null}
                  </Link>
                </th>
                <td
                  className={cn(
                    "py-2 pr-2 text-right [font-family:var(--font-mono-stack)] text-[length:var(--text-small)] tabular-nums",
                    tone,
                  )}
                >
                  {formatPercent(stage.repaired.passRate)}
                </td>
                <td
                  className={cn(
                    "py-2 pr-2 text-right [font-family:var(--font-mono-stack)] text-[length:var(--text-small)] tabular-nums",
                    tone,
                  )}
                >
                  {formatUsd(stage.repaired.costPer1k)}
                </td>
                <td
                  className={cn(
                    "py-2 text-right [font-family:var(--font-mono-stack)] text-[length:var(--text-small)] tabular-nums",
                    tone,
                  )}
                >
                  {formatSeconds(stage.repaired.p95Ms)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <p className="mt-4 max-w-[var(--measure)] text-[length:var(--text-small)] text-[var(--ink-muted)]">
        Only the capstone lessons change the score.
      </p>

      <p className="mt-2 [font-family:var(--font-mono-stack)] text-[length:var(--text-micro)] text-[var(--ink-muted)]">
        Sample evaluation. Fixed data.
      </p>
    </Panel>
  );
}
