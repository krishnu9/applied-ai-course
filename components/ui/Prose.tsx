import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ProseProps = {
  children: ReactNode;
  className?: string;
};

export function Prose({ children, className }: ProseProps) {
  return (
    <div
      className={cn(
        "max-w-[var(--measure)] [font-family:var(--font-serif-stack)] text-[length:var(--text-body)] leading-[var(--lh-body)]",
        "[&_p]:my-4 [&_ul]:my-4 [&_ol]:my-4 [&_li]:my-1",
        "[&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6",
        "[&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:mt-6 [&_h3]:mb-2",
        "[&_a]:underline [&_code]:text-[length:var(--text-mono)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
