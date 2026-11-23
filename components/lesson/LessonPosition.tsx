"use client";

import { useEffect, useRef } from "react";
import { useProgress } from "@/lib/progress";
import type { LessonSlug } from "@/lib/types";

export type LessonPositionProps = {
  slug: LessonSlug;
  sectionIds: readonly string[];
};

const TOP_OFFSET = 88;
const WRITE_INTERVAL_MS = 1000;

/** Restore the saved section once, then persist section changes at most once per second. */
export function LessonPosition({ slug, sectionIds }: LessonPositionProps) {
  const { state, ready, setPosition } = useProgress();

  const restoredRef = useRef(false);
  const pausedRef = useRef(true);
  const lastWrittenRef = useRef<string | null>(null);
  const lastWriteAtRef = useRef(0);
  const pendingRef = useRef<string | null>(null);
  const timerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const computeRef = useRef<(() => void) | null>(null);

  const savedSlug = state.lastLessonSlug;
  const savedSectionId = state.lastSectionId;
  const idsKey = sectionIds.join("|");

  useEffect(() => {
    if (!ready || restoredRef.current) return;
    restoredRef.current = true;

    const canRestore =
      savedSlug === slug &&
      savedSectionId !== null &&
      sectionIds.includes(savedSectionId) &&
      window.location.hash === "";

    if (!canRestore || savedSectionId === null) {
      pausedRef.current = false;
      return;
    }

    const element = document.getElementById(savedSectionId);
    if (!element) {
      pausedRef.current = false;
      return;
    }

    pausedRef.current = true;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    element.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    window.setTimeout(() => {
      pausedRef.current = false;
      computeRef.current?.();
    }, 700);
  }, [ready, slug, savedSlug, savedSectionId, sectionIds]);

  useEffect(() => {
    const ids = idsKey === "" ? [] : idsKey.split("|");
    if (!ready || ids.length === 0) return;

    lastWriteAtRef.current = Date.now() - WRITE_INTERVAL_MS;

    const computeActive = (): string | null => {
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
      return firstVisible ?? lastAbove;
    };

    const writePending = () => {
      timerRef.current = null;
      const id = pendingRef.current;
      pendingRef.current = null;
      if (!id || pausedRef.current || id === lastWrittenRef.current) return;
      lastWrittenRef.current = id;
      lastWriteAtRef.current = Date.now();
      setPosition(slug, id);
    };

    const schedule = (id: string | null) => {
      if (!id || pausedRef.current || id === lastWrittenRef.current) return;
      pendingRef.current = id;
      if (timerRef.current !== null) return;
      const wait = Math.max(
        0,
        WRITE_INTERVAL_MS - (Date.now() - lastWriteAtRef.current),
      );
      timerRef.current = window.setTimeout(writePending, wait);
    };

    const observer = new IntersectionObserver(
      () => {
        if (rafRef.current !== null) return;
        rafRef.current = window.requestAnimationFrame(() => {
          rafRef.current = null;
          schedule(computeActive());
        });
      },
      { rootMargin: `-${TOP_OFFSET}px 0px -60% 0px`, threshold: 0 },
    );

    computeRef.current = () => {
      schedule(computeActive());
    };

    for (const id of ids) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }

    return () => {
      observer.disconnect();
      computeRef.current = null;
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [ready, slug, idsKey, setPosition]);

  return null;
}
