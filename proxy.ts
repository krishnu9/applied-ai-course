import { NextResponse, type NextRequest } from "next/server";
import { safeNextPath } from "@/lib/auth/redirect";
import { isProtectedPath } from "@/lib/auth/routes";
import { updateSession } from "@/lib/supabase/proxy";

/** A post-login target must not point at the auth pages themselves. */
function safeDestination(value: string): string {
  const pathname = value.split(/[?#]/, 1)[0] ?? "/";
  if (pathname === "/login" || pathname === "/auth" || pathname.startsWith("/auth/")) {
    return "/";
  }
  return value;
}

function copyCookies(source: NextResponse, target: NextResponse): void {
  source.cookies.getAll().forEach((cookie) => {
    target.cookies.set(cookie);
  });
}

function markPrivate(response: NextResponse): NextResponse {
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("Vary", "Cookie");
  return response;
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname, search } = request.nextUrl;
  const { response, user } = await updateSession(request);

  if (!user && isProtectedPath(pathname)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    const redirect = NextResponse.redirect(loginUrl);
    copyCookies(response, redirect);
    return markPrivate(redirect);
  }

  if (user && pathname === "/login") {
    const next = safeDestination(
      safeNextPath(request.nextUrl.searchParams.get("next")),
    );
    const redirect = NextResponse.redirect(new URL(next, request.url));
    copyCookies(response, redirect);
    return markPrivate(redirect);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico)$).*)",
  ],
};
