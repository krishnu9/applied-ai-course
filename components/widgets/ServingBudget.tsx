"use client";

import { useId, useState } from "react";
import { COST_MODEL } from "@/content/cost-model";
import type { CostNumbers } from "@/lib/types";
import {
  estimateCost,
  formatP95,
  formatUsd,
  parseField,
} from "./cost";
import type { CostField, CostInputStrings } from "./cost";
import { CONTROL_LABEL, WidgetHeading, WidgetStat } from "./WidgetChrome";
import type { WidgetProps } from "./types";

const FIELDS: readonly { field: CostField; label: string; inputMode: "numeric" | "decimal" }[] = [
  { field: "requestsPerDay", label: "Requests per day", inputMode: "numeric" },
  { field: "inputTokens", label: "Input tokens", inputMode: "numeric" },
  { field: "outputTokens", label: "Output tokens", inputMode: "numeric" },
  { field: "pricePerM", label: "Price per 1M", inputMode: "decimal" },
];

const BATCH_SIZES = [1, 2, 4, 8] as const;
const CONCURRENCY = [1, 4, 16, 64] as const;

function readNumbers(inputs: CostInputStrings): CostNumbers | null {
  const requests = parseField("requestsPerDay", inputs.requestsPerDay);
  const input = parseField("inputTokens", inputs.inputTokens);
  const output = parseField("outputTokens", inputs.outputTokens);
  const price = parseField("pricePerM", inputs.pricePerM);
  if (!requests.ok || !input.ok || !output.ok || !price.ok) return null;
  return {
    requestsPerDay: requests.value,
    inputTokens: input.value,
    outputTokens: output.value,
    pricePerM: price.value,
  };
}

function firstError(inputs: CostInputStrings): string | null {
  for (const config of FIELDS) {
    const parsed = parseField(config.field, inputs[config.field]);
    if (!parsed.ok) return parsed.message;
  }
  return null;
}

/** The cost calculator plus batching and concurrency, with a throughput readout. */
export function ServingBudget({ caption }: WidgetProps) {
  const { defaults } = COST_MODEL;
  const [inputs, setInputs] = useState<CostInputStrings>({
    requestsPerDay: String(defaults.requestsPerDay),
    inputTokens: String(defaults.inputTokens),
    outputTokens: String(defaults.outputTokens),
    pricePerM: String(defaults.pricePerM),
  });
  const [batch, setBatch] = useState<(typeof BATCH_SIZES)[number]>(1);
  const [concurrency, setConcurrency] = useState<(typeof CONCURRENCY)[number]>(4);
  const baseId = useId();

  const numbers = readNumbers(inputs);
  const cost = numbers ? estimateCost(numbers, COST_MODEL) : null;
  const error = firstError(inputs);
  const throughput =
    cost && cost.p95Ms > 0 ? (concurrency * batch * 1000) / cost.p95Ms : null;

  return (
    <div className="min-w-0">
      <WidgetHeading title="Serving budget" caption={caption} />

      <fieldset className="mt-4 min-w-0 border-0 p-0">
        <legend className="text-[length:var(--text-small)] font-medium text-[var(--ink)]">
          Load
        </legend>
        <div className="mt-2 grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(170px,1fr))]">
          {FIELDS.map((config) => {
            const inputId = `${baseId}-${config.field}`;
            return (
              <div key={config.field} className="min-w-0">
                <label htmlFor={inputId} className={CONTROL_LABEL}>
                  {config.label}
                </label>
                <input
                  id={inputId}
                  type="text"
                  inputMode={config.inputMode}
                  value={inputs[config.field]}
                  onChange={(event) =>
                    setInputs((current) => ({
                      ...current,
                      [config.field]: event.target.value,
                    }))
                  }
                  autoComplete="off"
                  spellCheck={false}
                  className="mt-1 min-h-11 w-full min-w-0 rounded-[var(--radius-3)] border border-[var(--hairline-strong)] bg-[var(--bg)] px-3 [font-family:var(--font-mono-stack)] text-[var(--ink)] aria-invalid:border-[var(--danger)]"
                  aria-invalid={error ? true : undefined}
                />
              </div>
            );
          })}
          <div className="min-w-0">
            <label htmlFor={`${baseId}-batch`} className={CONTROL_LABEL}>
              Batch size
            </label>
            <select
              id={`${baseId}-batch`}
              value={batch}
              onChange={(event) =>
                setBatch(Number(event.target.value) as (typeof BATCH_SIZES)[number])
              }
              className="mt-1 block min-h-11 w-full rounded-[var(--radius-3)] border border-[var(--hairline-strong)] bg-[var(--bg)] px-2 text-[var(--ink)]"
            >
              {BATCH_SIZES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-0">
            <label htmlFor={`${baseId}-concurrency`} className={CONTROL_LABEL}>
              Concurrency
            </label>
            <select
              id={`${baseId}-concurrency`}
              value={concurrency}
              onChange={(event) =>
                setConcurrency(
                  Number(event.target.value) as (typeof CONCURRENCY)[number],
                )
              }
              className="mt-1 block min-h-11 w-full rounded-[var(--radius-3)] border border-[var(--hairline-strong)] bg-[var(--bg)] px-2 text-[var(--ink)]"
            >
              {CONCURRENCY.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      <p
        role="status"
        aria-live="polite"
        className={
          error
            ? "mt-3 text-[length:var(--text-small)] text-[var(--danger)]"
            : "sr-only"
        }
      >
        {error ?? ""}
      </p>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <WidgetStat label="Cost per 1k" value={cost ? formatUsd(cost.costPer1k) : "—"} />
        <WidgetStat
          label={`Monthly cost (${COST_MODEL.constants.daysPerMonth} days)`}
          value={cost ? formatUsd(cost.monthlyCost) : "—"}
        />
        <WidgetStat label="p95 latency" value={cost ? formatP95(cost.p95Ms) : "—"} />
        <WidgetStat
          label="Throughput"
          value={throughput === null ? "—" : `${throughput.toFixed(1)} req/s`}
        />
      </dl>

      <p className="mt-3 text-[length:var(--text-small)] text-[var(--ink-muted)]">
        Throughput is concurrency × batch size ÷ p95. Cost does not change with
        batching in this model; only the rate of served requests does.
      </p>
    </div>
  );
}
