import type { Metadata } from "next";
import Link from "next/link";
import { Inter, JetBrains_Mono, Source_Serif_4 } from "next/font/google";
import type { ReactNode } from "react";
import { ProgressProvider } from "@/lib/progress";
import "./globals.css";

const serif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-serif-loaded",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-mono-loaded",
});
const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-sans-loaded",
});

export const metadata: Metadata = {
  title: {
    default: "lastminute.dev — Repair one broken AI feature. Watch the score climb.",
    template: "%s — lastminute.dev",
  },
  description: "Six short lessons. One afternoon. No login.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${serif.variable} ${mono.variable} ${sans.variable}`}>
      <body className="bg-[var(--bg)] text-[var(--ink)] antialiased">
        {/* PROGRESS-PROVIDER:START — owned by lib/progress. Mount line only. */}
        <ProgressProvider>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-[var(--space-4)] focus:left-[var(--space-4)] focus:z-50 focus:inline-flex focus:min-h-11 focus:items-center focus:bg-[var(--bg)] focus:px-4 focus:text-[var(--accent)]"
        >
          Skip to content
        </a>
        <header className="sticky top-0 z-40 border-b border-[var(--hairline)] bg-[var(--bg)]">
          <div className="mx-auto flex min-h-[var(--header-h)] w-full max-w-[var(--main-max)] items-center justify-between gap-4 px-4 md:px-6 lg:px-8">
            <Link
              href="/"
              className="[font-family:var(--font-serif-stack)] text-[length:var(--text-h3)] font-semibold text-[var(--ink)] no-underline"
            >
              lastminute.dev
            </Link>
            <nav aria-label="Primary" className="flex items-center gap-1">
              <Link
                href="/roadmap"
                className="inline-flex min-h-11 min-w-11 items-center px-2 text-[length:var(--text-small)]"
              >
                Roadmap
              </Link>
              <Link
                href="/about"
                className="inline-flex min-h-11 min-w-11 items-center px-2 text-[length:var(--text-small)]"
              >
                About
              </Link>
            </nav>
          </div>
        </header>
        <main id="main" tabIndex={-1} className="min-h-[60dvh]">
          {children}
        </main>
        <footer className="mt-16 border-t border-[var(--hairline)]">
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
        </ProgressProvider>
        {/* PROGRESS-PROVIDER:END */}
      </body>
    </html>
  );
}
