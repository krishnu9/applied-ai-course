"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { getLayers } from "@/content";
import { useProgress } from "@/lib/progress";
import type { LessonSlug } from "@/lib/types";
import { SpineNode } from "./SpineNode";

export type SpineProps = {
  className?: string;
};

const LAYERS = getLayers();
const LESSON_PREFIX = "/lessons/";

function repairedSet(lessons: Record<string, { status: string }>): Set<LessonSlug> {
  const set = new Set<LessonSlug>();
  for (const layer of LAYERS) {
    if (lessons[layer.lessonSlug]?.status === "repaired") {
      set.add(layer.lessonSlug);
    }
  }
  return set;
}

/**
 * Six-layer evaluation spine. Renders a sticky left rail at `lg`, a six-column
 * strip at `md` and a two-row grid below. The trace plays once per new repair;
 * the first ready render only seeds the baseline.
 */
export function Spine({ className }: SpineProps) {
  const { state, ready } = useProgress();
  const pathname = usePathname();
  const [trace, setTrace] = useState<LessonSlug | null>(null);
  const previousRef = useRef<Set<LessonSlug>>(new Set());
  const seededRef = useRef(false);

  useEffect(() => {
    if (!ready) return;

    const current = repairedSet(state.lessons);

    if (!seededRef.current) {
      seededRef.current = true;
      previousRef.current = current;
      return;
    }

    let newlyRepaired: LessonSlug | null = null;
    for (const slug of current) {
      if (!previousRef.current.has(slug)) {
        newlyRepaired = slug;
        break;
      }
    }

    previousRef.current = current;
    if (newlyRepaired) setTrace(newlyRepaired);
  }, [ready, state]);

  const currentSlug = pathname.startsWith(LESSON_PREFIX)
    ? pathname.slice(LESSON_PREFIX.length)
    : null;

  return (
    <nav
      aria-labelledby="spine-heading"
      className={cn(
        "lg:fixed lg:bottom-0 lg:left-0 lg:top-[var(--header-h)] lg:z-30 lg:w-[var(--spine-w)] lg:overflow-y-auto lg:border-r lg:border-[var(--hairline)]",
        className,
      )}
    >
      <h2 id="spine-heading" className="sr-only">
        Eval spine
      </h2>
      <ol className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-1">
        {LAYERS.map((layer) => (
          <SpineNode
            key={layer.id}
            layer={layer}
            ready={ready}
            isRepaired={state.lessons[layer.lessonSlug]?.status === "repaired"}
            isCurrent={currentSlug === layer.lessonSlug}
            isStart={layer.order === 3}
            justRepaired={trace === layer.lessonSlug}
            onTraceEnd={() => setTrace(null)}
          />
        ))}
      </ol>
      <p className="px-2 py-2 [font-family:var(--font-mono-stack)] text-[length:var(--text-micro)] text-[var(--ink-muted)]">
        Sample evaluation. Fixed data.
      </p>
    </nav>
  );
}
