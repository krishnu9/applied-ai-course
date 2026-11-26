# lastminute.dev

A written course on AI engineering for software engineers who prepare for interviews.

24 lessons across the ten chapters of *AI Engineering* by Chip Huyen, grouped into ten chapters.
Each lesson explains one topic in plain technical English, adds two or three ELI5 sections with
analogies, one static diagram, and a four-question interview corner. A support-triage product runs
through the course. The reader repairs it and uses it as the evaluation layer: checks, a five-step
task, and one written proof sentence.

Eight flagship lessons add an interactive lab: judge bias, model arena, prompt injection, context
budget, retrieval ranking, agent trace, LoRA memory, and serving budget.

Independent study notes. Not affiliated with the author or publisher. No book text or figure is
reproduced.

## Try it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build

```bash
npm run build
```

Next.js server build for Vercel. The landing page is public. Lessons, roadmap and about require
sign-in.

## Authentication and data

- Supabase Auth, email magic link only. No passwords.
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are the only variables. Never use
  the service-role key in this app.
- Apply `supabase/migrations/20261126120000_progress.sql` in the Supabase SQL editor. It creates
  `lesson_progress` and `progress_meta` with row-level security.
- In Supabase Authentication → URL Configuration, allow:
  `http://localhost:3000/auth/callback`,
  `https://applied-ai-course.vercel.app/auth/callback`, and the preview callback pattern.
- Progress is written locally first, then synced per lesson. Signing out clears the local copy;
  reset removes both copies.

## Verify content

```bash
COURSE_FINAL=1 CONTENT_VALIDATE=1 npm run build
```

This checks all 24 lessons against the course contract: chapter and order, terms, two or three
ELI5 sections with analogies, one static diagram, flagship-only interactive blocks, 4–6 checks,
a five-item task, four interview questions, citation, word budgets and the ELI5 floor.

## What is inside

- Ten chapters: the AI stack; foundation models; evaluation methodology; evaluating systems;
  prompt engineering; RAG and agents; fine-tuning; dataset engineering; inference optimisation;
  architecture and feedback.
- Every lesson: outcome and terms, definition, two ELI5 sections, mechanism with a diagram,
  failure table, triage case, concept checks, evaluation task, proof note, interview corner.
- Six capstone evaluation stages with fixed sample scores.
- Progress, per-check answers, task ticks and notes in localStorage, with migration from v1.
- Account required. Progress, checks, task ticks and notes sync to the account and are cached in
  the browser. No live model call.

## Stack

Next.js App Router with server rendering, TypeScript, Tailwind CSS, Supabase Auth and Postgres,
npm. Two public environment variables. Row-level security is the authorization boundary.

## Documents

- `docs/content/COURSE-BRIEF.md` — authoring contract and lesson template.
- `docs/content/GLOSSARY.md` — one term and one spelling per concept.
- `docs/content/COVERAGE.md` and `docs/content/reviews/coverage-audit.md` — book coverage.
- `docs/content/BOOK-INVENTORY.md` — interview-core concept inventory.
- `docs/content/reviews/` — pilot, desktop QA, mobile QA and coverage reviews.
- `docs/design/` — the original analysis, concept, PRD, HLD and LLD.
- `PLAN.md`, `CLAUDE.md`, `AGENTS.md`, `docs/idea/HARNESS.md`.
