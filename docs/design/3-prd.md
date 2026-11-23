# Stage 3 — Product requirements (combined)

Sources: `3-prd/stories.md`, `3-prd/flows.md`, `3-prd/goals.md`.
This document is the contract for stages 4 and 5 and for final review. Section 9 records the
conflicts between the parts and the decision taken.

## 1. Product summary

lastminute.dev is a written, static course for software engineers who move into AI. One small
support-triage feature starts broken. Six lessons repair it, one layer at a time. Each lesson
follows one loop: **Read → Check → Build → Prove**. The reader repairs a layer, writes one proof
sentence, and sees the sample score move. The demo succeeds when a first-time visitor maps AI
ideas to known engineering ideas, passes a check with an explanation, and finds the same work
after a reload.

Scope lock: 6 lessons, 4 routes, 2 widgets, no login, no backend, no live API, English only,
one theme.

## 2. Routes and slugs

| ID | Route | Screen | Primary action |
| --- | --- | --- | --- |
| SCR-01 | `/` | Home | "Start with lesson 1" |
| SCR-02 | `/lessons/[slug]` | Lesson reader | "Mark layer repaired" |
| SCR-03 | `/roadmap` | Roadmap | "Continue at the first unfinished lesson" |
| SCR-04 | `/about` | About | "Start lesson 1" |
| SCR-00 | unknown slug or path | Not found, status 404 | "Open the roadmap" |

Canonical slugs, in course order, with titles:

| # | Slug | Title | Length |
| --- | --- | --- | --- |
| 1 | `evaluation` | Evaluation you can trust | 700–1,000 words |
| 2 | `prompt-contract` | Prompt design as a contract | 700–1,000 words |
| 3 | `retrieval` | Retrieval that earns its keep (flagship) | about 2,000 words |
| 4 | `agents` | Agents with a stop rule | 700–1,000 words |
| 5 | `fine-tuning` | Fine-tuning: when it pays | 700–1,000 words |
| 6 | `cost` | Cost and latency budget | 700–1,000 words |

Storage key: `lastminute.progress.v1`. All sample numbers are fixed data in one shared file.

## 3. Shared layout

Five regions: header (wordmark, Home, Roadmap, About, progress text "N of 6 layers repaired");
spine (six layer nodes, home and lesson only); main (one `main` landmark); right rail (lesson
only: table of contents and status); footer (disclaimer, citation note, copyright) on every
screen. A "Skip to content" link is the first focusable item.

Spine nodes: evaluation, prompt design, retrieval, agents, fine-tuning, cost. Each shows a
state (broken red / repaired green) and fixed sample numbers: pass rate, cost per 1k requests,
p95 latency. The block carries the label "Sample evaluation. Fixed data." Every node links to
its lesson. The retrieval node carries "Start here".

## 4. Screens

### SCR-01 Home

First screenful at 1440×900: header, H1 "Repair one broken AI feature. Watch the score climb.",
one-sentence promise, the run panel with three scores, the full spine, the primary button.

Content order:

1. H1 and promise line: "Six short lessons. One afternoon. No login."
2. Run panel: "Triage 40 support tickets", state "Broken", scores `41% pass`, `$0.94 / 1k`,
   `2.4 s p95` at empty progress.
3. Spine, with "Start here" on retrieval.
4. Mapping panel: "Eval set = test suite", "Retrieval = ranked cache", "Agent = loop with a stop
   rule", "Inference cost = load budget".
5. Loop row: Read → Check → Build → Prove.
6. Lesson ledger: six rows (number, title, outcome, time, state, link). Not a card grid.
7. Footer.

Primary "Start with lesson 1" opens `/lessons/evaluation`. Secondary "Fix retrieval first" opens
`/lessons/retrieval`. "See the roadmap" opens `/roadmap`. With saved progress, the primary reads
"Resume lesson" and opens the last open lesson.

### SCR-02 Lesson reader

First screenful: breadcrumb, H1, outcome sentence, meta row (read time, difficulty, layer
number and name), the spine strip, and the start of section 1. Regions: lesson body (640–720 px),
right rail TOC (260 px), spine rail (88 px) on desktop.

Required blocks, in order: outcome header ("You will leave with: {artifact}"), sections with
anchored H2s (3–7 per lesson; the flagship has 8), callouts (`note`, `warning`, `production
tip`), one code block with filename, language, copy button and a "Sample output. Fixed data."
panel, one diagram with a takeaway caption (at least 3 lessons), checks, build task, prove note,
"Mark layer repaired", previous/next, TOC with active section.

Checks: 2 per lesson (flagship 3), 3–4 options each, Submit disabled until a selection exists.
A correct answer shows "Correct." and an explanation of 2 or more sentences; a wrong answer shows
"Not quite.", an explanation that names the correct idea, and "Try again". The verdict and
explanation persist after reload.

Build task: scope sentence, 5 checklist items, counter "N of 5 steps done", reference solution
inside a disclosure. Ticks persist.

Prove note: one textarea, 280-character limit, placeholder "I changed X; the result was Y.",
autosave 800 ms after typing stops, polite live region "Proof saved on this device.".

Completion gate: all checks correct, 5 of 5 ticks, non-empty note. Until then "Mark layer
repaired" is disabled with helper text. A repair sets the lesson to repaired, updates the spine,
and rolls the aggregate to the declared values. The retrieval lesson declares `58% pass`,
`$0.71 / 1k`, `p95 1.4 s`.

Previous/next: lesson 1 shows "Start of the path" with no previous; lesson 6 shows "End of the
path" and "Open the roadmap". Unknown slug renders SCR-00 with status 404 and keeps header and
footer.

### SCR-03 Roadmap

H1 "The path", total time, six core rows (number, title, outcome, time, state "Done / In progress
/ Not started", link), then "Planned, not in this demo" with four topics and no dates. Primary
action opens the first unrepaired lesson; when all are repaired it reads "All layers repaired".

### SCR-04 About

H1 "About this course", the disclaimer, the start button. Content: what the course is, who it
serves, the four-step loop, what is sample data, the citation policy ("The book is cited once per
lesson as further reading. No text or figures are reproduced."), the privacy note ("Progress
stays in this browser."), the independence disclaimer.

### SCR-00 Not found

H1 "This lesson does not exist.", one sentence "Check the URL or open the roadmap.", a link to
`/roadmap`, header and footer. HTTP status 404.

## 5. User stories and acceptance criteria

P0 = the demo fails without it. P1 = polish. P2 = stretch.

### Epic 1 — Shell and landing

- **US-01 Landing (P0).** Given `/`, the hero shows the H1, the promise and the button "Start with
  lesson 1"; the run panel shows "41%" under the label "Pass rate" and "Sample evaluation, fixed
  data"; the mapping panel maps eval set to test suite and inference cost to load budget; the
  button opens `/lessons/evaluation`.
- **US-02 Header and footer (P0).** Every route shows the wordmark "lastminute.dev", "Roadmap" and
  "About"; the current route has `aria-current="page"`; the footer shows "Independent study
  notes. Not affiliated with the author or publisher."
- **US-03 Search (P2).** If built: empty field lists 6 lessons; "retriev" puts Retrieval first;
  "kubernetes" shows "No lesson matches "kubernetes"." and a link to `/roadmap`; Escape closes
  and returns focus. If cut, remove the control from the header completely.

### Epic 2 — Lesson reader

- **US-04 Open a lesson (P0).** `/lessons/retrieval` shows H1 "Retrieval that earns its keep", the
  outcome, "About 25 minutes"; the course tree shows all 6 lessons with the current one marked;
  sections Read, Check, Build and Prove appear in order.
- **US-05 Table of contents (P1).** At 1280 px the rail lists H2 links; the active section has
  `aria-current="true"`; a click scrolls and moves focus to the heading.
- **US-06 Code as evidence (P0).** A code block shows filename, "Copy" and a "Sample output"
  panel; Copy changes to "Copied" for 2 seconds; a failed clipboard shows "Copy failed. Select
  the code."; at 390 px code scrolls inside its box and the page does not scroll sideways.
- **US-07 Previous and next (P0).** Neighbours link correctly; lesson 1 shows "Start of the
  path"; lesson 6 shows "End of the path" and "Open the roadmap".
- **US-08 Unknown lesson (P0).** `/lessons/unknown-topic` returns status 404 with "Lesson not
  found" → use the SCR-00 copy, "Back to course" to `/` and "Open the roadmap" to `/roadmap`.

### Epic 3 — Checks and tasks

- **US-09 Correct answer (P0).** "Correct" plus an explanation of 2 or more sentences; the chosen
  option is marked and the others disabled; the verdict persists after reload.
- **US-10 Wrong answer (P0).** "Not quite" plus an explanation that names the correct idea; "Try
  again" re-enables the options and keeps the explanation; before Submit no option shows a mark.
- **US-11 Build task (P0).** A 5-item checklist with counter "0 of 5 steps done"; at 5 of 5 "Show
  reference solution" becomes enabled; the solution shows with "Hide"; ticks persist.
- **US-12 Prove note (P0).** The field shows the placeholder; a note saves with "Proof saved on
  this device."; the note returns after reload; a blank note keeps "Mark layer repaired" disabled.

### Epic 4 — Progress and resume

- **US-13 Progress survives reload (P0).** A completed lesson shows a tick in the course tree and
  "1 of 6 layers repaired" on home; both remain after reload; a reset control clears them.
- **US-14 Resume (P0).** After reading `/lessons/agents` to Build, home shows "Resume: Agents with
  a stop rule"; the link opens the lesson at the saved section; with no saved position home shows
  "Start with lesson 1".
- **US-15 Storage unavailable (P0).** If `localStorage` throws, all routes render, checks and
  tasks work for the session, and a banner reads "Progress cannot be saved in this browser. You
  can still read every lesson."

### Epic 5 — Eval Spine

- **US-16 Spine display (P0).** Six dots in order with a state and pass rate, cost per 1k and p95;
  "Sample evaluation, fixed data" appears inside the block.
- **US-17 Repair transition (P0).** Clicking the red Retrieval dot opens `/lessons/retrieval`;
  after "Mark layer repaired" the dot turns green and the numbers roll to 58%, $0.71 per 1k and
  p95 1.4 s; after reload the state and numbers remain; the header count moves from 0 to 1 of 6.

### Epic 6 — Retrieval explorer

- **US-18 (P0).** The widget shows a query field, 12 fixed documents and a ranked list; each row
  shows rank, score, chunk text and "Source: doc-03"; the query "refund policy" re-orders with
  doc-07 first; a cleared query shows "Choose a sample query." and keeps 3 examples.

### Epic 7 — Cost calculator

- **US-19 (P0).** Inputs show requests per day (10,000), input tokens, output tokens and price per
  1M tokens; defaults give "Cost per 1k requests" and "Monthly cost" with 2 decimals; 10x traffic
  updates the monthly cost without reload while the "Sample" label stays and the cost per 1k stays
  fixed; 0 or text shows "Enter at least 1 request." and keeps the results as dashes.

### Epic 8 — Roadmap and about

- **US-20 (P0).** `/roadmap` shows 6 rows in order with Done / In progress / Not started, title,
  time, outcome and link; rows stack at 390 px.
- **US-21 (P1).** `/about` states the disclaimer, lists the stack (Next.js, TypeScript, Tailwind
  CSS, no backend, no login, no live model calls), and every footer repeats the disclaimer.

### Epic 9 — Quality

- **US-22 (P0).** At 390 px all 4 routes have no horizontal page scroll; the spine becomes a strip
  and code scrolls in its box; at 768 px text stays one column and the TOC moves below content.
- **US-23 (P0).** Tab from load reaches "Skip to content"; every control has a focus ring of 2 px
  with 3:1 contrast; arrow keys move between check options and Space selects; Escape closes an
  open search or sheet and returns focus.
- **US-24 (P1).** Under `prefers-reduced-motion`, no dot travel and no number roll; no transition
  longer than 100 ms.

## 6. States

No widget fetches data, so there is no spinner. The only async state is the proof save.

| State | Trigger | What shows |
| --- | --- | --- |
| Empty progress | No saved key | Baseline scores; "0 of 6 layers repaired"; "No layers repaired yet. Start with retrieval." |
| Empty proof | Field untouched | Placeholder only |
| Saving | Debounce elapsed | "Saving…", no spinner |
| Proof saved | Save completes | "Proof saved on this device." in a live region |
| Storage unavailable | localStorage throws | Banner; session-only state |
| Check unanswered | Before Submit | Submit disabled; no feedback region |
| Check correct | Correct option | Green feedback plus explanation, no retry |
| Check wrong | Wrong option | Amber feedback, explanation, "Try again" |
| Task 0/5 and 5/5 | Ticks change | Counter and gate update |
| Widget no matches | Query matches nothing | "No results for that query. Try 'refund' or 'billing'." |
| Calculator zero | 0 or empty | Results "—" and "Enter at least 1 request." |
| Copy failure | Clipboard rejects | "Copy failed. Select the text." |
| Lesson repaired | Saved | Green node, declared scores, note, ticks restored |

Control states (default, hover, focus, active, disabled) follow `3-prd/flows.md` section 5. Every
control has a 2 px focus outline; disabled controls use 40% ink and `aria-disabled`.

## 7. Responsive and accessibility

Breakpoints: desktop 1024 px and up (spine rail 88 px, main 640–720 px, TOC 260 px); tablet
768–1023 (main plus 240 px TOC, horizontal spine strip); phone below 768 (one column, 16 px
margins, spine strip in two rows, TOC in a bottom sheet, sticky 56 px action bar for Mark
repaired and Next, 44×44 px touch targets). Code and tables scroll inside their own wrappers.
Never a horizontal page scroll.

Accessibility: one h1 per page, no skipped heading levels; landmarks header/nav/main/complementary/
contentinfo; skip link; focus follows DOM order; native radios and checkboxes; labels on every
control; `aria-label` on icon buttons; live region for copy and save; colour is never the only
signal (state has a text label); text contrast 4.5:1; functional boundaries and the focus ring
3:1 (decorative hairlines are exempt); reduced motion respected; usable at 200% zoom.

Microcopy: use `3-prd/flows.md` section 8 strings exactly. Sentence case, no contractions, no
exclamation marks outside checks.

## 8. Goals, non-goals and success

Measurable goals:

| ID | Goal | Pass condition |
| --- | --- | --- |
| G1 | A new visitor completes lesson 1 | Marked complete with one note, under 3 minutes of interaction and at most 12 interactions; reading time is excluded |
| G2 | Every lesson carries the full loop | 2 checks with explanations (3 on the flagship), 1 five-item task, 1 solution, 1 prove field |
| G3 | "The Run" works in one click | Red node opens lesson 3; after repair it turns green; 41%→58%, $0.94→$0.71, p95 drops |
| G4 | Work survives reload | Tick, note, green layer and position return; a private window shows a clear empty state |
| G5 | Widgets return fixed answers | Preset queries match the expected table in each lesson |

Non-goals: accounts and login; payments; CMS; live model calls; video or audio; site search in the
core (P2 only); community; certificates; analytics; i18n; dark mode; backend or Supabase; email;
automatic grading; native app or PWA.

Success levels: P0 must ship (the three moments plus 6 lessons, 4 routes, spine, two widgets,
disclaimer, passing build). P1 should ship (mapping rows link to lessons; side-panel solution;
keyboard next/previous; resume link; reset progress; at least 3 diagrams; reduced-motion check).
P2 stretch (search; copy proof; roadmap scoreboard; deep links to checks).

Quality bar: `npm run build` passes; the static output has 4 routes and 6 lesson pages; zero
console errors and zero failed requests at 390, 768 and 1440 px; no broken internal link; no
secret in the repository; no external API call. Lighthouse targets (intentions, not measured
claims): accessibility 95+, performance 90 desktop / 85 mobile.

Content bar: original text only; no book text or figures; one citation line per lesson; the
disclaimer in the footer and on `/about`; every output labelled "sample output"; every score
labelled fixed sample data; terms consistent across lessons.

## 9. Conflicts resolved

| Topic | Part A | Part B | Decision |
| --- | --- | --- | --- |
| Slugs | short (`retrieval`) | long (`retrieval-that-earns-its-keep`) | **Short slugs**; titles carry the meaning |
| Task size | 3 items | 5 items | **5 items** in every lesson |
| Start state | "4 of 6 layers healthy" | all layers broken | **All six start broken**, 41% pass, "0 of 6 layers repaired"; a repair moves the count by 1 |
| Home primary | "Start lesson 1" | "Start the retrieval fix" | **Primary starts lesson 1**; secondary "Fix retrieval first"; the spine keeps the "Start here" callout on retrieval |
| Checks per lesson | 1 | 2–3 | **2 checks** (flagship 3) |
| 404 heading | "Lesson not found" | "This lesson does not exist." | **"This lesson does not exist."**; US-08 reads it that way |
| Header nav | logo, Roadmap, About | Home, Roadmap, About | **Logo links home; links Roadmap and About**; no separate "Home" link |
| Search | P2 | not in core | **P2 only**; cut if the quality wave has no time |

## 10. Definition of done (reviewer checklist)

1. `npm run build` passes. `/` opens at 1280 px with no console errors.
2. The hero shows the promise and the 41% pass rate. The spine shows 6 dots. The red Retrieval dot
   opens `/lessons/retrieval`.
3. A wrong answer shows "Not quite" plus an explanation; a correct answer shows "Correct".
4. The task reaches "5 of 5"; the reference solution opens; the note shows "Proof saved on this
   device.".
5. "Mark layer repaired" turns the Retrieval node green: 58%, $0.71 per 1k, p95 1.4 s.
6. Reload `/`: the tick, the note and the "Resume" card return.
7. `/lessons/evaluation` shows "Start of the path"; `/lessons/cost` shows "End of the path";
   `/lessons/nope` shows "This lesson does not exist.".
8. Blocked storage shows the banner and the course still works. At 390 and 768 px there is no
   horizontal page scroll. Tab shows the focus ring.
