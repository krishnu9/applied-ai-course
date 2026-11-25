import type { Metadata } from "next";
import Link from "next/link";
import { Prose, buttonStyles } from "@/components/ui";
import { getAllLessons, getChapters } from "@/content";

export const metadata: Metadata = {
  title: "About this course",
};

export default function AboutPage() {
  const lessons = getAllLessons();
  const lessonCount = lessons.length;
  const chapterCount = getChapters().length;
  const firstLive = lessons.find((lesson) => lesson.status === "live");
  const firstTarget = firstLive ?? lessons[0];
  const taskSteps =
    firstLive?.task.items.length ?? lessons[0]?.task.items.length ?? 0;

  return (
    <div className="mx-auto w-full max-w-[var(--main-max)] min-w-0 px-4 py-12 md:px-6 md:py-16 lg:px-8">
      <h1>About this course</h1>

      <Prose className="mt-6">
        <p>
          lastminute.dev is a written course in AI engineering for software
          engineers. It teaches one habit: find the failed layer in an AI
          system, choose a design, and defend the choice with evidence about
          quality, cost and latency.
        </p>

        <section aria-labelledby="about-what">
          <h2 id="about-what">What this course is</h2>
          <p>
            The course has {lessonCount} lessons in {chapterCount} chapters. It
            covers the interview-core topics of all {chapterCount} chapters:
            the stack, foundation models, evaluation, retrieval and agents,
            fine-tuning, data, serving and architecture. One support-triage
            product runs through every lesson. The reader repairs that product,
            layer by layer.
          </p>
          <p>
            Each chapter teaches one area. Each lesson explains one idea,
            applies it to the triage product, and ends with checks, a build
            task and a proof note. The teaching voice explains the topic first.
            The triage case is the evaluation layer; it does not replace the
            explanation.
          </p>
        </section>

        <section aria-labelledby="about-registers">
          <h2 id="about-registers">Three registers</h2>
          <p>
            Every lesson uses three registers. The main text is a technical
            explanation in ASD-STE100: short sentences, active voice and one
            term for one idea. Each lesson also has ELI5 sections. They use an
            analogy and state where the analogy breaks. A static diagram shows
            the mechanism or the quantity. Flagship lessons add one interactive
            diagram with a single variable.
          </p>
        </section>

        <section aria-labelledby="about-evaluation">
          <h2 id="about-evaluation">The evaluation layer</h2>
          <p>
            The course keeps its evaluation layer. A support-triage product
            starts broken. Lessons repair evaluation, prompts, retrieval,
            agents, fine-tuning and serving cost. Each repair moves one
            capstone stage. Only the capstone lessons change the score. The
            numbers are fixed sample data, not benchmarks, and every panel that
            shows them says so.
          </p>
        </section>

        <section aria-labelledby="about-loop">
          <h2 id="about-loop">The loop</h2>
          <p>
            Every lesson repeats Read, Check, Build, Prove. You read the
            explanation, answer the checks, complete a task with {taskSteps}{" "}
            steps and write one sentence: I changed X; the result was Y. A
            lesson counts as repaired only when every check is correct, every
            step is ticked and the note is not empty.
          </p>
        </section>

        <section aria-labelledby="about-who">
          <h2 id="about-who">Who it serves</h2>
          <p>
            The course is for engineers who can read code and reason about
            systems but have not shipped an AI feature. If you know a test
            suite, a ranked cache, a loop guard and a load budget, you hold the
            right model. Each AI idea is mapped to an engineering idea you know.
            No machine-learning background is assumed.
          </p>
        </section>

        <section aria-labelledby="about-independence">
          <h2 id="about-independence">Independence and sources</h2>
          <p>
            lastminute.dev is an independent study project. It is not affiliated
            with the author or the publisher of AI Engineering. Where an idea
            comes from the book, the lesson names it once as further reading.
            Every lesson is original writing. No book text or figure is
            reproduced.
          </p>
        </section>

        <section aria-labelledby="about-privacy">
          <h2 id="about-privacy">Privacy and stack</h2>
          <p>
            There is no account, no server, no analytics and no live model call.
            Progress stays in this browser, in local storage: checks, task
            ticks, proof notes and your last position. When you clear site
            data, you remove them. If the browser blocks local storage, the
            course still works for the session and shows a banner. The stack is
            Next.js, TypeScript and Tailwind CSS, built as a static export.
          </p>
        </section>
      </Prose>

      <div className="mt-8">
        <Link
          href={firstTarget ? `/lessons/${firstTarget.slug}` : "/roadmap"}
          className={buttonStyles({ variant: "primary" })}
        >
          Start with lesson 1
        </Link>
      </div>
    </div>
  );
}
