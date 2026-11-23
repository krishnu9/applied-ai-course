# lastminute.dev — project guide for agents

Read `PLAN.md` and `docs/design/` before a change. The design set is the contract:
`1-analysis.md`, `2-concept.md`, `3-prd.md`, `4-hld.md`, `5-lld.md`.

## What this is

A static Next.js course. One broken support-triage feature, six lessons, one repair per lesson.
Each lesson runs Read → Check → Build → Prove. Progress lives in localStorage. No backend, no
login, no live model call.

## Commands

- `npm run dev` — dev server on http://localhost:3000.
- `npm run build` — must pass before any hand-off.
- `npm run lint` — ESLint.
- `npx tsc --noEmit` — type check.

## Conventions

- App Router, server components by default. Add `"use client"` only to stateful leaves listed in
  `4-hld.md`.
- TypeScript strict. No `any` on public types. Content and progress types live in one shared
  module.
- Tailwind with the design tokens in `app/globals.css`. No raw hex values in components.
- Content is typed static data. Components never read `localStorage` directly; they use the
  progress module.
- Every dynamic number is fixed sample data and carries a visible label.
- Keep the ASD-STE100 voice: short sentences, active voice, no contractions.
- The course is independent. Keep the disclaimer in the footer and on `/about`. Cite the book once
  per lesson. Never reproduce book text or figures.

## Harness

`docs/idea/HARNESS.md` lists the installed ECC agents, skills and rules. Use `planner` and
`code-architect` before a multi-file feature, `typescript-reviewer` and `react-reviewer` after
code changes, `security-reviewer` for any input or storage code, `a11y-architect` for UI, and
`react-build-resolver` when the build breaks. Skills: `frontend-design-direction`,
`design-system`, `nextjs-turbopack`, `react-patterns`, `browser-qa`, `accessibility`,
`article-writing`, `seo`.
