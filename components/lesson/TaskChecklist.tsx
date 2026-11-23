"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui";
import { useProgress } from "@/lib/progress";
import type { LessonSlug, Task, TaskItemId } from "@/lib/types";

export type TaskChecklistProps = {
  slug: LessonSlug;
  task: Task;
};

/** Five native checkboxes, a live counter and a gated reference solution. */
export function TaskChecklist({ slug, task }: TaskChecklistProps) {
  const { state, toggleTask } = useProgress();
  const [open, setOpen] = useState(false);

  const baseId = useId();
  const titleId = `${baseId}-title`;
  const panelId = `${baseId}-solution`;

  const ticks = new Set<TaskItemId>(state.lessons[slug]?.taskTicks ?? []);
  const done = task.items.filter((item) => ticks.has(item.id)).length;
  const canOpen = done === task.items.length;

  return (
    <section
      aria-labelledby={titleId}
      className="my-6 min-w-0 rounded-[var(--radius-2)] border border-[var(--hairline)] bg-[var(--surface)] p-4 md:p-6"
    >
      <h3 id={titleId}>Build task</h3>
      <p className="mt-1 [overflow-wrap:anywhere] text-[length:var(--text-small)] text-[var(--ink-muted)]">
        {task.scope}
      </p>
      <p
        className="mt-2 [font-family:var(--font-mono-stack)] text-[length:var(--text-small)] tabular-nums text-[var(--ink)]"
        aria-live="polite"
      >
        {`${done} of ${task.items.length} steps done`}
      </p>

      <ul className="mt-4 flex list-none flex-col gap-2 p-0">
        {task.items.map((item) => {
          const inputId = `${baseId}-${item.id}`;
          return (
            <li key={item.id} className="min-w-0">
              <label
                htmlFor={inputId}
                className="flex min-h-11 cursor-pointer items-start gap-3 rounded-[var(--radius-3)] p-1 [overflow-wrap:anywhere]"
              >
                <input
                  id={inputId}
                  type="checkbox"
                  checked={ticks.has(item.id)}
                  onChange={() => toggleTask(slug, item.id)}
                  className="mt-1 size-4 shrink-0 accent-[var(--accent)]"
                />
                <span className="min-w-0 flex-1">{item.label}</span>
              </label>
            </li>
          );
        })}
      </ul>

      <div className="mt-4">
        <Button
          variant="secondary"
          disabled={!canOpen}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? "Hide" : "Show reference solution"}
        </Button>
        {!canOpen ? (
          <p className="mt-2 text-[length:var(--text-small)] text-[var(--ink-muted)]">
            Tick all {task.items.length} steps to open the solution.
          </p>
        ) : null}
      </div>

      <div
        id={panelId}
        role="region"
        aria-label="Reference solution"
        hidden={!open}
        className="mt-4 min-w-0"
      >
        <p className="[font-family:var(--font-mono-stack)] text-[length:var(--text-mono)]">
          {task.solution.filename}
        </p>
        <pre
          tabIndex={0}
          aria-label={`Reference solution: ${task.solution.filename}`}
          className="mt-2 min-w-0 overflow-x-auto rounded-[var(--radius-2)] border border-[var(--hairline)] bg-[var(--bg)] p-3 text-[length:var(--text-mono)] leading-[1.55]"
        >
          <code>{task.solution.code}</code>
        </pre>
      </div>
    </section>
  );
}
