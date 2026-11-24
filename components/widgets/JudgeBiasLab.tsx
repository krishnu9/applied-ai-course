"use client";

import { useId, useState } from "react";
import { WidgetHeading } from "./WidgetChrome";
import type { WidgetProps } from "./types";

const ANSWERS = [
  {
    id: "a",
    label: "Answer A",
    text: "Refunds are available within 30 days. Start a return from the order page.",
  },
  {
    id: "b",
    label: "Answer B",
    text: "You can return an item for a refund within 30 days of delivery. Open the order page to start.",
  },
] as const;

/**
 * A fixed judge with position bias. It always prefers the first answer, so a
 * swap changes the verdict even when the answers stay the same.
 */
export function JudgeBiasLab({ caption }: WidgetProps) {
  const [swapped, setSwapped] = useState(false);
  const toggleId = `${useId()}-swap`;
  const order = swapped ? [ANSWERS[1], ANSWERS[0]] : [ANSWERS[0], ANSWERS[1]];
  const verdict = order[0].label;

  return (
    <div className="min-w-0">
      <WidgetHeading title="Judge bias lab" caption={caption} />

      <div className="mt-4 flex flex-col gap-2">
        {order.map((answer, index) => (
          <div
            key={answer.id}
            className="min-w-0 rounded-[var(--radius-3)] border border-[var(--hairline)] bg-[var(--bg)] p-3"
          >
            <p className="[font-family:var(--font-mono-stack)] text-[length:var(--text-micro)] uppercase tracking-[var(--tracking-micro)] text-[var(--ink-muted)]">
              Position {index + 1} · {answer.label}
            </p>
            <p className="mt-1 [font-family:var(--font-serif-stack)] text-[length:var(--text-small)]">
              {answer.text}
            </p>
          </div>
        ))}
      </div>

      <label
        htmlFor={toggleId}
        className="mt-4 flex min-h-11 cursor-pointer items-center gap-2 text-[length:var(--text-small)] text-[var(--ink)]"
      >
        <input
          id={toggleId}
          type="checkbox"
          checked={swapped}
          onChange={(event) => setSwapped(event.target.checked)}
          className="h-4 w-4 accent-[var(--accent)]"
        />
        Swap the answer order
      </label>

      <p
        role="status"
        aria-live="polite"
        className="mt-3 [font-family:var(--font-serif-stack)] text-[length:var(--text-body)] text-[var(--ink)]"
      >
        Verdict: the judge prefers {verdict}, the answer in the first position.
      </p>
      <p className="mt-1 text-[length:var(--text-small)] text-[var(--ink-muted)]">
        The same two answers get a different verdict when the order changes. This
        is position bias.
      </p>
    </div>
  );
}
