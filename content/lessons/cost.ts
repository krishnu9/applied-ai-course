import type { Lesson } from "@/lib/types";
import { deepFreeze } from "../freeze";

export const costLesson = deepFreeze({
  slug: "cost",
  order: 21,
  title: "Cost and latency budget",
  chapterId: "ch-09",
  chapterOrder: 9,
  status: "live",
  terms: [
    { term: "TTFT", definition: "Time from the request to the first output token." },
    { term: "TPOT", definition: "Time per output token after the first token." },
    { term: "p95", definition: "The latency value that 95 percent of requests stay under." },
    { term: "goodput", definition: "Throughput that still meets the latency target." },
    { term: "prefill", definition: "The pass that reads the input and fills the context." },
  ],
  evalCase: {
    id: "case-cost",
    brief: "Diagnose a p95 miss with a healthy average.",
  },
  outcome: "You can estimate cost and p95 at ten times traffic and name three levers.",
  artifact: "A filled budget sheet from the calculator.",
  readingMinutes: 9,
  difficulty: "core",
  layerId: "layer-06",
  sections: [
    {
      id: "read-the-bill",
      title: "Read: the bill that surprises",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "p-cost-1",
          text: "The monthly bill arrives and surprises the team. The prototype cost little because it ran a few times a day. The feature now runs ten thousand times a day. The bill follows the traffic, not the prototype.",
        },
        {
          kind: "paragraph",
          id: "p-cost-2",
          text: "A bill has two drivers. The number of requests and the tokens per request. A request with a long input and a short output pays mostly for the input. A request with a long output pays for generation time as well.",
        },
        {
          kind: "paragraph",
          id: "p-cost-3",
          text: "Price is per million tokens. A price of 0.75 dollars per million sounds tiny. Multiply by ten thousand requests and the tiny price becomes a monthly number the team must defend.",
        },
        {
          kind: "callout",
          id: "callout-cost-prototype",
          tone: "warning",
          title: "The prototype is not the price.",
          text: "A demo that runs ten times a day hides the cost of a feature that runs ten thousand times a day.",
        },
      ],
    },
    {
      id: "read-two-clocks",
      title: "Read: cost and latency",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "p-cost-4",
          text: "Cost and latency are two clocks on the same wall. The cost clock counts tokens and requests. The latency clock counts prefill, decode and retrieval. A change can lower one and raise the other.",
        },
        {
          kind: "paragraph",
          id: "p-cost-5",
          text: "Prefill reads the input and fills the context. Decode writes the output one token at a time. Decode is slower per token, so the output length shapes p95. Retrieval adds a fixed wait before the model starts.",
        },
        {
          kind: "paragraph",
          id: "p-cost-6",
          text: "Use p95, not the average. The average hides the slow tail. The tail is what a reader feels on a busy day. Budget for the tail, then check the average.",
        },
        {
          kind: "paragraph",
          id: "p-cost-7",
          text: "Two levers trade the clocks. A shorter output lowers cost and decode time. A smaller context lowers prefill and the bill. A cache lowers repeated prefill and leaves decode unchanged.",
        },
      ],
    },
    {
      id: "draw-the-budget",
      title: "Draw: the budget",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "p-cost-8",
          text: "Draw the budget before you ship. Put the inputs on the left: requests per day, input tokens, output tokens and price per million. Put the outputs on the right: cost per request, cost per thousand, monthly cost and p95.",
        },
        {
          kind: "paragraph",
          id: "p-cost-9",
          text: "The formula is short. Cost per request is input plus output, times the price per million, divided by one million. The sample uses one price for input and output, to keep the sum simple. Monthly cost is cost per request times requests per day times thirty. Latency is the retrieval wait plus prefill and decode time.",
        },
        {
          kind: "diagram",
          variant: "flow",
          id: "cost-budget",
          spec: {
            nodes: [
              { id: "requests", label: "Requests/day" },
              { id: "input", label: "Input tokens" },
              { id: "output", label: "Output tokens" },
              { id: "price", label: "Price per 1M" },
              { id: "cost", label: "Cost per 1k" },
              { id: "monthly", label: "Monthly cost" },
              { id: "p95", label: "p95 latency" },
            ],
            edges: [
              ["requests", "monthly"],
              ["input", "cost"],
              ["output", "cost"],
              ["price", "cost"],
              ["cost", "monthly"],
              ["input", "p95"],
              ["output", "p95"],
            ],
          },
          caption:
            "Requests and tokens set the monthly bill; input and output tokens also set p95 latency.",
          alt: "Budget graph: requests, input tokens, output tokens and price feed cost and monthly cost; input and output tokens feed p95.",
        },
        {
          kind: "callout",
          id: "callout-cost-units",
          tone: "production-tip",
          title: "Label the units.",
          text: "Dollars, tokens and milliseconds never share a column. A budget sheet with mixed units invites a factor-of-one-thousand error.",
        },
      ],
    },
    {
      id: "check-the-levers",
      title: "Check: choose the lever",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "p-cost-10",
          text: "A lever is a change with a known effect. Shorten the output. Cut the context. Cache the prefix. Move a task to a smaller model. Each lever moves cost, latency or both.",
        },
        {
          kind: "paragraph",
          id: "p-cost-11",
          text: "Name the lever before you pull it. A team that says make it cheaper has no lever. A team that says cut the output from two hundred fifty to one hundred tokens has a number and a test.",
        },
        { kind: "check", id: "check-cost-a", checkId: "check-1" },
        { kind: "check", id: "check-cost-b", checkId: "check-2" },
        {
          kind: "paragraph",
          id: "p-cost-12",
          text: "Check the lever on one request before the fleet. Compute the old and new numbers for one input and output pair. Then multiply by traffic.",
        },
        {
          kind: "paragraph",
          id: "p-cost-13",
          text: "The cheapest token is the one you do not send. Remove the instruction that repeats the same rule three times. Remove the example that no reader needs. A shorter prompt is a real saving on every request.",
        },
      ],
    },
    {
      id: "build-the-budget",
      title: "Build: set the budget",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "p-cost-14",
          text: "The script computes the four numbers from the four inputs. It prints the cost per request at full precision, then the readable monthly cost and p95. The numbers below are the fixed sample values used across the course.",
        },
        {
          kind: "code",
          id: "code-cost-budget",
          filename: "budget/cost_budget.py",
          language: "python",
          code: [
            "REQUESTS = 10_000",
            "INPUT = 1_000",
            "OUTPUT = 250",
            "PRICE_PER_M = 0.75",
            "RETRIEVAL_MS = 400",
            "PREFILL_MS = 0.6",
            "DECODE_MS = 5.6",
            "",
            "per_request = (INPUT + OUTPUT) * PRICE_PER_M / 1_000_000",
            'print(f"cost per request ${per_request:.7f}")',
            'print(f"cost per 1k ${per_request * 1_000:.2f}")',
            'print(f"monthly ${per_request * REQUESTS * 30:,.2f}")',
            'print(f"p95 {RETRIEVAL_MS + INPUT * PREFILL_MS + OUTPUT * DECODE_MS:.0f} ms")',
          ].join("\n"),
          output: {
            label: "Sample output. Fixed data.",
            text: "cost per request $0.0009375\ncost per 1k $0.94\nmonthly $281.25\np95 2400 ms",
          },
        },
        {
          kind: "paragraph",
          id: "p-cost-15",
          text: "Read the output. The cost per request is 0.0009375 dollars. A thousand requests cost 0.9375 dollars. Ten thousand requests a day cost 281.25 dollars a month. The p95 is 2400 milliseconds, or 2.4 seconds.",
        },
        {
          kind: "widget",
          id: "widget-cost-calculator",
          widget: "cost-calculator",
          caption:
            "Change the four inputs and read cost per 1k, monthly cost and p95. Values are sample data.",
        },
        {
          kind: "paragraph",
          id: "p-cost-16",
          text: "The calculator repeats the same formula on the page. Change one input and read the result. Ten times the traffic gives ten times the monthly cost and the same cost per request. The cost per request does not depend on traffic.",
        },
        { kind: "task", id: "task-cost" },
        {
          kind: "note",
          id: "note-cost",
          text: "Keep the price per million next to the model name. A price without a version is a guess by next month.",
        },
      ],
    },
    {
      id: "prove-the-saving",
      title: "Prove: name the saving",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "p-cost-17",
          text: "The proof note names one lever and the result. Example: I cut the output from two hundred fifty to one hundred tokens; the monthly cost fell from 281.25 to 247.50 dollars and p95 fell from 2.4 to 1.56 seconds.",
        },
        {
          kind: "paragraph",
          id: "p-cost-18",
          text: "Check the arithmetic before you write the note. A saving claim with a wrong unit is worse than no claim, because the team ships on it.",
        },
        {
          kind: "paragraph",
          id: "p-cost-19",
          text: "A budget is a target, not a forecast. The forecast comes from traffic data. The target comes from the team. Compare the two and name the gap.",
        },
        {
          kind: "callout",
          id: "callout-cost-rate",
          tone: "note",
          title: "Cost per 1k is a rate.",
          text: "The rate compares models and versions. The monthly bill compares this traffic with the budget.",
        },
      ],
    },
  ],
  checks: [
    {
      id: "check-1",
      kind: "calculate",
      prompt: "Traffic grows ten times and every other input stays the same. What happens to the cost per request?",
      options: [
        { id: "option-a", label: "It grows ten times" },
        { id: "option-b", label: "It stays the same" },
        { id: "option-c", label: "It falls to one tenth" },
        { id: "option-d", label: "It cannot be known" },
      ],
      correctOptionId: "option-b",
      explanation:
        "The cost per request depends on tokens and price, not on traffic. Traffic multiplies the monthly bill, while the rate for one request stays fixed.",
    },
    {
      id: "check-2",
      kind: "diagnose",
      prompt: "Which lever targets decode time?",
      options: [
        { id: "option-a", label: "A shorter output" },
        { id: "option-b", label: "A shorter input" },
        { id: "option-c", label: "A cached prefix" },
        { id: "option-d", label: "A smaller retrieval k" },
      ],
      correctOptionId: "option-a",
      explanation:
        "Decode writes the output one token at a time, so the output length sets the decode time. The input and the prefix shape prefill, and retrieval adds a separate fixed wait.",
    },
  ],
  task: {
    id: "task-cost",
    scope: "Fill a cost budget for the triage feature and name one lever.",
    items: [
      { id: "item-1", label: "Write the four inputs with their units." },
      { id: "item-2", label: "Compute the cost per request." },
      { id: "item-3", label: "Compute the monthly cost at ten thousand requests a day." },
      { id: "item-4", label: "Compute p95 from retrieval and token costs." },
      { id: "item-5", label: "Name one lever and its effect on cost and p95." },
    ],
    solution: {
      filename: "budget/cost_budget.py",
      language: "python",
      code: [
        "REQUESTS = 10_000",
        "INPUT = 1_000",
        "OUTPUT = 250",
        "PRICE_PER_M = 0.75",
        "RETRIEVAL_MS = 400",
        "PREFILL_MS = 0.6",
        "DECODE_MS = 5.6",
        "",
        "per_request = (INPUT + OUTPUT) * PRICE_PER_M / 1_000_000",
        "print(per_request)",
        "print(per_request * 1_000)",
        "print(per_request * REQUESTS * 30)",
        "print(RETRIEVAL_MS + INPUT * PREFILL_MS + OUTPUT * DECODE_MS)",
      ].join("\n"),
    },
  },
  prove: {
    prompt: "Which lever did you pull, and what happened to cost and p95?",
    placeholder: "I changed X; the result was Y.",
    maxLength: 280,
    debounceMs: 800,
    savedMessage: "Proof saved on this device.",
  },
  citation:
    "Further reading on cost and latency: AI Engineering by Chip Huyen (O'Reilly). This course is independent and reproduces no book text or figures.",
} as const satisfies Lesson);
