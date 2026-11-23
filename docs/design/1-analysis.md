# Stage 1 — Idea analysis (combined)

Sources: `1-analysis/users.md`, `1-analysis/market.md`, `1-analysis/feasibility.md`.
The stage combines the three parts. It records the open questions and the answer assumed for each.

## 1. The idea in one paragraph

lastminute.dev is a written, interactive course on AI engineering topics. The owner wants a
course shaped like educative.io and systemdesignschool.io, covering the material of the book
"AI Engineering" by Chip Huyen. The product turns each chapter topic into one buildable lesson.
Each lesson has its own explanation, a runnable example with visible output, a diagram, checks
with explanations, and a small build task. The reader sees progress and resumes later.

## 2. Who has the problem

Four segments exist. The demo serves the first one.

| Segment | Who | Level | Wants |
| --- | --- | --- | --- |
| A. Software engineers moving into AI | 2–8 years in web or backend work | Strong software, beginner AI | A mental model that maps to known skills; build and debug features |
| B. PMs and technical founders | Own a roadmap or a company | Low coding | Enough depth to judge scope, cost and quality |
| C. Students and career switchers | Final-year CS, bootcamps, analysts | Python, no production work | A fixed path with exercises, answers and work to show |
| D. Data scientists | Work in notebooks | Strong modelling, weak serving | The bridge from model metric to product result |

Segment A comes first. The book addresses people who build applications with foundation models.
Engineers turn reading into code fast, so the demo can show code, diagrams and exercises at full
strength. A page that satisfies engineers stays honest for other segments. No separate product
exists for segments B to D.

### Jobs to be done (segment A)

- When I ship a feature that calls a model, I want to know which layer fails, so I can fix the right layer.
- When I read about retrieval, I want a worked example with code and data, so I can copy the pattern.
- When my manager asks for an estimate, I want the cost and latency levers, so I can defend a number.

### Pains, with symptoms

| Pain | Symptom |
| --- | --- |
| The book is dense | The reader stops after two chapters; the tab stays open for weeks |
| Blog code is a toy | The snippet fails on real data; it skips chunking, retries and cost limits |
| Tutorials chain five tools | The reader cannot tell which part failed |
| Evaluation gets one paragraph | The reader ships and cannot say if the system improved |
| No feedback loop | The reader cannot check understanding and forgets the chapter |
| Cost surprise | The demo works; the bill at real traffic is far above the estimate |
| Mobile reading breaks | Code blocks scroll sideways; the reader gives up on the train |
| Terminology drift | "Agent", "tool" and "retrieval" mean different things in each post |

## 3. How readers learn today

| Alternative | Format | Strength | Gap |
| --- | --- | --- | --- |
| The book (O'Reilly) | Linear text, figures, snippets | Authoritative, one voice | No practice, no runnable code, no progress |
| Educative | Scroll lessons, in-browser code, quizzes, paths | Interactive text, low friction | Broad catalog; few courses carry one project through |
| DeepLearning.AI | One-to-two-hour video plus notebook | Practitioner instructors | Passive; narrow; no curriculum |
| Maven | Live cohort, projects, feedback | Accountability | Cost, schedule, not self-paced |
| systemdesignschool.io / ByteByteGo | Written lessons, diagrams, case studies | Diagram clarity and structure | Classic backend focus; AI evaluation and cost get less depth |
| Coursera | Multi-week video and quizzes | Credential and structure | Video-first, fragmented, slow to update |

No named product combines three things: text-first delivery, one continuous AI engineering
project, and visible per-chapter progress. Educative is the closest in form. DeepLearning.AI is
the closest in topic. systemdesignschool.io is the closest in visual craft. These three set the
quality bar.

### What a strong lesson page contains

Header with outcome and time; course tree with completion ticks; short anchored sections; note,
warning and production-tip callouts; one diagram per hard concept with a takeaway caption; code
with filename, copy button and visible output; an inline check per concept with an explanation; a
scoped build task with a checklist; a right rail with the table of contents and scroll tracking;
a footer with recap, glossary and next; saved progress and last position; keyboard next and
previous; single-column mobile with code scrolling inside its own box.

## 4. What is feasible and what is risky

The BUILD_GUIDE stack fits: Next.js App Router, TypeScript, Tailwind CSS, npm, Vercel with zero
configuration. A course is mostly text and layout. The demo needs no database, no login, no
secret and no external API. Zero configuration forbids background jobs and runtime secrets, so
every widget is local and deterministic.

Copyright is the main external risk. We may publish our own explanations, examples, code,
exercises and diagrams. We may not publish chapter text, book figures, long excerpts or a
lightly reworded version. Naming and framing rules:

1. Use the product name lastminute.dev, not the book title.
2. Organize the course by topic, not by a one-to-one chapter list.
3. Add a visible disclaimer: the course is independent and not affiliated with the author or publisher.
4. Cite the book once per lesson as further reading. Do not quote it.

Build risk, highest first: lesson content quality; interactive widgets; custom diagrams; search;
reading experience; code blocks; progress tracking. Mitigations: limit scope, use one outline,
review facts, keep two widgets at most, use design tokens in diagrams, build one lesson layout.

Agreed trade-offs:

| Decision | Choice | Reason |
| --- | --- | --- |
| Content storage | Static typed files in the repository | Zero configuration, versioned, no latency |
| Rendering | Server components with static output | Fast first load, less client JavaScript |
| Interactivity | Small isolated client components | Only widgets need state |
| Progress | localStorage through one data-access module | No login or row level security; Supabase can replace it later |
| Coverage | 4–6 excellent lessons plus a roadmap | One complete flow beats many thin chapters |
| Content format | Typed block model, not MDX | Small renderer, predictable build |

## 5. Open questions and assumed answers

| Open question | Answer assumed for this build |
| --- | --- |
| Which audience first? | Software engineers moving into AI. |
| How many lessons in the demo? | Six, one complete path, plus a visible roadmap of later topics. |
| Which topics? | Evaluation, prompt engineering, retrieval (RAG), agents and tools, fine-tuning, inference cost and latency. |
| Is there a backend or login? | No. Static content and localStorage. Supabase is not used. |
| How is content stored? | Typed TypeScript data files with a block model. |
| Is live model output used? | No. Outputs are precomputed and labelled as sample output. |
| Are exercises graded? | No. Checks give instant feedback with an explanation; build tasks show a reference solution. |
| Which product name and frame? | lastminute.dev; independent study notes on AI engineering; topic-based titles. |
| Is search in scope? | Yes, a simple client-side search over titles, summaries and key terms. It is the first feature to cut if time runs out. |
| Which widgets are in scope? | Two: a retrieval result explorer and a cost and latency calculator, both with fixed sample data. |
| How is progress defined? | A lesson is complete when the reader reaches the end or marks it complete; progress is saved locally. |
| What is the success of the demo? | A visitor lands, picks a lesson, reads it, runs a check, marks it complete, and sees progress persist after reload. |

## 6. What stage 2 must decide

Stage 2 turns this analysis into one concept. It must choose the value angle, the differentiating
angle and the smallest demo. It must keep these constraints: segment A, six lessons, no backend,
static content, two widgets, and the copyright framing above.
