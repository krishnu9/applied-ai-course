import type { Block } from "@/lib/types";

type DiagramSpec = Extract<Block, { kind: "diagram" }>["spec"];

export type DiagramProps = {
  spec: DiagramSpec;
  caption: string;
  alt: string;
};

const NODE_W = 132;
const NODE_H = 44;
const GAP_X = 44;
const GAP_Y = 16;
const PAD = 8;

type PositionedNode = {
  id: string;
  label: string;
  x: number;
  y: number;
};

type EdgePath = {
  id: string;
  path: string;
};

type Layout = {
  nodes: PositionedNode[];
  edges: EdgePath[];
  width: number;
  height: number;
};

/** Longest-path column layout: one column per dependency depth. */
function layoutDiagram(spec: DiagramSpec): Layout {
  const ids = spec.nodes.map((node) => node.id);
  const known = new Set(ids);
  const outgoing = new Map<string, string[]>(ids.map((id) => [id, []]));
  const incomingCount = new Map<string, number>(ids.map((id) => [id, 0]));

  for (const [from, to] of spec.edges) {
    if (!known.has(from) || !known.has(to) || from === to) continue;
    outgoing.get(from)?.push(to);
    incomingCount.set(to, (incomingCount.get(to) ?? 0) + 1);
  }

  const depth = new Map<string, number>(ids.map((id) => [id, 0]));
  const queue = ids.filter((id) => (incomingCount.get(id) ?? 0) === 0);
  const remaining = new Map(incomingCount);
  const visited = new Set<string>();

  let cursor = 0;
  while (cursor < queue.length) {
    const id = queue[cursor];
    cursor += 1;
    visited.add(id);
    for (const next of outgoing.get(id) ?? []) {
      depth.set(next, Math.max(depth.get(next) ?? 0, (depth.get(id) ?? 0) + 1));
      remaining.set(next, (remaining.get(next) ?? 1) - 1);
      if ((remaining.get(next) ?? 0) === 0) queue.push(next);
    }
  }

  const columns = new Map<number, string[]>();
  for (const id of ids) {
    // A cycle leaves a node unvisited; keep it in the last column, not on top of a root.
    const column = visited.has(id) ? (depth.get(id) ?? 0) : 0;
    const list = columns.get(column) ?? [];
    list.push(id);
    columns.set(column, list);
  }

  const columnKeys = [...columns.keys()].sort((a, b) => a - b);
  const rowCount = Math.max(
    ...columnKeys.map((key) => columns.get(key)?.length ?? 0),
    1,
  );
  const nodes: PositionedNode[] = [];
  const position = new Map<string, PositionedNode>();

  columnKeys.forEach((key, columnIndex) => {
    const list = columns.get(key) ?? [];
    list.forEach((id, rowIndex) => {
      const source = spec.nodes.find((node) => node.id === id);
      if (!source) return;
      const node: PositionedNode = {
        id,
        label: source.label,
        x: PAD + columnIndex * (NODE_W + GAP_X),
        y: PAD + rowIndex * (NODE_H + GAP_Y),
      };
      nodes.push(node);
      position.set(id, node);
    });
  });

  const edges: EdgePath[] = [];
  spec.edges.forEach(([from, to], index) => {
    const start = position.get(from);
    const end = position.get(to);
    if (!start || !end) return;
    const x1 = start.x + NODE_W;
    const y1 = start.y + NODE_H / 2;
    const x2 = end.x;
    const y2 = end.y + NODE_H / 2;
    const path =
      x2 > x1
        ? `M ${x1} ${y1} H ${x1 + (x2 - x1) / 2} V ${y2} H ${x2}`
        : `M ${x1} ${y1} L ${x2} ${y2}`;
    edges.push({ id: `${from}-${to}-${index}`, path });
  });

  const width =
    columnKeys.length === 0
      ? 0
      : PAD * 2 + columnKeys.length * NODE_W + (columnKeys.length - 1) * GAP_X;
  const height = PAD * 2 + rowCount * NODE_H + (rowCount - 1) * GAP_Y;

  return { nodes, edges, width, height };
}

/** Inline SVG diagram: one pixel strokes, square corners and mono uppercase labels. */
export function Diagram({ spec, caption, alt }: DiagramProps) {
  const { nodes, edges, width, height } = layoutDiagram(spec);

  return (
    <figure className="my-6 min-w-0">
      {nodes.length > 0 ? (
        <div className="min-w-0 overflow-x-auto rounded-[var(--radius-2)] border border-[var(--hairline)] bg-[var(--surface)] p-3">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            width="100%"
            aria-hidden="true"
            focusable="false"
            preserveAspectRatio="xMidYMid meet"
            className="h-auto w-full min-w-[460px]"
          >
            <g stroke="var(--ink-muted)" strokeWidth={1} fill="none">
              {edges.map((edge) => (
                <path key={edge.id} d={edge.path} />
              ))}
            </g>
            {nodes.map((node) => (
              <g key={node.id}>
                <rect
                  x={node.x}
                  y={node.y}
                  width={NODE_W}
                  height={NODE_H}
                  rx={0}
                  fill="var(--bg)"
                  stroke="var(--ink-muted)"
                  strokeWidth={1}
                />
                <text
                  x={node.x + NODE_W / 2}
                  y={node.y + NODE_H / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="var(--ink)"
                  fontFamily="var(--font-mono-stack)"
                  fontSize={11}
                  letterSpacing="0.06em"
                >
                  {node.label.toUpperCase()}
                </text>
              </g>
            ))}
          </svg>
        </div>
      ) : null}
      <p className="sr-only">{alt}</p>
      <figcaption className="mt-2 [overflow-wrap:anywhere] text-[length:var(--text-small)] text-[var(--ink-muted)]">
        {caption}
      </figcaption>
    </figure>
  );
}
