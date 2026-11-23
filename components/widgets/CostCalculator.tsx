"use client";

import { useId, useState } from "react";
import type { CostModel } from "@/lib/types";
import { Badge, Panel } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  estimateCost,
  formatP95,
  formatUsd,
  parseField,
} from "./cost";
import type { CostField, CostInputStrings, CostParseResult } from "./cost";

export type CostCalculatorProps = {
  model: CostModel;
  caption?: string;
  className?: string;
};

type FieldConfig = {
  field: CostField;
  label: string;
  hint: string;
  inputMode: "numeric" | "decimal";
};

const FIELDS: readonly FieldConfig[] = [
  {
    field: "requestsPerDay",
    label: "Requests per day",
    hint: "Whole number, at least 1.",
    inputMode: "numeric",
  },
  {
    field: "inputTokens",
    label: "Input tokens per request",
    hint: "Whole number, at least 1.",
    inputMode: "numeric",
  },
  {
    field: "outputTokens",
    label: "Output tokens per request",
    hint: "Whole number, 0 or more.",
    inputMode: "numeric",
  },
  {
    field: "pricePerM",
    label: "Price per 1M tokens",
    hint: "USD per 1M tokens, above 0.",
    inputMode: "decimal",
  },
];

function initialInputs(model: CostModel): CostInputStrings {
  return {
    requestsPerDay: String(model.defaults.requestsPerDay),
    inputTokens: String(model.defaults.inputTokens),
    outputTokens: String(model.defaults.outputTokens),
    pricePerM: String(model.defaults.pricePerM),
  };
}

export function CostCalculator({
  model,
  caption,
  className,
}: CostCalculatorProps) {
  const [inputs, setInputs] = useState<CostInputStrings>(() =>
    initialInputs(model),
  );

  const baseId = useId();
  const titleId = `${baseId}-title`;
  const errorId = `${baseId}-error`;

  const parsedRequests = parseField("requestsPerDay", inputs.requestsPerDay);
  const parsedInput = parseField("inputTokens", inputs.inputTokens);
  const parsedOutput = parseField("outputTokens", inputs.outputTokens);
  const parsedPrice = parseField("pricePerM", inputs.pricePerM);

  const fieldResults: { field: CostField; result: CostParseResult }[] = [
    { field: "requestsPerDay", result: parsedRequests },
    { field: "inputTokens", result: parsedInput },
    { field: "outputTokens", result: parsedOutput },
    { field: "pricePerM", result: parsedPrice },
  ];

  const firstInvalid = fieldResults.find((entry) => !entry.result.ok);
  const fieldError =
    firstInvalid && !firstInvalid.result.ok
      ? { field: firstInvalid.field, message: firstInvalid.result.message }
      : null;

  const result =
    parsedRequests.ok && parsedInput.ok && parsedOutput.ok && parsedPrice.ok
      ? estimateCost(
          {
            requestsPerDay: parsedRequests.value,
            inputTokens: parsedInput.value,
            outputTokens: parsedOutput.value,
            pricePerM: parsedPrice.value,
          },
          model,
        )
      : null;

  const costPer1k = result ? formatUsd(result.costPer1k) : "—";
  const monthlyCost = result ? formatUsd(result.monthlyCost) : "—";
  const p95 = result ? formatP95(result.p95Ms) : "—";

  function updateField(field: CostField, value: string) {
    setInputs((current) => ({ ...current, [field]: value }));
  }

  return (
    <Panel
      as="section"
      labelledBy={titleId}
      className={cn("w-full max-w-full min-w-0", className)}
    >
      <div className="flex flex-wrap items-center gap-2">
        <h3 id={titleId}>Cost calculator</h3>
        <Badge tone="neutral">Sample</Badge>
      </div>
      {caption ? (
        <p className="mt-1 text-[length:var(--text-small)] text-[var(--ink-muted)] [overflow-wrap:anywhere]">
          {caption}
        </p>
      ) : null}

      <fieldset className="mt-4 min-w-0 border-0 p-0">
        <legend className="text-[length:var(--text-small)] font-medium text-[var(--ink)]">
          Inputs
        </legend>
        <div className="mt-2 grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(190px,1fr))]">
          {FIELDS.map((config) => {
            const inputId = `${baseId}-${config.field}`;
            const hintId = `${baseId}-${config.field}-hint`;
            const invalid = fieldError?.field === config.field;
            return (
              <div key={config.field} className="min-w-0">
                <label
                  htmlFor={inputId}
                  className="block text-[length:var(--text-small)] font-medium text-[var(--ink)]"
                >
                  {config.label}
                </label>
                <input
                  id={inputId}
                  type="text"
                  inputMode={config.inputMode}
                  value={inputs[config.field]}
                  onChange={(event) => {
                    updateField(config.field, event.target.value);
                  }}
                  aria-invalid={invalid ? true : undefined}
                  aria-describedby={cn(
                    hintId,
                    invalid ? errorId : undefined,
                  )}
                  autoComplete="off"
                  spellCheck={false}
                  className="mt-1 min-h-11 w-full min-w-0 rounded-[var(--radius-3)] border border-[var(--hairline-strong)] bg-[var(--bg)] px-3 [font-family:var(--font-mono-stack)] text-[var(--ink)] aria-invalid:border-[var(--danger)]"
                />
                <p
                  id={hintId}
                  className="mt-1 text-[length:var(--text-small)] text-[var(--ink-muted)] [overflow-wrap:anywhere]"
                >
                  {config.hint}
                </p>
              </div>
            );
          })}
        </div>
      </fieldset>

      <p
        id={errorId}
        role="status"
        aria-live="polite"
        className={cn(
          "[overflow-wrap:anywhere]",
          fieldError
            ? "mt-3 text-[length:var(--text-small)] text-[var(--danger)]"
            : "sr-only",
        )}
      >
        {fieldError ? fieldError.message : ""}
      </p>

      <div className="mt-4 min-w-0">
        <h4 className="text-[length:var(--text-small)] font-medium text-[var(--ink)]">
          Result
        </h4>
        <dl className="mt-2 grid gap-3 sm:grid-cols-3">
          <div className="min-w-0">
            <dt className="text-[length:var(--text-small)] text-[var(--ink-muted)]">
              Cost per 1,000 requests
            </dt>
            <dd className="mt-1 [font-family:var(--font-mono-stack)] text-[length:var(--text-h3)] [font-variant-numeric:tabular-nums] [overflow-wrap:anywhere]">
              {costPer1k}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-[length:var(--text-small)] text-[var(--ink-muted)]">
              Monthly cost ({model.constants.daysPerMonth} days)
            </dt>
            <dd className="mt-1 [font-family:var(--font-mono-stack)] text-[length:var(--text-h3)] [font-variant-numeric:tabular-nums] [overflow-wrap:anywhere]">
              {monthlyCost}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-[length:var(--text-small)] text-[var(--ink-muted)]">
              p95 latency
            </dt>
            <dd className="mt-1 [font-family:var(--font-mono-stack)] text-[length:var(--text-h3)] [font-variant-numeric:tabular-nums] [overflow-wrap:anywhere]">
              {p95}
            </dd>
          </div>
        </dl>
      </div>
    </Panel>
  );
}
