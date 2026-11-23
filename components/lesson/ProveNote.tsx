"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { useProgress } from "@/lib/progress";
import type { LessonSlug, ProveConfig } from "@/lib/types";

export type ProveNoteProps = {
  slug: LessonSlug;
  prove: ProveConfig;
};

type SaveStatus = "idle" | "pending" | "saved" | "cleared";

/** Controlled proof note with a debounced save, flush on blur and unmount. */
export function ProveNote({ slug, prove }: ProveNoteProps) {
  const { state, ready, storage, setProof } = useProgress();

  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<SaveStatus>("idle");

  const pendingRef = useRef<string | null>(null);
  const timerRef = useRef<number | null>(null);

  const baseId = useId();
  const inputId = `${baseId}-note`;
  const statusId = `${baseId}-status`;

  const flush = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const pending = pendingRef.current;
    if (pending === null) return;
    pendingRef.current = null;
    setProof(slug, pending);
    setStatus(pending.trim() === "" ? "cleared" : "saved");
  }, [slug, setProof]);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      const pending = pendingRef.current;
      pendingRef.current = null;
      if (pending !== null) setProof(slug, pending);
    };
  }, [slug, setProof]);

  const storedNote = ready ? (state.lessons[slug]?.proofNote ?? "") : "";
  const displayValue = touched ? value : storedNote;

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    const next = event.target.value.slice(0, prove.maxLength);
    setTouched(true);
    setValue(next);
    pendingRef.current = next;
    setStatus("pending");
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      flush();
    }, prove.debounceMs);
  }

  const savedMessage =
    storage === "ok" ? prove.savedMessage : "Proof saved for this session.";
  const message =
    status === "pending"
      ? "Saving…"
      : status === "saved"
        ? savedMessage
        : status === "cleared"
          ? "Proof cleared."
          : "";

  return (
    <div className="mt-4 min-w-0">
      <label
        htmlFor={inputId}
        className="block text-[length:var(--text-small)] font-medium text-[var(--ink)]"
      >
        {prove.prompt}
      </label>
      <textarea
        id={inputId}
        value={displayValue}
        onChange={handleChange}
        onBlur={flush}
        maxLength={prove.maxLength}
        rows={3}
        placeholder={prove.placeholder}
        aria-describedby={statusId}
        className="mt-2 min-h-24 w-full min-w-0 rounded-[var(--radius-3)] border border-[var(--hairline-strong)] bg-[var(--bg)] p-3 [font-family:var(--font-serif-stack)] text-[length:var(--text-body)] text-[var(--ink)]"
      />
      <div className="mt-1 flex min-w-0 flex-wrap items-center justify-between gap-2">
        <p
          id={statusId}
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className={
            message
              ? "min-h-6 text-[length:var(--text-small)] text-[var(--ink)]"
              : "min-h-6 text-[length:var(--text-small)] text-[var(--ink-muted)]"
          }
        >
          {message}
        </p>
        <p
          aria-hidden="true"
          className="[font-family:var(--font-mono-stack)] text-[length:var(--text-micro)] tabular-nums text-[var(--ink-muted)]"
        >
          {displayValue.length} of {prove.maxLength}
        </p>
      </div>
    </div>
  );
}
