import "server-only";

import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getSupabaseEnv, hasSupabaseEnv } from "./env";

/**
 * A request-scoped Supabase client. Create a new one for every request; never
 * share it. Cookie writes can fail inside a Server Component, where cookies
 * are read-only, so both cookie methods swallow that case. The proxy refreshes
 * the session and writes the refreshed cookies.
 */
export async function createClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies();
  const { url, anonKey } = getSupabaseEnv();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        try {
          return cookieStore.getAll();
        } catch {
          return [];
        }
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot write cookies. The proxy handles refresh.
        }
      },
    },
  });
}

/**
 * The signed-in user for this request, or null. Returns null when Supabase is
 * not configured, so a protected layout can still redirect instead of crash.
 */
export async function getUser(): Promise<User | null> {
  if (!hasSupabaseEnv()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user ?? null;
}
