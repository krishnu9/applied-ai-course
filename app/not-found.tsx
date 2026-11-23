import type { Metadata } from "next";
import Link from "next/link";
import { buttonStyles } from "@/components/ui";

export const metadata: Metadata = {
  title: "Not found",
};

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-[var(--main-max)] min-w-0 px-4 py-16 md:px-6 md:py-24 lg:px-8">
      <p className="[font-family:var(--font-mono-stack)] text-[length:var(--text-micro)] uppercase tracking-[var(--tracking-micro)] text-[var(--ink-muted)]">
        404
      </p>
      <h1 className="mt-3">This lesson does not exist.</h1>
      <p className="mt-3 text-[length:var(--text-body)] text-[var(--ink-muted)]">
        Check the URL or open the roadmap.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link
          href="/roadmap"
          className={buttonStyles({ variant: "primary" })}
        >
          Open the roadmap
        </Link>
        <Link href="/" className={buttonStyles({ variant: "secondary" })}>
          Back to course
        </Link>
      </div>
    </div>
  );
}
