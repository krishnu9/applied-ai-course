import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Signs the visitor out and sends them to the public landing. Remote progress
 * stays in the database; the progress layer clears the local cache.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // Supabase may be unconfigured. The visitor still lands on `/`.
  }

  return NextResponse.redirect(new URL("/", request.nextUrl.origin), {
    status: 303,
  });
}
