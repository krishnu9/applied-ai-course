import type {
  Course,
  CostModel,
  Layer,
  LayerId,
  Lesson,
  LessonSlug,
  LessonSummary,
  MappingRow,
  PlannedTopic,
  PresetQuery,
  RetrievalDoc,
  SampleMetrics,
} from "@/lib/types";
import { deepFreeze } from "./freeze";
import { LAYERS, scoreSummary } from "./scores";
import { PRESET_QUERIES, RETRIEVAL_DOCS } from "./retrieval";
import { COST_MODEL } from "./cost-model";
import { PLANNED_TOPICS } from "./roadmap";
import { assertContent, type ContentSnapshot } from "./validate";
import { evaluationLesson } from "./lessons/evaluation";
import { promptContractLesson } from "./lessons/prompt-contract";
import { retrievalLesson } from "./lessons/retrieval";
import { agentsLesson } from "./lessons/agents";
import { fineTuningLesson } from "./lessons/fine-tuning";
import { costLesson } from "./lessons/cost";

export type Scores = SampleMetrics;

const LESSONS: readonly Lesson[] = deepFreeze([
  evaluationLesson,
  promptContractLesson,
  retrievalLesson,
  agentsLesson,
  fineTuningLesson,
  costLesson,
]);

const TOTAL_MINUTES = LESSONS.reduce(
  (total, lesson) => total + lesson.readingMinutes,
  0,
);

const COURSE: Course = deepFreeze({
  lessons: LESSONS,
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

export function getLesson(slug: string): Lesson | undefined {
  return LESSONS.find((lesson) => lesson.slug === slug);
}

export function getLayers(): readonly Layer[] {
  return LAYERS;
}

export function getLayerForLesson(slug: LessonSlug): Layer | undefined {
  return LAYERS.find((layer) => layer.lessonSlug === slug);
}

export function getMetrics(
  layerId: LayerId,
): { baseline: SampleMetrics; repaired: SampleMetrics } | undefined {
  const layer = LAYERS.find((candidate) => candidate.id === layerId);
  return layer ? { baseline: layer.baseline, repaired: layer.repaired } : undefined;
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

export function getNeighbours(
  slug: LessonSlug,
): { previous: LessonSummary | null; next: LessonSummary | null } {
  const index = LESSONS.findIndex((lesson) => lesson.slug === slug);
  if (index === -1) {
    return { previous: null, next: null };
  }
  const previousLesson = index > 0 ? LESSONS[index - 1] : null;
  const nextLesson = index < LESSONS.length - 1 ? LESSONS[index + 1] : null;
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
  layers: LAYERS,
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
