import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Source_Serif_4 } from "next/font/google";
import type { ReactNode } from "react";
import {
  SiteFooter,
  SiteHeader,
  SkipLink,
  StorageBanner,
} from "@/components/shell";
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
          <SkipLink />
          <SiteHeader />
          <StorageBanner />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <SiteFooter />
        </ProgressProvider>
        {/* PROGRESS-PROVIDER:END */}
      </body>
    </html>
  );
}
