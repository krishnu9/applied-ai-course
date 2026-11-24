import { Panel } from "@/components/ui";
import type { Block, InteractiveWidgetId, Lesson } from "@/lib/types";
import { Analogy } from "./Analogy";
import { Callout } from "./Callout";
import { CheckBlock } from "./CheckBlock";
import { CodeBlock } from "./CodeBlock";
import { Diagram } from "./Diagram";
import { InteractiveBlock } from "./InteractiveBlock";
import { InterviewCorner } from "./InterviewCorner";
import { Prose } from "./Prose";
import { TableBlock } from "./TableBlock";
import { TaskChecklist } from "./TaskChecklist";

export type BlockRendererProps = {
  block: Block;
  lesson: Lesson;
};

const LEGACY_WIDGETS: Record<string, InteractiveWidgetId> = {
  "retrieval-explorer": "rag-rank-lab",
  "cost-calculator": "serving-budget",
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
      return (
        <Diagram
          variant={block.variant}
          spec={block.spec}
          caption={block.caption}
          alt={block.alt}
        />
      );

    case "analogy":
      return <Analogy text={block.text} breaks={block.breaks} />;

    case "table":
      return (
        <TableBlock
          columns={block.columns}
          rows={block.rows}
          caption={block.caption}
        />
      );

    case "interview":
      return <InterviewCorner id={block.id} items={block.items} />;

    case "interactive":
      return <InteractiveBlock widget={block.widget} caption={block.caption} />;

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
      // The two old widget ids now point at the registry components.
      const widget = LEGACY_WIDGETS[block.widget];
      return widget ? (
        <InteractiveBlock widget={widget} caption={block.caption} />
      ) : (
        <UnavailableBlock />
      );
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
