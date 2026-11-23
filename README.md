# lastminute.dev

A short, written course on AI engineering for software engineers who move into AI.

One small support-triage feature starts broken. Six lessons repair it, one layer at a time. Every
lesson follows one loop: **Read → Check → Build → Prove**. You repair a layer, write one sentence
of proof, and watch one sample evaluation score move. Progress stays in your browser.

Independent study notes. Not affiliated with the author or publisher of "AI Engineering".

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

The static site is written to `out/`. It deploys to Vercel with zero configuration.

## What is inside

- Six lessons: Evaluation, Prompt design, Retrieval (flagship), Agents, Fine-tuning, Cost and latency.
- The Eval Spine: six layers with fixed sample scores (pass rate, cost per 1k, p95).
- Inline checks with explanations, a five-step build task with a reference solution, and a proof note.
- A retrieval explorer and a cost and latency calculator, both on fixed sample data.
- Progress and resume in localStorage. No login, no backend, no live model call.

## Stack

Next.js App Router, TypeScript, Tailwind CSS, npm. Static output. No environment variables.

## Design documents

`docs/design/1-analysis.md` → `2-concept.md` → `3-prd.md` → `4-hld.md` → `5-lld.md`.
The build plan is `PLAN.md`. Agent guidance is `CLAUDE.md` and `AGENTS.md`. The agent harness is
`docs/idea/HARNESS.md`.

## Content and rights

All lesson text, examples, code and diagrams are original. The book "AI Engineering" by Chip
Huyen is cited once per lesson as further reading. No text or figure from the book is reproduced.
