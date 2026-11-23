import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type PanelProps = {
  as?: "div" | "section" | "article";
  tone?: "surface" | "paper";
  labelledBy?: string;
  children: ReactNode;
  className?: string;
};

const toneClasses: Record<NonNullable<PanelProps["tone"]>, string> = {
  surface: "bg-[var(--surface)]",
  paper: "bg-[var(--bg)]",
};

export function Panel({
  as: Tag = "div",
  tone = "surface",
  labelledBy,
  children,
  className,
}: PanelProps) {
  return (
    <Tag
      aria-labelledby={labelledBy}
      className={cn(
        "rounded-[var(--radius-2)] border border-[var(--hairline)] p-4 md:p-6",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
