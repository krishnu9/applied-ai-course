# Mobile QA report (build wave 11, unit U7)

Date: 2026-11-23
Product: lastminute.dev
Scope: phone QA at 390×844, tablet QA at 768×1024, small phone QA at 320×640, and a 200% text-scaling check at 390. Dev server and production export.

## Build and console status

- `npm run build`: PASS. Exit 0. TypeScript passed. Next.js created 12 static pages.
- `npx tsc --noEmit`: PASS. Exit 0.
- Dev server: zero script errors and zero page errors on 10 routes at 390, 768 and 320.
- Dev server: zero hydration warnings. The log has no "did not match" or "server rendered" text.
- `/lessons/nope` logs one expected resource error for the 404 document. It is not a script error and not a page error.
- Production export: zero console errors and zero page errors on nine routes at three sizes.
- Automated sweep: 30 of 30 route and width combinations pass `scrollWidth === clientWidth` and the one-`h1` check.
- Desktop regression: unchanged. Spine rail 128px, header 1228px, home column centred (360..1080 at 1440), footer at 900/800 on the 404 page, lesson TOC 260px, no horizontal page scroll.

## Verdict per width

| Width | Verdict | Notes |
| --- | --- | --- |
| 390 | PASS | All areas pass. No horizontal page scroll on 10 routes. |
| 768 | PASS | Six-column spine strip. TOC below content. Action bar hidden. |
| 320 | PASS | Header fits in one row. Spine 3+3. Presets wrap. No horizontal page scroll. |
| 200% text at 390 | PASS with note | No horizontal page scroll (390/390). Spine labels break and the action bar grows. See open item 1. |

## Verdict per area

| Area | Verdict | Evidence |
| --- | --- | --- |
| A. Horizontal page scroll | PASS | `scrollWidth` equals `clientWidth` at every width and route. Code, output and diagrams scroll inside their own wrappers. |
| B. Spine on phone and tablet | PASS | Two-row 3+3 strip at 320 and 390. Horizontal six-column strip at 768. State word and numbers visible. No overlap with header or lesson title. |
| C. Lesson page on phone | PASS | 16px content margin. Prose 17px. H1 40px, H2 28px. Code pre scrolls (358px box, 1360px content). TOC opens, Escape closes, focus returns. Proof, checks, tasks, repair and prev/next work. |
| D. Sticky action bar | PASS | 56px action row. Mark repaired and Next. 44px controls. Hides while a field has focus. Hidden at 768 and above. |
| E. Touch targets | PASS | Every visible link, button, checkbox row, preset, TOC item and nav link is at least 44px high. The only 1×1 item is the hidden skip link before focus. |
| F. Widgets on phone | PASS | Retrieval rows stack rank+score, chunk, source. Presets wrap. Calculator is one column. 44px inputs. Long values wrap inside the panel. |
| G. States | PASS | Blocked-storage banner wraps at 320 and 390. Empty progress, no-match, calculator invalid and 404 show the correct text. Long lesson titles wrap. |
| H. Accessibility | PASS | Tab from load reaches "Skip to content". All tested controls show a 2px focus ring. Spine uses `aria-current="page"`, TOC uses `aria-current="true"`. One `h1` per route. States carry words. Small-text contrast is at least 5.0:1. |
| I. 200% text scaling | PASS with note | Reflow holds with no horizontal page scroll. Spine labels break mid-word and the fixed bar grows to 163px. See open item 1. |

## Issues found and fixed

### 1. Horizontal page scroll at 320px (High, fixed)

- Route: all routes.
- Symptom: `documentElement.scrollWidth` was 345 to 347 while `clientWidth` was 320. The compact progress text crossed the right edge.
- Root cause: the 20px wordmark (144.5px), the nav (141px), the progress (27px) and two 8px gaps exceeded the 288px header content box.
- Fix: wordmark 15px below 360px, nav padding 6px, 4px gaps, `flex-wrap` and `ml-auto` as fallback.
- File: `components/shell/SiteHeader.tsx`.

### 2. Sticky phone action bar missing (High, fixed)

- Route: six lesson pages below 768px.
- Symptom: "Mark layer repaired" and "Next" were reachable only at the end of the article.
- Root cause: no action bar existed and the repair gate lived only inside `RepairButton`.
- Fix: add `LessonActionBar` with a 56px action row, above the safe area. The bar hides while an input, textarea or select has focus. The body gets bottom padding so the footer clears the bar. The bar is hidden at 768px and above. A shared `deriveRepairGate` keeps the bar and the inline button in the same state. Lesson 6 shows "Roadmap" as the second action.
- Files: `components/lesson/LessonActionBar.tsx` (new), `components/lesson/repairGate.ts` (new), `components/lesson/RepairButton.tsx`, `components/lesson/index.ts`, `app/lessons/[slug]/page.tsx`, `app/globals.css`.

### 3. Touch targets below 44px (Medium, fixed)

- Routes: `/`, `/roadmap`, lesson pages.
- Symptom: ledger and roadmap title links were 28px high. The "Course" breadcrumb link was 19px high.
- Root cause: inline text links had no minimum height.
- Fix: add `min-h-11` with `flex items-center` to the title links and the breadcrumb link.
- Files: `components/home/LessonLedger.tsx`, `components/roadmap/RoadmapTable.tsx`, `components/lesson/LessonHeader.tsx`.

### 4. Check option text squeezed by state badges (Medium, fixed)

- Route: lesson checks on phone.
- Symptom: the option text column was 176px at 390 and 106px at 320. One option used six short lines.
- Root cause: the state badge was a sibling flex item with a fixed width of 100px.
- Fix: render the badge inside the option text, inline after the label. The text column is now 288px at 390 and 218px at 320.
- File: `components/lesson/CheckBlock.tsx`.

### 5. Phone prose was 18px (Low, fixed)

- Route: all routes below 768px.
- Symptom: prose and body text measured 18px. The mobile target is 17px.
- Root cause: `--text-body` is 18px. The first override sat inside `@layer base` and lost to the unlayered token block.
- Fix: an unlayered media query sets `--text-body` to 1.0625rem below 768px. At 768px and above the token stays 18px.
- File: `app/globals.css`.

### 6. Retrieval presets stacked full width (Low, fixed)

- Route: `/lessons/retrieval`.
- Symptom: the three preset buttons were full-width vertical buttons, not wrapped items.
- Root cause: the container used `flex-col` below `sm`.
- Fix: use `flex-wrap`. The presets form one row at 390 and two rows at 320. Each preset is 44px high.
- File: `components/widgets/RetrievalExplorer.tsx`.

### 7. Spine overflow at 200% text scaling (Medium, fixed)

- Route: lesson pages at 200% text scaling.
- Symptom: `scrollWidth` was 418 while `clientWidth` was 390. The word "Broken" crossed the third spine column.
- Root cause: the state row did not wrap and the state word could not break.
- Fix: wrap the state row, allow word breaks with hyphenation, and add `min-w-0` to the metric block. The result is `scrollWidth` 390 at 200%.
- File: `components/shell/SpineNode.tsx`.

### 8. Dev-only Next.js indicator covered page content (Low, fixed)

- Route: all routes on the dev server.
- Symptom: the Next.js "N" disc covered content in the bottom-left corner of screenshots.
- Root cause: the framework dev indicator is on by default.
- Fix: set `devIndicators: false`. The production export is unchanged.
- File: `next.config.ts`.

## Evidence for the main checks

- 390: `/lessons/retrieval` has `scrollWidth` 390 and `clientWidth` 390. Code `pre` box 358px with 1360px content and `overflow-x: auto`.
- 390: spine 3 columns × 2 rows (130px each, 250px tall). TOC active link follows the viewport. Escape closes the sheet and returns focus to the toggle.
- 390: action bar 56px action row, "Mark layer repaired" 212×44, "Next" 68×44. The bar hides when the proof textarea has focus and returns on blur.
- 390: repair through the bar sets the layer to repaired, the header to "1 of 6 layers repaired", and the spine to 49%, $0.92 / 1k, p95 2.3 s. The state survives a reload.
- 768: spine 6 columns × 128px, 157px tall. TOC toggle hidden, TOC list visible below content. Action bar `display: none`.
- 320: header one row, 57px tall. Action bar 56px row, both controls 44px high. No horizontal page scroll.
- Blocked storage at 320 and 390: banner text is exact, height 65px, no overflow. Checks and ticks still work for the session.
- Retrieval: "refund policy" returns doc-07 first at 0.91. A no-match query shows the exact no-results text.
- Calculator: defaults show $0.94, $281.25, 2.40 s. Zero shows "Enter at least 1 request." and three dashes. 100,000 requests shows $2,812.50 monthly.
- Contrast: muted small text 6.76:1, warning verdict 5.0:1, prose 14.96:1.
- Desktop regression: spine 128px, header 1228px, home column 360..1080 at 1440 and 280..1000 at 1280, 404 footer at 900/800, TOC 260px.

## Screenshots

Final set in `/tmp/lm-qa`:

- `mobile-home-390.png`, `mobile-home-768.png`, `mobile-home-320.png`
- `mobile-roadmap-390.png`, `mobile-roadmap-768.png`, `mobile-roadmap-320.png`
- `mobile-404-390.png`, `mobile-404-320.png`
- `mobile-lesson-retrieval-390.png`, `mobile-lesson-retrieval-768.png`, `mobile-lesson-retrieval-320.png`
- `mobile-lesson-cost-390.png`
- `mobile-check-390.png`, `mobile-check-320.png`
- `mobile-widget-explorer-390.png`, `mobile-widget-calculator-390.png`
- `mobile-toc-open-390.png`
- `mobile-storage-390.png`, `mobile-storage-320.png`, `mobile-storage-banner-390.png`
- `mobile-actionbar-390.png`, `mobile-lesson-bottom-320.png`, `mobile-lesson-768.png`
- `mobile-zoom200-390.png`

Machine-readable results:

- `/tmp/lm-qa/m-inspect-final.json` (30 route and width combinations)
- `/tmp/lm-qa/m-final-2.json` (interactions and states)
- `/tmp/lm-qa/m-actionbar.mjs` output (bar gate and repair flow)

No file was committed.

## Open items and owners

1. 200% text-only scaling (Low). The page does not scroll sideways. Spine labels break mid-word and the fixed action bar grows to 163px. Content is not lost and controls remain reachable. Owner: shell and lesson design. Decision: accept, or redesign the spine and bar at large text. The standard 320px reflow passes.
2. Dev-only `/lessons/nope` log line. Next.js logs "missing param" for the unknown slug in dev mode with `output: 'export'`. The browser gets the 404 page and the production build is clean. Owner: Next.js configuration, or accept as a framework dev artifact. Severity: low.
3. Focus ring on pointer tap (Informational). The ring uses `:focus-visible`, so a tap does not draw it. Keyboard focus draws the 2px ring. This follows US-23, which describes Tab focus. If a ring on tap is required, the owner is `app/globals.css`. Severity: low.
4. Tablet TOC position (Informational). At 768–1023 the TOC sits below content, as US-22 requires. HLD section 7 says "main plus 240px TOC" for tablet. The PRD story wins. Owner: design docs. No code change.
5. Action bar height (Informational). The action row is 56px. The outer box is 57px because of the 1px top border.
6. Footer links. The footer has no links. The PRD requires only the disclaimer, the citation note and the copyright. This is not a defect.
7. Content facts. No lesson prose or content data was changed.
