import { cn } from "@/lib/cn";

export type RuleProps = {
  className?: string;
};

export function Rule({ className }: RuleProps) {
  return (
    <hr
      role="presentation"
      className={cn("h-px border-0 bg-[var(--hairline)]", className)}
    />
  );
}
