# Stage 5 — Low-level design: `lesson`

Binding: `4-hld.md` and `3-prd.md`. Scope: `components/lesson/**` and
`app/lessons/[slug]/page.tsx`. This design adds no route, token, package or colour.

## 1. Files and jobs

| File | Kind | Job |
| --- | --- | --- |
| `index.ts` | module | Public exports. |
| `LessonArticle.tsx` | server | Header, sections, prove, repair, prev/next. |
| `LessonHeader.tsx` | server | Breadcrumb, H1, outcome, artifact. |
| `MetaRow.tsx` | server | About N minutes, difficulty, layer. |
| `SectionRenderer.tsx` | server | One H2 and its blocks. |
| `BlockRenderer.tsx` | server | Block-to-component map. |
| `Prose.tsx` | server | Paragraph and list text. |
| `Callout.tsx` | server | Note, warning, production tip. |
| `CodeBlock.tsx` | server | Code, filename, copy, output. |
| `OutputPanel.tsx` | server | Fixed sample output. |
| `CopyButton.tsx` | client | Clipboard and reset. |
| `Diagram.tsx` | server | Inline SVG and caption. |
| `CheckBlock.tsx` | client | Options, submit, verdict, retry. |
| `TaskChecklist.tsx` | client | Ticks, counter, solution. |
| `ProveNote.tsx` | client | Note field and save status. |
| `RepairButton.tsx` | client | Gate and `repair`. |
| `LessonToc.tsx` | client | Links and active section. |
| `LessonPosition.tsx` | client | Position write and restore. |
| `PrevNext.tsx` | server | Lesson 1 "Start of the path"; lesson 6 "End of the path", "Open the roadmap". |
| `LessonKeyboardNav.tsx` | client | P1 bracket keys. |
| `app/lessons/[slug]/page.tsx` | server | Static route and metadata. |

`Prose` wraps the shell primitive.

## 2. Server and client split

Server files: `LessonArticle`, `LessonHeader`, `MetaRow`, `SectionRenderer`, `BlockRenderer`,
`Prose`, `Callout`, `CodeBlock`, `OutputPanel`, `Diagram`, `PrevNext` and the route page. They
render fixed text, code and links, and ship no JavaScript.

These eight files carry `'use client'`:

- `CheckBlock`: selection, verdict, retry and focus.
- `TaskChecklist`: ticks and disclosure.
- `ProveNote`: controlled field and timer.
- `RepairButton`: gate and store action.
- `LessonToc`: observer, scroll and focus.
- `CopyButton`: clipboard promise.
- `LessonPosition`: observer and throttle.
- `LessonKeyboardNav`: key listener (P1).

`LessonKeyboardNav` is the only P1 file. The core list matches HLD section 2.

## 3. Props and render map

Content shapes:

```ts
interface Section { id: string; heading: string; blocks: Block[] }
type Block = ParagraphBlock | ListBlock | CodeBlockData | CalloutBlock | DiagramBlock
  | CheckRef | TaskBlock | WidgetBlock | NoteBlock;
interface CodeBlockData { kind: 'code'; id: string; filename: string; language: string;
  code: string; output: { label: string; text: string } }
interface CalloutBlock { kind: 'callout'; id: string;
  tone: 'note' | 'warning' | 'production-tip'; title: string; body: string }
interface DiagramBlock { kind: 'diagram'; id: string; caption: string;
  nodes: { id: string; label: string }[]; edges: [string, string][] }
interface CheckRef { kind: 'check'; id: string; checkId: string }
interface TaskBlock { kind: 'task'; id: string }
interface WidgetBlock { kind: 'widget'; id: string; widget: 'retrieval' | 'cost' }
interface ProveConfig { id: string; prompt: string; placeholder: string; maxLength: 280 }
```

Paragraph, list and note blocks carry `{ kind, id }` plus `text`, or `ordered` and `items`.
`CodeBlockData` and `CheckRef` alias the content `CodeBlock` and `CheckBlock`.

```ts
type LessonArticleProps = { lesson: Lesson; layer: Layer; neighbours: Neighbours };
type LessonHeaderProps = { lesson: Lesson; layer: Layer };
type MetaRowProps = { readingMinutes: number; difficulty: Lesson['difficulty'];
  layerOrder: number; layerName: string };
type SectionRendererProps = { section: Section; lesson: Lesson };
type BlockRendererProps = { block: Block; lesson: Lesson };
type ProseProps = { kind: 'paragraph'; text: string }
  | { kind: 'list'; ordered: boolean; items: string[] };
type CalloutProps = Omit<CalloutBlock, 'kind' | 'id'>;
type CodeBlockProps = Omit<CodeBlockData, 'kind' | 'id'>;
type OutputPanelProps = CodeBlockData['output'];
type CopyButtonProps = { code: string; label?: string };
type DiagramProps = Omit<DiagramBlock, 'kind' | 'id'>;
type CheckBlockProps = { slug: LessonSlug; check: Check };
type TaskChecklistProps = { slug: LessonSlug; task: Task };
type ProveNoteProps = { slug: LessonSlug; prove: ProveConfig };
type RepairButtonProps = { slug: LessonSlug; layerName: string;
  checks: { id: string; correctOptionId: string }[]; taskItemIds: string[];
  declared: SampleMetrics };
type LessonTocProps = { sections: { id: string; heading: string }[] };
type LessonPositionProps = { slug: LessonSlug; sectionIds: string[] };
type PrevNextProps = { prev: LessonSummary | null; next: LessonSummary | null };
type LessonKeyboardNavProps = { prevHref: string | null; nextHref: string | null };
```

`LessonSummary` is `{ slug, title }`.

Render map: a `Section[]` maps to one `SectionRenderer` per section. `paragraph` and `list` use
`Prose`; `code` uses `CodeBlock`; `callout` uses `Callout`; `diagram` uses `Diagram`. `check` uses
`CheckBlock` by `checkId`; `task` uses `TaskChecklist`. `widget` uses `RetrievalExplorer` or
`CostCalculator`; `note` uses `Callout` with the note tone.

```tsx
default: {
  if (process.env.NODE_ENV !== 'production') console.warn('Unknown block', block);
  return <Panel><p className="micro">Unavailable block</p>
    <p>This block is not available.</p></Panel>;
}
```

The switch ends with a `never` check. The type check catches these cases at build time.

## 4. Check flow

State:

```ts
const [selected, setSelected] = useState<string | null>(null);
const [submitted, setSubmitted] = useState(false);
const [retrying, setRetrying] = useState(false);
const [showExplanation, setShowExplanation] = useState(false);
const verdict = !submitted || retrying ? 'idle'
  : selected === check.correctOptionId ? 'correct' : 'wrong';
```

The stored answer is `state.lessons[slug]?.checkAnswers[check.id]?.selectedOptionId`. One effect
applies it when `ready` turns true, only if the option still exists.

Submit is disabled while `selected === null`. Before Submit no option shows a mark, icon or
verdict colour. Submit calls `setCheck(slug, check.id, selected)`. Correct shows "Correct." in a
green panel with the explanation. All options disable and Submit disappears. Wrong shows "Not
quite." in an amber panel with the explanation and "Try again". "Try again" clears marks and
verdict, keeps the explanation and the choice, and re-enables the options.

After a user submit, focus moves to the feedback heading (`tabIndex={-1}`). Hydration does not
move focus. `useId` prefixes the legend, option, heading and explanation ids. `aria-describedby`
appears only after Submit. Marks read "Correct answer" and "Your answer". Arrow keys move between
radios and Space selects.

## 5. Task flow

Five native checkboxes use tick id `${task.id}:${index}`. The live counter reads
"{n} of {items.length} steps done". A change calls `toggleTask(slug, tickId)` at once. Stored ticks
are filtered against the item ids.

The solution starts closed. "Show reference solution" is disabled below 5 of 5, with helper
"Tick all 5 steps to open the solution." (LLD copy). At 5 of 5 it enables. A click opens a region labelled
"Reference solution" with the filename and a `<pre>`, and the button reads "Hide".
`aria-expanded` and `aria-controls` track the panel. Space toggles a tick. Enter or Space opens
the disclosure. Focus stays on the button.

## 6. Prove flow

The textarea is controlled and capped at 280 characters. A change slices the value and restarts an
800 ms timer. Blur and unmount flush a pending value. The flush calls `setProof(slug, text)` with
the raw text. A blank value saves an empty string. The gate trims the text.

Empty shows the placeholder "I changed X; the result was Y.". At the timer the live region shows
"Saving…". A non-empty save shows "Proof saved on this device.". A blank save shows "Proof
cleared." (LLD copy). A stored note applies when `ready` turns true without a save, only if
untouched. The region uses `aria-live="polite"` and `useId`. When `storage !== 'ok'` the text
reads "Proof saved for this session.".

## 7. Repair gate

```ts
const record = state.lessons[slug];
const a = (id: string) => record?.checkAnswers[id]?.selectedOptionId;
const checksPass = checks.every(c => a(c.id) === c.correctOptionId);
const ticks = new Set(record?.taskTicks ?? []);
const taskPass = taskItemIds.length === 5 && taskItemIds.every(id => ticks.has(id));
const proofPass = (record?.proofNote ?? '').trim().length > 0;
const canRepair = ready && checksPass && taskPass && proofPass
  && record?.status !== 'repaired';
```

The button is disabled until `canRepair`, with native `disabled`, `aria-disabled="true"` and 40%
ink. Its helper reads "Pass every check, tick all 5 steps and write a proof note." (LLD copy). A
click calls `repair(slug)`. The label becomes "Layer repaired" and stays disabled.

On repair, the record becomes `repaired` and the header count rises by one. The spine node turns
green with the word "Repaired". Its numbers roll for 400 ms to the declared metrics. A polite
region says "Layer repaired." plus the declared pass rate, cost per 1k and p95. The 600 ms trace
dot belongs to the shell. It plays only on a live transition, not on reload.

With reduced motion, `--dur-trace` and `--dur-number` are 0. The dot does not travel and the
numbers change in place. The state word carries the meaning.

## 8. Table of contents and position

`LessonToc` renders a nav "On this page". An IntersectionObserver watches the H2 elements.
Rules: `rootMargin: '-88px 0px -60% 0px'`, `threshold: 0`, one observer, one `rAF` batch per
callback. Active is the first visible heading in document order, or the last heading above the
viewport when none is visible. The active link gets `aria-current="true"`. A click calls
`preventDefault` and writes the hash with `history.replaceState`. It scrolls smooth or auto under
reduced motion, then focuses the H2 with `preventScroll: true`. H2 elements have `tabIndex={-1}`
and `scroll-margin-top: calc(var(--header-h) + var(--space-8))`.

Below 768 px the nav is a bottom-sheet disclosure button "On this page". Escape closes it and
returns focus. Above 768 px the list is always visible.

`LessonPosition` uses a second observer with the same rules. It calls `setPosition(slug, id)` only
after `ready`, with a trailing throttle of one write per 1000 ms. It skips an unchanged id and
pauses during restore. Restore runs once on mount. It applies only when `lastLessonSlug === slug`,
`savedId` is in `sectionIds`, and the URL has no hash. A null or unknown id causes no scroll.

## 9. Code copy

`CodeBlock` is server rendered. It shows the filename, language, exact code in `<pre><code>` and a
focusable scroll wrapper. The code text is in the static HTML. `CopyButton` calls
`navigator.clipboard.writeText(code)` inside `try/catch`. A missing API is a failure.

Success sets the label to "Copied" for 2000 ms and announces "Copied". Failure keeps "Copy" and
announces "Copy failed. Select the code." The wrapper scrolls inside its box at 390 px.
`OutputPanel` always shows "Sample output. Fixed data.".

## 10. Route page and 404

```ts
export const dynamicParams = false;
export function generateStaticParams(): { slug: LessonSlug }[] {
  return getCourse().lessons.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) return {};
  return { title: `${lesson.title} — lastminute.dev`, description: lesson.outcome.slice(0, 160) };
}
```

The page awaits `params`, calls `getLesson(slug)`, and calls `notFound()` on null. It renders the
`main` landmark, `Spine`, `LessonArticle`, the TOC aside, `LessonPosition` and
`LessonKeyboardNav` (P1).

`dynamicParams = false` emits exactly six lesson pages. An unknown slug never enters the page. The
host serves `404.html` from `app/not-found.tsx` inside the root layout. That screen shows H1
"This lesson does not exist.", "Check the URL or open the roadmap.", "Open the roadmap" and "Back
to course". Header and footer remain. `notFound()` stays as a second guard.

## 11. Empty, error and edge states

| Piece | State and text |
| --- | --- |
| Check | Before Submit: Submit disabled, no feedback. Correct: "Correct." plus explanation. Wrong: "Not quite." plus explanation and "Try again". Stored answer returns. |
| Task | "0 of 5 steps done"; solution disabled. At 5 of 5: "Show reference solution". Open: "Hide". Stored ticks return. |
| Prove | Empty: placeholder only. Pending: "Saving…". Saved: "Proof saved on this device.". Cleared: "Proof cleared.". |
| Repair | Closed: disabled plus "Pass every check, tick all 5 steps and write a proof note.". Open: "Mark layer repaired". Repaired: "Layer repaired", disabled. |
| Copy | Success: "Copied" for 2 s. Failure: "Copy failed. Select the code.". |
| TOC | No sections: nothing. No visible heading: last heading above. Escape closes the phone sheet. |
| Position | No saved value or bad id: no scroll. Blocked storage: session only. |
| Blocks | Bad check id, task or widget: "This block is not available." |
| Storage | "Progress cannot be saved in this browser. You can still read every lesson." Controls work in memory. |
| Unknown slug | The 404 screen in section 10. |

## 12. Build units

| Unit | Files | Depends on | Done line |
| --- | --- | --- | --- |
| LU-1 article and blocks | `index`, `LessonArticle`, `LessonHeader`, `MetaRow`, `SectionRenderer`, `BlockRenderer`, `Prose`, `Callout`, `CodeBlock`, `OutputPanel`, `CopyButton`, `Diagram` | U0, U1, U4 | Blocks render in order; code is in the HTML; Copy resets after 2 s. |
| LU-2 checks and task | `CheckBlock`, `TaskChecklist` | U0–U2, LU-1 | Submit starts disabled; wrong retries; correct and ticks survive reload. |
| LU-3 prove, repair, TOC, position | `ProveNote`, `RepairButton`, `LessonToc`, `LessonPosition`, `LessonKeyboardNav` (P1) | U0–U2, U4, LU-1, LU-2 | Note saves in 800 ms; the gate needs all inputs; repair rolls scores; TOC focuses the H2; position restores once. |
| LU-4 route page | `app/lessons/[slug]/page.tsx` | U0–U4, LU-1–LU-3 | Six pages plus `404.html`; per-page metadata; no dynamic params. |

Done requires `npm run build` and checks at 390, 768 and 1440 px with no console error.
