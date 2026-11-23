import { CopyButton } from "./CopyButton";
import { OutputPanel } from "./OutputPanel";

export type CodeBlockProps = {
  filename: string;
  language: string;
  code: string;
  output: { label: string; text: string };
};

/** Server-rendered code with filename, language, copy control and fixed output. */
export function CodeBlock({ filename, language, code, output }: CodeBlockProps) {
  return (
    <figure className="my-6 min-w-0">
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-2 rounded-t-[var(--radius-2)] border border-b-0 border-[var(--hairline)] bg-[var(--surface)] px-3 py-2">
        <p className="min-w-0 [overflow-wrap:anywhere] [font-family:var(--font-mono-stack)] text-[length:var(--text-mono)] text-[var(--ink)]">
          {filename}
        </p>
        <div className="flex items-center gap-3">
          <span className="[font-family:var(--font-mono-stack)] text-[length:var(--text-micro)] uppercase tracking-[var(--tracking-micro)] text-[var(--ink-muted)]">
            {language}
          </span>
          <CopyButton code={code} />
        </div>
      </div>
      <pre
        tabIndex={0}
        aria-label={`Code example: ${filename}`}
        className="min-w-0 overflow-x-auto rounded-b-[var(--radius-2)] border border-[var(--hairline)] bg-[var(--bg)] p-3 text-[length:var(--text-mono)] leading-[1.55]"
      >
        <code>{code}</code>
      </pre>
      <div className="mt-2">
        <OutputPanel label={output.label} text={output.text} />
      </div>
    </figure>
  );
}
