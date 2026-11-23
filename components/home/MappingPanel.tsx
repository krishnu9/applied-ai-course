import Link from "next/link";
import { getMappingRows } from "@/content";
import { cn } from "@/lib/cn";

export type MappingPanelProps = {
  className?: string;
};

/** Lowercase the first letter so a row reads as one phrase, not two names. */
function lowerFirst(value: string): string {
  return value.charAt(0).toLowerCase() + value.slice(1);
}

/**
 * The known-to-new bridge: each AI idea is named next to the engineering idea
 * the reader already owns. Every row links to the lesson that teaches it.
 */
export function MappingPanel({ className }: MappingPanelProps) {
  const rows = getMappingRows();

  return (
    <section aria-labelledby="mapping-heading" className={cn(className)}>
      <h2 id="mapping-heading">Mapping</h2>
      <ul className="mt-4 border-t border-[var(--hairline)]">
        {rows.map((row) => (
          <li key={row.id} className="border-b border-[var(--hairline)]">
            <Link
              href={`/lessons/${row.lessonSlug}`}
              className="block min-h-11 py-3 text-[var(--ink)] no-underline hover:underline"
            >
              <span className="[font-family:var(--font-serif-stack)] text-[length:var(--text-body)]">
                {row.aiIdea}
              </span>{" "}
              <span className="text-[var(--ink-muted)]">=</span>{" "}
              <span className="[font-family:var(--font-serif-stack)] text-[length:var(--text-body)] text-[var(--ink-muted)]">
                {lowerFirst(row.engineeringIdea)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
