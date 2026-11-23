import type { Metadata } from "next";
import Link from "next/link";
import { Prose, buttonStyles } from "@/components/ui";
import { scoreSummary } from "@/content";
import { formatPercent, formatSeconds, formatUsd } from "@/lib/format";

export const metadata: Metadata = {
  title: "About this course",
};

export default function AboutPage() {
  const baseline = scoreSummary([]);
  const repaired = scoreSummary(["retrieval"]);

  return (
    <div className="mx-auto w-full max-w-[var(--main-max)] min-w-0 px-4 py-12 md:px-6 md:py-16 lg:px-8">
      <h1>About this course</h1>

      <Prose className="mt-6">
        <p>
          lastminute.dev is a short, written course for software engineers who
          move into AI work. It does not survey the field. It teaches one habit:
          find the failed layer in an AI feature, choose a design, and defend
          its cost and latency with evidence.
        </p>

        <section aria-labelledby="about-what">
          <h2 id="about-what">What this course is</h2>
          <p>
            One small feature, triage of 40 support tickets, starts broken. The
            lessons repair it one layer at a time: evaluation, prompt design,
            retrieval, agents, fine-tuning, and cost. Each lesson moves from a
            problem to a repaired layer and a sample score that climbs.
            Everything is static. The text, checks, tasks, data and scores are
            stored in the project. No request leaves the page, and no model
            runs. The stack is Next.js, TypeScript, Tailwind CSS, no backend,
            no login, no live model calls.
          </p>
        </section>

        <section aria-labelledby="about-who">
          <h2 id="about-who">Who it serves</h2>
          <p>
            The course is for engineers who can read code and reason about
            systems, but have not shipped an AI feature. If you know what a
            test suite, a ranked cache, a loop guard and a load budget are, you
            already hold the right model. Each AI idea is mapped to an
            engineering idea you know. No machine learning background is
            assumed. No Python expertise is required beyond reading a short
            function.
          </p>
        </section>

        <section aria-labelledby="about-loop">
          <h2 id="about-loop">The four-step loop</h2>
          <p>
            Every lesson follows Read, Check, Build, Prove. You read one
            anchored explanation. You answer the checks and get an explanation
            for every answer. You complete one scoped build task with a
            checklist. You write one sentence: I changed X; the result was Y. A
            layer can be marked repaired only when every check is correct,
            every task step is ticked, and the proof note is not empty. That
            gate turns reading into evidence.
          </p>
        </section>

        <section aria-labelledby="about-sample">
          <h2 id="about-sample">What is sample data</h2>
          <p>
            The scores are fixed sample data. The feature starts at{" "}
            {`${formatPercent(baseline.passRate)} pass, ${formatUsd(
              baseline.costPer1k,
            )} per 1k requests and ${formatSeconds(
              baseline.p95Ms,
            )} p95 latency.`}{" "}
            Each repair moves one layer to its declared values. The retrieval
            repair moves the run to{" "}
            {`${formatPercent(repaired.passRate)} pass, ${formatUsd(
              repaired.costPer1k,
            )} per 1k and ${formatSeconds(repaired.p95Ms)}.`}{" "}
            These numbers make progress visible and comparable. They are not
            benchmarks, and they do not come from a live model or a production
            system. Every panel that shows them carries the label Sample
            evaluation. Fixed data.
          </p>
        </section>

        <section aria-labelledby="about-citation">
          <h2 id="about-citation">Citation policy</h2>
          <p>
            Every lesson is original writing. Where an idea comes from a
            published book, the lesson names the book once as further reading.
            The book is cited once per lesson as further reading. No text or
            figures are reproduced.
          </p>
        </section>

        <section aria-labelledby="about-privacy">
          <h2 id="about-privacy">Privacy</h2>
          <p>
            There is no account, no server and no analytics. Progress stays in
            this browser. Checks, task ticks, proof notes and your last position
            are saved in local storage on your device. Clearing site data
            removes them. If the browser blocks local storage, the course still
            works for the session and shows a banner. Nothing is sent anywhere.
          </p>
        </section>

        <section aria-labelledby="about-independence">
          <h2 id="about-independence">Independence</h2>
          <p>
            lastminute.dev is an independent study project. Independent study
            notes. Not affiliated with the author or publisher. It exists to
            show a working method, not to sell a product, a course or a
            certificate.
          </p>
        </section>
      </Prose>

      <div className="mt-8">
        <Link
          href="/lessons/evaluation"
          className={buttonStyles({ variant: "primary" })}
        >
          Start lesson 1
        </Link>
      </div>
    </div>
  );
}
