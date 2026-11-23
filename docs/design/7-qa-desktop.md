# Desktop QA report (build wave 10, unit U7)

Date: 2026-11-23
Product: lastminute.dev
Scope: desktop browser QA at 1440×900 and 1280×800, dev server and production build.

## Build and console status

- `npm run build`: PASS. Exit 0. TypeScript passed. Next.js created 12 static pages.
- `out/` contains `index.html`, `roadmap.html`, `about.html`, six lesson pages, `404.html` and `_not-found.html`.
- Production browser run: zero console errors and zero page errors on `/`, `/roadmap`, `/about`, and the six lesson pages at both sizes.
- `/lessons/nope` returns status 404. The browser reports one expected resource error for the 404 document. This is not a script error and not a page error.
- Dev server: zero hydration warnings. The dev log has no new content errors from this wave.
- Automated checks: 32 of 32 functional checks pass. 13 of 13 supplementary checks pass. The same suites pass on the dev server and the production build.

## Verdict per area

| Area | Verdict | Notes |
| --- | --- | --- |
| A. Build and static output | PASS | Build is green. All required routes exist. |
| B. Console and hydration | PASS | Zero script and page errors. Zero hydration warnings. The 404 route logs one expected resource error. |
| C. PRD definition of done, items 1–8 | FIXED | All eight items pass after the spine, header, home, footer and TOC fixes. |
| D. Flows | PASS | Home, lesson, roadmap, header, spine, resume and reset flows work. The footer has no links by design. |
| E. Widgets | PASS | Three presets, no-match, empty query, 12 documents, calculator defaults, 10× traffic and invalid input pass. |
| F. Accessibility | FIXED | Skip link, focus rings, keyboard radios and ticks, `aria-current`, TOC focus and Escape pass after the TOC fix. |
| G. Visual craft | FIXED | Paper and ink hold. No gradients or shadows. Contrast passes. The footer now sits at the bottom of short pages. |

## Issues found

### 1. Spine rail is illegible at 1440 px (High, fixed)

- Route: all routes with the spine. Mainly `/` and `/lessons/retrieval`.
- Symptom: Names broke mid-word ("Evaluatio n", "Fine- tuning"). The "Start here" badge crowded the next node. The last node fell below the viewport. Metrics were cramped.
- Root cause: The rail width token was 88 px. Each node used large vertical gaps. The full layer name was shown in a narrow column.
- Fix: Set `--spine-w` to 128 px. Show the first word of the name in the rail. Keep the full name in `sr-only` text and in the link `title`. Put the state word on the order row. Use compact mono micro lines for pass, cost and p95. All six nodes now end at y=647, below the 900 px fold limit.
- Files: `app/globals.css`, `components/shell/SpineNode.tsx`.

### 2. Header container is too narrow (Medium, fixed)

- Route: all routes.
- Symptom: The wordmark, nav and progress crowded the centre of a 1440 px page. The header box was 720 px wide.
- Root cause: `SiteHeader` used `max-w-[var(--main-max)]`.
- Fix: Add `--header-max: 1228px`. Use it for the header container. The header is now 1228 px wide and centred at both sizes. The main text column stays at 720 px.
- Files: `app/globals.css`, `components/shell/SiteHeader.tsx`.

### 3. Home column is off-centre at 1440 px (Medium, fixed)

- Route: `/`.
- Symptom: The 720 px home column sat at x=404..1124. Its centre was 764 px on a 1440 px page.
- Root cause: The home wrapper added `lg:pl-[var(--spine-w)]`. The inner `mx-auto` centred the column in the reduced width and shifted it right by half the rail.
- Fix: Remove the left padding from the home wrapper. The fixed spine does not overlap the column at the 1024 px breakpoint or above. The column now sits at x=360..1080 and centres on the page. At 1280 px it sits at x=280..1000.
- File: `app/page.tsx`.

### 4. Footer did not sit at the bottom of short pages (Medium, found and fixed)

- Route: `/lessons/nope`. Any short page has the same risk.
- Symptom: At 1440×900 the footer ended at y=648. Empty page space remained below it.
- Root cause: The body was not a flex column. `main` did not grow to fill the viewport.
- Fix: Make the body a flex column. Give `#main` `flex: 1 0 auto`. The footer now ends at y=900 on the 404 page at 1440×900, and at y=800 at 1280×800.
- File: `app/globals.css`.

### 5. Escape did not close the phone TOC from the toggle (Medium, found and fixed)

- Route: lesson pages below 768 px.
- Symptom: A user opened "On this page" and pressed Escape. The sheet stayed open. The handler sat on the sheet, but focus stayed on the toggle outside the sheet.
- Root cause: `onKeyDown` was attached to the panel `div` only.
- Fix: Move `onKeyDown` to the TOC `nav`, which contains the toggle and the sheet. Escape closes the sheet at 740 px and returns focus to the toggle. At 768 px the TOC is a static list by design, so there is no sheet to close.
- File: `components/lesson/LessonToc.tsx`.

## Definition of done evidence

1. Build passes. `/` opens at 1280 px with no console errors. PASS.
2. Hero shows the promise and "41% pass". Spine shows six dots. The red Retrieval node opens `/lessons/retrieval`. PASS.
3. Wrong answer shows "Not quite." plus an explanation and "Try again". Correct answer shows "Correct.". PASS.
4. Task reaches "5 of 5 steps done". The reference solution opens. The note shows "Proof saved on this device.". PASS.
5. "Mark layer repaired" turns the Retrieval node green. The node and home show 58%, $0.71 per 1k and 1.4 s. PASS.
6. Reload restores the tick, the note and the "Resume lesson" control. PASS.
7. `/lessons/evaluation` shows "Start of the path". `/lessons/cost` shows "End of the path". `/lessons/nope` shows "This lesson does not exist." and returns 404. PASS.
8. Blocked storage shows the banner. Checks, ticks, session save and repair still work. No horizontal page scroll at 390, 768, 1280 or 1440 px. Tab reaches the focus ring. PASS.

## Widget evidence

- Retrieval explorer: three presets. "refund policy" returns doc-07 first at 0.91. "zzz" shows "No results for that query. Try 'refund policy' or 'billing'.". A cleared query shows "Choose a sample query." and keeps the presets. "All 12 documents" opens 12 rows.
- Cost calculator: defaults show $0.94, $281.25 and 2.40 s. 100,000 requests per day shows $2,812.50 monthly, and cost per 1k stays $0.94. 0 and `abc` show "Enter at least 1 request." and dashed results. Keyboard input works.
- Note: The PRD state table says "Try 'refund' or 'billing'". HLD and LLD resolve this to "refund policy" to match the presets. The code follows the resolved decision.

## Accessibility evidence

- Tab from load reaches "Skip to content". Enter moves focus to `#main`.
- All 23 focusable controls on home and all 47 on the retrieval lesson show a 2 px solid focus ring.
- One `h1` per route.
- Header and spine use `aria-current="page"`. The active TOC link uses `aria-current="true"`.
- Arrow keys move between check radios. Space selects a radio and ticks a task item.
- A TOC click scrolls to the section and focuses the heading.
- Escape closes the phone TOC at 740 px and returns focus to the toggle.
- Contrast: success 5.56, warning 5.00, danger 5.88, muted on surface 6.26, accent on paper 8.60, focus ring on paper 8.60.
- Reduced motion sets `--dur-panel` to 0 ms.

## Visual evidence

- No gradients and no box shadows on any element on `/`.
- No horizontal page scroll on six routes at 1440, 1280, 768 and 390 px.
- Code blocks scroll inside their own box.
- Numeric elements use tabular figures (30 of 30 sampled).
- No card-grid layout. Lists and hairline rows hold the ledger, roadmap and mapping.
- Empty states are readable.
- Footer sits at the bottom of short pages.

## Screenshots

Before the fixes:

- `/tmp/lm-qa/home-1440.png` shows the wrapped spine and narrow header.
- `/tmp/lm-qa/lesson-1440.png` shows the same spine defect on the lesson page.

After the fixes, production build:

- `/tmp/lm-qa/final-home-1440.png`
- `/tmp/lm-qa/final-home-1280.png`
- `/tmp/lm-qa/final-lesson-retrieval-1440.png`
- `/tmp/lm-qa/final-lesson-retrieval-1280.png`
- `/tmp/lm-qa/final-lesson-cost-1440.png`
- `/tmp/lm-qa/final-lesson-cost-1280.png`
- `/tmp/lm-qa/final-roadmap-1440.png`
- `/tmp/lm-qa/final-roadmap-1280.png`
- `/tmp/lm-qa/final-about-1440.png`
- `/tmp/lm-qa/final-about-1280.png`
- `/tmp/lm-qa/final-notfound-1440.png`
- `/tmp/lm-qa/final-notfound-1280.png`
- `/tmp/lm-qa/final-widget-explorer-1440.png`
- `/tmp/lm-qa/final-widget-explorer-1280.png`
- `/tmp/lm-qa/final-widget-calculator-1440.png`
- `/tmp/lm-qa/final-widget-calculator-1280.png`
- `/tmp/lm-qa/final-lesson-768.png`
- `/tmp/lm-qa/final-lesson-390.png`

Test artifacts:

- `/tmp/lm-qa/functional-prod3.json` and `/tmp/lm-qa/functional-dev2.json`
- `/tmp/lm-qa/final-supplementary-prod.json` and `/tmp/lm-qa/supplementary-dev.json`
- `/tmp/lm-qa/final-inspect-1440.json` and `/tmp/lm-qa/final-inspect-1280.json`

## What remains open

- Dev-only log message on `/lessons/nope`. Next.js logs "Failed to generate static paths for /lessons/[slug]" when the unknown slug is requested in dev mode with `output: 'export'`. The browser still gets the correct 404 page and the production build is clean. Severity: low. Owner: shell and Next.js configuration, or accept as a framework dev artifact.
- Footer links. The task list names "footer links". The footer has no links. The PRD requires only the disclaimer, the citation note and the copyright. This is not a defect. If a later wave wants links, the owner is the shell module.
- The running dev server kept an old `globals.css` transform after the first CSS edit. A later CSS content change refreshed it. A dev server restart after CSS edits avoids this. Owner: local tooling. Not a product defect.
- Content facts: no factual content issue found. No lesson prose or content data was changed.

No commit was made.

## Fix pass (final review F2 and F3)

Date: 2026-11-23
Source: `docs/design/8-review.md`, notes F2 and F3. Both are P2.

### F2 — Home wordmark `aria-current`

- Change: The wordmark link sets `aria-current="page"` on `/`. Roadmap and About keep their existing current state.
- File: `components/shell/SiteHeader.tsx`.
- Result: At 1440 and 390 px the home wordmark has `aria-current="page"`. On `/about` the wordmark has no current value and About keeps `aria-current="page"`.

### F3 — Score number roll

- New primitive: `components/ui/ScoreValue.tsx`, exported from `components/ui/index.ts`.
- Use: `components/home/RunPanel.tsx` applies it to pass rate, cost per 1k and p95. `components/shell/SpineNode.tsx` applies it to the same three values. `components/shell/Spine.tsx` passes `ready`.
- Behaviour: The first ready render seeds the value and never rolls. A later value change plays the `.score-in` roll. The class is removed on `animationend`. A reduced-motion preference or a zero `--dur-number` changes the value in place. The state word and live region stay immediate.
- The roll starts in `requestAnimationFrame` after the DOM commit. The new value is in the DOM before the animation starts.

### Fix pass verification

- `npx tsc --noEmit`: PASS.
- `npm run lint`: PASS.
- `npm run build`: PASS. 12 static pages.
- Browser fix pass: 5 of 5 checks pass on the production build and the dev server.
- Existing suites after the change: 32 of 32 functional checks and 13 of 13 supplementary checks pass on production.
- Evidence at 1440 and 390:
  - Home wordmark `aria-current="page"` is present. About wordmark has no current value.
  - A hydration restore with repaired progress shows no roll. Final values are 58%, $0.71 / 1k and 1.4 s.
  - "Mark layer repaired" shows `.score-in` on four elements, then settles on Pass 58%, Cost $0.71 / 1k and p95 1.4 s.
  - A live storage change rolls the home run panel and settles on the final values.
  - With reduced motion, `--dur-number` is 0 ms, no roll appears, and the final values show at once.
  - Zero console errors and zero page errors on the checked routes.
- Fix pass screenshots:
  - `/tmp/lm-qa/fixpass-roll-1440.png` (roll in progress)
  - `/tmp/lm-qa/fixpass-spine-repaired-1440.png` (settled spine)
  - `/tmp/lm-qa/fixpass-home-1440.png` (settled home)
  - `/tmp/lm-qa/fixpass-home-390.png` (phone home)
  - `/tmp/lm-qa/fixpass-reduced-home-1440.png` (reduced motion)
- Evidence JSON: `/tmp/lm-qa/fixpass-prod3.json`, `/tmp/lm-qa/fixpass-dev.json`, `/tmp/lm-qa/fixpass-final-functional.json`.

The earlier desktop fixes are in commit `125318d`. The mobile fixes are in commit `6406296`. The final combined tree passes `npx tsc --noEmit`, `npm run lint`, `npm run build`, the 5 fix pass checks and the 32 functional checks. No content prose was changed. This fix pass did not commit.

