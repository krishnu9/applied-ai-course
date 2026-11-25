import type { Lesson } from "@/lib/types";
import { deepFreeze } from "../freeze";

export const foundationModelsLesson = deepFreeze({
  slug: "foundation-models",
  order: 2,
  title: "How a foundation model makes text",
  chapterId: "ch-02",
  chapterOrder: 2,
  status: "live",
  outcome:
    "You can define a token, trace text through a model, and diagnose a truncated context. Prerequisite: lesson 1, the AI engineering stack.",
  artifact: "A runnable tokens.py that counts tokens, detects an overflow, and repairs four fixed tickets.",
  readingMinutes: 22,
  difficulty: "core",
  terms: [
    {
      term: "Token",
      definition:
        "A unit of text that a tokenizer maps to a number; models read and write tokens, not words.",
    },
    {
      term: "Tokenizer",
      definition:
        "The deterministic rule set that splits text into tokens and maps them to ids.",
    },
    {
      term: "Embedding",
      definition:
        "A dense vector that represents the meaning of text for search or comparison.",
    },
    {
      term: "Attention",
      definition:
        "The mechanism that lets each token weigh other tokens when it builds its representation.",
    },
    {
      term: "Next-token prediction",
      definition:
        "The training and inference task of choosing the next token from a probability distribution.",
    },
    {
      term: "Context window",
      definition:
        "The maximum number of tokens that a model can read in one call, input plus output.",
    },
  ],
  evalCase: {
    id: "case-foundation-models",
    brief: "Explain why a long ticket loses its final instruction.",
  },
  sections: [
    {
      id: "outcome-and-prerequisites",
      title: "Outcome and prerequisites",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "foundation-models-p-1",
          text: "You can define a token, trace text through a model, and diagnose a truncated context. You need lesson 1 on the AI stack. No model access is necessary, because the task uses fixed token counts.",
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
          id: "foundation-models-p-2",
          text: "A foundation model is a large pretrained model that serves many tasks without task-specific training. It reads text as tokens and writes text one token at a time. A token is a unit of text that a tokenizer maps to a number. The tokenizer is the deterministic rule set that splits text and maps tokens to ids.",
        },
        {
          kind: "paragraph",
          id: "foundation-models-p-3",
          text: "An embedding is a dense vector that represents meaning. Attention lets each token weigh other tokens when it builds its representation. Next-token prediction chooses the next token from a probability distribution. The context window is the maximum number of tokens in one call, input plus output.",
        },
        {
          kind: "paragraph",
          id: "foundation-models-p-4",
          text: "A worked example is a short note: The report is three days late. The tokenizer turns the text into about nine tokens. The model embeds each token, runs attention across the sequence, and writes a probability for the next token. It picks a period, and the reply stops.",
        },
        {
          kind: "paragraph",
          id: "foundation-models-p-5",
          text: "A non-example is a dictionary lookup. It maps a key to a fixed value and writes no new text. A foundation model predicts each token from a distribution, so two runs can differ.",
        },
      ],
    },
    {
      id: "eli5-an-autocomplete-keyboard",
      title: "An autocomplete keyboard",
      register: "eli5",
      blocks: [
        {
          kind: "analogy",
          id: "foundation-models-analogy-1",
          text: "Think of a phone keyboard that suggests the next word. You type three words, and the keyboard offers five words with a size for each offer. You tap one, and the keyboard offers the next five. The keyboard is the model, the typed words are the context, and the offers are the next-token distribution.",
          breaks:
            "Where it breaks: a phone keyboard sees a short message, while a model reads a long context and can use a fact from the first line.",
        },
        {
          kind: "paragraph",
          id: "foundation-models-p-6a",
          text: "The keyboard offers a size for each word, and the tap picks one word. The model does the same with a probability for each token, and it repeats the choice.",
        },
        {
          kind: "paragraph",
          id: "foundation-models-p-6",
          text: "Prediction: you type The parcel is. Which offer is large, late or purple, and why?",
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
          id: "foundation-models-p-7",
          text: "One forward pass turns a prompt into the next token. The model repeats the pass for each output token.",
        },
        {
          kind: "list",
          id: "foundation-models-list-1",
          ordered: true,
          items: [
            "Split the prompt into tokens with the tokenizer.",
            "Map each token to an id and an embedding vector.",
            "Add position information to each vector.",
            "Run attention so each token weighs the other tokens.",
            "Pass each vector through feed-forward blocks.",
            "Turn the final vector into one logit per vocabulary token.",
            "Apply softmax, sample one token, append it, and repeat.",
          ],
        },
        {
          kind: "paragraph",
          id: "foundation-models-p-8",
          text: "A token is often a word piece, not a whole word. English text uses about 1.3 tokens per word on a common tokenizer. A token count is the unit for cost, latency and the context budget.",
        },
        {
          kind: "paragraph",
          id: "foundation-models-p-9",
          text: "Attention computes a score between each pair of tokens. A softmax turns the scores into weights. Each token then mixes the values of the tokens it weighs. A pronoun can weigh its noun, and a label can weigh the rule above it.",
        },
        {
          kind: "paragraph",
          id: "foundation-models-p-10",
          text: "The model outputs a logit for every token in the vocabulary. Softmax turns the logits into a probability distribution. Next-token prediction samples from this distribution and appends the token. The model then runs again. The output length is the number of repeats.",
        },
        {
          kind: "paragraph",
          id: "foundation-models-p-11",
          text: "The context window is the maximum number of tokens in one call. A larger window costs more attention work and more memory. Text past the window is dropped or fails, and many clients drop it without an error. Treat the window as a budget for input plus output.",
        },
        {
          kind: "table",
          id: "foundation-models-table-1",
          columns: ["Stage", "Input", "Output"],
          rows: [
            ["Tokenize", "Text", "Token ids"],
            ["Embed", "Token ids", "Vectors"],
            ["Attention", "Vectors", "Mixed vectors"],
            ["Predict", "Final vector", "Token probabilities"],
            ["Decode", "Probabilities and settings", "One token"],
          ],
          caption: "The input and output of each stage in one forward pass.",
        },
        {
          kind: "diagram",
          id: "foundation-models-diagram-1",
          variant: "flow",
          spec: {
            nodes: [
              { id: "text", label: "Text" },
              { id: "tokens", label: "Tokenizer" },
              { id: "embed", label: "Embedding" },
              { id: "transformer", label: "Attention blocks" },
              { id: "softmax", label: "Softmax" },
              { id: "next", label: "Next token" },
            ],
            edges: [
              ["text", "tokens"],
              ["tokens", "embed"],
              ["embed", "transformer"],
              ["transformer", "softmax"],
              ["softmax", "next"],
            ],
          },
          caption:
            "One pass turns text into a token distribution, and the loop appends one token at a time.",
          alt: "Flow from text through a tokenizer, embedding, attention blocks and softmax to the next token.",
        },
      ],
    },
    {
      id: "eli5-a-spotlight",
      title: "A spotlight in a crowded room",
      register: "eli5",
      blocks: [
        {
          kind: "analogy",
          id: "foundation-models-analogy-2",
          text: "Think of a crowded room with one spotlight. Each person speaks, and the spotlight turns to the people who matter for the next word. A pronoun turns the light to the noun it names. Attention is the spotlight, and the people are the tokens.",
          breaks:
            "Where it breaks: a spotlight shows one clear focus, while attention holds many small weights at the same time.",
        },
        {
          kind: "paragraph",
          id: "foundation-models-p-12a",
          text: "The spotlight does not light every person with equal strength. Attention gives a large weight to a few tokens and a small weight to the rest. The weights change for each next word.",
        },
        {
          kind: "paragraph",
          id: "foundation-models-p-12",
          text: "Prediction: in the sentence The label follows the ticket because it is late, which token does the spotlight put on it?",
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
          id: "foundation-models-p-13",
          text: "Most foundation-model faults leave a token trace. Count tokens before you read the prompt for style.",
        },
        {
          kind: "table",
          id: "foundation-models-table-2",
          columns: ["Symptom", "Cause", "Check", "Fix"],
          rows: [
            [
              "The final instruction is ignored on a long ticket",
              "The prompt exceeds the context window",
              "Count input tokens and compare them with the window",
              "Chunk the text or move the rule to the front",
            ],
            [
              "A rare product code splits into many tokens",
              "The tokenizer has no token for the code",
              "Tokenize the code and count the pieces",
              "Add a short alias or a glossary in the prompt",
            ],
            [
              "The model repeats one phrase",
              "Sampling loops on a high-probability token",
              "Read the token probabilities at each step",
              "Change the sampling setting or add a stop sequence",
            ],
            [
              "Two runs give different labels",
              "The sampling setting allows variation",
              "Set a seed and temperature zero",
              "Fix the seed for the eval run",
            ],
          ],
          caption: "Four token faults, each with one check.",
        },
        {
          kind: "paragraph",
          id: "foundation-models-p-14",
          text: "A larger context window removes some truncation and raises cost, latency and attention work on every call. The window is a budget, not a free feature.",
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
          id: "foundation-models-p-15",
          text: "The support assistant drops the last line of a long ticket. The trace shows 9,400 input tokens and a context window of 8,192. The client sends the first 8,192 tokens and adds no error. The ticket closes with the line Do not refund this order. That line sits past the cut, so the model never reads it and writes a refund reply.",
        },
        {
          kind: "paragraph",
          id: "foundation-models-p-16",
          text: "The trace names the layer. The tokenizer is correct, and the model reads every token that it receives. The application builds the prompt and cuts it at the window. The missing line is an application fault, not a model fault.",
        },
        {
          kind: "paragraph",
          id: "foundation-models-p-17",
          text: "The decision is a context budget in the application. Move the rules and the current ticket to the front. Summarize the old history into a short block. Split very long tickets into two calls with a shared label. The repair changes no model weight, and the same fix covers every long ticket.",
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
          id: "foundation-models-p-18",
          text: "Answer five questions on the token, the stage, the failure and the count.",
        },
        { kind: "check", id: "foundation-models-check-1", checkId: "check-1" },
        { kind: "check", id: "foundation-models-check-2", checkId: "check-2" },
        { kind: "check", id: "foundation-models-check-3", checkId: "check-3" },
        { kind: "check", id: "foundation-models-check-4", checkId: "check-4" },
        { kind: "check", id: "foundation-models-check-5", checkId: "check-5" },
      ],
    },
    {
      id: "evaluation-task",
      title: "Evaluation task",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "foundation-models-p-19",
          text: "Use the four fixed tickets and the window of 8,192 tokens. Build one script that counts tokens, marks an overflow, and reports whether the model can read the rule. The check rule is fixed: a rule at the end counts as read only when the input stays within 7,000 tokens. Before the repair, two of four tickets pass. After the repair, four of four pass, and ticket t2 falls from 9,000 to 4,500 tokens.",
        },
        { kind: "task", id: "task-foundation-models" },
      ],
    },
    {
      id: "prove-the-change",
      title: "Prove the change",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "foundation-models-p-20",
          text: "Write one sentence with the form: I changed X; the result was Y. Name the token count before and after, and the rule that moved.",
        },
        {
          kind: "paragraph",
          id: "foundation-models-p-21",
          text: "Self-rubric: mechanism names the context window and the cut; evidence gives a fixed token count or pass count; limit names one ticket that still fails.",
        },
        {
          kind: "note",
          id: "foundation-models-note-1",
          text: "A prompt that fits the window is not the same as a prompt that keeps the rule.",
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
          id: "foundation-models-interview-1",
          items: [
            {
              question: "What is a token, and why does a model read tokens?",
              answer:
                "A token is a unit of text that a tokenizer maps to an id. The model runs matrix operations on ids and embeddings, so text must become numbers first. English uses about 1.3 tokens per word, and code uses more.",
            },
            {
              question: "When do you choose a larger context window over retrieval?",
              answer:
                "Choose a larger window when the task needs the whole document and the corpus is small. Choose retrieval when the corpus is large, changes often, or needs citations. A larger window raises cost and latency on every call, and a long context can still lose a fact in the middle.",
            },
            {
              question: "How does a foundation model fail on long input, and what do you check?",
              answer:
                "The context window cuts text with no error, so the final rule can vanish. Count the input tokens and compare them with the window before you read the answer. If the rule sits past the cut, move the rule to the front and summarize the history.",
            },
            {
              question: "How does token count change cost at 10x traffic?",
              answer:
                "Cost grows with input tokens plus output tokens, so 10x traffic costs about 10x at a fixed prompt size. Cut repeated policy text and cache a stable prefix to lower the input count. Track tokens per request beside latency, because a larger context raises both.",
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
      prompt: "Which sentence defines a token?",
      options: [
        { id: "option-a", label: "One whole word in any language." },
        { id: "option-b", label: "One character in the input text." },
        { id: "option-c", label: "A unit of text that a tokenizer maps to a number." },
        { id: "option-d", label: "One probability in the output distribution." },
      ],
      correctOptionId: "option-c",
      explanation:
        "A token is a unit of text that the tokenizer maps to an id, and the unit can be a word, a word piece or a symbol. A character is smaller than a token, and a word can hold several tokens.",
    },
    {
      id: "check-2",
      kind: "apply",
      prompt: "Which stage turns the final vector into a probability for each vocabulary token?",
      options: [
        { id: "option-a", label: "The tokenizer" },
        { id: "option-b", label: "The embedding table" },
        { id: "option-c", label: "The softmax" },
        { id: "option-d", label: "The feed-forward block" },
      ],
      correctOptionId: "option-c",
      explanation:
        "The model produces one logit per token, and softmax turns the logits into a distribution. The tokenizer only splits text, and the embedding table only maps ids to vectors.",
    },
    {
      id: "check-3",
      kind: "diagnose",
      prompt:
        "A model ignores the final rule on a ticket. The client sends 8,192 input tokens and the window is 8,192. What is the likely cause?",
      options: [
        { id: "option-a", label: "The tokenizer is broken" },
        { id: "option-b", label: "The context window cut the final rule" },
        { id: "option-c", label: "The embedding table lost a row" },
        { id: "option-d", label: "The temperature is too low" },
      ],
      correctOptionId: "option-b",
      explanation:
        "The input uses the full window, so any text after the cut is dropped before the model reads it. A low temperature changes the choice among tokens but cannot restore a missing rule.",
    },
    {
      id: "check-4",
      kind: "calculate",
      prompt:
        "A document has 2,000 English words, and the tokenizer uses 1.3 tokens per word. About how many tokens does the document hold?",
      options: [
        { id: "option-a", label: "1,300 tokens" },
        { id: "option-b", label: "2,000 tokens" },
        { id: "option-c", label: "2,600 tokens" },
        { id: "option-d", label: "20,000 tokens" },
      ],
      correctOptionId: "option-c",
      explanation:
        "2,000 words times 1.3 tokens per word is 2,600 tokens. A value of 2,000 assumes one token per word, and English text usually needs more.",
    },
    {
      id: "check-5",
      kind: "diagnose",
      prompt:
        "A rare product code splits into nine tokens and uses much of the budget. Which component explains this?",
      options: [
        { id: "option-a", label: "The tokenizer" },
        { id: "option-b", label: "The attention head" },
        { id: "option-c", label: "The softmax" },
        { id: "option-d", label: "The context window" },
      ],
      correctOptionId: "option-a",
      explanation:
        "The tokenizer decides how text splits, and a rare code can split into several pieces. The context window only limits the total count, and it does not decide the split.",
    },
  ],
  task: {
    id: "task-foundation-models",
    scope:
      "Count tokens for four fixed tickets, detect an overflow, and repair the prompt order.",
    items: [
      {
        id: "item-1",
        label: "Write the window size and the fixed rule-position check.",
      },
      {
        id: "item-2",
        label: "Count the tokens for each fixed ticket and mark an overflow.",
      },
      {
        id: "item-3",
        label: "Report whether the model can read the rule before the repair.",
      },
      {
        id: "item-4",
        label: "Apply the repair: summarize history and move the rule to the front.",
      },
      {
        id: "item-5",
        label: "Report the before and after counts, then apply the rule to a fifth held ticket.",
      },
    ],
    solution: {
      filename: "tokens/fit.py",
      language: "python",
      code: [
        "WINDOW = 8192",
        "LATE_RULE_LIMIT = 7000",
        "",
        "TICKETS = [",
        '    {"id": "t1", "tokens": 4200, "history": 3000, "rule_position": "end"},',
        '    {"id": "t2", "tokens": 9000, "history": 6000, "rule_position": "end"},',
        '    {"id": "t3", "tokens": 7800, "history": 5200, "rule_position": "end"},',
        '    {"id": "t4", "tokens": 3000, "history": 1800, "rule_position": "front"},',
        "]",
        "",
        'HELD = {"id": "h1", "tokens": 8600, "history": 4000, "rule_position": "end"}',
        "",
        'print(f"window {WINDOW} late rule limit {LATE_RULE_LIMIT}")',
        "print()",
        "",
        "",
        "def overflows(ticket):",
        "    return ticket[\"tokens\"] > WINDOW",
        "",
        "",
        "def rule_is_read(ticket):",
        "    if overflows(ticket):",
        "        return False",
        "    if ticket[\"rule_position\"] == \"end\" and ticket[\"tokens\"] > LATE_RULE_LIMIT:",
        "        return False",
        "    return True",
        "",
        "",
        "def repair(ticket):",
        "    fixed = dict(ticket)",
        "    fixed[\"rule_position\"] = \"front\"",
        "    if overflows(fixed):",
        "        fixed[\"tokens\"] = fixed[\"tokens\"] - fixed[\"history\"] + 1500",
        "        fixed[\"history\"] = 1500",
        "    return fixed",
        "",
        "",
        "before = sum(1 for ticket in TICKETS if rule_is_read(ticket))",
        "print(f\"before: {before} of {len(TICKETS)} tickets read the rule\")",
        "for ticket in TICKETS:",
        '    state = "reads" if rule_is_read(ticket) else "misses"',
        '    print(f"{ticket[\'id\']} tokens {ticket[\'tokens\']} rule at {ticket[\'rule_position\']}: {state}")',
        "",
        "REPAIRED = [repair(ticket) for ticket in TICKETS]",
        "after = sum(1 for ticket in REPAIRED if rule_is_read(ticket))",
        "print(f\"after:  {after} of {len(REPAIRED)} tickets read the rule\")",
        "for ticket in REPAIRED:",
        '    print(f"{ticket[\'id\']} tokens {ticket[\'tokens\']} rule at {ticket[\'rule_position\']}")',
        "",
        'held_fixed = repair(HELD)',
        'print(f"{HELD[\'id\']} held before {rule_is_read(HELD)} after {rule_is_read(held_fixed)}")',
        'print(f"{HELD[\'id\']} tokens {HELD[\'tokens\']} -> {held_fixed[\'tokens\']}")',
      ].join("\n"),
    },
  },
  prove: {
    prompt: "Which ticket did you repair, and how did the token count change?",
    placeholder: "I changed X; the result was Y.",
    maxLength: 280,
    debounceMs: 800,
    savedMessage: "Proof saved on this device.",
  },
  citation:
    "Further reading: AI Engineering by Chip Huyen (O'Reilly). This course is independent and reproduces no book text or figures.",
} as const satisfies Lesson);
