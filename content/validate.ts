import type {
  Block,
  CostModel,
  Course,
  Layer,
  LayerId,
  Lesson,
  LessonSlug,
  MappingRow,
  PresetQuery,
  RetrievalDoc,
  SampleMetrics,
  TaskItemId,
} from "@/lib/types";
import { BASELINE, scoreSummary } from "./scores";

export interface ContentSnapshot {
  course: Course;
  layers: readonly Layer[];
  docs: readonly RetrievalDoc[];
  queries: readonly PresetQuery[];
  model: CostModel;
  mapping: readonly MappingRow[];
}

const LESSON_SLUGS: readonly LessonSlug[] = [
  "evaluation",
  "prompt-contract",
  "retrieval",
  "agents",
  "fine-tuning",
  "cost",
];

const LAYER_IDS: readonly LayerId[] = [
  "layer-01",
  "layer-02",
  "layer-03",
  "layer-04",
  "layer-05",
  "layer-06",
];

const ITEM_IDS: readonly TaskItemId[] = [
  "item-1",
  "item-2",
  "item-3",
  "item-4",
  "item-5",
];

const MINUTES: Readonly<Record<LessonSlug, number>> = {
  evaluation: 10,
  "prompt-contract": 9,
  retrieval: 25,
  agents: 11,
  "fine-tuning": 10,
  cost: 9,
};

const REPAIRED: Readonly<Record<LayerId, SampleMetrics>> = {
  "layer-01": { passRate: 0.49, costPer1k: 0.92, p95Ms: 2300 },
  "layer-02": { passRate: 0.53, costPer1k: 0.86, p95Ms: 2100 },
  "layer-03": { passRate: 0.58, costPer1k: 0.71, p95Ms: 1400 },
  "layer-04": { passRate: 0.63, costPer1k: 0.68, p95Ms: 1600 },
  "layer-05": { passRate: 0.72, costPer1k: 0.79, p95Ms: 1100 },
  "layer-06": { passRate: 0.74, costPer1k: 0.31, p95Ms: 900 },
};

const DIAGRAM_IDS: Partial<Record<LessonSlug, string>> = {
  retrieval: "retrieval-flow",
  agents: "agent-loop",
  cost: "cost-budget",
};

const WIDGETS: Partial<Record<LessonSlug, string>> = {
  retrieval: "retrieval-explorer",
  cost: "cost-calculator",
};

const SLUG_PATTERN = /^[a-z][a-z0-9-]*$/;
const SECTION_ID_PATTERN = /^[a-z][a-z0-9-]{0,40}$/;
const TAG_PATTERN = /^[a-z][a-z-]*$/;

const CODE_OUTPUT_LABEL = "Sample output. Fixed data.";
const NOTE_LABEL = "Proof saved on this device.";
const PROVE_PLACEHOLDER = "I changed X; the result was Y.";

function words(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function sentenceCount(text: string): number {
  const matches = text.match(/[.!?](?=\s|$)/g);
  return matches ? matches.length : 0;
}

function sameMetrics(a: SampleMetrics, b: SampleMetrics): boolean {
  return (
    a.passRate === b.passRate &&
    a.costPer1k === b.costPer1k &&
    a.p95Ms === b.p95Ms
  );
}

/**
 * Count the prose words in a lesson. Prose is section titles, paragraphs,
 * list items, callout titles and text, note text and diagram captions.
 * Code, checks, task labels and page copy are not prose.
 */
export function countProseWords(lesson: Lesson): number {
  let total = 0;
  for (const section of lesson.sections) {
    total += words(section.title);
    for (const block of section.blocks) {
      switch (block.kind) {
        case "paragraph":
          total += words(block.text);
          break;
        case "list":
          total += words(block.items.join(" "));
          break;
        case "callout":
          total += words(block.text);
          if (block.title) total += words(block.title);
          break;
        case "note":
          total += words(block.text);
          break;
        case "diagram":
          total += words(block.caption);
          break;
        default:
          break;
      }
    }
  }
  return total;
}

function blocksOf(lesson: Lesson): readonly Block[] {
  return lesson.sections.flatMap((section) => section.blocks);
}

function validateLesson(
  lesson: Lesson,
  index: number,
  faults: string[],
): void {
  const at = `lesson "${lesson.slug}"`;

  if (lesson.slug !== LESSON_SLUGS[index]) {
    faults.push(
      `content: lesson ${index + 1} has slug "${lesson.slug}", expected "${LESSON_SLUGS[index]}"`,
    );
  }
  if (!SLUG_PATTERN.test(lesson.slug)) {
    faults.push(`content: ${at} slug does not match the slug pattern`);
  }
  if (lesson.order !== index + 1) {
    faults.push(`content: ${at} has order ${lesson.order}, expected ${index + 1}`);
  }
  if (lesson.readingMinutes !== MINUTES[lesson.slug]) {
    faults.push(
      `content: ${at} has ${lesson.readingMinutes} minutes, expected ${MINUTES[lesson.slug]}`,
    );
  }
  const expectedDifficulty = lesson.slug === "retrieval" ? "advanced" : "core";
  if (lesson.difficulty !== expectedDifficulty) {
    faults.push(
      `content: ${at} has difficulty "${lesson.difficulty}", expected "${expectedDifficulty}"`,
    );
  }
  if (lesson.layerId !== LAYER_IDS[index]) {
    faults.push(`content: ${at} maps to ${lesson.layerId}, expected ${LAYER_IDS[index]}`);
  }
  if (!lesson.title.trim() || !lesson.outcome.trim() || !lesson.artifact.trim()) {
    faults.push(`content: ${at} is missing a title, outcome or artifact`);
  }

  const expectedSections = lesson.slug === "retrieval" ? 8 : 3;
  const maxSections = lesson.slug === "retrieval" ? 8 : 8;
  if (lesson.sections.length < expectedSections || lesson.sections.length > maxSections) {
    faults.push(
      `content: ${at} has ${lesson.sections.length} sections; expected ${expectedSections} to ${maxSections}`,
    );
  }

  const sectionIds = new Set<string>();
  const blockIds = new Set<string>();
  for (const section of lesson.sections) {
    if (!SECTION_ID_PATTERN.test(section.id)) {
      faults.push(`content: ${at} has an invalid section id "${section.id}"`);
    }
    if (sectionIds.has(section.id)) {
      faults.push(`content: duplicate section id "${section.id}" in ${at}`);
    }
    sectionIds.add(section.id);
    if (!section.title.trim()) {
      faults.push(`content: ${at} section "${section.id}" has no title`);
    }
    for (const block of section.blocks) {
      if (blockIds.has(block.id)) {
        faults.push(`content: duplicate block id "${block.id}" in ${at}`);
      }
      blockIds.add(block.id);
    }
  }

  const blocks = blocksOf(lesson);
  const codeBlocks = blocks.filter((block) => block.kind === "code");
  const noteBlocks = blocks.filter((block) => block.kind === "note");
  const calloutBlocks = blocks.filter((block) => block.kind === "callout");
  const diagramBlocks = blocks.filter((block) => block.kind === "diagram");
  const widgetBlocks = blocks.filter((block) => block.kind === "widget");
  const checkBlocks = blocks.filter((block) => block.kind === "check");
  const taskBlocks = blocks.filter((block) => block.kind === "task");

  if (codeBlocks.length !== 1) {
    faults.push(`content: ${at} has ${codeBlocks.length} code blocks, expected 1`);
  } else {
    const block = codeBlocks[0];
    if (block.kind === "code") {
      if (block.output.label !== CODE_OUTPUT_LABEL) {
        faults.push(`content: ${at} code block has the wrong output label`);
      }
      if (!block.output.text.trim()) {
        faults.push(`content: ${at} code block has no sample output`);
      }
      if (!block.code.trim() || !block.filename.trim() || !block.language.trim()) {
        faults.push(`content: ${at} code block is missing a filename, language or code`);
      }
    }
  }

  if (noteBlocks.length !== 1) {
    faults.push(`content: ${at} has ${noteBlocks.length} note blocks, expected 1`);
  }
  if (calloutBlocks.length < 2 || calloutBlocks.length > 4) {
    faults.push(`content: ${at} has ${calloutBlocks.length} callouts, expected 2 to 4`);
  }
  if (taskBlocks.length !== 1) {
    faults.push(`content: ${at} has ${taskBlocks.length} task blocks, expected 1`);
  }

  const expectedDiagram = DIAGRAM_IDS[lesson.slug];
  const expectedDiagrams = expectedDiagram ? 1 : 0;
  if (diagramBlocks.length !== expectedDiagrams) {
    faults.push(
      `content: ${at} has ${diagramBlocks.length} diagram blocks, expected ${expectedDiagrams}`,
    );
  }
  for (const block of diagramBlocks) {
    if (block.kind !== "diagram") continue;
    if (expectedDiagram && block.id !== expectedDiagram) {
      faults.push(
        `content: ${at} diagram id "${block.id}" must be "${expectedDiagram}"`,
      );
    }
    const nodeIds = new Set(block.spec.nodes.map((node) => node.id));
    if (block.spec.nodes.length < 4 || block.spec.nodes.length > 7) {
      faults.push(`content: ${at} diagram has ${block.spec.nodes.length} nodes, expected 4 to 7`);
    }
    if (nodeIds.size !== block.spec.nodes.length) {
      faults.push(`content: ${at} diagram has duplicate node ids`);
    }
    for (const node of block.spec.nodes) {
      if (!node.id.trim() || !node.label.trim()) {
        faults.push(`content: ${at} diagram has a node without an id or label`);
      }
    }
    for (const [from, to] of block.spec.edges) {
      if (!nodeIds.has(from) || !nodeIds.has(to)) {
        faults.push(`content: ${at} diagram edge ${from} -> ${to} names a missing node`);
      }
    }
    if (block.spec.edges.length === 0) {
      faults.push(`content: ${at} diagram has no edges`);
    }
    if (block.caption.length > 120) {
      faults.push(`content: ${at} diagram caption is longer than 120 characters`);
    }
    if (!block.alt.trim()) {
      faults.push(`content: ${at} diagram has no alt text`);
    }
  }

  const expectedWidget = WIDGETS[lesson.slug];
  const expectedWidgets = expectedWidget ? 1 : 0;
  if (widgetBlocks.length !== expectedWidgets) {
    faults.push(
      `content: ${at} has ${widgetBlocks.length} widget blocks, expected ${expectedWidgets}`,
    );
  }
  for (const block of widgetBlocks) {
    if (block.kind !== "widget") continue;
    if (expectedWidget && block.widget !== expectedWidget) {
      faults.push(
        `content: ${at} widget "${block.widget}" must be "${expectedWidget}"`,
      );
    }
    if (block.caption.length > 120) {
      faults.push(`content: ${at} widget caption is longer than 120 characters`);
    }
  }

  const expectedChecks = lesson.slug === "retrieval" ? 3 : 2;
  if (lesson.checks.length !== expectedChecks) {
    faults.push(
      `content: ${at} has ${lesson.checks.length} checks, expected ${expectedChecks}`,
    );
  }
  if (checkBlocks.length !== lesson.checks.length) {
    faults.push(
      `content: ${at} has ${checkBlocks.length} check blocks for ${lesson.checks.length} checks`,
    );
  }
  const checkIds = new Set<string>();
  const referencedCheckIds = new Set<string>();
  for (const check of lesson.checks) {
    if (checkIds.has(check.id)) {
      faults.push(`content: duplicate check id "${check.id}" in ${at}`);
    }
    checkIds.add(check.id);
    if (!check.prompt.trim()) {
      faults.push(`content: ${at} check "${check.id}" has no prompt`);
    }
    if (check.options.length < 3 || check.options.length > 4) {
      faults.push(
        `content: ${at} check "${check.id}" has ${check.options.length} options, expected 3 or 4`,
      );
    }
    if (!check.options.some((option) => option.id === check.correctOptionId)) {
      faults.push(
        `content: ${at} check "${check.id}" has no option "${check.correctOptionId}"`,
      );
    }
    const optionIds = new Set(check.options.map((option) => option.id));
    if (optionIds.size !== check.options.length) {
      faults.push(`content: ${at} check "${check.id}" has duplicate option ids`);
    }
    if (sentenceCount(check.explanation) < 2) {
      faults.push(
        `content: ${at} check "${check.id}" explanation must hold 2 sentences or more`,
      );
    }
    if (!check.explanation.trim()) {
      faults.push(`content: ${at} check "${check.id}" has no explanation`);
    }
  }
  for (const block of checkBlocks) {
    if (block.kind !== "check") continue;
    if (!checkIds.has(block.checkId)) {
      faults.push(`content: ${at} check block names unknown check "${block.checkId}"`);
    }
    if (referencedCheckIds.has(block.checkId)) {
      faults.push(`content: ${at} check "${block.checkId}" is placed twice`);
    }
    referencedCheckIds.add(block.checkId);
  }
  for (const id of checkIds) {
    if (!referencedCheckIds.has(id)) {
      faults.push(`content: ${at} check "${id}" has no block`);
    }
  }

  const task = lesson.task;
  if (!task.scope.trim()) {
    faults.push(`content: ${at} task has no scope sentence`);
  }
  if (task.items.length !== 5) {
    faults.push(`content: ${at} task has ${task.items.length} items, expected 5`);
  }
  for (let item = 0; item < task.items.length; item += 1) {
    if (task.items[item].id !== ITEM_IDS[item]) {
      faults.push(
        `content: ${at} task item ${item + 1} has id "${task.items[item].id}", expected "${ITEM_IDS[item]}"`,
      );
    }
    if (!task.items[item].label.trim()) {
      faults.push(`content: ${at} task item ${item + 1} has no label`);
    }
  }
  if (!task.solution.filename.trim() || !task.solution.language.trim() || !task.solution.code.trim()) {
    faults.push(`content: ${at} task solution is incomplete`);
  }

  if (lesson.prove.placeholder !== PROVE_PLACEHOLDER) {
    faults.push(`content: ${at} prove placeholder is wrong`);
  }
  if (lesson.prove.maxLength !== 280) {
    faults.push(`content: ${at} prove maxLength is not 280`);
  }
  if (lesson.prove.debounceMs !== 800) {
    faults.push(`content: ${at} prove debounceMs is not 800`);
  }
  if (lesson.prove.savedMessage !== NOTE_LABEL) {
    faults.push(`content: ${at} prove savedMessage is wrong`);
  }
  if (!lesson.prove.prompt.trim()) {
    faults.push(`content: ${at} prove prompt is empty`);
  }

  if (lesson.citation.includes("\n")) {
    faults.push(`content: ${at} citation must be one line`);
  }
  if (lesson.citation.length > 160) {
    faults.push(`content: ${at} citation is longer than 160 characters`);
  }
  if (!lesson.citation.includes("Chip Huyen") || !lesson.citation.includes("AI Engineering")) {
    faults.push(`content: ${at} citation must name AI Engineering by Chip Huyen`);
  }

  const prose = countProseWords(lesson);
  const min = lesson.slug === "retrieval" ? 1800 : 700;
  const max = lesson.slug === "retrieval" ? 2200 : 1000;
  if (prose < min || prose > max) {
    faults.push(
      `content: ${at} has ${prose} prose words, expected ${min} to ${max}`,
    );
  }
}

function validateLayers(layers: readonly Layer[], faults: string[]): void {
  if (layers.length !== 6) {
    faults.push(`content: ${layers.length} layers, expected 6`);
    return;
  }
  const seenLessons = new Set<LessonSlug>();
  for (let index = 0; index < layers.length; index += 1) {
    const layer = layers[index];
    const at = `layer "${layer.id}"`;
    if (layer.id !== LAYER_IDS[index]) {
      faults.push(`content: ${at} is at position ${index + 1}, expected ${LAYER_IDS[index]}`);
    }
    if (layer.order !== index + 1) {
      faults.push(`content: ${at} has order ${layer.order}, expected ${index + 1}`);
    }
    if (!layer.name.trim() || layer.name.length > 20) {
      faults.push(`content: ${at} name must hold 1 to 20 characters`);
    }
    if (!LESSON_SLUGS.includes(layer.lessonSlug)) {
      faults.push(`content: ${at} has an unknown lesson slug "${layer.lessonSlug}"`);
    }
    if (seenLessons.has(layer.lessonSlug)) {
      faults.push(`content: ${at} repeats lesson slug "${layer.lessonSlug}"`);
    }
    seenLessons.add(layer.lessonSlug);
    if (!sameMetrics(layer.baseline, BASELINE)) {
      faults.push(`content: ${at} baseline must be 41/0.94/2400`);
    }
    if (!sameMetrics(layer.repaired, REPAIRED[layer.id])) {
      faults.push(`content: ${at} repaired pair is not the declared sample pair`);
    }
  }
  for (const slug of LESSON_SLUGS) {
    if (!seenLessons.has(slug)) {
      faults.push(`content: no layer maps to lesson "${slug}"`);
    }
  }
}

function validateRetrieval(data: ContentSnapshot, faults: string[]): void {
  if (data.docs.length !== 12) {
    faults.push(`content: ${data.docs.length} retrieval documents, expected 12`);
  }
  const docIds = new Set<string>();
  for (const doc of data.docs) {
    const at = `document "${doc.id}"`;
    if (docIds.has(doc.id)) {
      faults.push(`content: duplicate ${at}`);
    }
    docIds.add(doc.id);
    if (!doc.id.trim() || !doc.title.trim() || !doc.text.trim()) {
      faults.push(`content: ${at} is missing an id, title or text`);
    }
    if (doc.text.length > 220) {
      faults.push(`content: ${at} text is longer than 220 characters`);
    }
    if (sentenceCount(doc.text) < 1 || sentenceCount(doc.text) > 3) {
      faults.push(`content: ${at} text must hold 1 to 3 sentences`);
    }
    if (doc.tags.length < 2 || doc.tags.length > 4) {
      faults.push(`content: ${at} has ${doc.tags.length} tags, expected 2 to 4`);
    }
    for (const tag of doc.tags) {
      if (!TAG_PATTERN.test(tag) || tag.includes(" ")) {
        faults.push(`content: ${at} has an invalid tag "${tag}"`);
      }
    }
  }

  if (data.queries.length !== 3) {
    faults.push(`content: ${data.queries.length} preset queries, expected 3`);
  }
  const queryIds = new Set<string>();
  for (const query of data.queries) {
    const at = `query "${query.id}"`;
    if (queryIds.has(query.id)) {
      faults.push(`content: duplicate ${at}`);
    }
    queryIds.add(query.id);
    if (!query.query.trim()) {
      faults.push(`content: ${at} has no query text`);
    }
    if (query.results.length !== 3) {
      faults.push(`content: ${at} has ${query.results.length} results, expected 3`);
    }
    for (let index = 0; index < query.results.length; index += 1) {
      const result = query.results[index];
      if (!docIds.has(result.docId)) {
        faults.push(`content: ${at} names missing document "${result.docId}"`);
      }
      if (index > 0 && query.results[index - 1].score <= result.score) {
        faults.push(`content: ${at} scores are not descending`);
      }
    }
  }
}

function validateCost(model: CostModel, faults: string[]): void {
  const { defaults, constants, expected } = model;
  if (
    defaults.requestsPerDay !== 10000 ||
    defaults.inputTokens !== 1000 ||
    defaults.outputTokens !== 250 ||
    defaults.pricePerM !== 0.75
  ) {
    faults.push("content: cost defaults are not the declared sample values");
  }
  if (
    constants.retrievalMs !== 400 ||
    constants.prefillMsPerToken !== 0.6 ||
    constants.decodeMsPerToken !== 5.6 ||
    constants.daysPerMonth !== 30
  ) {
    faults.push("content: cost constants are not the declared sample values");
  }

  const costPerRequest =
    ((defaults.inputTokens + defaults.outputTokens) * defaults.pricePerM) / 1_000_000;
  const costPer1k = costPerRequest * 1_000;
  const monthlyCost = costPerRequest * defaults.requestsPerDay * constants.daysPerMonth;
  const p95Ms =
    constants.retrievalMs +
    defaults.inputTokens * constants.prefillMsPerToken +
    defaults.outputTokens * constants.decodeMsPerToken;

  if (Math.abs(expected.costPerRequest - costPerRequest) > 1e-9) {
    faults.push("content: cost per request does not match the formula");
  }
  if (Math.abs(expected.costPer1k - costPer1k) > 1e-9) {
    faults.push("content: cost per 1k does not match the formula");
  }
  if (Math.abs(expected.monthlyCost - monthlyCost) > 1e-9) {
    faults.push("content: monthly cost does not match the formula");
  }
  if (Math.abs(expected.p95Ms - p95Ms) > 1e-9) {
    faults.push("content: p95 does not match the formula");
  }
}

function validateScores(data: ContentSnapshot, faults: string[]): void {
  const layerFor = (slug: LessonSlug): Layer | undefined =>
    data.layers.find((layer) => layer.lessonSlug === slug);

  if (!sameMetrics(scoreSummary([]), BASELINE)) {
    faults.push("content: scoreSummary([]) must return the baseline");
  }
  const retrieval = layerFor("retrieval");
  if (retrieval && !sameMetrics(scoreSummary(["retrieval"]), retrieval.repaired)) {
    faults.push("content: scoreSummary(['retrieval']) must return the layer-03 pair");
  }
  if (
    retrieval &&
    !sameMetrics(scoreSummary(["evaluation", "retrieval"]), retrieval.repaired)
  ) {
    faults.push("content: scoreSummary must pick the highest repaired layer");
  }
  const cost = layerFor("cost");
  if (cost && !sameMetrics(scoreSummary(["cost", "retrieval"]), cost.repaired)) {
    faults.push("content: scoreSummary must pick the highest layer whatever the order");
  }
  const evaluation = layerFor("evaluation");
  if (
    evaluation &&
    !sameMetrics(scoreSummary(["evaluation", "evaluation"]), evaluation.repaired)
  ) {
    faults.push("content: duplicate slugs must count once in scoreSummary");
  }
}

function validateMapping(mapping: readonly MappingRow[], faults: string[]): void {
  if (mapping.length !== 4) {
    faults.push(`content: ${mapping.length} mapping rows, expected 4`);
  }
  const ids = new Set<string>();
  for (const row of mapping) {
    if (ids.has(row.id)) {
      faults.push(`content: duplicate mapping row "${row.id}"`);
    }
    ids.add(row.id);
    if (!row.aiIdea.trim() || !row.engineeringIdea.trim()) {
      faults.push(`content: mapping row "${row.id}" is missing a name`);
    }
    if (!LESSON_SLUGS.includes(row.lessonSlug)) {
      faults.push(`content: mapping row "${row.id}" has an unknown lesson slug`);
    }
  }
}

/** Return one line per fault. An empty list means the content is valid. */
export function validateContent(data: ContentSnapshot): string[] {
  const faults: string[] = [];

  if (data.course.lessons.length !== 6) {
    faults.push(`content: ${data.course.lessons.length} lessons, expected 6`);
  }
  data.course.lessons.forEach((lesson, index) => validateLesson(lesson, index, faults));

  const minutes = data.course.lessons.reduce(
    (total, lesson) => total + lesson.readingMinutes,
    0,
  );
  if (data.course.totalMinutes !== 74 || minutes !== 74) {
    faults.push(`content: the course must total 74 minutes, found ${data.course.totalMinutes}`);
  }
  if (data.course.planned.length !== 4) {
    faults.push(`content: ${data.course.planned.length} planned topics, expected 4`);
  }
  for (const topic of data.course.planned) {
    if (!topic.id.trim() || !topic.title.trim()) {
      faults.push(`content: planned topic "${topic.id}" is incomplete`);
    }
  }

  validateLayers(data.layers, faults);
  validateRetrieval(data, faults);
  validateCost(data.model, faults);
  validateScores(data, faults);
  validateMapping(data.mapping, faults);

  return faults;
}

/** Throw one Error with one line per fault. */
export function assertContent(data: ContentSnapshot): void {
  const faults = validateContent(data);
  if (faults.length > 0) {
    throw new Error(`content validation failed:\n${faults.join("\n")}`);
  }
}
