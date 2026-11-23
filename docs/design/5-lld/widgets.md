# Stage 5 — Low-level design: `widgets`

Sources: `4-hld.md` (binding, section 6), `3-prd.md` (US-18, US-19, states, responsive, a11y).

## 1. Files and public surface

| File | Purpose |
| --- | --- |
| `components/widgets/rank.ts` | ranking and score format |
| `components/widgets/cost.ts` | cost model and number format |
| `components/widgets/RetrievalExplorer.tsx` | retrieval UI |
| `components/widgets/CostCalculator.tsx` | cost UI |
| `components/widgets/index.ts` | public surface |

`index.ts` exports `RetrievalExplorer`, `CostCalculator`, `rankDocuments` and `estimateCost`.
It imports `content` getters, `shell` (`Panel`, `Badge`) and `lib` (`cn`). Other modules import
only `index.ts`. Shared types live in `lib/types.ts` (owned by U0).

```ts
type RetrievalDoc = { id: string; text: string; tags: string[] };
type PresetQuery = { query: string; results: { docId: string; score: number }[] };
type RetrievalHit = { rank: number; docId: string; score: number; text: string; source: string };
type RankResult = { status: 'empty' | 'results' | 'no-match'; hits: RetrievalHit[] };
type CostModel = { requestsPerDay: number; inputTokens: number; outputTokens: number; pricePerM: number;
  retrievalMs: number; prefillMsPerToken: number; decodeMsPerToken: number; days: number };
type CostInputs = { requestsPerDay: string; inputTokens: string; outputTokens: string; pricePerM: string };
type CostResult = { costPerRequest: number; costPer1k: number; monthlyCost: number; p95Ms: number };
```

## 2. Pure functions

Both functions are pure. They do not mutate arguments, read globals or use time.

### 2.1 `rankDocuments`

```ts
function rankDocuments(query: string, docs: RetrievalDoc[], presets: PresetQuery[]): RankResult
```

Normalisation is exact: `query.trim().toLowerCase()`. It does not collapse spaces, remove
punctuation or normalise Unicode.

1. Set `n = normalize(query)`. If `n === ''`, return `{ status: 'empty', hits: [] }`.
2. Find the first preset with `normalize(preset.query) === n`. If none matches, return `no-match`.
3. Map each preset result to a doc and skip an unknown `docId`.
4. Deduplicate by `docId`. Keep the highest score.
5. Sort by score descending, then `docId` ascending. Set `rank = index + 1`.
6. If no hit remains, return `no-match`. Else return the hits.

Ranking is a lookup. Scores are fixed content data. `formatScore` returns `score.toFixed(2)`;
this is the only rounding point.

| Call | Status | Hits (rank, docId, score) |
| --- | --- | --- |
| `refund policy` or `  Refund POLICY  ` | `results` | 1 doc-07 0.91; 2 doc-08 0.74; 3 doc-02 0.61 |
| `billing` | `results` | 1 doc-02 0.88; 2 doc-03 0.79; 3 doc-09 0.63 |
| `late delivery` | `results` | 1 doc-05 0.92; 2 doc-04 0.70; 3 doc-10 0.55 |
| `''`, `'   '`, `refund` or `refund  policy` | `empty` or `no-match` | none |

### 2.2 `estimateCost`

```ts
function estimateCost(inputs: CostInputs, model: CostModel): CostResult | null
```

`parseField` trims the string, rejects an empty value, accepts only `/^\d+(\.\d+)?$/`, converts
with `Number` and rejects a non-finite value. A sign, exponent, comma, inner space or letter is
invalid.

| Field | Rule | Message when invalid |
| --- | --- | --- |
| `requestsPerDay` | integer, at least 1 | "Enter at least 1 request." |
| `inputTokens` | integer, at least 1 | "Enter at least 1 input token." |
| `outputTokens` | integer, at least 0 | "Enter 0 or more output tokens." |
| `pricePerM` | number above 0 | "Enter a price above 0." |

One failed rule returns `null`. Compute with full precision:

```text
costPerRequest = (inputTokens + outputTokens) * pricePerM / 1_000_000
costPer1k      = costPerRequest * 1_000
monthlyCost    = costPerRequest * requestsPerDay * model.days
p95Ms          = model.retrievalMs + inputTokens * model.prefillMsPerToken
               + outputTokens * model.decodeMsPerToken
```

A non-finite result returns `null`. The function never rounds. `formatUsd` adds `$`, two decimals
and comma groups. `formatP95` returns seconds with two decimals: `2.40 s`.

| Case (defaults `10000`, `1000`, `250`, `0.75`, 30 days) | Result |
| --- | --- |
| Defaults | `$0.94` per 1k; `$281.25` monthly; `2.40 s` p95 |
| Requests `100000` | `$2,812.50` monthly; `$0.94` per 1k holds |
| Requests `0`, `abc`, empty or `1e5` | `null`; "Enter at least 1 request." |

## 3. `RetrievalExplorer`

```ts
interface RetrievalExplorerProps {
  docs: RetrievalDoc[]; presets: PresetQuery[]; caption?: string; className?: string;
}
```

The lesson passes `getRetrievalDocs()` and `getPresetQueries()`. State: `query` starts as `''`;
optional `selectedDocId` starts as `null`. Derived value:
`const { status, hits } = rankDocuments(query, docs, presets)` on each render. A preset click sets
`query` and clears the selection.

| State | Visible content |
| --- | --- |
| No query | "Choose a sample query." and the presets `refund policy`, `billing`, `late delivery` |
| Results | Result count, ranked rows, the 12-document disclosure |
| No match | "No results for that query. Try 'refund policy' or 'billing'." and the presets |

The input and the presets stay visible in all states. A row shows, in order: rank (`1`), score
(`0.91`), chunk text and `Source: doc-07`. Rank and score use mono with tabular numerals. Visually
hidden text reads "Rank" and "Score" before the numbers.

Select (optional): each row is one `<button>`. A click, Enter or Space expands a detail line:
"Matched terms: refund, policy." The chunk shows the terms inside `<mark>`. `aria-expanded` and
`aria-controls` link the button to the detail.

Keyboard: each row is one tab stop. Arrow keys move between rows; `Home` and `End` go to the
first or last. Enter and Space toggle the detail.

Aria: the section uses `aria-labelledby` with the `h3` "Retrieval explorer". The input has the
label "Sample query" and the hint "Preset queries only. Other text returns no results."
`<p role="status" aria-live="polite">` reads "3 results for refund policy." or the no-match
sentence. The empty state does not announce. The 12 documents use a native `<details>`.

## 4. `CostCalculator`

```ts
interface CostCalculatorProps { model: CostModel; caption?: string; className?: string; }
```

State: one `CostInputs` object with four strings, from `model`: `"10000"`, `"1000"`, `"250"`,
`"0.75"`. Derived value: `estimateCost(inputs, model)` on each render. No effect, no reload.

Fields are controlled text fields. Use `type="text"`, `inputMode="numeric"` for integers and
`inputMode="decimal"` for the price. Do not use `type="number"`: it discards invalid text and
changes values on wheel scroll.

Labels and defaults: "Requests per day" `10000`, "Input tokens per request" `1000`, "Output
tokens per request" `250`, "Price per 1M tokens" `0.75`.

One `<fieldset>` with legend "Inputs" holds the fields. Set `min-width: 0`. Each field has a
visible label and a hint.

The result is a `<dl>` under an `h4` "Result":

- "Cost per 1,000 requests": `$0.94`.
- "Monthly cost (30 days)": `$281.25`.
- "p95 latency": `2.40 s`.

All values use two decimals, mono and tabular numerals. A `<Badge>` reads "Sample" and stays
visible in every state.

When `estimateCost` returns `null`, all three values show `—`. The first invalid field gets
`aria-invalid="true"` and the error id in `aria-describedby`. The error shows the exact message
from section 2.2. It uses a polite live region.

## 5. Rendering, caption and width

| Widget | Lesson | Block | Placement |
| --- | --- | --- | --- |
| `RetrievalExplorer` | `retrieval` | `WidgetBlock` id `retrieval-explorer` | After the preset query table, before the first check |
| `CostCalculator` | `cost` | `WidgetBlock` id `cost-calculator` | After the cost formulas, before the first check |

No other lesson has a widget block. The block is
`{ kind: 'widget'; id: string; widget: 'retrieval-explorer' | 'cost-calculator'; caption: string }`.
`LessonArticle` (lesson module) switches on `block.widget` and passes the caption:

```tsx
<RetrievalExplorer docs={getRetrievalDocs()} presets={getPresetQueries()} caption={block.caption} />
<CostCalculator model={getCostModel()} caption={block.caption} />
```

Content writes one caption line of 120 characters or fewer, for example "Fixed corpus. The same
query always returns the same order." The widget renders it as a `<p>` below its title. The caption
is not the accessible name.

Width: `w-full max-w-full min-w-0`, no fixed width and no negative margin. Columns use
`minmax(0, 1fr)`. Long text uses `overflow-wrap: anywhere`. The widget stays inside the 720 px
main column and creates no horizontal scroll.

## 6. Responsive behaviour

| Part | 390 px | 768 px | 1440 px |
| --- | --- | --- | --- |
| Retrieval row | Stack: rank + score, chunk, source | Grid `2rem 3.5rem minmax(0,1fr)` | Same grid in the 720 px main |
| Presets | Full width, stacked | Inline, wrap | Inline, wrap |
| Cost fields | One column | Three columns | Three columns |

Cost fields use `repeat(auto-fit, minmax(190px, 1fr))`. Rows and inputs are at least 44 px high.
At 200% zoom the same rules apply. Check
`document.documentElement.scrollWidth === clientWidth` at all three widths.

## 7. Accessibility

- Every field has a visible label. The cost fields share one legend.
- The result count and the cost error use `role="status"` and `aria-live="polite"`.
- Focus follows DOM order: query, presets, rows; cost fields, result.
- The widgets set no positive `tabindex` and no focus trap.
- The global 2 px focus ring stays. The widgets never set `outline: none`.
- No state uses colour alone. Rank, score, source, "Showing match" and the error are text.
- The invalid field carries `aria-invalid`, not only a red hairline.
- Reduced motion needs no rule: the widgets define no transition.

## 8. Determinism

- No network, storage, `Date`, `Math.random` or timer.
- Same props and same input string give the same output.
- Fixed scores and rates come from `content`. The functions compute nothing else.
- `useId` supplies ids and is stable across hydration. Initial state comes from props only.
- Optional `node:test` cases compare `estimateCost` within `1e-9` and the `refund policy`
  `docId` order to `['doc-07', 'doc-08', 'doc-02']`.

## 9. Build units

- **WU-1**: `rank.ts`, `cost.ts`, `index.ts`. Depends on U0 types and content shapes. Done: section 2 examples return the listed values; build passes.
- **WU-2**: `RetrievalExplorer.tsx` and its index export. Depends on WU-1 and shell `Panel`, `Badge`. Done: three states render; `refund policy` shows doc-07, doc-08, doc-02; 12 documents listed.
- **WU-3**: `CostCalculator.tsx` and its index export. Depends on WU-1 and shell `Panel`, `Badge`. Done: defaults show `$0.94`, `$281.25`, `2.40 s`; 10x traffic shows `$2,812.50`; `0` shows the message and `—`.
- **WU-4**: `LessonArticle` widget case and two `WidgetBlock` entries. Depends on WU-2, WU-3, U1 and U5. Done: both lessons show one widget and its caption; no other lesson shows one.

## 10. Risks

- **Free text**: "refund" returns no match. Mitigation: visible hint, presets always visible, no-match copy names two presets.
- **Number edge cases** (empty, `0`, `abc`, `-1`, `1e5`, `1,000`, `10.5`, huge values): wrong result or crash. Mitigation: one parse rule, finite check, section 2.2 cases.
- **Overflow** (huge monthly cost, long chunk text, 200% zoom): horizontal page scroll. Mitigation: wrap rules, `minmax(0,1fr)`, no fixed width.
- **p95 format**: `2.40 s` here, `2.4 s` on the spine. The widget uses two decimals; the spine keeps its sample string.
- **`type="number"` quirks**: invalid text disappears; wheel changes values. Use text fields with `inputMode`.
