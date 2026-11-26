const SUPABASE_URL_NAME = "NEXT_PUBLIC_SUPABASE_URL";
const SUPABASE_ANON_KEY_NAME = "NEXT_PUBLIC_SUPABASE_ANON_KEY";

export interface SupabaseEnv {
  url: string;
  anonKey: string;
}

/**
 * Reads the two public Supabase values. This never runs at module load: call
 * it only at request time, inside a function. A missing value throws a clear
 * error so the failure names the variable to set.
 */
export function getSupabaseEnv(): SupabaseEnv {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) {
    throw new Error(
      `Supabase is not configured. Set ${SUPABASE_URL_NAME} and ${SUPABASE_ANON_KEY_NAME}, then restart the server.`,
    );
  }

  return { url, anonKey };
}

/** Non-throwing check for call sites that can degrade without Supabase. */
export function hasSupabaseEnv(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url?.trim() && anonKey?.trim());
}
