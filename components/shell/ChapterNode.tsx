import Link from "next/link";
import { cn } from "@/lib/cn";
import type { Chapter } from "@/lib/types";

export type ChapterNodeProps = {
  chapter: Chapter;
  href: string;
  repaired: number;
  total: number;
  ready: boolean;
  isCurrent: boolean;
  /** Rail rows sit in a vertical list; chips sit in a horizontal strip. */
  asRail: boolean;
};

function stateWord(repaired: number, total: number): string {
  if (total > 0 && repaired >= total) return "Complete";
  if (repaired > 0) return "In progress";
  return "Not started";
}

/**
 * One chapter row. The state word carries the state, so the progress rule and
 * the current-chapter fill are decoration only.
 */
export function ChapterNode({
  chapter,
  href,
  repaired,
  total,
  ready,
  isCurrent,
  asRail,
}: ChapterNodeProps) {
  const percent = total > 0 ? Math.min(100, Math.round((repaired / total) * 100)) : 0;

  return (
    <li className={cn("min-w-0", asRail ? "shrink-0 snap-start lg:shrink" : "shrink-0")}>
      <Link
        href={href}
        aria-current={isCurrent ? "true" : undefined}
        className={cn(
          "flex min-h-11 min-w-0 flex-col justify-center gap-1 border px-3 py-2 no-underline",
          asRail && "lg:border-0 lg:border-l-2",
          isCurrent
            ? "border-[var(--accent)] bg-[var(--surface)]"
            : asRail
              ? "border-[var(--hairline)] lg:border-transparent"
              : "border-[var(--hairline)]",
        )}
      >
        <span className="flex items-center justify-between gap-3">
          <span className="[font-family:var(--font-mono-stack)] text-[length:var(--text-micro)] tabular-nums text-[var(--ink-muted)]">
            {String(chapter.number).padStart(2, "0")}
          </span>
          {ready ? (
            <span
              className={cn(
                "[font-family:var(--font-mono-stack)] text-[length:var(--text-micro)]",
                repaired >= total && total > 0
                  ? "text-[var(--success)]"
                  : "text-[var(--ink-muted)]",
              )}
            >
              {stateWord(repaired, total)}
            </span>
          ) : null}
        </span>

        <span className="whitespace-nowrap text-[length:var(--text-small)] font-medium leading-tight text-[var(--ink)] lg:whitespace-normal lg:break-words lg:[hyphens:auto]">
          {chapter.title}
        </span>

        <span className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="h-[2px] min-w-8 flex-1 overflow-hidden bg-[var(--hairline)] lg:max-w-none"
          >
            <span
              className="block h-full bg-[var(--accent)]"
              style={{ width: `${percent}%` }}
            />
          </span>
          <span className="shrink-0 [font-family:var(--font-mono-stack)] text-[length:var(--text-micro)] tabular-nums text-[var(--ink-muted)]">
            {repaired}/{total} {total === 1 ? "lesson" : "lessons"}
          </span>
        </span>
      </Link>
    </li>
  );
}
