"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui";
import { CONTROL_LABEL, WidgetHeading } from "./WidgetChrome";
import type { WidgetProps } from "./types";

const STEPS = [
  { id: "plan", label: "Plan the step" },
  { id: "search", label: "Call search_tickets" },
  { id: "read", label: "Read the top ticket" },
  { id: "draft", label: "Draft a reply" },
  { id: "stop", label: "Stop and return the result" },
] as const;

const ERROR_REASON = "Stopped: the tool failed after one retry.";
const BUDGET_REASON = "Stopped: the step budget is spent.";
const DONE_REASON = "Stopped: the agent returned its result.";

/** A fixed agent loop with a step budget and one injectable tool error. */
export function AgentTrace({ caption }: WidgetProps) {
  const [index, setIndex] = useState(0);
  const [budget, setBudget] = useState(5);
  const [injectError, setInjectError] = useState(false);
  const [stopReason, setStopReason] = useState<string | null>(null);
  const baseId = useId();
  const errorId = `${baseId}-error`;
  const budgetId = `${baseId}-budget`;
  const current = STEPS[index];
  const failedIndex = stopReason === ERROR_REASON ? index - 1 : -1;

  function step(): void {
    if (stopReason || !current) return;
    if (current.id === "search" && injectError) {
      setIndex(index + 1);
      setStopReason(ERROR_REASON);
      return;
    }
    const next = index + 1;
    setIndex(next);
    if (next >= budget) setStopReason(BUDGET_REASON);
    else if (next >= STEPS.length) setStopReason(DONE_REASON);
  }

  function reset(): void {
    setIndex(0);
    setStopReason(null);
  }

  function statusOf(position: number): string {
    if (position < index) return position === failedIndex ? "failed" : "done";
    if (position === index && !stopReason) return "next";
    return "pending";
  }

  return (
    <div className="min-w-0">
      <WidgetHeading title="Agent trace" caption={caption} />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button onClick={step} disabled={stopReason !== null}>
          Step
        </Button>
        <Button variant="secondary" onClick={reset}>
          Reset
        </Button>
        <label
          htmlFor={errorId}
          className="flex min-h-11 cursor-pointer items-center gap-2 text-[length:var(--text-small)] text-[var(--ink)]"
        >
          <input
            id={errorId}
            type="checkbox"
            checked={injectError}
            onChange={(event) => setInjectError(event.target.checked)}
            className="h-4 w-4 accent-[var(--accent)]"
          />
          Inject tool error
        </label>
        <label htmlFor={budgetId} className={CONTROL_LABEL}>
          Step budget
          <select
            id={budgetId}
            value={budget}
            onChange={(event) => setBudget(Number(event.target.value))}
            className="mt-1 block min-h-11 w-full rounded-[var(--radius-3)] border border-[var(--hairline-strong)] bg-[var(--bg)] px-2 text-[var(--ink)]"
          >
            {STEPS.map((_, position) => (
              <option key={position + 1} value={position + 1}>
                {position + 1}
              </option>
            ))}
          </select>
        </label>
      </div>

      <ol className="mt-4 flex list-none flex-col gap-2 p-0">
        {STEPS.map((item, position) => (
          <li
            key={item.id}
            className="flex min-w-0 items-baseline gap-2 text-[length:var(--text-small)]"
          >
            <span className="[font-family:var(--font-mono-stack)] text-[var(--ink-muted)]">
              {position + 1}
            </span>
            <span className="min-w-0 text-[var(--ink)]">{item.label}</span>
            <span className="[font-family:var(--font-mono-stack)] text-[length:var(--text-micro)] uppercase tracking-[var(--tracking-micro)] text-[var(--ink-muted)]">
              {statusOf(position)}
            </span>
          </li>
        ))}
      </ol>

      <p
        role="status"
        aria-live="polite"
        className="mt-3 [font-family:var(--font-mono-stack)] text-[length:var(--text-small)] text-[var(--ink)]"
      >
        {stopReason ?? "Running. Press Step."}
      </p>
    </div>
  );
}
