# AGENTS.md

Read `CLAUDE.md` first; it is the main guide. Read `docs/content/COURSE-BRIEF.md` before writing
or changing a lesson.

Short version:

- Stack: Next.js App Router, TypeScript, Tailwind CSS, npm. Static output for Vercel.
- Course: 24 lessons, 10 chapters, 6 capstone evaluation stages, 8 flagship interactive labs.
- Content: `content/lessons/` (one file per lesson), typed by `lib/types.ts`, registered in
  `lib/course-registry.ts`. No hardcoded counts in UI.
- Data: localStorage progress in `lib/progress/` (v2 key, v1 migrates). No backend, no login, no
  external API.
- Commands: `npm run dev`, `npm run build`, `npm run lint`, `npx tsc --noEmit`.
- Strict content gate: `COURSE_FINAL=1 CONTENT_VALIDATE=1 npm run build`.
- Harness: `docs/idea/HARNESS.md`.
- Rules: original text only; cite the book once per lesson; never copy book text or figures; keep
  the disclaimer in the footer and on `/about`; ELI5 sections never replace the explanation.
- Before hand-off: build passes, zero console errors, no horizontal scroll at 390/768/1440, no
  secret in the repository.
