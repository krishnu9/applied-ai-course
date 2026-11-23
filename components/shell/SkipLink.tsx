/**
 * First focusable item on every route. Hidden until focused, then pinned to the
 * top-left as a 44 px target that moves focus into `main#main`.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-[var(--space-4)] focus:top-[var(--space-4)] focus:z-50 focus:inline-flex focus:min-h-11 focus:items-center focus:border focus:border-[var(--focus)] focus:bg-[var(--bg)] focus:px-4 focus:text-[var(--accent)]"
    >
      Skip to content
    </a>
  );
}
