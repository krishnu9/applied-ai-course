import { cn } from "@/lib/cn";

export type LoopRowProps = {
  className?: string;
};

const STEPS = ["Read", "Check", "Build", "Prove"] as const;

/** The one loop every lesson repeats, drawn as a flat row of phases. */
export function LoopRow({ className }: LoopRowProps) {
  return (
    <section aria-labelledby="loop-heading" className={cn(className)}>
      <h2 id="loop-heading">The loop</h2>
      <ol className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
        {STEPS.map((step, index) => (
          <li key={step} className="flex items-center gap-3">
            <span className="inline-flex min-h-11 items-center border border-[var(--hairline)] px-3 [font-family:var(--font-mono-stack)] text-[length:var(--text-small)]">
              {step}
            </span>
            {index < STEPS.length - 1 ? (
              <span aria-hidden="true" className="text-[var(--ink-muted)]">
                →
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
