import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type BadgeTone = "neutral" | "success" | "warning" | "danger";

export type BadgeProps = {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
};

const toneClasses: Record<BadgeTone, string> = {
  neutral: "border-[var(--hairline)] bg-[var(--surface)] text-[var(--ink-muted)]",
  success: "border-[var(--success)] bg-[var(--success-bg)] text-[var(--success)]",
  warning: "border-[var(--warning)] bg-[var(--warning-bg)] text-[var(--warning)]",
  danger: "border-[var(--danger)] bg-[var(--danger-bg)] text-[var(--danger)]",
};

export function Badge({ tone = "neutral", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--radius-3)] border px-2 py-0.5 [font-family:var(--font-mono-stack)] text-[length:var(--text-micro)] font-medium tracking-[var(--tracking-micro)]",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
