"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { getChapters, getCourse } from "@/content";
import { getChapterForSlug } from "@/lib/course-registry";
import { isRepaired, useProgress } from "@/lib/progress";
import type { Chapter, LessonSlug, ProgressState } from "@/lib/types";
import { ChapterNode } from "./ChapterNode";

export type SpineProps = {
  className?: string;
};

const CHAPTERS = getChapters();
const LESSON_PREFIX = "/lessons/";
const LIVE_SLUGS = new Set<LessonSlug>(
  getCourse().lessons.map((lesson) => lesson.slug),
);

/**
 * The link goes to the first live lesson in the chapter that is not repaired.
 * When the chapter has no live lesson yet, the first lesson in book order is
 * the target.
 */
function targetFor(chapter: Chapter, state: ProgressState): LessonSlug {
  const live = chapter.lessonSlugs.filter((slug) => LIVE_SLUGS.has(slug));
  const pool = live.length > 0 ? live : chapter.lessonSlugs;
  return pool.find((slug) => !isRepaired(state, slug)) ?? pool[0];
}

/**
 * Chapter rail. Ten chapters, one row each. A lesson route gets a fixed rail at
 * `lg`; every other route gets an in-flow chapter list so the rail never covers
 * page content. Below `lg` the rows form a horizontal strip that scrolls inside
 * itself. The six capstone stages are not shown here.
 */
export function Spine({ className }: SpineProps) {
  const { state, ready } = useProgress();
  const pathname = usePathname();
  const listRef = useRef<HTMLOListElement>(null);

  const currentSlug = pathname.startsWith(LESSON_PREFIX)
    ? pathname.slice(LESSON_PREFIX.length)
    : null;
  const currentChapterId = currentSlug
    ? (getChapterForSlug(currentSlug)?.id ?? null)
    : null;
  const asRail = currentSlug !== null;

  // Centre the current chapter in the phone strip. The effect only moves the
  // strip, never the page.
  useEffect(() => {
    const list = listRef.current;
    if (!list || list.scrollWidth <= list.clientWidth) return;
    const item = list.querySelector<HTMLElement>('[aria-current="true"]');
    if (!item) return;
    const listRect = list.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const delta =
      itemRect.left - listRect.left - (listRect.width - itemRect.width) / 2;
    list.scrollTo({ left: Math.max(0, list.scrollLeft + delta), behavior: "auto" });
  }, [currentChapterId]);

  return (
    <nav
      aria-label="Chapters"
      className={cn(
        "min-w-0",
        asRail &&
          "lg:fixed lg:bottom-0 lg:left-0 lg:top-[var(--header-h)] lg:z-30 lg:w-[var(--spine-w)] lg:overflow-y-auto lg:border-r lg:border-[var(--hairline)]",
        className,
      )}
    >
      <ol
        ref={listRef}
        className={cn(
          "list-none p-0",
          asRail
            ? "flex max-w-full snap-x gap-2 overflow-x-auto px-4 py-2 md:px-6 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0 lg:py-3"
            : "grid grid-cols-1 gap-2 sm:grid-cols-2",
        )}
      >
        {CHAPTERS.map((chapter) => {
          const total = chapter.lessonSlugs.length;
          const repaired = chapter.lessonSlugs.filter((slug) =>
            isRepaired(state, slug),
          ).length;

          return (
            <ChapterNode
              key={chapter.id}
              chapter={chapter}
              href={`/lessons/${targetFor(chapter, state)}`}
              repaired={repaired}
              total={total}
              ready={ready}
              isCurrent={chapter.id === currentChapterId}
              asRail={asRail}
            />
          );
        })}
      </ol>
    </nav>
  );
}
