# Pilot review — lessons 8 and 14

Reviewer: `pilot-review`, wave 4. Date: 2026-11-25.

Scope: `content/lessons/llm-as-judge.ts` (lesson 8, flagship) and `content/lessons/retrieval.ts` (lesson 14, flagship).

Contract: `docs/content/COURSE-BRIEF.md`, `docs/content/GLOSSARY.md`, `docs/content/COVERAGE.md`, `lib/types.ts`, `lib/course-registry.ts`.

Method: The reviewer reads both lessons and the registry. The reviewer runs both task solutions. The reviewer runs the strict validator. The reviewer runs headless Chrome at 390, 768, and 1440. The reviewer inspects the screenshots.

## 1. Verdicts

| Lesson | Verdict | Blocking issues |
| --- | --- | --- |
| 8 `llm-as-judge` | **FIX** | 8 (6 content, 2 shared engine) |
| 14 `retrieval` | **FIX** | 7 (5 content, 2 shared engine) |

Both lessons are close. The teaching order is correct. The mechanisms are sound. The task code runs, and the printed numbers match the text. The failures are local and fixable. No lesson needs a rewrite.

The 13 blocking issues are distinct. Two issues affect both lessons. Section 3 lists them.

## 2. Teaching quality

- **Concept before story: pass.** Both lessons define the topic in part 2 and show the mechanism in part 4. The triage case sits in part 7. Neither lesson opens with a broken ticket.
- **ELI5: mostly pass.** Both lessons use two different analogies. Each analogy names the mapped parts. Each section has a `Where it breaks` line and a prediction question. The retrieval analogies have six sentences each. The template allows 3–5 sentences (B5, B6).
- **Mechanism depth: pass.** Lesson 14 explains BM25, chunking, embeddings, ANN, hybrid retrieval, RRF, reranking, recall@k, freshness, and access control. Lesson 8 explains the judge pipeline, rubric levels, output fields, Elo, the audit, and the three bias metrics.
- **Filler: no filler section.** Lesson 8 repeats the judge cost in `p-llm-as-judge-5` and `p-llm-as-judge-35`. Merge the two points or cross-reference them. This is minor.
- **Triage case: pass.** Both cases show the broken layer, the trace, and the decision. The cases apply the concept. They do not teach it.
- **Interview corner: mostly pass.** The answers are short model answers, not essays. Lesson 8 answer 3 has five sentences (B13).
- **Voice: pass.** No contractions found. The terms are stable. Lesson 8 adds `position-flip rate` and `verbosity gap` without glossary entries. This is a glossary gap (N6).

## 3. Blocking issues

A blocking issue is a template rule miss, a factual error, a data mismatch, or a scale-level rendering defect. The list holds 13 distinct issues. Two issues affect both lessons.

### 3.1 Shared engine issues

**B1. The lesson terms are never rendered.**
- **File:** `components/lesson/LessonHeader.tsx`; `lib/types.ts:60`.
- **Section:** part 1, outcome and terms.
- **Quote:** The lesson data holds six terms. The header renders `outcome` and `artifact` only. `grep -rn "lesson.terms" app components` returns no match.
- **Fix:** Add a term list after the artifact line. Show each term and its definition. Link each term to the glossary.
- **Why:** Template part 1 requires 4–6 terms. The reader cannot see them. The defect affects both lessons and all 24 lessons at scale.

**B2. The interview block adds a second H2.**
- **File:** `components/lesson/InterviewCorner.tsx`; `components/lesson/SectionRenderer.tsx`.
- **Section:** `interview-corner`; `interview-llm-as-judge`; `retrieval-interview-1`.
- **Quote:** The rendered order is H2 `Interview practice`, H2 `Interview corner`, then H3 questions. The judge page shows H2 `Interview corner` twice.
- **Fix:** Render the interview title as H3. Render each question as H4. Or remove the inner H2 and keep the section H2.
- **Why:** The heading order is wrong. The judge page has a duplicate H2. Screen-reader navigation is confusing. This defect affects both lessons.

### 3.2 Retrieval content issues

**B3. The interactive has two variables.**
- **File:** `content/lessons/retrieval.ts`; `components/widgets/RagRankLab.tsx`.
- **Section:** `rank-the-candidates`.
- **Quote:** The widget shows a `Sample query` text input and a `BM25 weight` range input. The lesson says: `Set the BM25 weight to 0.0, then to 1.0` and `then try the other presets`.
- **Fix:** Keep one variable. Lock the query to a preset selector. Use the weight as the only variable. Or remove the query input and show one fixed query.
- **Why:** Template part 8 allows one variable. The lab changes the query and the weight. The reader cannot attribute the rank change to one cause.

**B4. The control named `BM25 weight` does not use BM25.**
- **File:** `components/widgets/RagRankLab.tsx`; `content/lessons/retrieval.ts`.
- **Section:** `rank-the-candidates`.
- **Quote:** The control is labeled `BM25 weight`. The implementation is `hits / terms.length` on a substring match. It has no IDF and no length normalization.
- **Fix:** Use the BM25 score from `retrieval/search.py`. Or relabel the control `word-overlap weight` and state the simplification in the caption.
- **Why:** Part 4 defines BM25 with IDF, `k1`, `b`, and length normalization. The lab teaches a different function.

**B5. ELI5 #1 has six sentences.**
- **File:** `content/lessons/retrieval.ts`.
- **Section:** `explain-it-simply`.
- **Quote:** `Think of a library with three helpers. ... The first helper is precise, the second helper handles paraphrase, and the third helper is slow but careful.`
- **Fix:** Merge the last two mapping sentences into one. The analogy then has five sentences.
- **Why:** Template part 3 allows 3–5 sentences. The section has six.

**B6. ELI5 #2 has six sentences.**
- **File:** `content/lessons/retrieval.ts`.
- **Section:** `explain-it-simply-again`.
- **Quote:** `Think of a hiring process. ... The first pass is cheap, the second pass finds adjacent skills, and the last pass costs the most time.`
- **Fix:** Merge the last two mapping sentences into one. The analogy then has five sentences.
- **Why:** Template part 3 allows 3–5 sentences. The section has six.

**B7. The lab explanation gives a false cause.**
- **File:** `content/lessons/retrieval.ts`.
- **Section:** `rank-the-candidates`.
- **Quote:** `At 1.0 the word overlap lifts doc-02, because its text repeats policy.`
- **Fix:** Write `because doc-02 matches policy and the weight favors the lexical score.`
- **Why:** `doc-02` contains `policy` once. It does not repeat the word. The lab output shows doc-02 moves from rank 3 to rank 2 at weight 1.0. Doc-07 stays first.

### 3.3 Judge content issues

**B8. The lesson cites lesson 7 for data that lesson 7 does not hold.**
- **File:** `content/lessons/llm-as-judge.ts`; `content/lessons/eval-sets.ts`.
- **Section:** `before-you-start`; `the-triage-case`; `evaluation-task`.
- **Quote:** `Lesson 7 froze 41 triage cases.` `The labels come from lesson 7 and do not change.` `This lesson needs lesson 6 on evaluation and lesson 7 on eval sets.`
- **Fix:** Point these lines to lesson 6. Lesson 6 holds the 41-case set (`pass rate 41% (17/41)`). Or write lesson 7 first and give it the 41 cases and labels.
- **Why:** Lesson 7 is a draft stub (`status: "draft"`). It has no cases and no labels. The pilot cites data that does not exist.

**B9. The ten judge pairs are not from the billing slice.**
- **File:** `content/lessons/llm-as-judge.ts`; task solution `judge/audit.py`.
- **Section:** `evaluation-task`.
- **Quote:** `The task uses ten fixed reply pairs from the billing slice.`
- **Fix:** Write `ten fixed reply pairs across the support slices`. Or replace the data with ten billing pairs.
- **Why:** The ten pairs cover refunds, returns, late parcels, cancellations, customs, billing, damage, and shipping. Only pair `p8` is billing. The text and the fixed data disagree.

**B10. Item 5 has no runnable transfer.**
- **File:** `content/lessons/llm-as-judge.ts`; task solution `judge/audit.py`.
- **Section:** `evaluation-task`, `item-5`.
- **Quote:** `Repeat the audit on the password-reset slice and name one blind spot.` The solution ends with `# Transfer: run the same audit on the password-reset slice.`
- **Fix:** Add the password-reset pairs. Run the same audit. Report the two rates. Or change item 5 to the data that exists.
- **Why:** The contract requires a five-item task, fixed data, and a runnable reference solution. A comment is not a solution.

**B11. `repeatable score` contradicts the drift warning.**
- **File:** `content/lessons/llm-as-judge.ts`.
- **Section:** `what-it-is`; `how-it-works` table.
- **Quote:** `A judge turns an open question into a repeatable score.` The table says pointwise weakness: `The score can drift between runs.`
- **Fix:** Write `A judge turns an open question into a score under a fixed prompt and sampling.`
- **Why:** Temperature zero reduces variation. It does not guarantee repeatability. The lesson says two opposite things.

**B12. `A zero flip rate rules out position bias` is too strong.**
- **File:** `content/lessons/llm-as-judge.ts`.
- **Section:** `evaluation-task`.
- **Quote:** `A zero flip rate rules out position bias.`
- **Fix:** Write `A zero flip rate gives no evidence of position bias on these ten pairs. It does not rule out position bias in general.`
- **Why:** The solution uses a deterministic length rule. The zero rate follows from the code. Ten fixed pairs cannot prove the absence of a bias. The lesson elsewhere says a gap is `a warning, not a proof`.

**B13. Interview answer 3 has five sentences.**
- **File:** `content/lessons/llm-as-judge.ts`.
- **Section:** `interview-corner`, item 3.
- **Quote:** `A judge can favor the first slot, the longer answer or its own model family. ... Audit 20 labeled cases and report the human agreement rate.`
- **Fix:** Merge the audit sentences. Use four sentences or fewer.
- **Why:** Template part 12 forbids answers over four sentences. The answer has five.

## 4. Non-blocking notes

| # | Lesson | Note | Suggested action |
| --- | --- | --- | --- |
| N1 | retrieval | The citation omits `is independent`. It says `This course reproduces no book text or figures.` | Use the canonical citation line from `COURSE-BRIEF.md` section 8. |
| N2 | retrieval | The static flow diagram has `min-w-[460px]`. At 390 the last nodes need an inner horizontal scroll. The page itself does not scroll. | Add a compact or vertical diagram for narrow screens. Keep the current caption and alt. |
| N3 | retrieval | The live region says only `3 results for refund policy.` It does not announce the new order. | Add the first result to the live text, for example `First result doc-07.` |
| N4 | retrieval | The reference solution computes IDF over title, tags, and text for the body-only `before` pass. The printed output is correct. | Use the same field set for IDF and term frequency. |
| N5 | retrieval | `gives a tag match double weight` is a fixed `+2.0` tag bonus. It is not a doubling of the BM25 score. | Say `a tag bonus of 2.0`. |
| N6 | judge | `position-flip rate` and `verbosity gap` are not in `GLOSSARY.md`. | Add both entries, or use the existing bias terms. |
| N7 | judge | Part 2 is 215 words. The row guidance is 150–180 words. The total is in budget. | Trim two sentences if the guidance matters. |
| N8 | judge | The ELI5 #1 prediction question has 28 words. | Shorten it to 25 words or fewer. |
| N9 | both | The six-term list is a subset of the core concepts. Lesson 14 defines `hybrid retrieval`, `reranker`, and `recall@k` inline. Lesson 8 defines `self bias` and `human agreement rate` inline. | Accept the inline definitions, or refresh the term lists at scale. |
| N10 | both | The rendered term list is absent (B1). The outcome and artifact are visible. | Fix B1 first. |

## 5. What the other 22 lessons should copy

1. **Concept-first order.** Define the topic in part 2. Show the mechanism in part 4. Put the triage case in part 7.
2. **Two ELI5 sections.** Use two different analogies. Name the mapped parts. Add a `Where it breaks` line and a prediction question. Keep each analogy to 3–5 sentences.
3. **Fixed data in one source.** Put the documents and presets in `content/retrieval.ts`. Make the task solution read that source.
4. **A runnable solution.** Run the code. Make the printed numbers match the lesson text. Lesson 14 does this well: recall@3 0.33 → 1.00 on the refund query, and mean 0.56 → 1.00.
5. **A failure table.** Use symptom, cause, check, and fix. Use 3–4 rows. Add one trade-off sentence.
6. **A proof note.** Ask for mechanism, evidence, and limit. Keep the note to one sentence.
7. **Four checks.** Use one definition, one apply, one diagnose, and one calculate. Use two-sentence explanations.
8. **Four interview questions.** Cover definition, trade-off, failure mode, and scale. Keep each answer to four sentences or fewer.
9. **One flagship interactive.** Use one variable, a visible response, and a try-this prompt. Label the control with the function that it runs.
10. **One citation line and one `evalCase`.** Keep the citation to one line.
11. **Diagram caption and alt.** State the takeaway in the caption. State the reading order in the alt text.
12. **A triage trace.** Show the broken layer, the trace, and the decision. Do not open the lesson with the broken ticket.

## 6. Ready to scale

**Ready to scale: NO.** Fix the 13 blocking issues and the two shared renderer defects before the other 22 lessons copy this template.

## 7. Evidence

### 7.1 Commands and results

| Command | Result |
| --- | --- |
| `node /tmp/pilot-review-solutions/extract.mjs` | Wrote `retrieval_search.py` (133 lines) and `judge_audit.py` (56 lines) from the lesson data. |
| `python3 -I /tmp/pilot-review-solutions/retrieval_search.py` | Refund: before doc-02/doc-01/doc-03, recall@3 0.33; after doc-07/doc-08/doc-02, recall@3 1.00. Billing: 0.67 → 1.00. Late delivery: 0.67 → 1.00. Mean: 0.56 → 1.00. |
| `python3 -I /tmp/pilot-review-solutions/judge_audit.py` | `position flip rate: 0.00`; `human agreement: 0.40`. This matches the lesson text. |
| `node /tmp/pilot-review-solutions/metrics.mjs` | Retrieval prose 2007 words (budget 1900–2400); ELI5 252 words (240–540); analogies 6 and 6 sentences. Judge prose 2164 words; ELI5 256 words; analogies 5 and 5 sentences; interview answer 3 has 5 sentences. |
| `node /tmp/pilot-review-solutions/validate-pilot.cjs` | 43 total faults in the course. 0 faults name lesson `retrieval` or lesson `llm-as-judge`. The only match for the word `retrieval` is the draft status of `retrieval-quality`. |
| `npm run typecheck` | Exit 0. |
| `node /tmp/lm-qa/pilot-review.mjs` | 0 console errors and 0 page errors at 390, 768, and 1440 for both lessons. No page horizontal scroll. Tables have captions and `scope="col"`. Diagrams have alt text and captions. Interactive labels are present. |
| `node /tmp/lm-qa/pilot-review-interact.mjs` | Judge: verdict changes from Answer A to Answer B after the swap. Retrieval: weight 0.0 gives doc-07/doc-08/doc-02; weight 1.0 gives doc-07/doc-02/doc-08. |
| `node /tmp/lm-qa/pilot-review-elements.mjs` | Wrote section screenshots for the header, ELI5, diagram, interactive, and interview. |
| `node /tmp/lm-qa/pilot-review-bottom.mjs` | Body padding-bottom is 56px. The citation sits at y=739 in an 844px viewport. The action bar does not cover it at rest. |

The retrieval fixed data matches `content/retrieval.ts`: 12 documents, 0 field mismatches, and all three preset orders match. The judge fixed pairs are inline in `judge/audit.py`, not in `content/retrieval.ts`.

### 7.2 Screenshots

Full page:
- `/tmp/lm-qa/pilot-review-retrieval-390.png`
- `/tmp/lm-qa/pilot-review-retrieval-768.png`
- `/tmp/lm-qa/pilot-review-retrieval-1440.png`
- `/tmp/lm-qa/pilot-review-llm-as-judge-390.png`
- `/tmp/lm-qa/pilot-review-llm-as-judge-768.png`
- `/tmp/lm-qa/pilot-review-llm-as-judge-1440.png`

Sections and interactions:
- `/tmp/lm-qa/pilot-review-retrieval-header-390.png`
- `/tmp/lm-qa/pilot-review-retrieval-header-1440.png`
- `/tmp/lm-qa/pilot-review-retrieval-eli5-390.png`
- `/tmp/lm-qa/pilot-review-retrieval-diagram-390.png`
- `/tmp/lm-qa/pilot-review-retrieval-diagram-1440.png`
- `/tmp/lm-qa/pilot-review-retrieval-interactive-390.png`
- `/tmp/lm-qa/pilot-review-retrieval-interview-390.png`
- `/tmp/lm-qa/pilot-review-retrieval-weight-1440.png`
- `/tmp/lm-qa/pilot-review-llm-as-judge-header-390.png`
- `/tmp/lm-qa/pilot-review-llm-as-judge-header-1440.png`
- `/tmp/lm-qa/pilot-review-llm-as-judge-eli5-390.png`
- `/tmp/lm-qa/pilot-review-llm-as-judge-diagram-390.png`
- `/tmp/lm-qa/pilot-review-llm-as-judge-diagram-1440.png`
- `/tmp/lm-qa/pilot-review-llm-as-judge-interactive-390.png`
- `/tmp/lm-qa/pilot-review-llm-as-judge-interview-390.png`
- `/tmp/lm-qa/pilot-review-judge-before-1440.png`
- `/tmp/lm-qa/pilot-review-judge-after-1440.png`
- `/tmp/lm-qa/pilot-review-retrieval-bottom-390.png`
- `/tmp/lm-qa/pilot-review-llm-as-judge-bottom-390.png`

## 8. Coverage and copyright check

- **Registry identity: pass.** Lesson 8 is `llm-as-judge`, order 8, chapter `ch-03`, title `Judges, rubrics and bias`. Lesson 14 is `retrieval`, order 14, chapter `ch-06`, title `Retrieval that earns its place`. Both are flagships. The old slugs are preserved.
- **COVERAGE, lesson 8: pass.** The lesson owns `AI as a judge` and `Comparative evaluation`. It covers pointwise and pairwise judgment, rubric design, position, verbosity, and self bias, Elo, preference models, and human agreement. It applies rubric and Elo.
- **COVERAGE, lesson 14: pass.** The lesson owns `RAG architecture` and `Retrieval algorithms`. It covers index time versus query time, chunking, embeddings, BM25, ANN, hybrid retrieval, RRF, reranking, and citations. It covers the chunk and rerank part of `Retrieval optimisation`. Lesson 15 owns query rewriting and contextual retrieval. The Useful fit row `RAG beyond text` is not mentioned. A fit row is optional, so this is not a blocking gap.
- **FYI exclusions: pass.** Neither lesson teaches history, a vendor catalogue, accelerator hardware, model merging, team advice, or industry trends.
- **Originality: pass.** The examples are original: the library, hiring, food critic, referee, and support documents. The mechanisms are standard technical facts. No book sentence, figure, table, or chapter structure found. Each lesson has one citation line. Lesson 14 omits `is independent` from the citation (N1).
