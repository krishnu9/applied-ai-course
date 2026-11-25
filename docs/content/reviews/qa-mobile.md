# Mobile QA — 24 lessons

Owner: `qa-mobile`, wave 7. Date: 2026-11-26.

Scope: 24 lesson routes, home, roadmap, about and 404. The chapter rail, the phone
lesson page, the 8 flagship labs, page states, 200% text and console hygiene.

Environment:
- Dev server `http://localhost:3000`; static export served on `http://localhost:3102`.
- System Chrome through Playwright in `/tmp/lm-qa`.
- Viewports: 390×844 (touch, DPR 3), 768×1024, 320×640.
- Exact-viewport pass: 28 routes × 2 viewports (768×1024 and 320×640).
- Full pass: 28 routes × 3 widths = 84 route/view checks.
- The dev server served a stale CSS transform during the first pass. Every final
  verdict uses the production export. The dev server now serves the fixed rules
  after the rebuild.

## 1. Verdicts

| Area | 390×844 | 768×1024 | 320×640 | Evidence |
| --- | --- | --- | --- | --- |
| No page horizontal scroll | **PASS** | **PASS** | **PASS** | 84 + 56 checks: `scrollWidth === clientWidth`, 0 offenders. |
| Phone header in one row with `N/24` | **PASS** | n/a (full sentence) | **PASS** | 1 row; compact `0/24` visible; full sentence is sr-only. |
| Chapter rail scrolls in itself | **PASS** | **PASS** | **PASS** | `overflow-x: auto`; 2016–2032 px strip in 320–768 px; current chip visible; rail top = header bottom (57 px). |
| Lesson template, all 24 | **PASS** | **PASS** | **PASS** | Terms, 2 ELI5 panels + breaks, 1 diagram, tables, 4–6 checks, 5 steps, prove + rubric, 4 interview Q&A, citation, prev/next. |
| Terms grid stacks | **PASS** | **PASS** (2 col) | **PASS** | 1 column at 390/320; 2 columns at 768. |
| Static diagrams, 5 variants | **PASS** | **PASS** | **PASS** | 0 text overflow; internal scroll; labels 9–11 px after F1. |
| Tables and code scroll inside | **PASS** | **PASS** | **PASS** | Tables 480 px inside 286–356 px wrappers; solution code 755 px inside 252–668 px. |
| Phone action bar | **PASS** | hidden | **PASS** | 57 px (56 + 1 border); hides on field focus; no footer overlap after F4. |
| 8 flagship labs, touch | **PASS** | n/a | n/a | Every control ≥44 px; visible response; no clipped output; no page scroll. |
| 8 flagship labs, keyboard | **PASS** | n/a | n/a | All 8 change output by keyboard only. |
| Home and roadmap | **PASS** | **PASS** | **PASS** | 10 chapters; 24 rows; 6 capstone rows; 557 minutes; 0 draft rows; no overflow. |
| States | **PASS** | **PASS** | **PASS** | Blocked banner wraps; empty progress; unknown slug 404; long title fixed. |
| Console and network | **PASS** | **PASS** | **PASS** | 0 errors; 0 failed requests except the deliberate 404. |
| 200% text at 390 | **PASS with notes** | n/a | n/a | Reflow holds; no page scroll; bars oversized (see O2, O3). |
| Build | **PASS** | | | Typecheck, lint, build and `CONTENT_VALIDATE=1` build exit 0. |

## 2. Issues found and fixed

| ID | Severity | Route / area | Symptom | Cause | Fix | File |
| --- | --- | --- | --- | --- | --- | --- |
| F1 | High (legibility) | 14 lessons, all widths | Wide `flow` and `timeline` diagrams shrank to 460 px. Labels rendered at 4.6–7.1 effective px on the phone. | `SvgFrame` set `min-w-[460px]` for every diagram. A viewBox wider than 460 px still scaled down. | Set the SVG min width to `max(460, viewBox width)`. Wide diagrams now render at scale 1 and scroll inside the figure. | `components/lesson/Diagram.tsx` |
| F2 | Medium (touch) | `context-engineering`, `retrieval` | Range sliders were 16 px high, below the 44 px touch target. | `RANGE_INPUT` had no minimum height. | Added `min-h-11`. Sliders now 324×44 px. | `components/widgets/WidgetChrome.tsx` |
| F3 | Medium (reflow) | All lessons, 200% text | A long H1 word clipped at the right edge. A 60-character title caused page horizontal scroll. | No `overflow-wrap` on headings. `body` has `overflow-x: clip`. | Added `overflow-wrap: break-word` to `h1, h2, h3`. 0 clipped words; 0 page scroll. | `app/globals.css` |
| F4 | Medium (content hidden) | All lessons, 200% text | The fixed action bar grew to 163 px. Body padding stayed at 56 px, so the bar hid 107 px of the footer. | Body padding used the fixed `--actionbar-h` token. | A `ResizeObserver` publishes the measured height as `--actionbar-actual-h`; body padding uses it. Footer overlap is now 0 px at 100% and 200%. | `components/lesson/LessonActionBar.tsx`, `app/globals.css` |
| F5 | Medium (content render) | 11 lessons | The line rendered `Where it breaks: Where it breaks:`. | Content data starts with the label, and `Analogy` adds the label again. | The renderer strips a leading `Where it breaks:` prefix. 0 duplicate labels on all 24 lessons. | `components/lesson/Analogy.tsx` |

F1 evidence: at 390, `foundation-models` labels moved from 4.9 px to 11 px; `retrieval` from 4.9 to 11; `structured-outputs` from 4.6 to 9. See `qa3-diagram-flow-390.png`.
F4 evidence: at 200%, footer bottom and bar top are both 681 px. `coveredPx = 0` at 100% and 200%.
F5 evidence: 11 lessons had 2 duplicated panels each (`qa3-dupe.mjs`); final scan reports 0.

## 3. Open items

| ID | Area | Issue | Owner | Severity |
| --- | --- | --- | --- | --- |
| O1 | Widget a11y | The RAG live status names only the first result. That result is `doc-07` at every weight. The reorder (positions 2 and 3) is visual only, so a screen reader gets no announcement. | Widget owner (`rag-rank-lab`) | Low |
| O2 | Shell, 200% text | The sticky header grows to 185 px (2 rows). `[id]` still uses `scroll-margin-top: 56px`, so an anchor jump lands about 129 px under the header. | Shell / lesson nav owner | Low |
| O3 | Design tokens, 200% text | The H1 at 80 px breaks `Retrieval` mid-word (`Retrieva` / `l`). Content is preserved; no clipping. | Design token owner | Low |
| O4 | Dev server | The first unknown-slug request after a route compile returns 500 once (`missing param in generateStaticParams`). Later requests return 404. The static export always returns 404. | Engine / build owner | Low |
| O5 | Content | 11 lessons still carry the `Where it breaks:` prefix in the `breaks` data. The renderer hides the duplicate, but the data and the brief still disagree. Both ELI5 sections are affected in each lesson: `ai-stack`, `foundation-models`, `model-scaling`, `post-training`, `sampling-and-hallucination`, `retrieval-quality`, `agents`, `cost`, `inference-optimization`, `ai-architecture`, `observability-feedback`. | Content authors / brief editor | Low |
| O6 | Action bar | A tap on a button near the bottom of the viewport can be lost. Example: `Show reference solution` at y≈799 on 390. The field blurs, the bar reappears at y=787, and the tap lands on the bar. A scroll fixes it. | Shell / action bar owner | Low |

## 4. Detailed results

### 4.1 Page scroll and wrapping

- 84 route/view checks (390, 768, 320): `documentElement.scrollWidth === clientWidth` on all.
- 56 exact-viewport checks (768×1024, 320×640): 0 issues.
- 0 elements cross the viewport edge outside a scroll wrapper.
- Tables: `table` is 480 px wide inside a 286 px (320) or 356 px (390) wrapper with `overflow-x: auto`.
- Diagrams: internal scroll. Example: flow viewBox 1028 px inside a 356 px wrapper.
- Reference solution: 755 px of code inside a 252 px (320) or 668 px (768) `pre` with `overflow-x: auto`.
- Interview answers wrap; no horizontal overflow.

### 4.2 Rail and header

| Check | Result |
| --- | --- |
| Rail direction below 1024 | Horizontal strip (`flex-direction: row`, `overflow-x: auto`) |
| Rail strip width vs container | 2016–2032 px vs 320 / 390 / 768 px |
| Current chapter | `aria-current` present and fully visible on all 24 lessons |
| Rail vs header | Rail top 57 px = header bottom 57 px; no overlap |
| Header rows at 390/320 | 1 |
| Header at 390/320 | Compact `0/24` visible; full sentence sr-only |
| Header at 768 | One row, full `0 of 24 lessons` |
| Rail at 1024+ | Fixed vertical rail; content reserves `--spine-w`; no overlap |

### 4.3 Lesson page on the phone

24 of 24 lessons pass at 390, 768 and 320:
- 1 `h1`; 2 or 3 ELI5 panels; every panel has an analogy and one `Where it breaks` line.
- 1 static diagram with caption and alt; 2 tables; 4–6 checks; 5 task steps.
- Prove note with the 3-point rubric; 4 interview questions; citation; prev/next.
- Terms: 1 column at 390/320 (`358px` / `288px`), 2 at 768.
- Action bar: 57 px at 390/320; `display: none` at 768 and above; hides on field focus and returns on blur on all 24 lessons.
- Body padding clears the bar: 0 px footer overlap at 100% and 200%.

### 4.4 Flagship labs

All controls are at least 44 px, except the 16 px native checkbox. Its label target is 44 px.
Each result panel has `scrollWidth === clientWidth` (no clipped output). No page scroll.

| Lesson | Control | Touch response | Keyboard response |
| --- | --- | --- | --- |
| `llm-as-judge` | Swap checkbox (44 px label) | Verdict A → B | Space: B → A |
| `model-selection` | 3 buttons (44 px) | Alpha 1200 → 1216; Beta → 1184 | Enter on Beta: votes 0/1 |
| `prompt-contract` | 2 checkboxes (44 px labels) | Guard off gives `urgent · refund approved`; guard on gives `billing · normal priority` | Space works |
| `context-engineering` | 4 sliders (324×44) | 4,300 → 5,700 tokens | ArrowRight works |
| `retrieval` | Slider (324×44) | Rows 2/3 swap; scores change | Home/End works |
| `agents` | 2 buttons, checkbox, select (44) | Step, then error stop with reason | Enter + Space works |
| `lora-memory` | 3 selects (324×44) | Rank 8 → 16: 16.78M; rank 4: 4.19M | ArrowDown and type-ahead work |
| `cost` | 4 text inputs, 2 selects (44) | Batch 8: 13.3 req/s; batch 8 + concurrency 16: 53.3 req/s | Type-ahead `8` works |

### 4.5 Home and roadmap

| Check | Home | Roadmap |
| --- | --- | --- |
| Chapters | 10 | 10 |
| Lesson rows | 24 (plus 4 mapping links) | 24 |
| Capstone table | 6 rows | n/a |
| Minutes | 557 (sum of the index) | 557 printed = 557 summed |
| Draft rows | 0 | 0 |
| Page scroll at 390/320 | none | none |

### 4.6 States

| State | Result |
| --- | --- |
| Blocked storage | Banner shows, wraps to 2 lines (64 px) at 390 and 320; no page scroll |
| Empty progress | `0/24` and `0 of 24 lessons`; 0 of 6 capstone stages |
| Unknown slug | 404 on the static export at 390, 768 and 320 |
| Long title | Injected 60-character word: no page scroll, no clipping |
| 404 console | One 404 resource message, by design |

### 4.7 200% text at 390

| Check | Result |
| --- | --- |
| Root font | 32 px; body 34 px |
| Page horizontal scroll | none |
| Clipped content | 0 |
| Rail | still horizontal, `overflow-x: auto`, current chapter visible |
| Header | 185 px, 2 rows (logo row, nav row) |
| Action bar | 163 px; `Mark layer repaired` wraps to 3 lines |
| Footer clearance | 0 px overlap at 100% and 200% |
| H1 | breaks `Retrieval` mid-word; content preserved |

## 5. Build, console and network

| Check | Result |
| --- | --- |
| `npm run typecheck` | Exit 0 |
| `npm run lint` | Exit 0 |
| `npm run build` | Exit 0, 30 static pages, 24 lesson paths |
| `CONTENT_VALIDATE=1 npm run build` | Exit 0, 0 validator faults |
| Console and page errors | 0 on 28 routes × 3 widths; 404 route logs 1 expected 404 resource |
| Failed requests | 0, except the deliberate 404 |
| Production 404 | `out/404.html`; status 404 at all widths |
| Desktop regression (1440, 1280) | 24 lessons: 0 issues; rail fixed; action bar hidden; header 1 row; no page scroll |
| Bars label clear (qa-desktop F2) | Value text starts at x=401; longest bar ends at x=384 (17 px gap) |

## 6. Screenshots

All files are in `/tmp/lm-qa`:

- Pages: `qa3-home-{390,768,320}.png`, `qa3-roadmap-{390,768,320}.png`,
  `qa3-about-{390,768,320}.png`, `qa3-404-{390,768,320}.png`.
- Lessons: `qa3-retrieval-{390,768,320}.png`, `qa3-ai-stack-{390,768,320}.png`,
  `qa3-agents-{390,768,320}.png`, `qa3-cost-{390,768,320}.png`,
  `qa3-lesson-retrieval-768.png`.
- Diagrams (fixed build): `qa3-diagram-{flow,stack,matrix,timeline,bars}-{390,320}.png`.
- Labs: `qa3-widget-{judge,arena,injection,context,rag,agent,lora,serving}-390.png`.
- States: `qa3-blocked-{390,320}.png`, `qa3-longtitle-390.png`,
  `qa3-200pct-faithful-390.png`, `qa3-200pct-bottom-390.png`.

## 7. Changes in this wave

| File | Change |
| --- | --- |
| `app/globals.css` | Headings use `overflow-wrap: break-word`; body padding uses the measured action bar height. |
| `components/lesson/Diagram.tsx` | SVG min width is `max(460, viewBox width)`, so wide diagrams keep label size and scroll. |
| `components/lesson/LessonActionBar.tsx` | `ResizeObserver` publishes the real bar height. |
| `components/widgets/WidgetChrome.tsx` | Range input has `min-h-11` (44 px). |
| `components/lesson/Analogy.tsx` | Strips a leading `Where it breaks:` prefix. |

No lesson prose or content data changed. No commit was made.
