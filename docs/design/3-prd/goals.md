# 3. Goals, Non-Goals and Success

Scope: goals, non-goals, success checks, quality bars, constraints and risks. Every goal is testable in the browser or the build output.

## 1. Product goal

lastminute.dev is a static, written course for software engineers who move into AI work. One support-triage feature starts broken. Six lessons repair it, one layer at a time. Each lesson follows one loop: Read, Check, Build, Prove. The reader repairs a layer, writes one proof sentence, and sees the sample score move. The demo succeeds when a first-time visitor maps AI ideas to known engineering ideas, passes a check, and finds the work after a reload.

## 2. Measurable demo goals

| ID | Goal | Check | Pass condition |
| --- | --- | --- | --- |
| G1 | Lesson 1 complete for a new visitor | Stopwatch and click count, no login | Under 3 minutes and at most 8 clicks, with one prove note |
| G2 | Full loop in each lesson | Count page items | 2 checks, 1 task, 1 solution and 1 note field in each of 6 lessons |
| G3 | "The Run" in one click | Click the red node, then repair the layer | Lesson 3 opens. The node turns green. Pass 41% to 58%, cost $0.94 to $0.71, p95 moves |
| G4 | Reload keeps work | Complete, note, reload, private window | Tick, note, layer and position return. The private window has an empty state, no error |
| G5 | Widgets return fixed answers | 3 explorer queries, 2 calculator presets | Results match the lesson table and carry the "fixed sample data" label |

G2 also shows in the build output: 4 routes and 6 lesson pages.

## 3. Non-goals

1. **Accounts and login.** Progress lives in one browser; no identity is needed.
2. **Payments.** No price and no seller.
3. **CMS or admin editor.** Content is static, versioned files.
4. **Live model calls.** Keys, cost and latency break the static promise.
5. **Video or audio.** The promise is text-first.
6. **Site search in the core.** Convenience, not proof of the loop.
7. **Community features.** No backend means no moderation.
8. **Certificates or grades.** Checks explain; they do not certify.
9. **Analytics or tracking.** No cookie, third-party script or personal data.
10. **Internationalization.** English only.
11. **Dark mode.** One paper-and-ink theme stays; a second theme doubles the test cost.
12. **Backend, database or Supabase.** localStorage only.

## 4. Success criteria

The criteria map to three moments: M1 "This maps to what I know", M2 "The site tests me", M3 "My work is still here".

### P0: must ship

- **M1:** The home panel shows 6 AI-to-engineering pairs in the first viewport.
- **M2:** Each lesson has 2 checks. Each answer gets a verdict and an explanation.
- **M3:** The tick, the note, the layer state and the last lesson survive a reload.
- **Core:** 6 lessons, 4 routes, the spine, both widgets, the disclaimer, a passing build.

### P1: should ship

- **M1:** Each panel row links to its lesson.
- **M2:** The checklist opens the reference solution. Keyboard next and previous work.
- **M3:** A "continue" link on home. A reset-progress control.
- **Core:** 3 diagrams, print styles, a reduced-motion check.

### P2: stretch

- Client-side search (titles, summaries, key terms).
- A copy button for the proof sentence.
- A per-layer scoreboard on the roadmap.
- Deep links to a check or a section.

## 5. Quality bar

- `npm run build` passes. The output has 4 routes and 6 lesson pages.
- Zero console errors and failed requests at 390, 768 and 1440 px.
- No broken internal link.
- Lighthouse intentions: accessibility 95 or more. Performance 90 or more on desktop and 85 or more on mobile.
- Contrast 4.5:1 or more. Visible focus. One heading order. Keyboard controls. Reduced motion.
- No sideways page scroll. Code blocks scroll inside their own box.
- No secret in the repository. `.env.example` lists names only. No external API call.

## 6. Content bar

- Original text only. No chapter text, long excerpt or reworded passage.
- No figure from the book. All diagrams are original.
- One citation line per lesson names the book as further reading. It does not quote it.
- The footer and `/about` show the disclaimer: independent course, not affiliated with the author or publisher.
- Every code output block carries the label "sample output".
- Every score, cost and latency number carries the label "sample evaluation, fixed data".
- The widgets read fixed tables. Numbers do not move by chance.
- Terms and code names stay the same across lessons.

## 7. Constraints and assumptions

| Constraint | Value |
| --- | --- |
| Hosting | Vercel, static output, zero configuration |
| Backend | None. No stateful API, database or job |
| Identity | No login |
| Content | 6 lessons, typed static files |
| Widgets | 2, fixed sample data |
| Language | English |
| Storage | localStorage through one data-access module |
| Browsers | Chrome, Safari, Firefox and Edge, last 2 versions |
| Network | No external call at runtime |

Assumptions: the reviewer uses a desktop browser. The sample score table is fixed and reviewed once. The flagship lesson is about 2,000 words; the other five are 700 to 1,000.

## 8. How success is judged

The owner checks browser items. A reviewer agent checks build items. A content reviewer checks text. No reviewer approves their own work.

1. `npm run build` passes. Reviewer.
2. Build output lists 4 routes and 6 lesson pages. Reviewer.
3. Zero console errors at 390, 768 and 1440 px. No broken internal link. Reviewer.
4. G1: lesson 1 completes in under 3 minutes and at most 8 clicks. Owner.
5. G2: each lesson has 2 checks, 1 task, 1 solution and 1 note field. Content reviewer.
6. G3: the red node opens lesson 3, turns green and moves the numbers. Owner.
7. G4: a reload restores the tick, note, layer and position. Owner.
8. G4: a private window shows an empty state with no error. Owner.
9. G5: both widgets match the expected table. Owner.
10. M1: the mapping panel is visible in the first 20 seconds. Owner.
11. M2: a check gives a verdict and an explanation. Owner.
12. The disclaimer and the citation line are present. Content reviewer.
13. No secret and no external model call. Reviewer.

Verdict rule: the demo passes when all P0 items pass. A P1 miss is a note, not a block. The owner gives the final verdict.

## 9. Risks and first cuts

| Risk | Effect | Mitigation |
| --- | --- | --- |
| Thin or wrong content | Reader leaves | Outline. Fact review. Word budget. |
| Widget bugs on a phone | The proof breaks | Fixed data. One expected table. Test at 390 px. |
| localStorage is blocked | Work is lost | Try/catch. A visible empty state. |
| Scope creep | Nothing ships | P0 first. P1 and P2 wait. |
| A copyright slip | Takedown risk | Section 6 rules. Content sign-off. |
| Numbers differ between pages | Lost trust | One shared sample data file. |

First cuts, in this order:

1. Site search (P2).
2. Copy-proof and share (P2).
3. Roadmap scoreboard (P2).
4. Deep links (P2).
5. Diagrams in lessons 4 to 6. Keep 3 (P1).
6. Keyboard next and previous (P1).
7. Resume banner (P1).
8. Cost calculator becomes a printed table. The retrieval explorer stays (P0, last resort).

Never cut: 6 lessons, checks, prove note, spine, persistence, disclaimer.
