# Stage 5: Low-level design, content

The `content` module owns every fixed fact: six lessons, six layers, scores, retrieval documents,
preset queries, the cost model, mapping rows and planned topics. It provides pure lookups only.

## 1. Files

```text
content/index.ts                   public API, getters, dev assertion
content/scores.ts                  BASELINE, six LAYERS, scoreSummary
content/retrieval.ts               12 documents, 3 preset queries
content/cost-model.ts              defaults, constants, expected values
content/roadmap.ts                 four planned topics, no dates
content/lessons/evaluation.ts      lesson 1
content/lessons/prompt-contract.ts lesson 2
content/lessons/retrieval.ts       lesson 3, the flagship
content/lessons/agents.ts          lesson 4
content/lessons/fine-tuning.ts     lesson 5
content/lessons/cost.ts            lesson 6
content/validate.ts                dev-only validation, no page import
```

The shared types live in `lib/types.ts`. CU-1 adds the content type block to that file.

## 2. Public API

```ts
// content/index.ts
import type { Course, CostModel, Layer, LayerId, Lesson, LessonSlug,
  MappingRow, PresetQuery, RetrievalDoc, SampleMetrics } from '../lib/types';

export type Scores = SampleMetrics;
export function getCourse(): Course;
export function getLesson(slug: string): Lesson | undefined;
export function getLayers(): readonly Layer[];
export function getLayerForLesson(slug: LessonSlug): Layer | undefined;
export function getMetrics(
  layerId: LayerId,
): { baseline: SampleMetrics; repaired: SampleMetrics } | undefined;
export function getRetrievalDocs(): readonly RetrievalDoc[];
export function getPresetQueries(): readonly PresetQuery[];
export function getCostModel(): CostModel;
export function getMappingRows(): readonly MappingRow[];
export function getNeighbours(
  slug: LessonSlug,
): { previous: Lesson | null; next: Lesson | null };
export function scoreSummary(repaired: readonly LessonSlug[]): Scores;
```

Supporting types in `lib/types.ts`:

```ts
interface Course { lessons: readonly Lesson[]; totalMinutes: number; planned: readonly PlannedTopic[] }
interface RetrievalDoc { id: string; title: string; tags: readonly string[]; text: string }
interface PresetQuery { id: string; text: string; results: readonly { docId: string; score: number }[] }
interface MappingRow { id: string; aiIdea: string; engineeringIdea: string; lessonSlug: LessonSlug }
interface PlannedTopic { id: string; title: string }
```

`Layer` carries `id`, `order`, `name`, `lessonSlug`, `startState: 'broken'`, `baseline` and
`repaired`. `CostModel` carries `defaults`, `constants` and `expected`. Section 4 fixes both.

| Call | Return and failure |
| --- | --- |
| `getCourse` | Six lessons in order, 74 minutes, four planned topics. |
| `getLesson` | One lesson. An unknown slug returns `undefined`; the page calls `notFound()`. |
| `getLayers` | Frozen six layers. |
| `getLayerForLesson` | One layer. No match returns `undefined`. |
| `getMetrics` | Baseline and repaired pair. An unknown id returns `undefined`. |
| `getRetrievalDocs` | Frozen 12 documents. |
| `getPresetQueries` | Frozen 3 queries. |
| `getCostModel` | Frozen model. |
| `getMappingRows` | Frozen 4 rows. |
| `getNeighbours` | Previous and next lesson. First gives `previous: null`, last gives `next: null`, unknown slug gives both null. |
| `scoreSummary` | Baseline or one repaired pair. An empty list gives the baseline; duplicate slugs count once. |

All calls are synchronous and have no I/O. No function throws. `scoreSummary` filters the
repaired layers, picks the highest order and returns its repaired metrics. It is a lookup.

## 3. Lesson anatomy

```ts
interface Lesson {
  slug: LessonSlug; order: 1|2|3|4|5|6; title: string; outcome: string;
  artifact: string; readingMinutes: 9|10|11|25;
  difficulty: 'starter'|'core'|'advanced'; layerId: LayerId;
  sections: readonly Section[]; checks: readonly Check[]; task: Task;
  prove: ProveConfig; citation: string;
}
interface Section { id: string; title: string; blocks: readonly Block[] }
type Block =
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; ordered: boolean; items: readonly string[] }
  | { kind: 'code'; filename: string; language: string; code: string;
      output: { label: 'Sample output. Fixed data.'; text: string } }
  | { kind: 'callout'; tone: 'note'|'warning'|'production-tip'; text: string }
  | { kind: 'diagram'; id: 'retrieval-flow'|'agent-loop'|'cost-budget'; caption: string; takeaway: string }
  | { kind: 'checks'; ids: readonly string[] }
  | { kind: 'task' }
  | { kind: 'widget'; widget: 'retrieval-explorer'|'cost-calculator' }
  | { kind: 'note'; text: string };
interface Check { id: string; prompt: string; options: readonly {id: string; label: string}[];
  correctOptionId: string; explanation: string }
interface Task { id: string; scope: string; items: readonly [string,string,string,string,string];
  solution: { filename: string; language: string; code: string } }
interface ProveConfig { placeholder: string; maxLength: 280 }
```

| Element | Rule |
| --- | --- |
| Sections | 3 to 8; retrieval has 8. Read first; Check, Build and Prove follow in order. |
| Section ids | `^[a-z][a-z0-9-]{0,40}$`, unique in the lesson. |
| Checks | 2 per lesson, 3 on retrieval. 3 or 4 options with one correct id. |
| Explanations | 2 sentences or more. A wrong answer names the correct idea. |
| Task | One scope sentence, exactly 5 items and one solution. |
| Blocks | One code block with label `Sample output. Fixed data.` One note block. |
| Diagram | Exactly one on retrieval, agents and cost. None elsewhere. |
| Lengths | Citation one line, 160 characters or fewer. Prose 700 to 1,000 words; retrieval 1,800 to 2,200. |
| Widget | Retrieval explorer only in retrieval. Cost calculator only in cost. |

Retrieval flagship, eight sections:

1. `read-the-feature`: Read: one broken triage feature
2. `read-the-index`: Read: chunks, vectors and top-k
3. `trace-one-query`: Trace one query
4. `check-the-ranking`: Check: rank the candidates
5. `build-the-fix`: Build: repair the ranking
6. `run-the-explorer`: Run the explorer
7. `check-the-limit`: Check: name the limit
8. `prove-the-change`: Prove: state your change

Short `cost` lesson, six sections:

1. `read-the-bill`: Read: the bill that surprises
2. `read-two-clocks`: Read: cost and latency
3. `draw-the-budget`: Draw the budget
4. `check-the-levers`: Check: choose the lever
5. `build-the-budget`: Build: set the budget
6. `prove-the-saving`: Prove: name the saving

## 4. Frozen sample data

Baseline: **41% pass, $0.94 per 1k, p95 2.4 s**. The minutes total 74. All lessons use `core`;
retrieval uses `advanced`.

```text
layer-01 evaluation       10 min  49%  0.92  2.3 s
layer-02 prompt-contract   9 min  53%  0.86  2.1 s
layer-03 retrieval        25 min  58%  0.71  1.4 s
layer-04 agents           11 min  63%  0.68  1.6 s
layer-05 fine-tuning      10 min  72%  0.79  1.1 s
layer-06 cost              9 min  74%  0.31  0.9 s
```

Retrieval documents:

```text
doc-01 Account recovery: account, sign-in, security
doc-02 Billing cycles: billing, invoice, payments
doc-03 Payment methods: payments, cards, retries
doc-04 Shipping options: shipping, tracking, delivery
doc-05 Late deliveries: delivery, delays, support
doc-06 Orders and changes: orders, changes, support
doc-07 Refunds and returns: refunds, returns, policy
doc-08 Return labels: labels, returns, shipping
doc-09 Plans and seats: plans, billing, seats
doc-10 Customs and import fees: customs, fees, shipping
doc-11 Warranty and repairs: warranty, repairs, support
doc-12 Contact and hours: contact, support, hours
```

Text style: 1 to 3 sentences of 220 characters or fewer. Use present tense and one topic per
document. Reuse words from the tags. No personal data, price quote or marketing claim. Example
`doc-07`: "Refunds are available within 30 days of delivery. The item must be unused and in the
original packaging. Start a return from the order page."

| Query | Rank 1 | Rank 2 | Rank 3 |
| --- | --- | --- | --- |
| `q-refund` `refund policy` | `doc-07` 0.91 | `doc-08` 0.74 | `doc-02` 0.61 |
| `q-billing` `billing` | `doc-02` 0.88 | `doc-03` 0.79 | `doc-09` 0.63 |
| `q-late` `late delivery` | `doc-05` 0.92 | `doc-04` 0.70 | `doc-10` 0.55 |

Other input returns the no-results state. The widget owns that state.

```text
defaults:  10,000 requests/day; 1,000 input tokens; 250 output tokens; $0.75 per 1M
constants: 400 ms retrieval; 0.6 ms/token prefill; 5.6 ms/token decode; 30 days
costPerRequest = (input + output) * pricePerM / 1_000_000
costPer1k      = costPerRequest * 1_000
monthlyCost    = costPerRequest * requestsPerDay * 30
p95Ms          = 400 + input * 0.6 + output * 5.6
```

The defaults give `0.0009375`, `0.9375` (`$0.94`), `281.25` (`$281.25`) and `2400` (`2.4 s`).
Ten times the traffic gives `$2,812.50`.

## 5. Validation rules and the build check

`content/validate.ts` exports `validateContent(data): string[]` and `assertContent(data): void`.
The input is a snapshot of the public getters. It imports `lib/types.ts` only, so it forms no
cycle with `index.ts`.

| Check | Rule |
| --- | --- |
| Slugs and order | Six in course order, pattern `^[a-z][a-z0-9-]*$`. `order` is 1 to 6; each layer maps to one lesson. |
| Sections | 3 to 8; retrieval 8. Ids unique and match `^[a-z][a-z0-9-]{0,40}$`. |
| Checks | 2 per lesson, 3 on retrieval. 3 or 4 options, one valid `correctOptionId`, explanation of 2 sentences or more. |
| Task | Exactly 5 items. Scope, filename, language and code are not empty. |
| Blocks | One code block with the exact label. Diagram count 1 on retrieval, agents and cost, else 0. One note. |
| Lengths | Citation 160 characters or fewer on one line. Prose 700 to 1,000 words; retrieval 1,800 to 2,200. |
| Retrieval | 12 unique docs, text 220 characters or fewer, tags 2 to 4 lowercase words. 3 queries with 3 descending results; every doc id exists. |
| Numbers and mapping | 6 layers, 74 minutes, baseline 41/0.94/2400, `scoreSummary([])` equals baseline, cost defaults match the formula. 4 mapping rows with valid slugs. |

`content/index.ts` calls the assertion under a guard:

```ts
if (process.env.NODE_ENV === 'development' || process.env.CONTENT_VALIDATE === '1') {
  assertContent({ course: getCourse(), layers: getLayers(), docs: getRetrievalDocs(),
    queries: getPresetQueries(), model: getCostModel() });
}
```

- `npm run dev` checks on each start; `CONTENT_VALIDATE=1 npm run build` fails on a violation.
- The assertion throws one `Error` with one line per fault, for example
  `content: duplicate section id "check-x" in lesson "retrieval"`.

The project uses no test framework and adds no package.

## 6. Consumption rules

- Every export is data or a pure function. Content imports only `lib/types.ts`.
- Content does not import React, Next, a hook, `window`, `document` or `localStorage`.
- `Object.freeze` freezes every array and object. Lessons use `as const satisfies Lesson`.
- Outside the module, code imports only `content/index.ts`. The direction is
  `index -> data files -> lib/types.ts`; data files never import `index.ts`.
- Data is serializable: no class, function or `Date`, and no `Math.random`, `Date.now` or
  `fetch`. Server HTML and client HTML agree.

## 7. Build units

| Id | Owns | Depends on | Done line |
| --- | --- | --- | --- |
| CU-1 | `lib/types.ts` content block, `content/index.ts` v1, `content/scores.ts`, `content/validate.ts` | U0 | `tsc --noEmit` passes. `scoreSummary([])` = 41/0.94/2400; `scoreSummary(['retrieval'])` = 58/0.71/1400. |
| CU-2 | `content/retrieval.ts`, `content/cost-model.ts`, `content/roadmap.ts`; retrieval and cost getters | CU-1 | 3 queries resolve every doc id; the formula gives 0.9375, 281.25 and 2400. |
| CU-3 | `content/lessons/evaluation.ts`, `prompt-contract.ts`, `retrieval.ts` | CU-1, CU-2 | 3 files pass the lesson rules; retrieval has 8 sections, 3 checks, 5 items, 1 diagram, 1 note, 1 code block. |
| CU-4 | `content/lessons/agents.ts`, `fine-tuning.ts`, `cost.ts`; final lesson wiring in `index.ts` | CU-3 | `CONTENT_VALIDATE=1 npm run build` passes; `getCourse()` = 6 lessons, 74 minutes; 11 exports exist. |

`index.ts` grows in append-only steps. CU-1 creates layers, metrics, mapping and scores. CU-2
adds retrieval and cost getters. CU-4 adds `getCourse`, `getLesson` and `getNeighbours` after the
six lessons exist.

## 8. Risks

| Risk | Mitigation |
| --- | --- |
| Content accuracy and word budget | Cite one source per lesson; validate the word count against these outlines; label all numbers as sample data. |
| Duplicate ids and inconsistent numbers | Use prefixes and validate uniqueness. Keep scores and cost in one file each; cross-check totals and the formula. |
| Scope creep or skipped check | Validate exact counts. Run `CONTENT_VALIDATE=1 npm run build` in the quality wave and record it in the README. |

