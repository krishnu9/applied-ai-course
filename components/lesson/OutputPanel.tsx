export type OutputPanelProps = {
  label: string;
  text: string;
};

/** Fixed sample output below a code block. */
export function OutputPanel({ label, text }: OutputPanelProps) {
  return (
    <div className="min-w-0 rounded-[var(--radius-2)] border border-[var(--hairline)] bg-[var(--surface)] p-3">
      <p className="[font-family:var(--font-mono-stack)] text-[length:var(--text-micro)] uppercase tracking-[var(--tracking-micro)] text-[var(--ink-muted)]">
        {label}
      </p>
      <pre className="mt-2 overflow-x-auto text-[length:var(--text-mono)] leading-[1.55]">
        <code>{text}</code>
      </pre>
    </div>
  );
}
