# Build guide (Agentty "Build my idea")

The owner of this project is not a developer. Your job: turn docs/idea/IDEA.md (and the attachments)
into a working demo they can see and click, ready to publish on Vercel.

## 0. Harness (first, once)
The right agents and skills raise the quality of everything after this, so set them up before
planning. They come from ECC (https://github.com/affaan-m/ECC, MIT), a library of agent, skill and
rule definitions. Agentty does not ship it: download it into this project now, take what this
product needs, and remove the download.
- Read the idea first. Then fetch ECC's definitions at the commit Agentty reviewed — exactly these
  commands, no other branch or version — without history or assets:
  `git init -q .agentty-ecc`
  `git -C .agentty-ecc remote add origin https://github.com/affaan-m/ECC.git`
  `git -C .agentty-ecc sparse-checkout set agents skills rules`
  `git -C .agentty-ecc fetch -q --depth 1 --filter=blob:none origin dd6ee538aee0f548d4a6b520118f875431fd749e`
  `git -C .agentty-ecc checkout -q FETCH_HEAD`
- Choose by file name and frontmatter description (do not read every file) what this product
  really needs: planning and architecture, the stack you will use (e.g. Next.js, React, Tailwind,
  Supabase/Postgres), code review, security review, build-error fixing, end-to-end testing, UI
  design. Fewer is better: about 4–8 agents, 5–10 skills and the few rules that fit.
- Install them in this project only: `agents/<name>.md` → `.claude/agents/`, a skill's `SKILL.md`
  and its other `.md` files → `.claude/skills/<name>/`, `rules/…/*.md` → `.claude/rules/`. With
  another agent CLI than Claude Code, use the project-level folders ECC's README names for it.
- Markdown only. Many ECC skills also ship scripts (`.sh`, `.py`, `.js`): leave those out and
  prefer skills that work without them. Never run ECC's installer or scripts, never copy hook
  definitions, MCP configs, settings or anything executable, and never install into the home folder.
- When you are done, `rm -rf .agentty-ecc`.
- Write docs/idea/HARNESS.md: the ECC commit (dd6ee538aee0f548d4a6b520118f875431fd749e), and each agent, skill and rule you
  installed with one line on why. Point to it from CLAUDE.md so later sessions use the harness.
- If the download fails (offline, git missing), go on without it and say so in PLAN.md.
From here on, work through the harness: delegate to these agents and apply these skills.

## 1. Plan (short)
- Write PLAN.md: one-paragraph product summary, target user, the pages/screens and features of the
  demo, the tech stack, assumptions you made, and a task checklist (`- [ ]`).
- Scope for a demo: the core flow working end to end with realistic sample data beats many
  half-finished features.

## 2. Stack (unless the idea clearly needs something else)
- Web app: Next.js (App Router) + TypeScript + Tailwind CSS. Simple landing page: the same, or
  Vite + React. Must build with `npm run build` and deploy to Vercel with zero configuration.
- Data: start with local sample data / in-memory or localStorage. If the product needs a real
  database or login, design the code so Supabase can be plugged in later (a small data-access
  module), and note it in PLAN.md.
- When Supabase is used: the 🚀 Launch button creates or picks the hosted project and writes its
  URL and public key to `.env.local` — read exactly `NEXT_PUBLIC_SUPABASE_URL` and
  `NEXT_PUBLIC_SUPABASE_ANON_KEY` (`VITE_…` with Vite) and list both names in `.env.example`. Put
  the schema in `supabase/migrations/<timestamp>_<name>.sql` (Launch applies them), enable row
  level security on every table with policies that fit the app, and never use or ask for the
  service_role key.
- This folder already contains `docs/` and `.claude/`. If a scaffolder refuses a non-empty folder,
  scaffold into a temporary subfolder and move the files up.
- Use npm. Never commit secrets: put keys in `.env.local` (gitignored) and document names in
  `.env.example`.

## 3. Show progress live
- Get a first screen running early: start the dev server in the background (e.g.
  `npm run dev -- --port 3000`, or the next free port) and open it in Agentty's in-app browser with
  the `browser_open` tool. Reload it (`browser_go` reload) after meaningful changes so the owner
  watches the product take shape.
- If the browser tools are not available, print the local URL clearly instead.

## 4. Orchestrate
- Split independent parts (e.g. separate pages, components, data layer, styling) and hand them to
  parallel subagents (Task tool) with clear file ownership and acceptance criteria. Keep shared
  pieces (layout, design tokens, types) with you and create them first.
- Review and integrate subagent work yourself; keep PLAN.md's checklist up to date.

## 5. Quality bar
- Polished, modern, responsive UI (mobile and desktop), real copy instead of lorem ipsum, empty
  and error states, accessible contrast and labels.
- Verify before calling it done: `npm run build` passes, the page has no console errors
  (`browser_console`), and a screenshot (`browser_screenshot`) looks right — at desktop width and
  at phone and tablet sizes (`browser_viewport` with `iphone-15-pro`, then `ipad-air`, then `off`).

## 6. Hand-off
- Write a short README.md (what it is, how to run it) and CLAUDE.md + AGENTS.md with the project
  conventions for future sessions.
- Tell the owner in plain words: what was built, how to try it, what could come next, and that the
  🚀 Launch button (Agentty) publishes it to the internet (GitHub + Vercel).
