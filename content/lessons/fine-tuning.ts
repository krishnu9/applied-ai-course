import type { Lesson } from "@/lib/types";
import { deepFreeze } from "../freeze";

export const fineTuningLesson = deepFreeze({
  slug: "fine-tuning",
  order: 5,
  title: "Fine-tuning: when it pays",
  outcome: "You can choose between prompting, retrieval and fine-tuning.",
  artifact: "A three-row decision table and a twenty-example file.",
  readingMinutes: 10,
  difficulty: "core",
  layerId: "layer-05",
  sections: [
    {
      id: "read-the-tempting-lever",
      title: "Read: the tempting lever",
      blocks: [
        {
          kind: "paragraph",
          id: "p-finetune-1",
          text: "Fine-tuning is the expensive rung of a ladder. The first rung is a better prompt. The second rung is retrieval. The third rung is fine-tuning. Climb in order, because each rung costs more than the one below it.",
        },
        {
          kind: "paragraph",
          id: "p-finetune-2",
          text: "The sample feature fails on one class of tickets. The model writes the right label but the wrong reply style. The team wants to fine-tune. The failure is style, not knowledge, so fine-tuning can work, but only with labelled examples.",
        },
        {
          kind: "paragraph",
          id: "p-finetune-3",
          text: "Style is a real failure. A reply with the wrong tone costs trust even when the label is right. But style is cheap to test, and that makes it a good target for a fine-tune.",
        },
        {
          kind: "callout",
          id: "callout-finetune-small",
          tone: "warning",
          title: "A small set does not fine-tune.",
          text: "Ten examples teach a format and little else. A stable format needs dozens of clean examples and a held-out set.",
        },
      ],
    },
    {
      id: "read-the-three-rungs",
      title: "Read: the three rungs",
      blocks: [
        {
          kind: "paragraph",
          id: "p-finetune-4",
          text: "Prompting wins when the task is clear and the rules fit in the context. It costs tokens per request and no training run. Change the prompt and the next request uses the change.",
        },
        {
          kind: "paragraph",
          id: "p-finetune-5",
          text: "Retrieval wins when the answer depends on facts that change. The index holds the facts, and the prompt holds the question and the found text. A document change reaches the next request without a model change.",
        },
        {
          kind: "paragraph",
          id: "p-finetune-6",
          text: "Fine-tuning wins when the format is stable and the examples are many. The training run moves the style into the weights. The weights do not know new facts, so facts still need retrieval or a tool.",
        },
        {
          kind: "paragraph",
          id: "p-finetune-7",
          text: "The cost differs by rung. Prompting pays per token. Retrieval pays per query plus the index. Fine-tuning pays a training run, then per token for a model you host or rent.",
        },
        {
          kind: "paragraph",
          id: "p-finetune-8",
          text: "The three rungs are not exclusive. A production system can use a prompt contract, a retrieval index and a fine-tuned small model. Choose the rung that fixes the failure, not the rung that sounds advanced.",
        },
        {
          kind: "list",
          id: "list-finetune-rungs",
          ordered: false,
          items: [
            "Prompting: the rules fit in the context and change often.",
            "Retrieval: the answer depends on facts that change.",
            "Fine-tuning: the format is stable and the examples are many.",
            "None: the task is not worth the cost.",
          ],
        },
      ],
    },
    {
      id: "check-the-choice",
      title: "Check: choose the rung",
      blocks: [
        {
          kind: "paragraph",
          id: "p-finetune-9",
          text: "A decision needs evidence. Write the failure type first. Knowledge, format, tone or reasoning. Each type points to a different rung. A format failure with a stable shape points to fine-tuning.",
        },
        {
          kind: "paragraph",
          id: "p-finetune-10",
          text: "Count the examples before you choose. Fine-tuning needs a clean set with expected outputs. If the team has twenty examples and thirty failure types, the set is too thin. Collect more before you train.",
        },
        {
          kind: "paragraph",
          id: "p-finetune-11",
          text: "Do not fine-tune to add a fact. A fact in the weights is frozen at training time. A fact in the index changes with one document edit.",
        },
        { kind: "check", id: "check-finetune-a", checkId: "check-1" },
        { kind: "check", id: "check-finetune-b", checkId: "check-2" },
        {
          kind: "callout",
          id: "callout-finetune-heldout",
          tone: "production-tip",
          title: "Keep a held-out set.",
          text: "A fine-tuned model that scores well on its training examples has learned the set, not the task.",
        },
      ],
    },
    {
      id: "build-the-decision",
      title: "Build: the decision check",
      blocks: [
        {
          kind: "paragraph",
          id: "p-finetune-12",
          text: "The script below turns three facts into a choice: does the answer change, is the format stable, and are there enough examples. It is a checklist in code. The team reads the choice and the reason, not just the label.",
        },
        {
          kind: "paragraph",
          id: "p-finetune-13",
          text: "A decision table is the readable form of the same rule. Three rows: prompt, retrieval, fine-tune. Each row names the failure type and the cost. The table sits next to the eval set from lesson one.",
        },
        {
          kind: "paragraph",
          id: "p-finetune-14",
          text: "The example set needs a format and a source. Store one JSON object per line with the input and the expected output. Keep the file small and clean, or the training run learns the noise.",
        },
        {
          kind: "code",
          id: "code-finetune-choice",
          filename: "training/choose_technique.py",
          language: "python",
          code: [
            "def choose(needs: dict) -> str:",
            '    if needs["facts_change"]:',
            '        return "retrieval"',
            '    if needs["format_stable"] and needs["examples"] >= 100:',
            '        return "fine-tuning"',
            '    return "prompting"',
            "",
            "cases = [",
            '    {"name": "refund policy", "facts_change": True, "format_stable": False, "examples": 0},',
            '    {"name": "reply style", "facts_change": False, "format_stable": True, "examples": 400},',
            '    {"name": "new rule", "facts_change": False, "format_stable": False, "examples": 20},',
            "]",
            "for case in cases:",
            '    print(f"{case[\'name\']}: {choose(case)}")',
          ].join("\n"),
          output: {
            label: "Sample output. Fixed data.",
            text: "refund policy: retrieval\nreply style: fine-tuning\nnew rule: prompting",
          },
        },
        {
          kind: "paragraph",
          id: "p-finetune-15",
          text: "Read the output. The policy question moves to retrieval because the facts change. The reply style moves to fine-tuning because the format is stable and the set is large. The new rule stays with prompting because the rules fit in the prompt.",
        },
        { kind: "task", id: "task-finetune" },
        {
          kind: "note",
          id: "note-finetune",
          text: "Write the reason next to the choice. A table row without a reason becomes a rule nobody can challenge.",
        },
      ],
    },
    {
      id: "prove-the-saving",
      title: "Prove: name the choice",
      blocks: [
        {
          kind: "paragraph",
          id: "p-finetune-16",
          text: "The proof note names the failure type and the rung. Example: the reply style was stable and the set held four hundred examples; fine-tuning moved the format score from 62 to 88 percent.",
        },
        {
          kind: "paragraph",
          id: "p-finetune-17",
          text: "A choice is a claim about cost and quality. Name the set size and the held-out score. A fine-tune with no held-out score is a guess with a training bill.",
        },
        {
          kind: "paragraph",
          id: "p-finetune-18",
          text: "Run the held-out set after training and compare it with the prompt baseline. A gain under five points does not pay for the training run.",
        },
        {
          kind: "callout",
          id: "callout-finetune-facts",
          tone: "note",
          title: "Facts stay outside.",
          text: "Fine-tuning does not add new facts to a model. Keep a retrieval path for anything that changes.",
        },
      ],
    },
  ],
  checks: [
    {
      id: "check-1",
      prompt: "Which failure points to fine-tuning first?",
      options: [
        { id: "option-a", label: "The answer needs a fact from yesterday" },
        { id: "option-b", label: "The reply format is stable and labelled examples are many" },
        { id: "option-c", label: "The prompt is too long" },
        { id: "option-d", label: "The model is too large" },
      ],
      correctOptionId: "option-b",
      explanation:
        "Fine-tuning moves a stable behaviour into the weights, and that needs many clean examples. A changing fact belongs in an index, where one edit reaches the next request.",
    },
    {
      id: "check-2",
      prompt: "What does fine-tuning not fix?",
      options: [
        { id: "option-a", label: "The tone of a reply" },
        { id: "option-b", label: "The output format" },
        { id: "option-c", label: "A fact that changes every day" },
        { id: "option-d", label: "The label style" },
      ],
      correctOptionId: "option-c",
      explanation:
        "A fact in the weights is frozen at training time, so a daily change makes it stale at once. Retrieval or a tool keeps that fact current without a new training run.",
    },
  ],
  task: {
    id: "task-finetune",
    scope: "Choose a rung for three failures and write the decision table.",
    items: [
      { id: "item-1", label: "Write the failure type for each case." },
      { id: "item-2", label: "Count the clean labelled examples." },
      { id: "item-3", label: "Check whether the facts change." },
      { id: "item-4", label: "Fill the three-row decision table." },
      { id: "item-5", label: "Name the held-out score you expect." },
    ],
    solution: {
      filename: "training/choose_technique.py",
      language: "python",
      code: [
        "def choose(needs: dict) -> str:",
        '    if needs["facts_change"]:',
        '        return "retrieval"',
        '    if needs["format_stable"] and needs["examples"] >= 100:',
        '        return "fine-tuning"',
        '    return "prompting"',
        "",
        'print(choose({"facts_change": True, "format_stable": False, "examples": 0}))',
        'print(choose({"facts_change": False, "format_stable": True, "examples": 400}))',
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
    "Further reading on fine-tuning: AI Engineering by Chip Huyen (O'Reilly). This course is independent and reproduces no book text or figures.",
} as const satisfies Lesson);
