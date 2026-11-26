import type { Lesson } from "@/lib/types";
import { deepFreeze } from "../freeze";

export const observabilityFeedbackLesson = deepFreeze({
  slug: "observability-feedback",
  order: 24,
  title: "Observe quality and learn from users",
  chapterId: "ch-10",
  chapterOrder: 10,
  status: "live",
  outcome:
    "You can define the three telemetry signals, compute the incident metrics, and design a feedback signal that catches a silent quality drop. Prerequisite: lesson 23, guardrails, gateways and fallbacks.",
  artifact:
    "An observability sheet with one trace, one alert rule and one feedback audit.",
  readingMinutes: 22,
  difficulty: "advanced",
  terms: [
    {
      term: "Observability",
      definition:
        "The ability to infer system state from logs, metrics and traces.",
    },
    {
      term: "Trace",
      definition:
        "The linked record of one request across services, with timings and attributes.",
    },
    {
      term: "Metric",
      definition:
        "A numeric measure collected over time, such as error rate or latency.",
    },
    {
      term: "MTTD (mean time to detect)",
      definition: "The average time from a fault to its detection.",
    },
    {
      term: "MTTR (mean time to recover)",
      definition: "The average time from detection to recovery.",
    },
    {
      term: "CFR (change failure rate)",
      definition: "The share of changes that cause a failure.",
    },
  ],
  evalCase: {
    id: "case-observability-feedback",
    brief: "Design the signal that catches a silent quality drop.",
  },
  sections: [
    {
      id: "what-it-is",
      title: "What it is",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "observability-feedback-p-1",
          text: "Observability is the ability to infer system state from logs, metrics and traces. A log records one event. A metric is a number over time. A trace links one request across services. The three answer what happened, how often, and where the time went.",
        },
        {
          kind: "paragraph",
          id: "observability-feedback-p-2",
          text: "A worked example: a support request carries an id. The gateway log, the retrieval span and the model span share it. A histogram shows a p95 of 1,400 ms and an error rate of 0.5 percent. A feedback row shows a thumbs-down on a refund answer.",
        },
        {
          kind: "paragraph",
          id: "observability-feedback-p-3",
          text: "A non-example: a dashboard with one uptime number is not observability for quality. It shows that the service answers, not that the answer is correct. Quality needs a labeled sample, a feedback signal or both.",
        },
      ],
    },
    {
      id: "eli5-a-hospital",
      title: "A hospital",
      register: "eli5",
      blocks: [
        {
          kind: "analogy",
          id: "observability-feedback-analogy-1",
          text: "Think of a hospital. The chart records each visit, and that chart is the log. The vital-sign board shows the whole ward, and that board is the metric. One patient's path through the ward is the trace. When a patient gets worse, the chart shows what happened, the board shows how many, and the path shows where the delay started.",
          breaks:
            "Where it breaks: a hospital records a body. A model request records text, tokens and versions, and a wrong answer leaves no bruise and no reading.",
        },
        {
          kind: "paragraph",
          id: "observability-feedback-p-4",
          text: "Prediction: a ward reports many quick visits and one very long visit. Which record shows the long visit, which shows the count, and which shows the path? Say which record is which, and name the reason.",
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
          id: "observability-feedback-p-5",
          text: "Telemetry starts with one id and one event per stage. The loop closes when a failure becomes an eval case.",
        },
        {
          kind: "list",
          id: "observability-feedback-list-1",
          ordered: true,
          items: [
            "Assign one request id at the gateway.",
            "Emit one structured log line per stage with version, tokens, latency and status.",
            "Emit one span per stage and join them by id.",
            "Emit counters, histograms and gauges, and read percentiles from the histogram.",
            "Alert on an SLO burn: error rate, p95, goodput and quality.",
            "Collect explicit and implicit feedback, then stratify by slice.",
            "Turn each confirmed failure into an eval case and gate the fix.",
          ],
        },
        {
          kind: "paragraph",
          id: "observability-feedback-p-6",
          text: "A metric is cheap and aggregate. A histogram holds buckets, so p50 and p95 come from the same data. Never average two percentiles.",
        },
        {
          kind: "paragraph",
          id: "observability-feedback-p-7",
          text: "A trace shows one request end to end. Each span has a name, a start, an end and attributes. Sample routine traffic and keep every error, because the trace shows where time went.",
        },
        {
          kind: "paragraph",
          id: "observability-feedback-p-8",
          text: "Three metrics compare releases. MTTD (mean time to detect) runs from the fault to detection. MTTR (mean time to recover) runs from detection to recovery. CFR (change failure rate) is the share of changes that fail. A change at 02:00, detected at 02:20 and repaired at 04:20 gives MTTD 20 minutes and MTTR 2 hours.",
        },
        {
          kind: "paragraph",
          id: "observability-feedback-p-9",
          text: "Explicit feedback is a signal the user gives on purpose, such as a rating. Implicit feedback comes from behavior, such as a copy, an edit or a retry. Explicit is sparse and biased; implicit is dense and ambiguous.",
        },
        {
          kind: "paragraph",
          id: "observability-feedback-p-10",
          text: "Feedback bias is the skew toward loud, easy or satisfied users. A thumbs-up cannot measure the silent failure. Compare feedback with the eval and implicit signals on the same slice.",
        },
        {
          kind: "paragraph",
          id: "observability-feedback-p-10b",
          text: "Sycophancy is the model's tendency to agree with the user, so a wrong answer can earn a good rating. Do not score by tone alone. Ask after one clear decision, not every turn, and offer fixed choices.",
        },
        {
          kind: "paragraph",
          id: "observability-feedback-p-10c",
          text: "Conversational feedback extraction reads a chat for a signal. A retry, an edit or a thank-you line is a label. A model pass extracts the label and the reason, then a person checks a sample.",
        },
        {
          kind: "paragraph",
          id: "observability-feedback-p-11",
          text: "A degenerate feedback loop learns only from the system's own output. Rank by clicks, and the model serves more of what it already shows. Keep a human-labeled held-out set, and compare each release with it.",
        },
        {
          kind: "paragraph",
          id: "observability-feedback-p-12",
          text: "Feedback text and logs can carry personal data. Mask names, emails and phones before storage. Keep few fields, set a retention period, and limit access by tenant.",
        },
        {
          kind: "table",
          id: "observability-feedback-table-1",
          columns: ["Signal", "What it shows", "Cost", "Blind spot"],
          rows: [
            ["Metric", "Rate and tail", "Cheap", "No reason"],
            ["Trace", "Where the time went", "Sampled", "Not the whole truth"],
            ["Log", "The exact event", "Storage", "Hard to aggregate"],
            ["Explicit feedback", "A stated opinion", "Sparse", "Only loud users"],
            ["Implicit feedback", "Behavior", "Dense", "Ambiguous"],
            ["Conversational feedback", "A retry or edit in chat", "Dense", "Needs extraction"],
          ],
          caption: "Five signals, each with one cost and one blind spot.",
        },
        {
          kind: "diagram",
          id: "observability-feedback-diagram-1",
          variant: "flow",
          spec: {
            nodes: [
              { id: "request", label: "Request" },
              { id: "emit", label: "Emit logs" },
              { id: "alert", label: "Alert" },
              { id: "triage", label: "Triage" },
              { id: "fix", label: "Fix" },
              { id: "eval", label: "Eval gate" },
              { id: "deploy", label: "Deploy" },
            ],
            edges: [
              ["request", "emit"],
              ["emit", "alert"],
              ["alert", "triage"],
              ["triage", "fix"],
              ["fix", "eval"],
              ["eval", "deploy"],
              ["deploy", "request"],
            ],
          },
          caption:
            "A request emits telemetry; an alert starts a fix; the eval gate closes the loop.",
          alt: "Flow from a request through emitted telemetry and an alert to triage, a fix, an eval gate and a deploy.",
        },
      ],
    },
    {
      id: "eli5-a-comment-card",
      title: "A comment card",
      register: "eli5",
      blocks: [
        {
          kind: "analogy",
          id: "observability-feedback-analogy-2",
          text: "Think of a restaurant. A comment card is a guest who takes the time to write, and that card is explicit feedback. An empty plate shows a guest who ate, and that plate is implicit feedback. The cards come from the guests who care most, and the plates come from every table. A full plate does not prove the meal was good, and a card can be loud, kind or wrong.",
          breaks:
            "Where it breaks: a plate is finished for many reasons, such as hunger. A copied answer or a retry has several meanings too, and neither one states a reason.",
        },
        {
          kind: "paragraph",
          id: "observability-feedback-p-13",
          text: "Prediction: which signal arrives from every table, which one carries a stated opinion, and which one can be misread? Say why.",
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
          id: "observability-feedback-table-2",
          columns: ["Symptom", "Cause", "Check", "Fix"],
          rows: [
            [
              "Quality drops with no error spike",
              "A model or prompt change",
              "Daily eval sample and retry rate",
              "Add an eval gate to deploys",
            ],
            [
              "MTTR stays high",
              "No shared request id",
              "Follow one failing request",
              "Propagate one id",
            ],
            [
              "Thumbs-down is fine and users leave",
              "Feedback bias to loud users",
              "Compare feedback with retries by slice",
              "Sample the silent users",
            ],
            [
              "A dashboard shows a good average",
              "Averages hide the tail",
              "Read p95 and goodput",
              "Report percentiles",
            ],
          ],
          caption: "Four observability failures, each with one check.",
        },
        {
          kind: "paragraph",
          id: "observability-feedback-p-14",
          text: "More telemetry adds detection, cost and privacy risk. Sample traces, keep every error, store few fields.",
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
          id: "observability-feedback-p-15",
          text: "A new prompt version ships on the refund route. The dashboard stays green: no errors and a p95 of 1,400 ms. Nine days later, a support lead reports wrong refund windows.",
        },
        {
          kind: "paragraph",
          id: "observability-feedback-p-16",
          text: "The eval set shows the cause. The refund slice falls from 0.88 to 0.66, and the overall score falls only from 0.74 to 0.71. The trace holds the prompt version on every span. The refund retry rate rises from 0.04 to 0.17, and thumbs-down stays at 0.04.",
        },
        {
          kind: "paragraph",
          id: "observability-feedback-p-17",
          text: "The detection took nine days because no eval ran on the change or cut by slice. The decision is a daily eval on a fixed sample, a canary eval gate on every deploy, and a retry-rate alert per slice. The team adds one request id to every log and trace. MTTD falls to 30 minutes, and the silent slice becomes visible.",
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
          id: "observability-feedback-p-18",
          text: "Answer five checks on the definition, signal choice, failure, incident calculation and feedback limits.",
        },
        { kind: "check", id: "observability-feedback-check-1", checkId: "check-1" },
        { kind: "check", id: "observability-feedback-check-2", checkId: "check-2" },
        { kind: "check", id: "observability-feedback-check-3", checkId: "check-3" },
        { kind: "check", id: "observability-feedback-check-4", checkId: "check-4" },
        { kind: "check", id: "observability-feedback-check-5", checkId: "check-5" },
      ],
    },
    {
      id: "evaluation-task",
      title: "Evaluation task",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "observability-feedback-p-19",
          text: "The task uses 12 fixed requests, one incident and one release log. Build one script that prints latency, error, retry and incident metrics.",
        },
        { kind: "task", id: "task-observability-feedback" },
        {
          kind: "paragraph",
          id: "observability-feedback-p-20",
          text: "The reference solution prints a p50 of 1,150 ms and a p95 of 2,200 ms. The error rate is 0.08 and the retry rate is 0.17. The incident gives MTTD 20 minutes, MTTR 120 minutes and CFR 0.15. On the refund slice, thumbs-down is 0.04 and retry is 0.17, a gap of 0.13.",
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
          id: "observability-feedback-p-21",
          text: "Write one sentence: I changed X; the result was Y. Name the signal, the two detection times, and the hidden slice.",
        },
        {
          kind: "paragraph",
          id: "observability-feedback-p-22",
          text: "Self-rubric: mechanism names the signal and rule; evidence gives a time or rate; limit names one bias or blind spot.",
        },
        {
          kind: "note",
          id: "observability-feedback-note-1",
          text: "A green dashboard can hide a wrong answer. Measure quality, not only uptime.",
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
          id: "observability-feedback-interview-1",
          items: [
            {
              question: "What are logs, metrics and traces, and when do you use each?",
              answer:
                "A log records one event, a metric is a number over time, and a trace links the spans of one request. Use metrics for alerts, traces for time, and logs for the exact event. One request id joins them, and a histogram gives p50 and p95.",
            },
            {
              question: "When do you trust explicit feedback over implicit feedback?",
              answer:
                "Trust explicit feedback when the user states the reason and the sample is large enough. It is sparse and biased to strong opinions, so it rarely covers silent failures. Use implicit feedback for coverage and explicit for meaning. A retry often detects a failure before a rating does.",
            },
            {
              question: "How does feedback bias show up, and what do you check?",
              answer:
                "Feedback bias shows up as a stable thumbs-down rate while the retry rate rises. Loud users write, and quiet users leave, so the sample is not the user base. Compare feedback with implicit signals on the same slice. Report the gap, not the rating alone.",
            },
            {
              question: "How does observability change at 10x traffic or services?",
              answer:
                "At 10x traffic, trace sampling and metric aggregation carry the volume, with one request id across services. At 10x services, a trace shows one path and a metric shows the fleet. Watch MTTD, MTTR and CFR together, and gate each deploy on a canary eval. Keep every error trace and sample the routine ones.",
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
      prompt: "Which sentence defines MTTD?",
      options: [
        { id: "option-a", label: "The average time from a fault to its detection." },
        { id: "option-b", label: "The average time from detection to recovery." },
        { id: "option-c", label: "The share of changes that cause a failure." },
        { id: "option-d", label: "The share of requests that meet the target." },
      ],
      correctOptionId: "option-a",
      explanation:
        "MTTD measures the delay before anyone notices a fault. Option B names MTTR, which starts at detection and ends at recovery.",
    },
    {
      id: "check-2",
      kind: "apply",
      prompt:
        "A team wants the earliest sign that refund answers are wrong. Which signal fits?",
      options: [
        { id: "option-a", label: "The uptime metric" },
        { id: "option-b", label: "The refund retry rate" },
        { id: "option-c", label: "The p50 latency" },
        { id: "option-d", label: "The model parameter count" },
      ],
      correctOptionId: "option-b",
      explanation:
        "A retry is an implicit signal that the answer failed the user, and it arrives without a rating. Uptime and p50 can stay healthy while the answer is wrong.",
    },
    {
      id: "check-3",
      kind: "diagnose",
      prompt:
        "Errors are zero, p95 is fine, and the refund slice accuracy falls for nine days. What is missing?",
      options: [
        { id: "option-a", label: "A larger model" },
        { id: "option-b", label: "A slice-level quality signal and an eval gate" },
        { id: "option-c", label: "A lower batch size" },
        { id: "option-d", label: "A second cache" },
      ],
      correctOptionId: "option-b",
      explanation:
        "A quality drop without errors needs a labeled sample or implicit signal on the failing slice. Latency and error metrics cannot see a wrong answer, so a model or batch change is a guess.",
    },
    {
      id: "check-4",
      kind: "calculate",
      prompt:
        "A fault starts at 02:00 and is detected at 02:20. What is the MTTD?",
      options: [
        { id: "option-a", label: "20 minutes" },
        { id: "option-b", label: "2 hours" },
        { id: "option-c", label: "0.20 minutes" },
        { id: "option-d", label: "120 minutes" },
      ],
      correctOptionId: "option-a",
      explanation:
        "MTTD is the time from the fault to its detection, which is 20 minutes. Option B is the MTTR when recovery follows two hours after detection.",
    },
    {
      id: "check-5",
      kind: "diagnose",
      prompt:
        "A chat model agrees with every complaint. User ratings rise while the refund slice falls. Which feedback limit does this show?",
      options: [
        { id: "option-a", label: "Sycophancy" },
        { id: "option-b", label: "Position bias" },
        { id: "option-c", label: "A cold cache" },
        { id: "option-d", label: "A token budget" },
      ],
      correctOptionId: "option-a",
      explanation:
        "A sycophantic answer pleases the user and can still be wrong, so a rating hides the slice drop. Position bias belongs to pairwise judges, and a cache cannot change the answer.",
    },
  ],
  task: {
    id: "task-observability-feedback",
    scope:
      "Compute the serving and incident metrics from fixed logs, then choose one alert.",
    items: [
      {
        id: "item-1",
        label: "Compute p50 and p95 from the 12 fixed request durations.",
      },
      {
        id: "item-2",
        label: "Compute the error rate and the retry rate from the same rows.",
      },
      {
        id: "item-3",
        label: "Compute MTTD, MTTR and CFR from the incident and release log.",
      },
      {
        id: "item-4",
        label: "Compare the thumbs-down rate with the retry rate on the refund slice.",
      },
      {
        id: "item-5",
        label: "Write one alert rule and one privacy rule for feedback text.",
      },
    ],
    solution: {
      filename: "observability/incident.py",
      language: "python",
      code: [
        "import math",
        "",
        "DURATIONS = [900, 950, 1_000, 1_050, 1_100, 1_150,",
        "             1_200, 1_250, 1_300, 1_400, 1_600, 2_200]",
        "STATUS = [\"ok\"] * 11 + [\"error\"]",
        "RETRIED = [False] * 10 + [True, True]",
        "CHANGED = 2 * 60",
        "DETECTED = 2 * 60 + 20",
        "RECOVERED = 4 * 60 + 20",
        "RELEASES = 20",
        "FAILED_RELEASES = 3",
        "REFUND = {\"responses\": 30, \"retries\": 5, \"ratings\": 25, \"thumbs_down\": 1}",
        "",
        "",
        "def percentile(values, p):",
        "    ordered = sorted(values)",
        "    rank = math.ceil(p * len(ordered))",
        "    return ordered[rank - 1]",
        "",
        "",
        "print(f\"p50 {percentile(DURATIONS, 0.50)} ms  p95 {percentile(DURATIONS, 0.95)} ms\")",
        "errors = sum(1 for status in STATUS if status == \"error\")",
        "retries = sum(1 for value in RETRIED if value)",
        'print(f"error rate {errors / len(STATUS):.2f}  retry rate {retries / len(RETRIED):.2f}")',
        "",
        "print(f\"MTTD {DETECTED - CHANGED} min  MTTR {RECOVERED - DETECTED} min\")",
        "print(f\"CFR {FAILED_RELEASES / RELEASES:.2f}\")",
        "",
        "retry_rate = REFUND[\"retries\"] / REFUND[\"responses\"]",
        "thumbs_rate = REFUND[\"thumbs_down\"] / REFUND[\"ratings\"]",
        'print(f"refund retry {retry_rate:.2f}  thumbs-down {thumbs_rate:.2f}  gap {retry_rate - thumbs_rate:.2f}")',
        "",
        'print("alert: refund retry rate > 0.10 for 30 min")',
        'print("privacy: mask email and phone, retain 30 days")',
      ].join("\n"),
    },
  },
  prove: {
    prompt: "Which signal did you add, and how did detection time or quality move?",
    placeholder: "I changed X; the result was Y.",
    maxLength: 280,
    debounceMs: 800,
    savedMessage: "Proof saved on this device.",
  },
  citation:
    "Further reading: AI Engineering by Chip Huyen (O'Reilly). This course is independent and reproduces no book text or figures.",
} as const satisfies Lesson);
