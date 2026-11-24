import type { Lesson, Section } from "@/lib/types";
import { BlockRenderer } from "./BlockRenderer";

export type SectionRendererProps = {
  section: Section;
  lesson: Lesson;
};

/** One anchored H2 and its blocks in content order. */
export function SectionRenderer({ section, lesson }: SectionRendererProps) {
  const isEli5 = section.register === "eli5";

  return (
    <section
      aria-labelledby={section.id}
      className={isEli5 ? "eli5-panel min-w-0" : "mt-10 min-w-0"}
    >
      {isEli5 ? <p className="eli5-label">Explain it simply</p> : null}
      <h2
        id={section.id}
        tabIndex={-1}
        className={isEli5 ? "mt-1 text-balance" : "text-balance"}
      >
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
