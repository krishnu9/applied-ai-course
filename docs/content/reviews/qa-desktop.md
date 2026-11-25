# Desktop QA — 24 lessons

Owner: `qa-desktop`, wave 6. Date: 2026-11-25.

Scope: all 24 lesson routes, the 8 flagship labs, the 5 diagram variants, the evaluation
loop, navigation, progress migration, hygiene, and accessibility.

Environment:
- Dev server: `http://localhost:3000`.
- Production build: `npm run build`, static export in `out/`, served on `http://localhost:3101`.
- Browser: system Chrome through Playwright in `/tmp/lm-qa`.
- Viewports: 1440×900 and 1280×800, on both servers.
- Every static check runs against all 4 server and viewport combinations.
- Tree revision: a concurrent wave edited `sampling-and-hallucination`, `retrieval`, `cost`,
  `prompt-contract`, `lora-memory`, `inference-optimization`, `ai-architecture` and
  `synthetic-data` during QA, and then updated `docs/content/GLOSSARY.md`. The final build at
  23:47 includes the lesson edits. The final regression pass runs against that build. The
  glossary edit is docs-only and does not affect the build.

## 1. Verdicts

| Area | Verdict | Evidence |
| --- | --- | --- |
| 24 lesson routes | **PASS** | 28 routes (24 lessons plus home, roadmap, about, 404) return the expected status and render every template part at 1440 and 1280, on prod and dev. |
| 8 flagship labs | **PASS** | 8 of 8 widgets respond to mouse and keyboard at both sizes on both servers. One variable each, visible response. |
| 5 diagram variants | **PASS** | flow, stack, matrix, timeline and bars render with a caption and alt text. No clipped text, no rectangle outside the viewBox, no inner scroll at 1280. One low-severity label overlap was fixed (F2). |
| Evaluation loop | **PASS** | Gate order, capstone score movement, reload persistence and the non-capstone score isolation all hold. |
| Navigation | **PASS** | 10-chapter rail, header count, lesson count, meta row, prev/next at 9 chapter boundaries, roadmap 24 rows, 557 computed minutes, home index and capstone panel, about. |
| Migration | **PASS** | Valid v1 maps to v2 with repair and position intact. v1 stays byte-identical. Corrupt v1 yields empty. v2 wins when both keys exist. |
| Hygiene | **PASS** | Zero console and page errors, zero failed requests beyond the deliberate 404, no external hosts, no horizontal page scroll, one storage module. |
| Accessibility | **PASS** | One h1 per route, no heading skip, skip link moves focus to main, 2 px focus rings, `aria-current`, table scopes, diagram alt, labelled controls, AA contrast. |
| Build | **PASS** | Typecheck, lint, build and `CONTENT_VALIDATE=1` build all exit 0. |

## 2. Issues found and fixed

| ID | Severity | Route | Symptom | Cause | Fix | File |
| --- | --- | --- | --- | --- | --- | --- |
| F1 | Low (polish) | All 24 lessons | The lesson header showed `Chapter N · Title` directly under `Lesson N of 24`. The meta row showed the same chapter and title again with the position. | `LessonHeader` rendered its own chapter line, and `MetaRow` also renders chapter and position. | Removed the header chapter line. Kept the header lesson count and the meta row chapter/position. | `components/lesson/LessonHeader.tsx` |
| F2 | Low (legibility) | Bars lessons: `model-scaling`, `model-selection`, `context-engineering`, `lora-memory` | The longest value label, for example `70 B active`, touched or overlapped the end of the longest bar at 1280 and 1440. | `layoutBars` reserved a fixed 56 px for the value text. The longest label needs about 71 px. | Compute the reserve from the longest value text plus 4 px. The value column now starts at least 8 px after the longest bar. | `components/lesson/diagramLayout.ts` |

F1 check: the chapter text occurs once in the article header on `retrieval` and `ai-stack`.
F2 check: the value text starts at x=401 and the longest bar ends at x=384. See
`/tmp/lm-qa/qa2-diagram-bars-1280.png` and `/tmp/lm-qa/qa2-diagram-bars-1440.png`.

## 3. Open issues

| ID | Area | Issue | Owner | Severity |
| --- | --- | --- | --- | --- |
| O2 | Validator | `content/validate.ts` does not check the ELI5 subtotal of 240–540 words. QA measured every lesson inside the range, so no lesson fails now. This repeats pilot item R1. | Engine and validator owner | Low |

Observations, not defects:
- Pilot N6/R4 is resolved. `docs/content/GLOSSARY.md` now has `Position-flip rate` and
  `Verbosity gap` entries. A concurrent wave added them after the production build. The
  glossary is not served and does not affect the build.
- Native closed `<select>` elements did not change on `ArrowDown` in automated macOS Chrome.
  Type-ahead (`l`) and text inputs worked, and all 8 widgets passed by keyboard. The native
  select keeps its standard browser keyboard support.
- Pilot R7 is resolved: lesson 7 now ships, so lesson 8 has a live prerequisite.
- Content spot checks pass on all 24 lessons: ELI5 totals are 240–540 words, every interview
  answer has 4 sentences or fewer, every lesson has 4 interview items, and every citation uses
  the canonical independent line.

## 4. Build, console and migration results

### 4.1 Commands

| Command | Result |
| --- | --- |
| `npm run typecheck` | Exit 0 |
| `npm run lint` | Exit 0 |
| `npm run build` | Exit 0, 30 static pages, 24 lesson paths |
| `CONTENT_VALIDATE=1 npm run build` | Exit 0, 0 validator faults |

### 4.2 Routes, console and network

| Check | Result |
| --- | --- |
| 24 lesson routes | 200 on prod and dev, at 1440 and 1280 |
| Home, roadmap, about | 200 |
| Unknown slug | 404 on prod and dev |
| Internal links | 27 unique targets, all 200 |
| Console and page errors | 0 on all 28 routes at both sizes on both servers. The unknown-slug route logs one 404 resource message by design. |
| Failed requests | 0, except the deliberate 404 |
| External hosts | 0 requests, 0 external hosts in the export HTML |
| Horizontal page scroll | 0 on all routes at both sizes |
| Storage ownership | `localStorage` appears only in `lib/progress/storage.ts` |

### 4.3 Template per lesson

All 24 lessons pass at both sizes on both servers:
- One h1, no duplicate h2, no draft panel.
- 4–6 terms.
- 2–3 ELI5 panels, each with an analogy and a `Where it breaks` line.
- One static diagram with the expected variant, a caption and alt text.
- 4–6 checks and a 5-step task.
- Prove note, 4 interview questions and answers, and a citation.

### 4.4 Flagship labs

Each lab changes one visible output by mouse and by keyboard. 8 of 8 pass at both sizes on
both servers.

| Lesson | Widget | Visible response |
| --- | --- | --- |
| `llm-as-judge` | Judge bias lab | Verdict moves A → B on swap, then back to A by keyboard. |
| `model-selection` | Arena lab | Alpha Elo 1200 → 1216; Beta Elo 1184 → 1201.5. |
| `prompt-contract` | Injection lab | Safe label stays safe with the guard on. Guard off gives `urgent · refund approved`. |
| `context-engineering` | Context budget lab | 4,300 → 5,900 tokens, then `Over budget by 100 tokens`. |
| `retrieval` | Retrieval rank lab | The fixed query order changes with the weight slider. |
| `agents` | Agent trace | Step marks the first step `done`; the injected error stops the loop with a reason. |
| `lora-memory` | LoRA memory lab | Trainable 1.05M → 4.19M; frozen base 3.22 → 16.11 GB. |
| `cost` | Serving budget | Throughput 1.7 → 13.3 → 14.0 requests per second. |

### 4.5 Evaluation loop

| Step | Result |
| --- | --- |
| Gate at start | Disabled, hint visible |
| After 5 correct checks | Disabled |
| After 5 ticks | Disabled |
| After the proof note | Enabled |
| After repair | `Layer repaired` and a printed metric announcement |
| Storage | v2 entry has 5 check answers, 5 ticks, the note and `status: repaired` |
| Reload | Checks, ticks, note and repaired state persist |

Capstone score, `evaluation`:
- Before: 41% pass, $0.94 per 1k, 2.4 s p95, 0 of 6 stages.
- After: 49% pass, $0.92 per 1k, 2.3 s p95, 1 of 6 stages.
- Header: `0 of 24 lessons` → `1 of 24 lessons`.

Non-capstone score, `ai-stack`:
- After repair: still 41% pass, $0.94 per 1k, 2.4 s p95, 0 of 6 stages.
- Header: `1 of 24 lessons`, because the lesson is repaired.
- The non-capstone repair does not move the capstone score.

### 4.6 Migration

| Scenario | Result |
| --- | --- |
| Valid v1 only, `evaluation` repaired, section `where-it-fails` | v2 written. Repair, 5 checks, 5 ticks, note and position survive. v1 is byte-identical. The page restores `where-it-fails` at 72 px from the top. |
| Corrupt v1 | Empty v2. Header `0 of 24 lessons`. v1 stays unchanged. |
| v1 and v2 both exist | v2 wins. `ai-stack` stays repaired, `evaluation` is not imported, and v2 is not overwritten by v1. |

### 4.7 Navigation

| Check | Result |
| --- | --- |
| Chapter rail | 10 chapters, current chapter marked |
| Header | `N of 24 lessons` on every route |
| Lesson header | `Lesson N of 24` and a meta row with chapter, position, minutes and difficulty |
| Prev/next | Correct for all 24 lessons |
| Chapter boundaries | 9 boundaries show `Next chapter: <title>` |
| First and last lesson | `Start of the path`, and `End of the path` plus a roadmap link |
| Roadmap | 24 rows in 10 chapters, 557 minutes in total, equal to the sum of the 24 reading times |
| Home | 24 lesson links in 10 chapters, 6 capstone stages, baseline 41% |
| About | Renders, header `aria-current` correct |

### 4.8 Accessibility

| Check | Result |
| --- | --- |
| H1 | Exactly one per route |
| Heading order | No skip on any route |
| Skip link | First Tab stops on it; Enter moves focus to `main#main` |
| Focus ring | 2 px solid on header, rail, radio, checkbox, textarea and widget controls |
| `aria-current` | Rail on every lesson, header on roadmap and about |
| Tables | Every table has `th` with `scope` |
| Diagram alt | Present on every static diagram |
| Controls | Every input, select and textarea has an accessible name |
| Contrast | Lowest pair is 5.0:1 (`--warning` on `--warning-bg`). All pairs pass AA. |

## 5. Screenshots

All files are in `/tmp/lm-qa`.

Pages:
- `qa2-home-1440.png`, `qa2-home-1280.png`
- `qa2-roadmap-1440.png`, `qa2-roadmap-1280.png`
- `qa2-about-1440.png`, `qa2-about-1280.png`
- `qa2-lesson-retrieval-1440.png`, `qa2-lesson-retrieval-1280.png`
- `qa2-lesson-header-1440.png`, `qa2-lesson-header-1280.png`
- `qa2-404-1440.png`, `qa2-404-1280.png`

Diagrams:
- `qa2-diagram-flow-1440.png`, `qa2-diagram-flow-1280.png`
- `qa2-diagram-stack-1440.png`, `qa2-diagram-stack-1280.png`
- `qa2-diagram-matrix-1440.png`, `qa2-diagram-matrix-1280.png`
- `qa2-diagram-timeline-1440.png`, `qa2-diagram-timeline-1280.png`
- `qa2-diagram-bars-1440.png`, `qa2-diagram-bars-1280.png`

Widgets:
- `qa2-widget-judge-1440.png`, `qa2-widget-judge-1280.png`
- `qa2-widget-arena-1440.png`, `qa2-widget-arena-1280.png`
- `qa2-widget-injection-1440.png`, `qa2-widget-injection-1280.png`
- `qa2-widget-context-1440.png`, `qa2-widget-context-1280.png`
- `qa2-widget-rag-1440.png`, `qa2-widget-rag-1280.png`
- `qa2-widget-agent-1440.png`, `qa2-widget-agent-1280.png`
- `qa2-widget-lora-1440.png`, `qa2-widget-lora-1280.png`
- `qa2-widget-serving-1440.png`, `qa2-widget-serving-1280.png`

Evaluation loop and capstone:
- `qa2-eval-evaluation-gate-1440.png`, `qa2-eval-evaluation-gate-1280.png`
- `qa2-eval-evaluation-repaired-1440.png`, `qa2-eval-evaluation-repaired-1280.png`
- `qa2-eval-ai-stack-gate-1440.png`, `qa2-eval-ai-stack-gate-1280.png`
- `qa2-eval-ai-stack-repaired-1440.png`, `qa2-eval-ai-stack-repaired-1280.png`
- `qa2-capstone-after-evaluation-1440.png`, `qa2-capstone-after-evaluation-1280.png`
- `qa2-capstone-after-ai-stack-1440.png`, `qa2-capstone-after-ai-stack-1280.png`

Migration:
- `qa2-migration-v1-restored-1440.png`, `qa2-migration-v1-restored-1280.png`

## 6. Changes in this wave

| File | Change |
| --- | --- |
| `components/lesson/LessonHeader.tsx` | Removed the duplicate header chapter line. |
| `components/lesson/diagramLayout.ts` | Sized the bars value column from the longest value label. |

No lesson prose or content data changed in this wave. A concurrent wave edited
`content/lessons/sampling-and-hallucination.ts`; the final build and checks include that edit.
No commit was made.
