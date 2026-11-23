# Stage 3 — PRD user stories: lastminute.dev

**Scope:** 6 lessons, 4 routes, 2 widgets. No login, no backend, no live API.
Routes: `/`, `/lessons/[slug]`, `/roadmap`, `/about`.
Slugs: `evaluation`, `prompt-contract`, `retrieval`, `agents`, `fine-tuning`, `cost`.
The reader is a software engineer moving into AI. **P0** = the demo fails without it. **P1** = polish. **P2** = stretch. Storage key: `lastminute.progress.v1`.

## Epic 1 — Shell and landing

### US-01 — Landing promise
As a reader, I want the promise and broken score on `/`, so that I trust the repair story.
**P0**
- **Given** `/`, **then** "Repair one AI feature, layer by layer" and "pass 41%" show.
- **Given** "Start with lesson 1", **then** `/lessons/evaluation` opens.
- **Given** the concept panel, **then** "eval set" maps to "test suite".

### US-02 — Header and footer
As a reader, I want stable navigation, so that I can move between routes.
**P0**
- **Given** any route, **then** "lastminute.dev", "Roadmap" and "About" show.
- **Given** the current route, **then** its link has `aria-current="page"`.
- **Given** any footer, **then** "Independent study notes. Not affiliated with the author or publisher." shows.

### US-03 — Client-side search
As a reader, I want a search field, so that I can find a lesson.
**P2**
- **Given** an empty field, **then** 6 lesson titles list.
- **Given** "retriev", **then** `/lessons/retrieval` is the first result.
- **Given** "kubernetes", **then** "No lesson matches "kubernetes"." shows.

If the build cuts search, remove the control whole. The header keeps only the logo and two links.

## Epic 2 — Lesson reader

### US-04 — Open a lesson
As a reader, I want a lesson header and path, so that I know my place.
**P0**
- **Given** `/lessons/retrieval`, **then** the h1 and "About 25 minutes" show.
- **Given** the course tree, **then** 6 lessons show and the current one has `aria-current="page"`.
- **Given** the body, **then** "Read", "Check", "Build", "Prove" show in order.

### US-05 — Code as evidence
As a reader, I want copyable code and output, so that I can reuse the pattern.
**P0**
- **Given** a code block, **then** `search.py`, "Copy" and "Sample output" show.
- **Given** "Copy", **then** "Copied" shows for 2 seconds.
- **Given** clipboard failure, **then** "Copy failed. Select the code." shows.

### US-06 — Previous and next at both ends
As a reader, I want step controls, so that I never hit a dead end.
**P0**
- **Given** `/lessons/retrieval`, **then** "Previous" links to `/lessons/prompt-contract`.
- **Given** lesson 1, **then** "Start of the path" shows and no previous link exists.
- **Given** lesson 6, **then** "End of the path" and "Open the roadmap" show.

### US-07 — Unknown lesson
As a reader, I want a clear error page, so that I can recover.
**P0**
- **Given** `/lessons/unknown-topic`, **then** "Lesson not found" shows with status 404.
- **Given** that page, **then** links to `/` and `/roadmap` show.

## Epic 3 — Checks and tasks

### US-08 — Check feedback
As a reader, I want check feedback, so that I learn from each answer.
**P0**
- **Given** the correct option and "Check answer", **then** "Correct" and a 2-sentence explanation show.
- **Given** a wrong option, **then** "Not quite" and an explanation show.
- **Given** "Try again", **then** all options re-enable.
- **Given** no submit, **then** no option shows a correct or wrong mark.
- **Given** a reload, **then** the last verdict remains.

### US-09 — Build task and reference solution
As a reader, I want a checklist and answer, so that I can finish alone.
**P0**
- **Given** "Build", **then** 3 items and "0 of 3" show.
- **Given** 3 ticks, **then** "3 of 3" shows and "Show reference solution" enables.
- **Given** the solution, **then** the reference file and "Hide" show.

### US-10 — Prove note
As a reader, I want to save one proof sentence, so that the lesson ends in evidence.
**P0**
- **Given** "Prove", **then** the hint "I changed X; the result was Y." shows.
- **Given** a note and blur, **then** "Saved" shows within 1 second.
- **Given** a reload, **then** the note returns.
- **Given** an empty note, **then** "Mark layer repaired" stays disabled.

## Epic 4 — Progress and resume

### US-11 — Progress survives reload
As a reader, I want finished work to persist, so that I can return later.
**P0**
- **Given** lesson 3 is complete, **then** "Retrieval" has a tick and "3 of 6 lessons complete" shows.
- **Given** a reload, **then** the tick and count remain.

### US-12 — Resume position
As a reader, I want my last position saved, so that I resume without searching.
**P0**
- **Given** I reach "Build" in `/lessons/agents`, **then** `/` shows "Resume: Agents with a stop rule".
- **Given** "Resume", **then** the lesson opens at "Build".

### US-13 — Storage unavailable
As a reader with blocked storage, I want the course to work, so that a setting does not stop me.
**P0**
- **Given** `localStorage` throws, **then** all routes and checks work without a crash.
- **Given** the failure, **then** "Progress will not be saved in this browser." shows.
- **Given** a completed step, **then** the UI updates for the session.

## Epic 5 — Eval Spine

### US-14 — Spine and repair
As a reader, I want one rail with six layers and live scores, so that I see the system as one run.
**P0**
- **Given** `/`, **then** 6 dots show with state, pass rate, cost per 1k and p95.
- **Given** any spine, **then** "Sample evaluation, fixed data" shows.
- **Given** the red Retrieval dot, **then** a click opens `/lessons/retrieval`.
- **Given** a complete lesson, **then** "Mark layer repaired" turns it green: 58%, $0.71, p95 1.4 s.
- **Given** a reload, **then** the green state and "5 of 6 layers healthy" remain.

## Epic 6 — Retrieval explorer

### US-15 — See ranking work
As a reader, I want to change a query and see ranking, so that retrieval becomes concrete.
**P0**
- **Given** lesson 3, **then** a query field, 12 documents and a ranked list show.
- **Given** the default query, **then** rank, score, chunk text and "Source: doc-03" show.
- **Given** "refund policy", **then** the top result cites "doc-07".

## Epic 7 — Cost calculator

### US-16 — Defend a cost number
As a reader, I want to vary traffic and tokens, so that I can defend a cost number.
**P0**
- **Given** lesson 6, **then** requests per day (10,000), token fields and price fields show.
- **Given** the defaults, **then** "Cost per 1k requests" and "Monthly cost" show with 2 decimals.
- **Given** 10x traffic, **then** both outputs update without reload.
- **Given** 0 or text, **then** "Enter a number above 0." shows.

## Epic 8 — Roadmap and about

### US-17 — Roadmap
As a reader, I want the full path in one view, so that I know what comes next.
**P0**
- **Given** `/roadmap`, **then** 6 lessons show in order with "Done", "In progress" or "Not started".
- **Given** a row, **then** title, time, outcome and lesson link show.

### US-18 — About and disclaimer
As a reader, I want the course origin and disclaimer, so that I can trust it.
**P1**
- **Given** `/about`, **then** the disclaimer "Independent study notes..." shows.
- **Given** `/about`, **then** "no backend, no login, no live model calls" shows.
- **Given** any footer, **then** the disclaimer shows.

## Epic 9 — Quality

### US-19 — Phone and tablet
As a reader on a small screen, I want no sideways scroll, so that I can study anywhere.
**P0**
- **Given** 390 px on all routes, **then** no horizontal page scroll exists.
- **Given** 390 px, **then** the spine is a strip and code scrolls in its box.
- **Given** 768 px, **then** one text column and the contents rail sits below.

### US-20 — Keyboard focus
As a keyboard user, I want every control reachable and visible, so that I need no mouse.
**P0**
- **Given** Tab from load, **then** "Skip to content" is the first stop.
- **Given** focus on any control, **then** a 2 px ring shows with 3:1 contrast.
- **Given** a check, **then** arrow keys move and Space selects.
- **Given** open search, **then** Escape closes it and focus returns.

## Definition of done for the demo

A reviewer runs these 8 checks in order.

1. `npm run build` passes; `/` has no console errors.
2. The hero shows "pass 41%"; the red Retrieval dot opens `/lessons/retrieval`.
3. A wrong answer shows "Not quite"; a correct answer shows "Correct".
4. "3 of 3" shows; the solution opens; "Saved" shows.
5. "Mark layer repaired" gives 58%, $0.71, p95 1.4 s.
6. Reload `/`: tick, note and "Resume" return.
7. Lesson 1 shows "Start of the path"; lesson 6 "End of the path"; `/lessons/nope` shows "Lesson not found"; empty search lists 6; "kubernetes" shows no match.
8. Blocked storage shows the banner; 390 px and 768 px do not scroll sideways; Tab shows the focus ring.
