import type {
  Chapter,
  ChapterId,
  EvaluationStage,
  InteractiveWidgetId,
  LessonSlug,
  SampleMetrics,
  TaskItemId,
} from "@/lib/types";

/**
 * The single source of truth for the course shape. Content, progress and the
 * validator import these lists instead of declaring their own copies.
 */

export interface LessonEntry {
  slug: LessonSlug;
  title: string;
  chapterId: ChapterId;
  flagship: boolean;
}

export const EXPECTED_LESSON_COUNT = 24;
export const MAX_CHECKS_PER_LESSON = 6;

export const TASK_ITEM_IDS = [
  "item-1",
  "item-2",
  "item-3",
  "item-4",
  "item-5",
] as const satisfies readonly TaskItemId[];

export const LESSONS: readonly LessonEntry[] = [
  { slug: "ai-stack", title: "The AI engineering stack", chapterId: "ch-01", flagship: false },
  { slug: "foundation-models", title: "How a foundation model makes text", chapterId: "ch-02", flagship: false },
  { slug: "model-scaling", title: "Model size, data and compute", chapterId: "ch-02", flagship: false },
  { slug: "post-training", title: "Pretraining, SFT and preference tuning", chapterId: "ch-02", flagship: false },
  { slug: "sampling-and-hallucination", title: "Why the model varies and why it invents", chapterId: "ch-02", flagship: false },
  { slug: "evaluation", title: "Evaluation you can trust", chapterId: "ch-03", flagship: false },
  { slug: "eval-sets", title: "Build a frozen eval set", chapterId: "ch-03", flagship: false },
  { slug: "llm-as-judge", title: "Judges, rubrics and bias", chapterId: "ch-03", flagship: true },
  { slug: "eval-criteria", title: "Criteria and rubrics", chapterId: "ch-04", flagship: false },
  { slug: "model-selection", title: "Choose a model with evidence", chapterId: "ch-04", flagship: true },
  { slug: "prompt-contract", title: "Prompt design as a contract", chapterId: "ch-05", flagship: true },
  { slug: "structured-outputs", title: "Reliable structured output", chapterId: "ch-05", flagship: false },
  { slug: "context-engineering", title: "Spend context on purpose", chapterId: "ch-05", flagship: true },
  { slug: "retrieval", title: "Retrieval that earns its place", chapterId: "ch-06", flagship: true },
  { slug: "retrieval-quality", title: "Measure and repair retrieval", chapterId: "ch-06", flagship: false },
  { slug: "agents", title: "Agents with stop rules", chapterId: "ch-06", flagship: true },
  { slug: "fine-tuning", title: "Prompt, RAG or fine-tune", chapterId: "ch-07", flagship: false },
  { slug: "lora-memory", title: "LoRA and memory maths", chapterId: "ch-07", flagship: true },
  { slug: "dataset-curation", title: "Data quality, coverage and splits", chapterId: "ch-08", flagship: false },
  { slug: "synthetic-data", title: "Synthesis and distillation", chapterId: "ch-08", flagship: false },
  { slug: "cost", title: "Latency, throughput and goodput", chapterId: "ch-09", flagship: true },
  { slug: "inference-optimization", title: "Make serving cheaper", chapterId: "ch-09", flagship: false },
  { slug: "ai-architecture", title: "Guardrails, gateways and fallbacks", chapterId: "ch-10", flagship: false },
  { slug: "observability-feedback", title: "Observe quality and learn from users", chapterId: "ch-10", flagship: false },
];

export const LESSON_SLUGS: readonly LessonSlug[] = LESSONS.map((lesson) => lesson.slug);

export const FLAGSHIP_SLUGS: readonly LessonSlug[] = LESSONS.filter(
  (lesson) => lesson.flagship,
).map((lesson) => lesson.slug);

export const INTERACTIVE_WIDGET_IDS = [
  "judge-bias-lab",
  "arena-lab",
  "injection-lab",
  "context-budget-lab",
  "rag-rank-lab",
  "agent-trace",
  "lora-memory-lab",
  "serving-budget",
] as const satisfies readonly InteractiveWidgetId[];

export const CHAPTERS: readonly Chapter[] = [
  {
    id: "ch-01",
    order: 1,
    number: 1,
    title: "The AI engineering stack",
    bookChapter: 1,
    lessonSlugs: ["ai-stack"],
  },
  {
    id: "ch-02",
    order: 2,
    number: 2,
    title: "Understanding foundation models",
    bookChapter: 2,
    lessonSlugs: [
      "foundation-models",
      "model-scaling",
      "post-training",
      "sampling-and-hallucination",
    ],
  },
  {
    id: "ch-03",
    order: 3,
    number: 3,
    title: "Evaluation methodology",
    bookChapter: 3,
    lessonSlugs: ["evaluation", "eval-sets", "llm-as-judge"],
  },
  {
    id: "ch-04",
    order: 4,
    number: 4,
    title: "Evaluating AI systems",
    bookChapter: 4,
    lessonSlugs: ["eval-criteria", "model-selection"],
  },
  {
    id: "ch-05",
    order: 5,
    number: 5,
    title: "Prompt engineering",
    bookChapter: 5,
    lessonSlugs: ["prompt-contract", "structured-outputs", "context-engineering"],
  },
  {
    id: "ch-06",
    order: 6,
    number: 6,
    title: "RAG and agents",
    bookChapter: 6,
    lessonSlugs: ["retrieval", "retrieval-quality", "agents"],
  },
  {
    id: "ch-07",
    order: 7,
    number: 7,
    title: "Fine-tuning",
    bookChapter: 7,
    lessonSlugs: ["fine-tuning", "lora-memory"],
  },
  {
    id: "ch-08",
    order: 8,
    number: 8,
    title: "Dataset engineering",
    bookChapter: 8,
    lessonSlugs: ["dataset-curation", "synthetic-data"],
  },
  {
    id: "ch-09",
    order: 9,
    number: 9,
    title: "Inference optimization",
    bookChapter: 9,
    lessonSlugs: ["cost", "inference-optimization"],
  },
  {
    id: "ch-10",
    order: 10,
    number: 10,
    title: "Architecture and user feedback",
    bookChapter: 10,
    lessonSlugs: ["ai-architecture", "observability-feedback"],
  },
];

/** The broken start state shared by every capstone stage. Fixed sample data. */
export const BASELINE: SampleMetrics = {
  passRate: 0.41,
  costPer1k: 0.94,
  p95Ms: 2400,
};

export const CAPSTONE_STAGES: readonly EvaluationStage[] = [
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
];

const ENTRY_BY_SLUG = new Map<LessonSlug, LessonEntry>(
  LESSONS.map((lesson) => [lesson.slug, lesson]),
);

const ORDER_BY_SLUG = new Map<LessonSlug, number>(
  LESSONS.map((lesson, index) => [lesson.slug, index + 1]),
);

const CHAPTER_BY_SLUG = new Map<LessonSlug, Chapter>(
  CHAPTERS.flatMap((chapter) =>
    chapter.lessonSlugs.map((slug): [LessonSlug, Chapter] => [slug, chapter]),
  ),
);

export function isLessonSlug(value: unknown): value is LessonSlug {
  return typeof value === "string" && ENTRY_BY_SLUG.has(value);
}

export function getLessonEntry(slug: string): LessonEntry | undefined {
  return ENTRY_BY_SLUG.get(slug);
}

export function getLessonOrder(slug: string): number | undefined {
  return ORDER_BY_SLUG.get(slug);
}

export function getChapterForSlug(slug: string): Chapter | undefined {
  return CHAPTER_BY_SLUG.get(slug);
}

export function getNeighbours(slug: string): {
  previous: LessonEntry | null;
  next: LessonEntry | null;
} {
  const index = LESSONS.findIndex((lesson) => lesson.slug === slug);
  if (index === -1) return { previous: null, next: null };
  return {
    previous: index > 0 ? LESSONS[index - 1] : null,
    next: index < LESSONS.length - 1 ? LESSONS[index + 1] : null,
  };
}
