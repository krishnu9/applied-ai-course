# Stage 2 — Concept: the smallest demo (simple angle)

This document defines the smallest demo that proves lastminute.dev end to end. The demo
removes breadth and keeps polish. It carries one complete learning flow. Every cut item
moves to the roadmap, so the product looks finished, not thin.

## 1. The one flow the demo must prove

A visitor lands on the home page, opens the flagship retrieval lesson, answers a check,
marks the lesson complete, and sees the saved progress after a reload.

If this flow works, the product works. Everything else is a bonus.

## 2. The minimum screen set

Four routes. Each route has one job.

| Route | Name | Purpose | What is on it |
| --- | --- | --- | --- |
| `/` | Home | State the promise and start the flow | Headline, one-paragraph promise, course tree with four rows (number, title, time, status), "Start lesson 1" button, roadmap link, footer disclaimer |
| `/lessons/[slug]` | Lesson reader | Deliver one lesson and capture progress | Outcome header, sections, code with sample output, one diagram on the flagship, check, build task, table of contents rail, previous and next, mark-complete button |
| `/roadmap` | Roadmap | Show the full curriculum and its boundary | Planned topics with labels, a note that the demo ships four lessons, and a suggested order |
| `/about` | About | State independence and method | Disclaimer, why the course exists, how content is written, who it serves |

Search is not a route. When it arrives, it is an overlay on the home page.

## 3. The minimum content set

The demo ships four lessons. One is the flagship. Three short lessons prove the same layout
works at a different length.

| Lesson | Length | Role |
| --- | --- | --- |
| Retrieval that earns its keep | About 2,000 words | Flagship; holds the diagram and the explorer widget |
| Evaluation you can trust | About 800 words | Proves the reader can measure a change |
| Prompt design as a contract | About 800 words | Proves a short lesson can still be complete |
| Cost and latency budget | About 800 words | Proves a numbers lesson reads well without a widget |

Every lesson contains:

- An outcome sentence and a reading-time label.
- Three to eight anchored sections.
- One code block with a filename, a copy button, and visible sample output. The output is
  precomputed and labelled "sample output".
- One check with three options and an explanation for each answer.
- One build task with a checklist and a hidden reference solution.
- One "Further reading" line that cites AI Engineering by Chip Huyen. The line quotes nothing.
- A footer disclaimer: the course is independent and not affiliated with the author or
  publisher.

The flagship also holds one diagram and two checks.

### Flagship outline: Retrieval that earns its keep

1. **The answer that sounds right.** A support bot makes a confident, wrong claim. The
   reader sees the failure before the fix.
2. **Retrieval in three stages.** Chunk, embed, rank. One diagram with a takeaway caption.
3. **Chunking sets the ceiling.** Fixed size, overlap, and structure-aware splits, plus a
   code block with sample chunks.
4. **Ranking and the top-k trap.** Scores, thresholds, and the cost of too much context.
5. **Assemble the prompt with citations.** Context order, citation labels, and the
   instruction that forbids unsupported claims.
6. **Measure retrieval before you tune the model.** The explorer shows a fixed query, ranked
   passages, and relevance labels. A check follows.
7. **Build task: add retrieval to a support bot.** Five checklist steps and a reference
   solution.
8. **Recap and the next lesson.** Three-line recap, glossary terms, link to evaluation.

The three short lessons follow the same shape with three to five sections. Each one keeps
the code block, the check, and the task.

## 4. The minimum data model

All content is typed files in the repository. No database.

- **Course:** product name, promise line, ordered list of lesson slugs, disclaimer text.
- **Lesson:** slug, order number, topic label, title, outcome sentence, reading time, card
  summary, key terms, sections in order, checks, one task, citation line.
- **Section:** anchor id, title, ordered list of blocks.
- **Block:** a type tag and its fields. Types are paragraph, list, code, callout, diagram,
  and widget. A code block holds filename, language, code text, sample output, and one
  output note. A callout holds a kind (note, warning, production tip) and text. A diagram
  holds an image reference, a caption, and alt text.
- **Check:** question, three options, correct option, and an explanation.
- **Task:** prompt, checklist items, and reference solution text.
- **Widget data:** fixed explorer rows. Each row holds a document title, passage, score, and
  relevance label.
- **Progress:** completed lesson slugs and the last open lesson. One module reads and writes
  this browser record.

## 5. The minimum interactions

| Interaction | When | Note |
| --- | --- | --- |
| Read sections and follow anchors | Day one | Static text and links |
| Table of contents with active section | Day one | Cheap with a scroll observer |
| Answer a check | Day one | Instant feedback plus explanation |
| Mark lesson complete | Day one | One button, one saved flag |
| Previous and next lesson | Day one | Order comes from the course file |
| Home progress bar and lesson ticks | Day one | Reads the progress record |
| Progress survives reload | Day one | localStorage through one module |
| Retrieval explorer | Day one | Click or tap a row to highlight its passage |
| Search overlay | Later | The first cut if time runs short |
| Keyboard next and previous | Later | Small gain for the effort |
| Resume scroll position | Later | Nice, not proof |
| Cost and latency calculator | Later | The second widget; the numbers lesson stands without it |

## 6. What is cut, and why the proof stays strong

- **Two of the six planned lessons.** Agents and fine-tuning move to the roadmap. Four
  lessons prove the path, the reader, and progress. Six would add words, not evidence.
- **The second widget.** The explorer already proves that a widget can live in a lesson.
- **Search.** It is a convenience, not the flow. A clean roadmap is a better use of the time.
- **Backend and login.** Progress in localStorage proves the loop with no account. The
  data-access module keeps the Supabase door open.
- **Live model calls and code execution.** Outputs are precomputed and labelled. The build
  stays deterministic and needs no API key.
- **MDX and a CMS.** The typed block model gives a small renderer and a predictable build.

Each cut removes surface area, not a step from the one flow.

## 7. Build order

Five steps. Each step ends with something visible in the browser.

1. **Shell and home.** Create the Next.js app with Tailwind and design tokens. Add the
   layout, header, footer, and a static course tree. You see a clean home page.
2. **Model and one lesson.** Add typed lesson files and the lesson route. Render paragraphs,
   lists, and one code block. You see one lesson read cleanly.
3. **The full content set.** Write all four lessons. Add checks, tasks, citation lines, and
   the flagship diagram. You see the complete path with previous and next links.
4. **Progress and checks.** Add the check widget, the mark-complete button, the home
   progress bar, and the localStorage module. You see progress stay after a reload.
5. **Flagship polish.** Add the retrieval explorer, active table of contents, mobile code
   scrolling, error states, and disclaimer. You see the flagship work at phone
   width. Then run the build and check the console.

## 8. Definition of done

- The home page lists four lessons with progress, and the ticks survive a reload.
- Each lesson shows sections, one code block with labelled sample output, one check with an
  explanation, one task, and the citation line.
- The flagship shows its diagram and the explorer; the explorer works with mouse, keyboard,
  and touch, and sends no network request.
- A wrong check answer explains the mistake; a correct answer confirms it.
- Previous and next work at both ends; `/roadmap` and `/about` load with no broken link.
- `npm run build` passes, the console is clean, the layout holds at 390px and 1440px, and
  no secret or external API call exists in the repository.
