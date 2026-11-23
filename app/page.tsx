import { Badge, Panel } from "@/components/ui";
import { getCourse, scoreSummary } from "@/content";
import { formatPercent, formatSeconds, formatUsd } from "@/lib/format";

const MAPPING_ROWS = [
  { id: "eval-set", aiIdea: "Eval set", engineeringIdea: "test suite" },
  { id: "retrieval", aiIdea: "Retrieval", engineeringIdea: "ranked cache" },
  { id: "agent", aiIdea: "Agent", engineeringIdea: "loop with a stop rule" },
  { id: "inference-cost", aiIdea: "Inference cost", engineeringIdea: "load budget" },
] as const;

const LOOP_STEPS = ["Read", "Check", "Build", "Prove"] as const;

export default function HomePage() {
  const metrics = scoreSummary([]);
  const { lessons } = getCourse();

  return (
    <div className="mx-auto w-full max-w-[var(--main-max)] px-4 py-12 md:px-6 md:py-16 lg:px-8">
      <section aria-labelledby="hero-title">
        <p className="[font-family:var(--font-mono-stack)] text-[length:var(--text-micro)] tracking-[var(--tracking-micro)] text-[var(--ink-muted)]">
          A written course on AI engineering
        </p>
        <h1
          id="hero-title"
          className="mt-3 max-w-[18ch] text-[length:var(--text-display)] font-semibold tracking-[-0.01em] [font-family:var(--font-serif-stack)]"
        >
          Repair one broken AI feature. Watch the score climb.
        </h1>
        <p className="mt-4 max-w-[46ch] [font-family:var(--font-serif-stack)] text-[length:var(--text-body)] text-[var(--ink-muted)]">
          Six short lessons. One afternoon. No login.
        </p>
      </section>

      <Panel as="section" labelledBy="run-heading" className="mt-10">
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3 border-b border-[var(--hairline)] pb-4">
          <div className="min-w-0">
            <p className="[font-family:var(--font-mono-stack)] text-[length:var(--text-micro)] tracking-[var(--tracking-micro)] text-[var(--ink-muted)]">
              The run
            </p>
            <h2 id="run-heading" className="mt-1 text-[length:var(--text-h3)]">
              Triage 40 support tickets
            </h2>
          </div>
          <Badge tone="danger">Broken</Badge>
        </div>

        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="min-w-0">
            <dt className="text-[length:var(--text-small)] text-[var(--ink-muted)]">Pass rate</dt>
            <dd className="mt-1 [font-family:var(--font-mono-stack)] text-[length:var(--text-h2)] leading-none tabular-nums">
              {formatPercent(metrics.passRate)}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-[length:var(--text-small)] text-[var(--ink-muted)]">
              Cost per 1k requests
            </dt>
            <dd className="mt-1 [font-family:var(--font-mono-stack)] text-[length:var(--text-h2)] leading-none tabular-nums">
              {formatUsd(metrics.costPer1k)} / 1k
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-[length:var(--text-small)] text-[var(--ink-muted)]">
              p95 latency
            </dt>
            <dd className="mt-1 [font-family:var(--font-mono-stack)] text-[length:var(--text-h2)] leading-none tabular-nums">
              {formatSeconds(metrics.p95Ms)}
            </dd>
          </div>
        </dl>

        <p className="mt-5 [font-family:var(--font-mono-stack)] text-[length:var(--text-micro)] text-[var(--ink-muted)]">
          Sample evaluation. Fixed data.
        </p>
      </Panel>

      <section aria-labelledby="mapping-heading" className="mt-14">
        <h2 id="mapping-heading" className="text-[length:var(--text-h2)]">
          Mapping
        </h2>
        <ul className="mt-4 border-t border-[var(--hairline)]">
          {MAPPING_ROWS.map((row) => (
            <li
              key={row.id}
              className="flex flex-wrap items-baseline gap-x-2 gap-y-1 border-b border-[var(--hairline)] py-3"
            >
              <span className="[font-family:var(--font-serif-stack)] text-[length:var(--text-body)]">
                {row.aiIdea}
              </span>
              <span aria-hidden="true" className="text-[var(--ink-muted)]">
                =
              </span>
              <span className="[font-family:var(--font-serif-stack)] text-[length:var(--text-body)] text-[var(--ink-muted)]">
                {row.engineeringIdea}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="loop-heading" className="mt-14">
        <h2 id="loop-heading" className="text-[length:var(--text-h2)]">
          The loop
        </h2>
        <ol className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
          {LOOP_STEPS.map((step, index) => (
            <li key={step} className="flex items-center gap-3">
              <span className="inline-flex min-h-11 items-center border border-[var(--hairline)] px-3 [font-family:var(--font-mono-stack)] text-[length:var(--text-small)]">
                {step}
              </span>
              {index < LOOP_STEPS.length - 1 ? (
                <span aria-hidden="true" className="text-[var(--ink-muted)]">
                  →
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="ledger-heading" className="mt-14">
        <h2 id="ledger-heading" className="text-[length:var(--text-h2)]">
          Lessons
        </h2>
        <ol className="mt-4 border-t border-[var(--hairline)]">
          {lessons.map((lesson) => (
            <li
              key={lesson.slug}
              className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-4 gap-y-2 border-b border-[var(--hairline)] py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto]"
            >
              <span className="pt-1 [font-family:var(--font-mono-stack)] text-[length:var(--text-micro)] tabular-nums text-[var(--ink-muted)]">
                {String(lesson.order).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <p className="[font-family:var(--font-serif-stack)] text-[length:var(--text-h3)] font-semibold">
                  {lesson.title}
                </p>
                <p className="mt-1 text-[length:var(--text-small)] text-[var(--ink-muted)]">
                  {lesson.outcome}
                </p>
              </div>
              <div className="col-start-2 flex flex-wrap items-center gap-x-4 gap-y-1 sm:col-start-3 sm:justify-end">
                <span className="[font-family:var(--font-mono-stack)] text-[length:var(--text-small)] tabular-nums">
                  {lesson.readingMinutes} min
                </span>
                <span className="text-[length:var(--text-small)] text-[var(--ink-muted)]">
                  Not started
                </span>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
