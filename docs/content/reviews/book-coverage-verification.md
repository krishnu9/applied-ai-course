# Book coverage verification

Independent audit of the 24 lessons against *AI Engineering* (Chip Huyen, O'Reilly 2024, 535 PDF pages).

## 1. Method

I built the concept list from the book, then cross-checked the two docs. I read:

- Table of contents, PDF 7-11.
- All ten chapter summaries, PDF 71-72, 135-136, 180-181, 232-233, 275-276, 329-330, 385-386, 427-428, 471-472, 516-517.
- Key sections, PDF 32-42 (multimodal and foundation models), 91-97 (model size and scaling), 116-134 (sampling, test-time compute, structured outputs, hallucination), 145-148 (perplexity), 151-163 (pass@k, similarity, embeddings, AI judge), 184-190 (evaluation criteria, factual consistency), 301-310 (agent tools and planning), 323-330 (agent evaluation, memory), 349-356 (numerical formats, quantization), 368-372 (LoRA serving, model merging), 436-443 (TTFT, throughput, utilization), 475-483 (guardrails, router, gateway).

Printed page N is PDF page N+24. I read all 24 lessons, including every section, check and task.

Rating rule:

- **Taught**: definition, mechanism, and a use or failure mode.
- **Thin**: named but not explained, or one sentence.
- **Missing**: no treatment.

**Cross-check finding.** The prior `coverage-audit.md` is stale. Its eight partials now have direct teaching: top-k (L5), zero-shot (L11), TF-IDF (L14), decomposition (L11), synthesis routes (L20), cache eviction (L23), parallelism (L22), jailbreak (L11). Its three lesson-18 arithmetic errors do not reproduce. Current text gives 16 bytes per base parameter and about 201 MB for a rank-16 adapter. Do not use it as current evidence.

## 2. Coverage by chapter

L = lesson number; evidence is a section id.

### Chapter 1

| Concept | Lesson | Rating | Evidence |
| --- | --- | --- | --- |
| Stack layers (application, model, infrastructure) | L1 `ai-stack` | Taught | `what-it-is`; `how-it-works` |
| AI engineering vs ML and full-stack | L1 | Taught | `what-it-is` |
| Build vs buy | L1; L10 `model-selection` | Taught | `ai-stack#how-it-works` |
| Use-case evaluation, expectations, milestones | L1 | Missing | none |

### Chapter 2

| Concept | Lesson | Rating | Evidence |
| --- | --- | --- | --- |
| Tokenization and tokens | L2 `foundation-models` | Taught | `how-it-works` |
| Embeddings | L2; L14 `retrieval` | Taught | `foundation-models#what-it-is` |
| Attention and transformer | L2 | Taught | `how-it-works` |
| Context window | L2; L13 `context-engineering` | Taught | `foundation-models#how-it-works` |
| Scaling laws and compute-optimal training | L3 `model-scaling` | Taught | `how-it-works` |
| Sparse models and mixture of experts | L3 | Taught | `how-it-works` |
| SFT vs preference tuning (RLHF, DPO) | L4 `post-training`; L17 | Taught | `post-training#how-it-works` |
| Sampling (temperature, top-p, top-k, seed) | L5 `sampling-and-hallucination` | Taught | `how-it-works` |
| Test-time compute (best-of-N, self-consistency, verifier) | L5; L17 | Thin | `sampling#interview-corner` |
| Structured outputs | L12 `structured-outputs` | Taught | `how-it-works` |

### Chapter 3

| Concept | Lesson | Rating | Evidence |
| --- | --- | --- | --- |
| Evaluation challenges | L6 `evaluation` | Taught | `what-it-is` |
| Entropy, cross-entropy, perplexity, BPC/BPB | L6 | Taught | `how-it-works` |
| Exact match, F1, pass@k | L6; L9 `eval-criteria` | Taught | `how-it-works` |
| Lexical and embedding similarity | L6; L15 `retrieval-quality` | Thin | `evaluation#how-it-works` |
| AI as judge and its biases | L8 `llm-as-judge` | Taught | `how-it-works` |
| Comparative evaluation, Elo, preference models | L8; L10 | Taught | `run-the-arena` |

### Chapter 4

| Concept | Lesson | Rating | Evidence |
| --- | --- | --- | --- |
| Criteria buckets | L9 `eval-criteria` | Taught | `what-it-is` |
| Slices, confidence intervals, hard/soft gates | L9 | Taught | `how-it-works` |
| Model selection workflow | L10 `model-selection` | Taught | `how-it-works` |
| Build vs buy axes (privacy, lineage, control) | L1; L10 | Thin | `model-selection#how-it-works` |
| Public benchmarks, contamination, leaderboards | L10 | Taught | `how-it-works` |
| Named benchmark landscape and aggregation | L10 | Thin | `how-it-works` |
| Safety and factual-consistency evaluation | L5; L9 | Thin | `eval-criteria#what-it-is` |

### Chapter 5

| Concept | Lesson | Rating | Evidence |
| --- | --- | --- | --- |
| Prompt anatomy, system/user, zero/few-shot | L11 `prompt-contract` | Taught | `how-it-works` |
| Best practices, chain of thought, decomposition | L11 | Taught | `how-it-works` |
| Context length and efficiency | L13 `context-engineering` | Taught | `how-it-works` |
| Prompt injection, jailbreak, defense | L11 | Taught | `how-it-works` |
| Prompt versioning and tooling | L11 | Taught | `how-it-works` |

### Chapter 6

| Concept | Lesson | Rating | Evidence |
| --- | --- | --- | --- |
| RAG architecture (index vs query) | L14 `retrieval` | Taught | `what-it-is` |
| Retrieval algorithms (BM25, dense, ANN) | L14 | Taught | `how-it-works` |
| Hybrid retrieval, RRF, reranking | L14 | Taught | `how-it-works` |
| Retrieval optimization (chunk, rewrite, contextual) | L14; L15 | Taught | `retrieval-quality#how-it-works` |
| Retrieval evaluation (recall@k, MRR, nDCG) | L15 | Taught | `how-it-works` |
| RAG beyond text (multimodal, tables, SQL) | L14 | Missing | none |
| Agent loop, tools, function calling, tool schemas | L16 `agents` | Taught | `how-it-works` |
| Planning, reflection, plan validation, multi-agent | L16 | Thin | `how-it-works` |
| Agent failure modes and evaluation | L16 | Taught | `how-it-works` |
| Memory types and memory management | L16 | Thin | `how-it-works` |

### Chapter 7

| Concept | Lesson | Rating | Evidence |
| --- | --- | --- | --- |
| When to finetune vs RAG | L17 `fine-tuning` | Taught | `what-it-is` |
| Full-finetune memory math | L18 `lora-memory` | Taught | `how-it-works` |
| LoRA | L18 | Taught | `how-it-works` |
| QLoRA | L18 | Taught | `how-it-works` |
| Quantization concept and quality trade-off | L18; L22 | Taught | `inference-optimization#how-it-works` |
| Model merging and multi-task finetuning | none | Missing | none |
| Numerical formats and quantization methods (BF16, FP8, PTQ, QAT) | L18; L22 | Thin | `inference-optimization#how-it-works` |
| Finetuning tactics and prompt loss weight | L17 | Thin | `fine-tuning#how-it-works` |

### Chapter 8

| Concept | Lesson | Rating | Evidence |
| --- | --- | --- | --- |
| Data quality | L19 `dataset-curation` | Taught | `what-it-is` |
| Coverage, quantity, diversity | L19 | Taught | `how-it-works` |
| Deduplication and contamination | L19 | Taught | `how-it-works` |
| Annotation, guidelines, agreement | L19 | Taught | `how-it-works` |
| Dataset splits and held-out data | L19; L7 `eval-sets` | Taught | `dataset-curation#how-it-works` |
| Synthetic data | L20 `synthetic-data` | Taught | `how-it-works` |
| Distillation | L20 | Taught | `how-it-works` |
| Model collapse | L20 | Taught | `how-it-works` |

### Chapter 9

| Concept | Lesson | Rating | Evidence |
| --- | --- | --- | --- |
| TTFT and TPOT | L21 `cost` | Taught | `how-it-works` |
| Throughput, goodput, percentiles, queue | L21 | Taught | `how-it-works` |
| Utilization, MFU, MBU | L21 | Missing | none |
| Batching (static, continuous) | L21; L22 | Taught | `inference-optimization#how-it-works` |
| KV cache and paging | L22 `inference-optimization` | Taught | `how-it-works` |
| Prefix and prompt caching | L22; L13 | Taught | `how-it-works` |
| Speculative decoding | L22 | Taught | `how-it-works` |
| Pruning and quantization for serving | L22 | Taught | `how-it-works` |
| Parallelism (tensor, pipeline, replica) | L22 | Taught | `how-it-works` |
| Attention kernels and flash attention | none | Missing | none |
| Prefill/decode decoupling | none | Missing | none |

### Chapter 10

| Concept | Lesson | Rating | Evidence |
| --- | --- | --- | --- |
| Guardrails (input/output, PII, policy, false refusal) | L23 `ai-architecture` | Taught | `how-it-works` |
| Router and gateway | L23 | Taught | `how-it-works` |
| Exact and semantic caches | L23 | Taught | `how-it-works` |
| Fallbacks, circuit breaker, human review | L23 | Taught | `how-it-works` |
| Monitoring (logs, metrics, traces, MTTD/MTTR/CFR) | L24 `observability-feedback` | Taught | `how-it-works` |
| Quality monitoring, per-slice eval, canary | L24 | Taught | `how-it-works` |
| Feedback signals, bias, degenerate loops | L24 | Taught | `how-it-works` |
| Feedback design and conversational feedback extraction | L24 | Missing | none |
| Sycophancy | L24 | Missing | none |
| AI pipeline orchestration | none | Missing | none |

## 3. Ranked gaps and smallest fixes

1. **Test-time compute** (L5, `how-it-works`). It names best-of-N in one check. Add 150 words on best-of-N, self-consistency, beam search, verifier selection, logprob selection and the cost multiplier, plus one check.
2. **Agent planning and reflection** (L16, `how-it-works`). One paragraph covers planning. Add 150 words on plan generation, validation, reflection, tool selection and multi-agent decomposition, plus one failure row.
3. **Memory management** (L16, `how-it-works`). One paragraph covers memory. Add 100 words on internal, short-term and long-term memory, add/delete, FIFO vs summary vs reflection, and overflow. Link to L13.
4. **Multimodal models and multimodal RAG** (L2 `what-it-is`; L14 `how-it-works`). Add an 80-word definition of a multimodal model in L2, with one check. Add a 100-word "RAG beyond text" paragraph in L14 on images, tables and SQL.
5. **Feedback limitations and design** (L24, `how-it-works`). Add 150 words on sycophancy, feedback sparsity, when to ask, and conversational extraction, plus one check.
6. **Utilization metrics** (L21, `how-it-works`). Add 80 words on utilization, MFU and MBU, with the distinction from nvidia-smi. Add one check.
7. **Model merging** (L18, `where-it-fails`). Add 80 words on merging vs sequential finetuning, catastrophic forgetting, and on-device use.
8. **Numerical formats and quantization methods** (L22, `how-it-works`). Add 100 words or a table on FP16, BF16, FP8, INT8 and INT4, plus PTQ vs QAT and NF4.
9. **Named benchmark landscape** (L10, `how-it-works`). Add 80 words naming MMLU, HumanEval, GSM8K, HELM, LMSYS Arena and MTEB, plus the aggregation caveat.
10. **Safety evaluation** (L9, `how-it-works`). Add 80 words on safety slices, red-team sets, toxicity and bias checks, and false refusal.

Lower value: use-case evaluation (L1), build-vs-buy axes (L10), orchestration (L23), attention kernels and prefill/decode (L22), lexical similarity (L6).

## 4. Factual notes

No material factual error appears in the current lessons. Three precision notes:

1. **L6 `evaluation`, `how-it-works`**: "Perplexity is the exponent of cross-entropy." The rule needs the unit. The book gives `2^H` for bits and `e^H` for nats. The lesson's 0.75-nat example is correct. Say "base e for nats, base 2 for bits."
2. **L9 `eval-criteria`, `how-it-works`**: "For a per-sample rate p, pass@k is 1 minus (1 minus p) to the power k." This estimate assumes independent samples. The book defines pass@k as the fraction of problems solved by any of k samples. Say "estimates."
3. **L2 `foundation-models`, `what-it-is`**: "The tokenizer turns the text into about nine tokens" for "The report is three days late." A common tokenizer gives seven or eight tokens with the period. Use "seven or eight."

The prior audit's lesson-18 errors no longer reproduce; current text is correct on all three.

## 5. Final counts

| Measure | Count |
| --- | --- |
| Important concepts | 79 |
| Taught | 61 |
| Thin | 9 |
| Missing | 9 |

## 6. Depth balance

Chapter 9 is under-taught for its interview weight. Two lessons cover 42 book pages. L22 is the most overloaded lesson: quantization, pruning, KV cache, prefix caching, speculative decoding, continuous batching and three parallelism types each get one or two sentences. L14 is second: RAG, BM25, dense retrieval, ANN, hybrid fusion, reranking, chunking, freshness and access control share one lesson. Both are coherent, but the depth per lever is low.

Chapter 10 is split. Monitoring is strong. The feedback half is thin against the book: no sycophancy, no feedback design, no conversational feedback extraction. Chapter 6 is strong on retrieval and on the agent loop, but planning and memory each get one paragraph, while the book gives them a long section. Chapter 1 has one starter lesson and omits use-case evaluation and milestones. Chapter 7 is strong on LoRA and memory math, but model merging and precision formats are absent or thin. No lesson is thin overall; the gaps are sub-topic gaps.

## 7. Verdict

**GAPS.** The course teaches 61 of 79 concepts at interview depth. Retrieval, evaluation, judging, prompt injection, LoRA, data engineering and serving metrics are strong. The gaps cluster in five places: test-time compute, agent planning and memory, multimodal input, feedback limitations and utilization metrics.

Five highest-value improvements:

1. Add test-time compute to L5: best-of-N, self-consistency, verifier selection, cost.
2. Expand agent planning, reflection and memory management in L16.
3. Add multimodal models to L2 and multimodal or tabular RAG to L14.
4. Add sycophancy, feedback design and conversational extraction to L24.
5. Add utilization, MFU and MBU to L21.

All five fit inside existing lessons and sections; no new lesson is needed.
