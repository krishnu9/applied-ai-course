export type WidgetHeadingProps = {
  title: string;
  caption?: string;
};

/** Shared title and caption for an interactive widget. */
export function WidgetHeading({ title, caption }: WidgetHeadingProps) {
  return (
    <div className="min-w-0">
      <h4 className="text-[length:var(--text-h3)] font-semibold text-[var(--ink)]">
        {title}
      </h4>
      {caption ? (
        <p className="mt-1 text-[length:var(--text-small)] text-[var(--ink-muted)] [overflow-wrap:anywhere]">
          {caption}
        </p>
      ) : null}
    </div>
  );
}

export type WidgetStatProps = {
  label: string;
  value: string;
};

/** One labelled number in a result row. Use inside a `<dl>`. */
export function WidgetStat({ label, value }: WidgetStatProps) {
  return (
    <div className="min-w-0">
      <dt className="text-[length:var(--text-small)] text-[var(--ink-muted)]">
        {label}
      </dt>
      <dd className="mt-1 [font-family:var(--font-mono-stack)] text-[length:var(--text-h3)] [font-variant-numeric:tabular-nums] text-[var(--ink)] [overflow-wrap:anywhere]">
        {value}
      </dd>
    </div>
  );
}

/** Shared label style for a widget control. */
export const CONTROL_LABEL =
  "block text-[length:var(--text-small)] font-medium text-[var(--ink)]";

/** Shared range input style. */
export const RANGE_INPUT =
  "mt-2 block min-h-11 w-full accent-[var(--accent)]";
