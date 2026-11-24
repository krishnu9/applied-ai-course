"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { WidgetHeading, WidgetStat } from "./WidgetChrome";
import type { WidgetProps } from "./types";

type Side = "alpha" | "beta";

const START_RATING = 1200;
const K_FACTOR = 32;

function expectedScore(rating: number, opponent: number): number {
  return 1 / (1 + 10 ** ((opponent - rating) / 400));
}

function roundOne(value: number): number {
  return Math.round(value * 10) / 10;
}

/** Two models, one vote at a time, with a live Elo update. */
export function ArenaLab({ caption }: WidgetProps) {
  const [ratings, setRatings] = useState({ alpha: START_RATING, beta: START_RATING });
  const [votes, setVotes] = useState({ alpha: 0, beta: 0 });

  function vote(winner: Side): void {
    const expectedAlpha = expectedScore(ratings.alpha, ratings.beta);
    const scoreAlpha = winner === "alpha" ? 1 : 0;
    const delta = K_FACTOR * (scoreAlpha - expectedAlpha);
    setRatings({
      alpha: roundOne(ratings.alpha + delta),
      beta: roundOne(ratings.beta - delta),
    });
    setVotes((current) => ({ ...current, [winner]: current[winner] + 1 }));
  }

  function reset(): void {
    setRatings({ alpha: START_RATING, beta: START_RATING });
    setVotes({ alpha: 0, beta: 0 });
  }

  return (
    <div className="min-w-0">
      <WidgetHeading title="Arena lab" caption={caption} />

      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => vote("alpha")}>
          Vote Model Alpha
        </Button>
        <Button variant="secondary" onClick={() => vote("beta")}>
          Vote Model Beta
        </Button>
        <Button variant="secondary" onClick={reset}>
          Reset
        </Button>
      </div>

      <dl className="mt-4 grid gap-3 sm:grid-cols-3">
        <WidgetStat label="Model Alpha Elo" value={ratings.alpha.toFixed(1)} />
        <WidgetStat label="Model Beta Elo" value={ratings.beta.toFixed(1)} />
        <WidgetStat label="Votes A / B" value={`${votes.alpha} / ${votes.beta}`} />
      </dl>

      <p role="status" aria-live="polite" className="sr-only">
        {votes.alpha + votes.beta === 0
          ? ""
          : `Model Alpha ${ratings.alpha.toFixed(1)}. Model Beta ${ratings.beta.toFixed(1)}.`}
      </p>
      <p className="mt-3 text-[length:var(--text-small)] text-[var(--ink-muted)]">
        Each vote moves both scores by the same amount in opposite directions. The
        first vote on an even pair moves the winner by 16 points.
      </p>
    </div>
  );
}
