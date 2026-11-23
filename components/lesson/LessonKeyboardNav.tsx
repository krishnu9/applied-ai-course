"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export type LessonKeyboardNavProps = {
  prevHref: string | null;
  nextHref: string | null;
};

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

/** P1: bracket keys move to the previous or next lesson. */
export function LessonKeyboardNav({ prevHref, nextHref }: LessonKeyboardNavProps) {
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented) return;
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (isTypingTarget(event.target)) return;

      if (event.key === "[") {
        if (!prevHref) return;
        event.preventDefault();
        router.push(prevHref);
      } else if (event.key === "]") {
        if (!nextHref) return;
        event.preventDefault();
        router.push(nextHref);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, prevHref, nextHref]);

  return null;
}
