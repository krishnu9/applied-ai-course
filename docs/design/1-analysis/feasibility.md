# Feasibility Analysis: lastminute.dev

Stage 1 analysis of constraints, content risk, build risk, trade-offs, and assumptions.
This is risk guidance, not legal advice.

## 1. Hard constraints from BUILD_GUIDE

| Constraint | Requirement | Effect |
| --- | --- | --- |
| Framework | Next.js App Router, TypeScript, Tailwind CSS | Fits a content site well. |
| Package manager | npm | No extra setup. |
| Build | `npm run build` must pass | Valid types and static data on every page. |
| Deploy | Vercel, zero configuration | No custom build step. No server-only service. |
| Data | Local sample data first | Lesson content lives in the repository. |
| Database | Supabase only if needed | Not needed. See section 4. |
| Secrets | `.env.local`, names in `.env.example` | The demo needs none. |
| Quality bar | Responsive, real copy, empty and error states, no console errors | Applies to every route. |
| Verification | Build, console check, screenshots at three widths | Add each check to the task list. |

The constraints fit a content site. The demo needs no database, login, or external API.
Zero configuration forbids runtime secrets. Keep all widgets local.

## 2. Content risk: copyright

The book "AI Engineering" by Chip Huyen is copyrighted. The publisher holds the rights.
We must not reproduce the book.

| We may publish | We may not publish |
| --- | --- |
| Our own explanation of each topic, in our own words | Chapter text, in full or in part |
| Our own examples, code samples, diagrams, and exercises | Book figures, tables, or screenshots |
| Short attributed quotations, used sparingly | Long excerpts, even with attribution |
| A statement that the book is a reference | A claim of affiliation or endorsement |

Naming and framing recommendation:

1. Choose an independent course name. Do not use the book title.
2. Organize by topic, not by chapter number. Use titles such as "Evaluation", "Retrieval", "Fine-tuning", "Inference", and "Deployment".
3. Describe the course as independent study notes. Name the book as a reference.
4. Add this disclaimer in the footer and on the about page: "This course is independent and is not affiliated with the author or publisher."
5. Cite the book once per lesson as further reading. Do not quote it.

The risk is manageable. Plan original content, a topic-based outline, and a disclaimer.
Do not add the book file.

## 3. Hard to build: ranked by risk

Ranking for a 1-2 day demo. Rank 1 is the top risk.

| Rank | Feature | Risk | Why | Mitigation |
| --- | --- | --- | --- | --- |
| 1 | Lesson content | High | Accurate, original text is harder than fluent text. Errors are hard to see. | Limit scope to 4-6 lessons. Use one outline. Review facts. |
| 2 | Interactive widgets | High | Each widget is a small app with state and edge cases. | Use at most 2. Client-only. No network. |
| 3 | Diagrams | Medium-high | Custom SVG needs care in both themes and at small widths. | Draw few diagrams. Test on phone. |
| 4 | Search | Medium | It needs an index, ranking, and keyboard support. | Use a build-time index or a topic filter. |
| 5 | Reading experience | Medium | It needs typography, a table of contents, and prev/next links. | Build one lesson layout. Reuse it. |
| 6 | Code blocks | Medium-low | Dark mode and horizontal overflow cause defects. | Use one library and one theme pair. |
| 7 | Progress tracking | Low | It needs only localStorage flags and a progress bar. | Mark a lesson complete on a button. |

Content authoring is the top risk. The quality bar demands real, correct copy.
Plan a facts review pass.

## 4. Trade-offs

| Decision | Option A | Option B | Choose | Reason |
| --- | --- | --- | --- | --- |
| Content storage | Static files in the repo | Database | Static files | Zero config, version control, no latency. |
| Page rendering | Server components | Client rendering | Server components | Fast first load. Less client JavaScript. |
| Interactivity | Small client components | Server only | Small client components | Only widgets need state. |
| Progress | localStorage | Supabase accounts | localStorage | No login or security work. |
| Coverage | 10 chapters, thin | 4-6 chapters, excellent | 4-6 excellent, plus a roadmap | BUILD_GUIDE asks for one complete flow. |

A lesson is a typed array of blocks: heading, paragraph, code, callout, diagram, and quiz.
One renderer serves every lesson. Use this model, not MDX. Keep a small data-access module for progress.

## 5. Risk table

| Risk | Impact | Likelihood | Mitigation |
| --- | --- | --- | --- |
| Copyright complaint or takedown | High | Medium | Own words, topic-based naming, disclaimer, no figures. |
| Lesson content is shallow or wrong | High | Medium | Limit scope. Review facts. Label the course as study notes. |
| Build fails on Vercel from configuration drift | High | Low | Keep the stock Next.js setup. Run `npm run build` locally. |
| Console errors from widgets or hydration | Medium | Medium | Keep widgets client-only and deterministic. Check the console. |
| Mobile layout breaks on code or diagrams | Medium | Medium | Use overflow containers. Test at phone width. |
| Scope creep past the time budget | High | High | Use a fixed checklist. Cut search first. |
| Accessibility gaps | Medium | Medium | Use semantic HTML, contrast tokens, focus states, and labels. |

## 6. Assumptions

1. The demo claims no link to the book, the author, or the publisher.
2. All lesson text is original. The agents have no access to the book and need none.
3. The reader is a software engineer with basic machine learning knowledge.
4. Four to six excellent lessons are enough. The other topics appear in a roadmap.
5. The demo has no login, payment, or email.
6. The deployment target is the Vercel free tier with static output.
7. All content fits in the repository and stays under a few hundred kilobytes.
8. All diagrams are our own SVG or CSS. No third-party image is used.
9. No runtime call goes to an external API. A widget uses fixed mock data.
10. The owner accepts the topic list from the plan.

## Verdict

The product is feasible for a 1-2 day agent-built demo.
Static content, server-rendered pages, and localStorage progress cover the core flow without a database.
The main risks are content quality and copyright framing. Both have clear mitigations.
Cut search and the second interactive widget first if time runs short.
