"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export type ScoreValueProps = {
  value: string;
  ready: boolean;
  className?: string;
};

/** True only when the user allows motion and the number duration is above zero. */
function motionAllowsRoll(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--dur-number")
    .trim();
  return raw !== "" && raw !== "0ms" && raw !== "0s";
}

/**
 * One fixed sample score. It plays the `score-in` roll only when the value
 * changes after the first ready render. A hydration restore and the first
 * paint never roll. Reduced motion and a zero duration change the value in
 * place. The value text is always current; the animation never delays it.
 */
export function ScoreValue({ value, ready, className }: ScoreValueProps) {
  const previousRef = useRef<string | null>(null);
  const seededRef = useRef(false);
  const [roll, setRoll] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!seededRef.current) {
      seededRef.current = true;
      previousRef.current = value;
      return;
    }
    if (previousRef.current === value) return;
    previousRef.current = value;
    if (!motionAllowsRoll()) return;
    // Start the roll after the committed DOM update, so the new text is
    // already in the accessibility tree and the value never waits.
    const frame = window.requestAnimationFrame(() => {
      setAnimating(true);
      setRoll((current) => current + 1);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [ready, value]);

  return (
    <span
      key={roll}
      onAnimationEnd={() => setAnimating(false)}
      className={cn("inline-block", animating && "score-in", className)}
    >
      {value}
    </span>
  );
}
