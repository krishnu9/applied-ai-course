import { cn } from "@/lib/cn";

export type LiveRegionProps = {
  message: string;
  assertive?: boolean;
  className?: string;
};

export function LiveRegion({ message, assertive = false, className }: LiveRegionProps) {
  return (
    <div
      role={assertive ? "alert" : "status"}
      aria-live={assertive ? "assertive" : "polite"}
      aria-atomic="true"
      className={cn("sr-only", className)}
    >
      {message}
    </div>
  );
}
