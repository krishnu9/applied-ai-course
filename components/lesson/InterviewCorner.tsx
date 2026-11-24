export type InterviewQuestion = {
  question: string;
  answer: string;
};

export type InterviewCornerProps = {
  id: string;
  items: readonly InterviewQuestion[];
};

/**
 * The interview corner. The block owns an anchor, the corner title is an H2 and
 * every question is an H3 with its answer as prose.
 */
export function InterviewCorner({ id, items }: InterviewCornerProps) {
  const headingId = `${id}-heading`;

  return (
    <section id={id} aria-labelledby={headingId} className="interview-corner">
      <h2 id={headingId} tabIndex={-1}>
        Interview corner
      </h2>
      <div className="mt-3 flex flex-col gap-4">
        {items.map((item, index) => (
          <div key={`${item.question}-${index}`} className="min-w-0">
            <h3>{item.question}</h3>
            <p className="interview-answer">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
