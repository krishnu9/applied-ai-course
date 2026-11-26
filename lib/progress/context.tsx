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
import { useAuth } from "@/components/auth/AuthProvider";
import type { LessonSlug, ProgressState, TaskItemId } from "@/lib/types";
import {
  createStore,
  EMPTY_SNAPSHOT,
  type ProgressSnapshot,
  type ProgressStore,
  type ProgressUser,
  type SyncStatus,
} from "./store";
import type { StorageStatus } from "./storage";

export type ProgressApi = {
  state: ProgressState;
  ready: boolean;
  storage: StorageStatus;
  sync: SyncStatus;
  user: ProgressUser | null;
  repair(slug: LessonSlug): void;
  setCheck(slug: LessonSlug, checkId: string, selectedOptionId: string): void;
  toggleTask(slug: LessonSlug, itemId: TaskItemId): void;
  setProof(slug: LessonSlug, text: string): void;
  setPosition(slug: LessonSlug, sectionId: string): void;
  reset(): void;
  retrySync(): void;
  clearLocal(): void;
};

const ProgressContext = createContext<ProgressApi | null>(null);

/** Stable server snapshot: both first trees share this one frozen object. */
function getServerSnapshot(): ProgressSnapshot {
  return EMPTY_SNAPSHOT;
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  // Lazy initializer: one store for the provider's lifetime, never read in render.
  const [store] = useState<ProgressStore>(() => createStore(EMPTY_SNAPSHOT));
  const { user, loading } = useAuth();

  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, getServerSnapshot);

  useEffect(() => {
    store.hydrate();
  }, [store]);

  // Auth is the only source of account identity. Wait for the first check so a
  // signed-in reader is not detached before the session resolves.
  useEffect(() => {
    if (loading) return;
    if (user) {
      store.attachUser({ id: user.id, email: user.email ?? null });
    } else {
      store.detachUser();
    }
  }, [store, loading, user]);

  const value = useMemo<ProgressApi>(
    () => ({
      state: snapshot.state,
      ready: snapshot.ready,
      storage: snapshot.storage,
      sync: snapshot.sync,
      user: snapshot.user,
      repair: store.repair,
      setCheck: store.setCheck,
      toggleTask: store.toggleTask,
      setProof: store.setProof,
      setPosition: store.setPosition,
      reset: store.reset,
      retrySync: store.retrySync,
      clearLocal: store.clearLocal,
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
