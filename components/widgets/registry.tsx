"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { InteractiveWidgetId } from "@/lib/types";
import type { WidgetProps } from "./types";

/** Placeholder that reserves height while a widget chunk loads. */
function WidgetSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="interactive-skeleton mt-4 min-h-[16rem]"
    >
      Loading interactive diagram…
    </div>
  );
}

const loading = WidgetSkeleton;

const JudgeBiasLab = dynamic<WidgetProps>(
  () => import("./JudgeBiasLab").then((module) => ({ default: module.JudgeBiasLab })),
  { ssr: false, loading },
);
const ArenaLab = dynamic<WidgetProps>(
  () => import("./ArenaLab").then((module) => ({ default: module.ArenaLab })),
  { ssr: false, loading },
);
const InjectionLab = dynamic<WidgetProps>(
  () => import("./InjectionLab").then((module) => ({ default: module.InjectionLab })),
  { ssr: false, loading },
);
const ContextBudgetLab = dynamic<WidgetProps>(
  () =>
    import("./ContextBudgetLab").then((module) => ({
      default: module.ContextBudgetLab,
    })),
  { ssr: false, loading },
);
const RagRankLab = dynamic<WidgetProps>(
  () => import("./RagRankLab").then((module) => ({ default: module.RagRankLab })),
  { ssr: false, loading },
);
const AgentTrace = dynamic<WidgetProps>(
  () => import("./AgentTrace").then((module) => ({ default: module.AgentTrace })),
  { ssr: false, loading },
);
const LoraMemoryLab = dynamic<WidgetProps>(
  () => import("./LoraMemoryLab").then((module) => ({ default: module.LoraMemoryLab })),
  { ssr: false, loading },
);
const ServingBudget = dynamic<WidgetProps>(
  () => import("./ServingBudget").then((module) => ({ default: module.ServingBudget })),
  { ssr: false, loading },
);

/** The one place where an interactive widget id becomes a component. */
export const WIDGET_COMPONENTS: Record<InteractiveWidgetId, ComponentType<WidgetProps>> = {
  "judge-bias-lab": JudgeBiasLab,
  "arena-lab": ArenaLab,
  "injection-lab": InjectionLab,
  "context-budget-lab": ContextBudgetLab,
  "rag-rank-lab": RagRankLab,
  "agent-trace": AgentTrace,
  "lora-memory-lab": LoraMemoryLab,
  "serving-budget": ServingBudget,
};

export function getWidgetComponent(
  widget: InteractiveWidgetId,
): ComponentType<WidgetProps> {
  return WIDGET_COMPONENTS[widget];
}

export type WidgetHostProps = {
  widget: InteractiveWidgetId;
  caption: string;
};

/**
 * Render one widget by id. A switch keeps each component reference static, so
 * React never creates a component inside a render.
 */
export function WidgetHost({ widget, caption }: WidgetHostProps) {
  switch (widget) {
    case "judge-bias-lab":
      return <JudgeBiasLab caption={caption} />;
    case "arena-lab":
      return <ArenaLab caption={caption} />;
    case "injection-lab":
      return <InjectionLab caption={caption} />;
    case "context-budget-lab":
      return <ContextBudgetLab caption={caption} />;
    case "rag-rank-lab":
      return <RagRankLab caption={caption} />;
    case "agent-trace":
      return <AgentTrace caption={caption} />;
    case "lora-memory-lab":
      return <LoraMemoryLab caption={caption} />;
    case "serving-budget":
      return <ServingBudget caption={caption} />;
    default:
      return null;
  }
}
