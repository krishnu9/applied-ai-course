"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Badge, Button } from "@/components/ui";
import { useProgress } from "@/lib/progress";
import type { Check, LessonSlug } from "@/lib/types";

export type CheckBlockProps = {
  slug: LessonSlug;
  check: Check;
};

type Verdict = "idle" | "correct" | "wrong";

/**
 * One check: controlled choice, submit, verdict and retry. The stored option
 * derives the verdict after hydration, so a correct or wrong answer returns
 * after reload without a new save.
 */
export function CheckBlock({ slug, check }: CheckBlockProps) {
  const { state, ready, setCheck } = useProgress();

  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const userSubmittedRef = useRef(false);
  const retryFocusRef = useRef(false);
  const feedbackRef = useRef<HTMLHeadingElement>(null);

  const baseId = useId();
  const groupName = `${baseId}-options`;
  const explanationId = `${baseId}-explanation`;
  const feedbackHeadingId = `${baseId}-feedback`;

  const storedOption = ready
    ? state.lessons[slug]?.checkAnswers[check.id]?.selectedOptionId
    : undefined;
  const storedValid =
    storedOption !== undefined &&
    check.options.some((option) => option.id === storedOption);
  const effectiveSelected =
    selected ?? (storedValid ? (storedOption ?? null) : null);
  const effectiveSubmitted = submitted || storedValid;

  const verdict: Verdict =
    !effectiveSubmitted || retrying
      ? "idle"
      : effectiveSelected === check.correctOptionId
        ? "correct"
        : "wrong";

  useEffect(() => {
    if (userSubmittedRef.current && (verdict === "correct" || verdict === "wrong")) {
      userSubmittedRef.current = false;
      feedbackRef.current?.focus();
    }
  }, [verdict]);

  useEffect(() => {
    if (verdict !== "idle" || !retryFocusRef.current || effectiveSelected === null) {
      return;
    }
    retryFocusRef.current = false;
    const input = document.getElementById(`${baseId}-${effectiveSelected}`);
    if (input instanceof HTMLInputElement) {
      input.focus();
    }
  }, [verdict, effectiveSelected, baseId]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (effectiveSelected === null) return;
    userSubmittedRef.current = true;
    setSubmitted(true);
    setRetrying(false);
    setShowExplanation(true);
    setCheck(slug, check.id, effectiveSelected);
  }

  function handleRetry() {
    userSubmittedRef.current = false;
    retryFocusRef.current = true;
    setRetrying(true);
  }

  function handleSelect(optionId: string) {
    setSelected(optionId);
  }

  const showMarks = verdict === "correct" || verdict === "wrong";
  const explanationVisible =
    (showExplanation || storedValid) && (verdict !== "idle" || retrying);

  function markFor(optionId: string) {
    if (!showMarks) return null;
    if (optionId === check.correctOptionId) {
      return <Badge tone="success">Correct answer</Badge>;
    }
    if (optionId === effectiveSelected) {
      return <Badge tone="warning">Your answer</Badge>;
    }
    return null;
  }

  const explanationPanelClass =
    verdict === "correct"
      ? "border-[var(--success)] bg-[var(--success-bg)]"
      : verdict === "wrong"
        ? "border-[var(--warning)] bg-[var(--warning-bg)]"
        : "border-[var(--hairline)] bg-[var(--surface)]";

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="my-6 min-w-0 rounded-[var(--radius-2)] border border-[var(--hairline)] bg-[var(--surface)] p-4 md:p-6"
    >
      <fieldset
        className="min-w-0 border-0 p-0"
        aria-describedby={explanationVisible ? explanationId : undefined}
      >
        <legend className="text-[length:var(--text-body)] font-semibold [font-family:var(--font-serif-stack)] text-[var(--ink)]">
          {check.prompt}
        </legend>
        <ul className="mt-4 flex list-none flex-col gap-2 p-0">
          {check.options.map((option) => {
            const inputId = `${baseId}-${option.id}`;
            const mark = markFor(option.id);
            return (
              <li key={option.id} className="min-w-0">
                <label
                  htmlFor={inputId}
                  className="flex min-h-11 cursor-pointer items-start gap-3 rounded-[var(--radius-3)] p-1 [overflow-wrap:anywhere]"
                >
                  <input
                    id={inputId}
                    type="radio"
                    name={groupName}
                    value={option.id}
                    checked={effectiveSelected === option.id}
                    disabled={verdict !== "idle"}
                    onChange={() => handleSelect(option.id)}
                    className="mt-1 size-4 shrink-0 accent-[var(--accent)]"
                  />
                  <span className="min-w-0 flex-1">
                    {option.label}
                    {mark ? (
                      <span className="ml-2 inline-flex align-middle">{mark}</span>
                    ) : null}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {verdict === "idle" ? (
          <Button type="submit" disabled={effectiveSelected === null}>
            Submit
          </Button>
        ) : null}
        {verdict === "wrong" ? (
          <Button variant="secondary" onClick={handleRetry}>
            Try again
          </Button>
        ) : null}
      </div>

      {explanationVisible ? (
        <div className={`mt-4 rounded-[var(--radius-2)] border p-3 ${explanationPanelClass}`}>
          {verdict !== "idle" ? (
            <h3
              id={feedbackHeadingId}
              ref={feedbackRef}
              tabIndex={-1}
              className={
                verdict === "correct"
                  ? "text-[var(--success)]"
                  : "text-[var(--warning)]"
              }
            >
              {verdict === "correct" ? "Correct." : "Not quite."}
            </h3>
          ) : null}
          <p id={explanationId} className="mt-1 [font-family:var(--font-serif-stack)]">
            {check.explanation}
          </p>
        </div>
      ) : null}
    </form>
  );
}
