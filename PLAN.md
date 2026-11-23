# PLAN — lastminute.dev

## Product summary

lastminute.dev is a written, interactive course on AI engineering for software engineers who move
into AI. One small support-triage feature starts broken. Six lessons repair it, one layer at a
time. Each lesson follows one loop: Read, Check, Build, Prove. The reader repairs a layer, writes
one proof sentence, and sees one fixed sample score move. The demo is a static Next.js site with
no backend, no login and no live model call.

## Target user

Software engineers with 2–8 years in web or backend work. They know APIs, databases and
deployments. They are beginners in AI engineering. They want a mental model that maps to skills
they already have, worked examples they can copy, and numbers they can defend.

## Screens and features of the demo

| Route | Purpose | Key features |
| --- | --- | --- |
| `/` | Promise and start | Hero, run panel with fixed scores, six-node spine, mapping panel, lesson ledger, resume |
| `/lessons/[slug]` | Lesson reader | Outcome header, spine strip, sections, callouts, code with sample output, diagram, 2 checks (3 on the flagship), 5-step task, reference solution, prove note, mark layer repaired, prev/next, TOC |
| `/roadmap` | Full path and scope | Six lesson rows with state, four planned topics |
| `/about` | Method and independence | Disclaimer, method, citation policy, privacy note |
| 404 | Recovery | "This lesson does not exist.", links back |

Features: six lessons with real content; progress and resume in localStorage; the Eval Spine with
layer states and fixed sample numbers; retrieval explorer widget; cost and latency calculator
widget; responsive layout at 390, 768 and 1440 px; accessible keyboard flow; empty and error
states; optional client-side search (stretch).

## Tech stack

- Next.js (App Router) + TypeScript + Tailwind CSS, npm.
- Static output, deployable to Vercel with zero configuration.
- Content in typed static files; no database.
- Progress in localStorage under `lastminute.progress.v1` through one data-access module.
- No login, no API route, no external request, no secrets. Supabase is not used. The progress
  module is the seam for a later swap.

## Assumptions

- The course is original study material. It cites the book once per lesson as further reading and
  reproduces no text or figure. A disclaimer is visible in the footer and on `/about`.
- Six lessons and two widgets are enough to prove the product. Search is a stretch item.
- All numbers are fixed sample data and carry a visible label.
- The owner accepts the six topic titles and the short slugs in the PRD.
- Modern Chrome, Safari, Firefox and Edge, last two versions.

## Build waves

| Wave | Agent | Build unit | Owns |
| --- | --- | --- | --- |
| 6 | `foundation` | U0 | scaffold, config, tokens, layout, `lib/types.ts`, `components/ui/**`, content stub, one sample lesson, dev server |
| 7 | `build-content` | U1 | `content/**`: six lessons, scores, retrieval corpus, cost model, roadmap, validator |
| 7 | `build-progress` | U2 | `lib/progress/**`: storage, store, provider, selectors, provider mount |
| 8 | `build-widgets` | U3 | `components/widgets/**`: retrieval explorer, cost calculator, pure functions |
| 8 | `build-shell` | U4 | `components/shell/**`: header, footer, spine, banner, reset |
| 9 | `build-lesson` | U5 | `components/lesson/**`, `app/lessons/[slug]/page.tsx`, six lesson pages, 404 |
| 9 | `build-pages` | U6 | home, roadmap, about, 404 pages; `components/home/**`, `components/roadmap/**` |
| 10 | `qa-desktop` | U7 | build, console, 1440 px, every flow, fixes through owners |
| 11 | `qa-mobile` | U7 | 390 and 768 px, overflow, touch targets, empty states, fixes |
| 12 | `review` | U7 | every PRD acceptance criterion, final verdict |

## Build checklist

- [ ] U0 Foundation: scaffold, tokens, UI primitives, types, sample data, dev server running
- [ ] U1 Content: six lessons (flagship retrieval), layers, scores, 12 docs, 3 presets, cost model, validator
- [ ] U2 Progress: guarded localStorage, store, provider, selectors, hydration without mismatch
- [ ] U3 Widgets: retrieval explorer, cost calculator, pure functions, empty and invalid states
- [ ] U4 Shell: header, footer, spine, storage banner, reset, responsive chrome
- [ ] U5 Lesson: reader, checks, task, prove note, repair gate, TOC, position, six static pages, 404
- [ ] U6 Pages: home (promise, run panel, mapping, ledger), roadmap (74 minutes), about, 404
- [ ] U7 Quality: `npm run build`, `CONTENT_VALIDATE=1 npm run build`, zero console errors at 390/768/1440,
      PRD checklist passes, no secret, no external call
- [ ] Hand-off: README, CLAUDE.md, AGENTS.md, HARNESS.md, plain-words summary to the owner
