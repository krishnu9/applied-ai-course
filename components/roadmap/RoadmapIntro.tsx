import { getPlannedTopics } from "@/content";
import { cn } from "@/lib/cn";

export type RoadmapIntroProps = {
  className?: string;
};

/**
 * Topics that belong after the core course. Titles only; the demo gives no
 * dates and no promises.
 */
export function RoadmapIntro({ className }: RoadmapIntroProps) {
  const topics = getPlannedTopics();

  return (
    <section aria-labelledby="planned-heading" className={cn(className)}>
      <h2 id="planned-heading">Planned, not in this demo</h2>
      <p className="mt-2 max-w-[var(--measure)] text-[length:var(--text-small)] text-[var(--ink-muted)]">
        Later lessons in the same format. No dates, and nothing on this page
        depends on them.
      </p>
      <ul className="mt-4 border-t border-[var(--hairline)]">
        {topics.map((topic) => (
          <li
            key={topic.id}
            className="border-b border-[var(--hairline)] py-3 [font-family:var(--font-serif-stack)] text-[length:var(--text-body)]"
          >
            {topic.title}
          </li>
        ))}
      </ul>
    </section>
  );
}
