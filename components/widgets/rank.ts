import type { PresetQuery, RetrievalDoc } from "@/lib/types";

export interface RetrievalHit {
  rank: number;
  docId: string;
  score: number;
  text: string;
  source: string;
}

export type RankStatus = "empty" | "results" | "no-match";

export interface RankResult {
  status: RankStatus;
  hits: RetrievalHit[];
}

/** Exact normalisation: trim and lowercase only. */
function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function compareDocIds(a: string, b: string): number {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

/**
 * Rank the fixed preset results for a query. This is a lookup, not a search:
 * free text never matches a preset.
 */
export function rankDocuments(
  query: string,
  docs: readonly RetrievalDoc[],
  presets: readonly PresetQuery[],
): RankResult {
  const normalized = normalize(query);
  if (normalized === "") {
    return { status: "empty", hits: [] };
  }

  const preset = presets.find((candidate) => normalize(candidate.query) === normalized);
  if (!preset) {
    return { status: "no-match", hits: [] };
  }

  const docsById = new Map<string, RetrievalDoc>();
  for (const doc of docs) {
    docsById.set(doc.id, doc);
  }

  const bestScores = new Map<string, number>();
  for (const result of preset.results) {
    if (!docsById.has(result.docId)) {
      continue;
    }
    const current = bestScores.get(result.docId);
    if (current === undefined || result.score > current) {
      bestScores.set(result.docId, result.score);
    }
  }

  const ordered: { docId: string; score: number; text: string }[] = [];
  for (const [docId, score] of bestScores) {
    const doc = docsById.get(docId);
    if (doc) {
      ordered.push({ docId, score, text: doc.text });
    }
  }
  ordered.sort((a, b) => b.score - a.score || compareDocIds(a.docId, b.docId));

  if (ordered.length === 0) {
    return { status: "no-match", hits: [] };
  }

  return {
    status: "results",
    hits: ordered.map((entry, index) => ({
      rank: index + 1,
      docId: entry.docId,
      score: entry.score,
      text: entry.text,
      source: entry.docId,
    })),
  };
}

/** The only rounding point for a score. 0.91 -> "0.91". */
export function formatScore(score: number): string {
  return score.toFixed(2);
}
