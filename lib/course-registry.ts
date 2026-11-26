import type {
  Chapter,
  ChapterId,
  EvaluationStage,
  InteractiveWidgetId,
  LessonSlug,
  LessonStatus,
  SampleMetrics,
  TaskItemId,
} from "@/lib/types";

/**
 * The single source of truth for the course shape. Content, progress and the
 * validator import these lists instead of declaring their own copies.
 *
 * This module is safe for client import. It holds lesson summaries only, never
 * lesson prose or sections, so a client component can render the course list
 * without pulling the lesson bodies into the JS bundle.
 */

export interface LessonEntry {
  slug: LessonSlug;
  /** Position in course order, starting at 1. */
  order: number;
  title: string;
  chapterId: ChapterId;
  flagship: boolean;
  status: LessonStatus;
  readingMinutes: number;
  /** One-sentence lesson promise. Summary only, not lesson prose. */
  outcome: string;
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
  {
    slug: "ai-stack",
    order: 1,
    title: "Three layers of an AI product",
    chapterId: "ch-01",
    flagship: false,
    status: "live",
    readingMinutes: 18,
    outcome:
      "You can name the three layers of an AI product, place a failure on one layer, and defend a build or buy choice. Prerequisite: none. This is the first lesson.",
  },
  {
    slug: "foundation-models",
    order: 2,
    title: "How a foundation model makes text",
    chapterId: "ch-02",
    flagship: false,
    status: "live",
    readingMinutes: 22,
    outcome:
      "You can define a token, trace text through a model, and diagnose a truncated context. Prerequisite: lesson 1, the AI engineering stack.",
  },
  {
    slug: "model-scaling",
    order: 3,
    title: "Model size, data and compute",
    chapterId: "ch-02",
    flagship: false,
    status: "live",
    readingMinutes: 23,
    outcome:
      "You can define a parameter, read a scaling law, and decide whether a larger model is the right repair. Prerequisite: lesson 2, foundation models.",
  },
  {
    slug: "post-training",
    order: 4,
    title: "Pretraining, SFT and preference tuning",
    chapterId: "ch-02",
    flagship: false,
    status: "live",
    readingMinutes: 22,
    outcome:
      "You can tell a base model from an instruct model, choose SFT or preference tuning, and shape the data for each stage. Prerequisite: lesson 3, model scaling.",
  },
  {
    slug: "sampling-and-hallucination",
    order: 5,
    title: "Why the model varies and why it invents",
    chapterId: "ch-02",
    flagship: false,
    status: "live",
    readingMinutes: 23,
    outcome:
      "You can set temperature and top-p, explain a non-deterministic run, and diagnose a hallucination. Prerequisite: lesson 4, post-training.",
  },
  {
    slug: "evaluation",
    order: 6,
    title: "Evaluation you can trust",
    chapterId: "ch-03",
    flagship: false,
    status: "live",
    readingMinutes: 24,
    outcome:
      "You can define evaluation, choose a metric for a task, and report a score with its interval. Prerequisite: lesson 5, sampling and hallucination.",
  },
  {
    slug: "eval-sets",
    order: 7,
    title: "Build a frozen eval set",
    chapterId: "ch-03",
    flagship: false,
    status: "live",
    readingMinutes: 24,
    outcome:
      "You can source an eval set, freeze it with a held-out part, and report a clean score. Prerequisite: lesson 6, evaluation.",
  },
  {
    slug: "llm-as-judge",
    order: 8,
    title: "Judges, rubrics and bias",
    chapterId: "ch-03",
    flagship: true,
    status: "live",
    readingMinutes: 26,
    outcome:
      "You can define an LLM-as-judge, design a rubric, and audit a verdict for bias.",
  },
  {
    slug: "eval-criteria",
    order: 9,
    title: "Criteria and rubrics",
    chapterId: "ch-04",
    flagship: false,
    status: "live",
    readingMinutes: 24,
    outcome:
      "You can define an evaluation criterion, build a rubric, and catch a failure that an average hides. Prerequisite: lesson 6, evaluation.",
  },
  {
    slug: "model-selection",
    order: 10,
    title: "Choose a model with evidence",
    chapterId: "ch-04",
    flagship: true,
    status: "live",
    readingMinutes: 28,
    outcome:
      "You can define model selection, compare benchmark and private evidence, and choose a model under hard limits. Prerequisite: lesson 9, criteria and rubrics.",
  },
  {
    slug: "prompt-contract",
    order: 11,
    title: "Prompt design as a contract",
    chapterId: "ch-05",
    flagship: true,
    status: "live",
    readingMinutes: 27,
    outcome:
      "You can write a prompt contract, rank instruction sources, and defend an injection boundary. Prerequisite: lesson 5 on sampling and lesson 10 on model selection. You need one fixed prompt, six labeled inputs and a label counter.",
  },
  {
    slug: "structured-outputs",
    order: 12,
    title: "Reliable structured output",
    chapterId: "ch-05",
    flagship: false,
    status: "live",
    readingMinutes: 19,
    outcome:
      "You can write a JSON schema, choose an enforcement method, and repair a malformed reply. Prerequisite: lesson 11 on prompt contracts. You need six fixed raw outputs and one validator.",
  },
  {
    slug: "context-engineering",
    order: 13,
    title: "Spend context on purpose",
    chapterId: "ch-05",
    flagship: true,
    status: "live",
    readingMinutes: 26,
    outcome:
      "You can build a token budget, diagnose a lost-in-the-middle failure, and defend a long-context or RAG choice. Prerequisite: lesson 2 on context windows and lesson 11 on prompt contracts. You need the fixed 8,000-token budget and four parts.",
  },
  {
    slug: "retrieval",
    order: 14,
    title: "Retrieval that earns its place",
    chapterId: "ch-06",
    flagship: true,
    status: "live",
    readingMinutes: 25,
    outcome:
      "You can define retrieval-augmented generation, choose a retrieval design, and prove a ranking repair. Prerequisite: lesson 13, context engineering.",
  },
  {
    slug: "retrieval-quality",
    order: 15,
    title: "Measure and repair retrieval",
    chapterId: "ch-06",
    flagship: false,
    status: "live",
    readingMinutes: 24,
    outcome:
      "You can compute recall@k, MRR and nDCG, diagnose a query failure, and prove a retrieval repair. Prerequisite: lesson 14, retrieval.",
  },
  {
    slug: "agents",
    order: 16,
    title: "Agents with stop rules",
    chapterId: "ch-06",
    flagship: true,
    status: "live",
    readingMinutes: 28,
    outcome:
      "You can define an agent loop, write a tool schema, choose stop conditions and repair a stuck run. Prerequisite: lesson 14, retrieval.",
  },
  {
    slug: "fine-tuning",
    order: 17,
    title: "Prompt, RAG or fine-tune",
    chapterId: "ch-07",
    flagship: false,
    status: "live",
    readingMinutes: 18,
    outcome:
      "You can define fine-tuning, choose between a prompt, RAG and a fine-tune, and defend the choice with a held-out score. Prerequisite: lesson 16, agents.",
  },
  {
    slug: "lora-memory",
    order: 18,
    title: "LoRA and memory maths",
    chapterId: "ch-07",
    flagship: true,
    status: "live",
    readingMinutes: 24,
    outcome:
      "You can define LoRA, calculate its trainable parameters and memory, and choose a serving design. Prerequisite: lesson 17, fine-tuning.",
  },
  {
    slug: "dataset-curation",
    order: 19,
    title: "Data quality, coverage and splits",
    chapterId: "ch-08",
    flagship: false,
    status: "live",
    readingMinutes: 20,
    outcome:
      "You can define data curation, diagnose a coverage gap, and build a clean train and test split. Prerequisite: lesson 18, LoRA and memory maths.",
  },
  {
    slug: "synthetic-data",
    order: 20,
    title: "Synthesis and distillation",
    chapterId: "ch-08",
    flagship: false,
    status: "live",
    readingMinutes: 19,
    outcome:
      "You can define data synthesis, run a teacher and student pipeline, and check synthetic data for legality and collapse. Prerequisite: lesson 19, dataset curation.",
  },
  {
    slug: "cost",
    order: 21,
    title: "Latency, throughput and goodput",
    chapterId: "ch-09",
    flagship: true,
    status: "live",
    readingMinutes: 28,
    outcome:
      "You can define the serving metrics, measure a request timeline, and choose one lever that meets a latency target. Prerequisite: lesson 20, synthetic data.",
  },
  {
    slug: "inference-optimization",
    order: 22,
    title: "Make serving cheaper",
    chapterId: "ch-09",
    flagship: false,
    status: "live",
    readingMinutes: 22,
    outcome:
      "You can define the serving optimizations, measure their effect on cost and p95, and choose one that holds the quality floor. Prerequisite: lesson 21, latency, throughput and goodput.",
  },
  {
    slug: "ai-architecture",
    order: 23,
    title: "Guardrails, gateways and fallbacks",
    chapterId: "ch-10",
    flagship: false,
    status: "live",
    readingMinutes: 21,
    outcome:
      "You can define the parts around a model, choose a route and a cache policy, and add a fallback that holds the output contract. Prerequisite: lesson 22, inference optimization.",
  },
  {
    slug: "observability-feedback",
    order: 24,
    title: "Observe quality and learn from users",
    chapterId: "ch-10",
    flagship: false,
    status: "live",
    readingMinutes: 22,
    outcome:
      "You can define the three telemetry signals, compute the incident metrics, and design a feedback signal that catches a silent quality drop. Prerequisite: lesson 23, guardrails, gateways and fallbacks.",
  },
];

export const LESSON_SLUGS: readonly LessonSlug[] = LESSONS.map((lesson) => lesson.slug);

/** Lessons a reader can open and repair, in course order. */
export const LIVE_LESSON_SLUGS: readonly LessonSlug[] = LESSONS.filter(
  (lesson) => lesson.status === "live",
).map((lesson) => lesson.slug);

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
    title: "The layers of an AI product",
    lessonSlugs: ["ai-stack"],
  },
  {
    id: "ch-02",
    order: 2,
    number: 2,
    title: "Inside a foundation model",
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
    title: "Measuring quality",
    lessonSlugs: ["evaluation", "eval-sets", "llm-as-judge"],
  },
  {
    id: "ch-04",
    order: 4,
    number: 4,
    title: "Evaluating a whole system",
    lessonSlugs: ["eval-criteria", "model-selection"],
  },
  {
    id: "ch-05",
    order: 5,
    number: 5,
    title: "Instruction design",
    lessonSlugs: ["prompt-contract", "structured-outputs", "context-engineering"],
  },
  {
    id: "ch-06",
    order: 6,
    number: 6,
    title: "Retrieval and tool-using loops",
    lessonSlugs: ["retrieval", "retrieval-quality", "agents"],
  },
  {
    id: "ch-07",
    order: 7,
    number: 7,
    title: "Adapting model behavior",
    lessonSlugs: ["fine-tuning", "lora-memory"],
  },
  {
    id: "ch-08",
    order: 8,
    number: 8,
    title: "Training data",
    lessonSlugs: ["dataset-curation", "synthetic-data"],
  },
  {
    id: "ch-09",
    order: 9,
    number: 9,
    title: "Serving speed and cost",
    lessonSlugs: ["cost", "inference-optimization"],
  },
  {
    id: "ch-10",
    order: 10,
    number: 10,
    title: "Production architecture and feedback",
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
  LESSONS.map((lesson) => [lesson.slug, lesson.order]),
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
