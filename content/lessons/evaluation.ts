import type { Lesson } from "@/lib/types";
import { deepFreeze } from "../freeze";

export const evaluationLesson = deepFreeze({
  slug: "evaluation",
  order: 6,
  title: "Evaluation you can trust",
  chapterId: "ch-03",
  chapterOrder: 3,
  status: "live",
  outcome:
    "You can define evaluation, choose a metric for a task, and report a score with its interval. Prerequisite: lesson 5, sampling and hallucination.",
  artifact:
    "A runnable metrics.py over twelve fixed cases, with a pass rate, an interval and a loss score.",
  readingMinutes: 24,
  difficulty: "core",
  layerId: "layer-01",
  terms: [
    {
      term: "Evaluation",
      definition: "The repeatable measurement of system quality on fixed cases.",
    },
    {
      term: "Verifiable task",
      definition: "A task whose answer a rule or a test can check.",
    },
    {
      term: "Exact match",
      definition: "A metric that counts only answers identical to the reference.",
    },
    {
      term: "F1",
      definition: "The harmonic mean of precision and recall.",
    },
    {
      term: "Cosine similarity",
      definition: "The cosine of the angle between two vectors; a score from -1 to 1.",
    },
    {
      term: "Perplexity",
      definition:
        "The exponent of mean negative log-likelihood; lower means the model predicts the text better.",
    },
  ],
  evalCase: {
    id: "case-evaluation",
    brief: "Pick a metric for triage labels and name its blind spot.",
  },
  sections: [
    {
      id: "what-it-is",
      title: "What it is",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "p-evaluation-1",
          text: "Evaluation is the repeatable measurement of system quality on fixed cases. A score has three parts: fixed cases with labels, a fixed run, and a stored number. The number means something only while all three parts stay fixed.",
        },
        {
          kind: "paragraph",
          id: "p-evaluation-2",
          text: "A worked example: the support feature routes 41 tickets into four labels. Seventeen match the human label, so the pass rate is 17 divided by 41, or 41 percent. A later run labels the same tickets, and the difference is the evidence.",
        },
        {
          kind: "paragraph",
          id: "p-evaluation-3",
          text: "A non-example is one good answer in a demo. It shows one path through the system. It does not show how the system holds across cases.",
        },
        {
          kind: "paragraph",
          id: "p-evaluation-4",
          text: "A verifiable task has an answer that a rule or a test can check. A label, a JSON key and a unit test are verifiable. A subjective task has no single reference, so its answer needs a rubric, a person or a judge. Choose the metric from the task, not the easiest tool.",
        },
      ],
    },
    {
      id: "eli5-ruler-and-thermometer",
      title: "A ruler and a thermometer",
      register: "eli5",
      blocks: [
        {
          kind: "analogy",
          id: "analogy-evaluation-tools",
          text: "Think of a workshop with two tools. A ruler measures a straight cut, and it gives the same number for every worker. A thermometer measures heat, and two workers must agree where the mark sits. A label or a unit test is a ruler, and tone or helpfulness is a thermometer. The tool fixes what the workshop can see, and it hides every other property.",
          breaks:
            "A ruler and a thermometer each measure one fixed property. A text answer has many properties at once and no single mark that settles them all.",
        },
        {
          kind: "paragraph",
          id: "p-evaluation-6",
          text: "A reply with three JSON keys fails one key. Which tool checks it, and which tool checks a polite tone? Say which tool you need for each part.",
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
          id: "p-evaluation-7",
          text: "The mechanism has seven steps.",
        },
        {
          kind: "list",
          id: "list-evaluation-steps",
          ordered: true,
          items: [
            "Write the task in one sentence and name the property to measure.",
            "Choose the metric: exact match, F1, similarity, perplexity or a rubric.",
            "Collect fixed cases and write one human label for each case.",
            "Pin the case file, the prompt, the model version and the sampling.",
            "Run the system and compare each output with its label.",
            "Divide the matches by the cases and report the confidence interval.",
            "Record cost and p95 latency on the same run.",
          ],
        },
        {
          kind: "paragraph",
          id: "p-evaluation-8",
          text: "Exact match counts only answers identical to the reference. Accuracy divides matches by all cases. It is cheap, strict and blind to partial credit.",
        },
        {
          kind: "paragraph",
          id: "p-evaluation-9",
          text: "F1 combines precision and recall. Precision divides true positives by all predicted positives. Recall divides true positives by all true positives. F1 is the harmonic mean, so a low precision or recall pulls the score down. Macro-F1 averages the per-label scores. Refund earns 2 true positives, 1 false positive and 1 false negative, so both parts are 2/3.",
        },
        {
          kind: "paragraph",
          id: "p-evaluation-10",
          text: "Cosine similarity compares two vectors and returns a score from -1 to 1. A cosine of 1 means the same direction, and 0 means no shared direction. Two answers can share meaning and few words, so similarity reads form before truth.",
        },
        {
          kind: "paragraph",
          id: "p-evaluation-11",
          text: "A small set carries noise. A five-point move on 41 cases can come from the sample, not the change. A confidence interval states the likely range of the true score. The Wilson interval for 17 of 41 runs from 28 to 57 percent.",
        },
        {
          kind: "paragraph",
          id: "p-evaluation-12",
          text: "Offline evaluation runs on frozen cases before release. It is fast, cheap and repeatable. Online evaluation reads live traffic and A/B results. It is real, slow and noisy. Use offline to choose and online to confirm.",
        },
        {
          kind: "paragraph",
          id: "p-evaluation-13",
          text: "A language model also has a loss score. Entropy measures the uncertainty in a distribution: H equals minus the sum of p times log2 p. Cross-entropy is the average negative log-likelihood of the true tokens. Perplexity is the exponent of cross-entropy; a mean loss of 0.75 nats gives 2.12. Bits per byte divides total bits by the byte count, so two tokenizers compare.",
        },
        {
          kind: "table",
          id: "table-evaluation-metrics",
          columns: ["Check", "Input", "Output"],
          rows: [
            ["Offline score", "Fixed cases and labels", "Pass rate and interval"],
            ["Label check", "Predicted and expected labels", "Precision, recall, F1"],
            ["Similarity", "Two answer vectors", "Cosine score"],
            ["Loss", "True tokens and probabilities", "Perplexity and bits per byte"],
          ],
          caption: "Inputs and outputs of four evaluation checks.",
        },
        {
          kind: "diagram",
          id: "diagram-evaluation",
          variant: "stack",
          spec: {
            nodes: [
              { id: "cases", label: "Fixed cases", detail: "One label per case" },
              {
                id: "metric",
                label: "Metric",
                detail: "Exact match, F1 or similarity",
              },
              {
                id: "run",
                label: "Pinned run",
                detail: "Model, prompt and sampling",
              },
              {
                id: "score",
                label: "Score and interval",
                detail: "41 cases, 95 percent",
              },
              {
                id: "ops",
                label: "Cost and p95",
                detail: "Same run, same table",
              },
            ],
            edges: [
              ["cases", "metric"],
              ["metric", "run"],
              ["run", "score"],
              ["score", "ops"],
            ],
          },
          caption:
            "Fixed cases feed a metric and a pinned run; the score, interval and cost travel together.",
          alt: "Stack from fixed cases through a metric and a pinned run to a score with an interval and a cost row.",
        },
      ],
    },
    {
      id: "eli5-a-weather-forecast",
      title: "A weather forecast",
      register: "eli5",
      blocks: [
        {
          kind: "analogy",
          id: "analogy-evaluation-forecast",
          text: "Think of a weather forecast. The forecast says a 70 percent chance of rain, and one dry day does not prove it wrong. A score from 41 cases is a forecast for the next case, not a fact about it. The interval is the range that the forecast allows, and it shrinks as the sample grows. One dry day and one wet day both fit the same forecast.",
          breaks:
            "A forecast states the chance of one event, while a score averages many cases with labels and can share a hidden bias.",
        },
        {
          kind: "paragraph",
          id: "p-evaluation-15",
          text: "A score moves from 41 to 43 percent on 41 cases. Is the gain real, and which range decides? Use the interval, not the two points, and name the lower and upper bound first.",
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
          id: "table-evaluation-fails",
          columns: ["Symptom", "Cause", "Check", "Fix"],
          rows: [
            [
              "The score rises and users complain",
              "The metric measures the wrong property",
              "Read ten failures and the rubric",
              "Change the metric",
            ],
            [
              "Two runs differ with no code change",
              "A free variable: sampling or model version",
              "Compare the two run records",
              "Pin the model, prompt and temperature",
            ],
            [
              "A five-point move looks large",
              "Sample noise on a small set",
              "Compute the interval",
              "Report the range or grow the set",
            ],
            [
              "Similarity is high on a wrong answer",
              "Similarity reads word form",
              "Read the answer pair",
              "Add a correctness gate",
            ],
          ],
          caption: "Four failures between a score and the truth.",
        },
        {
          kind: "paragraph",
          id: "p-evaluation-16",
          text: "A strict metric is easy to defend and blind to partial credit. A soft metric hides a wrong fact. Cost is soft until a budget is fixed; then it becomes hard.",
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
          id: "p-evaluation-17",
          text: "The support feature routes 41 fixed tickets into four labels. The baseline pass rate is 17 of 41, or 41 percent. The team reports a new politeness score of 0.90 and calls the feature better. The team also reports the interval next to the rate, so a reader sees the noise.",
        },
        {
          kind: "paragraph",
          id: "p-evaluation-18",
          text: "The trace shows the wrong layer. Ticket 12 asks about a refund, and the human label is refund. The feature predicts billing, and the reply is polite. Exact match counts the case as a failure, and the politeness score counts it as a success.",
        },
        {
          kind: "paragraph",
          id: "p-evaluation-19",
          text: "The decision is to repair the evaluation layer. Use exact match as the primary score. Add macro-F1 to show per-label behavior. Report the interval, so a small move does not look like a win. Keep politeness as a secondary soft metric, and never as the gate. The repair moves the capstone pass rate from 41 to 49 percent.",
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
          id: "p-evaluation-20",
          text: "Answer five questions on definition, metric, noise and loss.",
        },
        { kind: "check", id: "check-evaluation-1", checkId: "check-1" },
        { kind: "check", id: "check-evaluation-2", checkId: "check-2" },
        { kind: "check", id: "check-evaluation-3", checkId: "check-3" },
        { kind: "check", id: "check-evaluation-4", checkId: "check-4" },
        { kind: "check", id: "check-evaluation-5", checkId: "check-5" },
      ],
    },
    {
      id: "evaluation-task",
      title: "Evaluation task",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "p-evaluation-21",
          text: "Use the twelve fixed cases, the paraphrase pair and the fixed loss values. Build one script that prints each metric and its blind spot. Tick each step when its output is visible.",
        },
        { kind: "task", id: "task-evaluation" },
        {
          kind: "paragraph",
          id: "p-evaluation-22",
          text: "The run prints exact match 0.67, macro-F1 0.65, similarity 0.00, pass rate 0.41 with interval 0.28 to 0.57, perplexity 2.12 and bits per byte 0.43. The paraphrase pair is correct and scores zero, because the metric reads words, not meaning.",
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
          id: "p-evaluation-23",
          text: "Write one sentence with the form: I changed X; the result was Y. Name the metric, the case set and the interval.",
        },
        {
          kind: "paragraph",
          id: "p-evaluation-24",
          text: "Self-rubric: mechanism names the layer and the rule; evidence gives a fixed number or order; limit names one blind spot or failed case.",
        },
        {
          kind: "note",
          id: "note-evaluation-1",
          text: "A score without an interval is a point, not a range.",
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
          id: "interview-evaluation",
          items: [
            {
              question: "What is evaluation, and which three parts make a score?",
              answer:
                "Evaluation is the repeatable measurement of system quality on fixed cases. A score needs fixed cases with labels, a fixed run, and a stored number. All three parts must stay fixed, or the number is not evidence. A change to the model, the prompt or the case file starts a new comparison.",
            },
            {
              question: "When do you choose exact match over a judge?",
              answer:
                "Choose exact match when a rule or a test can check the answer, such as a label, a JSON key or a unit test. It is cheap, strict and easy to defend. Choose a rubric or a judge for tone, helpfulness or an open explanation. A judge adds cost and bias, so keep a human audit.",
            },
            {
              question: "How does a score fail, and what do you check?",
              answer:
                "A score fails when the metric measures the wrong property, when a free variable moves, or when a small set hides noise. Read ten failures against the labels first. Pin the model and sampling, then report the interval. The interval for 17 of 41 runs from 28 to 57 percent.",
            },
            {
              question: "How does evaluation change at 10x traffic or cases?",
              answer:
                "At 10x traffic, online signals grow and offline cases stay fixed, so the two views diverge. Sample live traffic by slice. At 10x cases, the interval narrows: about 100 cases give a range near 10 points. Cache the offline run and compare cost and p95 together.",
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
      prompt: "Which metric counts only answers that are identical to the reference?",
      options: [
        { id: "option-a", label: "Exact match" },
        { id: "option-b", label: "Cosine similarity" },
        { id: "option-c", label: "Perplexity" },
        { id: "option-d", label: "Pass@k" },
      ],
      correctOptionId: "option-a",
      explanation:
        "Exact match compares the answer with the reference and counts only an identical result. Cosine similarity and perplexity measure other properties, so neither checks identity.",
    },
    {
      id: "check-2",
      kind: "apply",
      prompt:
        "A task asks for a polite tone and has no single correct answer. Which measurement fits best?",
      options: [
        { id: "option-a", label: "Exact match against one reply" },
        { id: "option-b", label: "A rubric with human labels" },
        { id: "option-c", label: "Bits per byte" },
        { id: "option-d", label: "A larger context window" },
      ],
      correctOptionId: "option-b",
      explanation:
        "Tone is a subjective property, so a rubric with human labels gives a repeatable judgment. Exact match needs one reference, and bits per byte measures token loss rather than tone.",
    },
    {
      id: "check-3",
      kind: "diagnose",
      prompt:
        "A 41-case score moves from 41 to 43 percent with no code change. What is the likely cause?",
      options: [
        { id: "option-a", label: "A better model version" },
        { id: "option-b", label: "Sample noise inside the interval" },
        { id: "option-c", label: "A larger tokenizer" },
        { id: "option-d", label: "A wrong label on every case" },
      ],
      correctOptionId: "option-b",
      explanation:
        "A two-point move on 41 cases sits inside the confidence interval, so the sample can explain it. A real change needs a pinned run and a move outside the interval.",
    },
    {
      id: "check-4",
      kind: "calculate",
      prompt:
        "A label has 6 true positives, 2 false positives and 3 false negatives. What is F1?",
      options: [
        { id: "option-a", label: "0.60" },
        { id: "option-b", label: "0.67" },
        { id: "option-c", label: "0.71" },
        { id: "option-d", label: "0.75" },
      ],
      correctOptionId: "option-c",
      explanation:
        "Precision is 6/8 and recall is 6/9, so F1 is 2 times 0.75 times 0.667 divided by 1.417, or 0.71. A value of 0.75 would use precision alone and ignore the three missed cases.",
    },
    {
      id: "check-5",
      kind: "calculate",
      prompt: "The mean negative log-likelihood is 0.693 nats. What is perplexity?",
      options: [
        { id: "option-a", label: "0.69" },
        { id: "option-b", label: "1.00" },
        { id: "option-c", label: "2.00" },
        { id: "option-d", label: "6.93" },
      ],
      correctOptionId: "option-c",
      explanation:
        "Perplexity is e raised to the mean negative log-likelihood, and e^0.693 is about 2.00. A value of 0.69 repeats the loss instead of its exponent.",
    },
  ],
  task: {
    id: "task-evaluation",
    scope:
      "Compare three metrics on twelve fixed cases, then report the interval and the loss.",
    items: [
      {
        id: "item-1",
        label: "State the task and name its verifiable part.",
      },
      {
        id: "item-2",
        label: "Score the twelve fixed cases with exact match and macro-F1.",
      },
      {
        id: "item-3",
        label: "Compute the similarity of the fixed paraphrase pair and name the blind spot.",
      },
      {
        id: "item-4",
        label: "Report the 95 percent interval for 17 of 41.",
      },
      {
        id: "item-5",
        label: "Compute perplexity and bits per byte from the fixed loss.",
      },
    ],
    solution: {
      filename: "eval/metrics.py",
      language: "python",
      code: [
        "import math",
        "from collections import Counter",
        "",
        "CASES = [",
        '    ("where is my refund", "refund", "refund"),',
        '    ("refund for a damaged box", "refund", "refund"),',
        '    ("refund for a late parcel", "refund", "billing"),',
        '    ("the parcel is late", "shipping", "shipping"),',
        '    ("track my delivery", "shipping", "shipping"),',
        '    ("delivery missed the window", "shipping", "shipping"),',
        '    ("invoice shows two charges", "billing", "other"),',
        '    ("charge on my card", "billing", "billing"),',
        '    ("invoice for last month", "billing", "billing"),',
        '    ("change my address", "other", "shipping"),',
        '    ("cancel my account", "other", "refund"),',
        '    ("question about my plan", "other", "other"),',
        "]",
        "",
        'EXPECTED_TEXT = "refunds close thirty days after delivery"',
        'PREDICTED_TEXT = "you can get your money back within a month of receiving the item"',
        'LABELS = ["refund", "shipping", "billing", "other"]',
        "",
        "",
        "def exact_match(cases):",
        '    return sum(1 for _, expected, predicted in cases if expected == predicted) / len(cases)',
        "",
        "",
        "def f1_for(label, cases):",
        '    tp = sum(1 for _, e, p in cases if e == label and p == label)',
        '    fp = sum(1 for _, e, p in cases if e != label and p == label)',
        '    fn = sum(1 for _, e, p in cases if e == label and p != label)',
        "    precision = tp / (tp + fp) if tp + fp else 0.0",
        "    recall = tp / (tp + fn) if tp + fn else 0.0",
        "    return 2 * precision * recall / (precision + recall) if precision + recall else 0.0",
        "",
        "",
        "def macro_f1(cases):",
        "    return sum(f1_for(label, cases) for label in LABELS) / len(LABELS)",
        "",
        "",
        "def cosine(left, right):",
        "    a = Counter(left.lower().split())",
        "    b = Counter(right.lower().split())",
        "    dot = sum(a[word] * b[word] for word in a)",
        "    norm_a = math.sqrt(sum(value * value for value in a.values()))",
        "    norm_b = math.sqrt(sum(value * value for value in b.values()))",
        "    return dot / (norm_a * norm_b)",
        "",
        "",
        "def wilson(passes, total, z=1.96):",
        "    p = passes / total",
        "    denominator = 1 + z * z / total",
        "    centre = (p + z * z / (2 * total)) / denominator",
        "    half = z * math.sqrt(p * (1 - p) / total + z * z / (4 * total * total)) / denominator",
        "    return centre - half, centre + half",
        "",
        "",
        "TOTAL_NATS = 12.0",
        "TOKENS = 16",
        "BYTES = 40",
        "mean_nll = TOTAL_NATS / TOKENS",
        "perplexity = math.exp(mean_nll)",
        "bpc = TOTAL_NATS / math.log(2) / BYTES",
        "",
        'print(f"exact match {exact_match(CASES):.2f} (8/12)")',
        'print(f"macro F1 {macro_f1(CASES):.2f}")',
        'print(f"cosine similarity {cosine(EXPECTED_TEXT, PREDICTED_TEXT):.2f}")',
        "low, high = wilson(17, 41)",
        'print(f"pass rate {17/41:.2f} (17/41), 95% interval {low:.2f} to {high:.2f}")',
        'print(f"perplexity {perplexity:.2f}")',
        'print(f"bits per byte {bpc:.2f}")',
      ].join("\n"),
    },
  },
  prove: {
    prompt: "Which metric did you choose, and what did the run show?",
    placeholder: "I changed X; the result was Y.",
    maxLength: 280,
    debounceMs: 800,
    savedMessage: "Proof saved on this device.",
  },
  citation:
    "Further reading: AI Engineering by Chip Huyen (O'Reilly). This course is independent and reproduces no book text or figures.",
} as const satisfies Lesson);
