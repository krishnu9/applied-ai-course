import type { LessonSlug, ProgressState } from "@/lib/types";

export type RepairCheck = {
  id: string;
  correctOptionId: string;
};

export type RepairGate = {
  checksPass: boolean;
  taskPass: boolean;
  proofPass: boolean;
  repaired: boolean;
  canRepair: boolean;
};

/**
 * The completion gate shared by the inline repair control and the phone action
 * bar. One derivation keeps both controls in the same state.
 */
export function deriveRepairGate(
  state: ProgressState,
  ready: boolean,
  slug: LessonSlug,
  checks: readonly RepairCheck[],
  taskItemIds: readonly string[],
): RepairGate {
  const record = state.lessons[slug];
  const answers = record?.checkAnswers ?? {};
  const checksPass = checks.every(
    (check) => answers[check.id]?.selectedOptionId === check.correctOptionId,
  );
  const ticks = new Set<string>(record?.taskTicks ?? []);
  const taskPass =
    taskItemIds.length === 5 && taskItemIds.every((id) => ticks.has(id));
  const proofPass = (record?.proofNote ?? "").trim().length > 0;
  const repaired = record?.status === "repaired";
  const canRepair = ready && checksPass && taskPass && proofPass && !repaired;

  return { checksPass, taskPass, proofPass, repaired, canRepair };
}
