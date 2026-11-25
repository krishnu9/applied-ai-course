import type { DiagramSpec, DiagramVariant } from "@/lib/types";

/**
 * Geometry for the five static diagram variants. Every layout returns plain
 * numbers and strings so the Diagram component only draws shapes.
 */

const PAD = 8;

// Flow
export const NODE_W = 132;
export const NODE_H = 44;
const GAP_X = 44;
const GAP_Y = 16;

// Stack
const STACK_W = 520;
const STACK_ROW_H = 48;
const STACK_ROW_DETAIL_H = 64;
const STACK_GAP = 10;

// Matrix
const MATRIX_CELL = 28;
const MATRIX_GAP = 4;
const MATRIX_HEADER = 22;
const CHAR_W = 6.4;

// Timeline
const PHASE_MIN_W = 120;
const PHASE_LINE_Y = 34;

// Bars
const BAR_W = 300;
const BAR_ROW_H = 18;
const BAR_GAP = 14;

export type FlowLayout = {
  kind: "flow";
  nodes: readonly { id: string; label: string; x: number; y: number }[];
  edges: readonly { id: string; path: string }[];
  width: number;
  height: number;
};

export type StackLayout = {
  kind: "stack";
  layers: readonly {
    id: string;
    label: string;
    detail?: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
  width: number;
  height: number;
};

export type MatrixLayout = {
  kind: "matrix";
  cellSize: number;
  columns: readonly { label: string; x: number; y: number }[];
  rows: readonly { label: string; x: number; y: number }[];
  cells: readonly { x: number; y: number; filled: boolean }[];
  width: number;
  height: number;
};

export type TimelineLayout = {
  kind: "timeline";
  phases: readonly { id: string; label: string; number: number; x: number; y: number }[];
  line: { x1: number; y1: number; x2: number; y2: number };
  width: number;
  height: number;
};

export type BarsLayout = {
  kind: "bars";
  bars: readonly {
    id: string;
    label: string;
    x: number;
    y: number;
    width: number;
    valueText: string;
  }[];
  trackWidth: number;
  width: number;
  height: number;
};

export type DiagramLayout =
  | FlowLayout
  | StackLayout
  | MatrixLayout
  | TimelineLayout
  | BarsLayout;

function textWidth(text: string): number {
  return Math.ceil(text.length * CHAR_W);
}

/** Longest-path column layout: one column per dependency depth. */
function layoutFlow(spec: DiagramSpec): FlowLayout {
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
    // A cycle leaves a node unvisited; keep it in the first column, not on top of a root.
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
  const nodes: { id: string; label: string; x: number; y: number }[] = [];
  const position = new Map<string, { id: string; label: string; x: number; y: number }>();

  columnKeys.forEach((key, columnIndex) => {
    const list = columns.get(key) ?? [];
    list.forEach((id, rowIndex) => {
      const source = spec.nodes.find((node) => node.id === id);
      if (!source) return;
      const node = {
        id,
        label: source.label,
        x: PAD + columnIndex * (NODE_W + GAP_X),
        y: PAD + rowIndex * (NODE_H + GAP_Y),
      };
      nodes.push(node);
      position.set(id, node);
    });
  });

  const edges: { id: string; path: string }[] = [];
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

  return { kind: "flow", nodes, edges, width, height };
}

/** Rows of layers in node order, with an optional detail line. */
function layoutStack(spec: DiagramSpec): StackLayout {
  let y = PAD;
  const layers = spec.nodes.map((node) => {
    const height = node.detail ? STACK_ROW_DETAIL_H : STACK_ROW_H;
    const layer = {
      id: node.id,
      label: node.label,
      detail: node.detail,
      x: PAD,
      y,
      width: STACK_W - PAD * 2,
      height,
    };
    y += height + STACK_GAP;
    return layer;
  });

  return {
    kind: "stack",
    layers,
    width: STACK_W,
    height: layers.length === 0 ? 0 : y - STACK_GAP + PAD,
  };
}

/**
 * A label grid. The optional matrix field supplies the row and column labels.
 * A spec without matrix data falls back to a single column of node labels.
 */
function layoutMatrix(spec: DiagramSpec): MatrixLayout {
  const matrix = spec.matrix ?? {
    rows: spec.nodes.map((node) => node.label),
    columns: ["Value"],
    filled: spec.nodes.map((_, index) => [index, 0] as const),
  };
  const rowLabelW = Math.max(72, ...matrix.rows.map(textWidth)) + 12;
  const columnW = Math.max(
    MATRIX_CELL,
    ...matrix.columns.map((column) => textWidth(column) + 12),
  );
  const stepX = columnW + MATRIX_GAP;
  const stepY = MATRIX_CELL + MATRIX_GAP;
  const gridX = PAD + rowLabelW + MATRIX_GAP;
  const gridY = PAD + MATRIX_HEADER;

  const columns = matrix.columns.map((label, index) => ({
    label,
    x: gridX + index * stepX + columnW / 2,
    y: PAD + MATRIX_HEADER / 2,
  }));
  const rows = matrix.rows.map((label, index) => ({
    label,
    x: PAD,
    y: gridY + index * stepY + MATRIX_CELL / 2,
  }));
  const filled = new Set(matrix.filled.map(([row, column]) => `${row}-${column}`));
  const cells: { x: number; y: number; filled: boolean }[] = [];
  matrix.rows.forEach((_, rowIndex) => {
    matrix.columns.forEach((__, columnIndex) => {
      cells.push({
        x: gridX + columnIndex * stepX,
        y: gridY + rowIndex * stepY,
        filled: filled.has(`${rowIndex}-${columnIndex}`),
      });
    });
  });

  return {
    kind: "matrix",
    cellSize: MATRIX_CELL,
    columns,
    rows,
    cells,
    width: gridX + matrix.columns.length * stepX + PAD - MATRIX_GAP,
    height: gridY + matrix.rows.length * stepY + PAD - MATRIX_GAP,
  };
}

/** Ordered phases along one horizontal line. Node order is the reading order. */
function layoutTimeline(spec: DiagramSpec): TimelineLayout {
  const slotW = Math.max(
    PHASE_MIN_W,
    ...spec.nodes.map((node) => textWidth(node.label) + 32),
  );
  const phases = spec.nodes.map((node, index) => ({
    id: node.id,
    label: node.label,
    number: index + 1,
    x: PAD + slotW / 2 + index * slotW,
    y: PHASE_LINE_Y,
  }));
  const width = PAD * 2 + Math.max(spec.nodes.length, 1) * slotW;
  const line = {
    x1: PAD,
    y1: PHASE_LINE_Y,
    x2: width - PAD,
    y2: PHASE_LINE_Y,
  };

  return { kind: "timeline", phases, line, width, height: 88 };
}

/** Labelled horizontal bars in node order. A missing value draws an empty bar. */
function layoutBars(spec: DiagramSpec): BarsLayout {
  const labelW = Math.max(64, ...spec.nodes.map((node) => textWidth(node.label))) + 12;
  const values = spec.nodes.map((node) =>
    node.value !== undefined && Number.isFinite(node.value) ? node.value : 0,
  );
  const max = Math.max(...values, 1);
  const valueTexts = spec.nodes.map(
    (node, index) => `${values[index] ?? 0}${node.unit ? ` ${node.unit}` : ""}`,
  );
  // Reserve enough room for the longest value label, so it clears the longest bar.
  const valueWidth = Math.max(56, ...valueTexts.map(textWidth)) + 4;
  const barX = PAD + labelW;
  const rowH = BAR_ROW_H + BAR_GAP;
  const bars = spec.nodes.map((node, index) => {
    const value = values[index] ?? 0;
    return {
      id: node.id,
      label: node.label,
      x: barX,
      y: PAD + index * rowH,
      width: Math.max(0, (value / max) * BAR_W),
      valueText: valueTexts[index] ?? "",
    };
  });

  return {
    kind: "bars",
    bars,
    trackWidth: BAR_W,
    width: barX + BAR_W + 8 + valueWidth + PAD,
    height: Math.max(spec.nodes.length, 1) * rowH - BAR_GAP + PAD * 2,
  };
}

export function layoutDiagram(
  variant: DiagramVariant | undefined,
  spec: DiagramSpec,
): DiagramLayout {
  switch (variant ?? "flow") {
    case "stack":
      return layoutStack(spec);
    case "matrix":
      return layoutMatrix(spec);
    case "timeline":
      return layoutTimeline(spec);
    case "bars":
      return layoutBars(spec);
    case "flow":
    default:
      return layoutFlow(spec);
  }
}
