# Project harness (ECC)

Source: https://github.com/affaan-m/ECC (MIT), commit `dd6ee538aee0f548d4a6b520118f875431fd749e`.
Installed for this project only, markdown only. No ECC installer, hook, MCP config or script was
used. The download folder was removed after installation.

Why this harness: the product is a Next.js + TypeScript + Tailwind content site. It needs UI
design judgment, React and TypeScript review, build-error recovery, accessibility, security
review, long-form writing help and browser QA.

## Agents (`.claude/agents/`)

| Agent | Why |
| --- | --- |
| `planner` | Plans feature work and refactors before a build wave. |
| `code-architect` | Turns a feature into a file-and-interface blueprint. |
| `typescript-reviewer` | Checks type safety, async correctness and web security in TS. |
| `react-reviewer` | Checks hooks, server/client boundaries and React security. |
| `security-reviewer` | Checks secrets, injection and OWASP Top 10 risks. |
| `react-build-resolver` | Fixes Next.js and React build errors with small diffs. |
| `a11y-architect` | Holds WCAG 2.2 AA for the design system and every page. |

## Skills (`.claude/skills/`)

| Skill | Why |
| --- | --- |
| `nextjs-turbopack` | Next.js App Router and dev-server guidance. |
| `react-patterns` | Hooks discipline, server/client boundaries, state choices. |
| `frontend-design-direction` | Product-specific visual direction, not a template look. |
| `design-system` | Tokens and visual consistency across screens. |
| `browser-qa` | Verify pages by browser interaction, not by reading code only. |
| `accessibility` | WCAG 2.2 AA checks for keyboard, contrast and screen readers. |
| `article-writing` | Long-form lesson voice and structure. |
| `seo` | Metadata, sitemap, structured data for a public course site. |

## Rules (`.claude/rules/`)

| Rule | Why |
| --- | --- |
| `common/coding-style.md` | Baseline style for readable code. |
| `common/security.md` | Baseline security rules for web code. |
| `common/testing.md` | Baseline testing expectations. |
| `react/coding-style.md` | React file and component conventions. |
| `react/patterns.md` | React composition and data-flow patterns. |
| `typescript/coding-style.md` | TypeScript style conventions. |
| `typescript/patterns.md` | TypeScript modelling patterns. |

Rules keep their `paths:` frontmatter and their relative links, so the folder layout mirrors
ECC's.
