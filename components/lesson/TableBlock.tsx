export type TableBlockProps = {
  columns: readonly string[];
  rows: readonly (readonly string[])[];
  caption?: string;
};

/**
 * A real table with a header scope. The wrapper owns the horizontal scroll, so
 * a wide table never moves the page.
 */
export function TableBlock({ columns, rows, caption }: TableBlockProps) {
  return (
    <figure className="my-6 min-w-0 max-w-full">
      <div className="lesson-table min-w-0 max-w-full overflow-x-auto">
        <table>
          {caption ? <caption>{caption}</caption> : null}
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={`${column}-${index}`} scope="col">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`}>
                {row.map((cell, cellIndex) => (
                  <td key={`cell-${rowIndex}-${cellIndex}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
