export type InterviewQuestion = {
  question: string;
  answer: string;
};

export type InterviewCornerProps = {
  id: string;
  items: readonly InterviewQuestion[];
};

/**
 * The interview corner. The outer section owns the H2, so this block renders no
 * heading of its own; each question is an H3 with its answer as prose. The
 * block keeps its anchor but takes no separate label, so the outer H2 is the
 * one name for the region.
 */
export function InterviewCorner({ id, items }: InterviewCornerProps) {
  return (
    <section id={id} className="interview-corner">
      <div className="mt-4 flex flex-col gap-4">
        {items.map((item, index) => (
          <div key={`${item.question}-${index}`} className="min-w-0">
            <h3 className="text-balance">{item.question}</h3>
            <p className="interview-answer">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
