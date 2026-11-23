# Stage 5 — Low-level design: `shell`

Binding: `4-hld.md` (tokens, layout, rendering) and `3-prd.md` (SCR-00, SCR-01, SCR-03, SCR-04,
shared layout, a11y). This document adds no colour, font, radius, shadow, package or route.

Assumptions:

1. The repository has no `package.json`. The U0 scaffold installs Tailwind CSS v4, so
   `globals.css` starts with `@import "tailwindcss";`. A v3 scaffold is not supported.
2. `SiteHeader` is a client component. US-02 needs `aria-current="page"` from the path, and only
   `usePathname()` supplies it. This adds no file.

## 1. Files

| File | Kind | Responsibility |
| --- | --- | --- |
| `app/layout.tsx` | server | Metadata, fonts, skip link, header, provider, main, footer |
| `app/globals.css` | stylesheet | Import, tokens, base layer, spine motion |
| `components/shell/{SiteHeader,SiteFooter,SkipLink,Spine,SpineNode,StorageBanner,HeaderProgress,ResetProgress,index}.tsx` | mixed | Chrome and spine |
| `components/ui/{Button,Badge,Panel,Prose,Rule,LiveRegion,EmptyState,index}.tsx` | server-safe | Leaf primitives; import `lib/cn` only |
| `app/page.tsx`, `components/home/**` | mixed | SCR-01 |
| `app/roadmap/page.tsx`, `components/roadmap/**` | mixed | SCR-03 |
| `app/about/page.tsx`, `app/not-found.tsx` | server | SCR-04, SCR-00 |

Each `index.ts` is the only public import path for its folder.

## 2. `app/globals.css`

Order: Tailwind import, token block, base layer, motion. The token block is verbatim from
`4-hld.md` section 8.

```css
@import "tailwindcss";

:root {
  --bg:#FAF8F4; --surface:#F3EFE8; --ink:#1A1815; --ink-muted:#5C574E;
  --hairline:#D9D3C7; --hairline-strong:#8A8271;
  --accent:#244A73; --success:#1E6B45; --warning:#8A5A00; --danger:#A32A1E;
  --focus:#244A73; --success-bg:#E7F0E9; --warning-bg:#F6EBD2; --danger-bg:#F6E4E1;
  --font-serif:"Source Serif 4",Georgia,serif; --font-mono:"JetBrains Mono",ui-monospace,monospace;
  --font-sans:"Inter",system-ui,sans-serif;
  --text-display:clamp(2.5rem,1.9rem+2.6vw,3.5rem); --text-h1:2.5rem; --text-h2:1.75rem;
  --text-h3:1.25rem; --text-body:1.125rem; --text-small:0.9375rem; --text-mono:0.875rem;
  --text-micro:0.6875rem; --lh-display:1.05; --lh-body:1.6; --measure:68ch; --tracking-micro:0.08em;
  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:16px; --space-6:24px;
  --space-8:32px; --space-12:48px; --space-16:64px; --space-24:96px;
  --radius-1:0px; --radius-2:1px; --radius-3:2px; --shadow:none;
  --ease-standard:cubic-bezier(.2,0,0,1); --dur-hover:120ms; --dur-panel:240ms;
  --dur-number:400ms; --dur-trace:600ms;
  --spine-w:88px; --toc-w:260px; --main-max:720px; --header-h:56px; --actionbar-h:56px;
}
@media (prefers-reduced-motion: reduce) { :root { --dur-hover:0ms; --dur-panel:0ms;
  --dur-number:0ms; --dur-trace:0ms; } }
```

```css
@layer base {
  body { min-height:100dvh; overflow-x:clip; background:var(--bg); color:var(--ink);
    font-family:var(--font-sans-loaded), var(--font-sans); font-size:var(--text-body);
    line-height:var(--lh-body); }
  h1,h2,h3 { font-family:var(--font-serif-loaded), var(--font-serif); font-weight:600;
    line-height:var(--lh-display); }
  code,pre,kbd,samp { font-family:var(--font-mono-loaded), var(--font-mono);
    font-variant-numeric:tabular-nums; }
  ::selection { background:var(--accent); color:var(--bg); }
  :focus-visible { outline:2px solid var(--focus); outline-offset:2px; }
  [id] { scroll-margin-top:calc(var(--header-h) + var(--space-4)); }
  @media (prefers-reduced-motion:reduce) {
    *,*::before,*::after { animation-duration:.01ms!important; transition-duration:.01ms!important;
      animation-iteration-count:1!important; scroll-behavior:auto!important; }
  }
}
@keyframes spine-trace { from { transform:translateY(-.75rem); opacity:0 }
  25% { opacity:1 } to { transform:translateY(0); opacity:0 } }
.spine-trace { animation:spine-trace var(--dur-trace) var(--ease-standard) both; }
@media (prefers-reduced-motion:reduce) { .spine-trace { animation:none; } }
```

Components use token arbitrary values such as `bg-[var(--surface)]` and
`text-[var(--ink-muted)]`. No `@theme` block is needed. Audit:
`rg -n "#[0-9A-Fa-f]{3,8}" app components` must match only the `:root` block.

## 3. `app/layout.tsx`

Server component. Font calls:

```tsx
const serif = Source_Serif_4({ subsets:['latin'], weight:['400','600'], display:'swap', variable:'--font-serif-loaded' });
const mono  = JetBrains_Mono({ subsets:['latin'], weight:['400','500'], display:'swap', variable:'--font-mono-loaded' });
const sans  = Inter({ subsets:['latin'], weight:['400','500','600'], display:'swap', variable:'--font-sans-loaded' });
```

`metadata` sets the title template `%s — lastminute.dev`, the default title
`lastminute.dev — Repair one broken AI feature. Watch the score climb.`, the description
`Six short lessons. One afternoon. No login.`, `applicationName` and `/favicon.svg`.

```tsx
<html lang="en" className={`${serif.variable} ${mono.variable} ${sans.variable}`}>
  <body className="bg-[var(--bg)] text-[var(--ink)] antialiased">
    {/* PROGRESS-PROVIDER:START — owned by lib/progress. Mount line only. */}
    <ProgressProvider>
      <SkipLink /><SiteHeader /><StorageBanner />
      <main id="main" tabIndex={-1} className="min-h-[60dvh]">{children}</main>
      <SiteFooter />
    </ProgressProvider>
    {/* PROGRESS-PROVIDER:END */}
  </body>
</html>
```

The provider wraps every consumer. The markers are the U2 edit point. One `main` exists, here
only. Render code never calls `Date.now`, `new Date`, `Math.random` or `crypto.randomUUID`.

## 4. UI primitives

No directive, no hook. A client parent may import them. All classes reference tokens.

| Component | Props | Markup and states |
| --- | --- | --- |
| `Button` | `React.ComponentPropsWithoutRef<'button'> & { variant?: 'primary'\|'secondary'\|'quiet'; size?: 'sm'\|'md' }` | `<button type="button">`, 44 px high, 2 px radius. Primary: accent fill. Secondary: strong hairline border. Quiet: accent text. Disabled sets `disabled`, `aria-disabled`, 40% ink. Exports `buttonStyles()` for `<Link>`. |
| `Badge` | `{ tone?: 'neutral'\|'success'\|'warning'\|'danger'; children; className? }` | `<span>` with the matching `-bg` token, 1 px border, tone ink, one word. |
| `Panel` | `{ as?: 'div'\|'section'\|'article'; tone?: 'surface'\|'paper'; labelledBy?: string; children; className? }` | Hairline border, surface fill, 16/24 px padding, no shadow. |
| `Prose` | `{ children; className? }` | Serif stack, body size, 1.6 line height, `max-w-[var(--measure)]`; spaces `p`, `ul`, `ol`. |
| `Rule` | `{ className? }` | `<hr role="presentation">`, `h-px border-0 bg-[var(--hairline)]`. |
| `LiveRegion` | `{ message: string; assertive?: boolean; className? }` | Mounted empty, then filled. `role="status"` or `"alert"`, `aria-live`, `aria-atomic="true"`, `sr-only`. |
| `EmptyState` | `{ title: string; body?: ReactNode; action?: ReactNode; headingLevel?: 2\|3; className? }` | Heading plus optional body and action slot. |

## 5. Spine

`Spine` is a client component. Props: `{ className?: string }`. It reads `useProgress`,
`usePathname`, `getLayers` and `getCourse`. It renders on home and lesson pages only.

`SpineNode` has no directive and lives inside the client boundary.

```ts
type SpineNodeProps = {
  layer: Layer; isRepaired: boolean; isCurrent: boolean; isStart: boolean;
  justRepaired: boolean; onTraceEnd: () => void;
};
```

State rules:

- Repaired when `state.lessons[layer.lessonSlug]?.status === 'repaired'`. Every other value,
  including `in-progress`, shows `Broken`.
- Current when `pathname === '/lessons/' + layer.lessonSlug`; the node gets
  `aria-current="page"`.
- Start when `layer.order === 3` (retrieval); the node shows `Start here`.

Formatting from `lib/format.ts`:

| Value | Input | Call | Output |
| --- | --- | --- | --- |
| Pass rate | `0.41` | `formatPercent` | `41%` |
| Cost per 1k | `0.94` | `formatUsd` | `$0.94 / 1k` |
| p95 | `2400` ms | `formatSeconds` | `2.4 s` |

Markup: `<nav aria-labelledby="spine-heading">` with hidden `<h2>Eval spine</h2>`, then `<ol>`,
then the visible micro label `Sample evaluation. Fixed data.` Each `<li>` holds one `<Link>` to
`/lessons/{slug}`. Link content: order `01`, name, state word, pass, cost, p95, optional
`Badge Start here`, optional trace dot. `sr-only` labels precede the scores (`pass rate`, `cost
per 1k requests`, `p95 latency`). The dot uses `--danger` or `--success`; the word carries the
state. Nodes are `flex min-h-11 flex-col gap-1 px-2 py-2`; scores use mono and `tabular-nums`.
Values come from `layer.baseline` or `layer.repaired`.

Trace hook: `Spine` keeps `previous: Set<LessonSlug>` and `seeded`. The first ready render only
seeds. A later ready render finds one newly repaired slug, sets `trace`, and clears it on
`onAnimationEnd`. Reduced motion sets `--dur-trace: 0ms` and clears the animation; the word and
numbers update at once. No information depends on the dot.

The score panel is `RunPanel` (home) and the node scores. Both show the same fixed label.

## 6. Header

`SiteHeader` is a client component. Props: `{ className?: string }`. States: route `/roadmap`,
route `/about`, other route; progress 0 to 6.

Semantics:

- `<header>` is sticky, 56 px high, opaque `--bg`, bottom hairline, `z-40`.
- Wordmark `<Link href="/">lastminute.dev</Link>` in serif, `--text-h3`.
- `<nav aria-label="Primary">` holds exactly two links: `Roadmap` to `/roadmap`, `About` to
  `/about`.
- Each link gets `aria-current="page"` on its own route. Each is `inline-flex min-h-11 min-w-11
  items-center px-2`.
- No Home link and no menu button. Two links do not need a menu at 390 px.
- `HeaderProgress` follows the nav, `shrink-0`.

`HeaderProgress` is a client component, `{ className?: string }`. It counts repaired entries and
reads the total from `getCourse().lessons.length`. Text: `N of 6 layers repaired`. Below 768 px
it shows `N/6` for sighted readers and the full text in `sr-only`. It has no live region, because
the first hydrate would announce the count.

## 7. Footer, skip link, banner, reset

`SkipLink` is a server component with no props. It is the first focusable item. It renders
`<a href="#main">Skip to content</a>`, hidden until focus, then fixed at the top left, 44 px high.
The label follows `3-prd.md` section 3.

`SiteFooter` is a server component, `{ className?: string }`. It renders `<footer>` with a top
hairline and three `<p>` lines:

1. `Independent study notes. Not affiliated with the author or publisher.`
2. `The book is cited once per lesson as further reading. No text or figures are reproduced.`
3. `© 2026 lastminute.dev` — a literal year, not a clock call.

`StorageBanner` is a client component, `{ className?: string }`. It reads
`storage === 'unavailable'`. The container is always mounted as `<div role="status"
aria-live="polite">`; it holds the message only in the failed state. Exact copy: `Progress
cannot be saved in this browser. You can still read every lesson.` It sits between header and
main, shows on every route, and has no dismiss control.

`ResetProgress` is a client component, `{ className?: string }`, on `/roadmap` only:
`<Button variant="quiet" size="sm" disabled={!ready || repaired === 0}>Reset progress</Button>`
with an `sr-only` note, `This removes all saved progress on this device.` A click calls
`reset()` and fills a `LiveRegion` with `Progress reset on this device.`

## 8. Pages

### Home (SCR-01)

`app/page.tsx` is a server component. DOM order: Hero, `HomeAction`, `RunPanel`, `Spine`,
`MappingPanel`, `LoopRow`, `LessonLedger`. Content sits in
`<div className="lg:pl-[var(--spine-w)]">`. One `h1`: `Repair one broken AI feature. Watch the
score climb.` Promise: `Six short lessons. One afternoon. No login.`

| Part | Status | Contract |
| --- | --- | --- |
| `HomeAction` | client | `role="group" aria-label="Course actions"`. Target: `lastLessonSlug`, else first unrepaired, else lesson 1. No saved lesson: `Start with lesson 1` → `/lessons/evaluation`. Saved lesson: `Resume lesson`, href plus `#${lastSectionId}`, visible `Resume: {title}`. Secondary `Fix retrieval first` → `/lessons/retrieval`. Quiet `See the roadmap` → `/roadmap`. |
| `RunPanel` | client | `Panel as="section"`, `h2 The run`, `h3 Triage 40 support tickets`, `Badge`, `<dl>` of `Pass rate`, `Cost per 1k requests`, `p95 latency`. Zero repairs: `Broken`, baseline 41%, $0.94 / 1k, 2.4 s, `No layers repaired yet. Start with retrieval.` Repaired: `N of 6 layers repaired`, `scoreSummary(repairedSlugs)` values. Label `Sample evaluation. Fixed data.` always. |
| `MappingPanel` | server | `h2 Mapping`; four links: `Eval set = test suite` → evaluation, `Retrieval = ranked cache` → retrieval, `Agent = loop with a stop rule` → agents, `Inference cost = load budget` → cost. |
| `LoopRow` | server | `h2 The loop`; `<ol>` Read, Check, Build, Prove. Arrows are `aria-hidden`. |
| `LessonLedger` | client | `h2 Lessons`; `<ol>` of six rows: number, title link, outcome, `{minutes} min`, state. States: `Repaired`, `In progress`, `Not started`. |

`scoreSummary` applies the lookup rule: highest repaired layer, else baseline. It does not sum.
Server HTML uses the frozen empty snapshot, so hydration matches.

### Roadmap (SCR-03)

`app/roadmap/page.tsx` is a server component with `h1 The path`. It renders `RoadmapIntro`,
`RoadmapAction`, `RoadmapTable`, `ResetProgress`.

- `RoadmapIntro` is server. It shows `Six lessons. 74 minutes in total.` The 74 comes from
  `reduce` over `readingMinutes`, never a literal. It adds `h2 Planned, not in this demo` and a
  `<ul>` of four topics from `getRoadmap()`, with no dates.
- `RoadmapAction` is client. It links to the first lesson not `repaired`, labelled `Continue at
  the first unfinished lesson`. When all six are repaired, the label is `All layers repaired`
  and the href is `#main`.
- `RoadmapTable` is client. It renders `<ol aria-label="Course lessons">`, not a `<table>`, so
  rows stack at 390 px. Row: number, title link, outcome, time, state. Mapping: `repaired` →
  `Done`, `in-progress` → `In progress`, else `Not started`.

### About (SCR-04)

`app/about/page.tsx` is server. One `h1`: `About this course`. `Prose` with `h2` sections:
`What this course is`, `Who it serves`, `The four-step loop`, `What is sample data`, `Citation
policy`, `Privacy`, `Independence`. It uses the exact disclaimer, the citation line, and
`Progress stays in this browser.` Stack line: `Next.js, TypeScript, Tailwind CSS, no backend, no
login, no live model calls.` Primary link: `Start lesson 1`.

### Not found (SCR-00)

`app/not-found.tsx` is server. One `h1`: `This lesson does not exist.` One sentence: `Check the
URL or open the roadmap.` Primary link `Open the roadmap` → `/roadmap`; secondary `Back to
course` → `/`. Header and footer remain. The export writes `out/404.html` with status 404.

Page metadata: roadmap `The path`, about `About this course`, not found `Not found`.

## 9. Responsive rules

Base is phone, `md:` is 768 px, `lg:` is 1024 px.

| Region | Phone | Tablet | Desktop |
| --- | --- | --- | --- |
| Content | one column, `px-4` | `px-6` | `px-8`, `max-w-[var(--main-max)]` |
| Spine | `grid grid-cols-3` (two rows) | `md:grid-cols-6` strip | `lg:fixed lg:left-0 lg:top-[var(--header-h)] lg:bottom-0 lg:w-[var(--spine-w)] lg:grid-cols-1 lg:border-r` |
| Page gutter | none | none | `lg:pl-[var(--spine-w)]` on the page wrapper |
| TOC | bottom sheet (lesson) | below content, 240 px | `lg:grid-cols-[minmax(0,1fr)_var(--toc-w)]` |
| Action bar | sticky, 56 px (lesson) | same | static |

The shell owns `--spine-w`, `--toc-w`, `--header-h` and `--actionbar-h`. The lesson page owns the
TOC and the action bar. Both use `min-w-0`. Code and tables scroll in `overflow-x-auto`
wrappers. `body { overflow-x: clip }` plus `min-w-0` stops page sideways scroll. Long words use
`break-words`. The site stays usable at 200% zoom.

## 10. Build units

SU-1 and SU-2 land in one branch; the build gate is SU-2, because the layout imports the chrome.

| Unit | Files | Depends on | Done line |
| --- | --- | --- | --- |
| SU-1 tokens, layout, primitives | `app/globals.css`, `app/layout.tsx`, `components/ui/**`, `components/shell/SkipLink.tsx`, `components/shell/index.ts` | U0 config, `lib/cn`, `lib/format`, U2 provider, Tailwind v4, `next/font` | Hex audit matches only `:root`; `lang="en"`, `#main` and both provider markers exist; skip link is the first Tab stop. |
| SU-2 chrome and spine | `SiteHeader`, `SiteFooter`, `Spine`, `SpineNode`, `StorageBanner`, `HeaderProgress`, `ResetProgress`, shell `index` | SU-1, `content.getLayers/getCourse`, `progress.useProgress` | Home shows six nodes, `0 of 6 layers repaired` and the fixed label; 390 px strip has two rows and no sideways scroll; a storage throw shows the banner; `npm run build` passes. |
| SU-3 home | `app/page.tsx`, `components/home/**` | SU-1, SU-2, content, progress | Hero and 41% show; six ledger rows render; primary opens `/lessons/evaluation`; after repair it reads `Resume lesson`. |
| SU-4 roadmap, about, 404 | `app/roadmap/page.tsx`, `app/about/page.tsx`, `app/not-found.tsx`, `components/roadmap/**` | SU-1 to SU-3, `getCourse/getRoadmap`, progress | 74 minutes, six rows, four topics and reset work; about shows the disclaimer; 404 copy is exact; build writes `out/roadmap/`, `out/about/` and `out/404.html`. |

## 11. Accessibility checklist

1. Skip link is first, targets `#main`, shows on focus, and is 44 px high.
2. Landmarks: `header`, `nav aria-label="Primary"`, one `main#main`, `contentinfo`, spine nav.
3. One `h1` per page; `h2` for sections; `h3` for panel titles; no skipped level.
4. `aria-current="page"` on the active header link and the current spine node.
5. State never relies on colour: `Broken`, `Repaired`, `Done`, `In progress`, `Not started`.
6. Contrast: ink 16.6:1, muted 6.7:1, accent 8.6:1, success 5.6:1, warning 5.1:1, danger 6.8:1.
7. Focus ring: 2 px `--focus`, 2 px offset, never removed; no `outline-none`.
8. Focus order follows the DOM: header, spine, main, footer. No positive `tabIndex`.
9. Touch targets are at least 44 by 44 px, including both header links.
10. Live regions mount before their message: `StorageBanner`, `LiveRegion`.
11. Reduced motion removes the trace dot and the number roll; text carries the change.
12. No horizontal page scroll at 390, 768 or 1440 px; usable at 200% zoom.
