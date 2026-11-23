import Link from "next/link";
import { Badge } from "@/components/ui";
import { cn } from "@/lib/cn";
import { formatPercent, formatSeconds, formatUsd } from "@/lib/format";
import type { Layer } from "@/lib/types";

export type SpineNodeProps = {
  layer: Layer;
  isRepaired: boolean;
  isCurrent: boolean;
  isStart: boolean;
  justRepaired: boolean;
  onTraceEnd: () => void;
};

/**
 * One spine node. Lives inside the `Spine` client boundary, so it carries no
 * directive. The state word carries the state; the dot is decorative.
 */
export function SpineNode({
  layer,
  isRepaired,
  isCurrent,
  isStart,
  justRepaired,
  onTraceEnd,
}: SpineNodeProps) {
  const metrics = isRepaired ? layer.repaired : layer.baseline;
  const stateWord = isRepaired ? "Repaired" : "Broken";
  const dotClass = isRepaired ? "bg-[var(--success)]" : "bg-[var(--danger)]";
  // The rail is narrow, so it shows the first word. The full name stays in the
  // accessible name and in the link title.
  const shortName = layer.name.split(" ")[0];

  return (
    <li className="relative min-w-0">
      <Link
        href={`/lessons/${layer.lessonSlug}`}
        title={layer.name}
        aria-current={isCurrent ? "page" : undefined}
        className={cn(
          "flex min-h-11 min-w-0 flex-col gap-0.5 px-2 py-1.5 no-underline",
          isCurrent && "bg-[var(--surface)]",
        )}
      >
        <span className="flex items-center justify-between gap-1">
          <span className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className={cn("inline-block size-2 shrink-0 rounded-full", dotClass)}
            />
            <span className="[font-family:var(--font-mono-stack)] text-[length:var(--text-micro)] tabular-nums text-[var(--ink-muted)]">
              {String(layer.order).padStart(2, "0")}
            </span>
          </span>
          <span className="[font-family:var(--font-mono-stack)] text-[length:var(--text-micro)] text-[var(--ink-muted)]">
            {stateWord}
          </span>
        </span>

        <span className="break-words text-[length:var(--text-small)] font-medium leading-tight text-[var(--ink)]">
          <span aria-hidden="true">{shortName}</span>
          <span className="sr-only">{layer.name}</span>
        </span>

        <span className="flex flex-col [font-family:var(--font-mono-stack)] text-[length:var(--text-micro)] leading-tight tabular-nums text-[var(--ink-muted)]">
          <span>Pass {formatPercent(metrics.passRate)}</span>
          <span>Cost {formatUsd(metrics.costPer1k)} / 1k</span>
          <span>p95 {formatSeconds(metrics.p95Ms)}</span>
        </span>

        {isStart ? (
          <Badge tone="neutral" className="mt-1 self-start">
            Start here
          </Badge>
        ) : null}
      </Link>

      {justRepaired ? (
        <span
          aria-hidden="true"
          onAnimationEnd={onTraceEnd}
          className={cn(
            "spine-trace absolute right-2 top-2 inline-block size-2 rounded-full",
            dotClass,
          )}
        />
      ) : null}
    </li>
  );
}
