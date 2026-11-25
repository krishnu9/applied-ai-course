# Glossary

One term, one definition, one spelling. This glossary is the single home for every concept that
the 24 lessons use. An author writes a term here once and reuses that spelling in every lesson.

Rules:

- Use US spelling throughout: `quantization`, `behavior`, `labeled`, `fine-tuning`.
- Use one term for one concept. Do not rotate synonyms for style.
- A lesson defines a term at first use and links here.
- Group the terms by chapter. A term lives in one chapter only.

## Chapter 1 — The AI engineering stack

| Term | Definition |
| --- | --- |
| AI engineering stack | The three cooperating layers of an AI product: application, model and infrastructure. |
| Application layer | The product code that shapes input, calls a model and uses the output. |
| Model layer | The trained model and the sampling, prompting and fine-tuning that shape its behavior. |
| Infrastructure layer | The serving, storage, network and monitoring that run the model and the product. |
| AI engineering vs ML engineering | Product-first work that adapts existing models, compared with data-first work that trains models. |
| Foundation model | A large pretrained model that serves many tasks without task-specific training. |
| Build vs buy | The choice to self-host open weights or to call a hosted model API. |
| Use case evaluation | The assessment of risk, value and milestones before a project starts. |
| Failure ownership | The assignment of a failure to one layer so the repair has one owner. |

## Chapter 2 — Understanding foundation models

| Term | Definition |
| --- | --- |
| Token | A unit of text that a tokenizer maps to a number; models read and write tokens, not words. |
| Tokenizer | The deterministic rule set that splits text into tokens and maps them to ids. |
| Embedding | A dense vector that represents the meaning of text for search or comparison. |
| Attention | The mechanism that lets each token weigh other tokens when it builds its representation. |
| Transformer | The neural architecture built from attention blocks and feed-forward blocks. |
| Next-token prediction | The training and inference task of choosing the next token from a probability distribution. |
| Logit | The raw score that a model gives each candidate token before the softmax. |
| Softmax | The function that turns logits into a probability distribution over the vocabulary. |
| Context window | The maximum number of tokens that a model can read in one call, input plus output. |
| Parameter | One learned weight in the model; the count measures model size. |
| Scaling law | An empirical rule that predicts loss from model size, data and compute. |
| Mixture of experts (MoE) | A sparse architecture that routes each token to a few expert subnetworks. |
| Sparse model | A model that activates only part of its parameters for each token. |
| Pretraining | The first training stage that learns general language patterns from large text. |
| Post-training | The later stages that turn a base model into a helpful, aligned assistant. |
| Supervised fine-tuning (SFT) | Training on input/output pairs to teach format and task behavior. |
| Preference tuning | Training that uses ranked or compared answers to shape model behavior. |
| RLHF | Reinforcement learning from human feedback; a preference-tuning method that uses a reward model. |
| DPO | Direct preference optimization; a preference-tuning method that skips the reward model. |
| Base model | A pretrained model before instruction tuning; it continues text rather than answers. |
| Instruct model | A model tuned to follow instructions and to hold a conversation. |
| Temperature | A sampling setting that scales logits; low values sharpen and high values flatten the distribution. |
| Top-p (nucleus sampling) | Sampling from the smallest token set whose probability sums to p. |
| Top-k sampling | Sampling from the k most likely next tokens. |
| Greedy decoding | The choice of the single most likely token at each step. |
| Seed | A value that fixes the random stream so a run can repeat. |
| Non-determinism | Output variation across runs with the same input, from sampling or from hardware. |
| Hallucination | A fluent answer that is false or unsupported by the given evidence. |
| Structured output | A response that follows a fixed schema, such as JSON. |
| Constrained decoding | Decoding that masks tokens which would break a required grammar or schema. |
| Test-time compute | Extra work at inference, such as sampling many answers, to raise quality. |
| Self-consistency | Sampling several reasoning paths and choosing the majority answer. |
| Best-of-N | Generating N candidates and selecting the best one with a scorer or a verifier. |

## Chapter 3 — Evaluation methodology

| Term | Definition |
| --- | --- |
| Evaluation | The repeatable measurement of system quality on fixed cases. |
| Eval set | A fixed collection of inputs with expected outputs or labels. |
| Held-out set | Cases kept out of tuning and used only for a final score. |
| Label (ground truth) | The expected answer for a case, written by a person or a trusted rule. |
| Pass rate | The share of cases that meet the expected result. |
| Pass@k | The chance that at least one of k generated samples is correct. |
| Exact match | A metric that counts only answers identical to the reference. |
| Precision | Of the items predicted positive, the share that are correct. |
| Recall | Of the items that are truly positive, the share that the system finds. |
| F1 | The harmonic mean of precision and recall. |
| Cosine similarity | The cosine of the angle between two vectors; a score from -1 to 1. |
| Perplexity | The exponent of mean negative log-likelihood; lower means the model predicts the text better. |
| Cross-entropy | The average negative log-likelihood of the true tokens. |
| Bits per byte (BPC/BPB) | A tokenizer-independent loss measure per byte of text. |
| LLM-as-judge | The use of a language model to score answers against a rubric or a reference. |
| Pointwise judgment | A judge scores each answer alone. |
| Pairwise judgment | A judge compares two answers and picks a winner. |
| Position bias | A judge favors the answer in a fixed slot, such as first or last. |
| Verbosity bias | A judge favors longer answers regardless of quality. |
| Self bias | A judge favors text from its own model family. |
| Position-flip rate | The share of answer pairs whose winner changes when the two answers swap slots. |
| Verbosity gap | The average score or win-rate difference between longer and shorter answers of equal quality. |
| Human agreement rate | The share of judge decisions that match human labels. |
| Rubric | A written list of criteria and levels that defines a good answer. |
| Elo rating | A relative skill score updated from pairwise wins and losses. |
| Preference model | A model trained to predict which of two answers a person prefers. |

## Chapter 4 — Evaluate AI systems

| Term | Definition |
| --- | --- |
| Evaluation criterion | One quality dimension that a system must meet, such as format or safety. |
| Benchmark | A public, fixed test set used to compare models. |
| Contamination | Training data that overlaps the test set and inflates the score. |
| Hard attribute | A requirement that a model must meet, such as a license or a latency limit. |
| Soft attribute | A preference that trades against other attributes, such as tone or cost. Cost is soft until a budget is fixed, then it is hard. |
| Model selection | The evidence-based choice of a model for a task under constraints. |
| Cost-quality frontier | The set of models where no cheaper model gives the same quality. |
| Leaderboard | A public ranking of models on one or more benchmarks. |
| Slice | A subset of the eval set that shares a trait, such as language or ticket type. |
| Confidence interval | The range that likely contains the true score, given sample noise. |
| Evaluation pipeline | The combined checks on components, end-to-end output and cost. |
| Verifiable task | A task whose answer a rule or a test can check. |

## Chapter 5 — Prompt engineering

| Term | Definition |
| --- | --- |
| System prompt | The instruction set that sets role, rules and output shape for a call. |
| User prompt | The request and data supplied for one task. |
| Zero-shot | A prompt with instructions only and no worked examples. |
| Few-shot | A prompt that includes a few worked examples. |
| Chain of thought (CoT) | A prompt pattern that asks for intermediate reasoning steps. |
| Prompt template | A reusable prompt with placeholders for input data. |
| Delimiter | A marker that separates instructions from untrusted text. |
| Output contract | The required shape, fields and failure behavior of a response. |
| Instruction hierarchy | A rule order that lets system instructions outrank user or tool text. |
| Prompt injection | Text in the input that tries to override the intended instructions. |
| Indirect prompt injection | An attack hidden in retrieved or tool content rather than typed by the user. |
| Jailbreak | An input that tries to bypass a model's safety rules. |
| Prompt versioning | The practice of storing prompts under version control with the code. |
| Context engineering | The deliberate selection of what enters the context window. |
| Context budget | The token allowance split across rules, examples, chunks and history. |
| Lost in the middle | The drop in recall for facts placed in the middle of a long context. |
| Prefix caching (prompt caching) | Reuse of a cached prompt prefix to cut cost and time to first token. |

## Chapter 6 — RAG and agents

| Term | Definition |
| --- | --- |
| RAG (retrieval-augmented generation) | Supplying retrieved documents to a model at answer time. |
| Index time vs query time | The offline build of the search index compared with the online lookup. |
| Chunk | A small passage that is indexed and retrieved as one unit. |
| Chunking | The split of documents into chunks, with an overlap policy. |
| TF-IDF | A lexical weight that favors terms frequent in a document but rare in the corpus. |
| BM25 | A lexical ranking function that scores term matches with length and frequency limits. |
| Inverted index | A map from each term to the documents that contain it. |
| Dense retrieval | Search by embedding similarity rather than by word match. |
| ANN (approximate nearest neighbor) | A fast search that returns close vectors without checking all of them. |
| Hybrid retrieval | The combination of lexical and dense search results. |
| RRF (reciprocal rank fusion) | A fusion rule that adds 1/(k + rank) across result lists. |
| Top-k | The number of ranked results that pass to the next stage. |
| Reranker | A second model that scores query and candidate pairs and reorders the shortlist. |
| Recall@k | The share of relevant documents found in the top k results. |
| MRR (mean reciprocal rank) | The average of 1/rank of the first relevant result. |
| nDCG | A graded ranking score that discounts each relevant item by its position. |
| Query rewriting | The rewrite of a user query into a form that searches better. |
| Contextual retrieval | Adding document or chunk context to a chunk before embedding it. |
| Agent | A model that plans, calls tools, observes results and repeats until a stop rule fires. |
| Tool schema | The typed description of a tool name, arguments and return shape. |
| Function calling | The model's structured request to run a named tool with arguments. |
| Trajectory | The ordered record of an agent's steps, tool calls and observations. |
| Stop condition | A rule that ends the agent loop, such as a step budget or a final answer. |
| Planning | The decomposition of a goal into ordered steps before action. |
| Reflection | The agent's review of its own result to decide the next step. |
| Agent memory | Stored state that an agent reads across steps or sessions. |

## Chapter 7 — Fine-tuning

| Term | Definition |
| --- | --- |
| Fine-tuning | Further training of a model on task data to change its behavior. |
| PEFT (parameter-efficient fine-tuning) | Fine-tuning that trains a small fraction of the parameters. |
| LoRA | A PEFT method that adds low-rank matrices to frozen weights. |
| Rank (LoRA rank) | The inner dimension of a LoRA update; it sets the adapter size. |
| Adapter | A small trained module that is added to a frozen base model. |
| QLoRA | LoRA on a quantized base model, to cut GPU memory. |
| Quantization | The storage of weights or activations in fewer bits. |
| Catastrophic forgetting | The loss of earlier skills after training on a narrow task. |
| Optimizer state | The stored momentum and variance that a training step needs. |
| VRAM (GPU memory) | The memory on the accelerator that limits model and batch size. |

## Chapter 8 — Dataset engineering

| Term | Definition |
| --- | --- |
| Data curation | The selection and shaping of training or eval data. |
| Data quality | The fitness of data on relevance, consistency, format and compliance. |
| Data coverage | The range of cases that the data represents. |
| Data quantity | The number of examples, balanced against quality. |
| Deduplication | The removal of near-identical records. |
| Annotation | The human labeling of data under written guidelines. |
| Inter-annotator agreement | The share of labels on which two annotators agree. |
| Data split | The division of data into train, validation and test parts. |
| Data synthesis | The generation of new training data, often by a model. |
| Distillation | Training a smaller student model on outputs from a larger teacher model. |
| Teacher model | The larger model that produces training targets in distillation. |
| Student model | The smaller model that is trained to copy the teacher. |
| Model collapse | The quality loss when models train on their own unverified output. |
| License | The legal terms that govern use of data, weights or a model. |

## Chapter 9 — Inference optimization

| Term | Definition |
| --- | --- |
| Inference | The run of a trained model to produce output. |
| TTFT (time to first token) | The delay from request to the first streamed token. |
| TPOT (time per output token) | The average time between output tokens after the first. |
| Latency percentile | The p50, p95 or p99 value of the latency distribution. |
| Throughput | The number of requests or tokens that a system serves per unit of time. |
| Goodput | The throughput of requests that meet the latency target. |
| Prefill | The parallel pass that reads the input tokens and fills the KV cache. |
| Decode | The step-by-step pass that generates output tokens. |
| Batching | The grouping of requests in one forward pass. |
| Continuous batching | The addition and removal of requests from a running batch. |
| Speculative decoding | The use of a small draft model to propose tokens that a large model checks. |
| KV cache | Stored key and value tensors that avoid recomputing earlier tokens. |
| Pruning | The removal of weights or layers to cut size and cost. |

## Chapter 10 — Architecture and user feedback

| Term | Definition |
| --- | --- |
| Guardrail | A check that blocks or edits unsafe, off-policy or malformed input and output. |
| Input guardrail | A check on the user or retrieved text before the model reads it. |
| Output guardrail | A check on the model response before the user sees it. |
| PII masking | The removal or replacement of personal data in text. |
| Router | A component that sends each request to a model or path by intent or cost. |
| Gateway | A single interface in front of several models, with auth, logging and fallback. |
| Semantic cache | A cache that returns a stored answer for a new query with close meaning. |
| Exact cache | A cache that returns a stored answer only for an identical query. |
| Fallback | A backup model or path used when the primary fails or exceeds a limit. |
| Human-in-the-loop | A workflow that sends selected cases to a person for review. |
| Trace | The linked record of one request across services, with timings and attributes. |
| Observability | The ability to infer system state from logs, metrics and traces. |
| Metric | A numeric measure collected over time, such as error rate or latency. |
| MTTD (mean time to detect) | The average time from a fault to its detection. |
| MTTR (mean time to recover) | The average time from detection to recovery. |
| CFR (change failure rate) | The share of changes that cause a failure. |
| Explicit feedback | A signal that the user gives on purpose, such as a thumbs-down. |
| Implicit feedback | A signal that is inferred from behavior, such as a copied answer. |
| Feedback bias | The skew in feedback toward loud, easy or satisfied users. |
| Degenerate feedback loop | A loop where the system learns only from its own output. |
