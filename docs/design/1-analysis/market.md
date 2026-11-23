# Market analysis: lastminute.dev

## Scope

This document covers the market for a written, interactive course on the chapters of
"AI Engineering" by Chip Huyen. It answers four questions. How do readers learn this
material today? Who else serves them? What does a strong chapter page contain? Where can
this product differ?

## 1. How readers learn this material today

### The book

"AI Engineering" is a linear text. One author gives one full argument, with figures and
code snippets. The reader moves from page one to the last page. The book has no runnable
code, no progress state and no feedback loop. Depth is high. Practice is low. The reader
cannot search by build task.

### Video courses

DeepLearning.AI publishes short courses. Each course runs one to two hours and pairs a
video with a notebook. Coursera hosts longer courses with quizzes and graded work. Both
formats are video-first. The reader watches, then copies code. Pace control is weak. Search
inside a video is poor.

### Text-first course platforms

Educative publishes text lessons with embedded code runners and quizzes. Lessons sit
inside learning paths. The reader scrolls, edits code in the browser and answers questions.
This shape fits a written AI engineering course best.

### Cohort courses

Maven runs live, time-bound courses. A small group attends sessions, builds a project and
gets instructor feedback. The reader pays for accountability and access. The format does
not scale down to a free reference.

### System design sites

systemdesignschool.io, ByteByteGo and DesignGurus publish written lessons with diagrams
and case studies. They frame content for interviews. They show that readers respond to
clear diagrams and a stable chapter structure.

### YouTube and newsletters

YouTube gives free long-form explainers. Newsletters such as Chip Huyen's own, Latent
Space, The Batch and Ahead of AI give periodic essays. Neither gives a curriculum, a
progress trail or checks.

### Documentation and internal onboarding

Framework docs (OpenAI and Anthropic cookbooks, LangChain, LlamaIndex) are task-oriented
reference. Internal wikis are private and company-specific. Both assume the reader already
knows what to build.

## 2. Named alternatives

These products exist. This document asserts no prices and no user counts.

| Product | What it is | Format | Strength | Gap we can fill |
| --- | --- | --- | --- | --- |
| AI Engineering (book, O'Reilly) | Reference book by Chip Huyen | Linear text, figures, code snippets | Authoritative, coherent, one voice | No practice, no runnable code, no progress; not a build guide |
| Educative | Text-first course platform | Scroll lessons, in-browser code, quizzes, paths | Interactive text, low friction | Broad catalog; few courses carry one project through evaluation, retrieval and finetuning |
| DeepLearning.AI | Short-course publisher | One-to-two-hour video plus notebook | Practitioner instructors, free access | Passive video; each course is narrow; no continuous curriculum |
| Maven | Cohort course platform | Live sessions, projects, peer feedback | Accountability and feedback | Cost and schedule; not self-paced; no free reference layer |
| systemdesignschool.io / ByteByteGo | Written system design education | Lessons, diagrams, case studies, interview framing | Diagram clarity and structure | Classic backend focus; AI concerns such as evaluation and token cost get less depth |
| Coursera | Course marketplace | Multi-week video, quizzes, assignments, certificates | Credential and structure | Video-first; fragmented across universities; slow to update |

### Read of the table

No named product combines three things. The three are text-first delivery, one continuous
AI engineering project and visible per-chapter progress. Educative is closest in form.
DeepLearning.AI is closest in topic. systemdesignschool.io is closest in visual craft.

## 3. The shape of a strong chapter page

- **Header:** chapter number, title, one-line outcome, time estimate and prerequisite links.
- **Left rail:** course tree with the current chapter marked and completion ticks.
- **Body:** short sections with anchor headings. One idea per section.
- **Callouts:** note, warning and production-tip blocks.
- **Diagrams:** one custom diagram per hard concept. The caption states the takeaway.
- **Code:** filename, copy button, syntax highlight and expected output.
- **Inline check:** one question per concept. Instant feedback with a short explanation.
- **Chapter project:** a scoped task, a checklist and a reference solution.
- **Right rail:** table of contents with scroll tracking and a progress ring.
- **Footer:** recap, glossary links, further reading, previous and next.
- **State:** progress and last position in localStorage. The reader resumes on return.
- **Keyboard:** next and previous shortcuts. Search covers all chapters.
- **Mobile:** single column, sticky progress bar. Code scrolls inside its own box.

The page must work without login. The page must show value in the first screen.

## 4. Positioning

**One sentence:** lastminute.dev turns each chapter of AI Engineering into a written,
buildable lesson with runnable examples, checks and visible progress.

### What it must not be

- **Not a clone of the book.** It must paraphrase, cite and add practice. It must not
  reproduce the text.
- **Not a video course.** Text is the primary medium. Video, if any, is optional support.
- **Not a link list.** Each page must teach one outcome. A resource dump has no outcome.
- **Not an interview-question bank.** The frame is the build, not the interview.
- **Not a chatbot wrapper.** A chat box cannot replace a structured lesson.

## 5. Differentiation, ranked by realism for a demo

1. **Chapter as a build unit (high).** Each page ends in a small artifact the reader can
   inspect.
2. **Progress and resume (high).** localStorage gives state with no login.
3. **Inline checks with explanations (high).** Static data gives instant feedback.
4. **Step-through code with precomputed output (medium-high).** No live API keys are
   needed.
5. **Interactive evaluation playground (medium).** A slider changes a sample result and the
   chart updates.
6. **Cost and latency calculator (medium).** A fixed formula uses sample prices. The page
   labels them as samples.
7. **Diagram-first explanations (medium).** One custom SVG per hard concept.
8. **Glossary with cross-links and recall cards (medium-low).** Needs a mature content set.
9. **Role-based paths (low).** Needs many chapters.
10. **Community and cohort features (low for a demo).** These need real users.

Items one to five fit one build pass. Items six to eight fit a second pass.

## 6. Assumptions

- We assume the reader knows Python and basic machine learning.
- We assume the reader prefers text that they can skim and search over video.
- We assume the owner will write original explanations and cite the book. The owner will
  not copy the book.
- We assume the demo needs three to four chapters with full treatment, not every chapter.
- We assume sample data and precomputed model output show the product well enough.
- We assume no login, no payment and no database in version one.
- We assume chapter titles and the mapping to the book are provisional.
- We assume free competitors set the quality bar. The demo must match their craft.
- We assume Vercel static hosting is sufficient for the demo.
- We do not know demand, price or conversion. This document states no such number.
