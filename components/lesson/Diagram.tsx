import type { ReactNode } from "react";
import type { DiagramSpec, DiagramVariant } from "@/lib/types";
import { layoutDiagram, NODE_H, NODE_W } from "./diagramLayout";

export type DiagramProps = {
  spec: DiagramSpec;
  caption: string;
  alt: string;
  variant?: DiagramVariant;
};

const LABEL_FONT = "var(--font-mono-stack)";
const STROKE = "var(--ink-muted)";

function SvgFrame({
  width,
  height,
  children,
}: {
  width: number;
  height: number;
  children: ReactNode;
}) {
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
      style={{ minWidth: `${Math.max(460, width)}px` }}
      className="h-auto w-full"
    >
      {children}
    </svg>
  );
}

/** Inline SVG diagram: one pixel strokes, square corners and mono uppercase labels. */
export function Diagram({ spec, caption, alt, variant }: DiagramProps) {
  const layout = layoutDiagram(variant, spec);
  const hasContent = spec.nodes.length > 0;

  return (
    <figure className="my-6 min-w-0">
      {hasContent ? (
        <div className="min-w-0 max-w-full overflow-x-auto rounded-[var(--radius-2)] border border-[var(--hairline)] bg-[var(--surface)] p-3">
          {layout.kind === "flow" ? (
            <SvgFrame width={layout.width} height={layout.height}>
              <g stroke={STROKE} strokeWidth={1} fill="none">
                {layout.edges.map((edge) => (
                  <path key={edge.id} d={edge.path} />
                ))}
              </g>
              {layout.nodes.map((node) => (
                <g key={node.id}>
                  <rect
                    x={node.x}
                    y={node.y}
                    width={NODE_W}
                    height={NODE_H}
                    rx={0}
                    fill="var(--bg)"
                    stroke={STROKE}
                    strokeWidth={1}
                  />
                  <text
                    x={node.x + NODE_W / 2}
                    y={node.y + NODE_H / 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="var(--ink)"
                    fontFamily={LABEL_FONT}
                    fontSize={11}
                    letterSpacing="0.06em"
                  >
                    {node.label.toUpperCase()}
                  </text>
                </g>
              ))}
            </SvgFrame>
          ) : null}

          {layout.kind === "stack" ? (
            <SvgFrame width={layout.width} height={layout.height}>
              {layout.layers.map((layer) => (
                <g key={layer.id}>
                  <rect
                    x={layer.x}
                    y={layer.y}
                    width={layer.width}
                    height={layer.height}
                    rx={0}
                    fill="var(--bg)"
                    stroke={STROKE}
                    strokeWidth={1}
                  />
                  <text
                    x={layer.x + 12}
                    y={layer.detail ? layer.y + 22 : layer.y + layer.height / 2}
                    dominantBaseline="central"
                    fill="var(--ink)"
                    fontFamily={LABEL_FONT}
                    fontSize={11}
                    letterSpacing="0.06em"
                  >
                    {layer.label.toUpperCase()}
                  </text>
                  {layer.detail ? (
                    <text
                      x={layer.x + 12}
                      y={layer.y + 42}
                      dominantBaseline="central"
                      fill="var(--ink-muted)"
                      fontFamily={LABEL_FONT}
                      fontSize={10}
                    >
                      {layer.detail}
                    </text>
                  ) : null}
                </g>
              ))}
            </SvgFrame>
          ) : null}

          {layout.kind === "matrix" ? (
            <SvgFrame width={layout.width} height={layout.height}>
              {layout.columns.map((column) => (
                <text
                  key={`column-${column.label}-${column.x}`}
                  x={column.x}
                  y={column.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="var(--ink-muted)"
                  fontFamily={LABEL_FONT}
                  fontSize={10}
                  letterSpacing="0.06em"
                >
                  {column.label.toUpperCase()}
                </text>
              ))}
              {layout.rows.map((row) => (
                <text
                  key={`row-${row.label}-${row.y}`}
                  x={row.x}
                  y={row.y}
                  dominantBaseline="central"
                  fill="var(--ink)"
                  fontFamily={LABEL_FONT}
                  fontSize={10}
                  letterSpacing="0.06em"
                >
                  {row.label.toUpperCase()}
                </text>
              ))}
              {layout.cells.map((cell) => (
                <rect
                  key={`cell-${cell.x}-${cell.y}`}
                  x={cell.x}
                  y={cell.y}
                  width={layout.cellSize}
                  height={layout.cellSize}
                  rx={0}
                  fill={cell.filled ? "var(--ink-muted)" : "var(--bg)"}
                  stroke={STROKE}
                  strokeWidth={1}
                />
              ))}
            </SvgFrame>
          ) : null}

          {layout.kind === "timeline" ? (
            <SvgFrame width={layout.width} height={layout.height}>
              <line
                x1={layout.line.x1}
                y1={layout.line.y1}
                x2={layout.line.x2}
                y2={layout.line.y2}
                stroke={STROKE}
                strokeWidth={1}
              />
              {layout.phases.map((phase) => (
                <g key={phase.id}>
                  <circle
                    cx={phase.x}
                    cy={phase.y}
                    r={7}
                    fill="var(--bg)"
                    stroke={STROKE}
                    strokeWidth={1}
                  />
                  <text
                    x={phase.x}
                    y={phase.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="var(--ink)"
                    fontFamily={LABEL_FONT}
                    fontSize={9}
                  >
                    {phase.number}
                  </text>
                  <text
                    x={phase.x}
                    y={phase.y + 26}
                    textAnchor="middle"
                    fill="var(--ink)"
                    fontFamily={LABEL_FONT}
                    fontSize={10}
                    letterSpacing="0.06em"
                  >
                    {phase.label.toUpperCase()}
                  </text>
                </g>
              ))}
            </SvgFrame>
          ) : null}

          {layout.kind === "bars" ? (
            <SvgFrame width={layout.width} height={layout.height}>
              {layout.bars.map((bar) => (
                <g key={bar.id}>
                  <text
                    x={8}
                    y={bar.y + 9}
                    dominantBaseline="central"
                    fill="var(--ink)"
                    fontFamily={LABEL_FONT}
                    fontSize={10}
                    letterSpacing="0.06em"
                  >
                    {bar.label.toUpperCase()}
                  </text>
                  <rect
                    x={bar.x}
                    y={bar.y}
                    width={bar.width}
                    height={18}
                    rx={0}
                    fill="var(--bg)"
                    stroke={STROKE}
                    strokeWidth={1}
                  />
                  <text
                    x={layout.width - 8}
                    y={bar.y + 9}
                    textAnchor="end"
                    dominantBaseline="central"
                    fill="var(--ink)"
                    fontFamily={LABEL_FONT}
                    fontSize={10}
                  >
                    {bar.valueText}
                  </text>
                </g>
              ))}
            </SvgFrame>
          ) : null}
        </div>
      ) : null}
      <p className="sr-only">{alt}</p>
      <figcaption className="mt-2 [overflow-wrap:anywhere] text-[length:var(--text-small)] text-[var(--ink-muted)]">
        {caption}
      </figcaption>
    </figure>
  );
}
