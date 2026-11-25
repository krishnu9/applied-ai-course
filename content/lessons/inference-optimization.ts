import type { Lesson } from "@/lib/types";
import { deepFreeze } from "../freeze";

export const inferenceOptimizationLesson = deepFreeze({
  slug: "inference-optimization",
  order: 22,
  title: "Make serving cheaper",
  chapterId: "ch-09",
  chapterOrder: 9,
  status: "live",
  outcome:
    "You can define the serving optimizations, measure their effect on cost and p95, and choose one that holds the quality floor. Prerequisite: lesson 21, latency, throughput and goodput.",
  artifact:
    "A memory and quality sheet for one model, with two precision schemes compared.",
  readingMinutes: 22,
  difficulty: "advanced",
  terms: [
    {
      term: "Quantization",
      definition: "The storage of weights or activations in fewer bits.",
    },
    {
      term: "Speculative decoding",
      definition:
        "The use of a small draft model to propose tokens that a large model checks.",
    },
    {
      term: "KV cache",
      definition:
        "Stored key and value tensors that avoid recomputing earlier tokens.",
    },
    {
      term: "Continuous batching",
      definition: "The addition and removal of requests from a running batch.",
    },
    {
      term: "Prefix caching",
      definition:
        "Reuse of a cached prompt prefix to cut cost and time to first token.",
    },
  ],
  evalCase: {
    id: "case-inference-optimization",
    brief: "Meet the cost and p95 targets without a slice drop.",
  },
  sections: [
    {
      id: "what-it-is",
      title: "What it is",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "inference-optimization-p-1",
          text: "Inference optimization is the set of changes that lower the cost of serving a model without lowering quality below the floor. Cost has four parts: weight memory, work per token, serial steps and idle capacity.",
        },
        {
          kind: "paragraph",
          id: "inference-optimization-p-2",
          text: "A model with 8 billion parameters needs 16 GB for weights in fp16. At an 8,000-token context and a batch of 8, its KV cache needs 8 GiB. A 4-bit format cuts the weights to 4 GB. Continuous batching keeps the slots full, and prefix caching removes a repeated 1,000-token prefix. Cost and p95 fall, and the eval set checks the quality floor.",
        },
        {
          kind: "paragraph",
          id: "inference-optimization-p-3",
          text: "A non-example: a shorter system prompt lowers the bill, but it is not inference optimization. It changes the input, not the serving engine.",
        },
      ],
    },
    {
      id: "eli5-a-delivery-depot",
      title: "A delivery depot",
      register: "eli5",
      blocks: [
        {
          kind: "analogy",
          id: "inference-optimization-analogy-1",
          text: "Think of a depot that ships parcels. A clerk reads the whole order before packing; that first read is prefill. Parcels then leave one at a time, and that line is decode. A shelf keeps open orders so the clerk does not re-read them; that shelf is the KV cache. Packing several orders in one trip saves fuel, and a pre-packed standard box skips the first steps.",
          breaks:
            "Where it breaks: a depot can hold every parcel on a shelf, while a model must keep the KV cache in fast memory, and that memory can run out.",
        },
        {
          kind: "paragraph",
          id: "inference-optimization-p-5",
          text: "Prediction: which trick helps most when every order starts with the same address label, and which trick helps when every order asks for the same 80 parcels?",
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
          id: "inference-optimization-p-6",
          text: "Measure first: split the latency into queue, prefill, decode and memory. Then pull one lever and re-measure cost and p95.",
        },
        {
          kind: "list",
          id: "inference-optimization-list-1",
          ordered: true,
          items: [
            "Measure prefill time, decode time, queue time and peak memory.",
            "Quantize the weights to 8 or 4 bits, then check the eval set by slice.",
            "Prune weights or layers that carry little signal, and repair the model.",
            "Keep a KV cache, page it, and evict the oldest blocks.",
            "Cache the shared prefix and hash the exact prefix bytes.",
            "Add a draft model for speculative decoding and measure accepted tokens.",
            "Batch continuously and re-measure p95 and goodput.",
          ],
        },
        {
          kind: "paragraph",
          id: "inference-optimization-p-7",
          text: "Quantization stores each weight or activation in fewer bits. It cuts memory and bandwidth, which limits decode. The cost is rounding error, and rare tokens carry the most. Check the eval by slice, not only in total.",
        },
        {
          kind: "paragraph",
          id: "inference-optimization-p-8",
          text: "Pruning removes weights, heads or layers that carry little signal. A structured cut removes a whole row, so the hardware runs faster; a sparse cut may not. Pruning needs repair, and it can hurt a rare slice.",
        },
        {
          kind: "paragraph",
          id: "inference-optimization-p-9",
          text: "The KV cache holds the key and value tensors for every past token. Its size is 2 times layers times heads times head dimension times context times batch times bytes; the 2 covers key and value. Paging moves old blocks to slower memory.",
        },
        {
          kind: "paragraph",
          id: "inference-optimization-p-10",
          text: "Prefix caching reuses the prefill of a shared prefix, such as the system prompt. It cuts TTFT and input cost. The key must include the model, the template version and the tenant.",
        },
        {
          kind: "paragraph",
          id: "inference-optimization-p-11",
          text: "Speculative decoding uses a small draft model to propose several tokens. The large model checks them in one pass and keeps the longest matching prefix. An accepted token costs one check, not one full step.",
        },
        {
          kind: "paragraph",
          id: "inference-optimization-p-12",
          text: "Continuous batching removes a finished request at a step boundary and adds a waiting one. A free slot never idles, so throughput rises. KV memory limits the batch before compute does.",
        },
        {
          kind: "table",
          id: "inference-optimization-table-1",
          columns: ["Technique", "Cost removed", "Main risk"],
          rows: [
            ["Quantization", "Weight memory", "Quality on rare slices"],
            ["Pruning", "Weights and compute", "Quality without repair"],
            ["KV cache", "Recomputed past tokens", "Memory grows with context"],
            ["Prefix caching", "Repeated prefill", "Identical prefix only"],
            ["Speculative decoding", "Serial decode steps", "Low acceptance"],
            ["Continuous batching", "Idle slots", "Latency variance"],
          ],
          caption: "Six levers, each with one cost and one risk.",
        },
        {
          kind: "diagram",
          id: "inference-optimization-diagram-1",
          variant: "stack",
          spec: {
            nodes: [
              {
                id: "weights",
                label: "Weights",
                detail: "Quantization and pruning cut memory",
              },
              {
                id: "kv",
                label: "KV cache",
                detail: "Past tokens are stored, not recomputed",
              },
              {
                id: "prefix",
                label: "Prefix cache",
                detail: "A shared prompt is read once",
              },
              {
                id: "draft",
                label: "Speculative decoding",
                detail: "A draft model proposes, the target checks",
              },
              {
                id: "batch",
                label: "Continuous batching",
                detail: "A free slot takes a waiting request",
              },
              {
                id: "scheduler",
                label: "Scheduler",
                detail: "Sets the step budget and the batch size",
              },
            ],
            edges: [
              ["weights", "kv"],
              ["kv", "prefix"],
              ["prefix", "draft"],
              ["draft", "batch"],
              ["batch", "scheduler"],
            ],
          },
          caption:
            "Each layer removes one cost: weight memory, past-token work, steps, or idle slots.",
          alt: "Stack from weights and the KV cache through the prefix cache, speculative decoding and continuous batching to the scheduler.",
        },
      ],
    },
    {
      id: "eli5-a-pair-of-runners",
      title: "A pair of runners",
      register: "eli5",
      blocks: [
        {
          kind: "analogy",
          id: "inference-optimization-analogy-2",
          text: "Two runners cross a field. The junior runner is fast and guesses the next steps. The senior runner checks the guesses in one pass and keeps the correct lead. When the guesses are right, the pair moves faster than the senior alone. The junior is the draft model, the senior is the target, and the checked lead is the accepted tokens.",
          breaks:
            "Where it breaks: a wrong guess wastes the senior check, a junior who is too slow adds its own time to every step, and the pair still needs the target for the final answer.",
        },
        {
          kind: "paragraph",
          id: "inference-optimization-p-14",
          text: "Prediction: when does the pair run slower than the senior runner alone, and what does a low acceptance rate tell you?",
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
          id: "inference-optimization-table-2",
          columns: ["Symptom", "Cause", "Check", "Fix"],
          rows: [
            [
              "Quality drops on rare tickets after 4-bit",
              "Quantization error",
              "Run the frozen eval by slice",
              "Use 8-bit or a mixed scheme",
            ],
            [
              "TTFT does not fall after prefix caching",
              "The prefix changes on every request",
              "Hash the prefix and count hits",
              "Fix the prefix order and version",
            ],
            [
              "Speculative decoding is slower",
              "Low acceptance rate",
              "Measure accepted tokens per pass",
              "Change the draft model or disable it",
            ],
            [
              "p95 rises after batching",
              "One long request holds the batch",
              "Compare p95 at batch 1 and 8",
              "Use continuous batching or a smaller batch",
            ],
          ],
          caption: "Four optimization failures, each with one check.",
        },
        {
          kind: "paragraph",
          id: "inference-optimization-p-15",
          text: "Every lever trades one resource for another. Quantization trades quality for memory, pruning trades quality for compute, and batching trades tail latency for throughput. A trade is acceptable only when the eval and the p95 target pass.",
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
          id: "inference-optimization-p-16",
          text: "The support assistant costs 0.94 dollars per 1,000 requests and has a p95 of 2,400 ms. The pass rate is 0.74. The team applies 4-bit quantization to every route. Cost falls to 0.31 and p95 to 880 ms.",
        },
        {
          kind: "paragraph",
          id: "inference-optimization-p-17",
          text: "The overall pass rate falls to 0.71, and the billing slice falls from 0.80 to 0.62. The trace shows the cause: invoice corrections need exact digits, and the 4-bit weights round them. The total hides the slice, and 0.71 looked close enough to 0.74 that nobody checked it.",
        },
        {
          kind: "paragraph",
          id: "inference-optimization-p-18",
          text: "The decision is a mixed scheme. Billing traffic keeps 8-bit weights, and the other routes keep 4-bit. The shared system prompt moves behind prefix caching. Cost settles at 0.35, p95 at 1,020 ms, and the billing slice returns to 0.79. The eval gate now runs by slice before any precision change ships, and the gateway records the precision on every request trace.",
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
          id: "inference-optimization-p-19",
          text: "Answer four checks on the definition, the choice, the failure and the memory calculation.",
        },
        { kind: "check", id: "inference-optimization-check-1", checkId: "check-1" },
        { kind: "check", id: "inference-optimization-check-2", checkId: "check-2" },
        { kind: "check", id: "inference-optimization-check-3", checkId: "check-3" },
        { kind: "check", id: "inference-optimization-check-4", checkId: "check-4" },
      ],
    },
    {
      id: "evaluation-task",
      title: "Evaluation task",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "inference-optimization-p-20",
          text: "The task uses one fixed model size, context and measure table. Build one script that prints the weight memory, the KV cache, the quality slice and the chosen scheme.",
        },
        { kind: "task", id: "task-inference-optimization" },
        {
          kind: "paragraph",
          id: "inference-optimization-p-21",
          text: "The reference solution prints 16 GB for fp16 weights, 8 GB at 8-bit and 4 GB at 4-bit. The KV cache is 8 GiB. Full 4-bit gives cost 0.31 and p95 880 ms, and drops the billing slice to 0.62. The mixed scheme gives cost 0.35, p95 1,020 ms and a billing slice of 0.79.",
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
          id: "inference-optimization-p-22",
          text: "Write one sentence with the form: I changed X; the result was Y. Name the lever, the old and new cost and p95, and the slice.",
        },
        {
          kind: "paragraph",
          id: "inference-optimization-p-23",
          text: "Self-rubric: mechanism names the lever and the resource it saves; evidence gives a cost, a percentile and a slice score; limit names one quality or capacity risk.",
        },
        {
          kind: "note",
          id: "inference-optimization-note-1",
          text: "A precision change that passes the total eval can still fail one slice.",
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
          id: "inference-optimization-interview-1",
          items: [
            {
              question: "What is quantization, and what does it trade?",
              answer:
                "Quantization stores weights or activations in fewer bits, such as 8 or 4 bits instead of 16. It cuts memory and memory bandwidth, which speeds decode. The cost is rounding error, and rare tokens or exact digits carry the most error. Check the eval set by slice.",
            },
            {
              question: "When do you choose speculative decoding over a smaller model?",
              answer:
                "Choose speculative decoding when the draft model predicts the target model well and the target must keep its quality. The target still writes every accepted token, so quality is unchanged when verification is exact. A smaller model changes the answer and needs its own eval. Measure accepted tokens per pass before you keep the draft path.",
            },
            {
              question: "How does a cache optimization fail, and what do you check?",
              answer:
                "A prefix cache misses when one byte of the prefix changes, and a KV cache fails when memory runs out. A semantic cache can also return a wrong answer for a close query. Hash the exact prefix, count hits, and alert on the eviction rate. Check the wrong-hit rate on a labeled sample before you trust the cache.",
            },
            {
              question: "How does serving change at 10x traffic or context?",
              answer:
                "At 10x traffic, continuous batching and more replicas hold the p95, and the KV cache becomes the memory limit. At 10x context, the KV cache grows linearly, so paging and prefix reuse carry the load. Measure memory per request before the batch size, because memory runs out first. Re-run the eval by slice after each precision change.",
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
      prompt: "Which sentence defines the KV cache?",
      options: [
        {
          id: "option-a",
          label: "Stored key and value tensors that avoid recomputing earlier tokens.",
        },
        { id: "option-b", label: "A copy of the model weights on a second GPU." },
        { id: "option-c", label: "A queue of requests that wait for a slot." },
        { id: "option-d", label: "A smaller model that proposes tokens." },
      ],
      correctOptionId: "option-a",
      explanation:
        "The KV cache stores the key and value tensors for past tokens, so decode reads state instead of recomputing it. A draft model is speculative decoding, and a request queue is not a cache.",
    },
    {
      id: "check-2",
      kind: "apply",
      prompt:
        "Every request starts with the same 1,000-token system prompt. Which lever cuts TTFT with no quality change?",
      options: [
        { id: "option-a", label: "Pruning the model" },
        { id: "option-b", label: "Prefix caching" },
        { id: "option-c", label: "4-bit quantization" },
        { id: "option-d", label: "A larger batch" },
      ],
      correctOptionId: "option-b",
      explanation:
        "Prefix caching reuses the prefill of an identical prefix, so TTFT falls and the answer is unchanged. Quantization and pruning change the weights and need a quality check.",
    },
    {
      id: "check-3",
      kind: "diagnose",
      prompt:
        "Cost falls after 4-bit quantization, and the billing slice pass rate falls from 0.80 to 0.62. What is the first check?",
      options: [
        { id: "option-a", label: "The total eval score only" },
        { id: "option-b", label: "The billing slice and its exact-digit cases" },
        { id: "option-c", label: "The batch size" },
        { id: "option-d", label: "The GPU clock" },
      ],
      correctOptionId: "option-b",
      explanation:
        "The slice names the failure, and exact digits are the first suspect for rounding error. A total score hides the slice, so it cannot confirm the cause.",
    },
    {
      id: "check-4",
      kind: "calculate",
      prompt:
        "A KV cache holds 2 tensors, 32 layers, 8 heads, 128 dimensions, 8,192 tokens, a batch of 8 and 2 bytes per value. What is its size?",
      options: [
        { id: "option-a", label: "1 GiB" },
        { id: "option-b", label: "4 GiB" },
        { id: "option-c", label: "8 GiB" },
        { id: "option-d", label: "16 GiB" },
      ],
      correctOptionId: "option-c",
      explanation:
        "The product is 8,589,934,592 bytes, which is 8 GiB. Option B drops the key/value factor of 2, and option D doubles the result again.",
    },
  ],
  task: {
    id: "task-inference-optimization",
    scope:
      "Choose a precision scheme that meets the cost and p95 targets on fixed data.",
    items: [
      {
        id: "item-1",
        label:
          "Write the parameter count, context, batch, byte width and targets with units.",
      },
      {
        id: "item-2",
        label: "Compute the weight memory at fp16, 8-bit and 4-bit.",
      },
      {
        id: "item-3",
        label: "Compute the KV cache for the 8,192-token context at a batch of 8.",
      },
      {
        id: "item-4",
        label: "Compare the total pass rate and the billing slice before and after 4-bit.",
      },
      {
        id: "item-5",
        label: "Choose one scheme that passes all three gates and name its main risk.",
      },
    ],
    solution: {
      filename: "serving/precision.py",
      language: "python",
      code: [
        "PARAMS_B = 8",
        "LAYERS = 32",
        "HEADS = 8",
        "HEAD_DIM = 128",
        "CONTEXT = 8_192",
        "BATCH = 8",
        "BYTES_PER_VALUE = 2",
        "COST_TARGET = 0.40",
        "P95_TARGET = 1_100",
        "",
        "fp16_gb = PARAMS_B * 2",
        "eight_bit_gb = PARAMS_B * 1",
        "four_bit_gb = PARAMS_B * 0.5",
        "",
        "kv_bytes = (",
        "    2 * LAYERS * HEADS * HEAD_DIM * CONTEXT * BATCH * BYTES_PER_VALUE",
        ")",
        "kv_gib = kv_bytes / 1024 ** 3",
        "",
        "print(f\"fp16 weights {fp16_gb:.2f} GB\")",
        "print(f\"8-bit weights {eight_bit_gb:.2f} GB\")",
        "print(f\"4-bit weights {four_bit_gb:.2f} GB\")",
        "print(f\"kv cache {kv_gib:.2f} GiB\")",
        "",
        "MEASURED = {",
        '    "all_4bit": {"cost": 0.31, "p95": 880, "pass": 0.71, "billing": 0.62},',
        '    "mixed": {"cost": 0.35, "p95": 1_020, "pass": 0.74, "billing": 0.79},',
        "}",
        "",
        "for name, row in MEASURED.items():",
        "    gates = (",
        "        row[\"cost\"] <= COST_TARGET",
        "        and row[\"p95\"] <= P95_TARGET",
        "        and row[\"billing\"] >= 0.74",
        "    )",
        "    print(",
        "        f\"{name}: cost ${row['cost']:.2f} p95 {row['p95']} ms \"",
        "        f\"pass {row['pass']:.2f} billing {row['billing']:.2f} \"",
        "        f\"gates {'ok' if gates else 'fail'}\"",
        "    )",
      ].join("\n"),
    },
  },
  prove: {
    prompt: "Which serving lever did you pull, and how did cost, p95 and the slice move?",
    placeholder: "I changed X; the result was Y.",
    maxLength: 280,
    debounceMs: 800,
    savedMessage: "Proof saved on this device.",
  },
  citation:
    "Further reading: AI Engineering by Chip Huyen (O'Reilly). This course is independent and reproduces no book text or figures.",
} as const satisfies Lesson);
