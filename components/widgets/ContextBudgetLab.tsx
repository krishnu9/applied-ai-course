"use client";

import { useId, useState } from "react";
import { CONTROL_LABEL, RANGE_INPUT, WidgetHeading } from "./WidgetChrome";
import type { WidgetProps } from "./types";

const BUDGET = 8000;

const PARTS = [
  { id: "rules", label: "Rules", max: 2000, step: 100 },
  { id: "examples", label: "Examples", max: 3000, step: 100 },
  { id: "chunks", label: "Retrieved chunks", max: 4000, step: 100 },
  { id: "history", label: "History", max: 3000, step: 100 },
] as const;

type PartId = (typeof PARTS)[number]["id"];

const START: Record<PartId, number> = {
  rules: 600,
  examples: 500,
  chunks: 2400,
  history: 800,
};

/** Four token sliders against one fixed context budget. */
export function ContextBudgetLab({ caption }: WidgetProps) {
  const [values, setValues] = useState<Record<PartId, number>>(START);
  const baseId = useId();
  const total = PARTS.reduce((sum, part) => sum + values[part.id], 0);
  const scale = Math.max(total, BUDGET, 1);
  const overflow = total - BUDGET;

  return (
    <div className="min-w-0">
      <WidgetHeading title="Context budget lab" caption={caption} />

      <div className="mt-4 flex flex-col gap-4">
        {PARTS.map((part) => {
          const inputId = `${baseId}-${part.id}`;
          return (
            <div key={part.id} className="min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <label htmlFor={inputId} className={CONTROL_LABEL}>
                  {part.label}
                </label>
                <span className="[font-family:var(--font-mono-stack)] text-[length:var(--text-small)] [font-variant-numeric:tabular-nums] text-[var(--ink-muted)]">
                  {values[part.id]} tokens
                </span>
              </div>
              <input
                id={inputId}
                type="range"
                min={0}
                max={part.max}
                step={part.step}
                value={values[part.id]}
                aria-valuetext={`${values[part.id]} tokens`}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    [part.id]: Number(event.target.value),
                  }))
                }
                className={RANGE_INPUT}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-5 min-w-0">
        <p className="text-[length:var(--text-small)] text-[var(--ink-muted)]">
          Budget {BUDGET.toLocaleString("en-US")} tokens
        </p>
        <div
          aria-hidden="true"
          className="mt-2 flex h-4 w-full overflow-hidden rounded-[var(--radius-3)] border border-[var(--hairline)] bg-[var(--bg)]"
        >
          {PARTS.map((part) => (
            <span
              key={part.id}
              className={
                overflow > 0
                  ? "block h-full bg-[var(--danger)]"
                  : "block h-full bg-[var(--accent)]"
              }
              style={{ width: `${(values[part.id] / scale) * 100}%` }}
            />
          ))}
        </div>
        <p
          role="status"
          aria-live="polite"
          className={
            overflow > 0
              ? "mt-2 text-[length:var(--text-small)] text-[var(--danger)]"
              : "mt-2 text-[length:var(--text-small)] text-[var(--ink)]"
          }
        >
          {overflow > 0
            ? `Over budget by ${overflow.toLocaleString("en-US")} tokens. Cut a part or the prompt is cut for you.`
            : `${total.toLocaleString("en-US")} of ${BUDGET.toLocaleString("en-US")} tokens used.`}
        </p>
      </div>
    </div>
  );
}
