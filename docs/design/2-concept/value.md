# Stage 2 — Concept: learner value first

Angle: give the most value to segment A, software engineers who move into AI.

## 1. Concept and promise

**Concept.** lastminute.dev is a written, interactive course that turns six AI engineering topics into one continuous build for software engineers who move into AI.

**Promise.** "In one afternoon you learn to find the failed layer, choose a design, and defend its cost and latency."

Each lesson maps a new AI idea onto a known skill. Retrieval is a cache with a ranking step. Evaluation is a test suite. An agent is a loop with tools and a stop rule. Inference cost is a load budget. The learner leaves with six artifacts and one proof sentence per lesson.

The build keeps each stage 1 constraint:

- No backend and no login. The content is static and typed. Progress lives in localStorage.
- Six lessons and two widgets. No live API call. Sample output is labelled.
- The content is original. A visible disclaimer says that the course has no affiliation with the book author or publisher.

## 2. The learning loop

Each lesson runs one loop. Each step has a gate. The reader cannot jump to the end.

| Step | Learner action | Gate |
| --- | --- | --- |
| Read | Reads one anchored explanation, 5–8 minutes | Reaches the last section |
| Check | Answers 2–3 inline checks | Each answer gets an explanation |
| Build | Completes one scoped task with a checklist | All boxes tick |
| Prove | Writes one sentence: "I changed X; the result was Y" | The note is saved |

The prove step is the value core. A learner who writes that sentence owns the idea. The site does not grade it. The learner produces the evidence.

After the core path, the learner can:

- Name the layer that failed in a broken AI feature.
- Write a small evaluation set and read its pass rate.
- Build a retrieval pipeline with chunking, ranking and a citation check.
- Describe an agent loop and stop a runaway run with a budget guard.
- Decide when fine-tuning helps and when it wastes money.
- Give a cost and latency estimate at 10x traffic, with the levers named.

## 3. Value per lesson

Each topic gives one outcome and one small artifact. The artifact is the proof.

### 3.1 Evaluation

**After this lesson you can** turn a vague quality claim into a small test set and a pass rate that you can report to your team.
**Artifact:** `eval_set.json` with 8 cases, and a script that prints pass and fail counts plus one failure reason per case. A stub returns fixed sample answers.

### 3.2 Prompt engineering

**After this lesson you can** write a prompt with an explicit role, an output shape and a refusal rule, and test it on three edge cases.
**Artifact:** `prompt.md` version 2, and a table of three inputs and outputs with the change that fixed each failure.

### 3.3 Retrieval (RAG)

**After this lesson you can** build a retrieval pipeline that chunks documents, ranks chunks, and cites the source of each answer.
**Artifact:** a 40-line `search.py` over 12 fixed documents. It prints the top 3 chunks and their scores. The retrieval widget shows the same data.

### 3.4 Agents and tools

**After this lesson you can** describe an agent as a loop with a stop rule, and add a budget guard that halts a runaway run.
**Artifact:** `agent_loop.py` with two tools and three stop conditions: done, error limit, step limit.

### 3.5 Fine-tuning

**After this lesson you can** choose between prompting, retrieval and fine-tuning for one task, and state the data and cost that each choice needs.
**Artifact:** a decision table with three filled rows from the learner's own use case, and a 20-example training file in chat format.

### 3.6 Inference cost and latency

**After this lesson you can** estimate the monthly cost and p95 latency of a feature at 10x traffic, and name three levers that reduce both.
**Artifact:** a filled budget sheet: tokens per request, requests per day, unit price, monthly total, and a latency split across steps. The second widget gives these numbers. The learner records them in the prove note.

## 4. Features, ranked by value and effort

| Feature | Learner value | Demo effort | Verdict |
| --- | --- | --- | --- |
| Six full lessons with checks | High: this is the product | High | Must |
| Progress and resume after reload | High: proof of work | Low | Must |
| Prove note per lesson | High: the loop closes | Low | Must |
| Code blocks with copy and sample output | High: copy the pattern | Low | Must |
| One diagram per hard concept | High: mental model | Medium | Must |
| Inline checks with explanations | High: feedback | Medium | Must |
| Retrieval widget | High: see ranking work | Medium | Must |
| Cost and latency widget | High: defend a number | Medium | Must |
| Reference solution per task | High: unblock a stuck learner | Low | Must |
| Roadmap of later topics | Medium: shows the path | Low | Must |
| Client-side search | Medium | Medium | Later |
| Accounts and cloud sync | Low for a demo | High | Cut |
| Live model calls | Negative: cost, keys, flakiness | High | Cut |
| Video | Low: wrong medium | High | Cut |

Two widgets are Must: the retrieval explorer and the cost calculator. All other features are text, layout or local state.

## 5. Core demo flow

1. The visitor lands on the home page. The hero states the promise and shows the six topics with time labels.
2. The visitor opens lesson 3, retrieval. The page shows the outcome, the time and the course tree.
3. The visitor reads one section and answers one inline check. Feedback and an explanation appear.
4. The visitor uses the retrieval widget. A query change shows the top 3 chunks and their scores on fixed data.
5. The visitor ticks the checklist, opens the reference solution, and writes the prove note.
6. The visitor marks the lesson complete. The tree shows a tick and the progress bar moves.
7. The visitor reloads the page. The tick, the last position and the note are still there.

## 6. What "value proven" means on screen

Three moments must land.

1. **"This maps to what I know."** In the first 20 seconds, a small panel maps an AI concept to a known engineering concept. Eval set equals test suite. Retrieval equals a cache with a ranking step. The mental model clicks.
2. **"The site tests me."** An inline check gives an instant answer with an explanation. The visitor sees that the course checks understanding, not memory.
3. **"My work is still here."** After reload, the tick, the note and the position return. The visitor sees that effort leaves durable evidence.

## 7. Risks to the value and how to avoid them

| Risk | Symptom | Avoidance |
| --- | --- | --- |
| Shallow content | The lesson reads like a summary and names no trade-off | Each lesson names one failure mode and one cost. A fact check follows the writer pass |
| Fake widgets | The widget shows pretty bars and teaches nothing | Fixed data, visible scores, one takeaway caption. The widget repeats the lesson code |
| Toy code | The snippet fails on real data | The code includes chunking, retries and a budget limit. Sample output is real and labelled |
| Broken loop | Checks have no explanation. The note field is absent | The loop table in section 2 is the acceptance test for every lesson |
| Content copied from the book | Similar structure or text | Topic-based titles, own examples, one citation line, a visible disclaimer |
| Overreach | Search, accounts or live calls consume the build time | The cut list stays cut. The roadmap shows later work without building it |
| Lost progress | Reload clears the ticks | One localStorage module. Test a reload before the demo |

The largest risk is shallow content. A thin lesson breaks the first moment in section 6. The fix is fewer lessons with real trade-offs.
