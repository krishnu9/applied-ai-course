# Content review — build wave 8

Scope: six lessons, shared score data. 2026-11-23.

## Verdict

| Lesson | Accuracy | Checks | Code | Voice | Originality | Overall |
| --- | --- | --- | --- | --- | --- | --- |
| evaluation | PASS | PASS | FIX | PASS | PASS | FIX (minor) |
| prompt-contract | FIX | PASS | FIX | FIX | PASS | FIX |
| retrieval | FIX | PASS | FIX | FIX | PASS | FIX |
| agents | FIX | PASS | FIX | PASS | PASS | FIX |
| fine-tuning | PASS | PASS | FIX | FIX | PASS | FIX |
| cost | FIX | PASS | PASS | PASS | PASS | FIX |

All 13 checks have one correct option; none is ambiguous.

## Top 5 issues

### 1. Cost example uses a wrong monthly figure
File: `/Users/krishnu/AgenttyProjects/lastminute-dev/content/lessons/cost.ts`, section `prove-the-saving`, paragraph `p-cost-17`.
Quote: "I cut the output from two hundred fifty to one hundred tokens; the monthly cost fell from 281.25 to 181.25 dollars and p95 fell from 2.4 to 1.56 seconds."
Fix: use 247.50: (1000 + 100) × 0.75 / 1,000,000 × 10,000 × 30 = 247.50. The p95 1.56 s is correct.
Why: `p-cost-18` says check the arithmetic. The example treats a 150-token cut as a 100-dollar cut.

### 2. Retrieval trace contradicts its own documents
File: `/Users/krishnu/AgenttyProjects/lastminute-dev/content/lessons/retrieval.ts`, section `trace-one-query`, paragraph `p-retrieval-11`.
Quote: "The billing document wins the lexical list. It repeats the word policy in a sentence about the billing policy. The return label document says return and label, not refund."
Fix: align the trace with the data. `doc-02` has no "policy" or "refund"; `doc-08` has "refunds" ("a return label is free for refunds and exchanges"). Either edit the documents or rewrite the cause: lexical cannot separate them, and fusion puts `doc-02` above `doc-08`. Update `p-retrieval-2`.
Why: this is the flagship diagnosis. A reader sees the stated cause is false.

### 3. Agents lesson promises three stop conditions; the code shows one and a dead branch
File: `/Users/krishnu/AgenttyProjects/lastminute-dev/content/lessons/agents.ts`, sections `read-the-stop-rule` (`p-agents-4`, `p-agents-9`) and `build-the-guard` (`code-agents-loop`).
Quote: "Error: a tool fails twice and the agent cannot continue." The code returns `"reason": "repeat"` and has no error path.
Fix: use one model. Define done, stuck/repeat and budget, and add a tool-error path. Or keep done, budget and error, and make repeat raise the error reason. Make repeat reachable: `lookup_order("A-17")` returns "late", so done fires on the second pass. Align `p-agents-9`, task item 5 and the solution.
Why: the lesson asks for one test per stop condition. The sample cannot produce repeat, and the solution cannot produce done.

### 4. Retrieval calls a similarity a distance
File: `/Users/krishnu/AgenttyProjects/lastminute-dev/content/lessons/retrieval.ts`, section `read-the-index`, paragraph `p-retrieval-6`.
Quote: "The score is a distance between the two vectors. Close vectors mean close meaning."
Fix: "The score is a similarity between the two vectors. A higher score means closer meaning." Keep the descending scores.
Why: a distance ranks in the opposite direction. The lesson's scores are higher-is-better (`p-retrieval-14`, `p-retrieval-37`).

### 5. Prompt lesson reports an impossible rate on a three-case table
File: `/Users/krishnu/AgenttyProjects/lastminute-dev/content/lessons/prompt-contract.ts`, section `prove-the-contract`, paragraph `p-prompt-16`.
Quote: "The parse error rate fell from twenty percent to two percent on the edge table."
Fix: cite the 41-case run from lesson 1, or say "the edge table went from 1 of 3 to 0 of 3". The edge table holds three tickets (`p-prompt-8`).
Why: a three-case table cannot produce a 20% or 2% rate. The proof template cannot be reproduced.

Also blocking: `retrieval.ts` `run-the-explorer`, `p-retrieval-21`: "If a repair changes the order of a preset, the row moves at once." The widget uses fixed scores (`p-retrieval-20`, `p-retrieval-41`), so a repair in `search.py` cannot move a row. Rewrite it to match `p-retrieval-41`.

## Per-lesson findings

### Evaluation (`content/lessons/evaluation.ts`)
- `p-eval-9`: "A set of forty cases can move five points by chance." Verify: n=41 gives a ±15-point 95% band, so five points is inside noise.
- `code-eval-harness`: `Path("eval_set.json")` resolves against the working directory. Run from `eval/` or use `Path(__file__).with_name("eval_set.json")`. Output 17/41 = 41% is correct.
- The solution lacks the data file; task item 5 is a process step. Add a note or the sample `eval_set.json`.
- Checks `check-1` (b), `check-2` (c) correct.

### Prompt (`content/lessons/prompt-contract.ts`)
- `p-prompt-4` names "A role that names the task"; `list-prompt-parts` item 1 is "State the task in one sentence" and never names the role. Align them.
- Solution `prompts/check_shape.py` omits `sample` and `print(check(sample))`; item 5 cannot run. Add both lines.
- Checks `check-1` (b), `check-2` (b) correct. The shape-only scope matches `p-prompt-12`.

### Retrieval (`content/lessons/retrieval.ts`)
- `p-retrieval-2` repeats the false cause: "it puts the billing cycle document above the return label document". Fix it with `p-retrieval-11`.
- `code-retrieval-search`: `SYNONYMS = {"refund": "returns", "policy": "policy"}` holds a no-op self-map. Remove it. `text_hits = sum(1 for w in words if w in doc["text"])` is substring matching, so "refund" matches "refunds" and "late" would match "translate". The output matches; use tokens or state the rule.
- Solution defines only `terms` and `score`; items 2 and 5 cannot run. Include `DOCS`, `QUERY`, the ranking and the print loop.
- Diagram `retrieval-flow` says "Word search"/"Vector search"; prose says "lexical"/"dense" (`p-retrieval-7`). Use one pair.
- Checks `check-1` (b), `check-2` (b), `check-3` (b) correct. In `check-1`, say the refund document matches both terms through its tags.

### Agents (`content/lessons/agents.ts`)
- `p-agents-6`/`p-agents-12` claim token and call counters; the code has `steps` and `seen` only. Align the prose with the demo.
- `p-agents-2` says "The model chooses the tool and the arguments"; the code hardcodes `("lookup_order", "A-17")` and ignores `task`. Mark the model call as a stub.
- `p-agents-17`: "stopped with reason repeat after one step"; the code returns `steps=2`. Say "after one tool call (steps=2)".
- Solution never calls `run_agent` and has no done path; add both.
- Checks `check-1` (b), `check-2` (b) correct.

### Fine-tuning (`content/lessons/fine-tuning.ts`)
- Artifact: "A three-row decision table and a twenty-example file". This conflicts with `p-finetune-10` ("twenty examples and thirty failure types, the set is too thin") and `examples >= 100`. Reword to "a small labeled example file".
- Solution prints two choices and omits "new rule" → prompting; task item 4 asks for three rows. Add the third call.
- "labelled" (`p-finetune-2`, `p-finetune-10`, `check-1`) versus "labeled" (`retrieval.ts` `p-retrieval-37`). Use US "labeled".
- `p-finetune-18`: "A gain under five points does not pay for the training run." Verify as a rule of thumb.
- Checks `check-1` (b), `check-2` (c) correct. Keep the "facts stay outside" callout.

### Cost (`content/lessons/cost.ts`)
- `p-cost-9`: "Cost per request is input plus output, times the price per million". The sample uses one price for both; real providers split input and output. Add that caveat. Reword "each token cost" to "the retrieval wait plus prefill and decode time".
- Solution uses literals `400`, `0.6`, `5.6`; use the named constants.
- Checks `check-1` (b), `check-2` (a) correct. The main output is correct: 0.0009375, 0.94, 281.25, 2400 ms.

### Cross-lesson
- Baseline 41% / $0.94 / 2.4 s matches `content/scores.ts` (0.41 / 0.94 / 2400).
- `scores.ts` layer name "Cost budget" versus lesson title "Cost and latency budget"; align them.
- `/Users/krishnu/AgenttyProjects/lastminute-dev/docs/design/2-concept.md` line 73 says "`eval_set.json` with 8 cases"; the lesson uses 41 and the task asks for 20. Update the doc.
- All six lessons cite "AI Engineering by Chip Huyen" once and quote nothing. No reproduction found.

## Do not change

- The Read → Check → Build → Prove loop, the short declarative voice and the one-sentence proof note.
- The retrieval trace shape: query, two candidate lists, fused order, expected order, one named rule. Fix the data, not the structure.
- The retrieval limits: candidate dump, metadata filter, access control and "Matched is not correct."
- The cost constants and the cost per request / per 1k / monthly / p95 breakdown. Only the lever example is wrong.
- The agents result object with `reply`, `reason`, `steps` and the "count the calls, not the words" callout.
- The evaluation 41-case set, the held-out callout, "A demo is not a score." and the strong/weak proof pair.
- The prompt key set, refusal rule, "Confidence is not a promise." and "One change per run."
- The fine-tuning rung list, "Facts stay outside." and the held-out set rule.
- The citation line and the "Sample output. Fixed data." labels.

Blocking fixes: 6
