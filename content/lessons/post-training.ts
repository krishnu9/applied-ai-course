import type { Lesson } from "@/lib/types";
import { deepFreeze } from "../freeze";

export const postTrainingLesson = deepFreeze({
  slug: "post-training",
  order: 4,
  title: "Pretraining, SFT and preference tuning",
  chapterId: "ch-02",
  chapterOrder: 2,
  status: "live",
  outcome:
    "You can tell a base model from an instruct model, choose SFT or preference tuning, and shape the data for each stage. Prerequisite: lesson 3, model scaling.",
  artifact: "A runnable stages.py that classifies fixed training rows and chooses a stage.",
  readingMinutes: 22,
  difficulty: "core",
  terms: [
    {
      term: "Base model",
      definition:
        "A pretrained model before instruction tuning; it continues text rather than answers.",
    },
    {
      term: "Instruct model",
      definition: "A model tuned to follow instructions and to hold a conversation.",
    },
    {
      term: "Supervised fine-tuning (SFT)",
      definition:
        "Training on input/output pairs to teach format and task behavior.",
    },
    {
      term: "Preference tuning",
      definition:
        "Training that uses ranked or compared answers to shape model behavior.",
    },
    {
      term: "RLHF",
      definition:
        "Reinforcement learning from human feedback; a preference-tuning method that uses a reward model.",
    },
    {
      term: "DPO",
      definition:
        "Direct preference optimization; a preference-tuning method that skips the reward model.",
    },
  ],
  evalCase: {
    id: "case-post-training",
    brief: "Choose SFT or preference data for a format fault and a tone fault.",
  },
  sections: [
    {
      id: "outcome-and-prerequisites",
      title: "Outcome and prerequisites",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "post-training-p-1",
          text: "You can tell a base model from an instruct model, choose SFT or preference tuning, and shape the data for each stage. You need lesson 3 on model size. The task uses fixed training rows.",
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
          id: "post-training-p-2",
          text: "A base model is a pretrained model before instruction tuning. It continues text rather than answers a request. An instruct model is tuned to follow instructions and to hold a conversation. Post-training is the later stage that turns a base model into an instruct model.",
        },
        {
          kind: "paragraph",
          id: "post-training-p-3",
          text: "Supervised fine-tuning (SFT) trains on input/output pairs to teach format and task behavior. Preference tuning trains on ranked or compared answers to shape behavior. RLHF is a preference method that uses a reward model. DPO is a preference method that skips the reward model.",
        },
        {
          kind: "paragraph",
          id: "post-training-p-4",
          text: "A worked example is a team with 2,000 product-review replies. Each reply holds a correct label and a correct answer. The SFT set is one prompt and one ideal answer per row. The preference set is one prompt with a chosen answer and a rejected answer. The team uses SFT for the label format and preference tuning for tone.",
        },
        {
          kind: "paragraph",
          id: "post-training-p-5",
          text: "A non-example is a glossary. It adds no input/output pair and no ranked answer, so no training stage can use it. The data shape decides the stage.",
        },
      ],
    },
    {
      id: "eli5-a-new-employee",
      title: "A new employee",
      register: "eli5",
      blocks: [
        {
          kind: "analogy",
          id: "post-training-analogy-1",
          text: "Think of a new employee who read many books. The employee knows language but not the office rules. A mentor shows 30 finished reports, and the employee copies the format. Then the manager compares two drafts and says which one is better. The books are pretraining, the reports are SFT, and the manager is preference tuning.",
          breaks:
            "Where it breaks: an employee learns the reason behind a choice, while preference tuning changes behavior without a written reason.",
        },
        {
          kind: "paragraph",
          id: "post-training-p-6a",
          text: "The employee can copy a report without knowing why it works. The reports show the format, and the manager shows the choice. Each lesson needs its own examples.",
        },
        {
          kind: "paragraph",
          id: "post-training-p-6",
          text: "Prediction: the employee writes a report in the right format but with a rude tone. Which stage needs more examples?",
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
          id: "post-training-p-7",
          text: "Post-training is a short pipeline after pretraining. Each stage uses one data shape and one goal.",
        },
        {
          kind: "list",
          id: "post-training-list-1",
          ordered: true,
          items: [
            "Start from the base model.",
            "Curate SFT pairs: instruction, input and ideal output.",
            "Train SFT to teach format and task behavior.",
            "Collect ranked answers for one prompt.",
            "Train preference tuning with RLHF or with DPO.",
            "Evaluate on a held-out set after each stage.",
          ],
        },
        {
          kind: "paragraph",
          id: "post-training-p-8",
          text: "An SFT row holds a system prompt, a user message and the ideal answer. The loss counts the answer tokens. A few thousand clean pairs often beat a large noisy set. The pair shows the model what a good answer looks like for one task.",
        },
        {
          kind: "paragraph",
          id: "post-training-p-9",
          text: "A preference row holds a prompt, a chosen answer and a rejected answer. The chosen answer is the one a person ranks higher. DPO raises the likelihood of the chosen answer and lowers the rejected one. The pairs teach a choice, not a format.",
        },
        {
          kind: "paragraph",
          id: "post-training-p-10",
          text: "RLHF first trains a reward model on pairwise labels. It then optimizes the policy against the reward. A penalty keeps the policy near the SFT model, and the penalty limits reward hacking. DPO uses the same pairs without a separate reward model, so it is simpler and cheaper.",
        },
        {
          kind: "paragraph",
          id: "post-training-p-11",
          text: "The data shape follows the fault. SFT teaches form: label format, tool call shape and answer length. Preference tuning teaches choice: tone, refusal and helpfulness. Use SFT for a format fault and preference data for a taste fault.",
        },
        {
          kind: "table",
          id: "post-training-table-1",
          columns: ["Stage", "Data shape", "What it teaches"],
          rows: [
            ["Pretraining", "Raw text", "Language patterns"],
            ["SFT", "Prompt and ideal answer", "Format and task behavior"],
            ["RLHF", "Prompt, ranked answers and reward model", "Alignment with preference"],
            ["DPO", "Prompt, chosen and rejected answer", "Alignment without a reward model"],
          ],
          caption: "One data shape and one teaching goal per stage.",
        },
        {
          kind: "diagram",
          id: "post-training-diagram-1",
          variant: "timeline",
          spec: {
            nodes: [
              { id: "pretrain", label: "Pretraining" },
              { id: "sft", label: "SFT" },
              { id: "preference", label: "Preference tuning" },
              { id: "eval", label: "Held-out eval" },
            ],
            edges: [
              ["pretrain", "sft"],
              ["sft", "preference"],
              ["preference", "eval"],
            ],
          },
          caption:
            "Pretraining learns language, SFT teaches form, preference tuning shapes choice, and the eval checks both.",
          alt: "Timeline from pretraining to supervised fine-tuning, then preference tuning, then a held-out evaluation.",
        },
      ],
    },
    {
      id: "eli5-training-a-dog",
      title: "Training a dog",
      register: "eli5",
      blocks: [
        {
          kind: "analogy",
          id: "post-training-analogy-2",
          text: "Think of training a dog. You say sit and move a treat up, and the dog copies the motion. Later you hold two toys and reward the one the dog should pick. The first lesson is SFT, because you show the exact action. The second lesson is preference tuning, because you rank two choices.",
          breaks:
            "Where it breaks: a dog repeats one action, while a model learns a probability over many possible answers.",
        },
        {
          kind: "paragraph",
          id: "post-training-p-12a",
          text: "The dog learns the action from one clear show and the choice from two options. The model learns the same way, with a pair for form and a pair for taste.",
        },
        {
          kind: "paragraph",
          id: "post-training-p-12",
          text: "Prediction: the dog sits on command but barks at guests. Do you show more sits, or reward the quiet choice?",
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
          id: "post-training-p-13",
          text: "Most post-training faults come from the data shape or the label. Read the rows before you change the method.",
        },
        {
          kind: "table",
          id: "post-training-table-2",
          columns: ["Symptom", "Cause", "Check", "Fix"],
          rows: [
            [
              "The label format drifts between replies",
              "The SFT pairs use mixed formats",
              "Read 20 SFT rows and count the formats",
              "Use one schema and one example format",
            ],
            [
              "The tone is curt after tuning",
              "The preference pairs reward short answers",
              "Compare chosen length with tone labels",
              "Relabel the pairs for tone, not length",
            ],
            [
              "The model refuses safe requests",
              "The preference data over-rewards refusal",
              "Count refusals on the held-out set",
              "Add helpful chosen answers",
            ],
            [
              "SFT erases a skill from the base model",
              "The SFT set is narrow and large",
              "Run the held-out set before and after",
              "Shrink the set or mix general data",
            ],
          ],
          caption: "Four post-training faults, each with one check.",
        },
        {
          kind: "paragraph",
          id: "post-training-p-14",
          text: "SFT is cheap and strong on format, and it can overfit a narrow set. Preference tuning is slower and shapes taste, and it can reward a bias in the pairs. The fault decides the stage, and the held-out set decides the win.",
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
          id: "post-training-p-15",
          text: "The assistant writes valid labels but a curt tone. The trace shows the label schema is correct on 38 of 41 cases. The tone check fails on 24 of 41 cases. The team holds 2,000 SFT pairs and 600 ranked pairs. The SFT pairs show the right schema and a neutral tone. The ranked pairs compare a curt answer with a warm answer, and people choose the warm one.",
        },
        {
          kind: "paragraph",
          id: "post-training-p-16",
          text: "The trace names two different faults with two different shapes. The schema misses three cases and needs SFT pairs. The tone misses 24 cases and needs preference pairs. One mixed run would hide which shape fixed which fault.",
        },
        {
          kind: "paragraph",
          id: "post-training-p-17",
          text: "The decision is to run SFT on the schema pairs, then preference tuning on the ranked pairs. Evaluate after each stage on the held-out set. Stop when the schema passes and the tone rate rises. Keep the two data shapes separate, so the next trace has one cause.",
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
          id: "post-training-p-18",
          text: "Answer five questions on the stage, the data shape, the failure and the split.",
        },
        { kind: "check", id: "post-training-check-1", checkId: "check-1" },
        { kind: "check", id: "post-training-check-2", checkId: "check-2" },
        { kind: "check", id: "post-training-check-3", checkId: "check-3" },
        { kind: "check", id: "post-training-check-4", checkId: "check-4" },
        { kind: "check", id: "post-training-check-5", checkId: "check-5" },
      ],
    },
    {
      id: "evaluation-task",
      title: "Evaluation task",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "post-training-p-19",
          text: "Use the eight fixed rows. Build one script that assigns each row to a stage, checks the shape against its fault, and chooses a stage for each fault. The script assigns three rows to SFT, three to preference tuning, one to pretraining and one as unusable. Three rows hold the wrong shape for their fault: e6, e7 and e8.",
        },
        { kind: "task", id: "task-post-training" },
      ],
    },
    {
      id: "prove-the-change",
      title: "Prove the change",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "post-training-p-20",
          text: "Write one sentence with the form: I changed X; the result was Y. Name the data shape, the stage and the held-out number.",
        },
        {
          kind: "paragraph",
          id: "post-training-p-21",
          text: "Self-rubric: mechanism names the stage and the data shape; evidence gives a fixed pass count; limit names one fault the stage does not fix.",
        },
        {
          kind: "note",
          id: "post-training-note-1",
          text: "The data shape chooses the stage before the method does.",
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
          id: "post-training-interview-1",
          items: [
            {
              question: "What is post-training, and which stages does it hold?",
              answer:
                "Post-training is the work after pretraining that turns a base model into an instruct model. It holds supervised fine-tuning on prompt and answer pairs, then preference tuning on ranked answers. SFT teaches form, and preference tuning shapes choice.",
            },
            {
              question: "When do you choose DPO over RLHF?",
              answer:
                "Choose DPO when you hold good chosen and rejected pairs and want a simpler, cheaper run. DPO skips the reward model and the reinforcement loop. Choose RLHF when you need an explicit reward model and a learned policy against it.",
            },
            {
              question: "How does post-training fail, and what do you check?",
              answer:
                "The faults come from a wrong data shape or a biased label. Check the SFT rows for one format and the preference pairs for a length or refusal bias. Run the held-out set after each stage, so one stage cannot hide a loss in the other.",
            },
            {
              question: "How does the data need change at 10x pairs?",
              answer:
                "At 10x pairs, quality control matters more than the count, because a noisy set scales its errors. Deduplicate the rows, keep one schema, and sample the labels for agreement. A smaller clean set can beat a large set with mixed formats.",
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
      prompt: "Which sentence defines supervised fine-tuning (SFT)?",
      options: [
        { id: "option-a", label: "Training on input/output pairs to teach format and task behavior." },
        { id: "option-b", label: "Training on raw text to learn language patterns." },
        { id: "option-c", label: "Training on ranked answers with a reward model." },
        { id: "option-d", label: "Serving a model with a lower cost." },
      ],
      correctOptionId: "option-a",
      explanation:
        "SFT uses one prompt and one ideal answer per row to teach form and task behavior. Raw text is pretraining, and ranked answers belong to preference tuning.",
    },
    {
      id: "check-2",
      kind: "apply",
      prompt: "Which data shape trains DPO?",
      options: [
        { id: "option-a", label: "Raw text with no labels." },
        { id: "option-b", label: "A prompt and one ideal answer." },
        { id: "option-c", label: "A prompt with a chosen answer and a rejected answer." },
        { id: "option-d", label: "A glossary of domain terms." },
      ],
      correctOptionId: "option-c",
      explanation:
        "DPO learns from a chosen and a rejected answer for the same prompt, with no separate reward model. A single ideal answer trains SFT, and a glossary is not a training shape.",
    },
    {
      id: "check-3",
      kind: "diagnose",
      prompt:
        "Tone gets worse after preference tuning. The chosen answers are shorter in every pair. What is the likely cause?",
      options: [
        { id: "option-a", label: "The SFT format is wrong" },
        { id: "option-b", label: "The preference pairs reward length, not tone" },
        { id: "option-c", label: "The context window is too small" },
        { id: "option-d", label: "The tokenizer split the answers" },
      ],
      correctOptionId: "option-b",
      explanation:
        "The pairs teach the model to prefer the chosen answer, and the chosen answer is also the shorter one. The model learns the length signal and can lose the tone signal that the team wanted.",
    },
    {
      id: "check-4",
      kind: "calculate",
      prompt:
        "A team holds 2,000 SFT pairs and keeps 20 percent for a held-out set. How many pairs train the model?",
      options: [
        { id: "option-a", label: "200 pairs" },
        { id: "option-b", label: "400 pairs" },
        { id: "option-c", label: "1,600 pairs" },
        { id: "option-d", label: "1,800 pairs" },
      ],
      correctOptionId: "option-c",
      explanation:
        "20 percent of 2,000 is 400 held-out pairs, so 1,600 pairs train the model. A value of 400 is the held-out part, not the training part.",
    },
    {
      id: "check-5",
      kind: "apply",
      prompt:
        "A model follows the task but returns the wrong JSON field order. Which data and stage fit?",
      options: [
        { id: "option-a", label: "Preference pairs for tone" },
        {
          id: "option-b",
          label: "SFT pairs with the exact schema and one example",
        },
        { id: "option-c", label: "Raw text for more language" },
        { id: "option-d", label: "A larger context window" },
      ],
      correctOptionId: "option-b",
      explanation:
        "A format fault calls for SFT, because SFT shows one ideal answer with the exact schema. Preference pairs teach a choice between answers, and they do not fix a fixed field order.",
    },
  ],
  task: {
    id: "task-post-training",
    scope:
      "Classify eight fixed training rows by stage, catch a shape mismatch, and choose a stage for two faults.",
    items: [
      {
        id: "item-1",
        label: "Write the three data shapes and the stage for each shape.",
      },
      {
        id: "item-2",
        label: "Assign each of the eight fixed rows to one stage.",
      },
      {
        id: "item-3",
        label: "Print the stage count and one reason for each row.",
      },
      {
        id: "item-4",
        label: "Flag each row whose shape does not fit its fault.",
      },
      {
        id: "item-5",
        label: "Choose the stage for a format fault and for a tone fault, then test the held row.",
      },
    ],
    solution: {
      filename: "post-training/stages.py",
      language: "python",
      code: [
        "ROWS = [",
        '    {"id": "e1", "shape": "prompt_output", "fault": "format"},',
        '    {"id": "e2", "shape": "prompt_chosen_rejected", "fault": "tone"},',
        '    {"id": "e3", "shape": "prompt_output", "fault": "format"},',
        '    {"id": "e4", "shape": "prompt_chosen_rejected", "fault": "tone"},',
        '    {"id": "e5", "shape": "raw_text", "fault": "language"},',
        '    {"id": "e6", "shape": "prompt_output", "fault": "tone"},',
        '    {"id": "e7", "shape": "prompt_chosen_rejected", "fault": "format"},',
        '    {"id": "e8", "shape": "glossary", "fault": "facts"},',
        "]",
        "",
        'HELD = {"id": "h1", "shape": "prompt_output", "fault": "tone"}',
        "",
        "STAGE = {",
        '    "prompt_output": "sft",',
        '    "prompt_chosen_rejected": "preference",',
        '    "raw_text": "pretraining",',
        '    "glossary": "unusable",',
        "}",
        "",
        "FIT = {",
        '    "format": "sft",',
        '    "tone": "preference",',
        '    "language": "pretraining",',
        '    "facts": "retrieval",',
        "}",
        "",
        "for shape in sorted(STAGE):",
        '    print(f"shape {shape} -> stage {STAGE[shape]}")',
        "print()",
        "",
        "counts = {}",
        "for row in ROWS:",
        "    stage = STAGE[row[\"shape\"]]",
        "    counts[stage] = counts.get(stage, 0) + 1",
        "    fits = stage == FIT[row[\"fault\"]]",
        '    mark = "" if fits else "  MISMATCH"',
        '    print(f"{row[\'id\']} shape {row[\'shape\']:21} stage {stage:12} fault {row[\'fault\']:8}{mark}")',
        "",
        'print("counts " + " ".join(f"{stage} {counts[stage]}" for stage in sorted(counts)))',
        "",
        'print("format fault -> " + FIT["format"])',
        'print("tone fault -> " + FIT["tone"])',
        "",
        "held_stage = STAGE[HELD[\"shape\"]]",
        'print(f"{HELD[\'id\']} held stage {held_stage} fits {held_stage == FIT[HELD[\'fault\']]}")',
      ].join("\n"),
    },
  },
  prove: {
    prompt: "Which data shape did you choose, and what did the held-out result show?",
    placeholder: "I changed X; the result was Y.",
    maxLength: 280,
    debounceMs: 800,
    savedMessage: "Proof saved on this device.",
  },
  citation:
    "Further reading: AI Engineering by Chip Huyen (O'Reilly). This course is independent and reproduces no book text or figures.",
} as const satisfies Lesson);
