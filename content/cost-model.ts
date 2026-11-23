import type { CostModel } from "@/lib/types";
import { deepFreeze } from "./freeze";

/**
 * Canonical cost model. Fixed sample data.
 *
 * costPerRequest = (input + output) * pricePerM / 1_000_000
 * costPer1k      = costPerRequest * 1_000
 * monthlyCost    = costPerRequest * requestsPerDay * daysPerMonth
 * p95Ms          = retrievalMs + input * prefillMsPerToken + output * decodeMsPerToken
 */
export const COST_MODEL: CostModel = deepFreeze({
  defaults: {
    requestsPerDay: 10000,
    inputTokens: 1000,
    outputTokens: 250,
    pricePerM: 0.75,
  },
  constants: {
    retrievalMs: 400,
    prefillMsPerToken: 0.6,
    decodeMsPerToken: 5.6,
    daysPerMonth: 30,
  },
  expected: {
    costPerRequest: 0.0009375,
    costPer1k: 0.9375,
    monthlyCost: 281.25,
    p95Ms: 2400,
  },
});
