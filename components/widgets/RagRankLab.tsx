"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui";
import { PRESET_QUERIES, RETRIEVAL_DOCS } from "@/content/retrieval";
import type { RetrievalDoc } from "@/lib/types";
import { CONTROL_LABEL, RANGE_INPUT, WidgetHeading } from "./WidgetChrome";
import type { WidgetProps } from "./types";

type RankedRow = {
  docId: string;
  title: string;
  text: string;
  dense: number;
  lexical: number;
  score: number;
};

function queryTerms(query: string): string[] {
  return query.trim().toLowerCase().split(/\s+/).filter(Boolean);
}

function lexicalScore(doc: RetrievalDoc, terms: readonly string[]): number {
  if (terms.length === 0) return 0;
  const haystack = `${doc.title} ${doc.tags.join(" ")} ${doc.text}`.toLowerCase();
  const hits = terms.filter((term) => haystack.includes(term)).length;
  return hits / terms.length;
}

/** Fuse the fixed dense scores with a word-overlap score. The slider moves the mix. */
function rankRows(query: string, bm25Weight: number): RankedRow[] | null {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return null;
  const preset = PRESET_QUERIES.find(
    (candidate) => candidate.query.toLowerCase() === normalized,
  );
  if (!preset) return null;

  const docs = new Map(RETRIEVAL_DOCS.map((doc) => [doc.id, doc]));
  const terms = queryTerms(query);
  const maxDense = Math.max(...preset.results.map((result) => result.score), 0.0001);
  const rows = preset.results.flatMap((result) => {
    const doc = docs.get(result.docId);
    if (!doc) return [];
    const lexical = lexicalScore(doc, terms);
    return [
      {
        docId: result.docId,
        title: doc.title,
        text: doc.text,
        dense: result.score,
        lexical,
        score: (1 - bm25Weight) * result.score + bm25Weight * lexical * maxDense,
      },
    ];
  });

  rows.sort((a, b) => b.score - a.score || (a.docId < b.docId ? -1 : 1));
  return rows;
}

/** The retrieval explorer with a BM25 weight that reorders the fixed results. */
export function RagRankLab({ caption }: WidgetProps) {
  const [query, setQuery] = useState(PRESET_QUERIES[0]?.query ?? "");
  const [weight, setWeight] = useState(0.5);
  const baseId = useId();
  const inputId = `${baseId}-query`;
  const weightId = `${baseId}-weight`;
  const rows = rankRows(query, weight);

  return (
    <div className="min-w-0">
      <WidgetHeading title="Retrieval rank lab" caption={caption} />

      <div className="mt-4 min-w-0">
        <label htmlFor={inputId} className={CONTROL_LABEL}>
          Sample query
        </label>
        <input
          id={inputId}
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoComplete="off"
          spellCheck={false}
          className="mt-1 min-h-11 w-full min-w-0 rounded-[var(--radius-3)] border border-[var(--hairline-strong)] bg-[var(--bg)] px-3 text-[var(--ink)]"
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {PRESET_QUERIES.map((preset) => (
          <Button
            key={preset.id}
            variant="secondary"
            size="sm"
            onClick={() => setQuery(preset.query)}
          >
            {preset.query}
          </Button>
        ))}
      </div>

      <div className="mt-4 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <label htmlFor={weightId} className={CONTROL_LABEL}>
            BM25 weight
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
          aria-valuetext={`${Math.round(weight * 100)} percent BM25`}
          onChange={(event) => setWeight(Number(event.target.value))}
          className={RANGE_INPUT}
        />
      </div>

      <p role="status" aria-live="polite" className="mt-3 text-[length:var(--text-small)] text-[var(--ink)]">
        {rows === null
          ? "Enter a preset query."
          : `${rows.length} results for ${query.trim().toLowerCase()}.`}
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
                Dense {row.dense.toFixed(2)} · lexical {row.lexical.toFixed(2)}
              </p>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
