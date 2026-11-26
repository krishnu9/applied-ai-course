import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "./env";

let cachedClient: SupabaseClient | null = null;

/**
 * The browser Supabase client, created once per tab. Call this only from
 * client code, inside an effect or an event handler. It must never run during
 * server rendering or at module load.
 */
export function createClient(): SupabaseClient {
  if (typeof window === "undefined") {
    throw new Error(
      "The browser Supabase client can only be created in the browser.",
    );
  }

  if (cachedClient) return cachedClient;

  const { url, anonKey } = getSupabaseEnv();
  cachedClient = createBrowserClient(url, anonKey);
  return cachedClient;
}
