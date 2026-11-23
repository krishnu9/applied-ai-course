# Stage 5 — Low-level design (combined)

Sources: `5-lld/content.md`, `5-lld/progress.md`, `5-lld/lesson.md`, `5-lld/widgets.md`,
`5-lld/shell.md`. This document is the build contract. Where the parts disagree on a shared type,
section 2 is canonical and section 12 records the decision. `4-hld.md` and `3-prd.md` still bind
behaviour, tokens and scope.

## 1. Module map

| Module | Public entry | Owns |
| --- | --- | --- |
| `lib` | `lib/types.ts`, `lib/cn.ts`, `lib/format.ts` | shared types and helpers |
| `content` | `content/index.ts` | six lessons, layers, scores, retrieval data, cost model, roadmap |
| `progress` | `lib/progress/index.ts` | store, storage adapter, provider, selectors |
| `widgets` | `components/widgets/index.ts` | retrieval explorer, cost calculator, pure functions |
| `shell` | `components/shell/index.ts`, `components/ui/index.ts` | layout, chrome, spine, UI primitives |
| `lesson` | `components/lesson/index.ts` | reader, checks, task, prove, repair, TOC |
| `app` | route files | composition only: home, lesson route, roadmap, about, 404 |

Allowed imports: `app` → all; `lesson` → `content`, `progress`, `widgets`, `shell`, `lib`;
`widgets` → `content`, `shell`, `lib`; `shell` → `content`, `progress`, `lib`; `progress` and
`content` → `lib`; `lib` → nothing. No module imports another module's internal file. Only
`lib/progress/storage.ts` calls localStorage.

## 2. Canonical types (`lib/types.ts`)

```ts
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
```

`passRate` is a fraction from 0 to 1 (0.41 shows as 41%). `costPer1k` is USD. `p95Ms` is
milliseconds. `taskTicks` holds `TaskItemId` values only. Correctness is never stored.

## 3. Public APIs

```ts
// content/index.ts
getCourse(): Course
getLesson(slug: string): Lesson | undefined
getLayers(): readonly Layer[]
getLayerForLesson(slug: LessonSlug): Layer | undefined
getMetrics(layerId: LayerId): { baseline: SampleMetrics; repaired: SampleMetrics } | undefined
getRetrievalDocs(): readonly RetrievalDoc[]
getPresetQueries(): readonly PresetQuery[]
getCostModel(): CostModel
getMappingRows(): readonly MappingRow[]
getPlannedTopics(): readonly PlannedTopic[]
getNeighbours(slug: LessonSlug): { previous: LessonSummary | null; next: LessonSummary | null }
scoreSummary(repaired: readonly LessonSlug[]): SampleMetrics

// lib/progress/index.ts
ProgressProvider({ children }): ReactElement
useProgress(): ProgressApi
type ProgressApi = {
  state: ProgressState; ready: boolean; storage: 'ok' | 'unavailable';
  repair(slug: LessonSlug): void;
  setCheck(slug: LessonSlug, checkId: string, selectedOptionId: string): void;
  toggleTask(slug: LessonSlug, itemId: TaskItemId): void;
  setProof(slug: LessonSlug, text: string): void;
  setPosition(slug: LessonSlug, sectionId: string): void;
  reset(): void;
};
isRepaired(state, slug): boolean;  isCheckCorrect(lesson, state, checkId): boolean;
canRepair(lesson, state): boolean; repairedCount(state): number;
resumeTarget(state): { slug: LessonSlug; sectionId: string | null } | null;

// components/widgets/index.ts
RetrievalExplorer({ docs, presets, caption? }): ReactElement
CostCalculator({ model, caption? }): ReactElement
rankDocuments(query, docs, presets): { status: 'empty'|'results'|'no-match';
  hits: { rank: number; docId: string; score: number; text: string; source: string }[] }
estimateCost(inputs: CostNumbers, model: CostModel): CostResult | null
```

`scoreSummary` returns the repaired pair with the highest layer order, or the baseline. It is a
lookup. `getNeighbours` returns `null` at each end. All content calls are synchronous and throw
nothing.

## 4. Content design

Files: `content/index.ts`, `scores.ts`, `retrieval.ts`, `cost-model.ts`, `roadmap.ts`,
`lessons/{evaluation,prompt-contract,retrieval,agents,fine-tuning,cost}.ts`, `validate.ts`.

Frozen data: baseline `0.41 / 0.94 / 2400`. Layers:

| Id | Lesson | Min | Repaired pass | $/1k | p95 ms |
| --- | --- | --- | --- | --- | --- |
| layer-01 | evaluation | 10 | 0.49 | 0.92 | 2300 |
| layer-02 | prompt-contract | 9 | 0.53 | 0.86 | 2100 |
| layer-03 | retrieval | 25 | 0.58 | 0.71 | 1400 |
| layer-04 | agents | 11 | 0.63 | 0.68 | 1600 |
| layer-05 | fine-tuning | 10 | 0.72 | 0.79 | 1100 |
| layer-06 | cost | 9 | 0.74 | 0.31 | 900 |

Retrieval docs: `doc-01` Account recovery; `doc-02` Billing cycles; `doc-03` Payment methods;
`doc-04` Shipping options; `doc-05` Late deliveries; `doc-06` Orders and changes; `doc-07` Refunds
and returns; `doc-08` Return labels; `doc-09` Plans and seats; `doc-10` Customs and import fees;
`doc-11` Warranty and repairs; `doc-12` Contact and hours. Text: 1–3 sentences, 220 characters or
fewer, present tense, no personal data.

Presets: `refund policy` → doc-07 0.91, doc-08 0.74, doc-02 0.61; `billing` → doc-02 0.88,
doc-03 0.79, doc-09 0.63; `late delivery` → doc-05 0.92, doc-04 0.70, doc-10 0.55.

Cost: defaults 10,000 requests/day, 1,000 input, 250 output, $0.75 per 1M; constants 400 ms,
0.6 ms/prefill token, 5.6 ms/decode token, 30 days.

Lesson rules: 3–8 sections (retrieval 8); Read, Check, Build, Prove in that order; 2 checks
(retrieval 3), 3–4 options, explanation of 2 or more sentences; 5 task items; one code block with
exact output label; one note block; one diagram on retrieval, agents and cost only; one citation
line of 160 characters or fewer; 700–1,000 words (retrieval 1,800–2,200).

`content/validate.ts` exports `validateContent` and `assertContent`. `content/index.ts` calls
`assertContent` when `NODE_ENV === 'development'` or `CONTENT_VALIDATE === '1'`. It checks slugs,
order, counts, ids, lengths, layers, minutes, docs, presets, formula values and mapping rows.
`CONTENT_VALIDATE=1 npm run build` must pass.

## 5. Progress design

Files: `lib/progress/{storage,store,context,selectors,index}.ts(x)`.

Storage: key `lastminute.progress.v1`; 8 KB cap; one module-level `available` flag that stops all
storage after the first failure. Read pipeline: getItem try/catch → JSON parse try/catch → reject a
non-object or version ≠ 1 → drop unknown slugs, bad check ids (cap 3), unmatched or duplicate
ticks → truncate note to 280 → validate `lastSectionId` and `updatedAt`. Corrupt JSON returns an
empty state with status `ok` and no banner; the next write replaces it. A storage throw returns
empty/unavailable, keeps memory state and shows the banner.

Store: one frozen `EMPTY_SNAPSHOT` used as the server snapshot and first client snapshot; immutable
snapshots; `useSyncExternalStore`; an action that changes nothing returns the same snapshot and
writes nothing. Actions: `repair`, `setCheck`, `toggleTask`, `setProof`, `setPosition`, `reset`.
Actions are ignored before `ready`. A slug change clears `lastSectionId`. A repaired entry stays
repaired.

Provider: `ProgressProvider` creates the store once with `useRef`, reads via `useSyncExternalStore`,
calls `hydrate()` in `useEffect`, and provides `ProgressApi`. `useProgress` outside the provider
throws `useProgress must be used inside ProgressProvider.` Hydration: server HTML and first client
paint show "0 of 6 layers repaired"; storage is read after mount only.

Selectors: `canRepair` requires every check correct, all five `TaskItemId` ticks, a non-empty
trimmed note, and `status !== 'repaired'`. `repairedCount` counts repaired entries. `resumeTarget`
returns the last lesson and section or null. No selector reads storage or the clock.

## 6. Lesson design

Files: `components/lesson/{index,LessonArticle,LessonHeader,MetaRow,SectionRenderer,BlockRenderer,
Prose,Callout,CodeBlock,OutputPanel,CopyButton,Diagram,CheckBlock,TaskChecklist,ProveNote,
RepairButton,LessonToc,LessonPosition,PrevNext,LessonKeyboardNav}.tsx` and
`app/lessons/[slug]/page.tsx`.

Server components: article, header, meta, section, block map, prose, callout, code, output, diagram,
prev/next. Client: `CopyButton`, `CheckBlock`, `TaskChecklist`, `ProveNote`, `RepairButton`,
`LessonToc`, `LessonPosition`, optional `LessonKeyboardNav`.

Render map: paragraph/list → `Prose`; code → `CodeBlock` (with `CopyButton`, `OutputPanel`);
callout → `Callout`; diagram → `Diagram` (inline SVG from `spec`); check → `CheckBlock` (look up
`lesson.checks` by `checkId`); task → `TaskChecklist`; widget → public widget; note → `Callout`
tone note. Unknown block → "This block is not available." The switch ends with a `never` check.

Check: controlled selection, Submit disabled until a choice, a correct answer shows "Correct." with
the explanation and disables options; a wrong answer shows "Not quite." with the explanation and
"Try again". Focus moves to the feedback heading after a user submit. The verdict derives from the
stored `selectedOptionId` plus `correctOptionId` and returns after reload.

Task: five native checkboxes with `TaskItemId`s, counter "{n} of 5 steps done", ticks call
`toggleTask` at once, solution disabled below 5/5, opens with "Show reference solution" and closes
with "Hide".

Prove: controlled textarea capped at 280, 800 ms debounce, flush on blur/unmount, live region
"Proof saved on this device." (or "Proof saved for this session." when storage is unavailable),
blank clears the note.

Repair: gate as in section 5; disabled with helper "Pass every check, tick all 5 steps and write a
proof note."; on repair the node turns green, the header count moves, the numbers roll and the
trace plays, unless reduced motion is set.

TOC: IntersectionObserver, active link `aria-current`, click scrolls and focuses the H2
(`tabIndex={-1}`); phone disclosure. Position: one write per second on section change after
`ready`; restore once only when `lastLessonSlug` matches and the URL has no hash.

Route: `dynamicParams = false`, `generateStaticParams` over six lessons, `await params`,
`getLesson`, `notFound()` on a miss, per-lesson metadata. `app/not-found.tsx` gives SCR-00 with
status 404 in the static export.

## 7. Widgets design

Files: `components/widgets/{rank,cost,RetrievalExplorer,CostCalculator,index}.ts(x)`.

`rankDocuments`: normalise with trim + lowercase; empty query → `empty`; match the first preset by
exact normalised query; map and dedupe results, highest score wins; sort by score descending then
id; else `no-match`. Scores format with `toFixed(2)`.

`estimateCost`: parse numeric fields (`requestsPerDay` and `inputTokens` integers ≥1,
`outputTokens` integer ≥0, `pricePerM` >0); any failure returns null and the field message
("Enter at least 1 request.", etc.); compute with full precision; no rounding inside the function.

Retrieval explorer: query field, three preset buttons, states empty/results/no-match, ranked rows
with rank, score, chunk text, `Source: doc-07`; keyboard row navigation; live result count; 12
documents in a `<details>`. No-results copy: "No results for that query. Try 'refund policy' or
'billing'."

Cost calculator: four controlled text inputs with `inputMode`, defaults from the model, results
`<dl>` with cost per 1k, monthly cost, p95; invalid state shows "—" and the exact message, keeps
layout, `aria-invalid`; a visible "Sample" badge always stays.

Both widgets are client components, deterministic, no network, no storage, no time, width
`w-full min-w-0`, rows stack at 390 px, 44 px targets.

## 8. Shell design

Files: `app/layout.tsx`, `app/globals.css`, `components/ui/*`, `components/shell/*`, plus the page
files in section 9.

`globals.css`: `@import "tailwindcss"` (v4); the token block from `4-hld.md` verbatim; `next/font`
variable stacks; base layer with body, selection, focus-visible, headings, code, scroll margins and
reduced motion; the spine trace and score-in keyframes. Components use token references only. Hex
values exist only in the `:root` block.

`app/layout.tsx`: `lang="en"`, metadata (default title "lastminute.dev — Repair one broken AI
feature. Watch the score climb.", template `%s — lastminute.dev`, description "Six short lessons.
One afternoon. No login."), three `next/font/google` families, SkipLink, SiteHeader, StorageBanner,
one `main#main`, SiteFooter, and the `ProgressProvider` mount inside marked comments. The provider
line is the only edit point owned by the progress module.

Primitives: `Button` (primary/secondary/quiet, `min-h-11`, disabled 40%), `Badge` (tone plus word),
`Panel`, `Prose` (serif, 68ch), `Rule`, `LiveRegion`, `EmptyState`.

Spine: client; six nodes from content; broken/repaired from progress; current from `usePathname`;
"Start here" on retrieval; each node shows state word and pass/cost/p95; the block is a labelled
nav with the visible label "Sample evaluation. Fixed data."; the trace seeds on the first ready
render and plays once per new repair.

Header: client (`usePathname`); wordmark links home; Roadmap and About links with
`aria-current="page"`; `HeaderProgress` reads "N of 6 layers repaired" ("N/6" below 768 px).
Footer: disclaimer, citation note, "© 2026 lastminute.dev". StorageBanner: always mounted polite
region, exact PRD copy.

## 9. Pages (build unit U6)

- Home: hero H1 "Repair one broken AI feature. Watch the score climb.", promise "Six short lessons.
  One afternoon. No login.", `HomeAction` (primary "Start with lesson 1" → `/lessons/evaluation`;
  "Resume lesson" when saved; secondary "Fix retrieval first"; quiet "See the roadmap"),
  `RunPanel` (baseline 41%, $0.94/1k, 2.4 s, label "Sample evaluation. Fixed data.", empty line
  "No layers repaired yet. Start with retrieval."), `Spine`, `MappingPanel` (4 links), `LoopRow`,
  `LessonLedger` (6 rows).
- Roadmap: H1 "The path", "Six lessons. 74 minutes in total." computed from lesson data, six rows
  with Done/In progress/Not started, "Planned, not in this demo" with four topics, `RoadmapAction`,
  `ResetProgress`.
- About: H1 "About this course", disclaimer, method, sample-data note, citation policy, privacy
  note, stack line, "Start lesson 1".
- 404: H1 "This lesson does not exist.", "Check the URL or open the roadmap.", links "Open the
  roadmap" and "Back to course".

## 10. Build units and ownership

| Unit | Name | Owns | Depends on | Done line |
| --- | --- | --- | --- | --- |
| U0 | Foundation | scaffold, config, `app/globals.css` tokens, `app/layout.tsx` shell without provider, `lib/{types,cn,format}.ts`, `components/ui/**`, `content/index.ts` stub with empty getters, one sample lesson, home placeholder, dev server | — | `npm run build` passes; `/` opens; tokens are the only hex values |
| U1 | Content | `content/**` (CU-1…CU-4) | U0 | `CONTENT_VALIDATE=1 npm run build` passes; 6 lessons, 74 min, scoreSummary checks |
| U2 | Progress | `lib/progress/**` + provider mount line | U0 | `localStorage` appears in one file; reload restores a tick; blocked storage shows the banner |
| U3 | Widgets | `components/widgets/**` | U0, U1 types | `refund policy` → doc-07/08/02; defaults → $0.94, $281.25, 2.4 s; 10× → $2,812.50 |
| U4 | Shell chrome | `components/shell/**` | U0, U1, U2 | home and lesson show the spine, 6 nodes, "0 of 6", label; build passes |
| U5 | Lesson | `components/lesson/**`, `app/lessons/[slug]/page.tsx` | U0, U1, U2, U3, U4 | six lesson pages and `404.html`; check, task, prove, repair work; reload restores |
| U6 | Pages | `app/page.tsx`, `components/home/**`, `app/roadmap/page.tsx`, `components/roadmap/**`, `app/about/page.tsx`, `app/not-found.tsx` | U0–U5 | home, roadmap, about and 404 match the PRD; build passes |
| U7 | Quality | no production files; defect log and fixes through owners | all | `npm run build`, console clean, 390/768/1440 screenshots, PRD checklist |

Parallel plan: U0 alone; then U1, U2 and U3 side by side; then U4 and U5 side by side; then U6.
U2 is the only unit besides U0 that edits `app/layout.tsx`, and only between the provider markers.
U5 wires the widgets; U3 does not edit lesson files. U6 does not edit shell or lesson files.

## 11. Verification per unit

- `npx tsc --noEmit` and `npm run build` after every unit.
- Content: `CONTENT_VALIDATE=1 npm run build`; count lessons, minutes, docs, presets.
- Progress: a reload keeps a tick and a note; a blocked-storage browser shows the banner and every
  route still renders.
- Widgets: the three presets, defaults, 10× traffic and invalid input.
- UI: no horizontal page scroll at 390, 768 and 1440; focus ring visible; one h1 per page.
- Repair flow: gate closed until checks + 5 ticks + note; after repair the node is green, 58%,
  $0.71/1k, 1.4 s; after reload it stays.

## 12. Conflicts resolved

| Topic | Parts | Decision |
| --- | --- | --- |
| Block `id` | content blocks had none; lesson needs one | **Every block has `id`** |
| Check block kind | `checks` + `ids` vs `check` + `checkId` | **`{ kind: 'check'; id; checkId }`**, one check per block |
| Widget ids | `retrieval-explorer` / `retrieval` | **`retrieval-explorer` and `cost-calculator`** |
| Task items | strings vs `{label}` vs `${task.id}:${index}` ticks | **`{ id: TaskItemId; label: string }`; ticks are `item-1` … `item-5`** |
| Retrieval doc | 3 fields vs 4 | **`{ id, title, tags, text }`** |
| Preset query | `text` vs `query` | **`{ id, query, results }`** |
| Cost model | flat vs nested | **Nested `defaults`/`constants`/`expected`; `estimateCost` takes `CostNumbers`** |
| passRate | 0–100 vs 0–1 | **Fraction 0–1; format to percent for display** |
| Diagram data | caption/takeaway vs nodes/edges | **`spec.nodes` + `spec.edges` + `caption` + `alt`** |
| Section field | `heading` vs `title` | **`title`** |
| Neighbours | `prev/next Lesson` vs summary | **`LessonSummary` or null** |
| p95 format | `2.4 s` vs `2.40 s` | **One decimal everywhere** (`2.4 s`) |
| No-results copy | "Try 'refund' or 'billing'" | **"Try 'refund policy' or 'billing'."** |
| Pages owner | shell LLD included pages; HLD had U6 | **Separate U6 pages unit** so shell and lesson stay focused |
| Proof save copy | PRD "Saved" vs LLD strings | **"Proof saved on this device."** (session variant when storage is unavailable) |
