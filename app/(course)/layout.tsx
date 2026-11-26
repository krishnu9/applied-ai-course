import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { safeNextPath } from "@/lib/auth/redirect";
import { getUser } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Defense in depth for the private course. The proxy is the gate; this layout
 * checks the session again so a proxy miss cannot expose a course page.
 */
export default async function CourseLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    const headerList = await headers();
    const requested = headerList.get("x-pathname");
    const next = requested ? safeNextPath(requested) : "/roadmap";
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }

  return <>{children}</>;
}
