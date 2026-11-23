import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type EmptyStateProps = {
  title: string;
  body?: ReactNode;
  action?: ReactNode;
  headingLevel?: 2 | 3;
  className?: string;
};

export function EmptyState({
  title,
  body,
  action,
  headingLevel = 2,
  className,
}: EmptyStateProps) {
  const Heading = headingLevel === 3 ? "h3" : "h2";

  return (
    <div
      className={cn(
        "rounded-[var(--radius-2)] border border-[var(--hairline)] bg-[var(--surface)] p-6",
        className,
      )}
    >
      <Heading className="text-[length:var(--text-h3)]">{title}</Heading>
      {body ? (
        <div className="mt-2 [font-family:var(--font-serif-stack)] text-[var(--ink-muted)]">
          {body}
        </div>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
