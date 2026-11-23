"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { LessonSlug, ProgressState, TaskItemId } from "@/lib/types";
import { createStore, EMPTY_SNAPSHOT, type ProgressSnapshot, type ProgressStore } from "./store";
import type { StorageStatus } from "./storage";

export type ProgressApi = {
  state: ProgressState;
  ready: boolean;
  storage: StorageStatus;
  repair(slug: LessonSlug): void;
  setCheck(slug: LessonSlug, checkId: string, selectedOptionId: string): void;
  toggleTask(slug: LessonSlug, itemId: TaskItemId): void;
  setProof(slug: LessonSlug, text: string): void;
  setPosition(slug: LessonSlug, sectionId: string): void;
  reset(): void;
};

const ProgressContext = createContext<ProgressApi | null>(null);

/** Stable server snapshot: both first trees share this one frozen object. */
function getServerSnapshot(): ProgressSnapshot {
  return EMPTY_SNAPSHOT;
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  // Lazy initializer: one store for the provider's lifetime, never read in render.
  const [store] = useState<ProgressStore>(() => createStore(EMPTY_SNAPSHOT));

  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, getServerSnapshot);

  useEffect(() => {
    store.hydrate();
  }, [store]);

  const value = useMemo<ProgressApi>(
    () => ({
      state: snapshot.state,
      ready: snapshot.ready,
      storage: snapshot.storage,
      repair: store.repair,
      setCheck: store.setCheck,
      toggleTask: store.toggleTask,
      setProof: store.setProof,
      setPosition: store.setPosition,
      reset: store.reset,
    }),
    [snapshot, store],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressApi {
  const value = useContext(ProgressContext);
  if (value === null) {
    throw new Error("useProgress must be used inside ProgressProvider.");
  }
  return value;
}
