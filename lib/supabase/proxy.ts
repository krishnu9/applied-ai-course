import { createServerClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv, hasSupabaseEnv } from "./env";

export interface SessionResult {
  /** The response that carries any refreshed auth cookies. */
  response: NextResponse;
  /** The current user, or null when anonymous or unconfigured. */
  user: User | null;
}

/**
 * Refreshes the Supabase session for a proxy request and returns the refreshed
 * cookies together with the user. Without Supabase configuration it returns a
 * passthrough response and a null user, so public pages still render.
 */
export async function updateSession(
  request: NextRequest,
): Promise<SessionResult> {
  const pathname = `${request.nextUrl.pathname}${request.nextUrl.search}`;

  // Forward the requested path so a protected layout can rebuild `next` when
  // the proxy misses a case. The proxy overwrites any client value.
  const withPathname = (): Headers => {
    const headers = new Headers(request.headers);
    headers.set("x-pathname", pathname);
    return headers;
  };

  let response = NextResponse.next({ request: { headers: withPathname() } });

  if (!hasSupabaseEnv()) {
    return { response, user: null };
  }

  const { url, anonKey } = getSupabaseEnv();
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({ request: { headers: withPathname() } });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        } catch {
          // Proxy runs on Node and can normally write cookies. If it cannot,
          // the next request retries the refresh.
        }
      },
    },
  });

  const { data } = await supabase.auth.getUser();

  return { response, user: data.user ?? null };
}
