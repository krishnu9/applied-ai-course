import {
  HomeAction,
  LessonLedger,
  LoopRow,
  MappingPanel,
  RunPanel,
} from "@/components/home";
import { Spine } from "@/components/shell";

export default function HomePage() {
  return (
    <div className="min-w-0 lg:pl-[var(--spine-w)]">
      <div className="mx-auto w-full max-w-[var(--main-max)] px-4 py-12 md:px-6 md:py-16 lg:px-8">
        <section aria-labelledby="hero-title">
          <p className="[font-family:var(--font-mono-stack)] text-[length:var(--text-micro)] uppercase tracking-[var(--tracking-micro)] text-[var(--ink-muted)]">
            A written course on AI engineering
          </p>
          <h1
            id="hero-title"
            className="mt-3 max-w-[18ch] text-[length:var(--text-display)] font-semibold tracking-[-0.01em]"
          >
            Repair one broken AI feature. Watch the score climb.
          </h1>
          <p className="mt-4 max-w-[46ch] [font-family:var(--font-serif-stack)] text-[length:var(--text-body)] text-[var(--ink-muted)]">
            Six short lessons. One afternoon. No login.
          </p>
        </section>

        <HomeAction className="mt-8" />
        <RunPanel className="mt-10" />
        <Spine className="mt-8 lg:mt-0" />
        <MappingPanel className="mt-12" />
        <LoopRow className="mt-14" />
        <LessonLedger className="mt-14" />
      </div>
    </div>
  );
}
