"use client";

import Link from "next/link";
import { buttonStyles } from "@/components/ui";
import { getCourse } from "@/content";
import { cn } from "@/lib/cn";
import { useProgress } from "@/lib/progress";

const LESSONS = getCourse().lessons;

export type RoadmapActionProps = {
  className?: string;
};

/**
 * Opens the first lesson that is not repaired. When every layer is repaired
 * the control states that fact and returns to the top of the page.
 */
export function RoadmapAction({ className }: RoadmapActionProps) {
  const { state } = useProgress();

  const firstOpen = LESSONS.find(
    (lesson) => state.lessons[lesson.slug]?.status !== "repaired",
  );

  if (!firstOpen) {
    return (
      <div className={cn(className)}>
        <Link
          href="#main"
          className={buttonStyles({ variant: "secondary" })}
        >
          All layers repaired
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
