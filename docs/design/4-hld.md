# Stage 4 — High-level design (combined)

Sources: `4-hld/architecture.md`, `4-hld/data.md`, `4-hld/ux.md`.
The PRD (`3-prd.md`) is binding for behaviour. This document fixes stack, modules, data, tokens
and build units for stage 5.

## 1. Stack

| Concern | Decision |
| --- | --- |
| Framework | Next.js App Router (latest stable at scaffold), TypeScript `strict` |
| Styling | Tailwind CSS with one token block in `app/globals.css` |
| Package manager | npm; commit `package-lock.json` |
| Runtime | Node 22 LTS (`.nvmrc`, `engines`) |
| Output | `output: 'export'`, static `out/`; Vercel zero configuration |
| Data | Typed static content plus one localStorage record |
| Server | None: no API routes, no database, no auth, no external request |
| Fonts | `next/font/google` (Source Serif 4, JetBrains Mono, Inter), self-hosted at build, system fallbacks |
| Tests | Build, type check and browser QA. Optional `node:test` for the two pure widget functions. |

No Supabase: no login, no shared state, no server writes. The progress module is the only seam.

## 2. Rendering

All routes are static. Pages are server components. `app/lessons/[slug]/page.tsx` uses
`generateStaticParams()` and `dynamicParams = false`, and calls `notFound()` for an unknown slug.

Client components (complete list):
`ProgressProvider`, `StorageBanner`, `HeaderProgress`, `Spine`, `ResetProgress`, `RunPanel`,
`HomeAction`, `LessonLedger`, `CheckBlock`, `TaskChecklist`, `ProveNote`, `RepairButton`,
`LessonToc`, `CopyButton`, `LessonPosition`, `RoadmapTable`, `RoadmapAction`, `RetrievalExplorer`,
`CostCalculator`. Optional P2: `SearchDialog`.

Everything else is a server component. Render code never calls `Math.random`, `Date.now`,
`new Date` or `crypto.randomUUID`; control ids use `useId`.

## 3. Modules and contracts

| Module | Purpose | Public surface | Owns | Depends on |
| --- | --- | --- | --- | --- |
| `lib` | Shared kernel | types, `cn`, format helpers | `lib/types.ts`, `lib/cn.ts`, `lib/format.ts` | nothing |
| `content` | All fixed facts | `getCourse`, `getLesson`, `getLayers`, `getLayerForLesson`, `getMetrics`, `getRetrievalDocs`, `getPresetQueries`, `getCostModel`, `getMappingRows`, `getNeighbours`, `scoreSummary` | `content/**` | `lib` |
| `progress` | Reader state and persistence | `ProgressProvider`, `useProgress`, `readProgress`, `resetProgress` | `lib/progress/**` | `lib` |
| `shell` | Chrome and primitives | `SiteHeader`, `SiteFooter`, `Spine`, `StorageBanner`, `Button`, `Badge`, `Panel`, `Prose`, `Rule` | `app/layout.tsx`, `app/globals.css`, `components/shell/**`, `components/ui/**` | `content`, `progress`, `lib` |
| `lesson` | Reader and learning loop | `LessonArticle`, `CheckBlock`, `TaskChecklist`, `ProveNote`, `RepairButton`, `LessonToc`, `CopyButton` | `components/lesson/**`, `app/lessons/[slug]/page.tsx` | `content`, `progress`, `widgets`, `shell`, `lib` |
| `widgets` | Two deterministic tools | `RetrievalExplorer`, `CostCalculator`, `rankDocuments`, `estimateCost` | `components/widgets/**` | `content`, `shell`, `lib` |

`app/` is the composition root (`page.tsx`, `roadmap/page.tsx`, `about/page.tsx`,
`not-found.tsx`, `lessons/[slug]/page.tsx`) and holds no logic. `components/ui/**` is a leaf:
it imports `lib/cn.ts` only. No module imports another module's internal file. Each module has one
`index.ts`.

### Progress API

```ts
type ProgressApi = {
  state: ProgressState;
  ready: boolean;
  storage: 'ok' | 'unavailable';
  repair(slug: LessonSlug): void;
  setCheck(slug: LessonSlug, checkId: string, selectedOptionId: string): void;
  toggleTask(slug: LessonSlug, itemId: string): void;
  setProof(slug: LessonSlug, text: string): void;
  setPosition(slug: LessonSlug, sectionId: string): void;
  reset(): void;
};
```

### Data flow: repair a layer

1. `app/layout.tsx` mounts `ProgressProvider` with the frozen empty snapshot; server HTML shows
   "0 of 6 layers repaired".
2. After mount, the provider reads storage in try/catch, validates `version === 1`, and publishes
   the snapshot.
3. `RepairButton` reads the gate: all checks correct, 5 ticks, non-empty note.
4. On click it calls `repair(slug)`; the store builds the next snapshot, writes JSON and notifies.
   A failed write keeps memory state and sets `storage: 'unavailable'`.
5. `Spine`, `HeaderProgress`, `RunPanel`, `LessonLedger` and `RoadmapTable` re-render.
6. `RunPanel` calls `scoreSummary(repaired)` from content: the repaired metrics of the repaired
   layer with the highest order, or the baseline when none is repaired. This is a lookup, not an
   accumulation.
7. Reload repeats steps 1–2; repair, note and position return.

## 4. Directory tree

```text
lastminute-dev/
  app/
    layout.tsx                 # root layout, provider, skip link
    globals.css                # Tailwind import + design tokens
    page.tsx                   # SCR-01 home
    not-found.tsx              # SCR-00, 404
    roadmap/page.tsx
    about/page.tsx
    lessons/[slug]/page.tsx
  components/
    ui/                        # Button, Badge, Panel, Prose, Rule, LiveRegion
    shell/                     # SiteHeader, SiteFooter, Spine, SpineNode, StorageBanner, ...
    lesson/                    # LessonArticle, CheckBlock, TaskChecklist, ProveNote, ...
    widgets/                   # RetrievalExplorer, CostCalculator, rank, cost
    home/                      # RunPanel, MappingPanel, LoopRow, LessonLedger, HomeAction
    roadmap/                   # RoadmapTable, RoadmapAction, RoadmapIntro
  lib/
    types.ts                   # the only shared types file
    cn.ts
    format.ts
    progress/                  # store.ts, storage.ts, context.tsx, selectors.ts, index.ts
  content/
    index.ts
    scores.ts                  # six layers, baseline and repaired metrics, scoreSummary
    lessons/                   # evaluation.ts, prompt-contract.ts, retrieval.ts,
                               # agents.ts, fine-tuning.ts, cost.ts
    retrieval.ts               # 12 docs + 3 preset queries
    cost-model.ts              # calculator defaults and constants
    roadmap.ts                 # planned topics
  public/favicon.svg
  .env.example                 # one comment: no env vars required
  .nvmrc
  next.config.ts
  package.json
  package-lock.json
  tsconfig.json
  postcss.config.mjs
```

## 5. Data model

One type file: `lib/types.ts`. Key types:

```ts
type LessonSlug = 'evaluation' | 'prompt-contract' | 'retrieval' | 'agents' | 'fine-tuning' | 'cost';
type LayerId = 'layer-01' | ... | 'layer-06';

interface Lesson {
  slug: LessonSlug; order: 1|2|3|4|5|6; title: string; outcome: string; artifact: string;
  readingMinutes: number; difficulty: 'starter' | 'core' | 'advanced'; layerId: LayerId;
  sections: Section[]; checks: Check[]; task: Task; prove: ProveConfig; citation: string;
}
type Block = ParagraphBlock | ListBlock | CodeBlock | CalloutBlock | DiagramBlock
           | CheckBlock | TaskBlock | WidgetBlock | NoteBlock;
interface Check { id; prompt; options: {id,label}[]; correctOptionId; explanation; }
interface Task { id; scope; items: string[5]; solution: { filename; language; code }; }
interface Layer { id; order; name; lessonSlug; startState: 'broken'; baseline; repaired; }
interface SampleMetrics { passRate: number; costPer1k: number; p95Ms: number; }
interface ProgressState {
  version: 1;
  lessons: Record<string, { status: 'in-progress'|'repaired'; checkAnswers: Record<string,{selectedOptionId:string}>;
    taskTicks: string[]; proofNote: string; repairedAt: string|null }>;
  lastLessonSlug: LessonSlug|null; lastSectionId: string|null; updatedAt: string;
}
```

Constraints: slug `^[a-z][a-z0-9-]*$`; sections 3–8 (flagship 8), ids `^[a-z][a-z0-9-]{0,40}$`;
2 checks per lesson (flagship 3), 3–4 options, explanation of 2 or more sentences; task exactly 5
items; proof max 280 characters, debounce 800 ms; code block one per lesson with
`output.label = "Sample output. Fixed data."`; diagrams only on retrieval, agents and cost; one
note block per lesson; citation one line of 160 characters or fewer.

## 6. Fixed sample data

Baseline for all layers: **41% pass, $0.94 per 1k, p95 2.4 s**.

| Id | Name | Lesson | Repaired pass | $/1k | p95 |
| --- | --- | --- | --- | --- | --- |
| layer-01 | Evaluation | `evaluation` | 49% | 0.92 | 2.3 s |
| layer-02 | Prompt design | `prompt-contract` | 53% | 0.86 | 2.1 s |
| layer-03 | Retrieval | `retrieval` | 58% | 0.71 | 1.4 s |
| layer-04 | Agents | `agents` | 63% | 0.68 | 1.6 s |
| layer-05 | Fine-tuning | `fine-tuning` | 72% | 0.79 | 1.1 s |
| layer-06 | Cost | `cost` | 74% | 0.31 | 0.9 s |

Lesson minutes: 10, 9, 25, 11, 10, 9 = 74 minutes total. Retrieval is the flagship.

### Retrieval corpus

12 documents `doc-01`…`doc-12` (accounts, billing, payments, shipping, delays, orders, refunds,
labels, plans, customs, warranty, contact). Text is 1–3 sentences, 220 characters or fewer, tags
2–4 lowercase words, no personal data. Preset queries only; other input returns the no-results
state.

| Query | Rank 1 | Rank 2 | Rank 3 |
| --- | --- | --- | --- |
| `refund policy` | doc-07 0.91 | doc-08 0.74 | doc-02 0.61 |
| `billing` | doc-02 0.88 | doc-03 0.79 | doc-09 0.63 |
| `late delivery` | doc-05 0.92 | doc-04 0.70 | doc-10 0.55 |

### Cost model

Defaults: 10,000 requests/day, 1,000 input tokens, 250 output tokens, $0.75 per 1M tokens.
Constants: retrieval 400 ms, prefill 0.6 ms/token, decode 5.6 ms/token, 30 days.

```text
costPerRequest = (input + output) × pricePerM / 1_000_000
costPer1k      = costPerRequest × 1_000
monthlyCost    = costPerRequest × requestsPerDay × 30
p95Ms          = 400 + input × 0.6 + output × 5.6
```

Defaults give $0.9375 → `$0.94`, `$281.25` monthly, 2,400 ms → `2.4 s`. 10× traffic gives
`$2,812.50` monthly and keeps `$0.94` per 1k. Invalid input returns null; the UI hides the result
and shows "Enter at least 1 request.".

## 7. Progress storage

Key `lastminute.progress.v1`, one JSON object under 8 KB. Write the full object on each change.

Read order: `getItem` in try/catch; parse in try/catch; reject a non-object, missing or wrong
version; drop unknown slugs and check ids; drop unmatched or duplicate ticks; truncate the note to
280; drop an invalid `lastSectionId`; replace an invalid `updatedAt`. Corrupt JSON returns the
empty state, shows no banner, and the next write replaces it.

Any storage throw: keep memory state for the session, set `available = false`, stop all storage
calls, and show "Progress cannot be saved in this browser. You can still read every lesson."
Reset removes the key in try/catch and clears memory. Reads happen only in the browser after mount,
so server HTML shows the empty snapshot and hydration matches.

Rule, checked in review: only `lib/progress/storage.ts` may call localStorage.

## 8. Design system

Direction: "paper and ink", editorial and technical. Warm off-white paper, near-black ink, 1 px
hairlines, green/amber/red only for evaluation state. Serif prose, mono for technical text and
tabular numerals. Flat schematics, no shadows, no gradients. References, not copies: Stripe docs,
Increment magazine, assembler manuals.

Tokens (final; components use no other colour literal):

```css
:root {
  --bg:#FAF8F4; --surface:#F3EFE8; --ink:#1A1815; --ink-muted:#5C574E;
  --hairline:#D9D3C7; --hairline-strong:#8A8271;
  --accent:#244A73; --success:#1E6B45; --warning:#8A5A00; --danger:#A32A1E;
  --focus:#244A73; --success-bg:#E7F0E9; --warning-bg:#F6EBD2; --danger-bg:#F6E4E1;
  --font-serif:"Source Serif 4",Georgia,serif; --font-mono:"JetBrains Mono",ui-monospace,monospace;
  --font-sans:"Inter",system-ui,sans-serif;
  --text-display:clamp(2.5rem,1.9rem+2.6vw,3.5rem); --text-h1:2.5rem; --text-h2:1.75rem;
  --text-h3:1.25rem; --text-body:1.125rem; --text-small:0.9375rem; --text-mono:0.875rem;
  --text-micro:0.6875rem; --lh-display:1.05; --lh-body:1.6; --measure:68ch; --tracking-micro:0.08em;
  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:16px; --space-6:24px;
  --space-8:32px; --space-12:48px; --space-16:64px; --space-24:96px;
  --radius-1:0px; --radius-2:1px; --radius-3:2px; --shadow:none;
  --ease-standard:cubic-bezier(.2,0,0,1); --dur-hover:120ms; --dur-panel:240ms;
  --dur-number:400ms; --dur-trace:600ms;
  --spine-w:88px; --toc-w:260px; --main-max:720px; --header-h:56px; --actionbar-h:56px;
}
@media (prefers-reduced-motion: reduce) { :root { --dur-hover:0ms; --dur-panel:0ms;
  --dur-number:0ms; --dur-trace:0ms; } }
```

Contrast: ink 16.6:1, muted 6.7:1, accent 8.6:1, success 5.6:1, warning 5.1:1, danger 6.8:1,
hairline-strong 3.5:1 on paper. Focus: 2 px `--accent`, 2 px offset.

Type: serif for display and prose (18 px, 1.6, max 68ch); sans for UI labels and buttons (15 px);
mono 14 px for code, output and scores with `tabular-nums`; mono 11 px uppercase 0.08em for micro
labels. One h1 per page, no skipped heading levels.

Layout: phone <768 one column, 16 px margins, spine strip in two rows, TOC bottom sheet, 56 px
sticky action bar for Mark repaired and Next, 44 px touch targets. Tablet 768–1023: main plus
240 px TOC, horizontal spine strip. Desktop ≥1024: 88 px spine rail, 640–720 px main, 232–260 px
TOC. Never a horizontal page scroll; code and tables scroll inside their own wrappers.

Components (24): Header, SkipLink, Footer, Spine, SpineNode, LessonHeader, Toc, Section, Prose,
Callout, CodeBlock, Diagram, CheckItem, TaskChecklist, ProveNote, RepairButton, PrevNext,
RetrievalExplorer, CostCalculator, Button, Badge, LiveRegion, EmptyState, Banner.

Motion: hover 120 ms, focus ring never removed, active 80 ms colour step, panel 240 ms, number roll
400 ms, trace dot 600 ms. Reduced motion sets all durations to 0. No parallax, no scroll-linked
animation. Every state carries a word, never colour alone.

## 9. Build units and waves

| ID | Unit | Owns | Depends on | Dev wave |
| --- | --- | --- | --- | --- |
| U0 | Foundation | config files, `app/layout.tsx`, `app/globals.css`, `lib/{types,cn,format}.ts`, `components/ui/**`, `public/**`, `content/index.ts` stub, one sample lesson | none | foundation |
| U1 | Content | `content/**` (six lessons, scores, retrieval, cost model, roadmap) | U0 | build 1 |
| U2 | Progress | `lib/progress/**`, provider mount in `app/layout.tsx` | U0 | build 1 |
| U3 | Widgets | `components/widgets/**` | U0, U1 | build 1 |
| U4 | Shell chrome | `components/shell/**` | U0, U1, U2 | build 2 |
| U5 | Lesson | `components/lesson/**`, `app/lessons/[slug]/page.tsx` | U0, U1, U2, U4, U3 | build 2 |
| U6 | Pages | four `app/` pages, `components/home/**`, `components/roadmap/**` | U0–U5 | build 3 |
| U7 | Verification | no production files; README, defect log | all | quality |

Parallel rule: U1–U3 can run side by side because the widget props and content types are frozen in
this document. U4 and U5 start when U1–U3 land. U6 starts last. Only U2 may touch
`app/layout.tsx` besides U0; U0 leaves a marked provider mount line for it.

## 10. Deployment and failure strategy

`next.config.ts` sets `output: 'export'` and `images.unoptimized: true`. `npm run build` writes
`out/` with `index.html`, `roadmap/`, `about/`, six lesson pages, `404.html` and assets. Vercel
imports the repository, detects Next.js, and deploys with zero configuration. No env var, build
override or redirect. `.env.example` states that no variables are required. Node 22 from
`engines` and `.nvmrc`.

Hydration: frozen server snapshot, no time or random values in render. Storage: every call in
try/catch, memory fallback, banner. Network: zero runtime requests; fonts self-hosted at build;
diagrams inline SVG. 404: `notFound()` plus `app/not-found.tsx`. First-load JavaScript under
150 kB gzip; React and Next only, no animation library.

## 11. Conflicts resolved

| Topic | Architecture | Data / UX | Decision |
| --- | --- | --- | --- |
| Folder layout | `content/`, `lib/` | `src/data/` | **`content/` + `lib/`** as in section 4 |
| Fonts | system stacks | `next/font/google` | **next/font/google**, self-hosted at build, system fallbacks; no runtime request |
| Difficulty values | not stated | starter/core/advanced | **starter/core/advanced**; all lessons `core` except retrieval `advanced` |
| Run panel numbers | not stated | highest repaired layer's metrics | **Lookup rule**, not accumulation; baseline when none repaired |
| No-results copy | PRD: "Try 'refund' or 'billing'" | presets: "refund policy" | **"Try 'refund policy' or 'billing'."** |
| Roadmap total | not stated | sum of lessons | **74 minutes**, computed from lesson data |
| Tests | test script TBD | not stated | **No test framework**; build, type check, browser QA. Optional `node:test` for pure functions. |

## 12. What stage 5 must produce

One low-level design per module (`content`, `progress`, `lesson`, `widgets`, `shell`): exact files,
component props, types, state, storage access, error and empty states, and the build units with
file ownership, dependencies and a checkable done line. The LLD must not add colours, fonts,
radii, shadows, packages or routes outside this document.
