# Stage 2 — Concept (combined)

Sources: `2-concept/value.md`, `2-concept/different.md`, `2-concept/simple.md`.
The parts agree on the audience, the no-backend constraint and the need for real work from the
reader. They disagree on the number of lessons and widgets. Section 3 decides.

## 1. The concept chosen

**lastminute.dev is the short, written course where you repair one broken AI feature, layer by
layer, and watch one evaluation score climb.**

One small product, "triage 40 support tickets", runs through the whole course. It starts broken.
Each lesson fixes one layer of it: evaluation, prompt design, retrieval, agents, fine-tuning,
serving cost. Every lesson follows one loop: **Read → Check → Build → Prove**. The reader writes
one proof sentence per lesson: "I changed X; the result was Y."

The promise: "In one afternoon you learn to find the failed layer, choose a design, and defend
its cost and latency."

Why this concept wins:

- It uses the gap that stage 1 found. No named competitor combines text-first delivery, one
  continuous project and visible progress.
- Repair is a stronger hook than showcase. Every competitor shows a working demo; this one
  starts with a failing trace.
- Progress becomes evidence. A checked box is weak. A layer that turns from red to green, with a
  pass rate that moves, is strong.
- All of it is static data, layout and local state. No backend, no login, no live model call.

## 2. Audience and the learning loop

Segment A stays first: software engineers moving into AI. Each AI idea maps to a known
engineering idea: an eval set is a test suite; retrieval is a cache with a ranking step; an agent
is a loop with a stop rule; inference cost is a load budget.

| Step | Reader action | Gate |
| --- | --- | --- |
| Read | Reads the anchored explanation | Reaches the last section |
| Check | Answers 2–3 inline checks | Each answer gets an explanation |
| Build | Completes one scoped task with a checklist | All boxes tick |
| Prove | Writes one sentence: "I changed X; the result was Y" | The note is saved locally |

## 3. Scope decision (resolves the conflict between the parts)

| Question | Value part | Simple part | Decision | Reason |
| --- | --- | --- | --- | --- |
| Lessons | Six | Four | **Six** | The Eval Spine needs six layers. The six topics are the product's promise. Content runs in parallel build units, so the extra lessons cost wall-clock time, not quality. |
| Depth | Six full | One flagship, three short | **One flagship + five focused** | The retrieval lesson is long (about 2,000 words). The other five are 700–1,000 words each and keep code, one check and one task. |
| Widgets | Two | One now, one later | **Two** | The retrieval explorer and the cost calculator each prove one lesson. Both use fixed data. |
| Search | Later | Later | **Cut from the core, add only if QA leaves time** | It is convenience, not proof of the flow. |
| Prove note | Must | Not mentioned | **Must** | It closes the loop and is the strongest differentiator for little effort. |
| Routes | Not stated | Four | **Four** | `/`, `/lessons/[slug]`, `/roadmap`, `/about`. |

### The signature moment: "The Run"

The home page and every lesson header show one **spine**: six stage dots on a hairline, one per
layer. Each stage shows its state and its fixed sample numbers (pass rate, cost per 1k requests,
p95 latency). The visitor clicks the red retrieval node and lands in the lesson that owns it.
The reader fixes the layer. The node turns green and the scoreboard moves: pass 41% → 58%, cost
$0.94 → $0.71. Every number is fixed sample data, labelled "sample evaluation, fixed data".

### The three moments that must land

1. "This maps to what I know." In the first 20 seconds, a panel maps AI concepts to known
   engineering concepts.
2. "The site tests me." A check gives an instant verdict and an explanation.
3. "My work is still here." After reload, the tick, the note and the position return.

## 4. Lessons and their artifacts

| # | Lesson (topic title) | Outcome | Artifact |
| --- | --- | --- | --- |
| 1 | Evaluation you can trust | Turn a quality claim into a test set and a pass rate | `eval_set.json` with 8 cases and a stub scorer |
| 2 | Prompt design as a contract | Write a prompt with role, output shape and refusal rule | `prompt.md` v2 with a 3-case edge table |
| 3 | Retrieval that earns its keep (flagship) | Chunk, rank and cite sources in a retrieval pipeline | 40-line `search.py` over 12 fixed documents |
| 4 | Agents with a stop rule | Describe an agent as a loop and add a budget guard | `agent_loop.py` with two tools and three stop conditions |
| 5 | Fine-tuning: when it pays | Choose between prompting, retrieval and fine-tuning | A 3-row decision table and a 20-example file |
| 6 | Cost and latency budget | Estimate cost and p95 at 10x traffic and name three levers | A filled budget sheet from the calculator |

Content rules: original text only; cite the book once per lesson as further reading; no figures
or excerpts from the book; visible disclaimer in the footer and on `/about`.

## 5. Features ranked by value for effort

| Rank | Feature | Learner value | Effort | Verdict |
| --- | --- | --- | --- | --- |
| 1 | Six lessons with code, checks, tasks | The product itself | High | Must |
| 2 | Progress + resume after reload | Proof of work | Low | Must |
| 3 | Prove note per lesson | Closes the loop | Low | Must |
| 4 | Eval Spine with layer states | The signature | Medium | Must |
| 5 | Code blocks with copy + sample output | Copy the pattern | Low | Must |
| 6 | Inline checks with explanations | Feedback | Medium | Must |
| 7 | Retrieval explorer widget | See ranking work | Medium | Must |
| 8 | Cost and latency calculator | Defend a number | Medium | Must |
| 9 | Reference solution per task | Unblock the reader | Low | Must |
| 10 | One diagram per hard concept | Mental model | Medium | Must (at least 3 lessons) |
| 11 | Roadmap page | Shows the path | Low | Must |
| 12 | Client-side search | Convenience | Medium | Stretch |
| 13 | Accounts, sync, streaks | Low for a demo | High | Cut |
| 14 | Live model calls | Negative: keys, cost, flakiness | High | Cut |
| 15 | Video | Wrong medium | High | Cut |

## 6. Demo flow (end to end)

1. The visitor lands. The hero states the promise and shows the broken feature with its score.
2. The visitor clicks the red retrieval node on the spine.
3. The lesson opens with the outcome, the time and the course tree.
4. The reader answers a check and gets an explanation.
5. The reader uses the retrieval explorer on fixed data.
6. The reader ticks the task checklist, opens the reference solution and writes the prove note.
7. The reader marks the layer repaired. The node turns green and the score moves.
8. The reader reloads. The tick, the note and the last position return.

## 7. Visual and interaction signature

- **Paper and ink.** Warm off-white base, near-black ink, 1 px hairlines. Green, amber and red
  only for evaluation state.
- **Two voices.** A warm serif for prose; monospace with tabular numerals for all technical text
  and numbers.
- **The spine.** A narrow rail with six stage dots on one hairline; folds into a strip on phone.
- **Flat schematics.** 1 px strokes, square corners, mono uppercase labels. No gradients, no
  shadows.
- **Code as evidence.** File header, annotation pins, and a "sample output" ledger; diffs show
  before and after.
- **One motion vocabulary.** A dot travels an edge in 600 ms; numerals roll when values change.
  Respect reduced motion.

Anti-patterns: no generic dashboard, no chatbot box, no equal card grid, no progress theater, no
gradient hero, no rainbow code, no ornamental diagrams.

## 8. What stage 3 must produce

The PRD must make this concept testable: user stories with acceptance criteria for each of the
four routes, the lesson loop, the spine, both widgets and the progress module; the screen and
flow detail with empty and error states; and the goals, non-goals and success checks.
