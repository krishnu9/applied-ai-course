"use client";

import { useId, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import type { PresetQuery, RetrievalDoc } from "@/lib/types";
import { Button, Panel } from "@/components/ui";
import { cn } from "@/lib/cn";
import { formatScore, rankDocuments } from "./rank";

export type RetrievalExplorerProps = {
  docs: readonly RetrievalDoc[];
  presets: readonly PresetQuery[];
  caption?: string;
  className?: string;
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function queryTerms(query: string): string[] {
  return query.trim().toLowerCase().split(/\s+/).filter(Boolean);
}

function highlightTerms(text: string, terms: readonly string[]): ReactNode {
  if (terms.length === 0) {
    return text;
  }
  const pattern = new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "gi");
  return text.split(pattern).map((segment, index) => {
    const isMatch = terms.some((term) => term === segment.toLowerCase());
    return isMatch ? (
      <mark
        key={index}
        className="bg-[var(--warning-bg)] text-[var(--ink)]"
      >
        {segment}
      </mark>
    ) : (
      <span key={index}>{segment}</span>
    );
  });
}

export function RetrievalExplorer({
  docs,
  presets,
  caption,
  className,
}: RetrievalExplorerProps) {
  const [query, setQuery] = useState("");
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const rowRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const baseId = useId();
  const titleId = `${baseId}-title`;
  const inputId = `${baseId}-query`;
  const hintId = `${baseId}-hint`;

  const { status, hits } = rankDocuments(query, docs, presets);
  const normalizedQuery = query.trim().toLowerCase();
  const terms = status === "results" ? queryTerms(query) : [];

  const liveMessage =
    status === "results"
      ? `${hits.length} ${hits.length === 1 ? "result" : "results"} for ${normalizedQuery}.`
      : status === "no-match"
        ? "No results for that query. Try 'refund policy' or 'billing'."
        : "";

  function focusRow(index: number) {
    rowRefs.current[index]?.focus();
  }

  function handleRowKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    const last = hits.length - 1;
    let next: number | null = null;
    if (event.key === "ArrowDown") {
      next = Math.min(index + 1, last);
    } else if (event.key === "ArrowUp") {
      next = Math.max(index - 1, 0);
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = last;
    }
    if (next === null) {
      return;
    }
    event.preventDefault();
    focusRow(next);
  }

  return (
    <Panel
      as="section"
      labelledBy={titleId}
      className={cn("w-full max-w-full min-w-0", className)}
    >
      <h3 id={titleId}>Retrieval explorer</h3>
      {caption ? (
        <p className="mt-1 text-[length:var(--text-small)] text-[var(--ink-muted)] [overflow-wrap:anywhere]">
          {caption}
        </p>
      ) : null}

      <div className="mt-4 min-w-0">
        <label
          htmlFor={inputId}
          className="block text-[length:var(--text-small)] font-medium text-[var(--ink)]"
        >
          Sample query
        </label>
        <input
          id={inputId}
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setSelectedDocId(null);
          }}
          aria-describedby={hintId}
          autoComplete="off"
          spellCheck={false}
          className="mt-1 min-h-11 w-full min-w-0 rounded-[var(--radius-3)] border border-[var(--hairline-strong)] bg-[var(--bg)] px-3 text-[var(--ink)]"
        />
        <p
          id={hintId}
          className="mt-1 text-[length:var(--text-small)] text-[var(--ink-muted)] [overflow-wrap:anywhere]"
        >
          Preset queries only. Other text returns no results.
        </p>
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {presets.map((preset) => (
          <Button
            key={preset.id}
            variant="secondary"
            size="sm"
            onClick={() => {
              setQuery(preset.query);
              setSelectedDocId(null);
            }}
          >
            {preset.query}
          </Button>
        ))}
      </div>

      {status === "empty" ? (
        <p className="mt-4 text-[var(--ink)]">Choose a sample query.</p>
      ) : null}

      <p
        role="status"
        aria-live="polite"
        className={cn(
          "[overflow-wrap:anywhere]",
          liveMessage === "" ? "sr-only" : "mt-4 text-[var(--ink)]",
        )}
      >
        {liveMessage}
      </p>

      {status === "results" ? (
        <ol className="mt-2 flex list-none flex-col gap-2 p-0">
          {hits.map((hit, index) => {
            const expanded = selectedDocId === hit.docId;
            const detailId = `${baseId}-detail-${hit.docId}`;
            return (
              <li key={hit.docId} className="min-w-0">
                <button
                  type="button"
                  ref={(element) => {
                    rowRefs.current[index] = element;
                  }}
                  aria-expanded={expanded}
                  aria-controls={detailId}
                  onClick={() => {
                    setSelectedDocId(expanded ? null : hit.docId);
                  }}
                  onKeyDown={(event) => {
                    handleRowKeyDown(event, index);
                  }}
                  className="flex min-h-11 w-full min-w-0 flex-col gap-1 rounded-[var(--radius-3)] border border-[var(--hairline)] bg-[var(--bg)] p-2 text-left text-[var(--ink)] hover:bg-[var(--surface)] md:grid md:grid-cols-[2rem_3.5rem_minmax(0,1fr)] md:items-start md:gap-x-2"
                >
                  <span className="flex items-center gap-2 md:contents">
                    <span className="inline-flex items-baseline gap-1">
                      <span className="sr-only">Rank</span>
                      <span className="[font-family:var(--font-mono-stack)] text-[length:var(--text-mono)] [font-variant-numeric:tabular-nums]">
                        {hit.rank}
                      </span>
                    </span>
                    <span className="inline-flex items-baseline gap-1">
                      <span className="sr-only">Score</span>
                      <span className="[font-family:var(--font-mono-stack)] text-[length:var(--text-mono)] [font-variant-numeric:tabular-nums]">
                        {formatScore(hit.score)}
                      </span>
                    </span>
                  </span>
                  <span className="min-w-0 [overflow-wrap:anywhere]">
                    {highlightTerms(hit.text, terms)}
                  </span>
                  <span className="text-[length:var(--text-small)] text-[var(--ink-muted)] [overflow-wrap:anywhere] md:col-start-3">
                    Source: {hit.source}
                  </span>
                </button>
                <p
                  id={detailId}
                  hidden={!expanded}
                  className="mt-1 px-2 text-[length:var(--text-small)] text-[var(--ink-muted)] [overflow-wrap:anywhere]"
                >
                  Matched terms: {terms.join(", ")}.
                </p>
              </li>
            );
          })}
        </ol>
      ) : null}

      <details className="mt-4 min-w-0">
        <summary className="flex min-h-11 cursor-pointer items-center text-[length:var(--text-small)] font-medium text-[var(--ink)]">
          All {docs.length} documents
        </summary>
        <ul className="mt-2 flex list-none flex-col gap-3 p-0">
          {docs.map((doc) => (
            <li key={doc.id} className="min-w-0">
              <p className="[overflow-wrap:anywhere]">
                <span className="[font-family:var(--font-mono-stack)] text-[length:var(--text-mono)]">
                  {doc.id}
                </span>{" "}
                {doc.title}
              </p>
              <p className="text-[length:var(--text-small)] text-[var(--ink-muted)] [overflow-wrap:anywhere]">
                {doc.text}
              </p>
            </li>
          ))}
        </ul>
      </details>
    </Panel>
  );
}
