import type { PlannedTopic } from "@/lib/types";
import { deepFreeze } from "./freeze";

/** Planned topics for later. Titles only; the demo gives no dates. */
export const PLANNED_TOPICS: readonly PlannedTopic[] = deepFreeze([
  { id: "eval-scale", title: "Evaluation at scale" },
  { id: "tool-safety", title: "Tool use and safety" },
  { id: "caching", title: "Caching and prefix reuse" },
  { id: "observability", title: "Production observability" },
]);
