import type { Lesson } from "@/lib/types";
import { deepFreeze } from "../freeze";

export const costLesson = deepFreeze({
  slug: "cost",
  order: 21,
  title: "Latency, throughput and goodput",
  chapterId: "ch-09",
  chapterOrder: 9,
  status: "live",
  outcome:
    "You can define the serving metrics, measure a request timeline, and choose one lever that meets a latency target. Prerequisite: lesson 20, synthetic data.",
  artifact:
    "A latency sheet with p50, p95, p99, throughput and goodput for the fixed sample.",
  readingMinutes: 28,
  difficulty: "advanced",
  layerId: "layer-06",
  terms: [
    {
      term: "TTFT (time to first token)",
      definition: "The delay from request to the first streamed token.",
    },
    {
      term: "TPOT (time per output token)",
      definition: "The average time between output tokens after the first.",
    },
    {
      term: "Latency percentile",
      definition: "The p50, p95 or p99 value of the latency distribution.",
    },
    {
      term: "Throughput",
      definition:
        "The number of requests or tokens that a system serves per unit of time.",
    },
    {
      term: "Goodput",
      definition: "The throughput of requests that meet the latency target.",
    },
    {
      term: "Prefill",
      definition:
        "The parallel pass that reads the input tokens and fills the KV cache.",
    },
  ],
  evalCase: {
    id: "case-cost",
    brief: "Diagnose a p95 miss with a healthy average.",
  },
  sections: [
    {
      id: "what-it-is",
      title: "What it is",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "cost-p-1",
          text: "Serving has two clocks. Latency is the time from one request to its answer. Throughput is the number of requests or tokens that a system serves each second. Goodput counts only the requests that meet a latency target. A system that serves 40 requests per second and misses the target on 8 of them has a goodput of 32 requests per second.",
        },
        {
          kind: "paragraph",
          id: "cost-p-2",
          text: "Latency splits into two measures. TTFT (time to first token) is the delay before the first streamed token. TPOT (time per output token) is the average gap between the tokens after it. Total time is TTFT plus TPOT times the number of gaps.",
        },
        {
          kind: "paragraph",
          id: "cost-p-3",
          text: "A support request carries 1,000 input tokens and 250 output tokens. Retrieval takes 400 ms, and prefill takes 0.6 ms per input token, so TTFT is 1,000 ms. Decode takes 5.6 ms per gap after the first token, and 250 output tokens have 249 gaps. The answer ends at 2,394 ms, about 2.4 seconds. The cost is 0.94 dollars per 1,000 requests.",
        },
        {
          kind: "paragraph",
          id: "cost-p-4",
          text: "A non-example: a nightly batch reports four hours for 10,000 records. That number is a job duration, not a latency and not a throughput. No single request waits four hours, and the rate depends on the batch, so the number cannot serve as a serving metric.",
        },
      ],
    },
    {
      id: "eli5-a-bakery-tray",
      title: "A bakery tray",
      register: "eli5",
      blocks: [
        {
          kind: "analogy",
          id: "cost-analogy-1",
          text: "A bakery has one oven and one tray of loaves. You wait for the first loaf to come out; that wait is the first token. Each next loaf follows at a steady gap, and that gap is the time per token. The oven sells loaves per hour, and only the warm loaves count. The tray is the batch, the oven is the model, and the warm loaves are the goodput.",
          breaks:
            "Where it breaks: the oven bakes a whole tray at once. A model writes one token per step, and it reads the whole cached context each time.",
        },
        {
          kind: "paragraph",
          id: "cost-p-5",
          text: "Prediction: if one tray holds more loaves, what happens to the loaves per hour and to the wait for the first loaf? Say why that happens.",
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
          id: "cost-p-6",
          text: "Measure the request in stages. One stage sets TTFT, another sets TPOT, and the scheduler sets throughput. Each stage has one dominant input.",
        },
        {
          kind: "list",
          id: "cost-list-1",
          ordered: true,
          items: [
            "Stamp the arrival time at the gateway and keep one request id.",
            "Wait in the queue until the batch scheduler gives a slot.",
            "Run prefill on all input tokens and fill the KV cache.",
            "Stream the first token and stop the TTFT clock.",
            "Decode one token per step and measure each gap as TPOT.",
            "Group requests in a batch, or add and remove them with continuous batching.",
            "Record stage times, tokens, batch size and the target, then compute the percentiles.",
          ],
        },
        {
          kind: "paragraph",
          id: "cost-p-7",
          text: "Prefill reads the input in one parallel pass, so its time grows with input tokens and not with output tokens. Decode is serial, and each step reads the KV cache, whose size grows with the context. A long input with a short answer pays in TTFT. A short input with a long answer pays in TPOT.",
        },
        {
          kind: "paragraph",
          id: "cost-p-25",
          text: "The split matters for design. A summarizer reads 8,000 tokens and writes 200, so prefill dominates and TTFT is the number to watch. A chat reply reads 300 tokens and writes 800, so decode dominates and TPOT is the number to watch. The same server can meet one target and miss the other.",
        },
        {
          kind: "paragraph",
          id: "cost-p-8",
          text: "Batching puts several requests in one forward pass. The weights stay in memory, so the work per request falls and throughput rises. A static batch waits for its slowest member. Continuous batching removes a finished request at a step boundary and adds a waiting one, so a free slot never idles.",
        },
        {
          kind: "paragraph",
          id: "cost-p-26",
          text: "The KV cache is the memory that makes decode fast. It holds the key and value vectors for every past token, so each step reads state instead of recomputing it. The cache grows with context and batch, and a memory limit caps the batch before compute does.",
        },
        {
          kind: "paragraph",
          id: "cost-p-9",
          text: "The queue is where a good average hides a bad tail. At 40 requests per second and 2.4 seconds per request, 96 requests are in flight. If the server holds 80 slots, 16 requests wait, and the p95 carries that wait. The mean moves little, because most requests never queue.",
        },
        {
          kind: "paragraph",
          id: "cost-p-27",
          text: "Streaming changes the perceived wait but not the total. The first token arrives at TTFT, so a reader sees text while decode continues. The p95 total still counts the whole answer, and the goodput target must say which one it measures.",
        },
        {
          kind: "paragraph",
          id: "cost-p-10",
          text: "A percentile needs a window and a count. p50 is the median. p95 means 5 of 100 requests are slower, and p99 means 1 of 100. Report p50 next to p95. A wide gap points to a queue, a long-output slice, or a cold cache.",
        },
        {
          kind: "paragraph",
          id: "cost-p-11",
          text: "Throughput counts every finished request. Goodput counts the requests that meet the target. Set the target before the test, then report both numbers. A high throughput with a low goodput is a promise the system does not keep.",
        },
        {
          kind: "paragraph",
          id: "cost-p-28",
          text: "Report request throughput and token throughput together. A request rate hides the answer length, because a 20-token answer and a 300-token answer count once each. Token throughput shows the load on decode, and cost per 1,000 tokens shows the load on the bill.",
        },
        {
          kind: "table",
          id: "cost-table-1",
          columns: ["Stage", "Work", "Metric it sets", "Grows with"],
          rows: [
            ["Queue", "Waits for a slot", "TTFT tail", "Arrival rate and batch size"],
            ["Prefill", "Reads input in parallel", "TTFT", "Input tokens"],
            ["Decode", "Writes one token per step", "TPOT and total", "Output tokens"],
            ["Batch", "Groups requests", "Throughput", "Batch size and concurrency"],
          ],
          caption: "Each stage sets one serving metric.",
        },
        {
          kind: "diagram",
          id: "cost-diagram-1",
          variant: "timeline",
          spec: {
            nodes: [
              { id: "arrive", label: "Arrive" },
              { id: "queue", label: "Queue" },
              { id: "prefill", label: "Prefill" },
              { id: "first", label: "First token" },
              { id: "decode", label: "Decode" },
              { id: "last", label: "Last token" },
            ],
            edges: [
              ["arrive", "queue"],
              ["queue", "prefill"],
              ["prefill", "first"],
              ["first", "decode"],
              ["decode", "last"],
            ],
          },
          caption:
            "TTFT covers arrival, queue and prefill; TPOT is the gap between later tokens.",
          alt: "Timeline from arrival through queue and prefill to the first token, then decode to the last token.",
        },
        {
          kind: "paragraph",
          id: "cost-p-12",
          text: "A serving target has three parts: a percentile, a value and a window. For example, p95 under 1,500 ms over 10 minutes. The percentile names whose experience counts, the value names the limit, and the window names the sample. A target without a window changes with the traffic of the day.",
        },
      ],
    },
    {
      id: "eli5-a-toll-booth",
      title: "A toll booth",
      register: "eli5",
      blocks: [
        {
          kind: "analogy",
          id: "cost-analogy-2",
          text: "Think of a toll road with one booth. Cars arrive at a steady rate, and the booth serves one car at a time. A busy hour builds a line before the booth. The wait in the line is the queue, and the time at the booth is the service. The cars per hour are the throughput, and the line is the tail latency.",
          breaks:
            "Where it breaks: a car keeps its place in line. A batch scheduler can reorder requests and start a new one in a free slot.",
        },
        {
          kind: "paragraph",
          id: "cost-p-13",
          text: "Prediction: if cars arrive faster than the booth serves them, does the wait grow for the first car or for the last car? Which percentile shows it first? Say which and why.",
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
          id: "cost-table-2",
          columns: ["Symptom", "Cause", "Check", "Fix"],
          rows: [
            [
              "The mean looks fine and one request is slow",
              "A long output sits in the tail",
              "Compare p50 with p95 by output length",
              "Report p95 and budget the tail",
            ],
            [
              "p95 rises while the mean is flat",
              "The queue builds at peak arrival",
              "Plot arrival rate against requests in flight",
              "Add capacity or cap concurrency",
            ],
            [
              "More batching lowers cost and raises p95",
              "The batch waits for its slowest member",
              "Compare batch size 1, 4 and 8 on p95",
              "Use continuous batching or a smaller batch",
            ],
            [
              "Throughput looks high and users complain",
              "Many requests miss the latency target",
              "Compute goodput against the target",
              "Change the target or add capacity",
            ],
          ],
          caption: "Four latency failures, from the tail back to the batch.",
        },
        {
          kind: "paragraph",
          id: "cost-p-14",
          text: "A larger batch raises throughput and lowers the cost per token. It also adds queue wait and a little TPOT. The latency target sets the batch size, not the other way round.",
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
          id: "cost-p-15",
          text: "The support assistant serves 10,000 requests a day at 40 requests per second. The dashboard shows a mean of 1,342 ms and calls the service healthy. The target is p95 under 1,500 ms.",
        },
        {
          kind: "paragraph",
          id: "cost-p-16",
          text: "The fixed sample holds 20 requests. The p50 is 1,157 ms, the p95 is 2,400 ms, and the p99 is 2,680 ms. Four of the 20 samples miss the target, so the goodput is 32 of 40 requests per second.",
        },
        {
          kind: "paragraph",
          id: "cost-p-17",
          text: "The trace names the stage. A short request writes about 30 output tokens and ends near 1,168 ms. The p95 request writes 250 tokens. Retrieval takes 400 ms, prefill takes 600 ms, and decode takes 1,400 ms. The break is the output length, not the model and not the network.",
        },
        {
          kind: "paragraph",
          id: "cost-p-18",
          text: "The decision is to change the output contract. Ask for two sentences and one next step, then cap the output at 80 tokens. The p95 falls to 1,448 ms and the goodput rises to 40 requests per second. The team then runs the 41-case eval. If the pass rate holds, the lever stays; if it falls, the cap is too tight.",
        },
      ],
    },
    {
      id: "set-the-budget",
      title: "Set the budget yourself",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "cost-p-19",
          text: "The lab uses the fixed cost model. Change one control and read the response. Try this: raise the batch size from 1 to 8 and watch the throughput line. The p95 does not move, because this model charges no queue wait. A real server does, so treat the gain as an upper bound.",
        },
        {
          kind: "interactive",
          id: "cost-interactive-1",
          widget: "serving-budget",
          caption:
            "Change the load, batch size and concurrency, then read cost, p95 and throughput.",
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
          id: "cost-p-20",
          text: "Answer five checks on the definition, the metric choice, the diagnosis and two calculations.",
        },
        { kind: "check", id: "cost-check-1", checkId: "check-1" },
        { kind: "check", id: "cost-check-2", checkId: "check-2" },
        { kind: "check", id: "cost-check-3", checkId: "check-3" },
        { kind: "check", id: "cost-check-4", checkId: "check-4" },
        { kind: "check", id: "cost-check-5", checkId: "check-5" },
      ],
    },
    {
      id: "evaluation-task",
      title: "Evaluation task",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "cost-p-21",
          text: "The task uses 20 fixed requests and the 1,500 ms target. Build one script that prints the baseline, applies the output cap, and checks the long-output case.",
        },
        { kind: "task", id: "task-cost" },
        {
          kind: "paragraph",
          id: "cost-p-22",
          text: "The reference solution prints a baseline p95 of 2,400 ms and a goodput of 32 requests per second. The 80-token cap gives a p95 of 1,448 ms and a goodput of 40. The mean falls from 1,342 to 1,208 ms. Cost moves little, from 0.80 to 0.78 dollars per 1,000 requests, because output is a small share of this bill. On the 300-token case the cap holds at 1,448 ms, but an answer that needs 300 tokens loses content. That is the limit of the lever.",
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
          id: "cost-p-23",
          text: "Write one sentence with the form: I changed X; the result was Y. Name the layer, the old p95 and goodput, and the new values. Example: I capped the output at 80 tokens; p95 fell from 2,400 to 1,448 ms and goodput rose from 32 to 40 requests per second.",
        },
        {
          kind: "paragraph",
          id: "cost-p-24",
          text: "Self-rubric: mechanism names the stage and the lever; evidence gives a fixed percentile and rate; limit names one case where the cap loses content.",
        },
        {
          kind: "note",
          id: "cost-note-1",
          text: "A percentile without a window and a sample count is not evidence.",
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
          id: "cost-interview-1",
          items: [
            {
              question: "What is the difference between throughput and goodput?",
              answer:
                "Throughput counts every request or token that the system serves per second. Goodput counts only the requests that meet the latency target. A service at 40 requests per second with 32 under the target has a goodput of 32. Report both, because a high throughput can hide a missed promise.",
            },
            {
              question: "When do you choose a larger batch over a lower TTFT?",
              answer:
                "Choose a larger batch when the cost per token matters more than the wait for a slot. The batch raises throughput and lowers cost, and it adds queue wait to TTFT. Continuous batching softens the trade, because a finished request leaves at a step boundary. The p95 target decides the batch size.",
            },
            {
              question: "How does a p95 miss stay hidden, and what do you check?",
              answer:
                "A mean stays flat because most requests are short and never queue. The tail grows from a long-output slice, a cold cache, or a queue at peak arrival. Compare p50 with p95, then group the samples by output length and arrival rate. Compute goodput against the target before you change the model.",
            },
            {
              question: "How does serving change at 10x traffic or tokens?",
              answer:
                "At 10x traffic, the queue grows unless capacity and concurrency grow with it, and p95 rises before the mean. At 10x tokens, prefill and decode time grow with the lengths, so TTFT and TPOT both rise. Use Little's law to size the in-flight requests, and track goodput rather than throughput. A 10x bill needs a cost lever, such as prefix caching or a smaller model.",
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
      prompt: "Which sentence defines goodput?",
      options: [
        { id: "option-a", label: "The number of requests served per second." },
        {
          id: "option-b",
          label: "The throughput of requests that meet the latency target.",
        },
        { id: "option-c", label: "The average gap between output tokens." },
        { id: "option-d", label: "The delay before the first streamed token." },
      ],
      correctOptionId: "option-b",
      explanation:
        "Goodput filters throughput by the latency target, so a slow request does not count. Option A names raw throughput, which counts a failed request as a success.",
    },
    {
      id: "check-2",
      kind: "apply",
      prompt:
        "A support chat shows a blank panel for two seconds before any words appear. Which metric names that wait?",
      options: [
        { id: "option-a", label: "TPOT" },
        { id: "option-b", label: "TTFT" },
        { id: "option-c", label: "Goodput" },
        { id: "option-d", label: "Throughput" },
      ],
      correctOptionId: "option-b",
      explanation:
        "TTFT is the delay from the request to the first streamed token, which is exactly the blank panel. TPOT measures the gaps after that first token, so it cannot name the initial wait.",
    },
    {
      id: "check-3",
      kind: "diagnose",
      prompt:
        "A service reports a mean of 1,342 ms and a p95 of 2,400 ms. Which check names the cause first?",
      options: [
        { id: "option-a", label: "Read the mean a second time" },
        { id: "option-b", label: "Lower the batch size at once" },
        {
          id: "option-c",
          label: "Compare p50 and p95 by output-length slice",
        },
        { id: "option-d", label: "Add a second model" },
      ],
      correctOptionId: "option-c",
      explanation:
        "The gap between p50 and p95 points to a tail slice, and a cut by output length shows it. A batch change is a guess until the stage and the slice are known.",
    },
    {
      id: "check-4",
      kind: "calculate",
      prompt:
        "TTFT is 1,000 ms, TPOT is 8 ms and the answer has 100 output tokens. What is the total time?",
      options: [
        { id: "option-a", label: "1,800 ms" },
        { id: "option-b", label: "1,792 ms" },
        { id: "option-c", label: "1,008 ms" },
        { id: "option-d", label: "2,800 ms" },
      ],
      correctOptionId: "option-b",
      explanation:
        "TPOT is the gap after the first token, so 100 tokens have 99 gaps: 1,000 + 792 = 1,792 ms. Option A counts 100 gaps, which adds one extra gap.",
    },
    {
      id: "check-5",
      kind: "calculate",
      prompt:
        "A system serves 40 requests per second, and 30 of them meet the latency target. What is the goodput?",
      options: [
        { id: "option-a", label: "0.75 requests per second" },
        { id: "option-b", label: "30 requests per second" },
        { id: "option-c", label: "40 requests per second" },
        { id: "option-d", label: "10 requests per second" },
      ],
      correctOptionId: "option-b",
      explanation:
        "Goodput counts the requests that meet the target, so 30 requests per second pass. Option C is raw throughput, which includes the 10 requests that miss.",
    },
  ],
  task: {
    id: "task-cost",
    scope:
      "Measure a fixed request set and choose one lever that meets the p95 target.",
    items: [
      {
        id: "item-1",
        label:
          "Write the fixed input tokens, retrieval time, target and request rate with units.",
      },
      {
        id: "item-2",
        label: "Compute p50, p95 and p99 from the 20 fixed samples.",
      },
      {
        id: "item-3",
        label: "Compute the mean, throughput and goodput against the 1,500 ms target.",
      },
      {
        id: "item-4",
        label: "Apply the 80-token output cap and recompute p95 and goodput.",
      },
      {
        id: "item-5",
        label: "Apply the same check to the 300-token case and name the limit of the cap.",
      },
    ],
    solution: {
      filename: "serving/latency.py",
      language: "python",
      code: [
        "import math",
        "",
        "INPUT_TOKENS = 1_000",
        "RETRIEVAL_MS = 400",
        "PREFILL_MS = 0.6",
        "DECODE_MS = 5.6",
        "PRICE_PER_M = 0.75",
        "TARGET_MS = 1_500",
        "RATE = 40",
        "CAP = 80",
        "OUTPUTS = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28,",
        "           30, 32, 34, 36, 40, 60, 100, 150, 250, 300]",
        "",
        "",
        "def latency(output_tokens):",
        "    prefill = INPUT_TOKENS * PREFILL_MS",
        "    return RETRIEVAL_MS + prefill + output_tokens * DECODE_MS",
        "",
        "",
        "def percentile(values, p):",
        "    ordered = sorted(values)",
        "    rank = math.ceil(p * len(ordered))",
        "    return ordered[rank - 1]",
        "",
        "",
        "def cost_per_1k(output_tokens):",
        "    tokens = INPUT_TOKENS + output_tokens",
        "    return tokens * PRICE_PER_M / 1_000",
        "",
        "",
        "def goodput(times):",
        "    return RATE * sum(1 for value in times if value <= TARGET_MS) / len(times)",
        "",
        "",
        "base = [latency(out) for out in OUTPUTS]",
        "mean = sum(base) / len(base)",
        'print(f"baseline mean {mean:.0f} ms")',
        'print(f"p50 {percentile(base, 0.50):.0f} ms  p95 {percentile(base, 0.95):.0f} ms  p99 {percentile(base, 0.99):.0f} ms")',
        'print(f"throughput {RATE:.1f} req/s  goodput {goodput(base):.1f} req/s")',
        'print(f"cost ${sum(cost_per_1k(out) for out in OUTPUTS) / len(OUTPUTS):.2f} per 1k")',
        "",
        "capped_outputs = [min(out, CAP) for out in OUTPUTS]",
        "capped = [latency(out) for out in capped_outputs]",
        "mean = sum(capped) / len(capped)",
        'print(f"cap {CAP}: mean {mean:.0f} ms  p95 {percentile(capped, 0.95):.0f} ms  p99 {percentile(capped, 0.99):.0f} ms")',
        'print(f"goodput {goodput(capped):.1f} req/s  cost ${sum(cost_per_1k(out) for out in capped_outputs) / len(capped_outputs):.2f} per 1k")',
        "",
        "long_case = OUTPUTS[-1]",
        'print(f"long case {long_case} tokens: {latency(long_case):.0f} ms -> {latency(min(long_case, CAP)):.0f} ms with the cap")',
      ].join("\n"),
    },
  },
  prove: {
    prompt: "Which lever did you pull, and how did p95 and goodput move?",
    placeholder: "I changed X; the result was Y.",
    maxLength: 280,
    debounceMs: 800,
    savedMessage: "Proof saved on this device.",
  },
  citation:
    "Further reading: AI Engineering by Chip Huyen (O'Reilly). This course is independent and reproduces no book text or figures.",
} as const satisfies Lesson);
