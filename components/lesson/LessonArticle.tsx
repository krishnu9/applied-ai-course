import { BASELINE } from "@/lib/course-registry";
import type { Layer, Lesson, LessonSummary } from "@/lib/types";
import { LessonHeader } from "./LessonHeader";
import { PrevNext } from "./PrevNext";
import { ProveNote } from "./ProveNote";
import { RepairButton } from "./RepairButton";
import { SectionRenderer } from "./SectionRenderer";

export type LessonArticleProps = {
  lesson: Lesson;
  /** The capstone stage, or null when this lesson moves no stage. */
  layer: Layer | null;
  neighbours: {
    previous: LessonSummary | null;
    next: LessonSummary | null;
  };
};

/** Header, sections, prove note, repair gate, citation and prev/next. */
export function LessonArticle({ lesson, layer, neighbours }: LessonArticleProps) {
  const stageName = layer?.name ?? "Evaluation";
  const declared = layer?.repaired ?? BASELINE;

  return (
    <article className="min-w-0">
      <LessonHeader lesson={lesson} />

      {lesson.sections.map((section) => (
        <SectionRenderer key={section.id} section={section} lesson={lesson} />
      ))}

      <section id="prove" aria-labelledby="prove-heading" className="mt-10 min-w-0">
        <h2 id="prove-heading" tabIndex={-1}>
          Prove: write your note
        </h2>
        <ProveNote slug={lesson.slug} prove={lesson.prove} />
        <RepairButton
          slug={lesson.slug}
          layerName={stageName}
          checks={lesson.checks.map((check) => ({
            id: check.id,
            correctOptionId: check.correctOptionId,
          }))}
          taskItemIds={lesson.task.items.map((item) => item.id)}
          declared={declared}
          announceGeneric={layer === null}
        />
      </section>

      <footer className="mt-8 min-w-0">
        <p className="text-[length:var(--text-small)] text-[var(--ink-muted)]">
          {lesson.citation}
        </p>
      </footer>

      <PrevNext
        currentSlug={lesson.slug}
        prev={neighbours.previous}
        next={neighbours.next}
      />
    </article>
  );
}
