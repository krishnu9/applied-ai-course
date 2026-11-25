# lastminute.dev — project guide for agents

Read `README.md`, `PLAN.md` and `docs/content/COURSE-BRIEF.md` before a change. The course has 24
lessons in 10 chapters. The brief is the authoring contract; the design set in `docs/design/` is
the original product contract.

## What this is

A static Next.js course on AI engineering for interview preparation. Each lesson teaches a topic
in plain technical English, adds two or three ELI5 sections with analogies, one static diagram,
and a four-question interview corner. A support-triage product supplies the evaluation layer:
checks, a five-item task, a proof note and a repair gate. Eight flagship lessons have one
interactive lab.

## Commands

- `npm run dev` — dev server on http://localhost:3000.
- `npm run build` — must pass before any hand-off.
- `npm run lint` — ESLint.
- `npx tsc --noEmit` — type check.
- `CONTENT_VALIDATE=1 npm run build` — content identity and structure checks.
- `COURSE_FINAL=1 CONTENT_VALIDATE=1 npm run build` — full 24-lesson template checks (terms, ELI5
  sections and floor, diagrams, checks, task, interview, citation, word budgets).

## Conventions

- App Router, server components by default. Add `"use client"` only to stateful leaves.
- TypeScript strict. The only shared types live in `lib/types.ts`; the course registry
  (`lib/course-registry.ts`) owns slugs, order, chapters, flagships and capstone stages.
- Content is typed static data under `content/lessons/`. One file per lesson. Never hardcode
  lesson counts, minutes or scores in components.
- `components/ui/**` is a leaf. Each module is imported through its `index.ts`.
- Progress lives in `lib/progress/` and is the only code that touches localStorage. The key is
  `lastminute.progress.v2`; v1 migrates on read.
- Tokens only. No raw hex outside the `:root` block in `app/globals.css`.
- Every dynamic number is fixed sample data and carries a visible label.

## Content rules

- Original text only. Topics may follow the book; never copy its sentences, figures or chapter
  structure. One citation line per lesson.
- The triage case is application and evaluation. It must not become the teaching voice.
- Terms come from `docs/content/GLOSSARY.md`; one term, one spelling.
- Follow `COURSE-BRIEF.md`: 12 parts, 2–3 ELI5 sections with a "where it breaks" line, one static
  diagram, flagship-only interactive, 4–6 checks, five task items, four interview questions.
- Keep the independent disclaimer in the footer and on `/about`.

## Harness

`docs/idea/HARNESS.md` lists the installed ECC agents, skills and rules. Use `planner` and
`code-architect` before multi-file work, `typescript-reviewer` and `react-reviewer` after code
changes, `security-reviewer` for input or storage code, `a11y-architect` for UI, and
`react-build-resolver` when the build breaks.
