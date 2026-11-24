import type { Lesson } from "@/lib/types";
import { deepFreeze } from "../freeze";

export const llmAsJudgeLesson = deepFreeze({
  slug: "llm-as-judge",
  order: 8,
  title: "Judges, rubrics and bias",
  chapterId: "ch-03",
  chapterOrder: 3,
  status: "live",
  outcome:
    "You can define an LLM-as-judge, design a rubric, and audit a verdict for bias.",
  artifact: "A judge prompt, a swap test and a 10-case audit sheet.",
  readingMinutes: 26,
  difficulty: "core",
  terms: [
    {
      term: "LLM-as-judge",
      definition: "The use of a language model to score answers against a rubric or a reference.",
    },
    {
      term: "Rubric",
      definition: "A written list of criteria and levels that defines a good answer.",
    },
    {
      term: "Pointwise judgment",
      definition: "A judge scores each answer alone.",
    },
    {
      term: "Pairwise judgment",
      definition: "A judge compares two answers and picks a winner.",
    },
    {
      term: "Position bias",
      definition: "A judge favors the answer in a fixed slot, such as first or last.",
    },
    {
      term: "Verbosity bias",
      definition: "A judge favors longer answers regardless of quality.",
    },
  ],
  evalCase: {
    id: "case-llm-as-judge",
    brief: "Audit a triage judge and explain its preference.",
  },
  sections: [
    {
      id: "before-you-start",
      title: "Before you start",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "p-llm-as-judge-1",
          text: "This lesson needs lesson 6 on evaluation and lesson 7 on eval sets. You need one eval set with human labels and one pair of candidate answers.",
        },
        {
          kind: "list",
          id: "list-llm-as-judge-prereq",
          ordered: false,
          items: [
            "Read lesson 6 for the difference between verifiable and subjective tasks.",
            "Read lesson 7 for the frozen eval set and its labels.",
          ],
        },
      ],
    },
    {
      id: "what-it-is",
      title: "What it is",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "p-llm-as-judge-2",
          text: "An LLM-as-judge is the use of a language model to score answers against a rubric or a reference. A rubric is a written list of criteria and levels. A judge turns an open question into a repeatable score. It sits in the evaluation layer, after the system writes an answer and before a person audits the result.",
        },
        {
          kind: "paragraph",
          id: "p-llm-as-judge-3",
          text: "A team has 200 product reviews and no time to label each one. The rubric names two criteria: correct fact and clear reason. Each criterion has three levels. The judge reads one review and returns a level for each criterion with one reason. A person then reads 30 verdicts and compares them with the human label. The match rate is the human agreement rate.",
        },
        {
          kind: "paragraph",
          id: "p-llm-as-judge-4",
          text: "A unit test that checks the JSON keys is not a judge. A fixed rule makes the decision, and the result repeats with no model call. A judge weighs a written rubric against open text, so the reason matters as much as the score.",
        },
        {
          kind: "paragraph",
          id: "p-llm-as-judge-5",
          text: "Labels are expensive, and open answers have many correct shapes. A judge applies one written rubric to many answers at low cost per answer. The judge is a measurement tool, not a source of truth. A judge call costs tokens and time, so the eval budget sets the sample size.",
        },
      ],
    },
    {
      id: "eli5-a-critic-with-a-score-sheet",
      title: "A critic with a score sheet",
      register: "eli5",
      blocks: [
        {
          kind: "analogy",
          id: "analogy-llm-as-judge-critic",
          text: "A food critic visits one restaurant at a time. The critic carries a score sheet with three lines: taste, portion and price. For each line the critic writes a level from one to three. The score sheet keeps the critic consistent across ten restaurants. The critic is the judge, the score sheet is the rubric, and each plate is one answer.",
          breaks:
            "A food critic tastes the food and knows the truth. A judge reads text and cannot taste a false claim, so a fluent wrong answer can earn a high level.",
        },
        {
          kind: "paragraph",
          id: "p-llm-as-judge-6",
          text: "This is pointwise judgment, because the critic scores each plate alone.",
        },
        {
          kind: "paragraph",
          id: "p-llm-as-judge-7",
          text: "If the score sheet gives one point for each side dish, which restaurant wins: the one with the better main dish or the one with more side dishes?",
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
          id: "p-llm-as-judge-8",
          text: "A judge is a pipeline, not one prompt. Each step removes one source of noise.",
        },
        {
          kind: "list",
          id: "list-llm-as-judge-steps",
          ordered: true,
          items: [
            "Write the rubric. Name each criterion and write one concrete example for each level.",
            "Choose the shape. Use pointwise judgment for one answer. Use pairwise judgment for two answers.",
            "Build the judge prompt. Put the task, the inputs, the rubric and the output contract in fixed sections.",
            "Fix the sampling. Set temperature to zero and record the model version with the score.",
            "Run both orders. A pairwise judge reads A then B, and then reads B then A.",
            "Audit the verdicts. A person labels a sample, and the team computes the human agreement rate.",
          ],
        },
        {
          kind: "paragraph",
          id: "p-llm-as-judge-9",
          text: "The judge prompt decides most of the quality. State the task in one sentence. Put the question and each answer behind a clear delimiter. Paste the full rubric. Ask for one verdict and one reason that cites a level. Hide the model name and the author name, so the judge cannot learn the source. Add a tie option, or the judge picks a winner on equal answers.",
        },
        {
          kind: "paragraph",
          id: "p-llm-as-judge-32",
          text: "Use a fixed output contract. Ask for a winner field, a confidence field and a reason field. The winner field feeds the score. The confidence field marks close calls for human review. The reason field names the rubric level that decided the case. A free-text answer with no fields is hard to count at scale.",
        },
        {
          kind: "paragraph",
          id: "p-llm-as-judge-10",
          text: "A rubric needs concrete levels. Write three or four levels for each criterion. Give each level one example answer. A level called good with no example invites drift, because two runs read it in two ways. Keep the rubric short enough to fit in every call. A long rubric adds tokens and hides the important rule.",
        },
        {
          kind: "paragraph",
          id: "p-llm-as-judge-33",
          text: "Two rubric rules prevent most bias. A correctness gate caps the score when a fact is wrong, so a fluent answer cannot win on style. A length rule caps the style points, so a longer answer cannot win on size. Write both rules before the first judge run. A rule added after a bad result can look like a fit to one case.",
        },
        {
          kind: "table",
          id: "table-llm-as-judge-shapes",
          columns: ["Question", "Pointwise judgment", "Pairwise judgment"],
          rows: [
            ["Input", "One answer and the rubric", "Two answers and the question"],
            ["Output", "A level for each criterion", "A winner, a tie or a reason"],
            ["Strength", "An absolute score for one answer", "A direct choice between two answers"],
            ["Weakness", "The score can drift between runs", "Position bias can change the winner"],
          ],
          caption: "Two judgment shapes with one rubric.",
        },
        {
          kind: "paragraph",
          id: "p-llm-as-judge-11",
          text: "Pairwise verdicts feed a ranking. Each win adds points to an Elo rating, and each loss removes points. The size of the step follows the rating gap. A preference model learns the same signal from many comparisons. Count one win only after both orders agree. A single order turns position bias into rating points.",
        },
        {
          kind: "diagram",
          variant: "flow",
          id: "diagram-llm-as-judge",
          spec: {
            nodes: [
              { id: "pair", label: "Answer pair" },
              { id: "prompt", label: "Judge prompt" },
              { id: "verdict", label: "Verdict" },
              { id: "audit", label: "Audit sample" },
              { id: "rate", label: "Agreement rate" },
            ],
            edges: [
              ["pair", "prompt"],
              ["prompt", "verdict"],
              ["verdict", "audit"],
              ["audit", "rate"],
            ],
          },
          caption:
            "A judge scores a pair, and a human audit turns the verdicts into an agreement rate.",
          alt: "Flow from an answer pair through a judge prompt and a verdict to an audit sample and an agreement rate.",
        },
        {
          kind: "paragraph",
          id: "p-llm-as-judge-12",
          text: "The audit is the ground check. Draw a random sample from the eval set and stratify it by slice. Two people check the labels on the sample. The team then compares the judge with those labels. Report the human agreement rate with the sample size. A rate from 20 cases has a wide range, so name the range before you trust the judge.",
        },
        {
          kind: "paragraph",
          id: "p-llm-as-judge-34",
          text: "Measure the judge on three numbers. The human agreement rate measures the match with labels. The position-flip rate measures the share of pairs whose winner changes after a swap. The verbosity gap measures the score change for one added sentence. Report all three with the sample size, or one number can hide a bias.",
        },
        {
          kind: "paragraph",
          id: "p-llm-as-judge-35",
          text: "A judge call adds tokens and latency to the eval run. Batch the calls and reuse a cached rubric prefix. A pairwise run costs twice the calls of a pointwise run on the same pairs. Budget the judge as a serving cost, not as a free check.",
        },
        {
          kind: "paragraph",
          id: "p-llm-as-judge-13",
          text: "Use the judge on new answers, not on the sample that shaped the rubric. A rubric tuned to 30 audited cases can pass those cases and fail the next 30. Keep a held-out audit slice. Recheck agreement when the rubric, the judge model or the product changes.",
        },
      ],
    },
    {
      id: "eli5-a-referee-in-one-lane",
      title: "A referee in one lane",
      register: "eli5",
      blocks: [
        {
          kind: "analogy",
          id: "analogy-llm-as-judge-referee",
          text: "Two runners race on one track. The referee stands at the left edge and watches the finish line. The referee calls the runner who crosses first. If the referee moves to the right edge, the call can change even when the runners do not. The referee is the judge, the race is a pairwise judgment, and the lane is the answer slot.",
          breaks:
            "A referee sees one race and one finish line. A judge reads two texts and has no clock, so it can prefer a fluent answer that arrives first in the prompt.",
        },
        {
          kind: "paragraph",
          id: "p-llm-as-judge-14",
          text: "This is position bias, because the slot decides the winner.",
        },
        {
          kind: "paragraph",
          id: "p-llm-as-judge-15",
          text: "If the referee always stands on the left and always picks the left lane, which bias does the race show: verbosity or position?",
        },
      ],
    },
    {
      id: "where-it-fails",
      title: "Where it fails",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "p-llm-as-judge-16",
          text: "A judge fails in four common ways. Each way has a cheap check and a fix.",
        },
        {
          kind: "table",
          id: "table-llm-as-judge-fails",
          columns: ["Symptom", "Cause", "Check", "Fix"],
          rows: [
            ["The winner flips when the order changes", "Position bias", "Run both orders on 20 pairs", "Count a win only when both orders agree"],
            ["The longer answer wins on equal facts", "Verbosity bias", "Compare length with the verdict on fixed pairs", "Add a length rule and a cap to the rubric"],
            ["Answers from one model family win", "Self bias", "Hide the author and mix model families", "Use a different judge or a human panel"],
            ["Scores move while quality stays flat", "Weak rubric", "Check agreement on 10 labeled cases", "Rewrite levels with concrete examples"],
          ],
          caption: "Four biases, each with one check.",
        },
        {
          kind: "paragraph",
          id: "p-llm-as-judge-17",
          text: "A judge is cheap and fast, but it needs a human audit, and that audit cost is part of the judge budget.",
        },
        {
          kind: "paragraph",
          id: "p-llm-as-judge-18",
          text: "Self bias is a preference for text from the judge's own model family. It needs a blind test. Remove the author name and run the same answers through a second judge family. A large gap between the two judges is a warning, not a proof.",
        },
        {
          kind: "paragraph",
          id: "p-llm-as-judge-19",
          text: "A weak rubric is the most common cause. Two people who read the same rubric and disagree show that the rubric is not ready. Fix the rubric before you change the model.",
        },
        {
          kind: "note",
          id: "note-llm-as-judge",
          text: "A judge is a measurement tool. A score from a judge without an audit is a guess with a decimal point.",
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
          id: "p-llm-as-judge-20",
          text: "Lesson 7 froze 41 triage cases. The team now adds a pairwise judge to compare two candidate support replies for each case. The rubric has two criteria: correct policy and clear next step. Each criterion has three levels.",
        },
        {
          kind: "paragraph",
          id: "p-llm-as-judge-21",
          text: "The judge prefers reply B on 34 of 41 cases. Reply B is longer in every case. On ticket 12, reply B states a 60-day refund window. The policy says 30 days. Reply A states the correct 30-day window and one next step.",
        },
        {
          kind: "paragraph",
          id: "p-llm-as-judge-22",
          text: "The trace shows the cause. The rubric gives one point for detail and no point for a correct fact. The judge reason says that reply B explains the policy in more detail. The order swap does not change the winner, so position bias is not the cause. The audit compares 10 verdicts with the human labels. The judge matches 4 of 10. The long wrong reply wins 8 of 10 times.",
        },
        {
          kind: "paragraph",
          id: "p-llm-as-judge-23",
          text: "The decision is to repair the evaluation layer, not the model. Add a correctness gate before the rubric: a wrong policy fact caps the score at the lowest level. Remove the detail point and replace it with a clear next step. Re-run both orders on all 41 cases. Then audit 10 fresh cases and report the new human agreement rate.",
        },
      ],
    },
    {
      id: "run-the-bias-lab",
      title: "Run the bias lab",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "p-llm-as-judge-24",
          text: "The lab holds two fixed support replies. A fixed judge always picks the first reply. Press the swap control and read the verdict line.",
        },
        {
          kind: "interactive",
          id: "interactive-llm-as-judge",
          widget: "judge-bias-lab",
          caption: "Swap two fixed answers and watch the verdict follow the first slot.",
        },
        {
          kind: "paragraph",
          id: "p-llm-as-judge-25",
          text: "Observe the verdict before the swap and after it. The same two answers change the winner, so the slot decides. This is position bias, and the swap test is the check.",
        },
      ],
    },
    {
      id: "check-yourself",
      title: "Check yourself",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "p-llm-as-judge-26",
          text: "Answer four checks. Each one tests one part of the judge pipeline.",
        },
        { kind: "check", id: "check-llm-as-judge-1", checkId: "check-1" },
        { kind: "check", id: "check-llm-as-judge-2", checkId: "check-2" },
        { kind: "check", id: "check-llm-as-judge-3", checkId: "check-3" },
        { kind: "check", id: "check-llm-as-judge-4", checkId: "check-4" },
      ],
    },
    {
      id: "evaluation-task",
      title: "Evaluation task",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "p-llm-as-judge-27",
          text: "The task uses ten fixed reply pairs from the billing slice. Each pair has a short reply, a long reply and a human label. The labels come from lesson 7 and do not change. Run the judge, swap the order, and compute two numbers.",
        },
        { kind: "task", id: "task-llm-as-judge" },
        {
          kind: "paragraph",
          id: "p-llm-as-judge-28",
          text: "The reference solution models the judge with the observed length rule, so the numbers repeat without a model call. It prints a position-flip rate of 0.00 and a human agreement rate of 0.40. A zero flip rate rules out position bias. The low agreement rate points to verbosity bias, because the judge picks the longer reply every time.",
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
          id: "p-llm-as-judge-29",
          text: "Write one sentence with the form: I changed X; the result was Y. Name the rubric rule and the two rates.",
        },
        {
          kind: "paragraph",
          id: "p-llm-as-judge-30",
          text: "The self-rubric has three points. Mechanism: does the note name the layer and the rule? Evidence: does it give a number or an order? Limit: does it name one blind spot or failed case?",
        },
        {
          kind: "paragraph",
          id: "p-llm-as-judge-31",
          text: "Example: I added a correctness gate and removed the detail point. The position-flip rate stayed at 0.00, and human agreement rose from 0.40 to 0.80 on ten audited pairs.",
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
          id: "interview-llm-as-judge",
          items: [
            {
              question: "What is an LLM-as-judge?",
              answer:
                "An LLM-as-judge is a language model that scores answers against a rubric or a reference. It sits in the evaluation layer and turns open answers into a repeatable score. The score is a measurement, not a label, so a human audit is part of the method.",
            },
            {
              question: "When do you choose pairwise judgment over pointwise judgment?",
              answer:
                "Choose pairwise judgment when a direct choice is easier than an absolute score, such as two drafts of one reply. It gives a stable winner and feeds an Elo rating. Use pointwise judgment when you need a score for one answer or a score per criterion. Pairwise judgment needs two calls per pair to control position bias.",
            },
            {
              question: "How does a judge fail, and what do you check?",
              answer:
                "A judge can favor the first slot, the longer answer or its own model family. Run both orders and compare the winners to catch position bias. Compare length with the verdict to catch verbosity bias. Hide the author and use a second judge family to catch self bias. Audit 20 labeled cases and report the human agreement rate.",
            },
            {
              question: "How does judge cost change at 10x traffic or tokens?",
              answer:
                "Cost grows with the number of judged pairs, the answer length and the number of orders. A pairwise judge needs two calls per pair, so 10,000 pairs cost 20,000 calls. Batch the calls and cache the rubric prefix to cut cost. At scale, judge a sample and use the audit to set a confidence interval.",
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
      prompt: "Which sentence defines pairwise judgment?",
      options: [
        { id: "option-a", label: "A judge scores each answer alone." },
        { id: "option-b", label: "A judge compares two answers and picks a winner." },
        { id: "option-c", label: "A judge writes a rubric for a person." },
        { id: "option-d", label: "A judge ranks the eval set by length." },
      ],
      correctOptionId: "option-b",
      explanation:
        "Pairwise judgment places two answers in one call and asks for a winner. A judge that scores one answer alone uses pointwise judgment, so option A names the other shape.",
    },
    {
      id: "check-2",
      kind: "apply",
      prompt: "A rubric gives one point for each sentence in an answer. Which bias does this rule invite?",
      options: [
        { id: "option-a", label: "Position bias" },
        { id: "option-b", label: "Verbosity bias" },
        { id: "option-c", label: "Self bias" },
        { id: "option-d", label: "No bias, because the rule is fixed" },
      ],
      correctOptionId: "option-b",
      explanation:
        "A reward for each sentence pays for length, not for quality, so the longer answer wins. A fixed rule can still carry bias, because the rule itself favors one trait.",
    },
    {
      id: "check-3",
      kind: "diagnose",
      prompt: "A judge picks answer A, then picks answer B after a swap of the same two answers. What is the likely cause?",
      options: [
        { id: "option-a", label: "Verbosity bias" },
        { id: "option-b", label: "Position bias" },
        { id: "option-c", label: "Self bias" },
        { id: "option-d", label: "A weak rubric" },
      ],
      correctOptionId: "option-b",
      explanation:
        "The verdict follows the slot, not the content, so the swap exposes position bias. Verbosity bias would follow the longer answer in both orders.",
    },
    {
      id: "check-4",
      kind: "calculate",
      prompt: "A judge matches 18 of 24 human labels. What is the human agreement rate?",
      options: [
        { id: "option-a", label: "0.60" },
        { id: "option-b", label: "0.70" },
        { id: "option-c", label: "0.75" },
        { id: "option-d", label: "0.80" },
      ],
      correctOptionId: "option-c",
      explanation:
        "18 divided by 24 is 0.75, or 75 percent agreement. A rate of 0.70 would need about 17 matches in 24 cases.",
    },
  ],
  task: {
    id: "task-llm-as-judge",
    scope: "Audit a pairwise triage judge on ten fixed reply pairs.",
    items: [
      {
        id: "item-1",
        label: "Choose pointwise or pairwise judgment for the ten pairs, and name the two rubric criteria.",
      },
      {
        id: "item-2",
        label: "Score the ten fixed pairs with the judge prompt and record each winner.",
      },
      {
        id: "item-3",
        label: "Swap each pair and record the winner a second time.",
      },
      {
        id: "item-4",
        label: "Compute the position-flip rate and the human agreement rate.",
      },
      {
        id: "item-5",
        label: "Repeat the audit on the password-reset slice and name one blind spot.",
      },
    ],
    solution: {
      filename: "judge/audit.py",
      language: "python",
      code: [
        "PAIRS = [",
        '    {"id": "p1", "short": "refunds close 30 days after delivery.",',
        '     "long": "refunds close 60 days after delivery. keep the box for a faster review.",',
        '     "label": "short"},',
        '    {"id": "p2", "short": "a return label is free and expires in 14 days.",',
        '     "long": "a return label is free for all returns and exchanges. the label expires after 14 days.",',
        '     "label": "short"},',
        '    {"id": "p3", "short": "late parcels ship again after the window closes.",',
        '     "long": "late parcels ship again after the window closes. the carrier sends a new tracking number.",',
        '     "label": "long"},',
        '    {"id": "p4", "short": "cancel an order before it ships.",',
        '     "long": "cancel an order at any time after it ships. the cancel fee is five dollars.",',
        '     "label": "short"},',
        '    {"id": "p5", "short": "customs fees depend on the destination.",',
        '     "long": "customs fees depend on the destination country. the carrier collects them at delivery.",',
        '     "label": "long"},',
        '    {"id": "p6", "short": "a refund takes five working days.",',
        '     "long": "a refund takes 30 working days. the bank posts it after the return arrives.",',
        '     "label": "short"},',
        '    {"id": "p7", "short": "start a return from the order page.",',
        '     "long": "start a return from the order page. choose a reason and print the label.",',
        '     "label": "long"},',
        '    {"id": "p8", "short": "the billing cycle starts on the first day.",',
        '     "long": "the billing cycle starts on the first day. the invoice arrives on the tenth day.",',
        '     "label": "long"},',
        '    {"id": "p9", "short": "a damaged item ships again for free.",',
        '     "long": "a damaged item ships again for free. send a photo with the return request.",',
        '     "label": "short"},',
        '    {"id": "p10", "short": "standard shipping takes three to five days.",',
        '     "long": "standard shipping takes three to five days. express shipping takes one to two days.",',
        '     "label": "short"},',
        "]",
        "",
        "",
        "def judge(pair: dict, first: str) -> str:",
        '    second = "long" if first == "short" else "short"',
        "    a, b = pair[first], pair[second]",
        '    return first if len(a.split()) > len(b.split()) else second',
        "",
        "",
        "flips = 0",
        "wins = 0",
        "for pair in PAIRS:",
        '    first_verdict = judge(pair, "short")',
        '    second_verdict = judge(pair, "long")',
        "    if first_verdict != second_verdict:",
        "        flips += 1",
        '    if first_verdict == pair["label"]:',
        "        wins += 1",
        "",
        "n = len(PAIRS)",
        'print(f"position flip rate: {flips / n:.2f}")',
        'print(f"human agreement: {wins / n:.2f}")',
        "",
        "# Transfer: run the same audit on the password-reset slice.",
        "# The reset replies are short, so the verbosity rule should lower agreement.",
      ].join("\n"),
    },
  },
  prove: {
    prompt: "Which rubric rule did you change, and how did the two rates move?",
    placeholder: "I changed X; the result was Y.",
    maxLength: 280,
    debounceMs: 800,
    savedMessage: "Proof saved on this device.",
  },
  citation:
    "Further reading on judges: AI Engineering by Chip Huyen (O'Reilly). This course is independent and reproduces no book text or figures.",
} as const satisfies Lesson);
