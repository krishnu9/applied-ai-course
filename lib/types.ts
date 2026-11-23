export type LessonSlug =
  | 'evaluation' | 'prompt-contract' | 'retrieval'
  | 'agents' | 'fine-tuning' | 'cost';
export type LayerId = 'layer-01' | 'layer-02' | 'layer-03'
  | 'layer-04' | 'layer-05' | 'layer-06';
export type TaskItemId = 'item-1' | 'item-2' | 'item-3' | 'item-4' | 'item-5';
export type Difficulty = 'starter' | 'core' | 'advanced';

export interface Course {
  lessons: readonly Lesson[];
  totalMinutes: number;
  planned: readonly PlannedTopic[];
}
export interface LessonSummary { slug: LessonSlug; title: string }
export interface Lesson {
  slug: LessonSlug; order: 1|2|3|4|5|6; title: string; outcome: string; artifact: string;
  readingMinutes: number; difficulty: Difficulty; layerId: LayerId;
  sections: readonly Section[]; checks: readonly Check[]; task: Task;
  prove: ProveConfig; citation: string;
}
export interface Section { id: string; title: string; blocks: readonly Block[] }

export type Block =
  | { kind: 'paragraph'; id: string; text: string }
  | { kind: 'list'; id: string; ordered: boolean; items: readonly string[] }
  | { kind: 'code'; id: string; filename: string; language: string; code: string;
      output: { label: 'Sample output. Fixed data.'; text: string } }
  | { kind: 'callout'; id: string; tone: 'note'|'warning'|'production-tip';
      title?: string; text: string }
  | { kind: 'diagram'; id: string; spec: { nodes: readonly {id:string; label:string}[];
      edges: readonly (readonly [string, string])[] }; caption: string; alt: string }
  | { kind: 'check'; id: string; checkId: string }
  | { kind: 'task'; id: string }
  | { kind: 'widget'; id: string; widget: 'retrieval-explorer'|'cost-calculator'; caption: string }
  | { kind: 'note'; id: string; text: string };

export interface Check {
  id: string; prompt: string; options: readonly { id: string; label: string }[];
  correctOptionId: string; explanation: string;
}
export interface Task {
  id: string; scope: string;
  items: readonly { id: TaskItemId; label: string }[];   // exactly 5
  solution: { filename: string; language: string; code: string };
}
export interface ProveConfig {
  prompt: string; placeholder: string; maxLength: 280; debounceMs: 800; savedMessage: string;
}

export interface Layer {
  id: LayerId; order: number; name: string; lessonSlug: LessonSlug;
  baseline: SampleMetrics; repaired: SampleMetrics;
}
export interface SampleMetrics { passRate: number; costPer1k: number; p95Ms: number }

export interface ProgressState {
  version: 1;
  lessons: Record<string, LessonProgress>;
  lastLessonSlug: LessonSlug | null;
  lastSectionId: string | null;
  updatedAt: string;
}
export interface LessonProgress {
  status: 'in-progress' | 'repaired';
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
