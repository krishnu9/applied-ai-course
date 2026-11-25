import type { Lesson } from "@/lib/types";
import { deepFreeze } from "../freeze";

export const modelSelectionLesson = deepFreeze({
  slug: "model-selection",
  order: 10,
  title: "Choose a model with evidence",
  chapterId: "ch-04",
  chapterOrder: 4,
  status: "live",
  outcome:
    "You can define model selection, compare benchmark and private evidence, and choose a model under hard limits. Prerequisite: lesson 9, criteria and rubrics.",
  artifact:
    "A runnable selection.py over five fixed models, with an Elo table, an interval and a frontier pick.",
  readingMinutes: 28,
  difficulty: "advanced",
  terms: [
    {
      term: "Model selection",
      definition:
        "The evidence-based choice of a model for a task under constraints.",
    },
    {
      term: "Benchmark",
      definition: "A public, fixed test set used to compare models.",
    },
    {
      term: "Contamination",
      definition:
        "Training data that overlaps the test set and inflates the score.",
    },
    {
      term: "Elo rating",
      definition: "A relative skill score updated from pairwise wins and losses.",
    },
    {
      term: "Confidence interval",
      definition:
        "The range that likely contains the true score, given sample noise.",
    },
    {
      term: "Cost-quality frontier",
      definition:
        "The set of models where no cheaper model gives the same quality.",
    },
  ],
  evalCase: {
    id: "case-model-selection",
    brief: "Pick a model under a cost limit, a p95 limit and a quality floor.",
  },
  sections: [
    {
      id: "what-it-is",
      title: "What it is",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "p-model-selection-1",
          text: "Model selection is the evidence-based choice of a model for a task under constraints. The evidence has four sources: a public benchmark, an arena of pairwise votes, a private eval set and a production pilot. The constraints are hard attributes such as cost, latency, license and data rules.",
        },
        {
          kind: "paragraph",
          id: "p-model-selection-2",
          text: "A worked example: five candidate models carry a benchmark score, a private score on 100 cases, a cost per 1k tokens and a p95 latency. The hard limits are a cost of 0.60 or less and a p95 of 1500 ms or less. The quality floor is 70 on the private set, and the choice must meet all three.",
        },
        {
          kind: "paragraph",
          id: "p-model-selection-3",
          text: "A non-example is the top model on a public leaderboard. That model can fail the task, the cost limit or the latency limit. A leaderboard ranks one benchmark, and your task is not that benchmark.",
        },
        {
          kind: "paragraph",
          id: "p-model-selection-4",
          text: "A hard attribute is a requirement that a model must meet, such as a license or a latency limit. A soft attribute is a preference that trades against other attributes, such as tone or cost. Filter on hard attributes first, then compare soft attributes on the cost-quality frontier.",
        },
        {
          kind: "paragraph",
          id: "p-model-selection-5",
          text: "A benchmark is a public, fixed test set used to compare models. It is cheap and broad, and it can leak into training data. A private eval set is small, specific and expensive to label. The two sources answer different questions, so read both.",
        },
      ],
    },
    {
      id: "eli5-buying-a-car",
      title: "Buying a car",
      register: "eli5",
      blocks: [
        {
          kind: "analogy",
          id: "analogy-model-selection-car",
          text: "Think of buying a car. A magazine rating says which car is fastest on a test track, and it ignores your garage, your fuel and your budget. A test drive shows the seat, the noise, the brake and the mirror, and it uses your own road. A monthly cost and an insurance quote set the limit before the first drive. The magazine is a benchmark, the test drive is a private eval, and the budget is a hard attribute.",
          breaks:
            "A car test drive uses the same road for every car, while a benchmark can leak into the model's training data and lift one score.",
        },
        {
          kind: "paragraph",
          id: "p-model-selection-6",
          text: "A car wins the magazine test and does not fit your garage. Which check decides, and which number is missing?",
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
          id: "p-model-selection-7",
          text: "The selection loop has seven steps. Each step removes one kind of false confidence.",
        },
        {
          kind: "list",
          id: "list-model-selection-steps",
          ordered: true,
          items: [
            "Write the task and the quality floor.",
            "List the hard attributes: license, context, cost, p95 and data rules.",
            "Shortlist the models that meet every hard attribute.",
            "Measure each shortlisted model on a private eval set.",
            "Check the public benchmark for contamination.",
            "Compare pairwise votes and update the Elo rating.",
            "Compute the interval and choose on the cost-quality frontier.",
          ],
        },
        {
          kind: "paragraph",
          id: "p-model-selection-8",
          text: "A benchmark is broad and cheap. It also hides the task, the prompt and the slice. A leaderboard is a public ranking on one or more benchmarks. One aggregate number can hide a slice where your task lives. Read the per-slice score before you trust the rank.",
        },
        {
          kind: "paragraph",
          id: "p-model-selection-9",
          text: "Contamination is training data that overlaps the test set. The model has seen the answer, so the benchmark score rises. Check shared n-grams, canary strings and a large gap between the benchmark and the private set. In the fixed data, alpha scores 88 on the benchmark and 78 on the private set, and a leak explains the 10-point gap.",
        },
        {
          kind: "paragraph",
          id: "p-model-selection-10",
          text: "An arena collects pairwise votes. A person sees two answers and picks a winner. An Elo rating is a relative skill score updated from wins and losses. The update is R plus K times S minus E, where S is 1 for a win and E is the expected score. With K at 32 and equal ratings, a win moves the winner by 16 points. After five fixed votes, beta holds 1211 and gamma holds 1189.",
        },
        {
          kind: "paragraph",
          id: "p-model-selection-11",
          text: "An arena has bias. A voter can favor the first slot, the longer answer or a familiar style. Run both orders and count a win only when both orders agree. A vote from one order is a preference, not a result. Hide the model name, and mix the model families.",
        },
        {
          kind: "paragraph",
          id: "p-model-selection-12",
          text: "A private score from 100 cases carries an interval. The Wilson interval for 71 of 100 runs from 0.61 to 0.79. The quality floor of 0.70 sits inside that interval, so the model may sit below the floor. More cases narrow the interval; the width falls with the square root of the count. About 400 cases halve the width.",
        },
        {
          kind: "paragraph",
          id: "p-model-selection-13",
          text: "A cost-quality frontier is the set of models where no cheaper model gives the same quality. Plot quality on one axis and cost on the other. Remove a dominated model, because another model matches its quality and beats its cost. Epsilon scores 74 at 0.80, and beta scores 76 at 0.71, so epsilon leaves the frontier. The frontier holds alpha, beta, gamma and delta.",
        },
        {
          kind: "paragraph",
          id: "p-model-selection-14",
          text: "Apply the hard attributes first. Alpha fails cost and p95. Beta fails cost. Epsilon fails cost and p95. Delta meets cost and p95 and misses the quality floor. Gamma is the only eligible model, at 0.31 per 1k tokens, a p95 of 900 ms and a private score of 71.",
        },
        {
          kind: "paragraph",
          id: "p-model-selection-15",
          text: "A hosted model API and a self-hosted open model enter the same table. A license is a hard attribute, not a soft one. A self-hosted model adds GPU, staff and upgrade cost to the table. Compare the total cost per 1k tokens, not the price list alone.",
        },
        {
          kind: "paragraph",
          id: "p-model-selection-15b",
          text: "A leaderboard aggregates many tasks. A model can win the average and lose the slice that your product uses. Read the per-task score, the prompt format and the sample size. A benchmark with 200 items has a wide interval, so a two-point lead can be noise.",
        },
        {
          kind: "paragraph",
          id: "p-model-selection-15c",
          text: "A pilot is the last evidence source. Send a small share of traffic to the chosen model and compare the online rate with the fallback. A pilot catches a prompt mismatch, a tool failure and a cost spike. Keep the fallback warm, and define the switch rule before the pilot.",
        },
        {
          kind: "table",
          id: "table-model-selection-evidence",
          columns: ["Evidence", "Strength", "Blind spot"],
          rows: [
            ["Benchmark", "Broad and cheap", "Contamination and task mismatch"],
            ["Arena", "Real pairwise preference", "Position and style bias"],
            ["Private eval", "Task-specific", "Small samples and label cost"],
            ["Cost and p95", "Hard limit", "Misses quality"],
            ["Pilot", "Real traffic", "Slow and noisy"],
          ],
          caption: "Inputs and blind spots of five evidence sources.",
        },
        {
          kind: "diagram",
          id: "diagram-model-selection",
          variant: "bars",
          spec: {
            nodes: [
              { id: "alpha", label: "Alpha", value: 78, unit: "pts" },
              { id: "beta", label: "Beta", value: 76, unit: "pts" },
              { id: "epsilon", label: "Epsilon", value: 74, unit: "pts" },
              { id: "gamma", label: "Gamma", value: 71, unit: "pts" },
              { id: "delta", label: "Delta", value: 64, unit: "pts" },
            ],
            edges: [
              ["alpha", "beta"],
              ["beta", "epsilon"],
              ["epsilon", "gamma"],
              ["gamma", "delta"],
            ],
          },
          caption:
            "Private quality ranks alpha first and delta last; gamma clears the 70-point floor.",
          alt: "Bars from alpha at 78 quality points down to delta at 64, with gamma on the 70-point floor.",
        },
      ],
    },
    {
      id: "eli5-a-league-table",
      title: "A league table",
      register: "eli5",
      blocks: [
        {
          kind: "analogy",
          id: "analogy-model-selection-league",
          text: "Think of a sports league table. Each match gives the winner points, and the table ranks the teams. A team with an easy schedule can win more matches than a stronger team. A team that plays weak opponents can lead the table without the best players. A table from ten matches has a wide range, and a table from a full season is tight.",
          breaks:
            "A league plays a fixed season against every team, while an arena samples prompts and voters unevenly and counts each pair once in one order.",
        },
        {
          kind: "paragraph",
          id: "p-model-selection-16",
          text: "A team leads after three matches. Do you trust the table? Which number is missing, and which check would you run?",
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
          id: "table-model-selection-fails",
          columns: ["Symptom", "Cause", "Check", "Fix"],
          rows: [
            [
              "The leaderboard winner fails your eval",
              "The benchmark does not match the task",
              "Run the private set",
              "Select on the private score",
            ],
            [
              "A benchmark score jumps after a model update",
              "The test data leaked into training",
              "Check n-gram overlap and the private gap",
              "Drop the leaked items",
            ],
            [
              "Arena votes favor one slot",
              "Position bias",
              "Run both orders on 20 pairs",
              "Count a win only when both orders agree",
            ],
            [
              "The chosen model crosses the cost limit at scale",
              "Cost was a soft weight",
              "Compute cost per 1k at peak",
              "Make cost a hard attribute",
            ],
          ],
          caption: "Four failures between a leaderboard and a launch.",
        },
        {
          kind: "paragraph",
          id: "p-model-selection-17",
          text: "A higher-quality model buys a better score and costs more per token; the frontier shows the models that avoid that trade.",
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
          id: "p-model-selection-18",
          text: "Five models enter the table. The hard limits are a cost of 0.60 per 1k tokens and a p95 of 1500 ms. The quality floor is 70 on 100 private cases.",
        },
        {
          kind: "paragraph",
          id: "p-model-selection-19",
          text: "The trace shows the leaderboard trap. Beta tops the adjusted benchmark at 84. Alpha scores 88, but 10 benchmark items appear in its training log, so the adjusted score is 78. Epsilon ranks second on the benchmark and third on the private set. The private order is alpha 78, beta 76, epsilon 74, gamma 71, delta 64.",
        },
        {
          kind: "paragraph",
          id: "p-model-selection-20",
          text: "The hard filter removes alpha, beta and epsilon. Delta is cheap and fast and misses the floor. Gamma is the only eligible model. Gamma's interval runs from 0.61 to 0.79, so the floor sits inside the interval. The decision is to choose gamma, keep beta as the fallback, and pilot gamma on 200 fresh cases. The pilot narrows the interval before the full launch.",
        },
      ],
    },
    {
      id: "run-the-arena",
      title: "Run the arena",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "p-model-selection-21",
          text: "The lab starts two models at 1200. Each vote moves both ratings with K equal to 32. Vote for Model Alpha five times and watch the gap grow. Then vote for Model Beta and watch the gap shrink. Try this: give one model five votes in a row, and read the new ratings.",
        },
        {
          kind: "interactive",
          id: "interactive-model-selection",
          widget: "arena-lab",
          caption:
            "Vote for one model and watch both Elo ratings move; the first vote on an even pair moves the winner by 16.",
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
          id: "p-model-selection-22",
          text: "Answer six questions on the frontier, the filter, contamination, Elo and the interval.",
        },
        { kind: "check", id: "check-model-selection-1", checkId: "check-1" },
        { kind: "check", id: "check-model-selection-2", checkId: "check-2" },
        { kind: "check", id: "check-model-selection-3", checkId: "check-3" },
        { kind: "check", id: "check-model-selection-4", checkId: "check-4" },
        { kind: "check", id: "check-model-selection-5", checkId: "check-5" },
        { kind: "check", id: "check-model-selection-6", checkId: "check-6" },
      ],
    },
    {
      id: "evaluation-task",
      title: "Evaluation task",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "p-model-selection-23",
          text: "Use the five fixed models, the three hard limits and the five fixed votes. Build one script that prints the private order, the adjusted benchmark, the frontier, the Elo table, the interval and the pick. Tick each step when its output is visible.",
        },
        { kind: "task", id: "task-model-selection" },
        {
          kind: "paragraph",
          id: "p-model-selection-24",
          text: "The run prints private alpha 78, beta 76, epsilon 74, gamma 71, delta 64. The adjusted benchmark ranks beta 84 first and moves alpha from 88 to 78. Epsilon is dominated by beta. Five votes leave beta at 1211 and gamma at 1189. Gamma's interval runs from 0.61 to 0.79, and the 0.70 floor sits inside it. The eligible model is gamma.",
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
          id: "p-model-selection-25",
          text: "Write one sentence with the form: I changed X; the result was Y. Name the evidence source, the limit and the two numbers.",
        },
        {
          kind: "paragraph",
          id: "p-model-selection-26",
          text: "Self-rubric: mechanism names the layer and the rule; evidence gives a fixed number or order; limit names one blind spot or failed case.",
        },
        {
          kind: "note",
          id: "note-model-selection-1",
          text: "A leaderboard is a menu, not a decision.",
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
          id: "interview-model-selection",
          items: [
            {
              question: "What is model selection?",
              answer:
                "Model selection is the evidence-based choice of a model for a task under constraints. It combines hard attributes such as cost, p95 and license with soft attributes such as tone. The evidence includes a benchmark, an arena, a private eval and a pilot. The output is one model, one fallback and a stated limit.",
            },
            {
              question: "When do you choose a private eval over a public benchmark?",
              answer:
                "Choose the private eval when the task, the prompt or the slice differs from the benchmark. A private set of 100 cases costs labelling time and measures the real task. Use the benchmark for a broad shortlist and a contamination check. Select on the private score and report both numbers.",
            },
            {
              question: "How does contaminated evidence fail, and what do you check?",
              answer:
                "Contamination raises a benchmark score because the model has seen the answers. Check n-gram overlap, canary strings and the gap to the private set. Alpha scores 88 on the benchmark and 78 on the private set, so the 10-point gap is a warning. Remove the leaked items and rerun before you rank.",
            },
            {
              question: "How does selection change at 10x traffic or cost pressure?",
              answer:
                "At 10x traffic, cost per 1k and p95 move from soft preferences to hard limits. Recompute the frontier at peak price, because a cheap model can cross the limit at scale. At 10x cases, the private interval narrows and a pilot becomes cheap enough to run. Keep a fallback model warm, and record the switch rule.",
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
      prompt: "Which sentence defines the cost-quality frontier?",
      options: [
        { id: "option-a", label: "The set of models where no cheaper model gives the same quality" },
        { id: "option-b", label: "The model with the highest benchmark score" },
        { id: "option-c", label: "The model with the lowest price" },
        { id: "option-d", label: "Every model that passes the license check" },
      ],
      correctOptionId: "option-a",
      explanation:
        "The frontier keeps the models that are not dominated on quality and cost. The highest benchmark score ignores cost, and the lowest price ignores quality.",
    },
    {
      id: "check-2",
      kind: "apply",
      prompt:
        "A model tops the benchmark and has a p95 of 3000 ms against a 1500 ms limit. What do you do?",
      options: [
        { id: "option-a", label: "Pick it, because quality leads" },
        { id: "option-b", label: "Remove it on the hard attribute" },
        { id: "option-c", label: "Lower the benchmark weight" },
        { id: "option-d", label: "Run more arena votes" },
      ],
      correctOptionId: "option-b",
      explanation:
        "A p95 of 3000 ms breaks a hard limit, so the model cannot ship whatever its score. A soft weight or more votes cannot repair a hard attribute.",
    },
    {
      id: "check-3",
      kind: "diagnose",
      prompt:
        "A benchmark score sits 10 points above the private score. What is the likely cause?",
      options: [
        { id: "option-a", label: "The private set is too easy" },
        { id: "option-b", label: "Contamination or a task mismatch" },
        { id: "option-c", label: "The Elo factor is too high" },
        { id: "option-d", label: "The cost limit is too low" },
      ],
      correctOptionId: "option-b",
      explanation:
        "A large benchmark lead can come from leaked test items or from a task that differs from yours. The private set is the task-specific check, so it is not the cause by default.",
    },
    {
      id: "check-4",
      kind: "calculate",
      prompt:
        "Two models start at 1200 Elo. K is 32. Model A wins one vote. What are the ratings?",
      options: [
        { id: "option-a", label: "A 1216, B 1184" },
        { id: "option-b", label: "A 1232, B 1168" },
        { id: "option-c", label: "A 1200, B 1200" },
        { id: "option-d", label: "A 1184, B 1216" },
      ],
      correctOptionId: "option-a",
      explanation:
        "With equal ratings the expected score is 0.5, so the winner gains 32 times 0.5, or 16 points. A gain of 32 would skip the expected-score term.",
    },
    {
      id: "check-5",
      kind: "calculate",
      prompt:
        "A private score is 71 of 100. Which 95 percent interval fits the fixed data?",
      options: [
        { id: "option-a", label: "0.41 to 0.59" },
        { id: "option-b", label: "0.61 to 0.79" },
        { id: "option-c", label: "0.70 to 0.72" },
        { id: "option-d", label: "0.90 to 0.99" },
      ],
      correctOptionId: "option-b",
      explanation:
        "The Wilson interval for 71 of 100 runs from 0.61 to 0.79, so the floor of 0.70 sits inside it. A range of 0.70 to 0.72 needs far more than 100 cases.",
    },
    {
      id: "check-6",
      kind: "apply",
      prompt:
        "Epsilon scores 74 at 0.80. Beta scores 76 at 0.71. What does the frontier do with Epsilon?",
      options: [
        { id: "option-a", label: "Keep it, because 74 is close to 76" },
        { id: "option-b", label: "Remove it, because Beta is better and cheaper" },
        { id: "option-c", label: "Keep it, because it has more votes" },
        { id: "option-d", label: "Remove Beta, because 76 is close to 74" },
      ],
      correctOptionId: "option-b",
      explanation:
        "Beta gives more quality at a lower cost, so Epsilon is dominated. A model stays on the frontier only when no other model beats it on both axes.",
    },
  ],
  task: {
    id: "task-model-selection",
    scope:
      "Choose a model under the fixed cost, p95 and quality limits, with interval evidence.",
    items: [
      {
        id: "item-1",
        label: "List the hard attributes, the quality floor and the soft attributes.",
      },
      {
        id: "item-2",
        label: "Compare the benchmark order with the private order and flag the leak.",
      },
      {
        id: "item-3",
        label: "Update the Elo rating from the five fixed votes.",
      },
      {
        id: "item-4",
        label: "Compute gamma's interval and test the quality floor.",
      },
      {
        id: "item-5",
        label: "Choose a model, name the frontier and name the fallback.",
      },
    ],
    solution: {
      filename: "eval/selection.py",
      language: "python",
      code: [
        "import math",
        "",
        "MODELS = [",
        '    {"name": "alpha", "benchmark": 88, "private": 78, "cost": 0.94, "p95": 2400, "leak": True},',
        '    {"name": "beta", "benchmark": 84, "private": 76, "cost": 0.71, "p95": 1400, "leak": False},',
        '    {"name": "gamma", "benchmark": 79, "private": 71, "cost": 0.31, "p95": 900, "leak": False},',
        '    {"name": "delta", "benchmark": 72, "private": 64, "cost": 0.15, "p95": 700, "leak": False},',
        '    {"name": "epsilon", "benchmark": 81, "private": 74, "cost": 0.80, "p95": 1600, "leak": False},',
        "]",
        "",
        "COST_LIMIT = 0.60",
        "P95_LIMIT = 1500",
        "QUALITY_FLOOR = 70",
        "N_CASES = 100",
        "",
        "",
        "def adjusted(model):",
        '    return model["private"] if model["leak"] else model["benchmark"]',
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
        "def dominated(model, models):",
        "    for other in models:",
        "        if other is model:",
        "            continue",
        '        better = other["private"] >= model["private"] and other["cost"] <= model["cost"]',
        '        strict = other["private"] > model["private"] or other["cost"] < model["cost"]',
        "        if better and strict:",
        '            return other["name"]',
        "    return None",
        "",
        "",
        "def elo(votes, k=32, start=1200):",
        '    ratings = {"beta": start, "gamma": start}',
        "    for winner in votes:",
        '        loser = "gamma" if winner == "beta" else "beta"',
        "        expected = 1 / (1 + 10 ** ((ratings[loser] - ratings[winner]) / 400))",
        "        delta = k * (1 - expected)",
        "        ratings[winner] = round(ratings[winner] + delta, 1)",
        "        ratings[loser] = round(ratings[loser] - delta, 1)",
        "    return ratings",
        "",
        "",
        'print("private order")',
        'for model in sorted(MODELS, key=lambda m: -m["private"]):',
        '    print(f"  {model[\'name\']} {model[\'private\']}/{N_CASES}")',
        'print("benchmark order")',
        'for model in sorted(MODELS, key=lambda m: -adjusted(m)):',
        '    tag = " adjusted" if model["leak"] else ""',
        '    print(f"  {model[\'name\']} {adjusted(model)}{tag}")',
        'print("frontier")',
        "for model in MODELS:",
        "    loser = dominated(model, MODELS)",
        '    state = f"dominated by {loser}" if loser else "frontier"',
        '    print(f"  {model[\'name\']} {state}")',
        'votes = ["beta", "beta", "gamma", "gamma", "beta"]',
        "ratings = elo(votes)",
        'print(f"elo beta {ratings[\'beta\']:.0f} gamma {ratings[\'gamma\']:.0f}")',
        "low, high = wilson(71, N_CASES)",
        'print(f"gamma interval {low:.2f} to {high:.2f}, floor {QUALITY_FLOOR / 100:.2f}")',
        "eligible = [",
        "    model for model in MODELS",
        '    if model["cost"] <= COST_LIMIT',
        '    and model["p95"] <= P95_LIMIT',
        '    and model["private"] >= QUALITY_FLOOR',
        "]",
        'print(f"eligible {\', \'.join(model[\'name\'] for model in eligible) or \'none\'}")',
      ].join("\n"),
    },
  },
  prove: {
    prompt: "Which model did you choose, and which evidence decided?",
    placeholder: "I changed X; the result was Y.",
    maxLength: 280,
    debounceMs: 800,
    savedMessage: "Proof saved on this device.",
  },
  citation:
    "Further reading: AI Engineering by Chip Huyen (O'Reilly). This course is independent and reproduces no book text or figures.",
} as const satisfies Lesson);
