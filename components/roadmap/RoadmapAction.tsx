"use client";

import Link from "next/link";
import { buttonStyles } from "@/components/ui";
import { getAllLessons } from "@/content";
import { cn } from "@/lib/cn";
import { isRepaired, useProgress } from "@/lib/progress";

/** Only a live lesson can be opened or repaired. */
const LIVE_LESSONS = getAllLessons().filter(
  (lesson) => lesson.status === "live",
);

export type RoadmapActionProps = {
  className?: string;
};

/**
 * Opens the first live lesson that is not repaired. When every live lesson is
 * repaired the control states that fact and returns to the top of the page.
 */
export function RoadmapAction({ className }: RoadmapActionProps) {
  const { state } = useProgress();

  const firstOpen = LIVE_LESSONS.find(
    (lesson) => !isRepaired(state, lesson.slug),
  );

  if (!firstOpen) {
    return (
      <div className={cn(className)}>
        <Link href="#main" className={buttonStyles({ variant: "secondary" })}>
          {LIVE_LESSONS.length === 0
            ? "No live lessons yet"
            : "All live lessons repaired"}
        </Link>
      </div>
    );
  }

  return (
    <div className={cn(className)}>
      <Link
        href={`/lessons/${firstOpen.slug}`}
        className={buttonStyles({ variant: "primary" })}
      >
        Continue at the first unfinished lesson
      </Link>
    </div>
  );
}
