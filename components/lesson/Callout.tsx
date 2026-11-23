import { cn } from "@/lib/cn";

export type CalloutTone = "note" | "warning" | "production-tip";

export type CalloutProps = {
  tone: CalloutTone;
  title?: string;
  text: string;
};

const toneClasses: Record<CalloutTone, string> = {
  note: "border-[var(--hairline-strong)] bg-[var(--surface)]",
  warning: "border-[var(--warning)] bg-[var(--warning-bg)]",
  "production-tip": "border-[var(--success)] bg-[var(--success-bg)]",
};

const wordClasses: Record<CalloutTone, string> = {
  note: "text-[var(--ink-muted)]",
  warning: "text-[var(--warning)]",
  "production-tip": "text-[var(--success)]",
};

const toneWords: Record<CalloutTone, string> = {
  note: "Note",
  warning: "Warning",
  "production-tip": "Production tip",
};

/** Note, warning or production tip. The tone word keeps colour from being the only signal. */
export function Callout({ tone, title, text }: CalloutProps) {
  return (
    <div
      className={cn(
        "my-6 min-w-0 rounded-[var(--radius-2)] border p-4 md:p-5",
        toneClasses[tone],
      )}
    >
      <p
        className={cn(
          "[font-family:var(--font-mono-stack)] text-[length:var(--text-micro)] uppercase tracking-[var(--tracking-micro)]",
          wordClasses[tone],
        )}
      >
        {toneWords[tone]}
      </p>
      {title ? <h3 className="mt-1 text-[length:var(--text-h3)]">{title}</h3> : null}
      <p className="mt-1 [font-family:var(--font-serif-stack)] text-[length:var(--text-body)]">
        {text}
      </p>
    </div>
  );
}
