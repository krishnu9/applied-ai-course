import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCourse,
  getLayerForLesson,
  getLesson,
  getNeighbours,
} from "@/content";
import { Spine } from "@/components/shell";
import {
  LessonActionBar,
  LessonArticle,
  LessonKeyboardNav,
  LessonPosition,
  LessonToc,
} from "@/components/lesson";
import type { LessonSlug } from "@/lib/types";

export const dynamicParams = false;

export function generateStaticParams(): { slug: LessonSlug }[] {
  return getCourse().lessons.map(({ slug }) => ({ slug }));
}

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

export default async function LessonPage({ params }: PageProps) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();

  const layer = getLayerForLesson(lesson.slug);
  if (!layer) notFound();

  const { previous, next } = getNeighbours(lesson.slug);
  const sections = lesson.sections.map((section) => ({
    id: section.id,
    heading: section.title,
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
        layerName={layer.name}
        checks={lesson.checks.map((check) => ({
          id: check.id,
          correctOptionId: check.correctOptionId,
        }))}
        taskItemIds={lesson.task.items.map((item) => item.id)}
        next={next}
        declared={layer.repaired}
      />

      <LessonPosition slug={lesson.slug} sectionIds={sectionIds} />
      <LessonKeyboardNav
        prevHref={previous ? `/lessons/${previous.slug}` : null}
        nextHref={next ? `/lessons/${next.slug}` : null}
      />
    </div>
  );
}
