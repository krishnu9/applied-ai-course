# Book concept inventory — interview relevance

Source: *AI Engineering* by Chip Huyen (O'Reilly, 2024), table of contents and chapter
summaries. Used for topic mapping only. No book text or figure is reproduced.

Classes: **Core** = an interview tests the definition, trade-off, failure mode, metric or
architecture choice. **Useful** = context that helps. **FYI** = history, vendor survey, tool
list or organisation advice; excluded from the course.

## Chapter 1 — Introduction to building AI applications

| Section | Concept | Class |
| --- | --- | --- |
| The AI engineering stack | application, model, infrastructure layers | Core |
| AI engineering vs ML engineering | product-first vs data-first workflow | Useful |
| Use case evaluation | risk, opportunity, milestone planning | Useful |
| Foundation model use cases | coding, image, writing, bots | FYI |
| Maintenance | model and prompt upkeep after launch | Useful |

## Chapter 2 — Understanding foundation models

| Section | Concept | Class |
| --- | --- | --- |
| Training data | capability is bounded by pretraining data | Core |
| Domain-specific models | why a model fails a language or domain | Useful |
| Model architecture | transformer, attention, tokens | Core |
| Model size | parameters, compute, scaling laws, sparse/MoE | Core |
| Post-training | SFT teaches format; preference tuning aligns behaviour | Core |
| Sampling | temperature, top-p/top-k, seeds, non-determinism | Core |
| Test-time compute | self-consistency, best-of-N | Useful |
| Structured outputs | JSON mode, constrained sampling, finetuning | Core |
| Probabilistic nature of AI | hallucination causes and inconsistency | Core |

## Chapter 3 — Evaluation methodology

| Section | Concept | Class |
| --- | --- | --- |
| Challenges of evaluation | open-ended outputs, no single reference | Core |
| Language-model metrics | entropy, cross-entropy, BPC/BPB, perplexity | Core |
| Exact evaluation | functional correctness, pass@k, unit tests | Core |
| Similarity and embeddings | cosine similarity, embedding quality limits | Useful |
| AI as a judge | judge design; self, position and verbosity bias | Core |
| Comparative evaluation | pairwise, Elo, preference models | Core |

## Chapter 4 — Evaluate AI systems

| Section | Concept | Class |
| --- | --- | --- |
| Evaluation criteria | domain, generation, instruction following, cost/latency | Core |
| Model selection workflow | hard vs soft attributes; four-step loop | Core |
| Build vs buy | API vs self-host; open weights and licences | Useful |
| Public benchmarks | contamination, aggregation, leaderboard limits | Core |
| Evaluation pipeline | evaluate components, guidelines, methods and data | Core |

## Chapter 5 — Prompt engineering

| Section | Concept | Class |
| --- | --- | --- |
| Prompting basics | system vs user prompt; zero-shot and few-shot | Core |
| Context length | long-context degradation, context efficiency | Core |
| Best practices | explicit instructions, decomposition, chain of thought | Core |
| Prompt tools and versioning | hidden API calls; version control | Useful |
| Defensive prompting | jailbreak, direct and indirect injection, instruction hierarchy | Core |
| Information extraction | PII, copyright, divergence attacks | Useful |

## Chapter 6 — RAG and agents

| Section | Concept | Class |
| --- | --- | --- |
| RAG architecture | index time vs query time; retriever + generator | Core |
| Retrieval algorithms | TF-IDF/BM25, embeddings, ANN, hybrid, RRF | Core |
| Retrieval optimisation | chunking, reranking, query rewriting, contextual retrieval | Core |
| RAG beyond text | multimodal and table/SQL retrieval | Useful |
| Agents | loop, tools, function calling, planning, control flow | Core |
| Agent failure modes | invalid tool or parameters, goal failure, reflection error, efficiency | Core |
| Memory | internal, short-term and long-term memory | Useful |

## Chapter 7 — Finetuning

| Section | Concept | Class |
| --- | --- | --- |
| When to finetune | reasons, reasons not to, RAG vs finetune | Core |
| Memory bottlenecks | backpropagation, trainable parameters, memory maths | Useful |
| Quantisation | numerical representations, precision | Useful |
| Parameter-efficient finetuning | adapters, LoRA, trainable parameter budget | Core |
| Model merging | multi-task finetuning | FYI |
| Finetuning tactics | prompt loss weight, hyperparameters | Useful |

## Chapter 8 — Dataset engineering

| Section | Concept | Class |
| --- | --- | --- |
| Data curation | format per training phase; chain-of-thought and tool-use data | Core |
| Data quality | relevant, aligned, consistent, formatted, unique, compliant | Core |
| Data coverage and quantity | diversity; small high-quality sets | Core |
| Acquisition and annotation | guidelines, consistency, human vs synthetic | Useful |
| Data synthesis | paraphrase, back-translation, self-play | Core |
| Model distillation | teacher-student data | Core |
| Data processing | inspect, deduplicate, clean, filter, format | Useful |

## Chapter 9 — Inference optimisation

| Section | Concept | Class |
| --- | --- | --- |
| Inference metrics | TTFT, TPOT, p50/p95/p99, throughput, goodput | Core |
| Accelerators | GPU, TPU, memory bandwidth | FYI |
| Model optimisation | quantisation, pruning, speculative decoding, distillation | Core |
| Service optimisation | batching, prefill/decode disaggregation, prefix caching, parallelism | Core |

## Chapter 10 — Architecture and user feedback

| Section | Concept | Class |
| --- | --- | --- |
| Architecture steps | context, guardrails, router/gateway, caches, agent patterns | Core |
| Guardrails | input/output checks, PII masking, retry, human fallback | Core |
| Router and gateway | intent routing, cost routing, unified interface, fallback | Core |
| Caches | exact vs semantic caching, eviction, data-leak risk | Core |
| Monitoring | metrics, logs, traces, MTTD/MTTR/CFR | Core |
| User feedback | explicit vs implicit signals, bias, degenerate loops | Core |

## Highest-value missing concepts (ranked)

1. AI as a judge and its biases; violation and false-refusal rates.
2. Comparative evaluation: pairwise, Elo, preference models.
3. Evaluation-driven development and the four criteria buckets.
4. Model selection: hard vs soft attributes; benchmarks then private pipeline.
5. Benchmark contamination and aggregation limits.
6. Agent planning: decomposition, reflection, control flow.
7. Agent failure taxonomy.
8. Function calling and tool schema design.
9. Indirect prompt injection; instruction hierarchy; guardrails.
10. Prompt caching economics.
11. TTFT vs TPOT; percentiles; goodput.
12. Retrieval metrics: precision/recall, NDCG, MRR.
13. Query rewriting and contextual retrieval.
14. Hybrid retrieval: BM25, inverted index, ANN, RRF.
15. SFT vs preference finetuning; PEFT/LoRA; memory maths.
16. Dataset quality, coverage, quantity; synthesis and distillation.
17. Hallucination causes and context-based mitigation.
18. Router/gateway, exact vs semantic caching, monitoring with traces.

## FYI exclusion list

History of language models; vendor and tool catalogues; accelerator hardware surveys; model
merging and multi-task tactics; organisation and team advice; predicted industry trends.
