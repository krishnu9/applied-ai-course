# Stage 3 — PRD user stories: lastminute.dev

**Scope:** 6 lessons, 4 routes, 2 widgets. No login, no backend, no live API.
Routes: `/`, `/lessons/[slug]`, `/roadmap`, `/about`.
Slugs: `evaluation`, `prompt-contract`, `retrieval`, `agents`, `fine-tuning`, `cost`.
Reader: software engineer moving into AI. **P0** = the demo fails without it. **P1** = polish. **P2** = stretch.

## Epic 1 — Shell and landing

### US-01 — Landing and navigation
As a reader, I want the promise, score and navigation on the first screen, so that I trust the course and can move.

**P0**
- **Given** `/`, **when** it loads, **then** "Repair one AI feature, layer by layer" and "pass 41%" show.
- **Given** the concept panel, **when** I read it, **then** "eval set" maps to "test suite".
- **Given** "Start with lesson 1", **when** I click it, **then** `/lessons/evaluation` opens.
- **Given** any route, **when** it loads, **then** "lastminute.dev", "Roadmap" and "About" show and the current link has `aria-current="page"`.

### US-02 — Client-side search
As a reader, I want to search lesson titles, so that I can find a topic.

**P2**
- **Given** an empty field, **when** search opens, **then** 6 lesson titles list.
- **Given** "retriev", **when** I type it, **then** `/lessons/retrieval` is the first result.
- **Given** "kubernetes", **when** I search, **then** "No lesson matches "kubernetes"." shows.
- **Given** search is cut, **when** shown, **then** no search control appears.

## Epic 2 — Lesson reader

### US-03 — Open a lesson
As a reader, I want a lesson header and path, so that I know my place.

**P0**
- **Given** `/lessons/retrieval`, **when** it opens, **then** the h1 and "About 25 minutes" show.
- **Given** the course tree, **when** shown, **then** 6 lessons show and the current has `aria-current="page"`.
- **Given** the body, **when** I scroll, **then** "Read", "Check", "Build", "Prove" appear in order.

### US-04 — Code as evidence
As a reader, I want copyable code and output, so that I can reuse the pattern.

**P0**
- **Given** a code block, **when** shown, **then** `search.py`, "Copy" and "Sample output" show.
- **Given** a code block, **when** I click "Copy", **then** "Copied" shows for 2 seconds.
- **Given** clipboard denial, **when** I click "Copy", **then** "Copy failed. Select the code." shows.

### US-05 — Previous and next at both ends
As a reader, I want step controls, so that I never hit a dead end.

**P0**
- **Given** `/lessons/retrieval`, **when** opened, **then** "Previous" links to `/lessons/prompt-contract`.
- **Given** lesson 1, **when** opened, **then** "Start of the path" shows and no previous link exists.
- **Given** lesson 6, **when** opened, **then** "End of the path" and "Open the roadmap" show.

### US-06 — Unknown lesson
As a reader, I want a clear error page, so that I can recover.

**P0**
- **Given** `/lessons/unknown-topic`, **when** opened, **then** "Lesson not found" shows with status 404.
- **Given** that page, **when** shown, **then** links to `/` and `/roadmap` show.

## Epic 3 — Checks and tasks

### US-07 — Check feedback
As a reader, I want check feedback, so that I learn from each answer.

**P0**
- **Given** the correct option, **when** I press "Check answer", **then** "Correct" and a 2-sentence explanation show.
- **Given** a wrong option, **when** I press "Check answer", **then** "Not quite" and an explanation show.
- **Given** a verdict, **when** I press "Try again", **then** all options re-enable.
- **Given** no submit, **when** shown, **then** no option shows a correct or wrong mark.

### US-08 — Build task and prove note
As a reader, I want a task, answer and proof note, so that the lesson ends in evidence.

**P0**
- **Given** "Build", **when** shown, **then** 3 items and "0 of 3" show.
- **Given** 3 ticks, **when** I tick the last item, **then** "3 of 3" shows and "Show reference solution" enables.
- **Given** the solution control, **when** I click it, **then** the reference file and "Hide" show.
- **Given** "Prove", **when** I type a note and leave the field, **then** "Saved" shows within 1 second.
- **Given** a saved note, **when** I reload, **then** the note returns.

## Epic 4 — Progress and resume

### US-09 — Progress and resume
As a reader, I want finished work and my last position saved, so that I can return later.

**P0**
- **Given** lesson 3 is complete, **when** I open `/`, **then** "Retrieval" has a tick and "3 of 6 lessons complete" show. After a reload, both remain.
- **Given** I reach "Build" in `/lessons/agents`, **when** I open `/`, **then** "Resume: Agents with a stop rule" shows.
- **Given** the resume card, **when** I click "Resume", **then** the lesson opens at "Build".

### US-10 — Storage unavailable
As a reader with blocked storage, I want the course to work, so that a setting does not stop me.

**P0**
- **Given** `localStorage` throws, **when** any route loads, **then** the page renders and checks work with no crash.
- **Given** the failure, **when** the page loads, **then** "Progress will not be saved in this browser." shows.
- **Given** a completed step, **when** I finish it, **then** the UI updates for the session.

## Epic 5 — Eval Spine

### US-11 — Spine and repair
As a reader, I want one rail with six layers and live scores, so that I see the system as one run.

**P0**
- **Given** `/`, **when** it loads, **then** 6 dots show with state, pass rate, cost per 1k, p95 and "Sample evaluation, fixed data".
- **Given** the red Retrieval dot, **when** I click it, **then** `/lessons/retrieval` opens.
- **Given** a complete lesson, **when** I click "Mark layer repaired", **then** the dot turns green: 58%, $0.71, p95 1.4 s.
- **Given** the green dot, **when** I reload `/`, **then** the state and "5 of 6 layers healthy" remain.

## Epic 6 — Retrieval explorer

### US-12 — See ranking work
As a reader, I want to change a query and see ranking, so that retrieval becomes concrete.

**P0**
- **Given** lesson 3, **when** it opens, **then** a query field, 12 documents and a ranked list show.
- **Given** the default query, **when** shown, **then** rank, score, chunk text and "Source: doc-03" show.
- **Given** "refund policy", **when** I select it, **then** the top result cites "doc-07".

## Epic 7 — Cost calculator

### US-13 — Defend a cost number
As a reader, I want to vary traffic and tokens, so that I can defend a cost number.

**P0**
- **Given** lesson 6, **when** it opens, **then** requests per day (10,000), token fields and price fields show.
- **Given** the defaults, **when** shown, **then** "Cost per 1k requests" and "Monthly cost" show with 2 decimals.
- **Given** 10x traffic, **when** I change the value, **then** both outputs update without reload.
- **Given** 0 or text, **when** I enter it, **then** "Enter a number above 0." shows.

## Epic 8 — Roadmap and about

### US-14 — Roadmap
As a reader, I want the full path in one view, so that I know what comes next.

**P0**
- **Given** `/roadmap`, **when** it loads, **then** 6 lessons show with "Done", "In progress" or "Not started".
- **Given** a row, **when** shown, **then** title, time, outcome and lesson link show.

### US-15 — About and disclaimer
As a reader, I want the course origin and disclaimer, so that I can trust it.

**P1**
- **Given** `/about`, **when** it loads, **then** "Independent study notes..." and "no backend, no login, no live model calls" show.
- **Given** any footer, **when** shown, **then** the disclaimer shows.

## Epic 9 — Quality

### US-16 — Responsive and keyboard
As a reader, I want small-width and keyboard support, so that I can study anywhere.

**P0**
- **Given** 390 px, **when** any route loads, **then** no horizontal page scroll exists.
- **Given** 390 px, **when** a lesson loads, **then** the spine is a strip and code scrolls in its box.
- **Given** 768 px, **when** a lesson loads, **then** text is one column and the contents rail sits below.
- **Given** Tab from load, **when** I press it, **then** "Skip to content" is first and controls show a 2 px 3:1 ring.
- **Given** a check or open search, **when** I press arrows, Space or Escape, **then** options move and search closes.

## Definition of done for the demo

A reviewer runs these 8 checks in order.

1. `npm run build` passes; `/` has no console errors.
2. The hero shows "pass 41%"; the red Retrieval dot opens `/lessons/retrieval`.
3. A wrong answer shows "Not quite"; a correct answer shows "Correct".
4. "3 of 3" shows; the solution opens; "Saved" shows.
5. "Mark layer repaired" gives 58%, $0.71, p95 1.4 s.
6. Reload `/`: tick, note and "Resume" return.
7. Lesson 1 shows "Start of the path"; lesson 6 "End of the path"; `/lessons/nope` shows "Lesson not found"; empty search lists 6; "kubernetes" finds none.
8. Blocked storage shows the banner; 390 px and 768 px do not scroll sideways; Tab shows the focus ring.
