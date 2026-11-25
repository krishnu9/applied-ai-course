import type { Lesson } from "@/lib/types";
import { deepFreeze } from "../freeze";

export const datasetCurationLesson = deepFreeze({
  slug: "dataset-curation",
  order: 19,
  title: "Data quality, coverage and splits",
  chapterId: "ch-08",
  chapterOrder: 8,
  status: "live",
  outcome:
    "You can define data curation, diagnose a coverage gap, and build a clean train and test split. Prerequisite: lesson 18, LoRA and memory maths.",
  artifact: "A dataset funnel script with counts at each stage.",
  readingMinutes: 20,
  difficulty: "core",
  terms: [
    {
      term: "Data curation",
      definition: "The selection and shaping of training or eval data.",
    },
    {
      term: "Data quality",
      definition: "The fitness of data on relevance, consistency, format and compliance.",
    },
    {
      term: "Data coverage",
      definition: "The range of cases that the data represents.",
    },
    {
      term: "Deduplication",
      definition: "The removal of near-identical records.",
    },
    {
      term: "Annotation",
      definition: "The human labeling of data under written guidelines.",
    },
    {
      term: "Data split",
      definition: "The division of data into train, validation and test parts.",
    },
  ],
  evalCase: {
    id: "case-dataset-curation",
    brief: "Explain a billing ticket failure as a coverage gap.",
  },
  sections: [
    {
      id: "what-it-is",
      title: "What it is",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "dataset-curation-p-1",
          text: "Data curation is the selection and shaping of training or eval data. It covers quality, coverage, quantity, annotation and the split. Data quality is fitness on relevance, consistency, format and compliance. A curated set is labeled and frozen; a raw dump is not.",
        },
        {
          kind: "paragraph",
          id: "dataset-curation-p-2",
          text: "A worked example: a team starts with 1,200 billing tickets. Inspection finds 180 near duplicates, 120 empty or personal-data rows, and a thin refund slice. After dedupe, filter and a top-up, 900 rows remain. The split holds 630 train, 135 validation and 135 test rows.",
        },
        {
          kind: "paragraph",
          id: "dataset-curation-p-3",
          text: "A non-example: a team downloads 50,000 tickets and trains on all of them. The eval score rises, because the test rows sit in the train set. This is a split leak, not curation. A large set can hide the defect that matters.",
        },
        {
          kind: "paragraph",
          id: "dataset-curation-p-4",
          text: "The work is subtractive. Each stage removes one defect class, and the counts stay visible. A funnel with numbers is easier to defend.",
        },
      ],
    },
    {
      id: "eli5-a-city-survey",
      title: "A city survey",
      register: "eli5",
      blocks: [
        {
          kind: "analogy",
          id: "dataset-curation-analogy-1",
          text: "Think of a survey team that wants to know how a city commutes. The team stands on one street corner and asks 500 people, so the count is large but the sample covers one neighborhood. Coverage is the range of the city that the survey reaches, and quantity is the number of answers. A small survey across every district beats a large survey on one corner. The team writes the district on each answer, so the count can be split later.",
          breaks:
            "A city has clear districts, while a dataset has hidden slices. A slice can be absent and still leave no visible hole.",
        },
        {
          kind: "paragraph",
          id: "dataset-curation-p-5",
          text: "Prediction: a train set has 10,000 rows and no refund cases. Is the problem quantity or coverage, what do you add, and which slice is missing?",
        },
      ],
    },
    {
      id: "how-it-works",
      title: "How it works",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "dataset-curation-p-6",
          text: "The funnel runs from raw rows to a frozen split. Each step has a count and a rule.",
        },
        {
          kind: "list",
          id: "dataset-curation-list-1",
          ordered: true,
          items: [
            "Collect rows with a source, a date and a permitted use.",
            "Inspect a sample and write the defect list before you filter.",
            "Dedupe exact rows by hash, then near rows by similarity.",
            "Filter on relevance, format, personal data and license.",
            "Label rows with written guidelines and two annotators.",
            "Measure agreement and adjudicate low-agreement rows.",
            "Stratify by slice, split 70/15/15, freeze validation and test.",
            "Check token overlap between train and test, then refreeze.",
          ],
        },
        {
          kind: "paragraph",
          id: "dataset-curation-p-7",
          text: "Quality, coverage and quantity answer three questions. Quality asks whether a row is correct and permitted. Coverage asks whether each production slice appears. Quantity asks whether enough rows exist to learn and test. A large set can still fail coverage, because one template fills most of it.",
        },
        {
          kind: "paragraph",
          id: "dataset-curation-p-8",
          text: "Deduplication has two passes. An exact hash removes byte-identical rows. A near-duplicate pass compares token sets with Jaccard similarity and removes pairs above 0.8. Near duplicates inflate the count and leak. Report the removed count per pass.",
        },
        {
          kind: "paragraph",
          id: "dataset-curation-p-9",
          text: "Contamination is train data that overlaps the test set. Compare n-gram overlap between each test row and train, and remove any test row that appears in train. Then refreeze. A contaminated test raises the score without improving the product.",
        },
        {
          kind: "paragraph",
          id: "dataset-curation-p-10",
          text: "Annotation needs a written guideline, not a verbal brief. Two annotators label a sample, and the team computes inter-annotator agreement. A low score means the guideline is ambiguous. Adjudicate disputed rows and relabel.",
        },
        {
          kind: "paragraph",
          id: "dataset-curation-p-11",
          text: "The format follows the training phase. Pretraining reads raw text. SFT reads chat turns with a role and content field. Preference tuning reads a prompt with a chosen and rejected answer. An eval set reads an input with a label and slice.",
        },
        {
          kind: "paragraph",
          id: "dataset-curation-p-12",
          text: "Chain-of-thought data adds a reasoning trace between the question and the answer. Keep only traces that reach a correct final answer, because a wrong trace teaches wrong steps. A short verified trace beats a long fluent one.",
        },
        {
          kind: "paragraph",
          id: "dataset-curation-p-13",
          text: "Tool-use data stores a tool call, its arguments, the observation and the final answer. Check the argument schema and the observation against the tool result. A fabricated observation teaches the model to invent output.",
        },
        {
          kind: "table",
          id: "dataset-curation-table-1",
          columns: ["Phase", "Format", "Fields"],
          rows: [
            ["Pretraining", "Raw text", "text"],
            ["SFT", "Chat turns", "role, content"],
            ["Preference", "Answer pair", "prompt, chosen, rejected"],
            ["Eval", "Case", "input, label, slice"],
          ],
          caption: "One format for each training phase.",
        },
        {
          kind: "diagram",
          id: "dataset-curation-diagram-1",
          variant: "timeline",
          spec: {
            nodes: [
              { id: "collect", label: "Collect" },
              { id: "inspect", label: "Inspect" },
              { id: "dedupe", label: "Dedupe" },
              { id: "filter", label: "Filter" },
              { id: "label", label: "Label" },
              { id: "split", label: "Split" },
            ],
            edges: [
              ["collect", "inspect"],
              ["inspect", "dedupe"],
              ["dedupe", "filter"],
              ["filter", "label"],
              ["label", "split"],
            ],
          },
          caption:
            "Each stage removes one defect class; the split freezes the test before training.",
          alt: "Timeline from collect through inspect, dedupe, filter and label to the split.",
        },
      ],
    },
    {
      id: "eli5-the-baker-bins",
      title: "The baker's ingredient bins",
      register: "eli5",
      blocks: [
        {
          kind: "analogy",
          id: "dataset-curation-analogy-2",
          text: "Think of a baker with 50 kilograms of flour and no yeast. The pantry is large, but it cannot bake bread; quantity is not coverage, and a small pantry with flour, yeast, salt and water can bake. The recipe is the annotation guideline, and the test loaf is the held-out case. The baker weighs each bin before the bake, as the team counts each slice. A bin can look full from the lid and hold the wrong grain.",
          breaks:
            "A pantry list is complete, while a dataset often hides a missing slice until a test fails.",
        },
        {
          kind: "paragraph",
          id: "dataset-curation-p-14",
          text: "Prediction: the pantry has 50 kilograms of flour and no yeast. Which number do you raise, and which slice does the missing bin match?",
        },
      ],
    },
    {
      id: "where-it-fails",
      title: "Where it fails",
      register: "standard",
      blocks: [
        {
          kind: "table",
          id: "dataset-curation-table-2",
          columns: ["Symptom", "Cause", "Check", "Fix"],
          rows: [
            [
              "One slice fails while the total score is fine",
              "Coverage gap",
              "Count rows per slice",
              "Collect and stratify the missing slice",
            ],
            [
              "Eval score is too high",
              "Contamination",
              "Check n-gram overlap between splits",
              "Remove overlaps and refreeze",
            ],
            [
              "One template dominates the set",
              "Near-duplicate pass is missing",
              "Sample pairs at 0.8 similarity",
              "Dedupe near rows before the split",
            ],
            [
              "Annotators disagree",
              "Weak guideline",
              "Measure inter-annotator agreement",
              "Rewrite the rule and adjudicate",
            ],
          ],
          caption: "Four failures, from the score back to the rows.",
        },
        {
          kind: "paragraph",
          id: "dataset-curation-p-15",
          text: "More rows raise coverage and add review cost and label noise. A small verified set often beats a large one, so pay for labels before volume.",
        },
      ],
    },
    {
      id: "triage-case",
      title: "The triage case",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "dataset-curation-p-16",
          text: "The billing classifier passes 0.78 of all tickets but only 0.31 of refund tickets. The team checks the train set before it changes the model. The set holds 900 rows, and only 12 are refund rows. All 12 describe a damaged item.",
        },
        {
          kind: "paragraph",
          id: "dataset-curation-p-17",
          text: "The trace shows a coverage gap, not a model defect. The refund slice has one sub-case and no variation. Dedupe removed 180 repeated templates, so the raw count hid the thin slice. The overlap check finds 4 eval tickets in train, which adds contamination.",
        },
        {
          kind: "paragraph",
          id: "dataset-curation-p-18",
          text: "The team collects 80 refund cases across four sub-cases: late refund, partial refund, damaged item and missing label. It removes the 4 overlapping rows and refreezes the test. The refund slice rises from 0.31 to 0.69, and the total moves to 0.80.",
        },
        {
          kind: "paragraph",
          id: "dataset-curation-p-19",
          text: "The decision is data, not a new model. The guide requires one row per sub-case and a slice count before each split. The review checks the same counts.",
        },
      ],
    },
    {
      id: "concept-checks",
      title: "Concept checks",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "dataset-curation-p-20",
          text: "Answer five questions on coverage, contamination, dedupe, splits and annotation.",
        },
        { kind: "check", id: "dataset-curation-check-1", checkId: "check-1" },
        { kind: "check", id: "dataset-curation-check-2", checkId: "check-2" },
        { kind: "check", id: "dataset-curation-check-3", checkId: "check-3" },
        { kind: "check", id: "dataset-curation-check-4", checkId: "check-4" },
        { kind: "check", id: "dataset-curation-check-5", checkId: "check-5" },
      ],
    },
    {
      id: "evaluation-task",
      title: "Evaluation task",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "dataset-curation-p-21",
          text: "Use the fixed raw set of 1,200 rows, 180 near duplicates, and 120 filtered rows. Run the funnel, split 70/15/15, check each slice against a 50-row target, then remove the 6 eval overlaps from train.",
        },
        { kind: "task", id: "task-dataset-curation" },
        {
          kind: "paragraph",
          id: "dataset-curation-p-22",
          text: "The reference solution prints 1,020 rows after dedupe and 900 after filter. The split is 630 train, 135 validation and 135 test. The refund slice prints 38 against the target of 50, so it fails. The other four slices pass, and the overlap removal leaves 624 train rows.",
        },
      ],
    },
    {
      id: "prove-the-change",
      title: "Prove the change",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "dataset-curation-p-23",
          text: "Write one sentence with the form: I changed X; the result was Y. Name the stage and the slice count. Example: I added 80 refund rows; the slice rose from 0.31 to 0.69.",
        },
        {
          kind: "paragraph",
          id: "dataset-curation-p-24",
          text: "Self-rubric: mechanism names the stage and the rule. Evidence gives a fixed count or slice score. Limit names one slice or defect the change did not fix.",
        },
        {
          kind: "note",
          id: "dataset-curation-note-1",
          text: "A total score can hide a thin slice. Count the slice before you trust the total.",
        },
      ],
    },
    {
      id: "interview-corner",
      title: "Interview corner",
      register: "standard",
      blocks: [
        {
          kind: "interview",
          id: "dataset-curation-interview-1",
          items: [
            {
              question: "What is data curation?",
              answer:
                "Data curation is the selection and shaping of training or eval data. It covers quality, coverage, quantity, annotation and the split. The output is a small, labeled and frozen set with a count at each stage, not a raw dump. A frozen test and a label are part of the output.",
            },
            {
              question: "When do you choose a small curated set over a large raw set?",
              answer:
                "Choose the small curated set when labels are reliable and each slice is visible. A large raw set adds duplicates, noise and review cost, and one template can fill most of it. Measure coverage per slice before you measure total size. A large set can still cover one slice.",
            },
            {
              question: "How does a dataset fail, and what do you check?",
              answer:
                "It fails through a coverage gap, contamination, missing dedupe or weak annotation. Count rows per slice, check n-gram overlap between train and test, and measure inter-annotator agreement. A slice score and a fixed count find the defect faster than a total score. Check the slice count again after the fix.",
            },
            {
              question: "How does curation change at 10x data?",
              answer:
                "At 10x data, exact and near-duplicate passes matter more, because duplicates grow faster than useful variety. Sample and inspect before labeling, and keep a slice target for each production case. Track the removed count per stage so a larger funnel stays explainable. Keep the stage counts with the model card.",
            },
          ],
        },
      ],
    },
  ],
  checks: [
    {
      id: "check-1",
      kind: "definition",
      prompt: "Which sentence defines data coverage?",
      options: [
        { id: "option-a", label: "The number of rows in the set." },
        { id: "option-b", label: "The range of cases that the data represents." },
        { id: "option-c", label: "The share of rows with a label." },
        { id: "option-d", label: "The size of the test split." },
      ],
      correctOptionId: "option-b",
      explanation:
        "Coverage is the range of cases, so a set can be large and still cover one slice. Row count is quantity, and label share is a quality measure.",
    },
    {
      id: "check-2",
      kind: "apply",
      prompt: "A set has 10,000 rows, and 9,000 repeat one template. Which problem does the set have?",
      options: [
        { id: "option-a", label: "A coverage problem" },
        { id: "option-b", label: "A split problem only" },
        { id: "option-c", label: "No problem, because the set is large" },
        { id: "option-d", label: "A latency problem" },
      ],
      correctOptionId: "option-a",
      explanation:
        "One template fills most of the set, so other slices are thin or absent. The count is large, and the range of cases is small.",
    },
    {
      id: "check-3",
      kind: "diagnose",
      prompt: "Eval scores 0.91 offline and 0.62 in production. Which check comes first?",
      options: [
        { id: "option-a", label: "GPU memory" },
        { id: "option-b", label: "N-gram overlap between train and test" },
        { id: "option-c", label: "Sampling temperature" },
        { id: "option-d", label: "The number of layers" },
      ],
      correctOptionId: "option-b",
      explanation:
        "A large offline and online gap points to contamination or a split leak. Check token overlap, remove the overlaps and refreeze the test before you change the model.",
    },
    {
      id: "check-4",
      kind: "calculate",
      prompt: "A funnel leaves 900 rows. The split uses 70 percent for train. How many train rows remain?",
      options: [
        { id: "option-a", label: "540" },
        { id: "option-b", label: "630" },
        { id: "option-c", label: "700" },
        { id: "option-d", label: "810" },
      ],
      correctOptionId: "option-b",
      explanation:
        "70 percent of 900 is 630 train rows. A value of 540 would use 60 percent, and 700 would leave no validation or test part.",
    },
    {
      id: "check-5",
      kind: "diagnose",
      prompt: "Two annotators agree on 0.55 of rows. What is the first fix?",
      options: [
        { id: "option-a", label: "Collect more rows" },
        { id: "option-b", label: "Rewrite the annotation guideline" },
        { id: "option-c", label: "Raise the model rank" },
        { id: "option-d", label: "Lower the temperature" },
      ],
      correctOptionId: "option-b",
      explanation:
        "Low agreement usually means the guideline is ambiguous, so the rule needs a rewrite. More rows repeat the same ambiguity, and model settings do not change labels.",
    },
  ],
  task: {
    id: "task-dataset-curation",
    scope: "Run a dataset funnel on fixed counts and check a slice target.",
    items: [
      {
        id: "item-1",
        label: "Inspect the raw counts and name one defect for each filter rule.",
      },
      {
        id: "item-2",
        label: "Dedupe the set and record the remaining count.",
      },
      {
        id: "item-3",
        label: "Filter empty, personal-data and malformed rows, and record the count.",
      },
      {
        id: "item-4",
        label: "Split 70/15/15 and check each slice against the 50-row target.",
      },
      {
        id: "item-5",
        label: "Remove the 6 eval overlaps and state the final train count.",
      },
    ],
    solution: {
      filename: "data/funnel.py",
      language: "python",
      code: [
        "RAW = 1200",
        "NEAR_DUPES = 180",
        "EMPTY = 60",
        "PII = 40",
        "MALFORMED = 20",
        "TARGET = 50",
        "SLICES = {",
        '    "refund": 38,',
        '    "shipping": 210,',
        '    "billing": 240,',
        '    "account": 190,',
        '    "other": 222,',
        "}",
        "",
        "after_dedupe = RAW - NEAR_DUPES",
        "after_filter = after_dedupe - (EMPTY + PII + MALFORMED)",
        "train = int(after_filter * 0.70)",
        "val = int(after_filter * 0.15)",
        "test = after_filter - train - val",
        "",
        'print(f"raw {RAW}")',
        'print(f"after dedupe {after_dedupe}")',
        'print(f"after filter {after_filter}")',
        'print(f"train {train} val {val} test {test}")',
        "",
        "for name, count in SLICES.items():",
        '    status = "ok" if count >= TARGET else "FAIL"',
        '    print(f"{name} {count} {status}")',
        "",
        "OVERLAP = 6",
        'print(f"eval overlap {OVERLAP} -> train {train - OVERLAP}")',
      ].join("\n"),
    },
  },
  prove: {
    prompt: "Which dataset stage did you change, and how did the slice score move?",
    placeholder: "I changed X; the result was Y.",
    maxLength: 280,
    debounceMs: 800,
    savedMessage: "Proof saved on this device.",
  },
  citation:
    "Further reading: AI Engineering by Chip Huyen (O'Reilly). This course is independent and reproduces no book text or figures.",
} as const satisfies Lesson);
