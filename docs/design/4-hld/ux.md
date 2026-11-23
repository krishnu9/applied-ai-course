# Stage 4 — HLD: UX and design system

Scope: 4 routes, 404, one theme, no login. This part defines the visual system, the components,
the responsive layout and the motion rules. Stage 5 implements these tokens and specs.

## 1. Page map and layout

| Route | Screen | Layout | Contract |
| --- | --- | --- | --- |
| `/` | Home | `ShellLayout` | SCR-01 |
| `/lessons/[slug]` | Lesson reader | `ShellLayout` → `LessonLayout` | SCR-02 |
| `/roadmap` | Roadmap | `ShellLayout`, prose column | SCR-03 |
| `/about` | About | `ShellLayout`, prose column | SCR-04 |
| unknown path or slug | Not found | `ShellLayout`, empty state | SCR-00, status 404 |

`ShellLayout` renders SkipLink, Header, one `main`, Footer. `LessonLayout` adds the spine rail, the
content column, the Toc rail and the phone action bar. The 404 page keeps header and footer.

## 2. Design direction

The look is "paper and ink" with editorial-technical discipline. The base is warm off-white paper.
Text is near-black ink. Every rule is a 1 px hairline. Green, amber and red appear only for
evaluation state: repaired, warning, broken. No decorative color exists.

Prose uses a serif. Technical text, labels, filenames and numbers use monospace with tabular
numerals. The split carries meaning: the reader sees what is explanation and what is artifact.
Diagrams are flat schematics: 1 px strokes, square corners, uppercase mono labels, no gradients.

Reference aesthetics, not copied:

- **Stripe documentation** — hairline grids, restrained palette, code as a first-class object.
- **Increment magazine** — serif body text, numbered sections, generous margins, quiet rhythm.
- **Vintage assembler manuals** — mono uppercase micro labels, numeral tables, flat schematics.

Anti-patterns: dashboard cards, chatbot bubbles, equal card grids, gradient heroes, rainbow syntax
color, ornamental diagrams, parallax.

## 3. Design tokens

All values are custom properties on `:root`. Components use no other color literals.

```css
:root {
  /* Color */
  --bg:            #FAF8F4;  /* warm paper */
  --surface:       #F3EFE8;  /* raised paper block */
  --ink:           #1A1815;
  --ink-muted:     #5C574E;
  --hairline:      #D9D3C7;  /* decorative rules only */
  --hairline-strong: #8A8271; /* control boundaries */
  --accent:        #244A73;  /* links, primary action */
  --success:       #1E6B45;  /* repaired */
  --warning:       #8A5A00;  /* partial, "Not quite" */
  --danger:        #A32A1E;  /* broken */
  --focus:         #244A73;
  --success-bg:    #E7F0E9;
  --warning-bg:    #F6EBD2;
  --danger-bg:     #F6E4E1;

  /* Type */
  --font-serif: "Source Serif 4", Georgia, serif;
  --font-mono:  "JetBrains Mono", ui-monospace, monospace;
  --font-sans:  "Inter", system-ui, sans-serif;

  --text-display: clamp(2.5rem, 1.9rem + 2.6vw, 3.5rem); /* 40 → 56 */
  --lh-display: 1.05;
  --text-h1: 2.5rem;     --lh-h1: 1.1;
  --text-h2: 1.75rem;    --lh-h2: 1.2;
  --text-h3: 1.25rem;    --lh-h3: 1.3;
  --text-body: 1.125rem; --lh-body: 1.6;    /* 18 px */
  --text-small: 0.9375rem; --lh-small: 1.5; /* 15 px */
  --text-mono: 0.875rem; --lh-mono: 1.55;   /* 14 px */
  --text-micro: 0.6875rem; --lh-micro: 1.4; /* 11 px */
  --weight-regular: 400;
  --weight-semibold: 600;
  --tracking-micro: 0.08em;
  --measure: 68ch;

  /* Space: 4 px base */
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px; --space-4: 16px;
  --space-6: 24px; --space-8: 32px; --space-12: 48px; --space-16: 64px;
  --space-24: 96px;

  /* Shape */
  --radius-1: 0px; --radius-2: 1px; --radius-3: 2px;
  --border: 1px solid var(--hairline);
  --border-strong: 1px solid var(--hairline-strong);
  --shadow: none;

  /* Motion */
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --dur-hover: 120ms;
  --dur-panel: 240ms;
  --dur-number: 400ms;
  --dur-trace: 600ms;

  /* Layout */
  --spine-w: 88px;
  --toc-w: 260px;
  --main-max: 720px;
  --header-h: 56px;
  --actionbar-h: 56px;
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --dur-hover: 0ms; --dur-panel: 0ms;
    --dur-number: 0ms; --dur-trace: 0ms;
  }
}
```

Contrast, measured against `--bg` unless stated:

| Pair | Ratio | Requirement | Result |
| --- | --- | --- | --- |
| ink on bg | 16.6:1 | 4.5:1 body | pass |
| ink-muted on bg | 6.7:1 | 4.5:1 body | pass |
| accent on bg | 8.6:1 | 4.5:1 text, 3:1 line | pass |
| success on bg | 5.6:1 | 4.5:1 text | pass |
| warning on bg | 5.1:1 | 4.5:1 text | pass |
| danger on bg | 6.8:1 | 4.5:1 text | pass |
| hairline-strong on bg / surface | 3.5:1 / 3.2:1 | 3:1 boundary | pass |
| hairline on bg | 1.4:1 | decorative only | not a boundary |

The focus ring uses `--accent` at 2 px with 2 px offset. It passes 3:1 on bg and surface.

## 4. Typography

Fonts load with `next/font` at build time. No runtime request to Google.

```ts
// app/fonts.ts
import { Source_Serif_4, JetBrains_Mono, Inter } from "next/font/google";

export const serif = Source_Serif_4({
  subsets: ["latin"], display: "swap", variable: "--font-serif",
});
export const mono = JetBrains_Mono({
  subsets: ["latin"], display: "swap", variable: "--font-mono",
});
export const sans = Inter({
  subsets: ["latin"], display: "swap", variable: "--font-sans",
});
```

Apply all three variables to `<html className>`. Each family is variable, so one file covers all
weights. Keep `display: "swap"` and the fallbacks in the tokens.

| Role | Family | Size / line | Weight | Rule |
| --- | --- | --- | --- | --- |
| Display, H1–H3 | serif | scale above | 600 | one h1 per page |
| Prose body | serif | 18 / 1.6 | 400 | max 68ch |
| UI labels, nav, buttons | sans | 15 / 1.5 | 400–600 | never italic |
| Code, output, scores | mono | 14 / 1.55 | 400 | tabular numerals |
| Micro label | mono | 11 / 1.4 | 600 | uppercase, 0.08em |

Numbers use `font-variant-numeric: tabular-nums`. Code uses 14 px mono and never wraps; its box
scrolls. Prose stays at 68ch. Headings use sentence case. Micro labels are the only uppercase text.

## 5. Component inventory

24 components. Bracketed parts belong to the parent component.

| # | Component | Group | One line | States |
| --- | --- | --- | --- | --- |
| 1 | Header (owns Nav) | shell | Wordmark, links, progress count | default, current route |
| 2 | SkipLink | shell | First focusable item to `#main` | hidden, focus |
| 3 | Footer | shell | Disclaimer, citation note, copyright | default |
| 4 | Spine (owns ScorePanel) | spine | Six nodes on one hairline | empty, partial, complete |
| 5 | SpineNode | spine | State dot, name, score, link | broken, repaired, current |
| 6 | LessonHeader (owns MetaRow) | lesson | Breadcrumb, h1, outcome, spine strip | default, repaired |
| 7 | Toc | lesson | H2 links with active section | active, idle, sheet |
| 8 | Section | lesson | Anchored block with one h2 | default, target |
| 9 | Prose | lesson | Serif text container at 68ch | default |
| 10 | Callout | lesson | Note, warning or production tip | note, warning, tip |
| 11 | CodeBlock (owns OutputPanel) | lesson | Filename, language, copy, sample output | default, copied, failed |
| 12 | Diagram | lesson | Flat schematic with caption | default |
| 13 | CheckItem | lesson | Radio options and Submit | unanswered, correct, wrong |
| 14 | TaskChecklist | lesson | Five ticks, counter, solution | 0/5, partial, 5/5, open |
| 15 | ProveNote | lesson | Textarea, 280 limit, save state | empty, saving, saved |
| 16 | RepairButton | lesson | Completion gate action | disabled, enabled, done |
| 17 | PrevNext | lesson | Neighbour links and path edges | default, end-of-path |
| 18 | RetrievalExplorer | widget | Query, 12 docs, ranked results | empty, results, no-match |
| 19 | CostCalculator | widget | Four inputs, two cost outputs | valid, zero, invalid |
| 20 | Button (and Link) | common | One control primitive, two elements | default, hover, active, disabled |
| 21 | Badge | common | State word with a dot | broken, repaired, neutral |
| 22 | LiveRegion | common | Polite status for copy and save | empty, message |
| 23 | EmptyState | common | One sentence plus one link | default |
| 24 | Banner | common | Storage-failure notice | hidden, visible |

Disabled controls use 40% ink plus `aria-disabled`. Every control shows its state in text as well
as color.

## 6. Layout by breakpoint

| Property | Phone <768 | Tablet 768–1023 | Desktop 1024–1279 | Wide ≥1280 |
| --- | --- | --- | --- | --- |
| Page margin | 16 px | 24 px | 24 px | auto, max 1228 px |
| Grid | 1 column | main + 240 Toc | 88 spine + main + 232 Toc | 88 spine + 720 main + 260 Toc |
| Gaps | 16 px | 24 px | 24 px | 32 / 48 px |
| Spine | strip, 2 rows | horizontal strip | sticky left rail | sticky left rail |
| Toc | bottom sheet | static, below body | sticky right rail | sticky right rail |
| Sticky top | 56 | 56 | 88 | 88 |
| Action bar | sticky bottom 56 | none | none | none |
| Touch target | 44×44 px | 44×44 px | 32 px min | 32 px min |

Desktop main is 640 px at 1024 and 720 px at 1280. Prose inside stays at 68ch. The spine sticks
under the header. The Toc sticks at 88 px. On phone, Mark repaired and Next share one 56 px
bottom bar above `env(safe-area-inset-bottom)`. The Toc opens from that bar. No route scrolls
sideways.

## 7. Interaction and motion

- **Hover** (120 ms): links gain a 1 px underline at 4 px offset; buttons step bg to surface.
- **Focus**: 2 px `--focus` outline, 2 px offset, never removed. Use `:focus-visible`.
- **Active**: 80 ms color step, 12% darker. No scale and no translate.
- **Disabled**: 40% ink and border, `cursor: not-allowed`, helper text visible.
- **Trace** (600 ms): a dot travels the spine hairline from the repaired node to the next broken
  node. Easing `--ease-standard`. The count updates at arrival.
- **Number roll** (400 ms): old numeral rises 8 px and fades; the new one enters below. Tabular
  numerals keep width fixed. Only pass rate, cost and p95 roll.
- **Panel open** (240 ms): opacity plus a 4 px rise. The Toc sheet uses the same rule.
- **Reduced motion**: all durations become 0 ms. The dot does not move and numerals swap without
  travel. No transition exceeds 100 ms.
- **No parallax** at any breakpoint. No scroll-linked animation. No autoplay.

## 8. Wireframes

Desktop home:

```
┌──────────────────────────────────────────────────────────┐
│ lastminute.dev      Roadmap  About    0 of 6 repaired    │
├────┬─────────────────────────────────────────────────────┤
│S   │ Repair one broken AI feature.                       │
│P   │ Watch the score climb.                              │
│I   │ Six short lessons. One afternoon. No login.         │
│N   │ ┌─────────────────────────────────────────────────┐ │
│E   │ │ Triage 40 support tickets      Sample evaluation│ │
│    │ │ 41% pass    $0.94 / 1k    2.4 s p95             │ │
│ ●  │ └─────────────────────────────────────────────────┘ │
│ │  │ ● eval ─ ● prompt ─ ● retrieval ─ ● agents ─ ● cost│
│ ●  │ [ Start with lesson 1 ]  [ Fix retrieval first ]   │
│ │  │ Eval set = test suite     Retrieval = ranked cache │
│ ●  │ Agent = loop with a stop rule   Cost = load budget │
│ │  │ Read → Check → Build → Prove                       │
│ ●  │ 01 Evaluation you can trust     18 min  Not started│
└────┴─────────────────────────────────────────────────────┘
│ Independent study notes. Not affiliated.        © 2026   │
└──────────────────────────────────────────────────────────┘
```

Phone home:

```
┌──────────────────────────────────────┐
│ lastminute.dev            0 of 6     │
├──────────────────────────────────────┤
│ Repair one broken AI feature.        │
│ Watch the score climb.               │
│ Six short lessons. One afternoon.    │
│ ┌──────────────────────────────────┐ │
│ │ Triage 40 support tickets        │ │
│ │ 41% pass  $0.94 / 1k  2.4 s p95  │ │
│ └──────────────────────────────────┘ │
│ [ ● eval ][ ● prompt ][ ● retrieval ]│
│ [ ● agents ][ ● tune ][ ● cost ]     │
│ [ Start with lesson 1 ]              │
│ [ Fix retrieval first ]              │
│ Read → Check → Build → Prove         │
│ 01 Evaluation ...        18 min      │
└──────────────────────────────────────┘
```

Desktop lesson:

```
┌────────────────────────────────────────────────────────────┐
│ lastminute.dev      Roadmap  About      1 of 6 repaired    │
├────┬────────────────────────────────────┬──────────────────┤
│ ●  │ Home / Lessons / Retrieval         │ On this page     │
│ │  │ Retrieval that earns its keep      │ 1 Failing layer  │
│ ●  │ You will leave with: search.py     │ 2 Chunk and rank │
│ │  │ 25 min · Intermediate · Layer 3    │ 3 Cite sources   │
│ ●  │ ● ● ● ● ● ●  spine strip           │ 4 Build and prove│
│ │  │ ┌ prose 68ch ────────────────────┐ │                  │
│ ●  │ │ ## The failing layer           │ │ Status           │
│ │  │ │ Explanation ...                │ │ ● Broken         │
│ ●  │ └────────────────────────────────┘ │ 41% pass         │
│ │  │ ┌ search.py  python       Copy ┐   │ $0.94 / 1k       │
│ ●  │ │ code, 14px mono, no wrap      │   │ 2.4 s p95        │
│ │  │ └───────────────────────────────┘   │ Sample data      │
│ ●  │ ▸ Sample output. Fixed data.        │                  │
│ │  │ Check 1  ○ ○ ○   [ Submit ]        │                  │
│ ●  │ ☐ 0 of 5 steps done                │                  │
│ │  │ [textarea]               Saved     │                  │
│ │  │ [ Mark layer repaired ] ◀ Prev Next│                  │
└────┴────────────────────────────────────┴──────────────────┘
```

Phone lesson:

```
┌──────────────────────────────────────┐
│ lastminute.dev            1 of 6     │
├──────────────────────────────────────┤
│ Home / Lessons / Retrieval           │
│ Retrieval that earns its keep        │
│ 25 min · Intermediate · Layer 3      │
│ [ ● eval ][ ● prompt ][ ● retrieval ]│
│ [ ● agents ][ ● tune ][ ● cost ]     │
│ Contents ▾                           │
│ ## The failing layer                 │
│ Prose ...                            │
│ ┌ search.py            Copy ┐        │
│ │ code scrolls in this box  │        │
│ └───────────────────────────┘        │
│ ▸ Sample output                      │
│ Check 1 ...                          │
│ ☐ 0 of 5 steps                       │
│ [textarea]                           │
├──────────────────────────────────────┤
│ [ Mark layer repaired ]     [ Next ] │
└──────────────────────────────────────┘
```

Roadmap:

```
┌──────────────────────────────────────────────────────┐
│ lastminute.dev      Roadmap  About    1 of 6         │
├──────────────────────────────────────────────────────┤
│ The path          2 h 05 min total                   │
│ ──────────────────────────────────────────────────── │
│ 01 Evaluation you can trust   18 min  Done       →   │
│ 02 Prompt design as contract  15 min  In progress→   │
│ 03 Retrieval earns its keep   25 min  Not started→   │
│ ──────────────────────────────────────────────────── │
│ Planned, not in this demo                            │
│ Evaluation at scale · Guardrails · Caching · Observe │
└──────────────────────────────────────────────────────┘
```

About and 404 share the shell and the 68ch prose column:

```
┌──────────────────────────────────────────────────────┐
│ lastminute.dev      Roadmap  About                   │
├──────────────────────────────────────────────────────┤
│ About this course                                    │
│ Independent study notes. Not affiliated.             │
│ Progress stays in this browser.                      │
│ [ Start lesson 1 ]                                   │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│ lastminute.dev      Roadmap  About                   │
├──────────────────────────────────────────────────────┤
│ This lesson does not exist.                          │
│ Check the URL or open the roadmap.                   │
│ [ Open the roadmap ]                                 │
└──────────────────────────────────────────────────────┘
```

## 9. Visual QA checklist

Run these ten checks on every route at 390, 768 and 1440 px.

| # | Check | Pass condition |
| --- | --- | --- |
| 1 | Contrast | Body ≥4.5:1; boundaries and focus ≥3:1; no color-only state |
| 2 | Focus | Tab shows a 2 px ring on every control; no ring is clipped |
| 3 | Rhythm | Space uses only the 4 px scale; no stray margins |
| 4 | Measure | Prose ≤68ch; no text wider than 720 px |
| 5 | Code overflow | Code scrolls in its box; page never scrolls sideways |
| 6 | Diagram legibility | 1 px strokes survive 200% zoom; caption states the takeaway |
| 7 | Empty states | No-match, zero, blank note and blocked storage each show one sentence |
| 8 | Type discipline | One h1; no skipped levels; mono only for technical text |
| 9 | Motion | Trace lasts 600 ms; numbers roll; reduced motion removes travel |
| 10 | State honesty | Scores say "sample data"; repaired layers show a word, not only green |

## 10. Handoff

Stage 5 uses this order: tokens, fonts, shell, spine, lesson components, widgets. It must not add
colors, families, radii or shadows outside this set. A new value changes this document first.
