"use client";

import type { User } from "@supabase/supabase-js";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";

export interface AuthState {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthState | null>(null);

/**
 * Auth state for the client tree. It renders `{ user: null, loading: true }`
 * on the server and calls Supabase only after mount, so server rendering never
 * touches the browser client.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;

    const start = async (): Promise<void> => {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        if (!active) return;
        setUser(data.user ?? null);

        const { data: listener } = supabase.auth.onAuthStateChange(
          (_event, session) => {
            if (!active) return;
            setUser(session?.user ?? null);
            setLoading(false);
          },
        );
        unsubscribe = () => listener.subscription.unsubscribe();
      } catch {
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    void start();

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  const value = useMemo<AuthState>(() => ({ user, loading }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const value = useContext(AuthContext);
  if (value === null) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }
  return value;
}
