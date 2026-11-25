# Coverage audit — book inventory to lessons

Scope: the 42 Core rows in `BOOK-INVENTORY.md`, the mapping in `COVERAGE.md`, and the 24
lessons in `content/lessons/`. Method: read each lesson's definition, mechanism, failure table
and interview corner. A row counts as taught only when the lesson gives a definition, a
mechanism and a use or failure mode. One term is not evidence.

## 1. Summary counts

| Measure | Count |
| --- | --- |
| Core concepts | 42 |
| Taught, complete | 34 |
| Taught, one named sub-item absent or thin | 8 |
| Mentioned only | 0 |
| Missing at row level | 0 |
| Named Core sub-item groups absent | 6 |
| Named Core sub-items thin | 2 |

All 42 Core rows have an owning lesson. `COVERAGE.md` reports 38 full and 4 partial rows. The 4
old partials (MoE, entropy/BPC, data format and CoT data, pruning) now appear in lessons 3, 6,
19 and 22. This audit confirms those folds and finds 8 new partial rows not in `COVERAGE.md`.

## 2. Coverage by chapter

Depth: **T** = taught; **P** = taught but one named sub-item is absent or thin.

### Chapter 1

| Concept | Lesson | Depth | Note |
| --- | --- | --- | --- |
| Stack layers | 1 `ai-stack` | T | Three layers, failure ownership. |

### Chapter 2

| Concept | Lesson | Depth | Note |
| --- | --- | --- | --- |
| Training-data bound | 3 `model-scaling` | T | Data bounds capability; long-tail case. |
| Transformer, attention, tokens | 2 `foundation-models` | T | Full forward pass. |
| Parameters, compute, scaling laws, MoE | 3 `model-scaling` | T | 20 tokens/parameter; active count. |
| Post-training | 4 `post-training` | T | SFT, RLHF, DPO, data shapes. |
| Sampling | 5 `sampling-and-hallucination` | P | Top-k absent. |
| Structured outputs | 12 `structured-outputs` | T | Schema, constrained decoding, repair. |
| Hallucination | 5 `sampling-and-hallucination` | T | Causes, detection, mitigation. |

### Chapter 3

| Concept | Lesson | Depth | Note |
| --- | --- | --- | --- |
| Open-ended evaluation | 6 `evaluation` | T | Verifiable vs subjective. |
| LM metrics | 6 `evaluation` | T | Entropy, cross-entropy, perplexity, BPC/BPB. |
| Exact evaluation | 6; 9 `eval-criteria` | T | Exact match, unit tests, pass@k. |
| AI judge and bias | 8 `llm-as-judge` | T | Rubric, three biases, audit. |
| Comparative evaluation | 8; 10 `model-selection` | T | Pairwise, Elo, preference model. |

### Chapter 4

| Concept | Lesson | Depth | Note |
| --- | --- | --- | --- |
| Evaluation criteria | 9 `eval-criteria` | T | Six criteria, slices, safety gate. |
| Model selection workflow | 10 `model-selection` | T | Hard filter, then frontier. |
| Public benchmarks | 10 `model-selection` | T | Contamination and aggregation limits. |
| Evaluation pipeline | 7 `eval-sets` | T | Source, label, freeze, split. |

### Chapter 5

| Concept | Lesson | Depth | Note |
| --- | --- | --- | --- |
| System/user prompt; zero/few-shot | 11 `prompt-contract` | P | Zero-shot absent. |
| Context length | 13 `context-engineering` | T | Budget, middle loss, long context vs RAG. |
| Explicit instructions, decomposition, CoT | 11 `prompt-contract` | P | Decomposition absent. |
| Jailbreak, injection, hierarchy | 11 `prompt-contract` | P | Jailbreak named once. |

### Chapter 6

| Concept | Lesson | Depth | Note |
| --- | --- | --- | --- |
| RAG architecture | 14 `retrieval` | T | Index/query phases, citations. |
| Retrieval algorithms | 14 `retrieval` | P | TF-IDF not named; BM25 taught. |
| Retrieval optimisation | 14; 15 `retrieval-quality` | T | Chunk, rerank, rewrite, contextual. |
| Agents | 16 `agents` | T | Loop, schema, planning, stop rules. |
| Agent failure modes | 16 `agents` | T | All four classes. |

### Chapter 7

| Concept | Lesson | Depth | Note |
| --- | --- | --- | --- |
| When to finetune | 17 `fine-tuning` | T | Ladder, form vs fact, payback. |
| PEFT and LoRA | 18 `lora-memory` | T | Rank, parameter count, QLoRA. |

### Chapter 8

| Concept | Lesson | Depth | Note |
| --- | --- | --- | --- |
| Data curation and formats | 19 `dataset-curation` | T | Four formats; CoT and tool data. |
| Data quality | 19 `dataset-curation` | T | Relevance, consistency, compliance. |
| Coverage and quantity | 19 `dataset-curation` | T | Slices, thin slices, small sets. |
| Data synthesis | 20 `synthetic-data` | P | Three classic routes absent. |
| Distillation | 20 `synthetic-data` | T | Teacher/student, verifier, collapse. |

### Chapter 9

| Concept | Lesson | Depth | Note |
| --- | --- | --- | --- |
| Inference metrics | 21 `cost` | T | TTFT, TPOT, percentiles, goodput. |
| Model optimisation | 22 `inference-optimization` | T | Quantization, pruning, speculative decoding. |
| Service optimisation | 22; 21 | P | Parallelism absent. |

### Chapter 10

| Concept | Lesson | Depth | Note |
| --- | --- | --- | --- |
| Architecture steps | 23 `ai-architecture`; 13 | T | Gateway order, guard, route, cache. |
| Guardrails | 23 `ai-architecture` | T | Input/output, PII, fallback. |
| Router and gateway | 23 `ai-architecture` | T | Intent/cost routing, unified interface. |
| Caches | 23; 13 | P | Eviction absent. |
| Monitoring | 24 `observability-feedback` | T | Logs, metrics, traces, MTTD/MTTR/CFR. |
| User feedback | 24 `observability-feedback` | T | Explicit/implicit, bias, privacy. |

## 3. Missing or thin, ranked by interview importance

1. **Top-k sampling** (lesson 5, `how-it-works`). Temperature and top-p are taught; top-k is
   absent. Fix: two sentences and one table row.
2. **Zero-shot** (lesson 11, `what-it-is`). Few-shot is defined; zero-shot is absent. Fix: one
   sentence and one check.
3. **TF-IDF** (lesson 14, `how-it-works`). BM25 is taught; the lexical weighting idea is
   unnamed. Fix: one sentence before BM25.
4. **Decomposition** (lesson 11, `how-it-works`). CoT is taught; task decomposition is not. Fix:
   one sentence in step 1 and one failure-table row.
5. **Paraphrase, back-translation, self-play** (lesson 20, `how-it-works`). The teacher pipeline
   is one route; the three classic routes are absent. Fix: one sentence each.
6. **Cache eviction** (lesson 23, `how-it-works`). Keys and wrong hits are taught; TTL, LRU and
   stale entries are not. Fix: one sentence and one check.
7. **Parallelism** (lesson 22, `how-it-works`). Batching is taught; tensor, pipeline and data
   parallelism are not. Fix: one sentence after continuous batching.
8. **Jailbreak** (lesson 11, `how-it-works`). It appears once in a check. Fix: one sentence
   that separates it from injection.

## 4. Factual errors and misleading claims

1. **Lesson 18 `lora-memory`, `how-it-works`.** Quote: "A full fine-tune also stores gradients
   and a master weight copy, which is why its budget is about 12 bytes per base parameter."
   Correction: fp16 weight 2 + gradient 2 + fp32 master 4 + two Adam moments 8 = 16 bytes.
   A 7B model needs about 112 GB, not 84 GB. If the lesson keeps 12 bytes, it must drop the
   master copy.
2. **Lesson 18 `how-it-works`, same budget.** The step list says to add "gradients and optimizer
   state", but the arithmetic uses 10 bytes (weight 2 + moments 8) and omits the adapter
   gradient. Correction: 12 bytes per trainable parameter. A rank 16 adapter is about 201 MB,
   not 168 MB. Check-3 repeats the 10-byte value.
3. **Lesson 18 `how-it-works`.** Quote: "A rank of 64 or more approaches full fine-tuning
   cost." Correction: rank 64 on these matrices is about 67M parameters, near 1 percent of a
   7B base. It is far below full fine-tuning.
4. **Lesson 21 `cost`, `what-it-is`.** Quote: "Decode takes 5.6 ms per output token, so the
   answer ends at 2,400 ms." TPOT is the gap after the first token. 250 tokens have 249 gaps:
   1,000 + 249 × 5.6 = 2,394 ms. Check-4 uses 99 gaps for 100 tokens. Change the value or mark
   it as rounded.
5. **Lesson 14 `retrieval`, `the-triage-case`.** Quote: "The refund document says refunds, not
   refund, so it scores zero in that pass." BM25 match depends on the analyzer. Common stemmers
   map both words to one term. Add "with a non-stemming analyzer" or use a true synonym.
6. **Cross-lesson inconsistency: cost as hard or soft.** Lesson 9 `what-it-is` puts cost under
   soft attributes. Lesson 10 `what-it-is` lists cost as a hard attribute. The glossary also
   puts cost under soft. Correction: cost is soft until a budget is fixed, then it is hard.
   State that rule in all three places.

## 5. FYI check

No history, vendor catalogue, accelerator survey, model merging, organisation advice or trend
prediction appears. Lesson 18 mentions CUDA context and GPU memory as a memory-budget fact.
Lesson 21 mentions GPU cost as a serving fact. These are budget facts, not a survey. The FYI
exclusion holds.

## 6. Balance, ELI5, diagrams and interview corners

No lesson is thin. Lessons 19 and 23 are at capacity, with three or four Core rows each. Both
keep one mechanism and one failure table. The eight flagships carry the deeper mechanism and
one interactive diagram.

The ELI5 sections support the concept. Every lesson has two analogies, each with a "Where it
breaks" line and a prediction. Parts 2 and 4 still teach. The diagrams show a
mechanism or a quantity: bars carry values, matrices carry filled cells, and flows carry real
edges. All 24 interview corners have four questions: definition, trade-off, failure and scale.
Each matches its lesson.

## 7. Verdict

**GAPS (minor).** Every Core row has an owning lesson and a mechanism. No Core row is missing.
Eight rows are partial on one named sub-item, and six named sub-items are absent. The course is
close to covered, but a strict interview check would fail on top-k, zero-shot and TF-IDF.

Five improvements:

1. Fix lesson 18 memory arithmetic and check-3: 12 bytes for the adapter, 16 for full
   fine-tuning; drop the rank-64 claim.
2. Add top-k to lesson 5 and zero-shot to lesson 11; both are basic terms.
3. Add TF-IDF to lesson 14 and decomposition to lesson 11, one sentence each.
4. Add the three synthesis routes to lesson 20 and cache eviction to lesson 23; one sentence
   each.
5. Resolve the cost conflict in lessons 9, 10 and the glossary; add parallelism and jailbreak
   lines.
