import { getCostModel, getPresetQueries, getRetrievalDocs } from "@/content";
import { CostCalculator, RetrievalExplorer } from "@/components/widgets";
import { Panel } from "@/components/ui";
import type { Block, Lesson } from "@/lib/types";
import { Callout } from "./Callout";
import { CheckBlock } from "./CheckBlock";
import { CodeBlock } from "./CodeBlock";
import { Diagram } from "./Diagram";
import { Prose } from "./Prose";
import { TaskChecklist } from "./TaskChecklist";

export type BlockRendererProps = {
  block: Block;
  lesson: Lesson;
};

function UnavailableBlock() {
  return (
    <Panel className="my-6">
      <p className="[font-family:var(--font-mono-stack)] text-[length:var(--text-micro)] uppercase tracking-[var(--tracking-micro)] text-[var(--ink-muted)]">
        Unavailable block
      </p>
      <p className="mt-1">This block is not available.</p>
    </Panel>
  );
}

/** Block-to-component map. The switch ends with a `never` check. */
export function BlockRenderer({ block, lesson }: BlockRendererProps) {
  switch (block.kind) {
    case "paragraph":
      return <Prose kind="paragraph" text={block.text} />;

    case "list":
      return <Prose kind="list" ordered={block.ordered} items={block.items} />;

    case "code":
      return (
        <CodeBlock
          filename={block.filename}
          language={block.language}
          code={block.code}
          output={block.output}
        />
      );

    case "callout":
      return <Callout tone={block.tone} title={block.title} text={block.text} />;

    case "diagram":
      return <Diagram spec={block.spec} caption={block.caption} alt={block.alt} />;

    case "check": {
      const check = lesson.checks.find((candidate) => candidate.id === block.checkId);
      // A bad check id names no check, so the block cannot render.
      return check ? (
        <CheckBlock slug={lesson.slug} check={check} />
      ) : (
        <UnavailableBlock />
      );
    }

    case "task":
      // The lesson owns one task; a missing task cannot render a checklist.
      return lesson.task ? (
        <TaskChecklist slug={lesson.slug} task={lesson.task} />
      ) : (
        <UnavailableBlock />
      );

    case "widget": {
      if (block.widget === "retrieval-explorer") {
        return (
          <RetrievalExplorer
            docs={getRetrievalDocs()}
            presets={getPresetQueries()}
            caption={block.caption}
            className="my-6"
          />
        );
      }
      if (block.widget === "cost-calculator") {
        return (
          <CostCalculator
            model={getCostModel()}
            caption={block.caption}
            className="my-6"
          />
        );
      }
      // A widget id outside the union names no widget, so the block cannot render.
      return <UnavailableBlock />;
    }

    case "note":
      return <Callout tone="note" text={block.text} />;

    default: {
      const unknownBlock: never = block;
      void unknownBlock;
      if (process.env.NODE_ENV !== "production") {
        console.warn("Unknown lesson block", block);
      }
      return <UnavailableBlock />;
    }
  }
}
