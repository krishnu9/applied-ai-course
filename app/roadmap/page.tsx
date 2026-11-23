import type { Metadata } from "next";
import { RoadmapAction, RoadmapIntro, RoadmapTable } from "@/components/roadmap";
import { ResetProgress } from "@/components/shell";
import { getCourse } from "@/content";

export const metadata: Metadata = {
  title: "The path",
};

const NUMBER_WORDS: Record<number, string> = {
  1: "One",
  2: "Two",
  3: "Three",
  4: "Four",
  5: "Five",
  6: "Six",
  7: "Seven",
  8: "Eight",
  9: "Nine",
  10: "Ten",
};

export default function RoadmapPage() {
  const course = getCourse();
  const totalMinutes = course.lessons.reduce(
    (total, lesson) => total + lesson.readingMinutes,
    0,
  );
  const lessonCount = course.lessons.length;
  const lessonWord = NUMBER_WORDS[lessonCount] ?? String(lessonCount);
  const lessonPhrase = `${lessonWord} lessons.`;
  const minutesPhrase = `${totalMinutes} minutes`;

  return (
    <div className="mx-auto w-full max-w-[var(--main-max)] min-w-0 px-4 py-12 md:px-6 md:py-16 lg:px-8">
      <section aria-labelledby="roadmap-title">
        <h1 id="roadmap-title">The path</h1>
        <p className="mt-3 text-[length:var(--text-body)] text-[var(--ink-muted)]">
          {lessonPhrase}{" "}
          <span className="[font-family:var(--font-mono-stack)] tabular-nums">
            {minutesPhrase}
          </span>{" "}
          in total.
        </p>
      </section>

      <RoadmapAction className="mt-8" />
      <RoadmapTable className="mt-12" />
      <RoadmapIntro className="mt-16" />
      <ResetProgress className="mt-12" />
    </div>
  );
}
