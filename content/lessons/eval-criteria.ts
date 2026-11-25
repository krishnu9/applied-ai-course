import type { Lesson } from "@/lib/types";
import { deepFreeze } from "../freeze";

export const evalCriteriaLesson = deepFreeze({
  slug: "eval-criteria",
  order: 9,
  title: "Criteria and rubrics",
  chapterId: "ch-04",
  chapterOrder: 4,
  status: "live",
  outcome:
    "You can define an evaluation criterion, build a rubric, and catch a failure that an average hides. Prerequisite: lesson 6, evaluation.",
  artifact:
    "A runnable criteria.py over twelve fixed cases, with an overall rate, a safety slice and pass@3.",
  readingMinutes: 24,
  difficulty: "core",
  terms: [
    {
      term: "Evaluation criterion",
      definition:
        "One quality dimension that a system must meet, such as format or safety.",
    },
    {
      term: "Rubric",
      definition:
        "A written list of criteria and levels that defines a good answer.",
    },
    {
      term: "Slice",
      definition:
        "A subset of the eval set that shares a trait, such as language or ticket type.",
    },
    {
      term: "Pass@k",
      definition:
        "The chance that at least one of k generated samples is correct.",
    },
    {
      term: "Evaluation pipeline",
      definition:
        "The combined checks on components, end-to-end output and cost.",
    },
    {
      term: "Confidence interval",
      definition:
        "The range that likely contains the true score, given sample noise.",
    },
  ],
  evalCase: {
    id: "case-eval-criteria",
    brief: "Catch a passing score that hides a safety failure.",
  },
  sections: [
    {
      id: "what-it-is",
      title: "What it is",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "p-eval-criteria-1",
          text: "An evaluation criterion is one quality dimension that a system must meet, such as format or safety. A rubric is a written list of criteria and levels. A criterion turns a vague goal into a check with a pass rule.",
        },
        {
          kind: "paragraph",
          id: "p-eval-criteria-2",
          text: "A worked example: a triage system has five criteria: knowledge, reasoning, instruction following, format and safety. A case passes when at least four of the five criteria pass. Twelve fixed cases give an overall rate and one rate per criterion.",
        },
        {
          kind: "paragraph",
          id: "p-eval-criteria-3",
          text: "A non-example is one overall quality score with no criteria. It hides a failed safety case behind nine good cases.",
        },
        {
          kind: "paragraph",
          id: "p-eval-criteria-4",
          text: "A hard attribute is a requirement that the system must meet, such as a safety rule or a latency limit. A soft attribute is a preference that trades against other attributes, such as tone or cost. Safety and format are usually hard, and tone is usually soft.",
        },
        {
          kind: "paragraph",
          id: "p-eval-criteria-5",
          text: "A slice is a subset of the eval set that shares a trait, such as ticket type, language or length. An average across all cases can pass while one slice fails. Report the slice rate, not only the average.",
        },
      ],
    },
    {
      id: "eli5-a-report-card",
      title: "A report card",
      register: "eli5",
      blocks: [
        {
          kind: "analogy",
          id: "analogy-eval-criteria-report",
          text: "Think of a school report card. Each subject has its own line: math, reading, science, art and conduct. The average hides a failed math line behind three good lines. A parent who reads only the average misses the subject that needs repair. The lines are the criteria, and the average is the overall score.",
          breaks:
            "A report card fixes the subjects and the pass mark, while a product criterion changes with the task and the season.",
        },
        {
          kind: "paragraph",
          id: "p-eval-criteria-6",
          text: "A student earns 90, 88, 92 and 40. Is the average good news? Which line decides, and which line would you gate? Name the line and the rule.",
        },
        {
          kind: "paragraph",
          id: "p-eval-criteria-6b",
          text: "The average is not a pass mark. The failed line is the hard gate, and the other lines are the soft summary. A strong average can still fail a hard line.",
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
          id: "p-eval-criteria-7",
          text: "The rubric moves through seven steps. Each step makes one failure visible.",
        },
        {
          kind: "list",
          id: "list-eval-criteria-steps",
          ordered: true,
          items: [
            "List the criteria that the task must meet.",
            "Mark each criterion hard or soft.",
            "Write a pass rule for each criterion.",
            "Tag each case with one or more slices.",
            "Run every case and record each criterion.",
            "Report the overall rate, the per-criterion rate and each slice rate.",
            "Report cost and p95 latency as criteria on the same table.",
          ],
        },
        {
          kind: "paragraph",
          id: "p-eval-criteria-8",
          text: "Six buckets cover most tasks. Knowledge checks a fact against a source. Reasoning checks the steps and the final answer. Instruction following checks the stated request and the constraints. Format checks the schema and the field types. Safety checks a policy rule. Cost and latency check the service limit.",
        },
        {
          kind: "paragraph",
          id: "p-eval-criteria-9",
          text: "Each criterion needs a concrete rubric. Write three or four levels, and give each level one example answer. Add a correctness gate, so a wrong fact caps the case at fail. Add a length rule, so a long answer cannot win on size. Two people who read the rubric should give the same level.",
        },
        {
          kind: "paragraph",
          id: "p-eval-criteria-10",
          text: "A thin slice carries a wide interval. The confidence interval for a slice rate shrinks as the slice grows. A slice with six cases and two passes has a rate of 0.33, and the interval runs from about 0.10 to 0.70. A claim about that slice needs more cases.",
        },
        {
          kind: "paragraph",
          id: "p-eval-criteria-11",
          text: "Pass@k is the chance that at least one of k samples is correct. For a per-sample rate p, pass@k is 1 minus (1 minus p) to the power k. At p equal to 0.83 and k equal to 3, pass@3 is 0.995. A high pass@k still says nothing about a safe sample, because it asks for one success.",
        },
        {
          kind: "table",
          id: "table-eval-criteria-buckets",
          columns: ["Criterion", "Evidence", "Pass rule"],
          rows: [
            ["Knowledge", "Source passage", "Fact matches the source"],
            ["Reasoning", "Step list", "Steps support the answer"],
            ["Instruction", "Request text", "Every constraint holds"],
            ["Format", "Schema", "All fields have the right type"],
            ["Safety", "Policy rule", "No unsafe content"],
            ["Cost and latency", "Run metrics", "p95 inside the budget"],
          ],
          caption: "Inputs and outputs of six evaluation criteria.",
        },
        {
          kind: "diagram",
          id: "diagram-eval-criteria",
          variant: "matrix",
          spec: {
            nodes: [
              { id: "knowledge", label: "Knowledge" },
              { id: "reasoning", label: "Reasoning" },
              { id: "instruction", label: "Instruction" },
              { id: "format", label: "Format" },
              { id: "safety", label: "Safety" },
            ],
            edges: [
              ["knowledge", "reasoning"],
              ["reasoning", "instruction"],
              ["instruction", "format"],
              ["format", "safety"],
            ],
            matrix: {
              rows: ["Knowledge", "Reasoning", "Instruction", "Format", "Safety"],
              columns: ["Rule", "Judge", "Human"],
              filled: [
                [0, 0],
                [0, 2],
                [1, 1],
                [1, 2],
                [2, 1],
                [3, 0],
                [3, 2],
                [4, 0],
                [4, 2],
              ],
            },
          },
          caption:
            "Each criterion pairs with the strongest evidence source; safety always keeps a human check.",
          alt: "Matrix of five criteria against rule, judge and human evidence, with safety checked by a human.",
        },
      ],
    },
    {
      id: "eli5-a-restaurant-inspection",
      title: "A restaurant inspection",
      register: "eli5",
      blocks: [
        {
          kind: "analogy",
          id: "analogy-eval-criteria-inspection",
          text: "Think of a restaurant inspection. The inspector scores food temperature, cleanliness, labels and staff hygiene. One critical violation closes the kitchen, even when the total score is high. The total score is not the safety result. The critical line is the hard attribute, and the total is the soft summary.",
          breaks:
            "An inspection has legal thresholds and one closure rule, while a product criterion trades quality against cost and time.",
        },
        {
          kind: "paragraph",
          id: "p-eval-criteria-12",
          text: "A restaurant scores 92 out of 100 and fails the temperature check. May it open tonight? Which line decides, and who must sign the report? Name the rule that closes the kitchen. Also write the name of the duty inspector.",
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
          id: "table-eval-criteria-fails",
          columns: ["Symptom", "Cause", "Check", "Fix"],
          rows: [
            [
              "Overall 83 percent, yet users see a wrong refund",
              "The average hides the safety slice",
              "Print every slice rate",
              "Gate the hard criterion",
            ],
            [
              "pass@k looks high while most samples fail",
              "pass@k asks for one success",
              "Read k and the per-sample rate",
              "Use a per-sample rule for safety",
            ],
            [
              "A criterion score moves with no change",
              "The rubric level is vague",
              "Two people score 20 cases",
              "Write concrete levels",
            ],
            [
              "Latency is missing from the report",
              "Cost is not a criterion",
              "Add p95 to the same table",
              "Make latency a hard attribute",
            ],
          ],
          caption: "Four failures between a rubric and a safe launch.",
        },
        {
          kind: "paragraph",
          id: "p-eval-criteria-13",
          text: "A hard gate protects a critical case and blocks a launch on one failure; a soft weight ships sooner and hides the same case.",
        },
      ],
    },
    {
      id: "the-triage-case",
      title: "The triage case",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "p-eval-criteria-14",
          text: "Support triage reports an overall pass rate of 83 percent, and the team plans to ship. The safety slice holds six cases, and four of them fail the safety criterion. Three of those four still pass the overall rule, because four of five criteria pass.",
        },
        {
          kind: "paragraph",
          id: "p-eval-criteria-15",
          text: "The trace shows the aggregate. The overall rule counts a case with a failed safety line as a pass. The safety slice reads 2 of 6, or 33 percent. pass@3 at 0.83 is 0.995, and it still says nothing about a safe sample.",
        },
        {
          kind: "paragraph",
          id: "p-eval-criteria-16",
          text: "The decision is to add a safety gate. A failed safety criterion caps the case at fail, whatever the other four criteria say. The overall rate falls to 58 percent, and the safety slice keeps its 33 percent. The team blocks the launch, repairs the unsafe replies, and reports the slice on every run.",
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
          id: "p-eval-criteria-17",
          text: "Answer five questions on the criterion, the slice, the gate and pass@k.",
        },
        { kind: "check", id: "check-eval-criteria-1", checkId: "check-1" },
        { kind: "check", id: "check-eval-criteria-2", checkId: "check-2" },
        { kind: "check", id: "check-eval-criteria-3", checkId: "check-3" },
        { kind: "check", id: "check-eval-criteria-4", checkId: "check-4" },
        { kind: "check", id: "check-eval-criteria-5", checkId: "check-5" },
      ],
    },
    {
      id: "evaluation-task",
      title: "Evaluation task",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "p-eval-criteria-18",
          text: "Use the twelve fixed cases, the six-case safety slice and the six-case format slice. Build one script that prints the overall rate, each criterion rate and the gated rate. Tick each step when its output is visible.",
        },
        { kind: "task", id: "task-eval-criteria" },
        {
          kind: "paragraph",
          id: "p-eval-criteria-19",
          text: "The run prints an overall rate of 0.83 (10/12) and a safety slice of 0.33 (2/6). Three of the four safety failures pass the overall rule. Pass@3 at 0.83 is 0.995. The safety gate lowers the overall rate to 0.58 (7/12), and the format slice prints 0.83 (5/6).",
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
          id: "p-eval-criteria-20",
          text: "Write one sentence with the form: I changed X; the result was Y. Name the criterion, the slice and the two rates.",
        },
        {
          kind: "paragraph",
          id: "p-eval-criteria-21",
          text: "Self-rubric: mechanism names the layer and the rule; evidence gives a fixed number or order; limit names one blind spot or failed case.",
        },
        {
          kind: "note",
          id: "note-eval-criteria-1",
          text: "An average is a summary, not a safety result.",
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
          id: "interview-eval-criteria",
          items: [
            {
              question: "What is an evaluation criterion?",
              answer:
                "An evaluation criterion is one quality dimension that a system must meet, such as format or safety. A rubric gives that criterion written levels and examples. A criterion needs a pass rule and a check, or it measures a mood. Six buckets cover most tasks: knowledge, reasoning, instruction, format, safety, and cost.",
            },
            {
              question: "When do you use a hard gate over a weighted score?",
              answer:
                "Use a hard gate when one failure is not acceptable, such as unsafe content or a broken schema. The gate caps the case at fail, whatever the other criteria say. Use a weighted score for soft attributes such as tone or cost. Report both, so a high average cannot hide a gated failure.",
            },
            {
              question: "How does a rubric fail, and what do you check?",
              answer:
                "A rubric fails when its levels are vague, when it ignores a slice, or when the average hides a thin group. Two people score 20 cases, and a low agreement rate shows the unclear level. Print the per-criterion and per-slice rates. Add a safety gate before you report an overall rate.",
            },
            {
              question: "How do slices and pass@k change at 10x traffic or samples?",
              answer:
                "At 10x traffic, every slice grows, and a thin slice becomes wide enough to support a claim. At 10x samples, pass@k rises: at p equal to 0.83, pass@3 is 0.995 and pass@10 is higher. Report the per-sample rate with pass@k, because one safe sample does not make a safe system.",
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
      prompt: "Which sentence defines a slice?",
      options: [
        { id: "option-a", label: "A subset of the eval set that shares a trait" },
        { id: "option-b", label: "One rubric level for a single case" },
        { id: "option-c", label: "A model version used in a run" },
        { id: "option-d", label: "The average of every criterion" },
      ],
      correctOptionId: "option-a",
      explanation:
        "A slice groups cases by a shared trait, such as ticket type or language, so the report can show a group rate. A rubric level describes one criterion, not a group of cases.",
    },
    {
      id: "check-2",
      kind: "apply",
      prompt:
        "A system passes 90 percent overall, and one safety case fails. Which rule fits?",
      options: [
        { id: "option-a", label: "Raise the overall threshold to 95 percent" },
        { id: "option-b", label: "Add a hard safety gate" },
        { id: "option-c", label: "Remove the safety case" },
        { id: "option-d", label: "Report pass@10" },
      ],
      correctOptionId: "option-b",
      explanation:
        "A hard gate turns one safety failure into a failed case, whatever the average says. Raising the average still hides the case, and removing it hides the risk.",
    },
    {
      id: "check-3",
      kind: "diagnose",
      prompt:
        "A team adds the safety criterion as a soft weight. The overall score stays high. What is the likely problem?",
      options: [
        { id: "option-a", label: "The safety slice is too large" },
        { id: "option-b", label: "A soft weight lets a safety failure pass" },
        { id: "option-c", label: "The model version is stale" },
        { id: "option-d", label: "The rubric has too many levels" },
      ],
      correctOptionId: "option-b",
      explanation:
        "A soft weight trades safety against other criteria, so a high average can absorb a failure. A hard gate is the fix when one failure blocks a launch.",
    },
    {
      id: "check-4",
      kind: "calculate",
      prompt: "A per-sample rate is 0.5. What is pass@2?",
      options: [
        { id: "option-a", label: "0.25" },
        { id: "option-b", label: "0.50" },
        { id: "option-c", label: "0.75" },
        { id: "option-d", label: "1.00" },
      ],
      correctOptionId: "option-c",
      explanation:
        "Pass@2 is 1 minus 0.5 squared, or 0.75. A value of 0.50 copies the per-sample rate and ignores the second sample.",
    },
    {
      id: "check-5",
      kind: "calculate",
      prompt:
        "A safety slice holds 2 passes in 6 cases. What is the slice rate?",
      options: [
        { id: "option-a", label: "0.20" },
        { id: "option-b", label: "0.33" },
        { id: "option-c", label: "0.50" },
        { id: "option-d", label: "0.67" },
      ],
      correctOptionId: "option-b",
      explanation:
        "The slice rate is 2 divided by 6, or 0.33. A value of 0.67 would invert the passes and the failures.",
    },
  ],
  task: {
    id: "task-eval-criteria",
    scope:
      "Score twelve fixed cases against five criteria, then expose the hidden safety failure.",
    items: [
      {
        id: "item-1",
        label: "Name five criteria and mark each hard or soft.",
      },
      {
        id: "item-2",
        label: "Score the twelve fixed cases with the four-of-five pass rule.",
      },
      {
        id: "item-3",
        label: "Report the safety slice and the safety failures that pass overall.",
      },
      {
        id: "item-4",
        label: "Compute pass@3 and apply the safety gate.",
      },
      {
        id: "item-5",
        label: "Run the same rule on the six-case format slice and report its rate.",
      },
    ],
    solution: {
      filename: "eval/criteria.py",
      language: "python",
      code: [
        'CRITERIA = ["knowledge", "reasoning", "instruction", "format", "safety"]',
        "",
        "CASES = [",
        '    ("c01", {"knowledge": 1, "reasoning": 1, "instruction": 1, "format": 1, "safety": 1}),',
        '    ("c02", {"knowledge": 1, "reasoning": 1, "instruction": 1, "format": 1, "safety": 1}),',
        '    ("c03", {"knowledge": 1, "reasoning": 1, "instruction": 1, "format": 1, "safety": 1}),',
        '    ("c04", {"knowledge": 1, "reasoning": 1, "instruction": 1, "format": 1, "safety": 1}),',
        '    ("c05", {"knowledge": 1, "reasoning": 1, "instruction": 1, "format": 1, "safety": 1}),',
        '    ("c06", {"knowledge": 1, "reasoning": 1, "instruction": 1, "format": 1, "safety": 1}),',
        '    ("c07", {"knowledge": 1, "reasoning": 1, "instruction": 1, "format": 1, "safety": 0}),',
        '    ("c08", {"knowledge": 1, "reasoning": 1, "instruction": 1, "format": 1, "safety": 0}),',
        '    ("c09", {"knowledge": 1, "reasoning": 1, "instruction": 1, "format": 1, "safety": 0}),',
        '    ("c10", {"knowledge": 1, "reasoning": 0, "instruction": 1, "format": 1, "safety": 0}),',
        '    ("c11", {"knowledge": 1, "reasoning": 0, "instruction": 1, "format": 1, "safety": 1}),',
        '    ("c12", {"knowledge": 1, "reasoning": 0, "instruction": 1, "format": 0, "safety": 1}),',
        "]",
        "",
        'SAFETY_SLICE = ["c07", "c08", "c09", "c10", "c11", "c12"]',
        'FORMAT_SLICE = ["c02", "c04", "c06", "c08", "c10", "c12"]',
        "",
        "",
        "def passes(case):",
        "    return sum(case[1].values()) >= 4",
        "",
        "",
        "def overall(cases):",
        "    total = sum(1 for case in cases if passes(case))",
        "    return total, len(cases)",
        "",
        "",
        "def criterion_rate(cases, name):",
        "    total = sum(case[1][name] for case in cases)",
        "    return total, len(cases)",
        "",
        "",
        "def slice_rate(cases, ids, name):",
        "    chosen = [case for case in cases if case[0] in ids]",
        "    total = sum(case[1][name] for case in chosen)",
        "    return total, len(chosen)",
        "",
        "",
        "def pass_at_k(p, k):",
        "    return 1 - (1 - p) ** k",
        "",
        "",
        "def gated_count(cases):",
        '    return sum(1 for case in cases if case[1]["safety"] == 1 and passes(case))',
        "",
        "",
        "overall_pass, n = overall(CASES)",
        'print(f"overall {overall_pass}/{n} {overall_pass / n:.2f}")',
        'safety_pass, safety_n = slice_rate(CASES, SAFETY_SLICE, "safety")',
        'print(f"safety slice {safety_pass}/{safety_n} {safety_pass / safety_n:.2f}")',
        "for name in CRITERIA:",
        "    got, total = criterion_rate(CASES, name)",
        '    print(f"  {name} {got}/{total} {got / total:.2f}")',
        'hidden = [case for case in CASES if case[1]["safety"] == 0 and passes(case)]',
        'print(f"safety failures that pass overall {len(hidden)}/4")',
        "p = overall_pass / n",
        'print(f"pass@3 {pass_at_k(p, 3):.3f}")',
        "gated_pass = gated_count(CASES)",
        'print(f"gated overall {gated_pass}/{n} {gated_pass / n:.2f}")',
        'format_pass, format_n = slice_rate(CASES, FORMAT_SLICE, "format")',
        'print(f"format slice {format_pass}/{format_n} {format_pass / format_n:.2f}")',
      ].join("\n"),
    },
  },
  prove: {
    prompt: "Which criterion did you gate, and how did the rates move?",
    placeholder: "I changed X; the result was Y.",
    maxLength: 280,
    debounceMs: 800,
    savedMessage: "Proof saved on this device.",
  },
  citation:
    "Further reading: AI Engineering by Chip Huyen (O'Reilly). This course is independent and reproduces no book text or figures.",
} as const satisfies Lesson);
