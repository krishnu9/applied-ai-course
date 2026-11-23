import { cn } from "@/lib/cn";

export type SiteFooterProps = {
  className?: string;
};

export function SiteFooter({ className }: SiteFooterProps) {
  return (
    <footer
      className={cn("mt-16 border-t border-[var(--hairline)]", className)}
    >
      <div className="mx-auto w-full max-w-[var(--main-max)] space-y-2 px-4 py-8 md:px-6 lg:px-8">
        <p className="text-[length:var(--text-small)] text-[var(--ink-muted)]">
          Independent study notes. Not affiliated with the author or publisher.
        </p>
        <p className="text-[length:var(--text-small)] text-[var(--ink-muted)]">
          The book is cited once per lesson as further reading. No text or figures are
          reproduced.
        </p>
        <p className="[font-family:var(--font-mono-stack)] text-[length:var(--text-micro)] text-[var(--ink-muted)]">
          © 2026 lastminute.dev
        </p>
      </div>
    </footer>
  );
}
