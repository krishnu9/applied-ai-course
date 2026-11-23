import type { Layer, Lesson, LessonSummary } from "@/lib/types";
import { LessonHeader } from "./LessonHeader";
import { MetaRow } from "./MetaRow";
import { PrevNext } from "./PrevNext";
import { ProveNote } from "./ProveNote";
import { RepairButton } from "./RepairButton";
import { SectionRenderer } from "./SectionRenderer";

export type LessonArticleProps = {
  lesson: Lesson;
  layer: Layer;
  neighbours: {
    previous: LessonSummary | null;
    next: LessonSummary | null;
  };
};

/** Header, sections, prove note, repair gate, citation and prev/next. */
export function LessonArticle({ lesson, layer, neighbours }: LessonArticleProps) {
  return (
    <article className="min-w-0">
      <LessonHeader lesson={lesson} />
      <MetaRow
        readingMinutes={lesson.readingMinutes}
        difficulty={lesson.difficulty}
        layerOrder={layer.order}
        layerName={layer.name}
      />

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
          layerName={layer.name}
          checks={lesson.checks.map((check) => ({
            id: check.id,
            correctOptionId: check.correctOptionId,
          }))}
          taskItemIds={lesson.task.items.map((item) => item.id)}
          declared={layer.repaired}
        />
      </section>

      <footer className="mt-8 min-w-0">
        <p className="text-[length:var(--text-small)] text-[var(--ink-muted)]">
          {lesson.citation}
        </p>
      </footer>

      <PrevNext prev={neighbours.previous} next={neighbours.next} />
    </article>
  );
}
