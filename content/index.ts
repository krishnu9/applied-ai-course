import type {
  Chapter,
  CostModel,
  Course,
  EvaluationStage,
  Layer,
  Lesson,
  LessonSlug,
  LessonSummary,
  MappingRow,
  PlannedTopic,
  PresetQuery,
  RetrievalDoc,
  SampleMetrics,
} from "@/lib/types";
import { CHAPTERS, getChapterForSlug } from "@/lib/course-registry";
import { deepFreeze } from "./freeze";
import { EVALUATION_STAGES, scoreSummary } from "./scores";
import { PRESET_QUERIES, RETRIEVAL_DOCS } from "./retrieval";
import { COST_MODEL } from "./cost-model";
import { PLANNED_TOPICS } from "./roadmap";
import { assertContent, type ContentSnapshot } from "./validate";

import { aiStackLesson } from "./lessons/ai-stack";
import { foundationModelsLesson } from "./lessons/foundation-models";
import { modelScalingLesson } from "./lessons/model-scaling";
import { postTrainingLesson } from "./lessons/post-training";
import { samplingAndHallucinationLesson } from "./lessons/sampling-and-hallucination";
import { evaluationLesson } from "./lessons/evaluation";
import { evalSetsLesson } from "./lessons/eval-sets";
import { llmAsJudgeLesson } from "./lessons/llm-as-judge";
import { evalCriteriaLesson } from "./lessons/eval-criteria";
import { modelSelectionLesson } from "./lessons/model-selection";
import { promptContractLesson } from "./lessons/prompt-contract";
import { structuredOutputsLesson } from "./lessons/structured-outputs";
import { contextEngineeringLesson } from "./lessons/context-engineering";
import { retrievalLesson } from "./lessons/retrieval";
import { retrievalQualityLesson } from "./lessons/retrieval-quality";
import { agentsLesson } from "./lessons/agents";
import { fineTuningLesson } from "./lessons/fine-tuning";
import { loraMemoryLesson } from "./lessons/lora-memory";
import { datasetCurationLesson } from "./lessons/dataset-curation";
import { syntheticDataLesson } from "./lessons/synthetic-data";
import { costLesson } from "./lessons/cost";
import { inferenceOptimizationLesson } from "./lessons/inference-optimization";
import { aiArchitectureLesson } from "./lessons/ai-architecture";
import { observabilityFeedbackLesson } from "./lessons/observability-feedback";

export type Scores = SampleMetrics;

/** Every lesson, live and draft, in course order. */
const ALL_LESSONS: readonly Lesson[] = deepFreeze(
  [
    aiStackLesson,
    foundationModelsLesson,
    modelScalingLesson,
    postTrainingLesson,
    samplingAndHallucinationLesson,
    evaluationLesson,
    evalSetsLesson,
    llmAsJudgeLesson,
    evalCriteriaLesson,
    modelSelectionLesson,
    promptContractLesson,
    structuredOutputsLesson,
    contextEngineeringLesson,
    retrievalLesson,
    retrievalQualityLesson,
    agentsLesson,
    fineTuningLesson,
    loraMemoryLesson,
    datasetCurationLesson,
    syntheticDataLesson,
    costLesson,
    inferenceOptimizationLesson,
    aiArchitectureLesson,
    observabilityFeedbackLesson,
  ].sort((left, right) => left.order - right.order),
);

const LIVE_LESSONS: readonly Lesson[] = ALL_LESSONS.filter(
  (lesson) => lesson.status === "live",
);

const TOTAL_MINUTES = LIVE_LESSONS.reduce(
  (total, lesson) => total + lesson.readingMinutes,
  0,
);

const COURSE: Course = deepFreeze({
  lessons: LIVE_LESSONS,
  totalMinutes: TOTAL_MINUTES,
  planned: PLANNED_TOPICS,
});

const MAPPING_ROWS: readonly MappingRow[] = deepFreeze([
  {
    id: "eval-set",
    aiIdea: "Eval set",
    engineeringIdea: "Test suite",
    lessonSlug: "evaluation",
  },
  {
    id: "retrieval",
    aiIdea: "Retrieval",
    engineeringIdea: "Ranked cache",
    lessonSlug: "retrieval",
  },
  {
    id: "agent",
    aiIdea: "Agent",
    engineeringIdea: "Loop with a stop rule",
    lessonSlug: "agents",
  },
  {
    id: "inference-cost",
    aiIdea: "Inference cost",
    engineeringIdea: "Load budget",
    lessonSlug: "cost",
  },
]);

export function getCourse(): Course {
  return COURSE;
}

/** Live and draft lessons. Routes use this to prerender every known slug. */
export function getAllLessons(): readonly Lesson[] {
  return ALL_LESSONS;
}

export function getChapters(): readonly Chapter[] {
  return CHAPTERS;
}

export function getChapterForLesson(slug: LessonSlug): Chapter | undefined {
  return getChapterForSlug(slug);
}

/** Any lesson, live or draft. */
export function getLesson(slug: string): Lesson | undefined {
  return ALL_LESSONS.find((lesson) => lesson.slug === slug);
}

export function getEvaluationStages(): readonly EvaluationStage[] {
  return EVALUATION_STAGES;
}

/** Compatibility alias: the old layer list is the capstone stage list. */
export function getLayers(): readonly Layer[] {
  return EVALUATION_STAGES;
}

/** Compatibility alias: a stage by lesson slug. */
export function getLayerForLesson(slug: LessonSlug): Layer | undefined {
  return EVALUATION_STAGES.find((stage) => stage.lessonSlug === slug);
}

export function getMetrics(
  stageId: string,
): { baseline: SampleMetrics; repaired: SampleMetrics } | undefined {
  const stage = EVALUATION_STAGES.find((candidate) => candidate.id === stageId);
  return stage ? { baseline: stage.baseline, repaired: stage.repaired } : undefined;
}

export function getRetrievalDocs(): readonly RetrievalDoc[] {
  return RETRIEVAL_DOCS;
}

export function getPresetQueries(): readonly PresetQuery[] {
  return PRESET_QUERIES;
}

export function getCostModel(): CostModel {
  return COST_MODEL;
}

export function getMappingRows(): readonly MappingRow[] {
  return MAPPING_ROWS;
}

export function getPlannedTopics(): readonly PlannedTopic[] {
  return PLANNED_TOPICS;
}

/** Previous and next live lesson. Draft lessons are skipped. */
export function getNeighbours(
  slug: LessonSlug,
): { previous: LessonSummary | null; next: LessonSummary | null } {
  const index = LIVE_LESSONS.findIndex((lesson) => lesson.slug === slug);
  if (index === -1) {
    return { previous: null, next: null };
  }
  const previousLesson = index > 0 ? LIVE_LESSONS[index - 1] : null;
  const nextLesson = index < LIVE_LESSONS.length - 1 ? LIVE_LESSONS[index + 1] : null;
  return {
    previous: previousLesson
      ? { slug: previousLesson.slug, title: previousLesson.title }
      : null,
    next: nextLesson ? { slug: nextLesson.slug, title: nextLesson.title } : null,
  };
}

export { scoreSummary };

const SNAPSHOT: ContentSnapshot = {
  course: COURSE,
  allLessons: ALL_LESSONS,
  chapters: CHAPTERS,
  stages: EVALUATION_STAGES,
  docs: RETRIEVAL_DOCS,
  queries: PRESET_QUERIES,
  model: COST_MODEL,
  mapping: MAPPING_ROWS,
};

if (
  process.env.NODE_ENV === "development" ||
  process.env.CONTENT_VALIDATE === "1"
) {
  assertContent(SNAPSHOT);
}
