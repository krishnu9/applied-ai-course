import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getChapterForLesson,
  getCourse,
  getLayerForLesson,
  getLesson,
  getNeighbours,
} from "@/content";
import { buttonStyles } from "@/components/ui";
import { Spine } from "@/components/shell";
import {
  LessonActionBar,
  LessonArticle,
  LessonKeyboardNav,
  LessonPosition,
  LessonToc,
} from "@/components/lesson";
import { EXPECTED_LESSON_COUNT } from "@/lib/course-registry";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) return {};
  return {
    title: { absolute: `${lesson.title} — lastminute.dev` },
    description: lesson.outcome.slice(0, 160),
  };
}

function DraftLesson({
  title,
  order,
  chapterNumber,
  chapterTitle,
  previousLive,
}: {
  title: string;
  order: number;
  chapterNumber: number | null;
  chapterTitle: string | null;
  previousLive: { slug: string; title: string } | null;
}) {
  const chapterLabel =
    chapterNumber !== null && chapterTitle !== null
      ? `Chapter ${chapterNumber}: ${chapterTitle}`
      : "Course";

  return (
    <div className="mx-auto w-full max-w-[var(--main-max)] min-w-0 px-4 py-12 md:px-6 md:py-16 lg:px-8">
      <nav aria-label="Breadcrumb">
        <ol className="flex min-w-0 list-none flex-wrap items-center gap-2 p-0 text-[length:var(--text-small)] text-[var(--ink-muted)]">
          <li>
            <Link href="/" className="inline-flex min-h-11 items-center">
              Course
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <span aria-current="page">Lesson {order}</span>
          </li>
        </ol>
      </nav>

      <p className="mt-4 [font-family:var(--font-mono-stack)] text-[length:var(--text-micro)] uppercase tracking-[var(--tracking-micro)] text-[var(--ink-muted)]">
        Lesson {order} of {EXPECTED_LESSON_COUNT} · {chapterLabel}
      </p>
      <h1 className="mt-1 text-balance">{title}</h1>

      <div className="mt-8 rounded-[var(--radius-2)] border border-[var(--hairline)] bg-[var(--surface)] p-4 md:p-6">
        <h2>This lesson is being written.</h2>
        <p className="mt-2 max-w-[var(--measure)] [font-family:var(--font-serif-stack)] text-[length:var(--text-body)] text-[var(--ink-muted)]">
          The lesson is not ready yet. The six live lessons stay open while the
          course grows to 24 lessons.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link
            href={previousLive ? `/lessons/${previousLive.slug}` : "/roadmap"}
            className={buttonStyles({ variant: "primary" })}
          >
            {previousLive
              ? `Previous live lesson: ${previousLive.title}`
              : "Open the roadmap"}
          </Link>
          <Link href="/roadmap" className={buttonStyles({ variant: "secondary" })}>
            Roadmap
          </Link>
        </div>
      </div>
    </div>
  );
}

export default async function LessonPage({ params }: PageProps) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();

  if (lesson.status === "draft") {
    const chapter = getChapterForLesson(lesson.slug);
    const previousLiveLesson = getCourse()
      .lessons.filter((candidate) => candidate.order < lesson.order)
      .at(-1);

    return (
      <DraftLesson
        title={lesson.title}
        order={lesson.order}
        chapterNumber={chapter?.number ?? null}
        chapterTitle={chapter?.title ?? null}
        previousLive={
          previousLiveLesson
            ? { slug: previousLiveLesson.slug, title: previousLiveLesson.title }
            : null
        }
      />
    );
  }

  // A live lesson renders with or without a capstone stage. Only the six
  // capstone lessons move the score.
  const layer = getLayerForLesson(lesson.slug) ?? null;

  const { previous, next } = getNeighbours(lesson.slug);
  const sections = lesson.sections.map((section) => ({
    id: section.id,
    heading:
      section.register === "eli5"
        ? `ELI5: ${section.title}`
        : section.title,
  }));
  const sectionIds = lesson.sections.map((section) => section.id);

  return (
    <div className="min-w-0 lg:pl-[var(--spine-w)]">
      <Spine />

      <div className="mx-auto grid w-full min-w-0 max-w-[calc(var(--main-max)_+_var(--toc-w)_+_var(--space-12))] grid-cols-1 gap-6 px-4 py-6 md:px-6 lg:grid-cols-[minmax(0,var(--main-max))_var(--toc-w)] lg:items-start lg:gap-8 lg:px-8 lg:py-8">
        <div className="min-w-0">
          <LessonArticle
            lesson={lesson}
            layer={layer}
            neighbours={{ previous, next }}
          />
        </div>

        <aside
          aria-label="On this page"
          className="min-w-0 lg:sticky lg:top-[calc(var(--header-h)_+_var(--space-4))]"
        >
          <LessonToc sections={sections} />
        </aside>
      </div>

      <LessonActionBar
        slug={lesson.slug}
        checks={lesson.checks.map((check) => ({
          id: check.id,
          correctOptionId: check.correctOptionId,
        }))}
        taskItemIds={lesson.task.items.map((item) => item.id)}
        next={next}
        declared={layer?.repaired ?? null}
      />

      <LessonPosition slug={lesson.slug} sectionIds={sectionIds} />
      <LessonKeyboardNav
        prevHref={previous ? `/lessons/${previous.slug}` : null}
        nextHref={next ? `/lessons/${next.slug}` : null}
      />
    </div>
  );
}
