import type { Lesson, Section } from "@/lib/types";
import { BlockRenderer } from "./BlockRenderer";

export type SectionRendererProps = {
  section: Section;
  lesson: Lesson;
};

/** One anchored H2 and its blocks in content order. */
export function SectionRenderer({ section, lesson }: SectionRendererProps) {
  return (
    <section aria-labelledby={section.id} className="mt-10 min-w-0">
      <h2 id={section.id} tabIndex={-1} className="text-balance">
        {section.title}
      </h2>
      <div className="mt-4 min-w-0">
        {section.blocks.map((block) => (
          <BlockRenderer key={block.id} block={block} lesson={lesson} />
        ))}
      </div>
    </section>
  );
}
