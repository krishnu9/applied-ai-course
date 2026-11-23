import type {
  Block,
  CheckKind,
  CostModel,
  Course,
  DiagramVariant,
  EvaluationStage,
  Lesson,
  LessonSlug,
  MappingRow,
  PresetQuery,
  RetrievalDoc,
  SampleMetrics,
  Chapter,
} from "@/lib/types";
import {
  BASELINE,
  CAPSTONE_STAGES,
  CHAPTERS,
  EXPECTED_LESSON_COUNT,
  FLAGSHIP_SLUGS,
  INTERACTIVE_WIDGET_IDS,
  LESSONS as REGISTRY_LESSONS,
  LESSON_SLUGS,
  MAX_CHECKS_PER_LESSON,
  TASK_ITEM_IDS,
} from "@/lib/course-registry";
import { scoreSummary } from "./scores";

export interface ContentSnapshot {
  course: Course;
  allLessons: readonly Lesson[];
  chapters: readonly Chapter[];
  stages: readonly EvaluationStage[];
  docs: readonly RetrievalDoc[];
  queries: readonly PresetQuery[];
  model: CostModel;
  mapping: readonly MappingRow[];
}

const SLUG_PATTERN = /^[a-z][a-z0-9-]*$/;
const SECTION_ID_PATTERN = /^[a-z][a-z0-9-]{0,40}$/;
const TAG_PATTERN = /^[a-z][a-z-]*$/;

const CODE_OUTPUT_LABEL = "Sample output. Fixed data.";
const NOTE_LABEL = "Proof saved on this device.";
const PROVE_PLACEHOLDER = "I changed X; the result was Y.";

const CHECK_KINDS: readonly CheckKind[] = [
  "definition",
  "apply",
  "diagnose",
  "calculate",
];

const ACTIVE_CHECK_KINDS: readonly CheckKind[] = ["apply", "diagnose", "calculate"];

const DIAGRAM_VARIANTS: readonly DiagramVariant[] = [
  "flow",
  "stack",
  "matrix",
  "timeline",
  "bars",
];

const LEGACY_WIDGET_IDS = ["retrieval-explorer", "cost-calculator"] as const;

const MIN_TERMS = 4;
const MAX_TERMS = 6;
const MIN_ELI5_SECTIONS = 2;
const MAX_ELI5_SECTIONS = 3;
const MIN_FINAL_CHECKS = 4;
const MAX_INTERVIEW_ITEMS = 4;
const STANDARD_WORDS = { min: 1100, max: 1500 } as const;
const FLAGSHIP_WORDS = { min: 1900, max: 2400 } as const;

function isFinalCourse(): boolean {
  return process.env.COURSE_FINAL === "1";
}

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

function isKnown<T extends string>(values: readonly T[], value: string): value is T {
  return (values as readonly string[]).includes(value);
}

/**
 * Count the prose words in a lesson. Prose is section titles, paragraphs,
 * list items, callout titles and text, note text, diagram captions, analogy
 * text, table text and interview text. Code, checks, task labels and page copy
 * are not prose.
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
        case "analogy":
          total += words(block.text);
          total += words(block.breaks);
          break;
        case "table":
          if (block.caption) total += words(block.caption);
          total += words(block.columns.join(" "));
          for (const row of block.rows) total += words(row.join(" "));
          break;
        case "interview":
          for (const item of block.items) {
            total += words(item.question);
            total += words(item.answer);
          }
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

function validateIdentity(lesson: Lesson, index: number, faults: string[]): void {
  const at = `lesson "${lesson.slug}"`;
  const expected = REGISTRY_LESSONS[index];

  if (!expected) {
    faults.push(`course: ${at} is at position ${index + 1} with no registry entry`);
  } else {
    if (lesson.slug !== expected.slug) {
      faults.push(
        `${at} field "slug": position ${index + 1} must be "${expected.slug}"`,
      );
    }
    if (lesson.chapterId !== expected.chapterId) {
      faults.push(
        `${at} field "chapterId": "${lesson.chapterId}", expected "${expected.chapterId}"`,
      );
    }
    const chapter = CHAPTERS.find((candidate) => candidate.id === expected.chapterId);
    if (chapter && lesson.chapterOrder !== chapter.order) {
      faults.push(
        `${at} field "chapterOrder": ${lesson.chapterOrder}, expected ${chapter.order}`,
      );
    }
  }

  if (!SLUG_PATTERN.test(lesson.slug)) {
    faults.push(`${at} field "slug": does not match the slug pattern`);
  }
  if (lesson.order !== index + 1) {
    faults.push(`${at} field "order": ${lesson.order}, expected ${index + 1}`);
  }
  if (!lesson.title.trim()) {
    faults.push(`${at} field "title": is empty`);
  }
  if (!lesson.outcome.trim()) {
    faults.push(`${at} field "outcome": is empty`);
  }
  if (!lesson.artifact.trim()) {
    faults.push(`${at} field "artifact": is empty`);
  }
  if (!Number.isInteger(lesson.readingMinutes) || lesson.readingMinutes < 1) {
    faults.push(
      `${at} field "readingMinutes": ${lesson.readingMinutes}, expected a positive integer`,
    );
  }

  const stage = CAPSTONE_STAGES.find((candidate) => candidate.lessonSlug === lesson.slug);
  if (stage) {
    if (lesson.layerId !== stage.id) {
      faults.push(
        `${at} field "layerId": "${lesson.layerId ?? ""}", expected "${stage.id}" for capstone lesson`,
      );
    }
  } else if (lesson.layerId !== undefined) {
    faults.push(
      `${at} field "layerId": "${lesson.layerId}" on a lesson with no capstone stage`,
    );
  }
}

function validateTerms(lesson: Lesson, faults: string[]): void {
  const at = `lesson "${lesson.slug}"`;
  const terms = lesson.terms ?? [];
  if (terms.length < MIN_TERMS || terms.length > MAX_TERMS) {
    faults.push(
      `${at} field "terms": ${terms.length}, expected ${MIN_TERMS} to ${MAX_TERMS}`,
    );
  }
  const seen = new Set<string>();
  for (const term of terms) {
    if (!term.term.trim()) {
      faults.push(`${at} field "terms": a term has no name`);
    }
    if (!term.definition.trim()) {
      faults.push(`${at} field "terms": term "${term.term}" has no definition`);
    }
    const key = term.term.trim().toLowerCase();
    if (seen.has(key)) {
      faults.push(`${at} field "terms": duplicate term "${term.term}"`);
    }
    seen.add(key);
  }
}

function validateSectionsAndBlocks(lesson: Lesson, faults: string[]): void {
  const at = `lesson "${lesson.slug}"`;
  const sectionIds = new Set<string>();
  const blockIds = new Set<string>();

  if (lesson.sections.length === 0) {
    faults.push(`${at} field "sections": has no sections`);
  }

  for (const section of lesson.sections) {
    if (!SECTION_ID_PATTERN.test(section.id)) {
      faults.push(`${at} field "sections": invalid section id "${section.id}"`);
    }
    if (sectionIds.has(section.id)) {
      faults.push(`${at} field "sections": duplicate section id "${section.id}"`);
    }
    sectionIds.add(section.id);
    if (!section.title.trim()) {
      faults.push(`${at} field "sections": section "${section.id}" has no title`);
    }
    if (
      section.register !== undefined &&
      section.register !== "standard" &&
      section.register !== "eli5"
    ) {
      faults.push(
        `${at} field "sections": section "${section.id}" has an unknown register`,
      );
    }
    for (const block of section.blocks) {
      if (blockIds.has(block.id)) {
        faults.push(`${at} field "blocks": duplicate block id "${block.id}"`);
      }
      blockIds.add(block.id);
    }
  }
}

function validateBlocks(lesson: Lesson, faults: string[]): void {
  const at = `lesson "${lesson.slug}"`;
  const blocks = blocksOf(lesson);

  const codeBlocks = blocks.filter((block) => block.kind === "code");
  for (const block of codeBlocks) {
    if (block.kind !== "code") continue;
    if (block.output.label !== CODE_OUTPUT_LABEL) {
      faults.push(`${at} field "blocks": code block has the wrong output label`);
    }
    if (!block.output.text.trim()) {
      faults.push(`${at} field "blocks": code block has no sample output`);
    }
    if (!block.code.trim() || !block.filename.trim() || !block.language.trim()) {
      faults.push(
        `${at} field "blocks": code block is missing a filename, language or code`,
      );
    }
  }

  const taskBlocks = blocks.filter((block) => block.kind === "task");
  if (taskBlocks.length !== 1) {
    faults.push(`${at} field "blocks": ${taskBlocks.length} task blocks, expected 1`);
  }

  const diagramBlocks = blocks.filter((block) => block.kind === "diagram");
  if (diagramBlocks.length > 1) {
    faults.push(
      `${at} field "blocks": ${diagramBlocks.length} static diagrams, expected at most 1`,
    );
  }
  for (const block of diagramBlocks) {
    if (block.kind !== "diagram") continue;
    if (block.variant !== undefined && !isKnown(DIAGRAM_VARIANTS, block.variant)) {
      faults.push(`${at} field "blocks": diagram has an unknown variant`);
    }
    const nodeIds = new Set(block.spec.nodes.map((node) => node.id));
    if (block.spec.nodes.length < 4 || block.spec.nodes.length > 7) {
      faults.push(
        `${at} field "blocks": diagram has ${block.spec.nodes.length} nodes, expected 4 to 7`,
      );
    }
    if (nodeIds.size !== block.spec.nodes.length) {
      faults.push(`${at} field "blocks": diagram has duplicate node ids`);
    }
    for (const node of block.spec.nodes) {
      if (!node.id.trim() || !node.label.trim()) {
        faults.push(`${at} field "blocks": diagram has a node without an id or label`);
      }
    }
    for (const [from, to] of block.spec.edges) {
      if (!nodeIds.has(from) || !nodeIds.has(to)) {
        faults.push(
          `${at} field "blocks": diagram edge ${from} -> ${to} names a missing node`,
        );
      }
    }
    if (block.spec.edges.length === 0) {
      faults.push(`${at} field "blocks": diagram has no edges`);
    }
    if (block.caption.length > 120) {
      faults.push(`${at} field "blocks": diagram caption is longer than 120 characters`);
    }
    if (!block.alt.trim()) {
      faults.push(`${at} field "blocks": diagram has no alt text`);
    }
  }

  const interactiveBlocks = blocks.filter((block) => block.kind === "interactive");
  for (const block of interactiveBlocks) {
    if (block.kind !== "interactive") continue;
    if (!isKnown(INTERACTIVE_WIDGET_IDS, block.widget)) {
      faults.push(`${at} field "blocks": unknown interactive widget "${block.widget}"`);
    }
    if (!block.caption.trim()) {
      faults.push(`${at} field "blocks": interactive block has no caption`);
    }
  }

  const widgetBlocks = blocks.filter((block) => block.kind === "widget");
  for (const block of widgetBlocks) {
    if (block.kind !== "widget") continue;
    if (!isKnown(LEGACY_WIDGET_IDS, block.widget)) {
      faults.push(`${at} field "blocks": unknown widget "${block.widget}"`);
    }
    if (block.caption.length > 120) {
      faults.push(`${at} field "blocks": widget caption is longer than 120 characters`);
    }
  }

  const analogyBlocks = blocks.filter((block) => block.kind === "analogy");
  for (const block of analogyBlocks) {
    if (block.kind !== "analogy") continue;
    if (!block.text.trim()) {
      faults.push(`${at} field "blocks": analogy has no text`);
    }
    if (!block.breaks.trim()) {
      faults.push(`${at} field "blocks": analogy has no "breaks" line`);
    }
  }

  const tableBlocks = blocks.filter((block) => block.kind === "table");
  for (const block of tableBlocks) {
    if (block.kind !== "table") continue;
    if (block.columns.length < 2) {
      faults.push(`${at} field "blocks": table has fewer than 2 columns`);
    }
    if (block.rows.length === 0) {
      faults.push(`${at} field "blocks": table has no rows`);
    }
    for (const row of block.rows) {
      if (row.length !== block.columns.length) {
        faults.push(`${at} field "blocks": table row width does not match its columns`);
      }
    }
  }

  const interviewBlocks = blocks.filter((block) => block.kind === "interview");
  for (const block of interviewBlocks) {
    if (block.kind !== "interview") continue;
    for (const item of block.items) {
      if (!item.question.trim() || !item.answer.trim()) {
        faults.push(`${at} field "blocks": interview item is incomplete`);
      }
    }
  }
}

function validateChecks(lesson: Lesson, faults: string[]): void {
  const at = `lesson "${lesson.slug}"`;
  const blocks = blocksOf(lesson);
  const checkBlocks = blocks.filter((block) => block.kind === "check");

  if (lesson.checks.length < 1 || lesson.checks.length > MAX_CHECKS_PER_LESSON) {
    faults.push(
      `${at} field "checks": ${lesson.checks.length}, expected 1 to ${MAX_CHECKS_PER_LESSON}`,
    );
  }
  if (checkBlocks.length !== lesson.checks.length) {
    faults.push(
      `${at} field "checks": ${checkBlocks.length} check blocks for ${lesson.checks.length} checks`,
    );
  }

  const checkIds = new Set<string>();
  const referencedCheckIds = new Set<string>();
  for (const check of lesson.checks) {
    if (checkIds.has(check.id)) {
      faults.push(`${at} field "checks": duplicate check id "${check.id}"`);
    }
    checkIds.add(check.id);
    if (!check.prompt.trim()) {
      faults.push(`${at} field "checks": check "${check.id}" has no prompt`);
    }
    if (check.kind !== undefined && !isKnown(CHECK_KINDS, check.kind)) {
      faults.push(`${at} field "checks": check "${check.id}" has an unknown kind`);
    }
    if (check.options.length < 3 || check.options.length > 4) {
      faults.push(
        `${at} field "checks": check "${check.id}" has ${check.options.length} options, expected 3 or 4`,
      );
    }
    if (!check.options.some((option) => option.id === check.correctOptionId)) {
      faults.push(
        `${at} field "checks": check "${check.id}" has no option "${check.correctOptionId}"`,
      );
    }
    const optionIds = new Set(check.options.map((option) => option.id));
    if (optionIds.size !== check.options.length) {
      faults.push(`${at} field "checks": check "${check.id}" has duplicate option ids`);
    }
    for (const option of check.options) {
      if (!option.label.trim()) {
        faults.push(
          `${at} field "checks": check "${check.id}" option "${option.id}" has no label`,
        );
      }
    }
    if (sentenceCount(check.explanation) < 2) {
      faults.push(
        `${at} field "checks": check "${check.id}" explanation must hold 2 sentences or more`,
      );
    }
  }

  for (const block of checkBlocks) {
    if (block.kind !== "check") continue;
    if (!checkIds.has(block.checkId)) {
      faults.push(
        `${at} field "checks": check block names unknown check "${block.checkId}"`,
      );
    }
    if (referencedCheckIds.has(block.checkId)) {
      faults.push(`${at} field "checks": check "${block.checkId}" is placed twice`);
    }
    referencedCheckIds.add(block.checkId);
  }
  for (const id of checkIds) {
    if (!referencedCheckIds.has(id)) {
      faults.push(`${at} field "checks": check "${id}" has no block`);
    }
  }
}

function validateTask(lesson: Lesson, faults: string[]): void {
  const at = `lesson "${lesson.slug}"`;
  const task = lesson.task;
  if (!task.scope.trim()) {
    faults.push(`${at} field "task": has no scope sentence`);
  }
  if (task.items.length !== TASK_ITEM_IDS.length) {
    faults.push(
      `${at} field "task": ${task.items.length} items, expected ${TASK_ITEM_IDS.length}`,
    );
  }
  for (let index = 0; index < task.items.length; index += 1) {
    const item = task.items[index];
    if (item.id !== TASK_ITEM_IDS[index]) {
      faults.push(
        `${at} field "task": item ${index + 1} has id "${item.id}", expected "${TASK_ITEM_IDS[index]}"`,
      );
    }
    if (!item.label.trim()) {
      faults.push(`${at} field "task": item ${index + 1} has no label`);
    }
  }
  if (
    !task.solution.filename.trim() ||
    !task.solution.language.trim() ||
    !task.solution.code.trim()
  ) {
    faults.push(`${at} field "task": solution is incomplete`);
  }
}

function validateProveAndCitation(lesson: Lesson, faults: string[]): void {
  const at = `lesson "${lesson.slug}"`;
  if (lesson.prove.placeholder !== PROVE_PLACEHOLDER) {
    faults.push(`${at} field "prove": placeholder is wrong`);
  }
  if (lesson.prove.maxLength !== 280) {
    faults.push(`${at} field "prove": maxLength is not 280`);
  }
  if (lesson.prove.debounceMs !== 800) {
    faults.push(`${at} field "prove": debounceMs is not 800`);
  }
  if (lesson.prove.savedMessage !== NOTE_LABEL) {
    faults.push(`${at} field "prove": savedMessage is wrong`);
  }
  if (!lesson.prove.prompt.trim()) {
    faults.push(`${at} field "prove": prompt is empty`);
  }

  if (lesson.citation.includes("\n")) {
    faults.push(`${at} field "citation": must be one line`);
  }
  if (lesson.citation.length > 160) {
    faults.push(`${at} field "citation": is longer than 160 characters`);
  }
  if (
    !lesson.citation.includes("Chip Huyen") ||
    !lesson.citation.includes("AI Engineering")
  ) {
    faults.push(
      `${at} field "citation": must name AI Engineering by Chip Huyen`,
    );
  }
}

function validateLiveBase(lesson: Lesson, faults: string[]): void {
  const at = `lesson "${lesson.slug}"`;
  validateTerms(lesson, faults);

  if (
    !lesson.evalCase ||
    !lesson.evalCase.id.trim() ||
    !lesson.evalCase.brief.trim()
  ) {
    faults.push(`${at} field "evalCase": must have an id and a brief`);
  }

  validateSectionsAndBlocks(lesson, faults);
  validateBlocks(lesson, faults);
  validateChecks(lesson, faults);
  validateTask(lesson, faults);
  validateProveAndCitation(lesson, faults);
}

function validateLiveTemplate(lesson: Lesson, faults: string[]): void {
  const at = `lesson "${lesson.slug}"`;
  const flagship = FLAGSHIP_SLUGS.includes(lesson.slug);
  const blocks = blocksOf(lesson);

  const eli5Sections = lesson.sections.filter((section) => section.register === "eli5");
  const standardSections = lesson.sections.filter(
    (section) => section.register === "standard",
  );
  if (
    eli5Sections.length < MIN_ELI5_SECTIONS ||
    eli5Sections.length > MAX_ELI5_SECTIONS
  ) {
    faults.push(
      `${at} field "sections": ${eli5Sections.length} ELI5 sections, expected ${MIN_ELI5_SECTIONS} to ${MAX_ELI5_SECTIONS}`,
    );
  }
  if (standardSections.length < 1) {
    faults.push(`${at} field "sections": needs at least one standard section`);
  }
  for (const section of lesson.sections) {
    if (section.register === undefined) {
      faults.push(
        `${at} field "sections": section "${section.id}" has no register`,
      );
    }
  }
  for (const section of eli5Sections) {
    const analogies = section.blocks.filter((block) => block.kind === "analogy");
    if (analogies.length !== 1) {
      faults.push(
        `${at} field "sections": ELI5 section "${section.id}" has ${analogies.length} analogies, expected 1`,
      );
    }
  }

  const diagrams = blocks.filter((block) => block.kind === "diagram");
  if (diagrams.length !== 1) {
    faults.push(`${at} field "blocks": ${diagrams.length} static diagrams, expected 1`);
  }
  for (const block of diagrams) {
    if (block.kind !== "diagram") continue;
    if (block.variant === undefined || !isKnown(DIAGRAM_VARIANTS, block.variant)) {
      faults.push(`${at} field "blocks": static diagram needs a known variant`);
    }
    if (!block.alt.trim()) {
      faults.push(`${at} field "blocks": static diagram needs alt text`);
    }
  }

  const interactive = blocks.filter((block) => block.kind === "interactive");
  const expectedInteractive = flagship ? 1 : 0;
  if (interactive.length !== expectedInteractive) {
    faults.push(
      `${at} field "blocks": ${interactive.length} interactive blocks, expected ${expectedInteractive}`,
    );
  }

  if (
    lesson.checks.length < MIN_FINAL_CHECKS ||
    lesson.checks.length > MAX_CHECKS_PER_LESSON
  ) {
    faults.push(
      `${at} field "checks": ${lesson.checks.length}, expected ${MIN_FINAL_CHECKS} to ${MAX_CHECKS_PER_LESSON}`,
    );
  }
  const hasActiveKind = lesson.checks.some(
    (check) => check.kind !== undefined && ACTIVE_CHECK_KINDS.includes(check.kind),
  );
  if (!hasActiveKind) {
    faults.push(
      `${at} field "checks": needs at least one apply, diagnose or calculate check`,
    );
  }

  const interviews = blocks.filter((block) => block.kind === "interview");
  if (interviews.length !== 1) {
    faults.push(
      `${at} field "blocks": ${interviews.length} interview blocks, expected 1`,
    );
  }
  for (const block of interviews) {
    if (block.kind !== "interview") continue;
    if (block.items.length !== MAX_INTERVIEW_ITEMS) {
      faults.push(
        `${at} field "blocks": interview has ${block.items.length} items, expected ${MAX_INTERVIEW_ITEMS}`,
      );
    }
  }

  const prose = countProseWords(lesson);
  const budget = flagship ? FLAGSHIP_WORDS : STANDARD_WORDS;
  if (prose < budget.min || prose > budget.max) {
    faults.push(
      `${at} field "prose": ${prose} words, expected ${budget.min} to ${budget.max}`,
    );
  }
}

function validateCourseStructure(data: ContentSnapshot, faults: string[]): void {
  if (REGISTRY_LESSONS.length !== EXPECTED_LESSON_COUNT) {
    faults.push(
      `course field "lessonCount": registry holds ${REGISTRY_LESSONS.length}, expected ${EXPECTED_LESSON_COUNT}`,
    );
  }
  if (data.allLessons.length !== EXPECTED_LESSON_COUNT) {
    faults.push(
      `course field "lessonCount": content holds ${data.allLessons.length}, expected ${EXPECTED_LESSON_COUNT}`,
    );
  }

  const seenSlugs = new Set<LessonSlug>();
  for (const lesson of data.allLessons) {
    if (seenSlugs.has(lesson.slug)) {
      faults.push(`course field "lessons": duplicate lesson slug "${lesson.slug}"`);
    }
    seenSlugs.add(lesson.slug);
  }
  for (const slug of LESSON_SLUGS) {
    if (!seenSlugs.has(slug)) {
      faults.push(`course field "lessons": no content for registry slug "${slug}"`);
    }
  }

  if (data.chapters.length !== CHAPTERS.length) {
    faults.push(
      `course field "chapters": ${data.chapters.length}, expected ${CHAPTERS.length}`,
    );
  } else {
    data.chapters.forEach((chapter, index) => {
      const expected = CHAPTERS[index];
      const at = `chapter "${chapter.id}"`;
      if (chapter.id !== expected.id) {
        faults.push(`${at} field "id": expected "${expected.id}"`);
      }
      if (chapter.order !== index + 1) {
        faults.push(`${at} field "order": ${chapter.order}, expected ${index + 1}`);
      }
      if (chapter.number !== index + 1) {
        faults.push(`${at} field "number": ${chapter.number}, expected ${index + 1}`);
      }
      if (chapter.bookChapter !== expected.bookChapter) {
        faults.push(
          `${at} field "bookChapter": ${chapter.bookChapter}, expected ${expected.bookChapter}`,
        );
      }
      if (!chapter.title.trim()) {
        faults.push(`${at} field "title": is empty`);
      }
      const expectedSlugs = REGISTRY_LESSONS.filter(
        (lesson) => lesson.chapterId === expected.id,
      ).map((lesson) => lesson.slug);
      if (chapter.lessonSlugs.join(",") !== expectedSlugs.join(",")) {
        faults.push(
          `${at} field "lessonSlugs": ${chapter.lessonSlugs.join(", ")}, expected ${expectedSlugs.join(", ")}`,
        );
      }
    });
  }

  const chapterSlugs = data.chapters.flatMap((chapter) => chapter.lessonSlugs);
  const uniqueChapterSlugs = new Set(chapterSlugs);
  if (uniqueChapterSlugs.size !== chapterSlugs.length) {
    faults.push(`course field "chapters": a lesson belongs to two chapters`);
  }
  if (chapterSlugs.length !== EXPECTED_LESSON_COUNT) {
    faults.push(
      `course field "chapters": ${chapterSlugs.length} chapter lessons, expected ${EXPECTED_LESSON_COUNT}`,
    );
  }
  for (const slug of LESSON_SLUGS) {
    if (!uniqueChapterSlugs.has(slug)) {
      faults.push(`course field "chapters": lesson "${slug}" is in no chapter`);
    }
  }

  if (data.stages.length !== CAPSTONE_STAGES.length) {
    faults.push(
      `course field "stages": ${data.stages.length}, expected ${CAPSTONE_STAGES.length}`,
    );
  } else {
    const stageLessons = new Set<LessonSlug>();
    data.stages.forEach((stage, index) => {
      const expected = CAPSTONE_STAGES[index];
      const at = `stage "${stage.id}"`;
      if (stage.id !== expected.id) {
        faults.push(`${at} field "id": expected "${expected.id}"`);
      }
      if (stage.order !== index + 1) {
        faults.push(`${at} field "order": ${stage.order}, expected ${index + 1}`);
      }
      if (!stage.name.trim()) {
        faults.push(`${at} field "name": is empty`);
      }
      if (!LESSON_SLUGS.includes(stage.lessonSlug)) {
        faults.push(`${at} field "lessonSlug": unknown lesson "${stage.lessonSlug}"`);
      }
      if (stageLessons.has(stage.lessonSlug)) {
        faults.push(`${at} field "lessonSlug": repeats "${stage.lessonSlug}"`);
      }
      stageLessons.add(stage.lessonSlug);
      if (!sameMetrics(stage.baseline, BASELINE)) {
        faults.push(`${at} field "baseline": must be 41/0.94/2400`);
      }
      if (!sameMetrics(stage.repaired, expected.repaired)) {
        faults.push(`${at} field "repaired": is not the declared sample pair`);
      }
    });
    const liveSlugs = new Set(
      data.allLessons.filter((lesson) => lesson.status === "live").map((lesson) => lesson.slug),
    );
    for (const stage of data.stages) {
      if (!liveSlugs.has(stage.lessonSlug)) {
        faults.push(
          `course field "stages": lesson "${stage.lessonSlug}" is not live`,
        );
      }
    }
  }

  const liveLessons = data.allLessons.filter((lesson) => lesson.status === "live");
  if (data.course.lessons.length !== liveLessons.length) {
    faults.push(
      `course field "lessons": ${data.course.lessons.length} live lessons, expected ${liveLessons.length}`,
    );
  }
  const minutes = liveLessons.reduce(
    (total, lesson) => total + lesson.readingMinutes,
    0,
  );
  if (data.course.totalMinutes !== minutes) {
    faults.push(
      `course field "totalMinutes": ${data.course.totalMinutes}, expected ${minutes}`,
    );
  }
  if (data.course.planned.length !== 4) {
    faults.push(
      `course field "planned": ${data.course.planned.length} topics, expected 4`,
    );
  }
  for (const topic of data.course.planned) {
    if (!topic.id.trim() || !topic.title.trim()) {
      faults.push(`course field "planned": topic "${topic.id}" is incomplete`);
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
  const stageFor = (slug: LessonSlug): EvaluationStage | undefined =>
    data.stages.find((stage) => stage.lessonSlug === slug);

  if (!sameMetrics(scoreSummary([]), BASELINE)) {
    faults.push("content: scoreSummary([]) must return the baseline");
  }
  const retrieval = stageFor("retrieval");
  if (retrieval && !sameMetrics(scoreSummary(["retrieval"]), retrieval.repaired)) {
    faults.push("content: scoreSummary(['retrieval']) must return the stage-03 pair");
  }
  if (
    retrieval &&
    !sameMetrics(scoreSummary(["evaluation", "retrieval"]), retrieval.repaired)
  ) {
    faults.push("content: scoreSummary must pick the highest repaired stage");
  }
  const cost = stageFor("cost");
  if (cost && !sameMetrics(scoreSummary(["cost", "retrieval"]), cost.repaired)) {
    faults.push("content: scoreSummary must pick the highest stage whatever the order");
  }
  const evaluation = stageFor("evaluation");
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
  const final = isFinalCourse();

  validateCourseStructure(data, faults);

  data.allLessons.forEach((lesson, index) => {
    validateIdentity(lesson, index, faults);
    if (lesson.status === "live") {
      validateLiveBase(lesson, faults);
      if (final) validateLiveTemplate(lesson, faults);
    } else if (final) {
      faults.push(
        `lesson "${lesson.slug}" field "status": is draft; COURSE_FINAL=1 requires 24 live lessons`,
      );
    }
  });

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
