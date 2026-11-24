"use client";

import { useId } from "react";
import { WidgetHost } from "@/components/widgets/registry";
import type { InteractiveWidgetId } from "@/lib/types";

export type InteractiveBlockProps = {
  widget: InteractiveWidgetId;
  caption: string;
};

/** A labelled panel around one registry widget. */
export function InteractiveBlock({ widget, caption }: InteractiveBlockProps) {
  const baseId = useId();
  const headingId = `${baseId}-interactive`;

  return (
    <section aria-labelledby={headingId} className="interactive-panel min-w-0">
      <h3
        id={headingId}
        className="interactive-label"
      >
        Interactive diagram
      </h3>
      <div className="mt-3 min-w-0">
        <WidgetHost widget={widget} caption={caption} />
      </div>
    </section>
  );
}
