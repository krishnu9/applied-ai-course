import type { Lesson } from "@/lib/types";
import { deepFreeze } from "../freeze";

export const evaluationLesson = deepFreeze({
  slug: "evaluation",
  order: 1,
  title: "Evaluation you can trust",
  outcome: "You can turn a vague quality claim into a repeatable score.",
  artifact: "A small eval set and the command that runs it.",
  readingMinutes: 10,
  difficulty: "core",
  layerId: "layer-01",
  sections: [
    {
      id: "read-the-vague-score",
      title: "Read: the vague score",
      blocks: [
        {
          kind: "paragraph",
          id: "p-eval-1",
          text: "The support team says the triage feature is better. Nobody can say how much better, or for which tickets. A claim like this cannot guide a repair, because it has no cases, no labels and no command.",
        },
        {
          kind: "paragraph",
          id: "p-eval-2",
          text: "A score you can trust has three parts. Fixed cases with known labels. A fixed run that labels the same cases. A stored number from that run. The number means something only while all three parts stay fixed.",
        },
        {
          kind: "paragraph",
          id: "p-eval-3",
          text: "The sample feature routes support tickets into four labels: refund, shipping, billing and other. At the start it passes 41 of every 100 tickets. Every number in this course is sample data with a fixed value.",
        },
        {
          kind: "paragraph",
          id: "p-eval-4",
          text: "The team measures the wrong thing today. It counts how often an answer looks polite. Politeness is easy to see and hard to compare. The pass rate compares the same tickets against the same labels after every change.",
        },
        {
          kind: "paragraph",
          id: "p-eval-5",
          text: "A score also carries a cost and a latency. A feature that passes more tickets but takes four seconds is not free to ship. Record all three numbers on the same run, or the score hides the trade-off.",
        },
        {
          kind: "callout",
          id: "callout-eval-demo",
          tone: "warning",
          title: "A demo is not a score.",
          text: "One good answer proves one path through the feature. A score proves that the path holds for a set of cases.",
        },
      ],
    },
    {
      id: "read-the-frozen-set",
      title: "Read: the frozen set",
      blocks: [
        {
          kind: "paragraph",
          id: "p-eval-6",
          text: "Collect cases from the support queue, not from the model. A case has an input ticket and an expected label written by a person. Store the cases in a JSON file and keep the file under version control.",
        },
        {
          kind: "list",
          id: "list-eval-rules",
          ordered: false,
          items: [
            "Use past failures. A failure is a case the feature got wrong before.",
            "Keep one case per failure type. Ten copies of one type hide other types.",
            "Write the label before the run. A label written after the run is a story.",
            "Freeze the file. Add a case only when a new failure appears.",
            "Record who wrote each label and when.",
          ],
        },
        {
          kind: "paragraph",
          id: "p-eval-7",
          text: "Start with about forty cases. The sample set holds forty-one cases and seventeen pass. Forty-one is small enough to read in one sitting and large enough to show a trend across two runs.",
        },
        {
          kind: "paragraph",
          id: "p-eval-8",
          text: "The label needs a rule, not a mood. Write the rule next to the case. When two people cannot agree on a label, the case is unclear and the feature cannot be blamed for a miss.",
        },
        {
          kind: "paragraph",
          id: "p-eval-9",
          text: "Forty cases do not prove the feature. They show a direction. A five-point move can be noise on a set this size. Use the number to compare two versions, not to promise a result.",
        },
        {
          kind: "paragraph",
          id: "p-eval-20",
          text: "A case costs time to collect and label. Forty cases cost a few hours, and the set pays that cost back on the first comparison. A team that skips the set pays the same hours on every argument about quality.",
        },
        { kind: "check", id: "check-eval-a", checkId: "check-1" },
      ],
    },
    {
      id: "check-the-label",
      title: "Check: the label you can keep",
      blocks: [
        {
          kind: "paragraph",
          id: "p-eval-10",
          text: "A case can leak the answer. If the input ticket already contains the label word, the feature passes for the wrong reason. Read each ticket and ask what rule the feature must learn.",
        },
        {
          kind: "paragraph",
          id: "p-eval-11",
          text: "The opposite error is a case without enough information. If no rule can produce the label from the input, the case is a coin toss. Remove it or add the missing text.",
        },
        {
          kind: "paragraph",
          id: "p-eval-12",
          text: "Label quality is the main source of error in a small set. Check a sample of labels with a second person. Fix a label before you change the feature, or you will tune the feature to a mistake.",
        },
        { kind: "check", id: "check-eval-b", checkId: "check-2" },
        {
          kind: "callout",
          id: "callout-eval-heldout",
          tone: "production-tip",
          title: "Keep a held-out set.",
          text: "Run the score on a second file that tuning never touches. A score on the tuning file flatters every change.",
        },
      ],
    },
    {
      id: "build-the-harness",
      title: "Build: the smallest harness",
      blocks: [
        {
          kind: "paragraph",
          id: "p-eval-13",
          text: "The harness does three jobs. It loads the cases. It labels each case. It counts the matches and prints the rate. The scorer is a stand-in for the model. The harness cares only that the same input gives the same output on each run.",
        },
        {
          kind: "paragraph",
          id: "p-eval-14",
          text: "Pin everything that can move. Pin the case file, the scorer code and the model version. A score from a run with a free variable is not comparable with the next run.",
        },
        {
          kind: "code",
          id: "code-eval-harness",
          filename: "eval/run_eval.py",
          language: "python",
          code: [
            "import json",
            "from pathlib import Path",
            "",
            "def label(ticket: str) -> str:",
            '    if "refund" in ticket:',
            '        return "refund"',
            '    if "late" in ticket or "delivery" in ticket:',
            '        return "shipping"',
            '    if "invoice" in ticket or "charge" in ticket:',
            '        return "billing"',
            '    return "other"',
            "",
            'cases = json.loads(Path(__file__).with_name("eval_set.json").read_text())',
            'passed = [case for case in cases if label(case["input"]) == case["expected"]]',
            "rate = len(passed) / len(cases)",
            'print(f"pass rate {rate:.0%} ({len(passed)}/{len(cases)})")',
          ].join("\n"),
          output: {
            label: "Sample output. Fixed data.",
            text: "pass rate 41% (17/41)",
          },
        },
        {
          kind: "paragraph",
          id: "p-eval-15",
          text: "Run the command before a change and after a change. Record both numbers with the commit message. Keep eval_set.json in the same folder as run_eval.py, so the path is stable both times. The difference between the two numbers is the evidence for the change.",
        },
        {
          kind: "paragraph",
          id: "p-eval-16",
          text: "Read the failures after every run. A failure is a case with a wrong label or a missing rule. Add one case for each new failure type, and keep the old cases unchanged.",
        },
        { kind: "task", id: "task-eval" },
        {
          kind: "note",
          id: "note-eval",
          text: "Store the score next to the command that produced it. A number without a command is hard to repeat.",
        },
      ],
    },
    {
      id: "prove-the-score",
      title: "Prove: state the change",
      blocks: [
        {
          kind: "paragraph",
          id: "p-eval-17",
          text: "A proof note closes the loop. Write one sentence with the change and the result. Name the case set and the number, so another reader can repeat the run without asking you.",
        },
        {
          kind: "paragraph",
          id: "p-eval-18",
          text: "Weak note: the prompt is better now. Strong note: I added a rule for billing tickets to the prompt; the pass rate moved from 41 to 49 percent on the forty-one-case set.",
        },
        {
          kind: "paragraph",
          id: "p-eval-19",
          text: "Keep the note short. The note is a claim a reviewer can check. The command and the case file are the evidence behind the claim.",
        },
        {
          kind: "callout",
          id: "callout-eval-set",
          tone: "note",
          title: "Name the set.",
          text: "A result without the case set is a claim. The set is part of the evidence.",
        },
      ],
    },
  ],
  checks: [
    {
      id: "check-1",
      prompt:
        "A teammate shows one good answer and calls the feature better. What is missing?",
      options: [
        { id: "option-a", label: "A larger model" },
        { id: "option-b", label: "The same cases and command, run before the change" },
        { id: "option-c", label: "A longer system prompt" },
        { id: "option-d", label: "More screenshots of good answers" },
      ],
      correctOptionId: "option-b",
      explanation:
        "A score is trustworthy when the same cases run the same way before and after a change. One good answer proves one path, not the whole task.",
    },
    {
      id: "check-2",
      prompt: "Which case earns a place in the eval set?",
      options: [
        { id: "option-a", label: "The easiest ticket, which always passes" },
        { id: "option-b", label: "A ticket copied from a model answer" },
        { id: "option-c", label: "A past failure with a human-written label" },
        { id: "option-d", label: "A ticket with no expected label" },
      ],
      correctOptionId: "option-c",
      explanation:
        "A set earns trust when it holds past failures with known labels. Easy cases inflate the score, and a case without a label cannot pass or fail.",
    },
  ],
  task: {
    id: "task-eval",
    scope: "Build and run a small eval harness for the support-triage feature.",
    items: [
      { id: "item-1", label: "Write the task in one sentence." },
      { id: "item-2", label: "Collect at least twenty cases with expected labels." },
      { id: "item-3", label: "Store the cases in eval_set.json." },
      { id: "item-4", label: "Run run_eval.py and record the pass rate." },
      { id: "item-5", label: "Run the same command after one change." },
    ],
    solution: {
      filename: "eval/run_eval.py",
      language: "python",
      code: [
        "import json",
        "from pathlib import Path",
        "",
        "def label(ticket: str) -> str:",
        '    if "refund" in ticket:',
        '        return "refund"',
        '    if "late" in ticket or "delivery" in ticket:',
        '        return "shipping"',
        '    if "invoice" in ticket or "charge" in ticket:',
        '        return "billing"',
        '    return "other"',
        "",
        'cases = json.loads(Path(__file__).with_name("eval_set.json").read_text())',
        'passed = [case for case in cases if label(case["input"]) == case["expected"]]',
        "rate = len(passed) / len(cases)",
        'print(f"pass rate {rate:.0%} ({len(passed)}/{len(cases)})")',
      ].join("\n"),
    },
  },
  prove: {
    prompt: "What did you change, and what did the score do?",
    placeholder: "I changed X; the result was Y.",
    maxLength: 280,
    debounceMs: 800,
    savedMessage: "Proof saved on this device.",
  },
  citation:
    "Further reading on evaluation: AI Engineering by Chip Huyen (O'Reilly). This course is independent and reproduces no book text or figures.",
} as const satisfies Lesson);
