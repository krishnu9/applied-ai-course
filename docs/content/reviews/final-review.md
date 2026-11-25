# Final review — 24-lesson AI engineering course

Reviewer: `final-review`, independent pass. Date: 2026-11-26.
Scope: the approved plan, the course documents, all 24 lessons, the registry, types,
validator, the production build, and the static export at 1440, 768 and 390.

Tree note: the code fixes from this review pass landed as commit `6cee861` (after `b5ea177`).
The build and browser checks below ran on that code. The review file has later wording edits.

## 1. Verdict

**SHIP WITH NOTES.**

The course meets every owner requirement. The strict build passes. All 24 lessons render at three
widths. The capstone gate, reload persistence and v1-to-v2 migration work. The 42 Core concepts
have an owning lesson. No blocking issue remains.

The notes are low polish. The strongest open note is a two-lesson interview word count below the
brief floor. The rest are edge cases at 200% text, a dev-server fallback, optional data cleanup
and home copy.

## 2. Requirements against evidence

| Requirement | Result | Evidence |
| --- | --- | --- |
| 24 lessons across 10 chapters; 6 old slugs preserved; 8 flagships | PASS | `lib/course-registry.ts`; build lists 24 lesson paths. |
| Every lesson has an ASD-STE100 explanation | PASS | Definitions and mechanisms are in simple present. No contractions. 0 prose sentences exceed 25 words after the final fix pass. |
| Two or three ELI5 sections; each has an analogy and a real break | PASS | 24 of 24 have 2 ELI5 sections. ELI5 total is 242–268 words. Every analogy has 3–5 sentences. |
| One static diagram in all 24; interactive diagrams only on the 8 flagships | PASS | 24 diagrams, all 5 variants, each with caption and alt. 8 interactive blocks, exactly on the flagships. |
| The support-triage case is the evaluation layer, not the teaching voice | PASS | Part 2 defines the topic before the case. Part 7 holds the triage case. No lesson opens with a ticket. |
| 12-part template in order | PASS | Section order matches the brief. Flagships add one lab section. |
| 4–6 terms with definitions | PASS | Every lesson has 5 or 6 terms. |
| 4–6 checks with kinds; 2-sentence teaching explanations | PASS | Every lesson has 4–6 checks. Every lesson has an apply, diagnose or calculate check. Spot checks found one correct answer and a teaching explanation. |
| 5-item task with a runnable solution | PASS | All 24 solutions run with exit 0. Four solutions match the printed lesson numbers. |
| 4 interview Q&A; one citation; no duplicate headings | PASS | 24 of 24 have 4 answers. Every answer has 3–4 sentences. One citation per lesson. 0 duplicate H2 or section title. |
| Word budgets | PASS with one note | Total prose is 1,443–1,499 words standard and 1,914–2,260 flagship; total 40,055 words. ELI5 is in range. Two lessons have interview totals below 200 words. See N1. |
| 42 interview-core concepts taught | PASS | 42 of 42 have an owning lesson. 40 are complete, 2 are thin. See section 3. |
| Factual fixes: LoRA, TPOT, BM25, cost attribute | PASS | LoRA, TPOT and BM25 are fixed. Cost is now defined the same way in lessons 9 and 10 and the glossary. |
| `COURSE_FINAL=1 CONTENT_VALIDATE=1 npm run build` | PASS | Exit 0. 30 static pages. 24 lesson paths. 0 validator faults. |
| 30 static pages; 24 lessons return 200; 404 works | PASS | Build log. 28 routes pass at 3 widths. Unknown slug returns 404. |
| Runtime: no console error, no page horizontal scroll | PASS | 72 lesson/view checks, 0 failures. No external request. The only console message is the expected 404 resource. |
| Chapter rail, terms, ELI5, tables, diagrams, one lab per flagship | PASS | 24 of 24 at 1440, 768 and 390. 8 of 8 labs respond by mouse and keyboard. |
| Evaluation gate, reload persistence, v1-to-v2 migration | PASS | Gate order holds. Score moves 41/0.94/2.4 to 49/0.92/2.3. Reload keeps checks, ticks, note and repair. Migration passes at 390 and 1440. |
| Originality and copyright | PASS, spot check | No raster image, no external image and no book figure. Original examples. One citation per lesson. Disclaimer in footer and About. |
| Hygiene: no secret, no external request, one storage module | PASS | `localStorage` only in `lib/progress/storage.ts`. No fetch, XHR or WebSocket. No secret. No draft lesson. 27 internal links, all 200. |

## 3. Coverage counts and open items

### 3.1 Coverage

| Measure | Count |
| --- | --- |
| Core rows | 42 |
| Taught | 42 |
| Taught, full | 40 |
| Taught, thin | 2 (`parallelism`, `decomposition`) |
| Partial, named sub-item absent | 0 |
| Missing at row level | 0 |
| Useful rows mapped | 16 |
| FYI rows excluded | 3 |

The 8 gaps from `coverage-audit.md` are closed:

| Gap | Status | Where |
| --- | --- | --- |
| Top-k sampling | Taught | Lesson 5: definition, table row, use. |
| Zero-shot | Taught | Lesson 11: definition and worked use. |
| TF-IDF | Taught | Lesson 14: definition and contrast with BM25. |
| Task decomposition | Taught, thin | Lesson 11: definition and use. No failure-table row. |
| Paraphrase, back-translation, self-play | Taught | Lesson 20: one method sentence each. |
| Cache eviction | Taught | Lesson 23: TTL, LRU, stale-entry failure. |
| Parallelism | Taught, thin | Lesson 22: one sentence now separates replicas from tensor and pipeline splits. |
| Jailbreak | Taught | Lesson 11: separate definition and guard. |

The 4 old folds are present: MoE in lesson 3, entropy and BPC in lesson 6, data format and
chain-of-thought/tool-use data in lesson 19, and pruning in lesson 22.

### 3.2 Previously open items

Pilot review, original blockers:

| ID | Item | Status |
| --- | --- | --- |
| B1 | Terms not rendered | PASS: 5–6 terms render in the header. |
| B2 | Interview block adds a second H2 | PASS: one H2, questions are H3. |
| B3 | Retrieval lab has two variables | PASS: one range input, fixed query. |
| B4 | BM25 label on a non-BM25 score | PASS: label says word-overlap; note says not BM25. |
| B5 | ELI5 #1 has six sentences | PASS: 5 sentences. |
| B6 | ELI5 #2 has six sentences | PASS: 5 sentences. |
| B7 | False doc-02 cause | PASS: text says doc-02 matches policy. |
| B8 | Cites lesson 7 for missing data | PASS: lesson 7 is live and the data points to lesson 6. |
| B9 | Pairs are not the billing slice | PASS: text says pairs across slices. |
| B10 | Item 5 has no runnable transfer | PASS: reset pairs print flip and agreement. |
| B11 | "Repeatable score" contradicts drift | PASS: text names a fixed prompt and sampling. |
| B12 | Zero flip rate "rules out" bias | PASS: text says no evidence, not proof. |
| B13 | Interview answer has 5 sentences | PASS: 4 sentences. |

Pilot review, re-check items:

| ID | Item | Status |
| --- | --- | --- |
| R1 | Retrieval ELI5 below 240 words | PASS: 245 words. |
| R2 | Header repeats the chapter line | PASS: one chapter line. |
| R3 | Wide retrieval diagram needs inner scroll at 390 | ACCEPTED: internal scroll, labels are legible. |
| R4 | Glossary lacks position-flip and verbosity terms | PASS: both entries exist. |
| R5 | Part 2 exceeds row guidance | ACCEPTED: guidance only; total is in budget. |
| R6 | Live region does not announce the reorder | FIXED: it now says "First doc-07, then doc-02." |
| R7 | Lesson 7 is a draft | PASS: lesson 7 is live. |
| R8 | Interview region label differs from the H2 | FIXED: the separate label is removed. |

Pilot notes N1–N10: all are closed. N1, N4, N5 and N8 pass. N2 and N3 map to R3 and R6.
N6, N7 and N10 map to R4, R5 and B1. N9 is accepted.

Desktop QA:

| ID | Item | Status |
| --- | --- | --- |
| F1 | Header repeats chapter | PASS: fixed. |
| F2 | Bars value label overlaps the bar | PASS: fixed; value column is sized from the label. |
| O2 | Validator does not check the ELI5 subtotal | PASS: `content/validate.ts` checks 240–540. |

Mobile QA:

| ID | Item | Status |
| --- | --- | --- |
| F1 | Wide diagram labels shrink | PASS: min width uses the viewBox width. |
| F2 | Slider touch target is 16 px | PASS: range input is 44 px high. |
| F3 | Long H1 clips at 200% text | PASS: content is preserved; no page scroll. |
| F4 | Action bar covers the footer at 200% | PASS: measured bar height drives body padding. |
| F5 | Duplicate "Where it breaks:" label | PASS: 0 visible duplicates. |
| O1 | RAG live region names only the first result | FIXED: it names the first two results. |
| O2 | Header is taller than the anchor margin at 200% | FIXED: measured header height sets the margin. The section lands 16 px below the header. |
| O3 | Long H1 breaks mid-word at 200% | OPEN: low; see N2. |
| O4 | Dev server returns 500 once for an unknown slug | OPEN: static export returns 404; dev only. |
| O5 | 11 lessons store the "Where it breaks:" prefix | ACCEPTED: renderer strips it; 0 visible duplicates. |
| O6 | A tap near the bottom can land on the action bar | OPEN: low; see N3. |

Coverage audit, factual items:

| ID | Item | Status |
| --- | --- | --- |
| 1 | LoRA full fine-tune budget 12 bytes | FIXED: 16 bytes per base parameter. |
| 2 | Adapter budget 10 bytes and 168 MB | FIXED: 12 bytes per trainable parameter; 201 MB. |
| 3 | Rank 64 "approaches full fine-tuning" | FIXED: rank 64 is about 67M parameters, near 1 percent of 7B. |
| 4 | TPOT uses 250 gaps | FIXED: 249 gaps; 2,394 ms. Check-4 uses 99 gaps. |
| 5 | BM25 stemming claim | FIXED: text says the tokenizer does not stem. |
| 6 | Cost is hard in one lesson and soft in another | FIXED: lesson 9, lesson 10 and the glossary now state the same rule. |

## 4. Blocking issues

**None.** Blocking count: 0.

No issue stops publication. The notes below improve polish or close an edge case. They do not
break a route, a lesson, the gate or the migration.

## 5. Non-blocking notes

| ID | Note | Owner | Minimal fix |
| --- | --- | --- | --- |
| N1 | Lessons 4 and 5 have interview answers of 199 and 190 words. The brief floor is 200 words. The validator does not check the interview subtotal. | Content authors | Add 1 word to lesson 4 and 10 words to lesson 5, or lower the floor. |
| N2 | At 200% text, a very long single-word H1 can break mid-word. Current titles do not overflow, and content is preserved. | Design token owner | Add hyphenation or a smaller 200% heading size. |
| N3 | A tap near the bottom can be lost when a focused field blurs and the action bar reappears. | Action bar owner | Delay the bar return, or ignore a tap that lands on the bar right after blur. |
| N4 | 11 lessons store a "Where it breaks:" prefix in the `breaks` data. The renderer strips it and 0 duplicate labels appear. | Content authors | Optional: remove the prefix from the data, or state that the renderer owns the label. |
| N5 | The dev server returns 500 once for an unknown slug after a route compile. The static export returns 404. | Engine and build owner | Improve the dev fallback, or document the static-only behavior. |
| N6 | The home hero says "repairing one system", not "layer by layer". Home has no "Coverage" link; the roadmap link is "See the roadmap". | Home owner | Optional copy alignment. |

Resolved during this review, after the first pass:

| ID | Was | Now |
| --- | --- | --- |
| X1 | Word-budget grouping was ambiguous | `COURSE-BRIEF.md` now labels the ranges as total prose and says the validator checks ELI5 separately. |
| X2 | Cost rule was only in lesson 10 | Lesson 9 and the glossary now state the same rule. |
| X3 | Three analogies had 6 sentences | All analogies now have 3–5 sentences. |
| X4 | 7 prose sentences exceeded 25 words | 0 prose sentences exceed 25 words. |
| X5 | Header covered an anchor jump at 200% | The measured header height sets the anchor margin. |
| X6 | RAG live region named one result | It names the first two results. |
| X7 | Interview region label differed from the H2 | The separate label is removed. |
| X8 | British chapter title and glossary term drift | The title uses US spelling; "Prefix caching (prompt caching)" matches the glossary. |
| X9 | The replica parallelism sentence was imprecise | Replicas copy a model; tensor and pipeline split one model. |

## 6. What to tell the owner in plain words

**What was built.** The site is now a 24-lesson course in 10 chapters. Each lesson explains a
topic first. Each lesson adds two ELI5 sections, one static diagram, checks, a five-step task
and four interview questions. The support-triage product is the evaluation layer. Eight flagship
lessons add one interactive lab each. One score panel tracks six repair stages.

**How to try it.**
1. Run `npm install`.
2. Run `npm run dev`.
3. Open http://localhost:3000.
4. Open a lesson and answer the checks. Set the five ticks and write one proof sentence. The
   repair button then turns on.
5. Open the eight flagship lessons and move one control in each lab.

**How to publish.**
1. Run `COURSE_FINAL=1 CONTENT_VALIDATE=1 npm run build`.
2. Confirm the build prints 30 static pages and exit 0.
3. Upload the `out/` folder to Vercel or any static host. The README says Vercel needs no
   extra configuration. There is no backend and no environment variable.

**What to decide.** No decision blocks a publish. Optional: add 1 and 10 words to the lesson 4
and lesson 5 interview answers. Optional: fix the four low edge cases in section 5.

## 7. Evidence

### 7.1 Commands

| Command | Result |
| --- | --- |
| `npm run typecheck` | Exit 0 |
| `npm run lint` | Exit 0 |
| `COURSE_FINAL=1 CONTENT_VALIDATE=1 npm run build` | Exit 0; 30 static pages; 24 lesson paths; 0 validator faults |
| Static export served on `http://localhost:3104` | 24 lessons, home, roadmap and about return 200; unknown slug returns 404 |
| Structure pass at 1440×900, 768×1024, 390×844 | 28 routes at each width; 72 lesson/view checks; 0 failures; 0 console errors beyond the expected 404; 0 external hosts |
| Evaluation loop at 1440 and 390 | Gate order holds; 49% / $0.92 / 2.3 s after repair; reload persists; non-capstone does not move the capstone |
| Migration at 1440 and 390 | Valid v1 maps to v2 and v1 stays byte-identical; corrupt v1 is empty; v2 wins when both keys exist |
| 8 flagship labs at 1440 and 390 | 8 of 8 respond; agent error path stops with a reason; 0 panel overflow |
| All 24 task solutions with `python3 -I` | 24 of 24 exit 0 |
| Four solution spot checks | Evaluation, retrieval, agents and cost print the numbers in the lesson text |
| Six check spot checks | One correct answer and a teaching explanation in each |
| Internal link crawl | 27 unique targets; all 200 |
| Hygiene scan | `localStorage` only in `lib/progress/storage.ts`; no fetch, XHR, WebSocket, external URL, secret or draft lesson |

### 7.2 Routes

- `/`, `/roadmap`, `/about`, and the 404 page.
- `/lessons/{slug}` for all 24 lessons.

### 7.3 Screenshots

All files are in `/tmp/lm-qa`:

- Pages: `final2-home-{1440,768,390}.png`, `final2-retrieval-{1440,768,390}.png`,
  `final2-404-{1440,768,390}.png`, `final2-roadmap-1440.png`.
- Five diagram variants: `final2-diagram-{flow,stack,matrix,timeline,bars}-{1440,390}.png`.
- Tables: `final2-table-{1440,390}.png`.
- Labs: `final2-widget-{judge,arena,injection,context,rag,agent,lora,serving}-{1440,390}.png`.
- Evaluation: `final2-eval-gate-{1440,390}.png`.
- Migration: `final2-migration-390.png`.
- 200% text: `final2-zoom200-390.png`.

### 7.4 Limits of this review

- The copyright check is a structural and visual spot check. It found no raster image, no book
  figure and no copied chapter structure. It did not run a full text diff against the PDF, because
  no PDF text extractor is available on this machine.
- The remaining mobile notes N2 and N3 come from the mobile QA report and a repeat of the 200%
  probe. I did not reproduce the lost-tap case with a real finger.
- The fixes from this review pass landed as commit `6cee861`. The final build and all browser
  checks ran on that code. A later change can invalidate this evidence.
