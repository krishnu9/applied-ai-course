"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { HeaderProgress } from "./HeaderProgress";

export type SiteHeaderProps = {
  className?: string;
};

const NAV_ITEMS = [
  { href: "/roadmap", label: "Roadmap" },
  { href: "/about", label: "About" },
] as const;

export function SiteHeader({ className }: SiteHeaderProps) {
  const pathname = usePathname();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-[var(--hairline)] bg-[var(--bg)]",
        className,
      )}
    >
      <div className="mx-auto flex min-h-[var(--header-h)] w-full max-w-[var(--header-max)] items-center justify-between gap-2 px-4 md:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center whitespace-nowrap [font-family:var(--font-serif-stack)] text-[length:var(--text-h3)] font-semibold text-[var(--ink)] no-underline"
        >
          lastminute.dev
        </Link>
        <div className="flex min-w-0 items-center gap-2">
          <nav aria-label="Primary" className="flex items-center">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-11 min-w-11 items-center justify-center px-2 text-[length:var(--text-small)]",
                    isActive
                      ? "font-semibold text-[var(--ink)]"
                      : "text-[var(--accent)]",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <HeaderProgress className="shrink-0" />
        </div>
      </div>
    </header>
  );
}
