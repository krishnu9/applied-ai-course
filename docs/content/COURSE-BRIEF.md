# Course brief — 24 lessons

This file is the authoring contract. An author writes against it; a reviewer checks against it.
If a rule here conflicts with an earlier draft, this file wins.

## 1. Purpose and audience

lastminute.dev teaches AI engineering to software engineers who prepare for interviews. The
reader can build software. The reader cannot yet find a failed layer, choose a design, and defend
its cost and latency.

The course covers the interview-core topics of ten chapters. One small support-triage product
runs through all 24 lessons. The reader repairs that product, layer by layer, and watches one
evaluation score move.

The promise: "In one afternoon you learn to find the failed layer, choose a design, and defend
its cost and latency."

The teaching order is fixed. Explain the topic first. Apply it to the triage product second.
The triage case is the evaluation layer, never the teaching voice.

## 2. The 24 lessons

`★` marks a flagship lesson. A flagship has a longer budget and one interactive diagram.

| # | Ch | Slug | Title | Core concepts | ★ |
| --- | --- | --- | --- | --- | --- |
| 1 | 1 | `ai-stack` | The AI engineering stack | application, model and infrastructure layers; AI vs ML; build vs buy; failure ownership | — |
| 2 | 2 | `foundation-models` | How a foundation model makes text | tokens; embeddings; attention; next-token prediction; context window | — |
| 3 | 2 | `model-scaling` | Model size, data and compute | parameters; scaling laws; emergent vs smooth gains; serving cost | — |
| 4 | 2 | `post-training` | Pretraining, SFT and preference tuning | base vs instruct; instruction tuning; RLHF/DPO; data shape | — |
| 5 | 2 | `sampling-and-hallucination` | Why the model varies and why it invents | temperature and top-p; non-determinism; hallucination causes; detection; mitigation | — |
| 6 | 3 | `evaluation` | Evaluation you can trust | verifiable vs subjective; exact/F1/similarity; noise; offline vs online; perplexity | — |
| 7 | 3 | `eval-sets` | Build a frozen eval set | sourcing; labelling; coverage; contamination; held-out sets; eval-driven development | — |
| 8 | 3 | `llm-as-judge` | Judges, rubrics and bias | pointwise vs pairwise; rubric design; position, verbosity and self bias; human agreement | ★ |
| 9 | 4 | `eval-criteria` | Criteria and rubrics | knowledge; reasoning; instruction following; format; safety; cost and latency; slices; pass@k | — |
| 10 | 4 | `model-selection` | Choose a model with evidence | benchmarks; contamination; arena and Elo; confidence; cost-quality frontier | ★ |
| 11 | 5 | `prompt-contract` | Prompt design as a contract | anatomy; instruction precedence; delimiters; output contract; few-shot; CoT; injection defence | ★ |
| 12 | 5 | `structured-outputs` | Reliable structured output | JSON schema; function-calling schema; constrained decoding; validate and repair; failure modes | — |
| 13 | 5 | `context-engineering` | Spend context on purpose | window; token budget; lost in the middle; long context vs RAG; compression; prefix caching | ★ |
| 14 | 6 | `retrieval` | Retrieval that earns its place | index vs query; chunking; embeddings; BM25; ANN; hybrid; RRF; reranking; citations | ★ |
| 15 | 6 | `retrieval-quality` | Measure and repair retrieval | recall@k; MRR; nDCG; query rewriting; contextual retrieval; retrieval eval sets | — |
| 16 | 6 | `agents` | Agents with stop rules | loop; tool schemas; function calling; planning; stop conditions; failure taxonomy; memory | ★ |
| 17 | 7 | `fine-tuning` | Prompt, RAG or fine-tune | when to fine-tune; form vs facts; SFT; data needs; held-out eval; forgetting | — |
| 18 | 7 | `lora-memory` | LoRA and memory maths | rank; trainable parameters; optimizer state; GPU memory; QLoRA; serving trade-offs | ★ |
| 19 | 8 | `dataset-curation` | Data quality, coverage and splits | quality; coverage; quantity; dedupe; contamination; annotation; splits | — |
| 20 | 8 | `synthetic-data` | Synthesis and distillation | teacher and student; verification; model collapse; licensing | — |
| 21 | 9 | `cost` | Latency, throughput and goodput | TTFT; TPOT; p50/p95/p99; throughput; goodput; prefill and decode; batching | ★ |
| 22 | 9 | `inference-optimization` | Make serving cheaper | quantization; speculative decoding; KV cache; continuous batching; prefix caching | — |
| 23 | 10 | `ai-architecture` | Guardrails, gateways and fallbacks | guardrails; router and gateway; caches; fallback; agent patterns; human review | — |
| 24 | 10 | `observability-feedback` | Observe quality and learn from users | logs, traces and metrics; MTTD/MTTR/CFR; explicit vs implicit feedback; feedback bias; privacy | — |

The six old slugs stay: `evaluation` (6), `prompt-contract` (11), `retrieval` (14),
`agents` (16), `fine-tuning` (17) and `cost` (21). Lesson 7 takes the old evaluation harness as
input and adds held-out sets.

## 3. The 12-part lesson template

Every lesson uses these 12 parts in order. The word counts are guidance; the section 5 total is
binding.

| # | Part | Must contain | Must not contain | Words |
| --- | --- | --- | --- | --- |
| 1 | Outcome and terms | Three "You can" verbs; prerequisites; 4–6 glossary terms | Topics written as goals; "understand"; unused terms | 50–70 |
| 2 | What it is | One STE definition; one worked example; one non-example | History; vendor names; an analogy | 150–180 |
| 3 | ELI5 #1 | One analogy in 3–5 sentences; one "where it breaks" line; one prediction or check | A second analogy; terms that the analogy hides | 120–180 |
| 4 | How it works | Numbered mechanism; one inputs/outputs table; one static diagram | An analogy; code longer than 40 lines | 260–320 |
| 5 | ELI5 #2 | A different analogy; its "where it breaks" line; a prediction question | A repeat of analogy #1; a new concept | 120–180 |
| 6 | Where it fails | Symptom → cause → check → fix table, 3–4 rows; one trade-off sentence | A second mechanism; the triage case | 120–160 |
| 7 | The triage case | The broken layer, the trace, the decision | A definition; new terms; the answer as a spoiler | 150–220 |
| 8 | Interactive diagram | Flagship only: one variable; a visible response; a "try this" prompt | More than one variable; a live model call | 40–60 |
| 9 | Concept checks | 4–6 checks: definition, apply, diagnose/calculate; 2-sentence explanations | Trick questions; a seventh check | 60–100 |
| 10 | Evaluation task | Five-item triage task; fixed data; reference solution; transfer to a second case | Open-ended work with no expected output | 80–110 |
| 11 | Prove | The proof note; a three-point self-rubric | A grade; acceptance of "it works" as proof | 40–60 |
| 12 | Interview corner | Four questions: definition, trade-off, failure mode, scale | Answers over four sentences | 200–300 |

### 3.1 Technical explanation first

Part 2 defines the topic before any story. Part 4 shows the mechanism before any repair. A
reader who stops after part 2 still knows what the term means. A reader who stops after part 6
knows the concept and its limits.

The triage case sits in part 7 only. Part 7 applies the concept; it does not teach it. Do not
open a lesson with a broken ticket, a failing trace or a support complaint. The current six
lessons do this; the rewrite inverts the order.

### 3.2 ELI5 rules

- Use two or three dedicated ELI5 sections per lesson. Part 3 and part 5 are mandatory. Add
  ELI5 #3 after part 6 only when the mechanism has two distinct mental models.
- One analogy per section. Develop it in 3–5 sentences. Name the parts that map to the concept.
- Add one sentence that starts "Where it breaks:" and states the limit of the mapping.
- End each section with one prediction question or one inline check. The reader must use the
  analogy to answer.
- Never mix an analogy into the STE explanation. ELI5 sections have their own heading,
  surface and label. Parts 2, 4 and 6 contain no analogies.
- Total ELI5 budget: 240–540 words.

### 3.3 ASD-STE100 rules

- Maximum 20 words per instruction. Maximum 25 words per descriptive sentence.
- Use active voice and simple present. Do not use "-ing" forms as verbs.
- Do not use contractions. Write "do not", never the short form.
- Use one term for one concept. Use the term in `GLOSSARY.md`. Do not rotate synonyms for style.
- Define each term at first use. A defined term points to one glossary entry.
- One instruction per sentence. Use a vertical list for three or more steps.
- Do not omit articles. Keep noun clusters to three words or fewer.

## 4. Word budgets

| Part group | Standard | Flagship |
| --- | --- | --- |
| Parts 1–7, 9–11 (prose) | 1,100–1,500 | 1,900–2,400 |
| ELI5 total (parts 3 and 5, plus optional 3) | 240–540 | 240–540 |
| Interview answers (part 12) | 200–320 | 200–320 |

Flagship lessons add 700–900 words, mostly in part 4 (mechanism depth) and part 9 (extra check
kinds). Keep part 7 at 150–250 words. The validator checks the total, not each row.

## 5. Diagram rules

Every lesson has one static diagram, from five variants:

| Variant | Use for |
| --- | --- |
| `flow` | A pipeline with ordered steps and branches |
| `stack` | Layers or a stack of components |
| `matrix` | Two dimensions, criteria × evidence, or a decision grid |
| `timeline` | Latency, stages, or events over time |
| `bars` | Quantities, budgets, or a cost-quality trade-off |

- Show a mechanism or a quantity, not decoration.
- The caption states the takeaway. The alt text states the reading order: "Flow from A to C".
- One interactive diagram sits on a flagship only: one variable, a visible response, a "try
  this" prompt.

## 6. Evaluation rules

Each lesson has:

- **4–6 checks.** Use the kinds `definition`, `apply` and `diagnose`/`calculate`; include at
  least one non-definition check. Each explanation has two sentences: the correct idea, then
  why the tempting option fails.
- **One five-item triage task.** The items diagnose, choose, build, verify on fixed data, and
  transfer to a second case. The task ships a reference solution.
- **One proof note.** The reader writes one sentence: "I changed X; the result was Y." The note
  carries a three-point self-rubric: **mechanism** (does it name the layer and the rule?),
  **evidence** (does it give a fixed number or order?), **limit** (does it name one blind spot
  or failed case?).
- **The repair gate stays.** A lesson is complete only when every check is correct, five of five
  ticks are set, and the note is not empty.

## 7. Interview corner

Part 12 holds four questions with short answers:

| Kind | Question shape | Answer |
| --- | --- | --- |
| Definition | "What is X?" | 2–4 sentences |
| Trade-off | "When do you choose X over Y?" | 2–4 sentences |
| Failure mode | "How does X fail, and what do you check?" | 2–4 sentences |
| Scale | "How does X change at 10x traffic or tokens?" | 2–4 sentences |

Answers are model answers, not essays. Each answer names one term from the glossary and one
number or check.

## 8. Exclusions and copyright

**FYI exclusion list.** Do not teach these topics. They add pages and no interview value:

- History of language models.
- Vendor and tool catalogues.
- Accelerator hardware surveys.
- Model merging and multi-task tactics.
- Organisation and team advice.
- Predicted industry trends.

**Copyright rule.** Use topics only. Write original examples, tables and diagrams. Do not copy
book text, figures or tables. Do not paraphrase closely. Add one citation line per lesson:

> Further reading on {topic}: *AI Engineering* by Chip Huyen (O'Reilly). This course is
> independent and reproduces no book text or figures.

## 9. Authoring workflow

**Ownership.** One author owns one chapter folder: `content/lessons/ch-XX/*.ts`. The author
does not edit `lib/`, `components/`, the registry or another chapter. Engine agents own the
registry, types, widgets and layout. Doc editors own `docs/content/`.

**Naming.** Use one file per lesson: `content/lessons/ch-XX/{slug}.ts`. Export
`{camelSlug}Lesson`. Section ids are kebab-case. Block ids start with the lesson slug. Check ids
are `check-1` to `check-6`. Task item ids are `item-1` to `item-5`.

**Hand-off.** The author writes the lesson, updates its `COVERAGE.md` row and asks for review. A
different agent reviews. No author approves their own chapter.

**Review.** The reviewer checks facts and numbers, STE limits, one "where it breaks" line per
ELI5, word counts, glossary spelling, copyright, diagram variant, caption and alt, check kinds,
interactive diagrams on flagships only, the repair gate, and no FYI content or book text.

## 10. Per-lesson done checklist

1. Chapter, order, slug and title match the table in section 2; the old slug is preserved.
2. The outcome has three "You can" verbs; prerequisites are listed.
3. The 4–6 terms appear in `GLOSSARY.md` with the same spelling.
4. One STE definition, one worked example, one non-example; no analogy in part 2.
5. Two or three ELI5 sections; each has a 3–5 sentence analogy, one "where it breaks" line, and
   one prediction or check; total 240–540 words.
6. A numbered mechanism, one inputs/outputs table, and the static diagram with caption and alt.
7. The failure table has 3–4 rows (symptom, cause, check, fix) and one trade-off.
8. The triage case sits in part 7 only, at 150–250 words, and never carries a definition.
9. The 4–6 checks include an apply or diagnose/calculate item; each explanation has two
   sentences.
10. The five-item task has fixed data, a reference solution, and a transfer item to a second
    case.
11. The proof note is followed by the three-point rubric (mechanism, evidence, limit).
12. Four interview answers cover definition, trade-off, failure mode and scale; all prose is in
    budget; one citation line; no FYI content; no book text; the validator passes.
