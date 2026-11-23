import type { Difficulty } from "@/lib/types";

export type MetaRowProps = {
  readingMinutes: number;
  difficulty: Difficulty;
  layerOrder: number;
  layerName: string;
};

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  starter: "Starter",
  core: "Core",
  advanced: "Advanced",
};

/** Read time, difficulty and layer for the lesson header. */
export function MetaRow({
  readingMinutes,
  difficulty,
  layerOrder,
  layerName,
}: MetaRowProps) {
  return (
    <ul className="mt-4 flex min-w-0 list-none flex-wrap gap-x-4 gap-y-1 p-0 text-[length:var(--text-small)] text-[var(--ink-muted)]">
      <li>About {readingMinutes} minutes</li>
      <li aria-hidden="true">·</li>
      <li>{DIFFICULTY_LABELS[difficulty]}</li>
      <li aria-hidden="true">·</li>
      <li>
        Layer {layerOrder}: {layerName}
      </li>
    </ul>
  );
}
