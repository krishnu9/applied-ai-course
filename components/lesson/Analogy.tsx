export type AnalogyProps = {
  text: string;
  breaks: string;
};

/**
 * An ELI5 analogy in a light serif panel. The limit line is separated, and it
 * uses no warning tone: an analogy is teaching, not a fault.
 */
export function Analogy({ text, breaks }: AnalogyProps) {
  return (
    <figure className="analogy-panel min-w-0">
      <p className="analogy-label">Analogy</p>
      <p className="analogy-text mt-1">{text}</p>
      <p className="analogy-break">
        <span className="font-medium text-[var(--ink)]">Where it breaks:</span>{" "}
        {breaks}
      </p>
    </figure>
  );
}
