# Coverage — book inventory to lessons

This file answers one question: are all interview-relevant concepts covered?

## 1. Method

Coverage means one thing. Each **Core** concept in `BOOK-INVENTORY.md` has one owning
lesson among the 24 lessons. The owning lesson teaches the mechanism in part 2 ("What it is")
and part 4 ("How it works"). A **Useful** concept maps to a lesson where it helps. An **FYI**
concept stays out of the course by design.

The labels in the matrix have these meanings:

- **Primary** — the lesson owns the concept. The concept is in the lesson's core set in
  `COURSE-BRIEF.md` section 2.
- **Applied** — the lesson uses the concept in the triage case, a check or a task. Another
  lesson owns it.
- **Mentioned** — the lesson names the concept in one paragraph or one line. The lesson gives
  it no dedicated teaching.
- **(fit)** — this audit recommends the mapping. The plan does not list the concept in that
  lesson's core set. Fit mappings appear on Useful rows only.

The matrix covers 61 inventory rows. Chapters 1 to 10 all appear.

## 2. Coverage by chapter

### Chapter 1 — Introduction to building AI applications

| Book section | Concept | Class | Lesson | How covered |
| --- | --- | --- | --- | --- |
| The AI engineering stack | application, model, infrastructure layers | Core | 1 `ai-stack` | Primary (plan) |
| AI engineering vs ML engineering | product-first vs data-first | Useful | 1 `ai-stack` | Primary (plan) |
| Use case evaluation | risk, value, milestones | Useful | 1 `ai-stack` | Mentioned (fit) |
| Foundation model use cases | coding, image, writing, bots | FYI | — | Excluded |
| Maintenance | model and prompt upkeep after launch | Useful | 24 `observability-feedback` | Mentioned (fit) |

### Chapter 2 — Understanding foundation models

| Book section | Concept | Class | Lesson | How covered |
| --- | --- | --- | --- | --- |
| Training data | capability is bounded by pretraining data | Core | 3 `model-scaling` | Primary (plan) |
| Domain-specific models | why a model fails a language or domain | Useful | 2 `foundation-models` | Mentioned (fit) |
| Model architecture | transformer, attention, tokens | Core | 2 `foundation-models` | Primary (plan) |
| Model size | parameters, compute, scaling laws, sparse/MoE | Core | 3 `model-scaling` | Primary (MoE fold) |
| Post-training | SFT teaches format; preference tuning aligns behavior | Core | 4 `post-training` | Primary (plan) |
| Sampling | temperature, top-p/top-k, seeds, non-determinism | Core | 5 `sampling-and-hallucination` | Primary (plan) |
| Test-time compute | self-consistency, best-of-N | Useful | 5 `sampling-and-hallucination` | Mentioned (fit) |
| Structured outputs | JSON mode, constrained sampling, finetuning | Core | 12 `structured-outputs` | Primary (plan) |
| Probabilistic nature | hallucination causes and inconsistency | Core | 5 `sampling-and-hallucination` | Primary (plan) |

### Chapter 3 — Evaluation methodology

| Book section | Concept | Class | Lesson | How covered |
| --- | --- | --- | --- | --- |
| Challenges of evaluation | open-ended outputs, no single reference | Core | 6 `evaluation` | Primary (plan) |
| Language-model metrics | entropy, cross-entropy, BPC/BPB, perplexity | Core | 6 `evaluation` | Primary (entropy/BPC fold) |
| Exact evaluation | functional correctness, pass@k, unit tests | Core | 6 `evaluation`; 9 applied | Primary + applied (plan) |
| Similarity and embeddings | cosine similarity, embedding quality limits | Useful | 6 `evaluation`; 14 mentioned | Applied (plan) |
| AI as a judge | judge design; self, position and verbosity bias | Core | 8 `llm-as-judge` | Primary (plan) |
| Comparative evaluation | pairwise, Elo, preference models | Core | 8 `llm-as-judge`; 10 applied | Primary + applied (plan) |

### Chapter 4 — Evaluate AI systems

| Book section | Concept | Class | Lesson | How covered |
| --- | --- | --- | --- | --- |
| Evaluation criteria | domain, generation, instruction following, cost/latency | Core | 9 `eval-criteria` | Primary (plan) |
| Model selection workflow | hard vs soft attributes; four-step loop | Core | 10 `model-selection` | Primary (plan) |
| Build vs buy | API vs self-host; open weights and licences | Useful | 1 `ai-stack`; 10 mentioned | Primary (plan) |
| Public benchmarks | contamination, aggregation, leaderboard limits | Core | 10 `model-selection` | Primary (plan) |
| Evaluation pipeline | components, guidelines, methods and data | Core | 7 `eval-sets`; 9 applied | Primary (plan) |

### Chapter 5 — Prompt engineering

| Book section | Concept | Class | Lesson | How covered |
| --- | --- | --- | --- | --- |
| Prompting basics | system vs user prompt; zero-shot and few-shot | Core | 11 `prompt-contract` | Primary (plan) |
| Context length | long-context degradation, context efficiency | Core | 13 `context-engineering` | Primary (plan) |
| Best practices | explicit instructions, decomposition, chain of thought | Core | 11 `prompt-contract` | Primary (plan) |
| Prompt tools and versioning | hidden API calls; version control | Useful | 11 `prompt-contract` | Mentioned (fit) |
| Defensive prompting | jailbreak, direct and indirect injection, hierarchy | Core | 11 `prompt-contract`; 23 applied | Primary + applied (plan) |
| Information extraction | PII, copyright, divergence attacks | Useful | 23 `ai-architecture` | Applied (fit) |

### Chapter 6 — RAG and agents

| Book section | Concept | Class | Lesson | How covered |
| --- | --- | --- | --- | --- |
| RAG architecture | index time vs query time; retriever + generator | Core | 14 `retrieval` | Primary (plan) |
| Retrieval algorithms | TF-IDF/BM25, embeddings, ANN, hybrid, RRF | Core | 14 `retrieval` | Primary (plan) |
| Retrieval optimisation | chunking, reranking, query rewriting, contextual retrieval | Core | 14 (chunk, rerank); 15 (rewrite, contextual) | Primary split (plan) |
| RAG beyond text | multimodal and table/SQL retrieval | Useful | 14 `retrieval` | Mentioned (fit) |
| Agents | loop, tools, function calling, planning, control flow | Core | 16 `agents`; 12 applied | Primary (plan) |
| Agent failure modes | invalid tool, goal failure, reflection error, efficiency | Core | 16 `agents` | Primary (plan) |
| Memory | internal, short-term and long-term memory | Useful | 16 `agents` | Applied (plan) |

### Chapter 7 — Finetuning

| Book section | Concept | Class | Lesson | How covered |
| --- | --- | --- | --- | --- |
| When to finetune | reasons, reasons not to, RAG vs finetune | Core | 17 `fine-tuning` | Primary (plan) |
| Memory bottlenecks | backpropagation, trainable parameters, memory maths | Useful | 18 `lora-memory` | Primary (plan) |
| Quantisation | numerical representations, precision | Useful | 22 `inference-optimization`; 18 applied | Primary (plan) |
| Parameter-efficient finetuning | adapters, LoRA, trainable parameter budget | Core | 18 `lora-memory` | Primary (plan) |
| Model merging | multi-task finetuning | FYI | — | Excluded |
| Finetuning tactics | prompt loss weight, hyperparameters | Useful | 17 `fine-tuning` | Mentioned (fit) |

### Chapter 8 — Dataset engineering

| Book section | Concept | Class | Lesson | How covered |
| --- | --- | --- | --- | --- |
| Data curation | format per training phase; chain-of-thought and tool-use data | Core | 19 `dataset-curation` | Primary (format fold) |
| Data quality | relevant, aligned, consistent, formatted, unique, compliant | Core | 19 `dataset-curation` | Primary (plan) |
| Data coverage and quantity | diversity; small high-quality sets | Core | 19 `dataset-curation` | Primary (plan) |
| Acquisition and annotation | guidelines, consistency, human vs synthetic | Useful | 19 `dataset-curation`; 20 mentioned | Primary (plan) |
| Data synthesis | paraphrase, back-translation, self-play | Core | 20 `synthetic-data` | Primary (plan) |
| Model distillation | teacher-student data | Core | 20 `synthetic-data` | Primary (plan) |
| Data processing | inspect, deduplicate, clean, filter, format | Useful | 19 `dataset-curation` | Primary (plan) |

### Chapter 9 — Inference optimisation

| Book section | Concept | Class | Lesson | How covered |
| --- | --- | --- | --- | --- |
| Inference metrics | TTFT, TPOT, p50/p95/p99, throughput, goodput | Core | 21 `cost` | Primary (plan) |
| Accelerators | GPU, TPU, memory bandwidth | FYI | — | Excluded |
| Model optimisation | quantisation, pruning, speculative decoding, distillation | Core | 22 `inference-optimization`; 20 applied | Primary (pruning fold) |
| Service optimisation | batching, prefill/decode, prefix caching, parallelism | Core | 22 `inference-optimization`; 21 applied | Primary (plan) |

### Chapter 10 — Architecture and user feedback

| Book section | Concept | Class | Lesson | How covered |
| --- | --- | --- | --- | --- |
| Architecture steps | context, guardrails, router/gateway, caches, agent patterns | Core | 23 `ai-architecture`; 13 context applied | Primary (plan) |
| Guardrails | input/output checks, PII masking, retry, human fallback | Core | 23 `ai-architecture` | Primary (plan) |
| Router and gateway | intent routing, cost routing, unified interface, fallback | Core | 23 `ai-architecture` | Primary (plan) |
| Caches | exact vs semantic caching, eviction, data-leak risk | Core | 23 `ai-architecture`; 13 prefix cache applied | Primary (plan) |
| Monitoring | metrics, logs, traces, MTTD/MTTR/CFR | Core | 24 `observability-feedback` | Primary (plan) |
| User feedback | explicit vs implicit signals, bias, degenerate loops | Core | 24 `observability-feedback` | Primary (plan) |

## 3. Gaps and decisions

A **partial** row has an owning lesson, but the plan's core list omits one named sub-item.
**Uncovered** means no lesson owns the row. The audit found no uncovered Core row.

| Ch | Core row | Status | Reason | Decision and smallest fix |
| --- | --- | --- | --- | --- |
| 2 | Model size — sparse/MoE | Partial | The core set of lesson 3 names parameters and scaling laws, not MoE | Fold two sentences into lesson 3 part 4. Accepted. No new lesson. |
| 3 | Language-model metrics — entropy, BPC/BPB | Partial | The core set of lesson 6 names perplexity only | Fold one definition and one formula line into lesson 6. Accepted. No new lesson. |
| 8 | Data curation — format per phase; CoT and tool-use data | Partial | The core set of lesson 19 names quality, coverage and splits, not data shape | Fold one paragraph into lesson 19 part 4. Accepted. No new lesson. |
| 9 | Model optimisation — pruning | Partial | The core set of lesson 22 names quantization, speculative decoding, KV cache and batching | Fold one sentence and one trade-off row into lesson 22. Accepted. No new lesson. |
| — | All other 38 Core rows | Full | The plan assigns each row to an owning lesson | No action. |
| — | Uncovered Core rows | None | Every Core row has an owner | No lesson addition needed. |

Recommended fix: no new lesson. Make four small folds: MoE into lesson 3, entropy/BPC into
lesson 6, data format and CoT data into lesson 19, pruning into lesson 22. Each fold is one
paragraph or less.

## 4. FYI excluded

| Ch | Item | Reason for exclusion |
| --- | --- | --- |
| 1 | Foundation model use cases (coding, image, writing, bots) | A vendor-level use-case survey. It has no mechanism, metric or trade-off for an interview. |
| 7 | Model merging and multi-task tactics | A tactic catalogue. The course teaches LoRA and memory maths instead. |
| 9 | Accelerator hardware survey (GPU, TPU, bandwidth) | A hardware catalogue. Lessons 18 and 21 keep only the VRAM and latency facts that a design decision needs. |

`COURSE-BRIEF.md` section 8 also excludes four standing categories. These are not inventory
rows: history of language models, vendor and tool catalogues, organisation and team advice,
and predicted industry trends. They add pages and no interview value.

## 5. Per-lesson coverage

"Owns" means the lesson is the primary home for the concept. "Applies" means the lesson uses
the concept but another lesson owns it.

| # | Slug | Owns (Core) | Applies only |
| --- | --- | --- | --- |
| 1 | `ai-stack` | stack layers | use case evaluation (fit) |
| 2 | `foundation-models` | model architecture | training-data bound, domain gaps |
| 3 | `model-scaling` | training data, model size | MoE/sparse (fold) |
| 4 | `post-training` | post-training | data shape, eval |
| 5 | `sampling-and-hallucination` | sampling, probabilistic nature | test-time compute (fit), structured decoding |
| 6 | `evaluation` | evaluation challenges, LM metrics, exact evaluation | similarity, judge, pass@k |
| 7 | `eval-sets` | evaluation pipeline | contamination, data splits |
| 8 | `llm-as-judge` | AI judge, comparative evaluation | rubric, Elo |
| 9 | `eval-criteria` | evaluation criteria | rubric, pass@k |
| 10 | `model-selection` | model selection, public benchmarks | pairwise Elo, build vs buy |
| 11 | `prompt-contract` | prompting basics, best practices, defensive prompting | guardrails, output contract |
| 12 | `structured-outputs` | structured outputs | function calling, injection |
| 13 | `context-engineering` | context length | retrieval, prefix caching |
| 14 | `retrieval` | RAG architecture, retrieval algorithms, chunk/rerank | recall@k, query rewriting |
| 15 | `retrieval-quality` | query rewriting, contextual retrieval | eval sets, reranking |
| 16 | `agents` | agents, agent failure modes | function schema, guardrails |
| 17 | `fine-tuning` | when to finetune | RAG, data quality |
| 18 | `lora-memory` | parameter-efficient finetuning | quantization, optimizer state |
| 19 | `dataset-curation` | data curation, quality, coverage and quantity | contamination, splits, synthesis |
| 20 | `synthetic-data` | data synthesis, distillation | data quality |
| 21 | `cost` | inference metrics | batching, prefill/decode |
| 22 | `inference-optimization` | model optimisation, service optimisation | distillation, latency metrics |
| 23 | `ai-architecture` | architecture steps, guardrails, router, caches | injection, retrieval, agents |
| 24 | `observability-feedback` | monitoring, user feedback | maintenance (fit), judge, eval |

## 6. Counts

| Class | Inventory rows | With a lesson | Uncovered or excluded |
| --- | --- | --- | --- |
| Core | 42 | 42 | 0 |
| Useful | 16 | 16 | 0 |
| FYI | 3 | 0 | 3 excluded |
| **Total** | **61** | **58** | **3** |

Core detail: 38 rows are fully named in the plan. Four rows are partial and need the small
folds in section 3. Zero Core rows are uncovered.

Useful detail: 8 rows are plan-assigned. The other 8 rows use a fit mapping to a lesson. A
fit mapping is a mention only. The course does not promise dedicated teaching for these 8.

FYI detail: the 3 inventory rows are excluded by design. The authoring contract also
excludes 4 standing categories that are not inventory rows.

**Bottom line:** all 42 Core concepts have an owning lesson. No lesson addition is necessary.
Apply the four folds to close the partial rows.
