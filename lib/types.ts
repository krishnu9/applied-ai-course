export type LessonSlug = string;
export type ChapterId = string;
export type StageId = string;
export type LayerId = string;
export type Register = "standard" | "eli5";
export type CheckKind = "definition" | "apply" | "diagnose" | "calculate";
export type DiagramVariant = "flow" | "stack" | "matrix" | "timeline" | "bars";
export type InteractiveWidgetId =
  | "judge-bias-lab"
  | "arena-lab"
  | "injection-lab"
  | "context-budget-lab"
  | "rag-rank-lab"
  | "agent-trace"
  | "lora-memory-lab"
  | "serving-budget";
export type LessonStatus = "live" | "draft";
export type TaskItemId = "item-1" | "item-2" | "item-3" | "item-4" | "item-5";
export type Difficulty = "starter" | "core" | "advanced";

export interface Course {
  lessons: readonly Lesson[];
  totalMinutes: number;
  planned: readonly PlannedTopic[];
}
export interface LessonSummary { slug: LessonSlug; title: string }

export interface Chapter {
  id: ChapterId;
  order: number;
  number: number;
  title: string;
  lessonSlugs: readonly LessonSlug[];
}

export interface LessonTerm {
  term: string;
  definition: string;
}

export interface EvalCase {
  id: string;
  brief: string;
}

export interface Lesson {
  slug: LessonSlug;
  order: number;
  title: string;
  chapterId: ChapterId;
  chapterOrder: number;
  status: LessonStatus;
  outcome: string;
  artifact: string;
  readingMinutes: number;
  difficulty: Difficulty;
  /** Capstone stage for the six evaluation lessons; absent on other lessons. */
  layerId?: LayerId;
  terms?: readonly LessonTerm[];
  evalCase?: EvalCase;
  sections: readonly Section[];
  checks: readonly Check[];
  task: Task;
  prove: ProveConfig;
  citation: string;
}
export interface Section {
  id: string;
  title: string;
  /** Defaults to "standard" when absent. */
  register?: Register;
  blocks: readonly Block[];
}

export interface DiagramNode {
  id: string;
  label: string;
  /** Optional second line for the stack variant. */
  detail?: string;
  /** Optional value for the bars variant. */
  value?: number;
  /** Optional unit for the bars variant, for example "ms". */
  unit?: string;
}

export interface DiagramMatrix {
  rows: readonly string[];
  columns: readonly string[];
  /** Filled cells as [rowIndex, columnIndex]. */
  filled: readonly (readonly [number, number])[];
}

/** Shared input for all five diagram variants. */
export interface DiagramSpec {
  nodes: readonly DiagramNode[];
  edges: readonly (readonly [string, string])[];
  /** Optional grid labels for the matrix variant. */
  matrix?: DiagramMatrix;
}

export type Block =
  | { kind: "paragraph"; id: string; text: string }
  | { kind: "list"; id: string; ordered: boolean; items: readonly string[] }
  | { kind: "code"; id: string; filename: string; language: string; code: string;
      output: { label: "Sample output. Fixed data."; text: string } }
  | { kind: "callout"; id: string; tone: "note" | "warning" | "production-tip";
      title?: string; text: string }
  | { kind: "diagram"; id: string; variant?: DiagramVariant;
      spec: DiagramSpec; caption: string; alt: string }
  | { kind: "check"; id: string; checkId: string }
  | { kind: "task"; id: string }
  | { kind: "widget"; id: string; widget: "retrieval-explorer" | "cost-calculator"; caption: string }
  | { kind: "note"; id: string; text: string }
  | { kind: "analogy"; id: string; text: string; breaks: string }
  | { kind: "table"; id: string; columns: readonly string[];
      rows: readonly (readonly string[])[]; caption?: string }
  | { kind: "interview"; id: string; items: readonly { question: string; answer: string }[] }
  | { kind: "interactive"; id: string; widget: InteractiveWidgetId; caption: string };

export interface Check {
  id: string;
  prompt: string;
  kind?: CheckKind;
  options: readonly { id: string; label: string }[];
  correctOptionId: string;
  explanation: string;
}
export interface Task {
  id: string; scope: string;
  items: readonly { id: TaskItemId; label: string }[];   // exactly 5
  solution: { filename: string; language: string; code: string };
}
export interface ProveConfig {
  prompt: string; placeholder: string; maxLength: 280; debounceMs: 800; savedMessage: string;
}

/** One of the six capstone evaluation stages. */
export interface EvaluationStage {
  id: StageId;
  order: number;
  name: string;
  lessonSlug: LessonSlug;
  baseline: SampleMetrics;
  repaired: SampleMetrics;
}
/** Compatibility alias for the old layer name. */
export type Layer = EvaluationStage;
export interface SampleMetrics { passRate: number; costPer1k: number; p95Ms: number }

export interface ProgressState {
  version: 1 | 2;
  lessons: Record<string, LessonProgress>;
  lastLessonSlug: LessonSlug | null;
  lastSectionId: string | null;
  updatedAt: string;
}
export interface LessonProgress {
  status: "in-progress" | "repaired";
  checkAnswers: Record<string, { selectedOptionId: string }>;
  taskTicks: TaskItemId[];
  proofNote: string;
  repairedAt: string | null;
}

export interface RetrievalDoc { id: string; title: string; tags: readonly string[]; text: string }
export interface PresetQuery {
  id: string; query: string; results: readonly { docId: string; score: number }[];
}
export interface CostModel {
  defaults: { requestsPerDay: number; inputTokens: number; outputTokens: number; pricePerM: number };
  constants: { retrievalMs: number; prefillMsPerToken: number;
    decodeMsPerToken: number; daysPerMonth: number };
  expected: { costPerRequest: number; costPer1k: number; monthlyCost: number; p95Ms: number };
}
export interface CostNumbers {
  requestsPerDay: number; inputTokens: number; outputTokens: number; pricePerM: number;
}
export interface CostResult {
  costPerRequest: number; costPer1k: number; monthlyCost: number; p95Ms: number;
}
export interface MappingRow {
  id: string; aiIdea: string; engineeringIdea: string; lessonSlug: LessonSlug;
}
export interface PlannedTopic { id: string; title: string }
