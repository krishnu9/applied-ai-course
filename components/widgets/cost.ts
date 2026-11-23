import type { CostModel, CostNumbers, CostResult } from "@/lib/types";

export { formatSeconds, formatUsd } from "@/lib/format";

export type CostField = keyof CostNumbers;
export type CostInputStrings = Record<CostField, string>;

export type CostParseResult =
  | { ok: true; value: number }
  | { ok: false; message: string };

const FIELD_MESSAGES: Record<CostField, string> = {
  requestsPerDay: "Enter at least 1 request.",
  inputTokens: "Enter at least 1 input token.",
  outputTokens: "Enter 0 or more output tokens.",
  pricePerM: "Enter a price above 0.",
};

const NUMBER_PATTERN = /^\d+(\.\d+)?$/;

/**
 * Parse one text field. Accepts plain digits with an optional decimal part.
 * A sign, exponent, comma, inner space or letter is invalid.
 */
export function parseField(field: CostField, raw: string): CostParseResult {
  const trimmed = raw.trim();
  const message = FIELD_MESSAGES[field];

  if (trimmed === "" || !NUMBER_PATTERN.test(trimmed)) {
    return { ok: false, message };
  }

  const value = Number(trimmed);
  if (!Number.isFinite(value)) {
    return { ok: false, message };
  }

  switch (field) {
    case "requestsPerDay":
      if (!Number.isInteger(value) || value < 1) {
        return { ok: false, message };
      }
      break;
    case "inputTokens":
      if (!Number.isInteger(value) || value < 1) {
        return { ok: false, message };
      }
      break;
    case "outputTokens":
      if (!Number.isInteger(value) || value < 0) {
        return { ok: false, message };
      }
      break;
    case "pricePerM":
      if (value <= 0) {
        return { ok: false, message };
      }
      break;
  }

  return { ok: true, value };
}

/**
 * Compute the fixed cost model with full precision. Any invalid number
 * returns null. The function never rounds.
 */
export function estimateCost(
  inputs: CostNumbers,
  model: CostModel,
): CostResult | null {
  if (!Number.isInteger(inputs.requestsPerDay) || inputs.requestsPerDay < 1) {
    return null;
  }
  if (!Number.isInteger(inputs.inputTokens) || inputs.inputTokens < 1) {
    return null;
  }
  if (!Number.isInteger(inputs.outputTokens) || inputs.outputTokens < 0) {
    return null;
  }
  if (!Number.isFinite(inputs.pricePerM) || inputs.pricePerM <= 0) {
    return null;
  }

  const costPerRequest =
    ((inputs.inputTokens + inputs.outputTokens) * inputs.pricePerM) / 1_000_000;
  const costPer1k = costPerRequest * 1_000;
  const monthlyCost =
    costPerRequest * inputs.requestsPerDay * model.constants.daysPerMonth;
  const p95Ms =
    model.constants.retrievalMs +
    inputs.inputTokens * model.constants.prefillMsPerToken +
    inputs.outputTokens * model.constants.decodeMsPerToken;

  const result: CostResult = { costPerRequest, costPer1k, monthlyCost, p95Ms };
  const finite =
    Number.isFinite(costPerRequest) &&
    Number.isFinite(costPer1k) &&
    Number.isFinite(monthlyCost) &&
    Number.isFinite(p95Ms);

  return finite ? result : null;
}

/** Format the widget p95 value with two decimals. 2400 -> "2.40 s". */
export function formatP95(ms: number): string {
  return `${(ms / 1000).toFixed(2)} s`;
}
