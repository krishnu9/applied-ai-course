import type { Lesson } from "@/lib/types";
import { deepFreeze } from "../freeze";

export const fineTuningLesson = deepFreeze({
  slug: "fine-tuning",
  order: 17,
  title: "Prompt, RAG or fine-tune",
  chapterId: "ch-07",
  chapterOrder: 7,
  status: "live",
  outcome:
    "You can define fine-tuning, choose between a prompt, RAG and a fine-tune, and defend the choice with a held-out score. Prerequisite: lesson 16, agents.",
  artifact: "A rung table for five fixed cases and a runnable choice script.",
  readingMinutes: 18,
  difficulty: "core",
  layerId: "layer-05",
  terms: [
    {
      term: "Fine-tuning",
      definition: "Further training of a model on task data to change its behavior.",
    },
    {
      term: "Supervised fine-tuning (SFT)",
      definition: "Training on input/output pairs to teach format and task behavior.",
    },
    {
      term: "Held-out set",
      definition: "Cases kept out of tuning and used only for a final score.",
    },
    {
      term: "Catastrophic forgetting",
      definition: "The loss of earlier skills after training on a narrow task.",
    },
    {
      term: "RAG (retrieval-augmented generation)",
      definition: "Supplying retrieved documents to a model at answer time.",
    },
  ],
  evalCase: {
    id: "case-finetune",
    brief: "Choose the rung for tone drift and defend the cost.",
  },
  sections: [
    {
      id: "what-it-is",
      title: "What it is",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "fine-tuning-p-1",
          text: "Fine-tuning is further training of a model on task data to change its behavior. Supervised fine-tuning (SFT) trains on input and output pairs. Each pair shows the reply that a good answer should have. The run changes the weights; the prompt and the index do not.",
        },
        {
          kind: "paragraph",
          id: "fine-tuning-p-2",
          text: "A worked example: a team writes 600 pairs of message and ideal reply. Each reply has one form: an apology, one cause, and one next step. SFT trains three passes. On 60 held-out cases, the form score rises from 0.62 to 0.88.",
        },
        {
          kind: "paragraph",
          id: "fine-tuning-p-3",
          text: "A non-example: a team puts this month's price list into 5,000 pairs and trains a model to recall it. The prices change on Friday. The model fails on Saturday, because the weights hold old prices. This is a fact problem, so retrieval is the tool.",
        },
        {
          kind: "paragraph",
          id: "fine-tuning-p-4",
          text: "The choice is a ladder: prompt, retrieval, fine-tuning. Each rung costs more. Climb only when the lower rung fails a measured case.",
        },
      ],
    },
    {
      id: "eli5-phrasebook-folder-tailor",
      title: "A phrasebook, a folder and a tailor",
      register: "eli5",
      blocks: [
        {
          kind: "analogy",
          id: "fine-tuning-analogy-1",
          text: "Think of a phrasebook, a folder and a tailor. The phrasebook holds ready sentences for a traveler, and it is the prompt; the folder holds today's train times, and it is retrieval. The tailor alters one jacket until it fits the wearer; that is fine-tuning, because the change stays in the cloth. The phrasebook is cheap and general, the folder is current, and the jacket is a fixed fit. The traveler carries all three, and each tool covers what the others miss.",
          breaks:
            "A tailor fits one person and needs a new fitting for another. A fine-tune fits the training set, so it can fit a new case badly.",
        },
        {
          kind: "paragraph",
          id: "fine-tuning-p-5",
          text: "Prediction: a reply must always have three lines and a fixed sign-off, and the rules can change next week. Which tool fixes the form, and which keeps the rule current?",
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
          id: "fine-tuning-p-6",
          text: "SFT is a training loop on pairs. The loop teaches form, not facts. Each step removes one reason to train.",
        },
        {
          kind: "list",
          id: "fine-tuning-list-1",
          ordered: true,
          items: [
            "Name the failure as form or fact; form is shape, fact is a changing value.",
            "Test a prompt first, because rules that fit in context need no run.",
            "Test retrieval when the answer depends on facts that change.",
            "Count clean pairs for the target form on every slice.",
            "Split the pairs, then freeze the test part before the run.",
            "Run SFT, choose a checkpoint on validation, compare on test.",
            "Score older slices and add general data when a skill drops.",
          ],
        },
        {
          kind: "paragraph",
          id: "fine-tuning-p-7",
          text: "A form is a shape: greeting, field order, length, tone. Form suits weights, because every reply can follow it. A fact is a value that changes, such as a price or a policy window. Weights freeze it; retrieval keeps it current.",
        },
        {
          kind: "paragraph",
          id: "fine-tuning-p-8",
          text: "The SFT loss compares target tokens with model output. Mask the input tokens, so the run learns the reply and not the question. A small learning rate and two or three passes are a common start. More passes fit noise.",
        },
        {
          kind: "paragraph",
          id: "fine-tuning-p-9",
          text: "Data needs are modest for a narrow form: one hundred to one thousand clean pairs. Quality beats count, because one contradiction teaches a guess. Duplicates add cost and no signal. Keep ten percent general pairs to limit forgetting.",
        },
        {
          kind: "paragraph",
          id: "fine-tuning-p-10",
          text: "The held-out set is the only honest score. Freeze it before the run, and report overall and per-slice scores. At 60 cases, a gain under five points can be noise, so name the sample size.",
        },
        {
          kind: "paragraph",
          id: "fine-tuning-p-11",
          text: "Catastrophic forgetting is the main risk: a narrow run can lift the target form and lower an older skill. Test old slices and add general pairs, or use a method that moves fewer weights. Compare the run cost with the tokens it saves.",
        },
        {
          kind: "table",
          id: "fine-tuning-table-1",
          columns: ["Stage", "Input", "Output"],
          rows: [
            ["Prompt", "Rules, examples, question", "A reply in context"],
            ["RAG", "Question, index, k", "Retrieved facts with source ids"],
            ["SFT", "Input and output pairs", "Updated weights"],
            ["Held-out eval", "Frozen cases, old slices", "Pass rate overall and per slice"],
          ],
          caption: "Inputs and outputs at each rung.",
        },
        {
          kind: "diagram",
          id: "fine-tuning-diagram-1",
          variant: "stack",
          spec: {
            nodes: [
              {
                id: "prompt",
                label: "Prompt",
                detail: "Rules fit in the context; no training run.",
              },
              {
                id: "retrieval",
                label: "Retrieval",
                detail: "Facts change; one document edit per change.",
              },
              {
                id: "sft",
                label: "Supervised fine-tuning",
                detail: "Form is stable; one hundred to one thousand pairs.",
              },
              {
                id: "held-out",
                label: "Held-out eval",
                detail: "Freeze the test; score each slice.",
              },
              {
                id: "serve",
                label: "Serve",
                detail: "Track pass rate, cost and p95 latency.",
              },
            ],
            edges: [
              ["prompt", "retrieval"],
              ["retrieval", "sft"],
              ["sft", "held-out"],
              ["held-out", "serve"],
            ],
          },
          caption:
            "Each rung costs more than the one below it; a held-out score decides the climb.",
          alt: "Stack from prompt and retrieval to supervised fine-tuning, a held-out score, and serving.",
        },
      ],
    },
    {
      id: "eli5-corner-kick-drill",
      title: "A corner-kick drill",
      register: "eli5",
      blocks: [
        {
          kind: "analogy",
          id: "fine-tuning-analogy-2",
          text: "Think of a team that drills one corner kick. The coach repeats the same move until the players run it without thought; that is SFT, and the drill becomes the form. The rulebook stays on the field for the current offside rule; that is retrieval, because the rule can change. The drill makes the move automatic, and the rulebook keeps the facts current. The coach checks the drill on video, and the referee checks the rulebook before each match.",
          breaks:
            "A drill cannot teach a rule that changed this morning. A fine-tune cannot hold a fact that changes after the run.",
        },
        {
          kind: "paragraph",
          id: "fine-tuning-p-13",
          text: "Prediction: the offside rule changes each week, but the corner-kick move stays the same. Which tool holds each one, and what happens when the drill tries to hold the rule?",
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
          id: "fine-tuning-table-2",
          columns: ["Symptom", "Cause", "Check", "Fix"],
          rows: [
            [
              "Replies still drift after training",
              "Train set differs from production",
              "Compare slice counts in both sets",
              "Collect pairs for the missing slices",
            ],
            [
              "Train score high, held-out low",
              "Overfit or split leakage",
              "Check for duplicate text across splits",
              "Dedupe, refreeze the test and retrain",
            ],
            [
              "An older skill regresses",
              "Catastrophic forgetting",
              "Score the old slices before and after",
              "Add general pairs or use PEFT",
            ],
            [
              "A fact goes stale",
              "A changing fact sits in the weights",
              "Ask a question about a post-cutoff fact",
              "Move the fact to retrieval",
            ],
          ],
          caption: "Four failures, from the data back to the rung.",
        },
        {
          kind: "paragraph",
          id: "fine-tuning-p-14",
          text: "Fine-tuning cuts instruction tokens per request and adds a training run. It pays only when the form is stable and volume repays the run.",
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
          id: "fine-tuning-p-15",
          text: "The support assistant labels tickets well after the retrieval repair. The reply style is the problem: replies are long and vague, and the product wants three parts with a fixed sign-off. The team has 600 pairs.",
        },
        {
          kind: "paragraph",
          id: "fine-tuning-p-16",
          text: "The trace shows a form failure. Policy accuracy is 0.88, but the style check passes 0.54 of cases. The prompt holds the rule, yet the sign-off fails on long tickets. The team splits the pairs into 480 train, 60 validation and 60 test cases, then freezes the test.",
        },
        {
          kind: "paragraph",
          id: "fine-tuning-p-17",
          text: "The first SFT run lifts held-out style from 0.62 to 0.88. It also drops the refund slice from 0.82 to 0.74, because the pairs hold few refund cases. The team adds 60 refund pairs and 60 general pairs, then retrains from the base checkpoint.",
        },
        {
          kind: "paragraph",
          id: "fine-tuning-p-18",
          text: "The second run holds style at 0.87 and restores refund to 0.81. The capstone reports pass rate 0.72, cost per 1k 0.79, and p95 1,100 ms. The baseline is 0.41, 0.94 and 2,400 ms. The decision is SFT plus retrieval.",
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
          id: "fine-tuning-p-19",
          text: "Answer five questions on definition, rung, failure, cost and forgetting.",
        },
        { kind: "check", id: "fine-tuning-check-1", checkId: "check-1" },
        { kind: "check", id: "fine-tuning-check-2", checkId: "check-2" },
        { kind: "check", id: "fine-tuning-check-3", checkId: "check-3" },
        { kind: "check", id: "fine-tuning-check-4", checkId: "check-4" },
        { kind: "check", id: "fine-tuning-check-5", checkId: "check-5" },
      ],
    },
    {
      id: "evaluation-task",
      title: "Evaluation task",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "fine-tuning-p-20",
          text: "Use the five fixed cases. Each case states the failure, whether facts change, the pair count and the monthly volume. Pick the rung, compute the payback and report the result.",
        },
        { kind: "task", id: "task-finetune" },
        {
          kind: "paragraph",
          id: "fine-tuning-p-21",
          text: "The reference solution prints retrieval for A, fine-tune for B, D and E, and prompt for C. Payback is 4.5 days at 100,000 requests a day. Held-out style moves from 0.62 to 0.88, and the refund slice falls from 0.82 to 0.74, so the fix adds a general mix.",
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
          id: "fine-tuning-p-22",
          text: "Write one sentence: I changed X; the result was Y. Name the rung, the rule and one held-out number. Example: I chose SFT for the reply form; held-out style rose from 0.62 to 0.87.",
        },
        {
          kind: "paragraph",
          id: "fine-tuning-p-23",
          text: "Self-rubric: mechanism names the rung and the rule; evidence gives a fixed score or count; limit names one slice that did not improve.",
        },
        {
          kind: "note",
          id: "fine-tuning-note-1",
          text: "A training run without a held-out score is a guess with a bill.",
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
          id: "fine-tuning-interview-1",
          items: [
            {
              question: "What is fine-tuning, and what does SFT teach?",
              answer:
                "Fine-tuning is further training of a model on task data to change its behavior. SFT trains on input and output pairs, so it teaches form: tone, field order, length and sign-off. It does not reliably teach a fact that changes after the run, because the weights are frozen at the end. Score a held-out set after the run.",
            },
            {
              question: "When do you choose fine-tuning over retrieval?",
              answer:
                "Choose fine-tuning when the failure is form, the shape is stable and hundreds of clean pairs exist. Choose retrieval when the answer depends on facts that change. A common design uses both: weights for form, an index for facts. A held-out score decides the gain.",
            },
            {
              question: "How does fine-tuning fail, and what do you check?",
              answer:
                "It can overfit a small set, forget an older skill or bake in a stale fact. Check a frozen held-out set and one score per slice, not the training score. If an older slice drops, add general pairs or use PEFT, and retrain. Report the sample size with the score.",
            },
            {
              question: "How does fine-tuning change at 10x traffic or data?",
              answer:
                "At 10x traffic, a smaller fine-tuned model can cut cost per request and latency. At 10x data, review cost and label noise grow faster than quality, so dedupe and coverage matter more than count. Track pass rate and p95 on the same run. Name the sample size on every run.",
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
      prompt: "Which sentence defines supervised fine-tuning?",
      options: [
        { id: "option-a", label: "Training on input and output pairs to teach form." },
        { id: "option-b", label: "Retrieving documents at answer time." },
        { id: "option-c", label: "Sampling many answers and picking a winner." },
        { id: "option-d", label: "Storing a price list in an index." },
      ],
      correctOptionId: "option-a",
      explanation:
        "SFT trains on pairs of input and target output, so it changes the form of a reply. Retrieval holds facts outside the weights, and best-of-N samples answers without training.",
    },
    {
      id: "check-2",
      kind: "apply",
      prompt: "A reply needs a fixed three-part form, the facts are stable, and 800 clean pairs exist. Which rung fits first?",
      options: [
        { id: "option-a", label: "Retrieval" },
        { id: "option-b", label: "Fine-tuning" },
        { id: "option-c", label: "A larger context window" },
        { id: "option-d", label: "No change" },
      ],
      correctOptionId: "option-b",
      explanation:
        "A stable form with hundreds of clean pairs is the classic SFT case. Retrieval fixes changing facts, and a larger window does not make the form reliable.",
    },
    {
      id: "check-3",
      kind: "diagnose",
      prompt: "A fine-tune scores 0.95 on train and 0.61 on the held-out set. What do you check first?",
      options: [
        { id: "option-a", label: "The GPU memory" },
        { id: "option-b", label: "Duplicate text across splits" },
        { id: "option-c", label: "The retrieval index" },
        { id: "option-d", label: "The sampling temperature" },
      ],
      correctOptionId: "option-b",
      explanation:
        "A large train and held-out gap points to overfit or leakage between the splits. Check for duplicate text, dedupe, refreeze the test and retrain before you change the model.",
    },
    {
      id: "check-4",
      kind: "calculate",
      prompt: "Training costs $90. Serving saves $0.0002 per request at 100,000 requests a day. What is the payback in days?",
      options: [
        { id: "option-a", label: "0.45 days" },
        { id: "option-b", label: "4.5 days" },
        { id: "option-c", label: "45 days" },
        { id: "option-d", label: "450 days" },
      ],
      correctOptionId: "option-b",
      explanation:
        "The daily saving is 0.0002 times 100,000, or $20, and 90 divided by 20 is 4.5 days. A value of 45 days would need a daily saving of $2.",
    },
    {
      id: "check-5",
      kind: "diagnose",
      prompt: "After a narrow style run, the refund slice falls from 0.82 to 0.74. What is the likely cause?",
      options: [
        { id: "option-a", label: "Catastrophic forgetting" },
        { id: "option-b", label: "Contamination" },
        { id: "option-c", label: "Verbosity bias" },
        { id: "option-d", label: "A slow GPU" },
      ],
      correctOptionId: "option-a",
      explanation:
        "A narrow run can overwrite an older skill, which is catastrophic forgetting. Add general or refund pairs and retrain, then score the old slice again.",
    },
  ],
  task: {
    id: "task-finetune",
    scope: "Choose a rung for five fixed cases and compute one payback.",
    items: [
      {
        id: "item-1",
        label: "Classify each fixed case as a form failure or a fact failure.",
      },
      {
        id: "item-2",
        label: "Apply the rung rule and write the choice for all five cases.",
      },
      {
        id: "item-3",
        label: "Compute the training payback in days for case D.",
      },
      {
        id: "item-4",
        label: "Report the held-out style score and the refund slice after the first run.",
      },
      {
        id: "item-5",
        label: "Transfer the rule to case E and state the rung with one reason.",
      },
    ],
    solution: {
      filename: "training/choose_rung.py",
      language: "python",
      code: [
        "CASES = [",
        '    {"id": "A", "form": False, "facts_change": True, "examples": 0},',
        '    {"id": "B", "form": True, "facts_change": False, "examples": 600},',
        '    {"id": "C", "form": False, "facts_change": False, "examples": 0},',
        '    {"id": "D", "form": True, "facts_change": False, "examples": 900},',
        '    {"id": "E", "form": True, "facts_change": False, "examples": 300},',
        "]",
        "",
        "",
        "def choose(case):",
        '    if case["facts_change"]:',
        '        return "retrieval"',
        '    if case["form"] and case["examples"] >= 200:',
        '        return "fine-tune"',
        '    return "prompt"',
        "",
        "",
        "for case in CASES:",
        '    print(f"{case[\'id\']}: {choose(case)}")',
        "",
        "TRAIN_COST = 90",
        "SAVING_PER_REQUEST = 0.0002",
        "REQUESTS_PER_DAY = 100000",
        "payback = TRAIN_COST / (SAVING_PER_REQUEST * REQUESTS_PER_DAY)",
        'print(f"payback: {payback:.1f} days")',
        'print("held-out style: 0.62 -> 0.88")',
        'print("refund slice: 0.82 -> 0.74, add general mix")',
      ].join("\n"),
    },
  },
  prove: {
    prompt: "Which rung did you choose, and what did the held-out score show?",
    placeholder: "I changed X; the result was Y.",
    maxLength: 280,
    debounceMs: 800,
    savedMessage: "Proof saved on this device.",
  },
  citation:
    "Further reading: AI Engineering by Chip Huyen (O'Reilly). This course is independent and reproduces no book text or figures.",
} as const satisfies Lesson);
