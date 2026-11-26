import type { EvaluationStage, LessonSlug, StageId } from "@/lib/types";
import { BASELINE, CAPSTONE_STAGES } from "@/lib/course-registry";

export { BASELINE };

/** The six capstone evaluation stages, in course order. Fixed sample data. */
export const EVALUATION_STAGES: readonly EvaluationStage[] = CAPSTONE_STAGES;

/** Compatibility alias for the old layer list. */
export const LAYERS: readonly EvaluationStage[] = EVALUATION_STAGES;

const STAGE_BY_ID = new Map<StageId, EvaluationStage>(
  EVALUATION_STAGES.map((stage) => [stage.id, stage]),
);
const STAGE_BY_LESSON = new Map<LessonSlug, EvaluationStage>(
  EVALUATION_STAGES.map((stage) => [stage.lessonSlug, stage]),
);

export function getEvaluationStages(): readonly EvaluationStage[] {
  return EVALUATION_STAGES;
}

export function getStageById(stageId: StageId): EvaluationStage | undefined {
  return STAGE_BY_ID.get(stageId);
}

export function getStageByLesson(slug: LessonSlug): EvaluationStage | undefined {
  return STAGE_BY_LESSON.get(slug);
}

/** Compatibility aliases for code that still says "layer". */
export const getLayerById = getStageById;
export const getLayerByLesson = getStageByLesson;
