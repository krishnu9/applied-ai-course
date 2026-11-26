# Copyright and originality audit

**Verdict: LOW risk.** The course reproduces no book text, table or figure. One structural issue needs a cheap fix: the ten chapter titles and their order mirror the book.

This audit is a risk assessment. It is not legal advice.

## 1. Scope and method

- Source: *AI Engineering* by Chip Huyen (O'Reilly, 2024), 535 pages.
- Course: all 24 lessons in `content/lessons/`, plus `content/retrieval.ts`, `content/scores.ts`, `content/cost-model.ts`, `docs/content/COURSE-BRIEF.md`, `app/about/page.tsx` and `components/shell/SiteFooter.tsx`.
- Book text stayed outside the repository. Extraction used Swift and PDFKit into `/tmp/copyright-audit/book.txt`. The result was 173,168 words and 8,939 sentences.
- Lesson extraction took every quoted field: paragraphs, lists, callouts, analogies, checks, task text, interview answers and table cells. The sample is over-inclusive on purpose.
- Comparison used the Python standard library only. Normalisation was lowercase, punctuation stripped, and book line-break hyphens joined.
- The `citation` field is excluded from the prose comparison. Its book-title match is a citation, not a copy.

## 2. Quantitative results

| # | Lesson | Longest match (words) | 8-gram overlap | Near-duplicate sentences |
| --- | --- | --- | --- | --- |
| 1 | ai-stack | 6 | 0.00% | 0 |
| 2 | foundation-models | 5 | 0.00% | 0 |
| 3 | model-scaling | 5 | 0.00% | 0 |
| 4 | post-training | 5 | 0.00% | 0 |
| 5 | sampling-and-hallucination | 5 | 0.00% | 0 |
| 6 | evaluation | 6 | 0.00% | 0 |
| 7 | eval-sets | 5 | 0.00% | 0 |
| 8 | llm-as-judge | 5 | 0.00% | 0 |
| 9 | eval-criteria | 5 | 0.00% | 0 |
| 10 | model-selection | 5 | 0.00% | 0 |
| 11 | prompt-contract | 4 | 0.00% | 0 |
| 12 | structured-outputs | 5 | 0.00% | 0 |
| 13 | context-engineering | 5 | 0.00% | 0 |
| 14 | retrieval | 5 | 0.00% | 0 |
| 15 | retrieval-quality | 4 | 0.00% | 0 |
| 16 | agents | 5 | 0.00% | 0 |
| 17 | fine-tuning | 4 | 0.00% | 0 |
| 18 | lora-memory | 5 | 0.00% | 0 |
| 19 | dataset-curation | 4 | 0.00% | 0 |
| 20 | synthetic-data | 5 | 0.00% | 0 |
| 21 | cost | 6 | 0.00% | 0 |
| 22 | inference-optimization | 5 | 0.00% | 0 |
| 23 | ai-architecture | 4 | 0.00% | 0 |
| 24 | observability-feedback | 5 | 0.00% | 0 |

Summary:

- **Longest common word sequence:** 4 to 6 words in every lesson. No lesson reaches 7 words.
- **8-word shingle overlap:** 0.00% in every lesson.
- **Sentence near-duplicates:** zero at the 0.85 difflib threshold. A looser pass at 0.70 also found zero.
- **Content-bearing 5-grams:** 31 across 24 lessons. All are technical terms or generic phrases, such as "time to first token".
- **Code:** 217 code lines of six tokens or more. Zero exact matches in the book.
- **Test result:** a planted book sentence returned 9 shingle hits. The detector works.

The three 6-word matches are "AI engineering differs from ML engineering" (lesson 1), "the model the prompt or the" (lesson 6) and "token TPOT time per output token" (lesson 21). The first restates a book section heading. The other two are a generic phrase and a term expansion.

## 3. Qualitative findings

### 3.1 Structure

The chapter layer is a direct map of the book. `lib/course-registry.ts` defines ten chapters in the book's order, and every chapter carries a `bookChapter` field from 1 to 10.

The chapter titles are close to the book chapter titles:

- Six are identical after case folding: "Understanding foundation models", "Evaluation methodology", "Prompt engineering", "RAG and agents", "Dataset engineering", "Inference optimization".
- Two differ only by word form: "Evaluating AI systems" and "Fine-tuning".
- One is a subset: "Architecture and user feedback".
- One repeats a book section heading: "The AI engineering stack".

The 24 lesson titles are mostly original. Lesson 1 is the only exact heading match. The topic sequence follows the book's section order at a coarse level. The largest book chapters also get the most lessons: chapter 2 has four, and chapters 3, 5 and 6 have three.

This is a topic map, not a prose template. The book serves as a table of contents. The lessons, triage product, 12-part template and analogies are independent. Still, the chapter layer is visible, and the `bookChapter` field states the mapping in public code.

### 3.2 Paraphrase

I read the highest-similarity regions in full: the retrieval, cost, evaluation and judge lessons. No passage is a lightly reworded book passage.

- The book defines the latency sum with the token count. The course counts gaps instead and corrects the off-by-one. That is independent reasoning, not copying.
- The book lists judge limits as inconsistency, criteria ambiguity and bias. The course adds a swap test, a position-flip rate and a human agreement rate. The shared part is the taxonomy, which is an idea.

Shared sentences are short technical definitions. Copyright does not protect a fact or a method.

### 3.3 Citation and quotation

Every lesson has exactly one `citation` field. All 24 match this shape:

> Further reading: AI Engineering by Chip Huyen (O'Reilly). This course is independent and reproduces no book text or figures.

The lines sit at the end of the lesson and contain no quotation. Four lessons add a topic phrase, such as "Further reading on retrieval".

### 3.4 Figures

`public/`, `out/`, `app/` and `components/` contain no figure image: no PNG, JPEG, SVG, WebP or PDF asset. `app/favicon.ico` is the only icon, and it is not a book cover.

All diagrams are inline SVG. `components/lesson/Diagram.tsx` builds them from node and edge specs through `diagramLayout.ts`. The five variants are flow, stack, matrix, timeline and bars. The layouts are generic and original. No diagram is traced from a book figure, and no lesson cites a figure number.

### 3.5 Branding and trademarks

The course name is "lastminute.dev". It does not contain the book title or the publisher name. The header shows only the course name.

"AI Engineering" and "O'Reilly" appear in the citation line and in one About sentence. Both uses are descriptive. There is no logo, cover image or trade dress. No page claims affiliation, partnership or endorsement.

### 3.6 Disclaimer

The footer says: "Independent study notes. Not affiliated with the author or publisher." It adds that the book is cited once per lesson and that no text or figures are reproduced. The About page repeats this.

The disclaimer is accurate. One wording change is optional: "study notes" suggests notes taken from the book, and "independent course" is more accurate.

### 3.7 Fair use

- **Purpose:** teaching and comment. The course adds a product case, tasks, checks and original diagrams.
- **Nature:** a published technical work with strong factual content.
- **Amount:** no expressive passage, table or figure is taken. The shared material is terminology and topic order.
- **Market effect:** the short, free course does not replace a 535-page reference book.

The fair-use position on text is strong. The chapter map is the only weak point, and it is easy to remove.

## 4. Passages of concern

| Passage (15 words or fewer) | Location | Minimal fix |
| --- | --- | --- |
| "The AI engineering stack" | `lib/course-registry.ts:83`, `content/lessons/ai-stack.ts:7` | Rename the chapter and lesson, for example "Three layers of an AI product". Keep the term in the glossary. |
| "Understanding foundation models" | `lib/course-registry.ts:91` | Rename, for example "Inside a foundation model". |
| "Evaluation methodology" | `lib/course-registry.ts:104` | Rename, for example "How to measure model quality". |
| "Evaluating AI systems" | `lib/course-registry.ts:112` | Rename, for example "Criteria and model choice". |
| "Prompt engineering" | `lib/course-registry.ts:120` | Rename, for example "The prompt as a contract". |
| "RAG and agents" | `lib/course-registry.ts:128` | Rename, for example "Retrieval and tool loops". |
| "Fine-tuning" | `lib/course-registry.ts:136` | Rename, for example "Adapting a model". |
| "Dataset engineering" | `lib/course-registry.ts:144` | Rename, for example "Data for training". |
| "Inference optimization" | `lib/course-registry.ts:152` | Rename, for example "Serving speed and cost". |
| "Architecture and user feedback" | `lib/course-registry.ts:160` | Rename, for example "Guardrails and feedback". |
| "AI engineering differs from ML engineering" | `content/lessons/ai-stack.ts:92` | Rephrase to "The ML workflow starts from data. The AI workflow starts from a product." The next sentences already say this. |
| `bookChapter: 1` to `bookChapter: 10` | `lib/course-registry.ts:84` and following | Remove the field, or keep the mapping in an internal note only. |

No passage needs a permission or payment. The titles are short phrases, and the one sentence is a factual comparison.

## 5. What is safe and should not change

- All 24 lessons' prose, analogies, checks, tasks and interview answers.
- The support-triage product and its fixed sample numbers.
- The cost model in `content/cost-model.ts`. The numbers are original.
- The code blocks, which match no book listing.
- The inline SVG diagrams and the five diagram variants.
- The citation line and the disclaimer in the footer and About page.
- Technical terms such as TTFT, TPOT, BM25, LoRA and RLHF. Facts and methods are not protected.
- `docs/content/BOOK-INVENTORY.md`, if it stays internal. It lists section titles and states that it maps topics only.

## 6. Required actions before publishing

1. **Rename the ten chapters.** Use independent titles that describe the course, not the book. Remove the `bookChapter` field, or move it to a private planning note.
2. **Rephrase the one sentence** in `content/lessons/ai-stack.ts:92` that restates a book section heading.
3. **Keep `docs/content/BOOK-INVENTORY.md` out of the published site.** Do not link it from a public page.
4. **Optional:** change "Independent study notes" to "Independent course" in the footer.
5. **Re-run this check after the edits.** The chapter table must confirm the rename.

## 7. Limits of the audit

- I am not a lawyer. This is a risk assessment, not legal advice.
- The check covers text only. The site has no figure images.
- Paraphrase judgement sampled four lessons and the highest-similarity regions. It is not a line-by-line review of all 56,000 extracted words.
- Code comparison is exact-line only. A renamed variable in copied code would not show.
- PDF extraction can drop text from figures, tables and unusual layouts. The totals are plausible, not certified.
- The audit does not cover future edits or other books.
- Fair use is assessed under US law. Other jurisdictions apply different tests.
