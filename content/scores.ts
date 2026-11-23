import type {
  Layer,
  LayerId,
  LessonSlug,
  SampleMetrics,
} from "@/lib/types";
import { deepFreeze } from "./freeze";

/** The broken start state shared by every layer. Fixed sample data. */
export const BASELINE: SampleMetrics = deepFreeze({
  passRate: 0.41,
  costPer1k: 0.94,
  p95Ms: 2400,
});

/**
 * Six layers in course order. Each repair moves one layer from its baseline
 * to its repaired pair. Values are fixed sample data.
 */
export const LAYERS: readonly Layer[] = deepFreeze([
  {
    id: "layer-01",
    order: 1,
    name: "Evaluation",
    lessonSlug: "evaluation",
    baseline: BASELINE,
    repaired: { passRate: 0.49, costPer1k: 0.92, p95Ms: 2300 },
  },
  {
    id: "layer-02",
    order: 2,
    name: "Prompt contract",
    lessonSlug: "prompt-contract",
    baseline: BASELINE,
    repaired: { passRate: 0.53, costPer1k: 0.86, p95Ms: 2100 },
  },
  {
    id: "layer-03",
    order: 3,
    name: "Retrieval",
    lessonSlug: "retrieval",
    baseline: BASELINE,
    repaired: { passRate: 0.58, costPer1k: 0.71, p95Ms: 1400 },
  },
  {
    id: "layer-04",
    order: 4,
    name: "Agents",
    lessonSlug: "agents",
    baseline: BASELINE,
    repaired: { passRate: 0.63, costPer1k: 0.68, p95Ms: 1600 },
  },
  {
    id: "layer-05",
    order: 5,
    name: "Fine-tuning",
    lessonSlug: "fine-tuning",
    baseline: BASELINE,
    repaired: { passRate: 0.72, costPer1k: 0.79, p95Ms: 1100 },
  },
  {
    id: "layer-06",
    order: 6,
    name: "Cost and latency",
    lessonSlug: "cost",
    baseline: BASELINE,
    repaired: { passRate: 0.74, costPer1k: 0.31, p95Ms: 900 },
  },
]);

const LAYER_BY_ID = new Map<LayerId, Layer>(
  LAYERS.map((layer) => [layer.id, layer]),
);
const LAYER_BY_LESSON = new Map<LessonSlug, Layer>(
  LAYERS.map((layer) => [layer.lessonSlug, layer]),
);

export function getLayerById(layerId: LayerId): Layer | undefined {
  return LAYER_BY_ID.get(layerId);
}

export function getLayerByLesson(slug: LessonSlug): Layer | undefined {
  return LAYER_BY_LESSON.get(slug);
}

/**
 * Return the repaired pair of the repaired layer with the highest order.
 * An empty list, or a list with no known slug, returns the baseline.
 * Duplicate slugs count once because the lookup is by lesson.
 */
export function scoreSummary(repaired: readonly LessonSlug[]): SampleMetrics {
  let best: Layer | undefined;
  for (const slug of repaired) {
    const layer = LAYER_BY_LESSON.get(slug);
    if (layer && (!best || layer.order > best.order)) {
      best = layer;
    }
  }
  return best ? best.repaired : BASELINE;
}
