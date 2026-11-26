import type { Metadata } from "next";
import { RoadmapAction, RoadmapTable } from "@/components/roadmap";
import { ResetProgress } from "@/components/shell";
import { getAllLessons, getChapters } from "@/content";

export const metadata: Metadata = {
  title: "The path",
};

export default function RoadmapPage() {
  const lessons = getAllLessons();
  const lessonCount = lessons.length;
  const chapterCount = getChapters().length;
  const liveMinutes = lessons
    .filter((lesson) => lesson.status === "live")
    .reduce((total, lesson) => total + lesson.readingMinutes, 0);
  const draftCount = lessons.filter(
    (lesson) => lesson.status === "draft",
  ).length;

  return (
    <div className="mx-auto w-full max-w-[var(--main-max)] min-w-0 px-4 py-12 md:px-6 md:py-16 lg:px-8">
      <section aria-labelledby="roadmap-title">
        <h1 id="roadmap-title">The path</h1>
        <p className="mt-3 text-[length:var(--text-body)] text-[var(--ink-muted)]">
          {lessonCount} lessons in {chapterCount} chapters.{" "}
          {draftCount === 0 ? (
            <>
              <span className="[font-family:var(--font-mono-stack)] tabular-nums">
                {liveMinutes} minutes
              </span>{" "}
              in total.
            </>
          ) : (
            <>
              <span className="[font-family:var(--font-mono-stack)] tabular-nums">
                {liveMinutes} minutes
              </span>{" "}
              of live reading; {draftCount}{" "}
              {draftCount === 1 ? "lesson" : "lessons"} in writing.
            </>
          )}
        </p>
      </section>

      <RoadmapAction className="mt-8" />
      <RoadmapTable className="mt-12" />
      <ResetProgress className="mt-12" />
    </div>
  );
}
