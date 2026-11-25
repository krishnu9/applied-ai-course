import type { Lesson } from "@/lib/types";
import { deepFreeze } from "../freeze";

export const syntheticDataLesson = deepFreeze({
  slug: "synthetic-data",
  order: 20,
  title: "Synthesis and distillation",
  chapterId: "ch-08",
  chapterOrder: 8,
  status: "live",
  outcome:
    "You can define data synthesis, run a teacher and student pipeline, and check synthetic data for legality and collapse. Prerequisite: lesson 19, dataset curation.",
  artifact: "A teacher and verifier script for twelve fixed candidates.",
  readingMinutes: 19,
  difficulty: "core",
  terms: [
    {
      term: "Data synthesis",
      definition: "The generation of new training data, often by a model.",
    },
    {
      term: "Distillation",
      definition: "Training a smaller student model on outputs from a larger teacher model.",
    },
    {
      term: "Teacher model",
      definition: "The larger model that produces training targets in distillation.",
    },
    {
      term: "Student model",
      definition: "The smaller model that is trained to copy the teacher.",
    },
    {
      term: "Model collapse",
      definition: "The quality loss when models train on their own unverified output.",
    },
    {
      term: "License",
      definition: "The legal terms that govern use of data, weights or a model.",
    },
  ],
  evalCase: {
    id: "case-synthetic-data",
    brief: "Decide whether synthetic tickets may enter the eval set.",
  },
  sections: [
    {
      id: "what-it-is",
      title: "What it is",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "synthetic-data-p-1",
          text: "Data synthesis is the generation of new training data, often by a model. Distillation trains a smaller student model on outputs from a larger teacher model. The teacher writes targets, and a verifier decides which targets may train the student. Synthesis adds coverage where human data is thin, and it moves cost to verification.",
        },
        {
          kind: "paragraph",
          id: "synthetic-data-p-2",
          text: "A worked example: a team needs 2,000 tone examples. A teacher generates 2,400 candidates from 40 seed tickets and a style guide. A verifier accepts 1,700, and an overlap check removes 60 that match the eval set. The student trains on 1,640 verified rows.",
        },
        {
          kind: "paragraph",
          id: "synthetic-data-p-3",
          text: "A non-example: a team copies teacher answers into the eval set. The test now measures the teacher, not the student. Eval data must stay human-labeled and separate from every synthetic set.",
        },
        {
          kind: "paragraph",
          id: "synthetic-data-p-4",
          text: "The pipeline has three gates: a clear gap, a written output contract and a measured pass rate. A row that fails a gate never reaches the student.",
        },
      ],
    },
    {
      id: "eli5-a-master-and-an-apprentice",
      title: "A master chef and an apprentice",
      register: "eli5",
      blocks: [
        {
          kind: "analogy",
          id: "synthetic-data-analogy-1",
          text: "Think of a master chef who writes 100 recipe cards for an apprentice. Some cards hold a wrong quantity, so a taster checks each card before it enters the book. The master is the teacher, the apprentice is the student, and the taster is the verifier. The book keeps 20 family recipes, so the apprentice also learns the old style. The taster writes the reason on each rejected card, so the master can fix the next batch.",
          breaks:
            "A taster checks one dish, not every future dish. A verifier checks rows, not every answer the student will write.",
        },
        {
          kind: "paragraph",
          id: "synthetic-data-p-5",
          text: "Prediction: the master writes 2,400 cards and the taster rejects 700. How many cards enter the book, why keep the family recipes, and which card does the taster return?",
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
          id: "synthetic-data-p-6",
          text: "The pipeline turns a gap into verified rows. Each step records a count, so the quality claim is testable.",
        },
        {
          kind: "list",
          id: "synthetic-data-list-1",
          ordered: true,
          items: [
            "Name the slice and the count that human data cannot fill.",
            "Write a teacher prompt with the style guide, source docs and an output contract.",
            "Generate more candidates than you need, and keep the seed with each row.",
            "Verify with rules: citation id, label match, schema, personal data and length.",
            "Sample accepted and rejected rows for a human audit.",
            "Remove eval overlaps and near duplicates.",
            "Mix synthetic rows with human seed rows before the student run.",
            "Train the student and score it on the human held-out set.",
            "Check diversity and rare slices before another round.",
          ],
        },
        {
          kind: "paragraph",
          id: "synthetic-data-p-7",
          text: "The teacher writes targets that the student copies. Its errors become the student's errors. The verifier is the gate, because a wrong row teaches the student to be wrong. A rule that checks a citation or label is cheaper than a judge.",
        },
        {
          kind: "paragraph",
          id: "synthetic-data-p-8",
          text: "Verification has two layers. Rule checks catch a missing citation, a wrong label, a malformed schema, personal data or a length breach. A human audit covers what a program cannot check. Report the pass rate per rule, so one weak rule cannot hide.",
        },
        {
          kind: "paragraph",
          id: "synthetic-data-p-9",
          text: "Model collapse is the loss of rare cases across rounds of self-training. Each round narrows the distribution and the tails shrink. Keep a human seed set in every round, verify every row and cap the rounds. Measure distinct templates and rare-slice accuracy, not the total score.",
        },
        {
          kind: "paragraph",
          id: "synthetic-data-p-10",
          text: "The license is a gate, not a footnote. Read the teacher terms for training use, output use and a ban on competing models. Keep the teacher name, prompt and date with each row. A license problem can erase the set.",
        },
        {
          kind: "paragraph",
          id: "synthetic-data-p-11",
          text: "Cost is teacher tokens per accepted row. A low accept rate makes each useful row expensive, so tighten the prompt. Generate only the gap, and reuse human rows where they cover a slice.",
        },
        {
          kind: "table",
          id: "synthetic-data-table-1",
          columns: ["Stage", "Input", "Output"],
          rows: [
            ["Teacher", "Slice brief, style guide, seeds", "Candidate rows"],
            ["Verifier", "Candidates, rule list", "Accept or reject with a reason"],
            ["Student", "Verified rows, human mix", "Smaller model"],
            ["Eval", "Human held-out set", "Pass rate per slice"],
          ],
          caption: "Inputs and outputs at each gate.",
        },
        {
          kind: "diagram",
          id: "synthetic-data-diagram-1",
          variant: "flow",
          spec: {
            nodes: [
              { id: "teacher", label: "Teacher" },
              { id: "candidates", label: "Candidates" },
              { id: "verify", label: "Verifier" },
              { id: "accept", label: "Accepted" },
              { id: "reject", label: "Rejected" },
              { id: "student", label: "Student" },
            ],
            edges: [
              ["teacher", "candidates"],
              ["candidates", "verify"],
              ["verify", "accept"],
              ["verify", "reject"],
              ["accept", "student"],
            ],
          },
          caption:
            "The verifier gates every teacher row; only accepted rows reach the student.",
          alt: "Flow from teacher to candidates and a verifier, which sends accepted rows to the student and rejected rows aside.",
        },
      ],
    },
    {
      id: "eli5-a-copy-of-a-copy",
      title: "A copy of a copy",
      register: "eli5",
      blocks: [
        {
          kind: "analogy",
          id: "synthetic-data-analogy-2",
          text: "Think of a photocopy of a photocopy. Each copy loses faint lines, and after five copies the page is gray. Model collapse works the same way: each round trains on the last round's output and loses the rare cases. The first copy still holds the original, so keep a human copy in every round. A sharp original is the seed set. A gray copy still reads, but the fine print is gone.",
          breaks:
            "A photocopy loses detail from the same page, while model collapse loses cases the model rarely produced.",
        },
        {
          kind: "paragraph",
          id: "synthetic-data-p-12",
          text: "Prediction: round 1 holds 40 rare slices and round 2 holds 31. What do you add before round 3, which number do you check, and what is the human seed?",
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
          id: "synthetic-data-table-2",
          columns: ["Symptom", "Cause", "Check", "Fix"],
          rows: [
            [
              "The student gets worse each round",
              "Model collapse",
              "Measure rare slices and distinct templates",
              "Mix human seed data and verify every row",
            ],
            [
              "Wrong facts enter the train set",
              "Weak verifier",
              "Sample the rejected and accepted rows",
              "Add citation and label rules",
            ],
            [
              "Launch is blocked by legal review",
              "License forbids training use",
              "Read the teacher terms before generation",
              "Replace the teacher or the data",
            ],
            [
              "Teacher cost stays high",
              "Low accept rate on a broad prompt",
              "Compute cost per accepted row",
              "Tighten the prompt and generate only gaps",
            ],
          ],
          caption: "Four failures, from the student back to the license.",
        },
        {
          kind: "paragraph",
          id: "synthetic-data-p-13",
          text: "Synthetic data scales coverage cheaply and moves cost to verification and license review. Unverified volume lowers quality, so the verifier rate sets the budget.",
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
          id: "synthetic-data-p-14",
          text: "The team needs 2,000 tone examples for the reply adapter. Human review can supply 600. A teacher generates 2,400 candidates from seed tickets and the style guide. The verifier rejects 700: 180 have no citation, 320 have a wrong label, 90 hold personal data and 110 break the schema.",
        },
        {
          kind: "paragraph",
          id: "synthetic-data-p-15",
          text: "The trace shows two risks. The eval overlap check removes 60 accepted rows, leaving 1,640 for training. Round 2 trains on student output, and the rare refund slice falls from 0.71 to 0.58. Distinct templates fall from 900 to 540, the signature of model collapse.",
        },
        {
          kind: "paragraph",
          id: "synthetic-data-p-16",
          text: "The decision is a mixed set and a round cap. Every round keeps the 600 human rows and adds verified synthetic rows at no more than 1:1. The team stops at two rounds and checks rare-slice accuracy and template count.",
        },
        {
          kind: "paragraph",
          id: "synthetic-data-p-17",
          text: "Legal review reads the teacher terms. Internal training is allowed, and a competing model is not. The student is internal to the support product. The team records the teacher name, prompt and date for every row. The eval set stays human-labeled.",
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
          id: "synthetic-data-p-18",
          text: "Answer five questions on distillation, verification, collapse, the count and the license.",
        },
        { kind: "check", id: "synthetic-data-check-1", checkId: "check-1" },
        { kind: "check", id: "synthetic-data-check-2", checkId: "check-2" },
        { kind: "check", id: "synthetic-data-check-3", checkId: "check-3" },
        { kind: "check", id: "synthetic-data-check-4", checkId: "check-4" },
        { kind: "check", id: "synthetic-data-check-5", checkId: "check-5" },
      ],
    },
    {
      id: "evaluation-task",
      title: "Evaluation task",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "synthetic-data-p-19",
          text: "Use the twelve fixed candidates. Each candidate states its citation, label and personal-data flag. Run the verifier, count the rejects by reason, then remove the 2 eval duplicates and report the final train count.",
        },
        { kind: "task", id: "task-synthetic-data" },
        {
          kind: "paragraph",
          id: "synthetic-data-p-20",
          text: "The reference solution accepts 7 of 12. It rejects 2 for a missing citation, 2 for a label mismatch and 1 for personal data. The overlap removal takes 2 more, so 5 rows remain. A 1:1 human mix adds 5 human rows for a set of 10.",
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
          id: "synthetic-data-p-21",
          text: "Write one sentence with the form: I changed X; the result was Y. Name the gate and one count. Example: I added a citation rule; accepts fell from 1,900 to 1,640.",
        },
        {
          kind: "paragraph",
          id: "synthetic-data-p-22",
          text: "Self-rubric: mechanism names the gate and the rule; evidence gives a fixed count or rate; limit names one slice, license or collapse risk.",
        },
        {
          kind: "note",
          id: "synthetic-data-note-1",
          text: "A synthetic set is only as good as its verifier. Count the rejects before you count the rows.",
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
          id: "synthetic-data-interview-1",
          items: [
            {
              question: "What is distillation?",
              answer:
                "Distillation trains a smaller student model on outputs from a larger teacher model. The student learns the teacher's patterns at a lower serving cost. A verifier must filter the targets, because the student copies the teacher's errors as well as its skill. Score the student on a human held-out set.",
            },
            {
              question: "When do you choose synthetic data over human annotation?",
              answer:
                "Choose synthetic data when a slice is thin and the teacher can cover it, and when a verifier can check the output. Keep human rows in every round, because they hold the rare cases. Human annotation stays the source for the eval set and the final quality bar. A 1:1 human mix is a common start.",
            },
            {
              question: "How does synthesis fail, and what do you check?",
              answer:
                "It fails through model collapse, weak verification or a license block. Measure rare-slice accuracy and distinct templates each round, sample the verifier's rejects and read the teacher terms before generation. A falling rare-slice score is the first sign of collapse. Report both numbers each round.",
            },
            {
              question: "How does synthesis change at 10x data?",
              answer:
                "At 10x data, teacher cost and verifier load grow with every candidate, so generate only the gap. A low accept rate multiplies the cost of each useful row, so tighten the prompt first. Track cost per accepted row, rare-slice accuracy and license scope together. Keep a 1:1 human mix in every round.",
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
      prompt: "Which sentence defines distillation?",
      options: [
        { id: "option-a", label: "Training a smaller student on a larger teacher's outputs." },
        { id: "option-b", label: "Generating candidates with no verifier." },
        { id: "option-c", label: "Copying teacher answers into the eval set." },
        { id: "option-d", label: "Removing near-duplicate rows." },
      ],
      correctOptionId: "option-a",
      explanation:
        "Distillation uses teacher outputs as targets for a smaller student. Copying answers into the eval set measures the teacher and contaminates the test.",
    },
    {
      id: "check-2",
      kind: "apply",
      prompt: "A synthetic set has no verifier and a low eval score. What do you add first?",
      options: [
        { id: "option-a", label: "More teacher candidates" },
        { id: "option-b", label: "Rule checks for citation, label and personal data" },
        { id: "option-c", label: "A larger student model" },
        { id: "option-d", label: "A higher learning rate" },
      ],
      correctOptionId: "option-b",
      explanation:
        "The verifier is the gate that keeps wrong rows out of training, so add it before you add volume. More candidates without a gate increase the noise that the student learns.",
    },
    {
      id: "check-3",
      kind: "diagnose",
      prompt: "Rare-slice accuracy and distinct templates fall in each self-training round. What is the likely cause?",
      options: [
        { id: "option-a", label: "Model collapse" },
        { id: "option-b", label: "Contamination" },
        { id: "option-c", label: "A slow GPU" },
        { id: "option-d", label: "Position bias" },
      ],
      correctOptionId: "option-a",
      explanation:
        "Each round narrows the distribution toward common answers, so rare cases and variety shrink. Keep human seed rows, verify every row and cap the rounds.",
    },
    {
      id: "check-4",
      kind: "calculate",
      prompt: "A teacher writes 2,400 rows. The verifier accepts 1,700, and 60 accepted rows overlap the eval set. How many rows remain?",
      options: [
        { id: "option-a", label: "1,580" },
        { id: "option-b", label: "1,640" },
        { id: "option-c", label: "1,700" },
        { id: "option-d", label: "2,340" },
      ],
      correctOptionId: "option-b",
      explanation:
        "1,700 accepted rows minus 60 overlaps leaves 1,640. A value of 1,580 would remove 120 rows, and 1,700 ignores the overlap.",
    },
    {
      id: "check-5",
      kind: "apply",
      prompt: "The teacher terms forbid training a competing model. The student is an internal support model. What is the correct step?",
      options: [
        { id: "option-a", label: "Train the student and ignore the terms" },
        { id: "option-b", label: "Record the terms and confirm the internal use in review" },
        { id: "option-c", label: "Put synthetic rows into the eval set" },
        { id: "option-d", label: "Raise the rank" },
      ],
      correctOptionId: "option-b",
      explanation:
        "The license is a gate, so record the terms and confirm that the use is internal training. Ignoring the terms risks the whole set, and synthetic eval rows contaminate the test.",
    },
  ],
  task: {
    id: "task-synthetic-data",
    scope: "Verify twelve fixed teacher candidates and report the final count.",
    items: [
      {
        id: "item-1",
        label: "Write the teacher output contract for one slice.",
      },
      {
        id: "item-2",
        label: "Run the verifier and count accepts and rejects by reason.",
      },
      {
        id: "item-3",
        label: "Remove the 2 eval duplicates and report the final count.",
      },
      {
        id: "item-4",
        label: "State the human mix and one license check for the student run.",
      },
      {
        id: "item-5",
        label: "Name one collapse check for a second training round.",
      },
    ],
    solution: {
      filename: "data/verify_synthetic.py",
      language: "python",
      code: [
        "CANDIDATES = [",
        '    {"id": "c1", "cite": True, "label": True, "pii": False},',
        '    {"id": "c2", "cite": False, "label": True, "pii": False},',
        '    {"id": "c3", "cite": True, "label": True, "pii": False},',
        '    {"id": "c4", "cite": True, "label": False, "pii": False},',
        '    {"id": "c5", "cite": True, "label": True, "pii": False},',
        '    {"id": "c6", "cite": True, "label": True, "pii": True},',
        '    {"id": "c7", "cite": True, "label": True, "pii": False},',
        '    {"id": "c8", "cite": False, "label": True, "pii": False},',
        '    {"id": "c9", "cite": True, "label": True, "pii": False},',
        '    {"id": "c10", "cite": True, "label": False, "pii": False},',
        '    {"id": "c11", "cite": True, "label": True, "pii": False},',
        '    {"id": "c12", "cite": True, "label": True, "pii": False},',
        "]",
        "",
        "EVAL_OVERLAP = 2",
        "",
        "",
        "def verify(row):",
        '    if not row["cite"]:',
        '        return "no-citation"',
        '    if not row["label"]:',
        '        return "label-mismatch"',
        '    if row["pii"]:',
        '        return "pii"',
        '    return "accept"',
        "",
        "",
        "counts = {}",
        "for row in CANDIDATES:",
        "    reason = verify(row)",
        '    counts[reason] = counts.get(reason, 0) + 1',
        "",
        'print(f"candidates {len(CANDIDATES)}")',
        'print(f"accept {counts.get(\'accept\', 0)}")',
        "for reason in [\"no-citation\", \"label-mismatch\", \"pii\"]:",
        '    print(f"reject {reason} {counts.get(reason, 0)}")',
        "",
        "final = counts.get(\"accept\", 0) - EVAL_OVERLAP",
        'print(f"eval overlap {EVAL_OVERLAP} -> final {final}")',
        'print(f"human mix {final}, synthetic {final}")',
        'print("license: internal training allowed; competing model not allowed")',
      ].join("\n"),
    },
  },
  prove: {
    prompt: "Which synthesis gate did you change, and how did the count move?",
    placeholder: "I changed X; the result was Y.",
    maxLength: 280,
    debounceMs: 800,
    savedMessage: "Proof saved on this device.",
  },
  citation:
    "Further reading: AI Engineering by Chip Huyen (O'Reilly). This course is independent and reproduces no book text or figures.",
} as const satisfies Lesson);
