"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { buttonStyles } from "@/components/ui";
import { cn } from "@/lib/cn";
import { useProgress } from "@/lib/progress";

export type AccountMenuProps = {
  className?: string;
};

/**
 * Account state in the header. It reads from AuthProvider, so it renders the
 * sign-in link on the server and upgrades after mount when a session exists.
 */
export function AccountMenu({ className }: AccountMenuProps) {
  const { user, loading } = useAuth();
  const { clearLocal } = useProgress();

  if (loading) {
    return (
      <span
        aria-hidden="true"
        className={cn("inline-block h-11 w-12 shrink-0", className)}
      />
    );
  }

  if (!user) {
    return (
      <Link
        href="/login?next=/roadmap"
        className={buttonStyles({ variant: "quiet", size: "sm", className })}
      >
        Sign in
      </Link>
    );
  }

  const email = user.email ?? "Signed in";

  return (
    <div className={cn("flex min-w-0 items-center gap-1", className)}>
      <span
        className="hidden min-w-0 max-w-[18ch] truncate text-[length:var(--text-small)] text-[var(--ink-muted)] sm:inline"
        title={email}
      >
        {email}
      </span>
      <form
        action="/auth/signout"
        method="post"
        onSubmit={() => {
          // Clear this browser's cached copy before the server ends the session.
          clearLocal();
        }}
      >
        <button
          type="submit"
          className={buttonStyles({ variant: "quiet", size: "sm" })}
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
