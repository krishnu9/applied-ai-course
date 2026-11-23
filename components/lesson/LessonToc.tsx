"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent, MouseEvent } from "react";
import { cn } from "@/lib/cn";

export type LessonTocSection = {
  id: string;
  heading: string;
};

export type LessonTocProps = {
  sections: readonly LessonTocSection[];
  className?: string;
};

const TOP_OFFSET = 88;

/**
 * Section links with an IntersectionObserver active state. Below 768 px the
 * list sits behind an "On this page" disclosure that Escape closes.
 */
export function LessonToc({ sections, className }: LessonTocProps) {
  const [activeId, setActiveId] = useState<string | null>(
    sections[0]?.id ?? null,
  );
  const [open, setOpen] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const rafRef = useRef<number | null>(null);
  const labelId = `${useId()}-toc-label`;
  const panelId = `${useId()}-toc-panel`;

  const sectionIds = sections.map((section) => section.id);
  const idsKey = sectionIds.join("|");

  useEffect(() => {
    const ids = idsKey === "" ? [] : idsKey.split("|");
    if (ids.length === 0) return;

    const compute = () => {
      let firstVisible: string | null = null;
      let lastAbove: string | null = null;
      const boundary = window.innerHeight * 0.4;
      for (const id of ids) {
        const element = document.getElementById(id);
        if (!element) continue;
        const rect = element.getBoundingClientRect();
        if (rect.bottom > TOP_OFFSET && rect.top < boundary) {
          firstVisible = id;
          break;
        }
        if (rect.top <= TOP_OFFSET) lastAbove = id;
      }
      setActiveId(firstVisible ?? lastAbove ?? ids[0] ?? null);
    };

    const observer = new IntersectionObserver(
      () => {
        if (rafRef.current !== null) return;
        rafRef.current = window.requestAnimationFrame(() => {
          rafRef.current = null;
          compute();
        });
      },
      { rootMargin: `-${TOP_OFFSET}px 0px -60% 0px`, threshold: 0 },
    );

    for (const id of ids) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }
    compute();

    return () => {
      observer.disconnect();
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [idsKey]);

  if (sections.length === 0) return null;

  function handleClick(event: MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault();
    const element = document.getElementById(id);
    if (!element) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    element.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    element.focus({ preventScroll: true });
    setActiveId(id);
    setOpen(false);
    if (typeof window.history?.replaceState === "function") {
      window.history.replaceState(null, "", `#${id}`);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Escape" || !open) return;
    event.preventDefault();
    setOpen(false);
    buttonRef.current?.focus();
  }

  return (
    <nav
      aria-labelledby={labelId}
      onKeyDown={handleKeyDown}
      className={cn("min-w-0", className)}
    >
      <p
        id={labelId}
        className="hidden [font-family:var(--font-mono-stack)] text-[length:var(--text-micro)] uppercase tracking-[var(--tracking-micro)] text-[var(--ink-muted)] md:block"
      >
        On this page
      </p>

      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
        className="flex min-h-11 w-full items-center justify-between gap-2 rounded-[var(--radius-3)] border border-[var(--hairline-strong)] bg-[var(--bg)] px-3 text-left text-[length:var(--text-small)] font-medium text-[var(--ink)] md:hidden"
      >
        On this page
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>

      <div
        id={panelId}
        className={cn(
          open
            ? "fixed inset-x-0 bottom-0 z-40 max-h-[70vh] overflow-y-auto border-t border-[var(--hairline)] bg-[var(--bg)] p-4 pb-[calc(var(--space-6)+env(safe-area-inset-bottom))] md:static md:z-auto md:max-h-none md:overflow-visible md:border-0 md:bg-transparent md:p-0"
            : "hidden md:block",
        )}
      >
        <ol className="mt-2 flex list-none flex-col gap-1 p-0">
          {sections.map((section) => {
            const isActive = activeId === section.id;
            return (
              <li key={section.id} className="min-w-0">
                <a
                  href={`#${section.id}`}
                  aria-current={isActive ? "true" : undefined}
                  onClick={(event) => handleClick(event, section.id)}
                  className={cn(
                    "block min-h-11 rounded-[var(--radius-3)] px-2 py-2 text-[length:var(--text-small)] [overflow-wrap:anywhere] no-underline",
                    isActive
                      ? "bg-[var(--surface)] font-medium text-[var(--ink)]"
                      : "text-[var(--ink-muted)] hover:text-[var(--ink)]",
                  )}
                >
                  {section.heading}
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
