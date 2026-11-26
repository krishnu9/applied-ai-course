import type { EvaluationStage, LessonSlug, SampleMetrics } from "@/lib/types";
import { BASELINE, CAPSTONE_STAGES } from "@/lib/course-registry";

/**
 * The capstone score summary. This module is safe for client import: it holds
 * one pure calculation over the registry stage data and no lesson prose.
 */

const STAGE_BY_LESSON = new Map<LessonSlug, EvaluationStage>(
  CAPSTONE_STAGES.map((stage) => [stage.lessonSlug, stage]),
);

/**
 * Return the repaired pair of the repaired stage with the highest order.
 * An empty list, or a list with no known slug, returns the baseline.
 * Duplicate slugs count once because the lookup is by lesson.
 */
export function scoreSummary(repaired: readonly LessonSlug[]): SampleMetrics {
  let best: EvaluationStage | undefined;
  for (const slug of repaired) {
    const stage = STAGE_BY_LESSON.get(slug);
    if (stage && (!best || stage.order > best.order)) {
      best = stage;
    }
  }
  return best ? best.repaired : BASELINE;
}
