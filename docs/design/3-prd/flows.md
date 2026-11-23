# Stage 3 — PRD: Screens and flows

This part defines each screen, state and flow. Content is static; progress is local.

## 1. Route map

| ID | Route | Screen | Primary action |
| --- | --- | --- | --- |
| SCR-01 | `/` | Home | Start the retrieval fix |
| SCR-02 | `/lessons/[slug]` | Lesson reader | Mark layer repaired |
| SCR-03 | `/roadmap` | Roadmap | Continue at the first unfinished lesson |
| SCR-04 | `/about` | About | Start lesson 1 |
| SCR-00 | any unknown route | Not found | Open the roadmap |

Course order: `evaluation-you-can-trust`, `prompt-design-as-a-contract`, `retrieval-that-earns-its-keep`, `agents-with-a-stop-rule`, `fine-tuning-when-it-pays`, `cost-and-latency-budget`.

## 2. Layout regions

| Region | Content |
| --- | --- |
| Header | Wordmark, nav (Home, Roadmap, About), "N of 6 layers repaired" |
| Spine | Six layer nodes on one hairline with state and sample numbers |
| Main | Page content |
| Right rail | Table of contents and lesson status (lesson only) |
| Footer | Disclaimer, citation note, copyright |

Home and lesson pages show the spine. Nodes link to lessons and show `broken` (red) or `repaired` (green), plus pass rate, cost per 1,000 requests and p95 latency. The spine label is "Sample evaluation. Fixed data."

## 3. Screen specifications

### SCR-01 Home

Purpose: state the promise and route the visitor to one lesson. Regions: all five. The first screenful at 1440×900 shows the header, H1, promise, run panel, full spine and primary button.

Content order:

1. H1: "Repair one broken AI feature. Watch the score climb."
2. Promise: "Six short lessons. One afternoon. No login."
3. Run panel: "Triage 40 support tickets", state "Broken", scores `41% pass`, `$0.94 / 1k`, `2.4 s p95` at empty progress.
4. Spine; the retrieval node carries "Start here".
5. Mapping panel: "Eval set = test suite", "Retrieval = ranked cache", "Agent = loop with a stop rule", "Inference cost = load budget".
6. Loop row: "Read → Check → Build → Prove".
7. Lesson ledger: six rows with number, title, outcome, time, state, link. No card grid.
8. Footer.

Primary action: "Start the retrieval fix". Secondary: "See the roadmap". With progress, show saved scores and the text "Resume lesson".

### SCR-02 Lesson reader

Purpose: deliver one repair through Read → Check → Build → Prove. Regions: header, spine, main, right rail, footer. The first screenful shows breadcrumb, H1, outcome, meta row, spine, primary button and section 1.

| Block | Required content and behaviour |
| --- | --- |
| Outcome | H1, one outcome sentence, "You will leave with: {artifact}" |
| Meta row | Read time, difficulty (Core or Flagship), layer number and name; mono numerals |
| Spine | Compact strip; current node marked; nodes link to lessons |
| Sections | 3–7 `h2` sections with anchor IDs |
| Callouts | `note`, `warning`, `production tip`; icon plus text label |
| Code block | Filename, language, copy, optional diff, sample output labelled "Sample output. Fixed data." |
| Diagram | One flat schematic with a takeaway caption; at least 3 lessons |
| Check | 3–4 options, Submit, explanation; records the first correct answer |
| Build task | Scope, five checklist items, counter, reference solution in a disclosure |
| Prove | Textarea, 280-character limit, placeholder, save status; saves 800 ms after typing stops |
| Mark repaired | Below Prove; enabled at the completion gate |
| Prev / next | Neighbour lessons; keyboard `[` and `]`; disabled at the ends |
| TOC | `h2` list, active item, status summary; sticky right rail |

Gate: all checks correct, 5 of 5 ticks and a non-empty note enable the button. A repair updates the spine and scores. The retrieval lesson declares `58% pass` and `$0.71 / 1k`; other lessons declare values in content files. Use the number roll, or an instant change under reduced motion.

### SCR-03 Roadmap

Purpose: show the order, state and honest scope. Regions: header, main, footer. The first screenful shows H1 "The path", total time and the first four lesson rows.

Content: six core rows with number, title, outcome, time, state and link. Then "Planned, not in this demo" with four topics. Show no dates. Primary action opens the first unrepaired lesson. If all six are repaired, it reads "All layers repaired" and links to the roadmap top.

### SCR-04 About

Purpose: state the scope, method and independence disclaimer. Regions: header, main, footer. The first screenful shows H1 "About this course", the disclaimer and the start button.

Content: scope, audience, the four-step loop, sample-data note, citation policy ("The book is cited once per lesson as further reading. No text or figures are reproduced."), privacy note ("Progress stays in this browser.") and disclaimer.

### SCR-00 Not found

Render for an unknown slug or path. Show H1 "This lesson does not exist.", one sentence of help and a link to the roadmap. Keep the header and footer. Return status 404.

## 4. Flows

### Flow A: home → lesson → check → task → prove → complete → reload

1. Open `/` with empty progress; scores show the baseline.
2. Select "Start the retrieval fix".
3. The lesson opens at the top.
4. Scroll; the rail tracks the active section.
5. Select a check option and press Submit.
6. Correct: green feedback and explanation. Wrong: amber feedback, explanation and "Try again".
7. Query the retrieval explorer; ranked rows show fixed scores.
8. Tick five boxes; the counter reads 5 of 5.
9. Write the proof; status reads "Proof saved on this device."
10. The repair button becomes enabled.
11. Press "Mark layer repaired". The node turns green and scores roll to 58% and $0.71.
12. Reload. Checks, ticks, note, repair state and last section return.

### Flow B: spine node → lesson

1. Select a spine node on home or in a lesson.
2. The node opens the matching lesson.
3. The clicked node becomes current in the strip.
4. A repaired node opens in review mode; the repair action is disabled.

### Flow C: roadmap → lesson

1. Open `/roadmap` from the nav.
2. Read the six rows and their states.
3. Select a row or "Continue".
4. The lesson opens at the top, or at the last section when progress exists.

## 5. States

All data is local; filtering finishes under 16 ms. Only the proof save is asynchronous.

| Element | Default | Hover | Focus | Active | Disabled |
| --- | --- | --- | --- | --- | --- |
| Primary button | Ink fill, paper text | 90% ink, no movement | 2 px outline | 80% ink, offset 1 px | 40% ink, no hover |
| Spine node | Hairline box, dot, label | Hairline turns ink | Outline on the node | Offset 1 px | Not used |
| Check option | Hairline box, radio | Hairline ink | Radio ring plus outline | Radio filled | Not used |
| Submit check | Ink fill | 90% ink | Outline | Offset 1 px | 40% ink until a selection exists |
| Task checkbox | Native 18 px box | Label underline | Native ring plus outline | Checked mark | Not used |
| Proof field | Paper, hairline | Border ink | Border ink plus outline | Caret ink | Read-only when storage is off |
| Mark repaired | Outline button | Ink fill, paper text | Outline | Offset 1 px | 40% ink, helper text visible |
| Copy | Icon plus "Copy" | Ink fill | Outline | "Copied" for 2 s | 40% ink without Clipboard API |
| TOC link | Muted ink | Ink | Outline | Bold plus ink bar | Not used |
| Widget row | Hairline row | Tint | Outline on the row | Opens detail | Not used |
| Number input | Hairline field | Border ink | Outline | Thumb ink | Not used |

| State | Trigger | What the screen shows |
| --- | --- | --- |
| Empty progress | No saved key | Baseline scores; "No layers repaired yet. Start with retrieval." |
| Loading | Any local read or filter | None. The proof save shows "Saving…" without a spinner |
| Storage unavailable | `localStorage` throws | Banner "Progress cannot be saved in this browser. You can still read every lesson." Work lasts for the session |
| Unknown slug | Slug not in the index | SCR-00 with status 404 |
| Check unanswered | Before Submit | Submit disabled; no feedback |
| Check correct | Correct option | Green feedback and explanation |
| Check wrong | Wrong option | Amber feedback, explanation, "Try again"; selection remains |
| Task 0/5 | No ticks | "0 of 5 steps done"; repair disabled |
| Task 5/5 | All ticks | "5 of 5 steps done"; repair waits for checks and proof |
| Proof empty | Untouched field | Placeholder only; no save status |
| Proof saved | Write completes | "Proof saved on this device." in a polite live region |
| Widget no matches | Query matches nothing | "No results for that query. Try 'refund' or 'billing'." Value stays |
| Calculator at 0 requests | Requests field 0 or empty | Results show "—"; "Enter at least 1 request." |
| Copy error | Clipboard write rejects | "Copy failed. Select the text." |
| Complete, reload | Repair saved | Green node, declared scores, note, checks, ticks and anchor return |

## 6. Responsive rules

The page never scrolls sideways. Code and tables scroll inside their own boxes.

| Rule | Desktop, 1024 px and up | Tablet, 768–1023 px | Phone, below 768 px |
| --- | --- | --- | --- |
| Columns | Spine 88 px, main 640–720 px, TOC 260 px | Main plus 240 px TOC | One column, 16 px margins |
| Spine | Vertical rail, sticky, full labels | Horizontal sticky strip, scrollable | Two-row strip with dots and the active label |
| TOC | Right rail, sticky at 96 px | "On this page" disclosure, closed | "On this page" opens a bottom sheet |
| Nav | Inline links | Inline links | Menu button opens a disclosure |
| Code | Full main width, copy in the header | Full width | Horizontal scroll inside, sticky filename bar |
| Tables | Normal | Normal | Scroll inside a wrapper |
| Actions | Inline | Inline | Sticky 56 px bottom bar for repair and next |
| Touch | Pointer only | 44×44 px minimum | 44×44 px minimum, 8 px gaps |

The phone action bar avoids the safe area and focused fields. The sheet traps focus and restores it.

## 7. Accessibility

- One `h1` per page. Sections use `h2`; subsections use `h3`. Do not skip levels.
- Landmarks: `header`, site `nav`, `main`, `complementary` for the rail, `contentinfo`.
- The first focusable item is "Skip to lesson". It shows on focus.
- Focus follows the DOM: header, spine, main, rail, footer. Only check feedback moves focus after Submit.
- Every control has a label. Icon buttons need `aria-label`. Copy results use a polite live region.
- Checks use a `fieldset` with native radios; focus moves to the feedback heading. Task items use native checkboxes; SPACE toggles and the counter announces "3 of 5 steps done".
- Widget rows form a list with one tab stop per row. Arrows move; Enter opens. The filter is labelled "Filter fixed documents".
- Text contrast is at least 4.5:1; UI lines and focus are at least 3:1. A dot always carries a text label.
- Under `prefers-reduced-motion`, disable dot travel, number roll and smooth scroll. Reflow at 320 px and 200% zoom.

## 8. Microcopy

| Trigger | Exact string |
| --- | --- |
| Start button | "Start the retrieval fix" |
| Check correct | "Correct. {explanation}" |
| Check wrong | "Not quite. {explanation}"; button "Try again" |
| Empty progress | "No layers repaired yet. Start with retrieval." |
| Storage error | "Progress cannot be saved in this browser. You can still read every lesson." |
| 404 | "This lesson does not exist." / "Check the URL or open the roadmap." |
| Disclaimer | "lastminute.dev is an independent study project. It is not affiliated with the author or publisher of AI Engineering." |
| Repair button | "Mark layer repaired" |
| Repair confirmation | "Layer repaired. Pass rate 41% → 58%." |
| Proof saved | "Proof saved on this device." |
| Proof placeholder | "I changed X; the result was Y." |
| Widget empty | "No results for that query. Try 'refund' or 'billing'." |

Use sentence case. Use no contractions and no exclamation marks.
