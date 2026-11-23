# High-level design — data

This part fixes the data model for lastminute.dev. All content is typed static data. All reader state lives in localStorage. Every number in this document is sample data. The UI labels scores "Sample evaluation. Fixed data."

Supabase is not used. Reason: the scope lock has no login, no shared state and no server writes.

## 1. Storage model

| Store | Location | Mutability | Owner |
| --- | --- | --- | --- |
| Course content | `src/data/lessons/*.ts`, `src/data/course.ts`, `src/data/samples.ts` | Immutable after build | `src/data/content.ts` |
| Reader progress | `localStorage`, key `lastminute.progress.v1` | Per browser | `src/data/progress.ts` |
| Widget input | Component state | Ephemeral, not saved | Widget component |

The build reads no remote data. The site makes no network call at runtime.

## 2. Entity model

```ts
type LessonSlug = 'evaluation' | 'prompt-contract' | 'retrieval'
                | 'agents' | 'fine-tuning' | 'cost';
type LayerId = 'layer-01' | 'layer-02' | 'layer-03'
             | 'layer-04' | 'layer-05' | 'layer-06';
type BlockKind = 'paragraph' | 'list' | 'code' | 'callout' | 'diagram'
               | 'check' | 'task' | 'widget' | 'note';

interface Course {
  title: string;
  lessons: Lesson[];                         // 6, ordered by order
  layers: Layer[];                           // 6, ordered by order
  retrieval: { docs: RetrievalDoc[]; presets: PresetQuery[] };
  calculator: CostModel;
  mapping: MappingRow[];                     // 4 fixed rows
}

interface Lesson {
  slug: LessonSlug;
  order: 1 | 2 | 3 | 4 | 5 | 6;
  title: string;
  outcome: string;
  artifact: string;
  readingMinutes: number;
  difficulty: 'starter' | 'core' | 'advanced';
  layerId: LayerId;
  sections: Section[];
  checks: Check[];
  task: Task;
  prove: ProveConfig;
  citation: string;
}

interface Section { id: string; title: string; blocks: Block[]; }

type Block = ParagraphBlock | ListBlock | CodeBlock | CalloutBlock | DiagramBlock
           | CheckBlock | TaskBlock | WidgetBlock | NoteBlock;

interface BlockBase { id: string; kind: BlockKind; }
interface ParagraphBlock extends BlockBase { kind: 'paragraph'; text: string; }
interface ListBlock extends BlockBase { kind: 'list'; ordered: boolean; items: string[]; }
interface CodeBlock extends BlockBase {
  kind: 'code'; filename: string; language: string; code: string;
  output: { label: string; text: string };           // always fixed sample output
}
interface CalloutBlock extends BlockBase {
  kind: 'callout'; tone: 'note' | 'warning' | 'production-tip';
  title?: string; text: string;
}
interface DiagramBlock extends BlockBase {
  kind: 'diagram'; diagram: DiagramSpec; caption: string; alt: string;
}
interface CheckBlock extends BlockBase { kind: 'check'; checkId: string; }
interface TaskBlock extends BlockBase { kind: 'task'; }
interface WidgetBlock extends BlockBase {
  kind: 'widget'; widget: 'retrieval-explorer' | 'cost-calculator'; caption: string;
}
interface NoteBlock extends BlockBase { kind: 'note'; text: string; }

interface DiagramSpec { nodes: string[]; edges: Array<[string, string]>; }
interface Check {
  id: string; prompt: string; options: Array<{ id: string; label: string }>;
  correctOptionId: string; explanation: string;
}
interface Task {
  id: string; scope: string; items: string[];
  solution: { filename: string; language: string; code: string };
}
interface ProveConfig {
  prompt: string; placeholder: string; maxLength: 280;
  debounceMs: 800; savedMessage: string;
}
interface MappingRow { ai: string; engineering: string; lessonSlug: LessonSlug; }

interface Layer {
  id: LayerId; order: number; name: string; lessonSlug: LessonSlug;
  startState: 'broken'; baseline: SampleMetrics; repaired: SampleMetrics;
}
interface SampleMetrics { passRate: number; costPer1k: number; p95Ms: number; }

interface ProgressState {
  version: 1;
  lessons: Record<string, LessonProgress>;
  lastLessonSlug: LessonSlug | null;
  lastSectionId: string | null;
  updatedAt: string;
}
interface LessonProgress {
  status: 'in-progress' | 'repaired';
  checkAnswers: Record<string, { selectedOptionId: string }>;
  taskTicks: string[];
  proofNote: string;
  repairedAt: string | null;
}

interface RetrievalDoc { id: string; title: string; text: string; tags: string[]; }
interface PresetQuery { id: string; label: string; results: Array<{ docId: string; score: number }>; }
interface CostInputs {
  requestsPerDay: number; inputTokensPerRequest: number;
  outputTokensPerRequest: number; pricePerMillionTokens: number;
}
interface CostModel {
  defaults: CostInputs;
  latency: { retrievalMs: number; prefillMsPerToken: number; decodeMsPerToken: number };
  daysPerMonth: 30;
}
```

Checks are top-level on the lesson, because the completion gate needs them by id. A check block holds only a reference. The task block marks the one task slot.

## 3. Field tables

### 3.1 Lesson

| Field | Type | Req | Meaning and constraint |
| --- | --- | --- | --- |
| `slug` | `LessonSlug` | yes | Unique. Pattern `^[a-z][a-z0-9-]*$`. Also the route segment. |
| `order` | `1..6` | yes | Unique and contiguous. Controls sort, previous and next. |
| `title` | `string` | yes | At most 70 characters. Sentence case. |
| `outcome` | `string` | yes | One sentence, at most 160 characters. |
| `artifact` | `string` | yes | Named file or table the reader leaves with. |
| `readingMinutes` | `number` | yes | Fixed 9–25. Shows as "About {n} minutes". |
| `difficulty` | `'starter' \| 'core' \| 'advanced'` | yes | Meta row only. |
| `layerId` | `LayerId` | yes | One-to-one link to a layer. |
| `sections` | `Section[]` | yes | 3–7. The flagship has 8. Ids match `^[a-z][a-z0-9-]{0,40}$`. |
| `checks` | `Check[]` | yes | 2. The retrieval lesson has 3. |
| `task` | `Task` | yes | Exactly 5 items. |
| `prove` | `ProveConfig` | yes | See 3.3. |
| `citation` | `string` | yes | Exactly one line, at most 160 characters. |

### 3.2 Block union members

| Kind | Required fields | Meaning and constraint |
| --- | --- | --- |
| `paragraph` | `text` | Prose. At most 700 characters. |
| `list` | `ordered`, `items` | 2–6 items. Each item at most 120 characters. |
| `code` | `filename`, `language`, `code`, `output` | One per lesson. Output label is "Sample output. Fixed data." |
| `callout` | `tone`, `text` | 2–4 per lesson. `title` is optional. Text at most 400 characters. |
| `diagram` | `diagram`, `caption`, `alt` | Only retrieval, agents and cost. Caption at most 120 characters. |
| `check` | `checkId` | Must match one entry in `lesson.checks`. |
| `task` | none | One per lesson. Content comes from `lesson.task`. |
| `widget` | `widget`, `caption` | Only on the retrieval and cost lessons. |
| `note` | `text` | One per lesson. At most 200 characters. |

### 3.3 Check, Task and ProveConfig

A check has a prompt of at most 200 characters. It has 3–4 options, one correct option id and an explanation of 2 or more sentences. A task has a scope of at most 160 characters, exactly 5 items and one solution. ProveConfig fixes the placeholder "I changed X; the result was Y.". It also fixes `maxLength` 280, `debounceMs` 800 and the saved message "Proof saved on this device.".

### 3.4 Layer and SampleMetrics

| Field | Type | Req | Meaning and constraint |
| --- | --- | --- | --- |
| `id` | `LayerId` | yes | Unique. Ordered `layer-01` to `layer-06`. |
| `order` | `number` | yes | 1–6. Matches course order. |
| `name` | `string` | yes | Spine label. At most 20 characters. |
| `lessonSlug` | `LessonSlug` | yes | Unique. One layer per lesson. |
| `startState` | `'broken'` | yes | All six layers start broken. |
| `baseline` | `SampleMetrics` | yes | Shared broken run: 41, 0.94, 2400. |
| `repaired` | `SampleMetrics` | yes | Declared result for this layer. |
| `passRate` | `number` | yes | Integer 0–100. Display with `%`. |
| `costPer1k` | `number` | yes | USD, 2 decimal places. |
| `p95Ms` | `number` | yes | Integer milliseconds. Display in seconds. |

The live state comes from progress. A layer is repaired when `lessons[slug].status === 'repaired'`.

### 3.5 ProgressState

| Field | Type | Req | Meaning and constraint |
| --- | --- | --- | --- |
| `version` | `1` | yes | Schema version. Only value 1 is valid. |
| `lessons` | `Record<string, LessonProgress>` | yes | Only saved lessons appear. Unknown slugs are dropped. |
| `lastLessonSlug` | `LessonSlug \| null` | yes | Last open lesson. Used by "Resume". |
| `lastSectionId` | `string \| null` | yes | Anchor of the active section. |
| `updatedAt` | ISO 8601 string | yes | Time of the last write. |
| `lessons[slug].status` | `'in-progress' \| 'repaired'` | yes | Set by the completion gate. |
| `lessons[slug].checkAnswers` | `Record<checkId, {selectedOptionId}>` | yes | Correctness is derived, never stored. |
| `lessons[slug].taskTicks` | `string[]` | yes | Ticked item ids. Unique. |
| `lessons[slug].proofNote` | `string` | yes | At most 280 characters. |
| `lessons[slug].repairedAt` | ISO 8601 string \| null | yes | Set once, on repair. |

## 4. Fixed sample data: six layers

Baseline for every layer: 41% pass, $0.94 per 1k requests, p95 2.4 s. The six nodes show this run while all layers are broken.

| Id | Order | Name | Lesson slug | Repaired pass | Repaired $/1k | Repaired p95 |
| --- | --- | --- | --- | --- | --- | --- |
| `layer-01` | 1 | Evaluation | `evaluation` | 49% | 0.92 | 2.3 s |
| `layer-02` | 2 | Prompt design | `prompt-contract` | 53% | 0.86 | 2.1 s |
| `layer-03` | 3 | Retrieval | `retrieval` | 58% | 0.71 | 1.4 s |
| `layer-04` | 4 | Agents | `agents` | 63% | 0.68 | 1.6 s |
| `layer-05` | 5 | Fine-tuning | `fine-tuning` | 72% | 0.79 | 1.1 s |
| `layer-06` | 6 | Cost | `cost` | 74% | 0.31 | 0.9 s |

The retrieval row matches the PRD. The other five rows are plausible fixed sample data.

Rule: the run panel shows the repaired metrics of the repaired layer with the highest order. It shows the baseline when no layer is repaired. This rule is a lookup, not a calculation. Values do not accumulate.

The header count is the number of lessons with `status === 'repaired'`.

## 5. Retrieval corpus

`RetrievalDoc` has four fields. `id` matches `^doc-\d{2}$`. `title` is at most 60 characters. `text` is one chunk of 1–3 sentences, at most 220 characters. `tags` holds 2–4 lowercase words. The text has no personal data.

Example record:

```ts
{ id: 'doc-07', title: 'Refund policy and return windows',
  text: 'Refunds are available within 30 days of delivery. The item must be unused. Shipping fees are not refunded.',
  tags: ['refunds', 'returns', 'policy'] }
```

| Id | Title and topic | Tags |
| --- | --- | --- |
| `doc-01` | Account access and password reset | accounts, access |
| `doc-02` | Billing cycles and invoice dates | billing, invoices |
| `doc-03` | Payment methods and failed charges | billing, payments |
| `doc-04` | Shipping options and delivery windows | shipping, delivery |
| `doc-05` | Late deliveries and lost parcels | shipping, delays |
| `doc-06` | Order changes and cancellations | orders, changes |
| `doc-07` | Refund policy and return windows | refunds, returns |
| `doc-08` | Return shipping labels | returns, labels |
| `doc-09` | Subscription plans and upgrades | accounts, plans |
| `doc-10` | International shipping and customs | shipping, customs |
| `doc-11` | Warranty claims and replacements | warranty, claims |
| `doc-12` | Contact channels and response times | support, contact |

Three preset queries. The widget trims and lowercases input. Only these labels return ranks. Any other query returns an empty result and the no-results state. A cleared field shows "Choose a sample query." and the three labels.

| Query | Rank 1 | Rank 2 | Rank 3 |
| --- | --- | --- | --- |
| `refund policy` | `doc-07` 0.91 | `doc-08` 0.74 | `doc-02` 0.61 |
| `billing` | `doc-02` 0.88 | `doc-03` 0.79 | `doc-09` 0.63 |
| `late delivery` | `doc-05` 0.92 | `doc-04` 0.70 | `doc-10` 0.55 |

Scores are fixed numbers with 2 decimals. Each list is strictly descending. Each row shows rank, score, chunk text and "Source: doc-07".

The no-results copy in the PRD names "refund". The preset label is "refund policy". The UI keeps the PRD string.

## 6. Cost and latency model

| Input | Default | Constraint |
| --- | --- | --- |
| `requestsPerDay` | 10,000 | Integer 1 or more. |
| `inputTokensPerRequest` | 1,000 | Integer 1 or more. |
| `outputTokensPerRequest` | 250 | Integer 1 or more. |
| `pricePerMillionTokens` | 0.75 | USD, greater than 0. |

Fixed constants: `retrievalMs` 400, `prefillMsPerToken` 0.6, `decodeMsPerToken` 5.6, `daysPerMonth` 30.

```text
costPerRequest = (inputTokens + outputTokens) * pricePerMillionTokens / 1_000_000
costPer1k      = costPerRequest * 1_000
monthlyCost    = costPerRequest * requestsPerDay * daysPerMonth
p95Ms          = retrievalMs + inputTokens * prefillMsPerToken + outputTokens * decodeMsPerToken
```

Worked example at defaults:

- Total tokens: 1,000 + 250 = 1,250.
- Cost per request: 1,250 × 0.75 / 1,000,000 = $0.0009375.
- Cost per 1k requests: $0.9375, shown as `$0.94`.
- Monthly cost: 0.0009375 × 10,000 × 30 = `$281.25`.
- Latency: 400 + 600 + 1,400 = 2,400 ms, shown as `2.4 s`.

At 10× traffic (100,000 requests per day), the monthly cost is `$2,812.50`. The cost per 1k stays `$0.94`, because traffic does not change it.

An empty, non-numeric, zero or negative input returns `null`. The UI then hides the result and shows the PRD error string. Rounding happens only at display time.

## 7. Progress schema and storage

The key is `lastminute.progress.v1`. The value is one JSON object with the shape in section 3.5. The module writes the full object after every change. The object stays below 8 KB.

Read rules, in order:

1. Call `getItem` in a try/catch. A missing key returns the empty state.
2. Parse the JSON in a try/catch. A parse error returns the empty state.
3. Reject a non-object value, a missing `version`, or a version other than `1`.
4. Drop unknown lesson slugs and unknown check ids.
5. Drop tick ids with no matching task item. Remove duplicate ticks.
6. Truncate `proofNote` to 280 characters.
7. Drop `lastSectionId` when that section is not in `lastLessonSlug`.
8. Replace an invalid `updatedAt` with the current time.

Corrupt JSON: the read returns the empty state in memory. The module shows no banner and does not throw. The next successful write replaces the bad value.

The storage call can throw. The module catches every failure, keeps state in memory for the session, and sets `available = false`. All features keep working. The UI shows "Progress cannot be saved in this browser. You can still read every lesson." After one failure, the module stops all storage calls for the session.

Migration: only version 1 exists. A future version adds a `migrate1to2` function and writes version 2. An unknown version reads as empty state. The module leaves the stored value untouched.

Reset: `removeItem` in a try/catch, then clear memory. Reset works when storage is unavailable.

The module reads only in the browser, after mount. Static output renders the empty state first, so hydration matches.

## 8. Sample content requirements per lesson

| Lesson | Words | Sections | Checks | Diagram | Minutes |
| --- | --- | --- | --- | --- | --- |
| `evaluation` | 700–1,000 | 5 | 2 | no | 10 |
| `prompt-contract` | 700–1,000 | 5 | 2 | no | 9 |
| `retrieval` | 1,900–2,100 | 8 | 3 | yes | 25 |
| `agents` | 700–1,000 | 4 | 2 | yes | 11 |
| `fine-tuning` | 700–1,000 | 4 | 2 | no | 10 |
| `cost` | 700–1,000 | 5 | 2 | yes | 9 |

Every lesson has one code block, one task with 5 items, one prove field, 2–4 callouts, one note block and one citation line. Total path time is 74 minutes. The retrieval lesson carries the retrieval widget. The cost lesson carries the cost calculator. Diagrams appear on retrieval, agents and cost only.

## 9. Data access rules

Two modules own all data access.

- `src/data/content.ts` is the only reader of content. It exports pure synchronous functions: `getCourse`, `getLesson`, `getLayers`, `getLayerForLesson`, `getMetrics`, `getRetrievalDocs`, `getPresetQueries`, `getCostModel`, `getMappingRows` and `getNeighbours`. It imports no React code.
- `src/data/progress.ts` is the only reader and writer of localStorage. It exports `readProgress`, `updateProgress`, `resetProgress`, `subscribe` and the `useProgress` hook. It catches every storage error.

Components receive content by import from `content.ts` and progress by `useProgress`. Widget input stays in component state and is not saved. No component calls `localStorage`, `sessionStorage` or `window` storage directly. A review check confirms this rule:

```text
rg -n "localStorage|sessionStorage" src --glob '!src/data/progress.ts'
```

The command must return no match.

## 10. Later Supabase seam

If Supabase is added later, only `src/data/progress.ts` changes. The module keeps its function names but returns promises, and an adapter swaps the localStorage body for table reads and writes. `content.ts` can move lessons to a table behind the same accessor signatures. No component changes, because components already use the hook and never touch storage.
