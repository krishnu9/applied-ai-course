import {
  CourseIndex,
  HomeAction,
  LoopRow,
  MappingPanel,
  RunPanel,
} from "@/components/home";
import { getAllLessons, getChapters } from "@/content";

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

export default function HomePage() {
  const lessonCount = getAllLessons().length;
  const chapterCount = getChapters().length;
  const chapterWord = NUMBER_WORDS[chapterCount] ?? String(chapterCount);

  return (
    <div className="min-w-0">
      <div className="mx-auto w-full max-w-[var(--main-max)] px-4 py-12 md:px-6 md:py-16 lg:px-8">
        <section aria-labelledby="hero-title">
          <p className="[font-family:var(--font-mono-stack)] text-[length:var(--text-micro)] uppercase tracking-[var(--tracking-micro)] text-[var(--ink-muted)]">
            A written course on AI engineering
          </p>
          <h1
            id="hero-title"
            className="mt-3 max-w-[22ch] text-[length:var(--text-display)] font-semibold tracking-[-0.01em]"
          >
            Learn AI engineering by repairing one system.
          </h1>
          <p className="mt-4 max-w-[46ch] [font-family:var(--font-serif-stack)] text-[length:var(--text-body)] text-[var(--ink-muted)]">
            {lessonCount} lessons. {chapterWord} chapters. One afternoon at a
            time.
          </p>
        </section>

        <HomeAction className="mt-8" />
        <CourseIndex className="mt-14" />
        <RunPanel className="mt-14" />
        <MappingPanel className="mt-14" />
        <LoopRow className="mt-14" />
      </div>
    </div>
  );
}
