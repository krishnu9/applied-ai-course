"use client";

import { useId, useState } from "react";
import { PRESET_QUERIES, RETRIEVAL_DOCS } from "@/content/retrieval";
import type { RetrievalDoc } from "@/lib/types";
import { CONTROL_LABEL, RANGE_INPUT, WidgetHeading } from "./WidgetChrome";
import type { WidgetProps } from "./types";

const QUERY = "refund policy";
const DEFAULT_CAPTION =
  "One fixed query on twelve documents. The slider changes the order.";

type RankedRow = {
  docId: string;
  text: string;
  presetScore: number;
  overlap: number;
  score: number;
};

function queryTerms(query: string): string[] {
  return query.trim().toLowerCase().split(/\s+/).filter(Boolean);
}

function wordOverlap(doc: RetrievalDoc, terms: readonly string[]): number {
  if (terms.length === 0) return 0;
  const haystack = `${doc.title} ${doc.tags.join(" ")} ${doc.text}`.toLowerCase();
  const hits = terms.filter((term) => haystack.includes(term)).length;
  return hits / terms.length;
}

/** Fuse the fixed preset scores with a word-overlap score. The slider moves the mix. */
function rankRows(weight: number): RankedRow[] | null {
  const preset = PRESET_QUERIES.find((candidate) => candidate.query === QUERY);
  if (!preset) return null;

  const docs = new Map(RETRIEVAL_DOCS.map((doc) => [doc.id, doc]));
  const terms = queryTerms(QUERY);
  const maxPreset = Math.max(...preset.results.map((result) => result.score), 0.0001);
  const rows = preset.results.flatMap((result) => {
    const doc = docs.get(result.docId);
    if (!doc) return [];
    const overlap = wordOverlap(doc, terms);
    return [
      {
        docId: result.docId,
        text: doc.text,
        presetScore: result.score,
        overlap,
        score: (1 - weight) * result.score + weight * overlap * maxPreset,
      },
    ];
  });

  rows.sort((a, b) => b.score - a.score || (a.docId < b.docId ? -1 : 1));
  return rows;
}

/** The retrieval explorer with one fixed query and one word-overlap weight. */
export function RagRankLab({ caption }: WidgetProps) {
  const [weight, setWeight] = useState(0.5);
  const weightId = `${useId()}-weight`;
  const rows = rankRows(weight);
  const first = rows?.[0]?.docId;

  return (
    <div className="min-w-0">
      <WidgetHeading title="Retrieval rank lab" caption={caption ?? DEFAULT_CAPTION} />
      <p className="mt-2 text-[length:var(--text-small)] text-[var(--ink-muted)]">
        Simplified lexical score for teaching. Not BM25.
      </p>

      <div className="mt-4 min-w-0 rounded-[var(--radius-3)] border border-[var(--hairline)] bg-[var(--bg)] p-3">
        <p className="[font-family:var(--font-mono-stack)] text-[length:var(--text-micro)] uppercase tracking-[var(--tracking-micro)] text-[var(--ink-muted)]">
          Fixed query
        </p>
        <p className="mt-1 [font-family:var(--font-mono-stack)] text-[length:var(--text-body)] text-[var(--ink)]">
          {QUERY}
        </p>
      </div>

      <div className="mt-4 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <label htmlFor={weightId} className={CONTROL_LABEL}>
            Word-overlap weight
          </label>
          <span className="[font-family:var(--font-mono-stack)] text-[length:var(--text-small)] text-[var(--ink-muted)]">
            {weight.toFixed(1)}
          </span>
        </div>
        <input
          id={weightId}
          type="range"
          min={0}
          max={1}
          step={0.1}
          value={weight}
          aria-valuetext={`${Math.round(weight * 100)} percent word overlap`}
          onChange={(event) => setWeight(Number(event.target.value))}
          className={RANGE_INPUT}
        />
      </div>

      <p
        role="status"
        aria-live="polite"
        className="mt-3 text-[length:var(--text-small)] text-[var(--ink)]"
      >
        {rows === null
          ? `No fixed results for ${QUERY}.`
          : `${rows.length} results for ${QUERY}. First result ${first}.`}
      </p>

      {rows ? (
        <ol className="mt-2 flex list-none flex-col gap-2 p-0">
          {rows.map((row, index) => (
            <li
              key={row.docId}
              className="min-w-0 rounded-[var(--radius-3)] border border-[var(--hairline)] bg-[var(--bg)] p-2"
            >
              <p className="[font-family:var(--font-mono-stack)] text-[length:var(--text-small)] [font-variant-numeric:tabular-nums] text-[var(--ink)]">
                {index + 1}. {row.docId} · {row.score.toFixed(2)}
              </p>
              <p className="mt-1 [overflow-wrap:anywhere] text-[length:var(--text-small)] text-[var(--ink)]">
                {row.text}
              </p>
              <p className="mt-1 [font-family:var(--font-mono-stack)] text-[length:var(--text-micro)] uppercase tracking-[var(--tracking-micro)] text-[var(--ink-muted)]">
                Preset {row.presetScore.toFixed(2)} · overlap {row.overlap.toFixed(2)}
              </p>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
