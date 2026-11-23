# Stage 2 — Concept: the different angle

Angle: stand out against the book, Educative, DeepLearning.AI, systemdesignschool.io and AI
newsletters. Scope: segment A, six lessons, static, no backend, two widgets, no live calls.

## 1. Positioning and the enemy

**Positioning.** lastminute.dev is the short course where you repair one broken AI feature,
layer by layer, and watch one evaluation score climb.

**The enemy is the showcase.** The enemy is not the book. It is the teaching style that shows a
polished result and hides the failure. The book gives depth and no practice. Educative gives
practice inside a catalog. DeepLearning.AI ends in a notebook. Newsletters publish one success
and skip the diagnosis. All teach recognition. None teach repair.

The promise is one verb: **repair**.

## 2. Three differentiation ideas, ranked by realism

### Idea 1 — The Eval Spine (rank 1)

**The idea.** One product, "triage 40 support tickets", runs through all six lessons. Each
lesson repairs one layer. One fixed evaluation set scores the system after each layer. Progress
is the score, not a checkbox.

**Why the alternatives cannot copy it fast.**

- Educative sells independent lessons. One artifact with state across lessons breaks that model.
- The book is linear prose. It cannot show a score change.
- DeepLearning.AI stops at the notebook, not the system.
- Newsletters show one success; a score over time needs six linked edits.
- The score needs authored evaluation data and stable stage boundaries: editorial work, not a
  feature toggle.

**Risk.** Content. The score must move for an honest reason at each layer, and fine-tuning must
fit the same product. Mitigation: use one fixed sample dataset, publish the scoring rule, and
label every number "deterministic sample run".

**On-screen proof.** A six-stage strip at the top of every lesson shows pass rate, cost per 1k
requests and p95 latency. Each lesson shows its before and after delta.

### Idea 2 — Fault-first lessons (rank 2)

**The idea.** Every lesson opens with a failing trace. The reader names the broken layer before
reading one word of explanation. Checks test diagnosis, not recall.

**Why the alternatives cannot copy it fast.** A credible fault needs authored data and a correct
verdict. Recall quizzes are cheaper. Newsletters avoid failure stories. The book has conceptual
exercises, not runnable faults.

**Risk.** Six credible failures is heavy writing, and the format can feel like a trick.
Mitigation: one fault per lesson, with the trace as the answer key.

**On-screen proof.** A red node on the trace and one forced choice: "Which layer broke?" The
explanation then replays the request.

### Idea 3 — The Budget Receipt (rank 3)

**The idea.** Every lesson ends with a receipt: input tokens, output tokens, dollars per 1k
requests and p95 latency. Every tradeoff becomes money.

**Why the alternatives cannot copy it fast.** Per-layer cost attribution is unusual in course
form. The book treats cost as one topic, not a meter on every page. A lone calculator is trivial
to copy.

**Risk.** It reads as a toy, and AI cost content is common. It differentiates weakly alone.

**On-screen proof.** A receipt strip that updates when the reader changes chunk size or cache
policy.

**Ranking logic.** Idea 1 fits a 1–2 day build: content, layout and fixed arithmetic. Ideas 2
and 3 work as mechanics inside it.

## 3. Primary differentiator and signature moment

**Pick: the Eval Spine.** It answers the gap that stage 1 already found: text-first delivery,
one continuous project, visible progress. It needs no backend and no live call. It turns
progress into system improvement. Educative can add a project track. It cannot turn every lesson
into one artifact without a new catalog model.

**Signature moment: "The Run".**

1. The visitor lands on one request trace. Six stages sit on one hairline: prompt, context,
   model call, tool loop, tuning data, serving. A scoreboard reads: pass 41%, $0.94 per 1k
   requests, p95 2.8 s. Every stage carries a fault mark.
2. The visitor clicks the red retrieval node and opens its lesson.
3. The visitor reads the diagnosis, runs the check and applies the fix.
4. The visitor returns to the spine. The node is green. Pass 58%. Cost $0.71. One dot runs the
   repaired edge in 600 ms.
5. The visitor remembers one thing: "I fixed a layer and the number moved."

Numbers change only at fixed steps, from typed sample data. Keep the label "sample evaluation,
fixed data" visible. Two widgets serve this moment: the retrieval explorer and the cost and
latency calculator. The spine and scoreboard are layout, not a third widget.

## 4. Visual and interaction signature

Screenshots must read in one second. Apply these rules on every route.

- **Two voices.** Prose uses a warm serif. Technical text uses monospace with tabular numerals.
  Numbers line up in columns on every page.
- **Paper and ink.** Use a warm off-white base, near-black ink and 1 px hairlines. Use green,
  amber and red only for evaluation state.
- **The spine rail.** Keep a narrow fixed rail on the left with six stage dots on one hairline.
  The current stage is filled. On phone, the rail folds into a strip under the header.
- **Gutter annotations.** Put notes in the right margin with hairline leaders and bracket
  callouts. Number diagram ports.
- **Flat schematics.** Use 1 px strokes, square corners and mono uppercase labels. No gradients
  or shadows. State uses signal colors.
- **Code as evidence.** Show a filename header, inline annotation pins and a "sample output"
  ledger panel. Show before and after as a diff. Limit syntax color to three tokens.
- **One motion vocabulary.** "The trace runs": a dot travels an edge in 600 ms and numerals
  roll when values change. All motion obeys reduced motion. No parallax or scroll-jacking.

## 5. What to deliberately not build

- No video, audio or live tutor. The product is reading and diagnosis.
- No accounts, streaks, badges, points or certificates. The score is the reward.
- No catalog beyond the six lessons. Show later topics as plain roadmap text, not dead links.
- No live model calls, API keys or hidden network work.
- No second theme. One committed look is part of the signature.
- No third widget and no dashboard of charts.
- No chapter-by-chapter mirror. Use topic titles, cite the book once per lesson, and show the
  disclaimer in every lesson footer.

## 6. Anti-patterns to avoid

- **Generic dashboard.** Stat cards, donut charts and a KPI sidebar look like an admin panel.
  The spine is a trace.
- **Chatbot box.** A fake "ask the course" input promises nothing real and pulls focus from the
  lesson.
- **Card grid with no depth.** Six equal cards with icons hide the system. The landing page must
  show the artifact, not a menu.
- **Progress theater.** Rings, confetti and "level up" copy reward attendance. Replace them with
  the score.
- **Generic hero.** Gradient blobs, a floating 3D shape and a fake terminal are the visual
  default of every AI landing page.
- **Rainbow code.** Shadowed code cards and full syntax color read as a blog, not a tool.
- **Ornamental diagrams.** A diagram must carry one takeaway. State it in the caption.

## 7. Pitch

**One line.** Fix one broken AI feature in six sittings, and watch one eval score climb.

**Why this is not just another course.**

- Other courses show a working demo. This one starts with a failing system.
- Other courses mark chapters as read. This one moves a score for one real feature.
- Other courses sell breadth. This one owns six layers of one feature.

All content is original study material. lastminute.dev is independent and not affiliated with
the author or publisher of any referenced book.
