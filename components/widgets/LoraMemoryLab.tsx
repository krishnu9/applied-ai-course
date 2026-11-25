"use client";

import { useId, useState } from "react";
import { CONTROL_LABEL, WidgetHeading, WidgetStat } from "./WidgetChrome";
import type { WidgetProps } from "./types";

const SIZES = {
  small: { label: "Small · 1B", hidden: 1024, layers: 24, params: 1e9 },
  medium: { label: "Medium · 7B", hidden: 4096, layers: 32, params: 7e9 },
  large: { label: "Large · 13B", hidden: 4096, layers: 40, params: 13e9 },
} as const;

/** Four adapted projections per layer, each with an A and a B matrix. */
const ADAPTER_FACTOR = 8;

/** 2 bytes of weight, 2 of gradient and 8 for two FP32 optimizer moments. */
const TRAINING_BYTES_PER_PARAM = 12;

const PRECISIONS = {
  fp16: { label: "FP16 · 2 bytes", bytes: 2 },
  int8: { label: "INT8 · 1 byte", bytes: 1 },
  nf4: { label: "4-bit · 0.5 bytes", bytes: 0.5 },
} as const;

const RANKS = [4, 8, 16, 32] as const;

type SizeId = keyof typeof SIZES;
type PrecisionId = keyof typeof PRECISIONS;

function formatParams(count: number): string {
  if (count >= 1e9) return `${(count / 1e9).toFixed(2)}B`;
  if (count >= 1e6) return `${(count / 1e6).toFixed(2)}M`;
  return `${(count / 1e3).toFixed(1)}k`;
}

function formatGigabytes(bytes: number): string {
  return `${(bytes / 1e9).toFixed(2)} GB`;
}

/** LoRA maths: adapters scale with rank; the frozen base scales with precision. */
export function LoraMemoryLab({ caption }: WidgetProps) {
  const [rank, setRank] = useState<(typeof RANKS)[number]>(8);
  const [size, setSize] = useState<SizeId>("medium");
  const [precision, setPrecision] = useState<PrecisionId>("fp16");
  const baseId = useId();
  const rankId = `${baseId}-rank`;
  const sizeId = `${baseId}-size`;
  const precisionId = `${baseId}-precision`;

  const model = SIZES[size];
  const bytes = PRECISIONS[precision].bytes;
  const trainable = model.layers * rank * ADAPTER_FACTOR * model.hidden;
  const trainingBytes = trainable * TRAINING_BYTES_PER_PARAM;
  const baseParams = model.params;

  return (
    <div className="min-w-0">
      <WidgetHeading title="LoRA memory lab" caption={caption} />

      <div className="mt-4 grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(190px,1fr))]">
        <div className="min-w-0">
          <label htmlFor={rankId} className={CONTROL_LABEL}>
            LoRA rank
          </label>
          <select
            id={rankId}
            value={rank}
            onChange={(event) =>
              setRank(Number(event.target.value) as (typeof RANKS)[number])
            }
            className="mt-1 block min-h-11 w-full rounded-[var(--radius-3)] border border-[var(--hairline-strong)] bg-[var(--bg)] px-2 text-[var(--ink)]"
          >
            {RANKS.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-0">
          <label htmlFor={sizeId} className={CONTROL_LABEL}>
            Base model
          </label>
          <select
            id={sizeId}
            value={size}
            onChange={(event) => setSize(event.target.value as SizeId)}
            className="mt-1 block min-h-11 w-full rounded-[var(--radius-3)] border border-[var(--hairline-strong)] bg-[var(--bg)] px-2 text-[var(--ink)]"
          >
            {(Object.keys(SIZES) as SizeId[]).map((key) => (
              <option key={key} value={key}>
                {SIZES[key].label}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-0">
          <label htmlFor={precisionId} className={CONTROL_LABEL}>
            Base precision
          </label>
          <select
            id={precisionId}
            value={precision}
            onChange={(event) => setPrecision(event.target.value as PrecisionId)}
            className="mt-1 block min-h-11 w-full rounded-[var(--radius-3)] border border-[var(--hairline-strong)] bg-[var(--bg)] px-2 text-[var(--ink)]"
          >
            {(Object.keys(PRECISIONS) as PrecisionId[]).map((key) => (
              <option key={key} value={key}>
                {PRECISIONS[key].label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <dl className="mt-4 grid gap-3 sm:grid-cols-3">
        <WidgetStat label="Trainable parameters" value={formatParams(trainable)} />
        <WidgetStat
          label="Adapter, gradient, optimizer"
          value={formatGigabytes(trainingBytes)}
        />
        <WidgetStat
          label={`Frozen base at ${PRECISIONS[precision].label.split(" · ")[0]}`}
          value={formatGigabytes(baseParams * bytes)}
        />
      </dl>

      <p className="mt-3 text-[length:var(--text-small)] text-[var(--ink-muted)]">
        Trainable parameters are about layers × rank × 8 × width: four projection
        matrices per layer, each with two adapters. Each trainable parameter needs
        12 bytes: 2 for the weight, 2 for the gradient and 8 for two FP32 optimizer
        moments. The base memory is its parameter count times the precision bytes.
      </p>
    </div>
  );
}
