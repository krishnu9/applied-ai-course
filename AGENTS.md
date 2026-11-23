# AGENTS.md

This project uses `CLAUDE.md` as the main guide for agents. Read it first.

Short version:

- Stack: Next.js App Router, TypeScript, Tailwind CSS, npm. Static output for Vercel.
- Data: typed content files and localStorage progress. No backend, no login, no external API.
- Commands: `npm run dev`, `npm run build`, `npm run lint`, `npx tsc --noEmit`.
- Design contract: `docs/design/3-prd.md` (acceptance criteria), `docs/design/4-hld.md`
  (stack, modules, data, tokens), `docs/design/5-lld.md` (files, types, build units).
- Harness: `docs/idea/HARNESS.md`.
- Rules: keep the course original and cite the book once per lesson. Never copy book text or
  figures. Keep the disclaimer in the footer and on `/about`.
- Before hand-off: build passes, no console errors, layout holds at 390, 768 and 1440 px, no
  secret in the repository.
