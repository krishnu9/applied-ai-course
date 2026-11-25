import type { Lesson } from "@/lib/types";
import { deepFreeze } from "../freeze";

export const loraMemoryLesson = deepFreeze({
  slug: "lora-memory",
  order: 18,
  title: "LoRA and memory maths",
  chapterId: "ch-07",
  chapterOrder: 7,
  status: "live",
  outcome:
    "You can define LoRA, calculate its trainable parameters and memory, and choose a serving design. Prerequisite: lesson 17, fine-tuning.",
  artifact: "A memory budget script for three ranks and two base precisions.",
  readingMinutes: 24,
  difficulty: "advanced",
  terms: [
    {
      term: "LoRA",
      definition: "A PEFT method that adds low-rank matrices to frozen weights.",
    },
    {
      term: "Rank (LoRA rank)",
      definition: "The inner dimension of a LoRA update; it sets the adapter size.",
    },
    {
      term: "Adapter",
      definition: "A small trained module that is added to a frozen base model.",
    },
    {
      term: "QLoRA",
      definition: "LoRA on a quantized base model, to cut GPU memory.",
    },
    {
      term: "Optimizer state",
      definition: "The stored momentum and variance that a training step needs.",
    },
    {
      term: "VRAM (GPU memory)",
      definition: "The memory on the accelerator that limits model and batch size.",
    },
  ],
  evalCase: {
    id: "case-lora-memory",
    brief: "Calculate whether a LoRA run fits the GPU.",
  },
  sections: [
    {
      id: "what-it-is",
      title: "What it is",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "lora-memory-p-1",
          text: "LoRA is a PEFT method that adds low-rank matrices to frozen weights. PEFT (parameter-efficient fine-tuning) trains a small fraction of the parameters. LoRA freezes the base weight W and learns two small matrices, A and B. The update is B times A, so the trained part has a low rank r.",
        },
        {
          kind: "paragraph",
          id: "lora-memory-p-2",
          text: "A worked example: a 7B model has a hidden width of 4,096 and 32 layers. A team adds LoRA at rank 16 to four projection matrices in each layer. The adapter holds 16.8 million trainable parameters, or about 0.24 percent of the base. The base weights never change.",
        },
        {
          kind: "paragraph",
          id: "lora-memory-p-3",
          text: "A non-example: full fine-tuning updates every weight. For a 7B model, the weight, gradient, master copy and optimizer state need about 112 GB before activations. That does not fit a 24 GB card. LoRA fits, because it stores a small adapter and no gradient for the frozen base.",
        },
        {
          kind: "paragraph",
          id: "lora-memory-p-4",
          text: "The memory budget has four parts: base weights, adapter weights, optimizer state and activations. A design that ignores one part can pass a hand calculation and fail at the first training step.",
        },
      ],
    },
    {
      id: "eli5-laminate-on-a-door",
      title: "A laminate slip on a heavy door",
      register: "eli5",
      blocks: [
        {
          kind: "analogy",
          id: "lora-memory-analogy-1",
          text: "Think of a heavy steel door that is fixed in place. The door is the frozen base model, and it costs a lot to move. A thin laminate sheet carries a new pattern, and a worker sticks it on the door; that sheet is the LoRA adapter. The rank is the number of lines in the pattern, so a higher rank holds more detail and needs a larger sheet. The worker changes the sheet and never recasts the door.",
          breaks:
            "A laminate changes only the surface, and it cannot add a room. LoRA changes the form of an answer, but it cannot add a fact that the base never held.",
        },
        {
          kind: "paragraph",
          id: "lora-memory-p-5",
          text: "Prediction: two tenants need different patterns on the same door. Do you cast two doors or cut two sheets, and why?",
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
          id: "lora-memory-p-6",
          text: "The system trades trainable parameters for a frozen base. The arithmetic below predicts the memory before a run.",
        },
        {
          kind: "list",
          id: "lora-memory-list-1",
          ordered: true,
          items: [
            "Choose the matrices to adapt, usually the query, key, value and output projections.",
            "Set the rank r and the scale alpha; alpha divided by r sets the update size.",
            "Freeze the base weight W and add A and B with the chosen rank.",
            "Count trainable parameters as r times the input width plus the output width.",
            "Add adapter weights, gradients and optimizer state to the budget.",
            "Add the frozen base at its storage precision.",
            "Add activation memory, which grows with batch size and sequence length.",
            "Decide whether to serve the adapter separate or merged into the base.",
          ],
        },
        {
          kind: "paragraph",
          id: "lora-memory-p-7",
          text: "The rank sets the adapter size. For one weight matrix of height d and width k, the two factors hold r times k plus d times r parameters. A rank of 16 on a 4,096 by 4,096 matrix holds 131,072 parameters per matrix. Four matrices in each of 32 layers hold 16,777,216 parameters. A rank of 32 doubles that count, and a rank of 8 halves it.",
        },
        {
          kind: "paragraph",
          id: "lora-memory-p-8",
          text: "The frozen base dominates memory. A 7B base at FP16 uses 2 bytes per parameter, or 14 GB. The same base at 4 bits uses about 0.5 bytes per parameter, or 3.5 GB. The adapter at rank 16 holds 16.8 million parameters and adds about 201 MB for its weight, gradient and optimizer state. A higher rank changes the small number, not the large one.",
        },
        {
          kind: "paragraph",
          id: "lora-memory-p-9",
          text: "Optimizer state is the hidden cost. Adam keeps two moments for each trainable parameter, and each moment is often 32 bits. Add 2 bytes for the adapter weight, 2 for its gradient and 8 for the two moments, so budget 12 bytes per trainable parameter. A full fine-tune stores an FP16 weight, a gradient, an FP32 master copy and two moments, so budget 16 bytes per base parameter.",
        },
        {
          kind: "paragraph",
          id: "lora-memory-p-10",
          text: "Activation memory is the part that surprises teams. It grows with batch size, sequence length, layer count and hidden width. A run with 4 GB of base and 9 GB of activations can still fail on a 16 GB card. Gradient checkpointing stores fewer activations and recomputes them, which cuts memory and adds compute time.",
        },
        {
          kind: "paragraph",
          id: "lora-memory-p-11",
          text: "QLoRA stores the frozen base at 4 bits and computes each layer in a higher precision. The adapter stays in FP16 or BF16, and a paged optimizer can move state to host memory. The base falls by about 75 percent, so the same card holds a larger batch. The trade is dequantization work in each forward and backward pass.",
        },
        {
          kind: "paragraph",
          id: "lora-memory-p-12",
          text: "Serving has two designs. Keep the adapter separate and load one frozen base plus one small adapter per task. This saves base memory and allows a swap per request. The extra kernel adds a small latency. Merge the adapter into the base with W plus B times A, then serve one artifact with no extra latency. Measure the merged and separate paths before you choose.",
        },
        {
          kind: "table",
          id: "lora-memory-table-1",
          columns: ["Stage", "Input", "Output"],
          rows: [
            ["Base load", "Base size, precision", "Frozen VRAM in bytes"],
            ["Adapter", "Rank, widths, matrix count", "Trainable parameter count"],
            ["Optimizer", "Trainable count, moment bytes", "Adapter plus state bytes"],
            ["Serve", "Batch, sequence length", "Activation bytes and p95"],
          ],
          caption: "Inputs and outputs of one memory budget.",
        },
        {
          kind: "diagram",
          id: "lora-memory-diagram-1",
          variant: "bars",
          spec: {
            nodes: [
              { id: "fp16", label: "FP16 base", value: 14336, unit: "MB" },
              { id: "int4", label: "4-bit base", value: 3584, unit: "MB" },
              { id: "r8", label: "Rank 8 adapter", value: 101, unit: "MB" },
              { id: "r16", label: "Rank 16 adapter", value: 201, unit: "MB" },
              { id: "r32", label: "Rank 32 adapter", value: 403, unit: "MB" },
            ],
            edges: [
              ["fp16", "int4"],
              ["int4", "r8"],
              ["r8", "r16"],
              ["r16", "r32"],
            ],
          },
          caption:
            "The frozen base dominates memory; rank changes only the small adapter.",
          alt: "Bars from a 14,336 MB FP16 base down to a 3,584 MB 4-bit base and adapters of 101, 201 and 403 MB.",
        },
        {
          kind: "paragraph",
          id: "lora-memory-p-13",
          text: "Use the budget as a gate, not a guess. If the base plus activations exceeds the card, lower precision or batch size before you touch the rank. If the loss stays flat, then sweep the rank and the learning rate.",
        },
        {
          kind: "paragraph",
          id: "lora-memory-p-13b",
          text: "Rank is a capacity dial. A rank of 4 to 8 fits a narrow style. A rank of 16 to 32 fits a harder task. A rank of 64 holds about 67 million parameters, roughly 1 percent of the 7B base. Sweep two ranks and compare them on the held-out set, because a higher rank can fit noise.",
        },
        {
          kind: "paragraph",
          id: "lora-memory-p-13c",
          text: "The scale alpha divided by r keeps the update size stable when the rank changes. If you raise the rank and hold alpha, the update grows and the run can diverge. Record alpha with the rank in the run record, or a later run cannot repeat it.",
        },
        {
          kind: "paragraph",
          id: "lora-memory-p-13d",
          text: "Step time is part of the budget. QLoRA adds dequantization work, so a step can run 20 to 40 percent slower. The larger batch or the base that fits can still win on tokens per second. Measure throughput as well as peak VRAM.",
        },
        {
          kind: "paragraph",
          id: "lora-memory-p-13e",
          text: "A run can pass the memory gate and fail the quality gate. Score the adapter on the frozen held-out set from lesson 17, with one score per slice. A merged artifact and a separate adapter can score differently, so test the path you plan to serve.",
        },
      ],
    },
    {
      id: "eli5-notes-in-a-manual",
      title: "Sticky notes in a printed manual",
      register: "eli5",
      blocks: [
        {
          kind: "analogy",
          id: "lora-memory-analogy-2",
          text: "Think of a large printed manual that stays on the desk. A reader adds sticky notes in the margins; the notes are the LoRA adapter, and the number of notes per page is the rank. A pencil and an eraser are the optimizer state, because the reader needs them to edit the notes. A smaller-print edition of the manual is QLoRA, because it leaves more desk space for the notes.",
          breaks:
            "A note can cover a useful line or fall off the page. A low-rank adapter can hide a skill or fail to fit a hard case.",
        },
        {
          kind: "paragraph",
          id: "lora-memory-p-14",
          text: "Prediction: the manual needs 14 GB of desk and the desk holds 16 GB. Do you shrink the manual or the notes, and which number changes?",
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
          id: "lora-memory-table-2",
          columns: ["Symptom", "Cause", "Check", "Fix"],
          rows: [
            [
              "CUDA out of memory at step 1",
              "Activation memory, not the adapter",
              "Add base and activation bytes",
              "Use QLoRA or gradient checkpointing",
            ],
            [
              "Loss stays flat",
              "Rank too low or learning rate wrong",
              "Sweep rank 8 and 16",
              "Raise the rank or tune the rate",
            ],
            [
              "Quality drops after merge",
              "Merge precision or scale error",
              "Compare merged and adapter outputs",
              "Merge in FP32 and check alpha over r",
            ],
            [
              "Serving p95 rises",
              "Adapter kernel overhead",
              "Measure with and without the adapter",
              "Merge the hot tenant",
            ],
          ],
          caption: "Four failures, from the card back to the adapter.",
        },
        {
          kind: "paragraph",
          id: "lora-memory-p-15",
          text: "QLoRA cuts memory and adds dequantization time. Separate adapters add flexibility and a kernel cost. A merge removes latency and adds one artifact per task, so the count of tasks sets the choice.",
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
          id: "lora-memory-p-16",
          text: "The team trains a reply-style adapter on the 7B base from lesson 17. The card holds 24 GB. The run uses FP16, rank 16, batch 8 and 4,000-token tickets. It stops at step 1 with an out-of-memory error.",
        },
        {
          kind: "paragraph",
          id: "lora-memory-p-17",
          text: "The trace separates the parts. Base weights take 14 GB. Activations at this batch and length take 9 GB. The adapter, gradient and optimizer state take 0.20 GB. The CUDA context and fragmentation take about 1 GB. The total is 24.2 GB, so the card is over budget before the first update.",
        },
        {
          kind: "paragraph",
          id: "lora-memory-p-18",
          text: "The first attempt lowers the rank to 8. Memory barely moves, because the base and the activations dominate. The team then loads the base at 4 bits and keeps rank 16. Base memory falls from 14 GB to 3.5 GB, and the total falls to about 12.7 GB. The run completes with batch 8.",
        },
        {
          kind: "paragraph",
          id: "lora-memory-p-19",
          text: "Serving holds 8 tenant adapters on one frozen base. Each adapter is about 0.20 GB, so the adapters add 1.6 GB. The separate path adds about 3 ms to p95. The top tenant moves to a merged artifact, and its p95 returns to the base level. The other tenants keep separate adapters for a cheap swap.",
        },
      ],
    },
    {
      id: "check-whether-it-fits",
      title: "Check whether it fits",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "lora-memory-p-20",
          text: "Set the base size, the rank and the precision. The three numbers show trainable parameters, adapter plus optimizer bytes, and frozen base bytes. Try the 13B base at FP16, then switch to 4-bit: the adapter does not change, but the base falls by 75 percent. Watch which number moves.",
        },
        {
          kind: "interactive",
          id: "lora-memory-interactive-1",
          widget: "lora-memory-lab",
          caption:
            "Change rank, base size and precision; watch the adapter and base memory move.",
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
          id: "lora-memory-p-21",
          text: "Answer six questions on the definition, the arithmetic and the serving choice.",
        },
        { kind: "check", id: "lora-memory-check-1", checkId: "check-1" },
        { kind: "check", id: "lora-memory-check-2", checkId: "check-2" },
        { kind: "check", id: "lora-memory-check-3", checkId: "check-3" },
        { kind: "check", id: "lora-memory-check-4", checkId: "check-4" },
        { kind: "check", id: "lora-memory-check-5", checkId: "check-5" },
        { kind: "check", id: "lora-memory-check-6", checkId: "check-6" },
      ],
    },
    {
      id: "evaluation-task",
      title: "Evaluation task",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "lora-memory-p-22",
          text: "Use the fixed 7B base: width 4,096, 32 layers, four adapted matrices per layer, and 4 GB of activations. Compute the budget for ranks 8, 16 and 32 at FP16 and 4-bit. Then decide the fit on a 16 GB and a 24 GB card.",
        },
        { kind: "task", id: "task-lora-memory" },
        {
          kind: "paragraph",
          id: "lora-memory-p-23",
          text: "The reference solution prints 8.39M, 16.78M and 33.55M trainable parameters. It prints 100.7, 201.3 and 402.7 MB of adapter, gradient and optimizer state. The FP16 rank 16 total is 18.20 GB, so it fails on 16 GB and fits on 24 GB. The 4-bit total is 7.70 GB and fits both cards. With 8 GB of activations, FP16 is 22.20 GB and still fits 24 GB, while 4-bit is 11.70 GB and fits 16 GB.",
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
          id: "lora-memory-p-24",
          text: "Write one sentence with the form: I changed X; the result was Y. Name the part you changed and the memory or latency number. Example: I switched the base to 4 bits at rank 16. Peak VRAM fell from 24.2 GB to 12.7 GB, and p95 rose by 2 ms.",
        },
        {
          kind: "paragraph",
          id: "lora-memory-p-25",
          text: "Self-rubric: mechanism names the budget part and the rule; evidence gives a fixed byte count or latency; limit names one quality or serving risk.",
        },
        {
          kind: "note",
          id: "lora-memory-note-1",
          text: "Rank is the number everyone tunes and the number that rarely fixes an out-of-memory error.",
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
          id: "lora-memory-interview-1",
          items: [
            {
              question: "What is LoRA, and what does the rank control?",
              answer:
                "LoRA freezes the base weights and learns two low-rank matrices whose product updates the output. The rank is the inner dimension, so it sets the adapter size and the number of trainable parameters. A rank of 16 on a 7B model can hold about 16.8 million trainable parameters, or 0.24 percent of the base. A held-out score decides whether that rank is enough.",
            },
            {
              question: "When do you choose QLoRA over LoRA?",
              answer:
                "Choose QLoRA when the frozen base does not fit beside the activations at FP16. A 7B base falls from 14 GB to about 3.5 GB at 4 bits, which frees room for a larger batch. The trade is dequantization work, so measure step time and quality before you commit.",
            },
            {
              question: "How does a LoRA run fail, and what do you check first?",
              answer:
                "The common failure is an out-of-memory stop that teams blame on rank. Add the base, adapter, optimizer and activation bytes before you change the rank. If memory is fine but loss is flat, sweep the rank and the learning rate, then compare the merged and separate serving paths.",
            },
            {
              question: "How does LoRA change at 10x tenants or traffic?",
              answer:
                "At 10x tenants, separate adapters save base memory but add a swap and a kernel cost per request. At 10x traffic, merge the hot adapters to remove that cost and keep separate artifacts for the long tail. Budget adapter bytes as rank times width, and track p95 per path.",
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
      prompt: "Which sentence defines LoRA?",
      options: [
        { id: "option-a", label: "It freezes the base and adds low-rank matrices." },
        { id: "option-b", label: "It stores the base at 4 bits and trains every weight." },
        { id: "option-c", label: "It removes layers from the base model." },
        { id: "option-d", label: "It retrieves documents at answer time." },
      ],
      correctOptionId: "option-a",
      explanation:
        "LoRA keeps the base frozen and learns a low-rank update, so only the adapter trains. Quantizing the base is QLoRA, and retrieval is a separate design.",
    },
    {
      id: "check-2",
      kind: "calculate",
      prompt: "A 7B base has width 4,096, 32 layers and four adapted matrices per layer. At rank 16, how many parameters train?",
      options: [
        { id: "option-a", label: "1.68M" },
        { id: "option-b", label: "8.39M" },
        { id: "option-c", label: "16.78M" },
        { id: "option-d", label: "33.55M" },
      ],
      correctOptionId: "option-c",
      explanation:
        "Each matrix trains 16 times 8,192, or 131,072 parameters, and 4 times 32 matrices give 16,777,216. A value of 8.39M is the rank 8 count, and 33.55M is the rank 32 count.",
    },
    {
      id: "check-3",
      kind: "calculate",
      prompt: "The adapter trains 16.78M parameters. Budget 12 bytes per trainable parameter. What is the adapter plus gradient and optimizer memory?",
      options: [
        { id: "option-a", label: "100.7 MB" },
        { id: "option-b", label: "201 MB" },
        { id: "option-c", label: "402.7 MB" },
        { id: "option-d", label: "1.68 GB" },
      ],
      correctOptionId: "option-b",
      explanation:
        "16.78 million times 12 bytes is about 201 MB. A value of 100.7 MB would budget 6 bytes per parameter, which omits the optimizer moments.",
    },
    {
      id: "check-4",
      kind: "apply",
      prompt: "A 7B FP16 base needs 14 GB, activations need 2 GB, and the card holds 16 GB. Which change fits the run first?",
      options: [
        { id: "option-a", label: "Raise the rank to 64" },
        { id: "option-b", label: "Load the base at 4 bits" },
        { id: "option-c", label: "Raise the batch size" },
        { id: "option-d", label: "Add a second adapter" },
      ],
      correctOptionId: "option-b",
      explanation:
        "The base is the large term, and 4 bits cuts it from 14 GB to about 3.5 GB. A higher rank or batch adds memory, and a second adapter adds a small amount.",
    },
    {
      id: "check-5",
      kind: "diagnose",
      prompt: "A run still runs out of memory after the rank drops from 32 to 8. What is the likely cause?",
      options: [
        { id: "option-a", label: "The rank is still too high" },
        { id: "option-b", label: "The base and activations dominate memory" },
        { id: "option-c", label: "The optimizer state is too small" },
        { id: "option-d", label: "The adapter is merged" },
      ],
      correctOptionId: "option-b",
      explanation:
        "The adapter is a small part of the budget, so a rank change cannot free much memory. Lower the base precision or the activation size instead.",
    },
    {
      id: "check-6",
      kind: "calculate",
      prompt: "A 7B base moves from FP16 to 4-bit storage. How much memory does the base save?",
      options: [
        { id: "option-a", label: "3.5 GB" },
        { id: "option-b", label: "7 GB" },
        { id: "option-c", label: "10.5 GB" },
        { id: "option-d", label: "14 GB" },
      ],
      correctOptionId: "option-c",
      explanation:
        "FP16 needs 14 GB and 4-bit needs about 3.5 GB, so the saving is 10.5 GB. A saving of 7 GB would leave the base at 7 GB, which is still 1 byte per parameter.",
    },
  ],
  task: {
    id: "task-lora-memory",
    scope: "Compute a LoRA memory budget for three ranks and two base precisions.",
    items: [
      {
        id: "item-1",
        label: "Count trainable parameters for ranks 8, 16 and 32.",
      },
      {
        id: "item-2",
        label: "Compute adapter, gradient and optimizer bytes at 12 bytes per parameter.",
      },
      {
        id: "item-3",
        label: "Compute frozen base bytes at FP16 and at 4 bits.",
      },
      {
        id: "item-4",
        label: "Decide the fit on a 16 GB and a 24 GB card with 4 GB of activations.",
      },
      {
        id: "item-5",
        label: "Double the activation bytes and state the new fit and one quality risk.",
      },
    ],
    solution: {
      filename: "training/lora_budget.py",
      language: "python",
      code: [
        "WIDTH = 4096",
        "LAYERS = 32",
        "MATRICES = 4",
        "PARAMS = 7_000_000_000",
        "ACTIVATION_GB = 4.0",
        "RANKS = [8, 16, 32]",
        "",
        "",
        "def trainable(rank):",
        "    per_matrix = rank * (WIDTH + WIDTH)",
        "    return MATRICES * LAYERS * per_matrix",
        "",
        "",
        "def gb(bytes_count):",
        "    return bytes_count / 1_000_000_000",
        "",
        "",
        "for rank in RANKS:",
        "    count = trainable(rank)",
        "    state = count * 12",
        "    print(f\"rank {rank}: {count} params, {state / 1_000_000:.1f} MB\")",
        "",
        "base_fp16 = gb(PARAMS * 2)",
        "base_int4 = gb(PARAMS * 0.5)",
        'print(f"base fp16: {base_fp16:.2f} GB")',
        'print(f"base 4-bit: {base_int4:.2f} GB")',
        "",
        "adapter = gb(trainable(16) * 12)",
        "fp16_total = base_fp16 + adapter + ACTIVATION_GB",
        "int4_total = base_int4 + adapter + ACTIVATION_GB",
        'print(f"fp16 r16 total: {fp16_total:.2f} GB -> 16GB no, 24GB yes")',
        'print(f"4-bit r16 total: {int4_total:.2f} GB -> 16GB yes, 24GB yes")',
        "",
        "double = ACTIVATION_GB * 2",
        "fp16_double = base_fp16 + adapter + double",
        "int4_double = base_int4 + adapter + double",
        'print(f"double activations fp16: {fp16_double:.2f} GB -> 24GB yes")',
        'print(f"double activations 4-bit: {int4_double:.2f} GB -> 16GB yes")',
      ].join("\n"),
    },
  },
  prove: {
    prompt: "Which part of the budget did you change, and how did VRAM or p95 move?",
    placeholder: "I changed X; the result was Y.",
    maxLength: 280,
    debounceMs: 800,
    savedMessage: "Proof saved on this device.",
  },
  citation:
    "Further reading: AI Engineering by Chip Huyen (O'Reilly). This course is independent and reproduces no book text or figures.",
} as const satisfies Lesson);
