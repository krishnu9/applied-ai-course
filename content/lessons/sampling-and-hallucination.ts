import type { Lesson } from "@/lib/types";
import { deepFreeze } from "../freeze";

export const samplingAndHallucinationLesson = deepFreeze({
  slug: "sampling-and-hallucination",
  order: 5,
  title: "Why the model varies and why it invents",
  chapterId: "ch-02",
  chapterOrder: 2,
  status: "live",
  outcome:
    "You can set temperature and top-p, explain a non-deterministic run, and diagnose a hallucination. Prerequisite: lesson 4, post-training.",
  artifact: "A runnable sample.py that samples a fixed distribution and measures a false claim.",
  readingMinutes: 23,
  difficulty: "core",
  terms: [
    {
      term: "Temperature",
      definition:
        "A sampling setting that scales logits; low values sharpen and high values flatten the distribution.",
    },
    {
      term: "Top-p (nucleus sampling)",
      definition: "Sampling from the smallest token set whose probability sums to p.",
    },
    {
      term: "Greedy decoding",
      definition: "The choice of the single most likely token at each step.",
    },
    {
      term: "Seed",
      definition: "A value that fixes the random stream so a run can repeat.",
    },
    {
      term: "Non-determinism",
      definition:
        "Output variation across runs with the same input, from sampling or from hardware.",
    },
    {
      term: "Hallucination",
      definition: "A fluent answer that is false or unsupported by the given evidence.",
    },
  ],
  evalCase: {
    id: "case-sampling-and-hallucination",
    brief: "Diagnose a confident wrong refund answer in one trace.",
  },
  sections: [
    {
      id: "outcome-and-prerequisites",
      title: "Outcome and prerequisites",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "sampling-p-1",
          text: "You can set temperature and top-p, explain a non-deterministic run, and diagnose a hallucination. You need lesson 4 on post-training. The task uses a fixed distribution and a fixed seed.",
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
          id: "sampling-p-2",
          text: "Temperature is a sampling setting that scales logits. A low value sharpens the distribution, and a high value flattens it. Top-p samples from the smallest token set whose probability sums to p. Greedy decoding takes the single most likely token at each step.",
        },
        {
          kind: "paragraph",
          id: "sampling-p-3",
          text: "A seed fixes the random stream so a run can repeat. Non-determinism is output variation across runs with the same input, from sampling or from hardware. Hallucination is a fluent answer that is false or unsupported by the given evidence.",
        },
        {
          kind: "paragraph",
          id: "sampling-p-4",
          text: "A worked example is a price question. The next token has probability 0.6 for 30 and 0.2 for 60. At temperature 0.2, 30 wins almost every run. At 1.2, the choices are close, and a run can write 60.",
        },
        {
          kind: "paragraph",
          id: "sampling-p-5",
          text: "A non-example is a retrieval miss. The correct document exists and the ranker did not return it, so the model has no evidence. A hallucination needs a fluent answer that the evidence does not support.",
        },
      ],
    },
    {
      id: "eli5-weighted-dice",
      title: "A weighted die",
      register: "eli5",
      blocks: [
        {
          kind: "analogy",
          id: "sampling-analogy-1",
          text: "Think of a die with weighted faces. A low weight on a face makes it rare, and a high weight makes it common. You roll the die, write the face, and roll again for the next word. Temperature changes the weights, and the seed sets the roll order.",
          breaks:
            "Where it breaks: a die has six known faces, while a model chooses among tens of thousands of tokens and can pick a false fact.",
        },
        {
          kind: "paragraph",
          id: "sampling-p-6a",
          text: "The die is fair only if you know the weights. The model learns the weights from text, so a common phrase has a large weight.",
        },
        {
          kind: "paragraph",
          id: "sampling-p-6",
          text: "Prediction: you flatten the weights until every face is equal. Does the next word become more predictable or less predictable?",
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
          id: "sampling-p-7",
          text: "Sampling turns a logit vector into one token. The settings change the distribution before the choice.",
        },
        {
          kind: "list",
          id: "sampling-list-1",
          ordered: true,
          items: [
            "The model outputs one logit for each token.",
            "Temperature divides the logits, and softmax makes a distribution.",
            "Top-p keeps the smallest set whose probability sums to p.",
            "A seeded random stream picks one token from the set.",
            "The token appends to the context, and the loop repeats.",
            "A grounding check compares each claim with the evidence.",
          ],
        },
        {
          kind: "paragraph",
          id: "sampling-p-8",
          text: "Temperature divides each logit before softmax. Below 1 sharpens the distribution; above 1 flattens it. At temperature 0 the model takes the top token. A high value raises variety and wrong answers.",
        },
        {
          kind: "paragraph",
          id: "sampling-p-9",
          text: "Top-p cuts the tail. Sort by probability, keep the smallest set that reaches p, and renormalize. Top-k keeps the k most likely tokens. With p = 0.9, the model ignores the rare tail. A low p or a small k narrows the set.",
        },
        {
          kind: "paragraph",
          id: "sampling-p-10",
          text: "A seed fixes the random stream for one run. It does not fix the hardware or a model version change. Floating-point sums can differ across hardware, so a temperature-0 run can still vary. Record the seed and the model version.",
        },
        {
          kind: "paragraph",
          id: "sampling-p-11",
          text: "A hallucination has three common causes. The model has no fact, the prompt is ambiguous, or the evidence is missing. Sampling adds variation, and a low temperature does not add a missing fact. Grounding a claim in retrieved text removes many false facts.",
        },
        {
          kind: "paragraph",
          id: "sampling-p-12",
          text: "Detection has two levels. A claim check compares each fact with a trusted source. A consistency check samples several answers and looks for disagreement. Neither check proves truth. Mitigation grounds the answer, lowers the temperature, and asks for a citation per claim.",
        },
        {
          kind: "paragraph",
          id: "sampling-p-12b",
          text: "Test-time compute spends more inference calls to raise accuracy. Best-of-N samples N answers and returns the best one. A verifier ranks the candidates. Self-consistency samples several reasoning paths and takes the majority answer. A logprob rule picks the candidate with the highest mean token logprob. Cost grows with N, so a small N and a cheap verifier help.",
        },
        {
          kind: "table",
          id: "sampling-table-1",
          columns: ["Setting", "Effect", "Use for"],
          rows: [
            ["Greedy, temperature 0", "Picks the top token", "Extraction and labels"],
            ["Low temperature, 0.2", "Sharpens the distribution", "Factual answers"],
            ["Top-p, 0.9", "Cuts the tail", "General chat"],
            ["Top-k, 40", "Keeps the top k tokens", "Narrow choices"],
            ["High temperature, 1.2", "Flattens the distribution", "Brainstorming"],
            ["Best-of-N or self-consistency", "Samples several answers and votes or verifies", "Hard questions"],
          ],
          caption: "One setting, one effect and one use.",
        },
        {
          kind: "diagram",
          id: "sampling-diagram-1",
          variant: "matrix",
          spec: {
            nodes: [
              { id: "gap", label: "Knowledge gap" },
              { id: "evidence", label: "Missing evidence" },
              { id: "prompt", label: "Ambiguous prompt" },
              { id: "noise", label: "Sampling noise" },
            ],
            edges: [
              ["gap", "evidence"],
              ["evidence", "prompt"],
              ["prompt", "noise"],
            ],
            matrix: {
              rows: ["Knowledge gap", "Missing evidence", "Ambiguous prompt", "Sampling noise"],
              columns: ["Wrong fact", "Contradiction", "Varies by run", "Cites nothing"],
              filled: [
                [0, 0],
                [0, 3],
                [1, 0],
                [1, 3],
                [2, 1],
                [2, 2],
                [3, 2],
                [3, 3],
              ],
            },
          },
          caption:
            "A knowledge gap gives a wrong fact with no citation; sampling noise gives variation across runs.",
          alt: "Matrix of four hallucination causes against four symptoms, with a filled cell for each usual pair.",
        },
      ],
    },
    {
      id: "eli5-an-exam-question",
      title: "An exam question",
      register: "eli5",
      blocks: [
        {
          kind: "analogy",
          id: "sampling-analogy-2",
          text: "Think of a student who did not study one topic. The student writes a confident paragraph from general knowledge and fills the gap with a plausible number. The paragraph reads well, and the number is wrong. The student is the model, the missing topic is the knowledge gap, and the confident number is the hallucination.",
          breaks:
            "Where it breaks: a student can leave a question blank, while a language model almost always writes a fluent answer.",
        },
        {
          kind: "paragraph",
          id: "sampling-p-13a",
          text: "The student needs the rule sheet, because more general study does not supply a local rule. The model needs the same sheet, and the sheet is the evidence.",
        },
        {
          kind: "paragraph",
          id: "sampling-p-13",
          text: "Prediction: the student studied the topic but the exam asks about a local rule. Does more study fix the answer, or does the student need the rule sheet?",
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
          id: "sampling-p-14",
          text: "A hallucination and a sampling fault look similar in one reply. The trace separates them.",
        },
        {
          kind: "table",
          id: "sampling-table-2",
          columns: ["Symptom", "Cause", "Check", "Fix"],
          rows: [
            [
              "The answer states a 60-day warranty",
              "The model has no policy fact",
              "Compare the claim with the policy text",
              "Add the policy to the context and require a citation",
            ],
            [
              "The answer cites a document that does not exist",
              "The model invents a source",
              "Check each cited id against the index",
              "Reject a reply with an unknown id",
            ],
            [
              "Two runs give two different labels",
              "The sampling setting allows variation",
              "Repeat the run with a fixed seed",
              "Set temperature 0 for extraction",
            ],
            [
              "The answer is right and the fact check flags it",
              "The check trusts a stale source",
              "Compare the check source with the policy date",
              "Version the check source",
            ],
          ],
          caption: "Four faults, each with one check.",
        },
        {
          kind: "paragraph",
          id: "sampling-p-15",
          text: "A low temperature raises consistency and can lock in a wrong answer. Grounding and a claim check raise truth and add latency. The eval decides which cost is smaller.",
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
          id: "sampling-p-16",
          text: "The support assistant answers a refund question with 60 days. The policy says 30 days. The trace shows no policy text, a temperature of 0.9, and three different answers in four runs. The model cites doc-99, which does not exist.",
        },
        {
          kind: "paragraph",
          id: "sampling-p-17",
          text: "Three faults share one trace. The missing policy text is the main cause of the false fact. The high temperature explains the variation. The invented citation is a separate fluency fault. Lowering the temperature alone would make the wrong answer stable.",
        },
        {
          kind: "paragraph",
          id: "sampling-p-18",
          text: "The decision is to ground the answer, then set the sampling. Add the policy document and require a citation id from the index. Set temperature 0.2 and top-p 0.9 for extraction. Re-run the four samples. The false claim falls from 2 of 4 to 0 of 4, and the answers agree.",
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
          id: "sampling-p-19",
          text: "Answer six questions on the setting, the choice, the variation, the cause and test-time compute.",
        },
        { kind: "check", id: "sampling-check-1", checkId: "check-1" },
        { kind: "check", id: "sampling-check-2", checkId: "check-2" },
        { kind: "check", id: "sampling-check-3", checkId: "check-3" },
        { kind: "check", id: "sampling-check-4", checkId: "check-4" },
        { kind: "check", id: "sampling-check-5", checkId: "check-5" },
        { kind: "check", id: "sampling-check-6", checkId: "check-6" },
      ],
    },
    {
      id: "evaluation-task",
      title: "Evaluation task",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "sampling-p-20",
          text: "Build one script on the fixed distribution and seed 7. Sample four runs at temperature 1.0 and four at 0.2, then add a grounding check. At 1.0, one of four samples writes 60. At 0.2, zero of four write 60. The check catches the false claim and writes 30. A second run with seed 7 repeats the four samples.",
        },
        { kind: "task", id: "task-sampling-and-hallucination" },
      ],
    },
    {
      id: "prove-the-change",
      title: "Prove the change",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "sampling-p-21",
          text: "Write one sentence with the form: I changed X; the result was Y. Name the setting, the seed and the false-claim count.",
        },
        {
          kind: "paragraph",
          id: "sampling-p-22",
          text: "Self-rubric: mechanism names the setting and the cause; evidence gives a fixed run count; limit names one unsupported case.",
        },
        {
          kind: "note",
          id: "sampling-note-1",
          text: "A lower temperature makes an answer stable, not true.",
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
          id: "sampling-interview-1",
          items: [
            {
              question: "What is temperature, and what does top-p do?",
              answer:
                "Temperature divides the logits before softmax, so a low value sharpens the distribution and a high value flattens it. Top-p keeps the smallest token set whose probability sums to p and samples inside that set. Together with top-k, they trade variety for control, and a fixed seed still keeps one eval run repeatable.",
            },
            {
              question: "When do you set temperature to zero?",
              answer:
                "Set temperature to zero for extraction, labels and any task with one correct shape. Greedy decoding removes sampling variation and makes the eval repeatable. It cannot remove hardware variation or a missing fact, so ground the answer too.",
            },
            {
              question: "How does a model hallucinate, and what do you check?",
              answer:
                "A hallucination comes from a missing fact, a missing evidence document or an ambiguous prompt. Check each claim against a trusted source and each citation against the index. Add the evidence to the context and lower the temperature for extraction.",
            },
            {
              question: "How does sampling change cost at 10x traffic?",
              answer:
                "Sampling itself adds no tokens, so 10x traffic costs about 10x in decode tokens. Self-consistency and best-of-N multiply the calls, because they sample several answers. Budget the extra calls against the quality gain, and cache the shared prefix.",
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
      prompt: "Which sentence defines temperature?",
      options: [
        { id: "option-a", label: "A setting that scales logits before softmax." },
        { id: "option-b", label: "A setting that cuts the least likely tokens." },
        { id: "option-c", label: "A value that fixes the random stream." },
        { id: "option-d", label: "A check that compares a fact with a source." },
      ],
      correctOptionId: "option-a",
      explanation:
        "Temperature divides the logits, so it sharpens or flattens the distribution before the sample. The tail cut belongs to top-p, and the random stream belongs to the seed.",
    },
    {
      id: "check-2",
      kind: "apply",
      prompt:
        "A task must return one fixed label for the same input on every run. Which setting fits?",
      options: [
        { id: "option-a", label: "Temperature 1.2 with top-p 0.9" },
        { id: "option-b", label: "Temperature 0, greedy decoding" },
        { id: "option-c", label: "A random seed with no temperature" },
        { id: "option-d", label: "Temperature 0.9 with a new seed each run" },
      ],
      correctOptionId: "option-b",
      explanation:
        "Greedy decoding takes the top token at each step, so sampling adds no variation. A high temperature and a new seed both raise variation, which a fixed label cannot accept.",
    },
    {
      id: "check-3",
      kind: "diagnose",
      prompt:
        "A fixed seed and temperature 0 still give two different labels across two GPU types. What is the likely cause?",
      options: [
        { id: "option-a", label: "The seed is too large" },
        { id: "option-b", label: "Hardware non-determinism in floating-point sums" },
        { id: "option-c", label: "Top-p is set to 1.0" },
        { id: "option-d", label: "The vocabulary is too small" },
      ],
      correctOptionId: "option-b",
      explanation:
        "Different hardware shapes can sum floating-point values in a different order, so the top token can change. A seed fixes the random stream, and it does not control the arithmetic on the device.",
    },
    {
      id: "check-4",
      kind: "calculate",
      prompt:
        "Two tokens have probabilities 0.6 and 0.2. Top-p is 0.5. How many tokens does the kept set hold?",
      options: [
        { id: "option-a", label: "0 tokens" },
        { id: "option-b", label: "1 token" },
        { id: "option-c", label: "2 tokens" },
        { id: "option-d", label: "3 tokens" },
      ],
      correctOptionId: "option-b",
      explanation:
        "Top-p keeps the smallest set whose probability reaches 0.5, and the first token alone reaches 0.6. A second token is unnecessary, so the set holds only the top token.",
    },
    {
      id: "check-5",
      kind: "diagnose",
      prompt:
        "A fluent reply cites doc-99, and the index holds no doc-99. Which fault is this?",
      options: [
        { id: "option-a", label: "A retrieval miss" },
        { id: "option-b", label: "An invented citation" },
        { id: "option-c", label: "A low-temperature fault" },
        { id: "option-d", label: "A tokenizer fault" },
      ],
      correctOptionId: "option-b",
      explanation:
        "The model wrote a source id that does not exist, so the citation is invented. A retrieval miss would return a real document, and the answer would cite that real id.",
    },
    {
      id: "check-6",
      kind: "calculate",
      prompt:
        "A team samples 8 answers and a verifier keeps one. How does the model-call cost compare with one greedy run?",
      options: [
        { id: "option-a", label: "About 8 times higher" },
        { id: "option-b", label: "About the same" },
        { id: "option-c", label: "About 1/8 as high" },
        { id: "option-d", label: "Zero, because the verifier runs in code" },
      ],
      correctOptionId: "option-a",
      explanation:
        "Best-of-N makes N model calls, so 8 samples cost about 8 times one run. A verifier adds its own cost, and it does not remove the extra samples.",
    },
  ],
  task: {
    id: "task-sampling-and-hallucination",
    scope:
      "Sample a fixed distribution at two temperatures, catch a false claim, and test seed repeatability.",
    items: [
      {
        id: "item-1",
        label: "Write the fixed distribution and the one supported fact.",
      },
      {
        id: "item-2",
        label: "Sample four runs at temperature 1.0 and count the false claims.",
      },
      {
        id: "item-3",
        label: "Sample four runs at temperature 0.2 and count the false claims.",
      },
      {
        id: "item-4",
        label: "Add the grounding check and report the caught claim.",
      },
      {
        id: "item-5",
        label: "Show that seed 7 repeats, then apply the rule to the held distribution.",
      },
    ],
    solution: {
      filename: "sampling/sample.py",
      language: "python",
      code: [
        "import random",
        "",
        'DIST = {"30": 0.55, "60": 0.25, "14": 0.12, "90": 0.08}',
        'SUPPORTED = {"30"}',
        "SEED = 7",
        "RUNS = 4",
        "",
        'print("dist " + " ".join(f"{token}:{p:.2f}" for token, p in DIST.items()))',
        'print("supported " + " ".join(sorted(SUPPORTED)))',
        "print()",
        "",
        "",
        "def sharpen(dist, temperature):",
        "    weights = {token: p ** (1.0 / temperature) for token, p in dist.items()}",
        "    total = sum(weights.values())",
        "    return {token: w / total for token, w in weights.items()}",
        "",
        "",
        "def sample(dist, seed, runs):",
        "    rng = random.Random(seed)",
        "    out = []",
        "    for _ in range(runs):",
        "        r = rng.random()",
        "        acc = 0.0",
        "        for token, p in dist.items():",
        "            acc += p",
        "            if r < acc:",
        "                out.append(token)",
        "                break",
        "        else:",
        "            out.append(list(dist)[-1])",
        "    return out",
        "",
        "",
        "for temp in (1.0, 0.2):",
        "    samples = sample(sharpen(DIST, temp), SEED, RUNS)",
        "    false = sum(1 for token in samples if token not in SUPPORTED)",
        '    print(f"temp {temp}: {samples} false {false} of {RUNS}")',
        "",
        "flat = sample(sharpen(DIST, 1.0), SEED, RUNS)",
        'caught = [token if token in SUPPORTED else "30" for token in flat]',
        "caught_false = sum(1 for token in caught if token not in SUPPORTED)",
        'print(f"grounded: {caught} false {caught_false} of {RUNS}")',
        "",
        "repeat = sample(sharpen(DIST, 1.0), SEED, RUNS)",
        'print(f"seed repeat: {flat == repeat}")',
        "",
        'HELD = {"30": 0.5, "60": 0.5}',
        "held = sample(sharpen(HELD, 1.0), 11, RUNS)",
        "held_false = sum(1 for token in held if token not in SUPPORTED)",
        'print(f"held: {held} false {held_false} of {RUNS}")',
      ].join("\n"),
    },
  },
  prove: {
    prompt: "Which setting did you change, and how did the false-claim count move?",
    placeholder: "I changed X; the result was Y.",
    maxLength: 280,
    debounceMs: 800,
    savedMessage: "Proof saved on this device.",
  },
  citation:
    "Further reading: AI Engineering by Chip Huyen (O'Reilly). This course is independent and reproduces no book text or figures.",
} as const satisfies Lesson);
