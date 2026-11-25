import type { Lesson } from "@/lib/types";
import { deepFreeze } from "../freeze";

export const aiArchitectureLesson = deepFreeze({
  slug: "ai-architecture",
  order: 23,
  title: "Guardrails, gateways and fallbacks",
  chapterId: "ch-10",
  chapterOrder: 10,
  status: "live",
  outcome:
    "You can define the parts around a model, choose a route and a cache policy, and add a fallback that holds the output contract. Prerequisite: lesson 22, inference optimization.",
  artifact:
    "A request path with one route table, one cache key and one fallback rule.",
  readingMinutes: 21,
  difficulty: "advanced",
  terms: [
    {
      term: "Guardrail",
      definition:
        "A check that blocks or edits unsafe, off-policy or malformed input and output.",
    },
    {
      term: "Input guardrail",
      definition: "A check on the user or retrieved text before the model reads it.",
    },
    {
      term: "Output guardrail",
      definition: "A check on the model response before the user sees it.",
    },
    {
      term: "Router",
      definition:
        "A component that sends each request to a model or path by intent or cost.",
    },
    {
      term: "Gateway",
      definition:
        "A single interface in front of several models, with auth, logging and fallback.",
    },
    {
      term: "Fallback",
      definition: "A backup model or path used when the primary fails or exceeds a limit.",
    },
  ],
  evalCase: {
    id: "case-ai-architecture",
    brief: "Add routing and a fallback without breaking the labels.",
  },
  sections: [
    {
      id: "what-it-is",
      title: "What it is",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "ai-architecture-p-1",
          text: "An AI architecture is the set of components around the model: guardrails, a router and gateway, caches, fallbacks, agent patterns and human review. These decide what the model reads, which path runs, what gets reused and what happens on a failure. The model is one part.",
        },
        {
          kind: "paragraph",
          id: "ai-architecture-p-2",
          text: "A worked example: a ticket enters the gateway. The input guardrail masks an email address. The router sends billing to the large model and password reset to the small model. An exact cache answers a repeated question. The output guardrail checks the schema. A timeout takes the fallback, and a low-confidence refund goes to a person.",
        },
        {
          kind: "paragraph",
          id: "ai-architecture-p-3",
          text: "A non-example: one model call from the app with no check, no route and no owner for a failure is not an architecture. It has one path, and a bad answer has no stage to blame.",
        },
      ],
    },
    {
      id: "eli5-an-airport",
      title: "An airport",
      register: "eli5",
      blocks: [
        {
          kind: "analogy",
          id: "ai-architecture-analogy-1",
          text: "Think of an airport. A passport desk checks your papers before the gate; that desk is the input guardrail. A gate agent sends you to a plane by destination; that agent is the router. A luggage store returns a bag you left before; that store is the cache. If your flight cancels, the airline books a seat on another plane, and that seat is the fallback.",
          breaks:
            "Where it breaks: an airport has one authority at each desk, while a gateway may call several model providers with different policies, prices and answers.",
        },
        {
          kind: "paragraph",
          id: "ai-architecture-p-4",
          text: "Prediction: which desk stops a passenger with a fake passport, and which desk sends a passenger to the wrong plane?",
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
          id: "ai-architecture-p-5",
          text: "The path has a fixed order. Each stage removes one risk or cost, and each stage has one owner.",
        },
        {
          kind: "list",
          id: "ai-architecture-list-1",
          ordered: true,
          items: [
            "Accept the request at the gateway with auth, a rate limit and a request id.",
            "Run the input guardrail: block, mask, rewrite, or pass.",
            "Route the request by intent, cost and capability.",
            "Look up the exact cache, then the semantic cache.",
            "Call the primary model with a timeout and one retry.",
            "Run the output guardrail on schema, policy and PII.",
            "Take the fallback or the human queue on a failure.",
          ],
        },
        {
          kind: "paragraph",
          id: "ai-architecture-p-6",
          text: "The router sends each request to one model or path. A rule router reads an intent field; a model router classifies text. The router must be cheaper than the call it routes. A misroute is a quality bug; each route needs an eval slice.",
        },
        {
          kind: "paragraph",
          id: "ai-architecture-p-7",
          text: "The gateway is one interface in front of several models. It holds auth, rate limits, timeouts, retries, logging and the fallback order. The app calls one URL. A provider swap changes one config file, not the product code.",
        },
        {
          kind: "paragraph",
          id: "ai-architecture-p-8",
          text: "A cache returns a stored answer and skips the model. An exact cache hits only on an identical query. A semantic cache hits on a close meaning, so its threshold decides the risk. The key must include the tenant, the model, the prompt version and the route, or it can return one customer the answer of another. Set a time to live and an eviction rule, such as least recently used; a stale entry is a wrong answer with a fresh timestamp.",
        },
        {
          kind: "paragraph",
          id: "ai-architecture-p-9",
          text: "The fallback covers a timeout, a rate limit, a provider error or a failed guardrail. It can be a second model or a safe static answer. A circuit breaker stops calls to a failing provider. Test the fallback on a schedule, or it fails when needed.",
        },
        {
          kind: "paragraph",
          id: "ai-architecture-p-10",
          text: "Agent patterns add a loop with a stop rule. Guardrails apply to tool arguments as well as text, because a tool call can carry an unsafe action. Human review takes low-confidence and high-risk cases, and each review becomes an eval case.",
        },
        {
          kind: "table",
          id: "ai-architecture-table-1",
          columns: ["Part", "Question", "Failure without it", "One check"],
          rows: [
            ["Guardrail", "Is it safe?", "Unsafe output", "Red-team set"],
            ["Router", "Which path fits?", "Cost or quality mismatch", "Per-route eval"],
            ["Cache", "Can this repeat?", "Stale or leaked answer", "Wrong-hit audit"],
            ["Fallback", "What if the call fails?", "An outage reaches users", "Failover drill"],
            ["Human review", "Who checks the close call?", "A silent error ships", "Queue age"],
          ],
          caption: "Five parts, each with one failure and one check.",
        },
        {
          kind: "diagram",
          id: "ai-architecture-diagram-1",
          variant: "flow",
          spec: {
            nodes: [
              { id: "guard", label: "Input guardrail" },
              { id: "router", label: "Router" },
              { id: "cache", label: "Cache" },
              { id: "model", label: "Model" },
              { id: "output", label: "Output guardrail" },
              { id: "reply", label: "Reply" },
              { id: "fallback", label: "Fallback" },
            ],
            edges: [
              ["guard", "router"],
              ["router", "cache"],
              ["cache", "reply"],
              ["router", "model"],
              ["model", "output"],
              ["output", "reply"],
              ["output", "fallback"],
              ["guard", "fallback"],
            ],
          },
          caption:
            "A guard and a router sit before the model; a failed check takes the fallback.",
          alt: "Flow from an input guardrail to a router and cache, then a model, an output guardrail and a reply, with a fallback branch.",
        },
      ],
    },
    {
      id: "eli5-a-post-office",
      title: "A post office",
      register: "eli5",
      blocks: [
        {
          kind: "analogy",
          id: "ai-architecture-analogy-2",
          text: "Think of a post office. A clerk reads the address and sends the letter to one of several depots; the address is the intent and the clerk is the router. A shelf holds a copy of a common letter, and the clerk hands out the copy; that shelf is the cache. A clerk checks the seal before the letter leaves; that is the output guardrail. When a depot closes, a second depot takes the letters.",
          breaks:
            "Where it breaks: a post office reads a real address. A semantic cache guesses that two questions mean the same thing, and it can guess wrong.",
        },
        {
          kind: "paragraph",
          id: "ai-architecture-p-11",
          text: "Prediction: a customer sends the same question twice. Which part answers the second letter, what must match for the copy to be safe, and which key field makes it safe?",
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
          id: "ai-architecture-table-2",
          columns: ["Symptom", "Cause", "Check", "Fix"],
          rows: [
            [
              "A cached answer shows another plan",
              "The key omits tenant or plan",
              "Audit keys and wrong hits",
              "Add tenant, plan and prompt version",
            ],
            [
              "Billing goes to the small model",
              "No billing label",
              "Read the per-route eval",
              "Add route labels",
            ],
            [
              "A guardrail blocks a valid answer",
              "The rule is too broad",
              "Measure the false-refusal rate",
              "Narrow the rule and repair",
            ],
            [
              "The fallback is never called",
              "The path is untested",
              "Run a failover drill",
              "Test on a schedule",
            ],
          ],
          caption: "Four architecture failures, each with one check.",
        },
        {
          kind: "paragraph",
          id: "ai-architecture-p-12",
          text: "Each stage cuts one risk and adds latency, cost and a new failure mode. A guardrail can refuse a valid request, and a cache can return a stale answer. Add a stage only where the eval shows the risk.",
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
          id: "ai-architecture-p-13",
          text: "The team adds a semantic cache to cut cost. The cache takes the query text as its key. On ticket 17, a customer on the team plan asks about a refund. The cache returns an answer for the business plan with a similarity of 0.93.",
        },
        {
          kind: "paragraph",
          id: "ai-architecture-p-14",
          text: "The trace shows the hit and the stored answer. The stored answer names a 60-day window, and the team plan has a 30-day window. The semantic cache found a close meaning and missed the plan. The cost fell, and the wrong-hit rate was never measured.",
        },
        {
          kind: "paragraph",
          id: "ai-architecture-p-15",
          text: "The decision is to repair the key and the route. The key gains the tenant, the plan and the prompt version. Billing and refund requests use the exact cache only. The router sends a refund request to the large model and adds a human review. The team audits 20 hits and reports the wrong-hit rate with the cost saving.",
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
          id: "ai-architecture-p-16",
          text: "Answer four checks on the definition, design, failure and routing calculation.",
        },
        { kind: "check", id: "ai-architecture-check-1", checkId: "check-1" },
        { kind: "check", id: "ai-architecture-check-2", checkId: "check-2" },
        { kind: "check", id: "ai-architecture-check-3", checkId: "check-3" },
        { kind: "check", id: "ai-architecture-check-4", checkId: "check-4" },
      ],
    },
    {
      id: "evaluation-task",
      title: "Evaluation task",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "ai-architecture-p-17",
          text: "The task uses ten fixed tickets, one route table and one cache log. Build one script that routes the tickets, counts the cache outcomes and places the human reviews.",
        },
        { kind: "task", id: "task-ai-architecture" },
        {
          kind: "paragraph",
          id: "ai-architecture-p-18",
          text: "The reference solution routes 3 billing tickets to the large model. It routes 3 reset and 2 shipping tickets to the small model, and 2 refund tickets to the large model and human review. The cache log has 4 hits in 10 lookups, a hit rate of 0.40, and 1 wrong hit, a wrong-hit rate of 0.25. One timeout takes the fallback.",
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
          id: "ai-architecture-p-19",
          text: "Write one sentence: I changed X; the result was Y. Name the stage and the metric.",
        },
        {
          kind: "paragraph",
          id: "ai-architecture-p-20",
          text: "Self-rubric: mechanism names the stage and rule; evidence gives a rate; limit names one blind spot.",
        },
        {
          kind: "note",
          id: "ai-architecture-note-1",
          text: "A cache that improves cost can lower quality in silence. Measure wrong hits.",
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
          id: "ai-architecture-interview-1",
          items: [
            {
              question: "What is the difference between a router and a gateway?",
              answer:
                "A router chooses one model or path for a request by intent or cost. A gateway is the single interface in front of several models, with auth, logging, timeouts and fallback. The gateway carries the route, and the router makes the choice. Keep both, because they fail for different reasons.",
            },
            {
              question: "When do you choose exact caching over semantic caching?",
              answer:
                "Choose exact caching when a wrong hit is expensive, such as a billing or policy answer. An exact cache hits only on an identical query, so the answer is safe. A semantic cache saves more calls and needs a threshold, a wrong-hit audit and tenant-scoped keys. Start exact, then add semantic only where the eval shows the risk is low.",
            },
            {
              question: "How does a fallback fail, and what do you check?",
              answer:
                "A fallback fails when it is never tested, when its model has a different output shape, or when the timeout budget leaves it no time. Run a failover drill and check the output contract on the backup path. Also check the quality floor, because a cheap backup can answer in a different policy voice.",
            },
            {
              question: "How does the architecture change at 10x traffic or models?",
              answer:
                "At 10x traffic, the gateway carries the rate limits and the routing table, and the cache saves the most calls. At 10x models, a route table and a per-route eval replace hand-written conditions. Watch the p95 per route and the wrong-hit rate per tenant.",
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
      prompt: "Which sentence defines an output guardrail?",
      options: [
        { id: "option-a", label: "A check on the text before the model reads it." },
        {
          id: "option-b",
          label: "A check on the model response before the user sees it.",
        },
        { id: "option-c", label: "A backup model for a failed call." },
        { id: "option-d", label: "A stored answer for a repeated query." },
      ],
      correctOptionId: "option-b",
      explanation:
        "An output guardrail checks the response before it reaches the user. Option A names the input side, which runs before the model.",
    },
    {
      id: "check-2",
      kind: "apply",
      prompt:
        "A product has a cheap path for password resets and an expensive path for refunds. Which part sends each ticket to the right path?",
      options: [
        { id: "option-a", label: "The output guardrail" },
        { id: "option-b", label: "The router" },
        { id: "option-c", label: "The fallback" },
        { id: "option-d", label: "The cache" },
      ],
      correctOptionId: "option-b",
      explanation:
        "The router sends each request to a model or path by intent or cost. A guardrail checks text, a fallback covers a failure, and a cache reuses an answer.",
    },
    {
      id: "check-3",
      kind: "diagnose",
      prompt:
        "A semantic cache returns a refund answer for the wrong plan. What is the first check?",
      options: [
        { id: "option-a", label: "The model temperature" },
        { id: "option-b", label: "The cache key and the similarity threshold" },
        { id: "option-c", label: "The batch size" },
        { id: "option-d", label: "The router model" },
      ],
      correctOptionId: "option-b",
      explanation:
        "A wrong hit comes from a key that omits a scoping field or a threshold that is too loose. The model temperature cannot change a stored answer, so it is not the first check.",
    },
    {
      id: "check-4",
      kind: "calculate",
      prompt:
        "A cache log holds 10 lookups, 4 hits and 1 wrong hit. What is the hit rate and the wrong-hit rate?",
      options: [
        { id: "option-a", label: "0.40 and 0.25" },
        { id: "option-b", label: "0.40 and 0.10" },
        { id: "option-c", label: "0.25 and 0.40" },
        { id: "option-d", label: "0.10 and 0.25" },
      ],
      correctOptionId: "option-a",
      explanation:
        "The hit rate is 4 of 10, or 0.40, and the wrong-hit rate is 1 of 4 hits, or 0.25. Option B divides the wrong hit by all lookups, which answers a different question.",
    },
  ],
  task: {
    id: "task-ai-architecture",
    scope:
      "Route ten fixed tickets and audit a fixed cache log for wrong hits.",
    items: [
      {
        id: "item-1",
        label: "Draw the path for a billing ticket and name each stage.",
      },
      {
        id: "item-2",
        label: "Write the four fields of the cache key for the triage product.",
      },
      {
        id: "item-3",
        label: "Route the ten fixed tickets by intent and model tier.",
      },
      {
        id: "item-4",
        label: "Compute the hit rate and the wrong-hit rate from the cache log.",
      },
      {
        id: "item-5",
        label: "Add a fallback and a human-review rule for the refund slice.",
      },
    ],
    solution: {
      filename: "architecture/route.py",
      language: "python",
      code: [
        "TICKETS = [",
        '    ("t1", "billing"), ("t2", "reset"), ("t3", "billing"),',
        '    ("t4", "refund"), ("t5", "shipping"), ("t6", "reset"),',
        '    ("t7", "billing"), ("t8", "reset"), ("t9", "refund"),',
        '    ("t10", "shipping"),',
        "]",
        "",
        "ROUTES = {",
        '    "billing": "large",',
        '    "reset": "small",',
        '    "refund": "large+human",',
        '    "shipping": "small",',
        "}",
        "",
        "CACHE_LOG = [",
        '    ("q1", True, False), ("q2", False, False),',
        '    ("q3", True, True), ("q4", False, False),',
        '    ("q5", True, False), ("q6", False, False),',
        '    ("q7", True, False), ("q8", False, False),',
        '    ("q9", False, False), ("q10", False, False),',
        "]",
        "",
        "TIMEOUTS = {\"t5\"}",
        "",
        "counts = {}",
        "for ticket_id, intent in TICKETS:",
        "    route = ROUTES[intent]",
        "    counts[route] = counts.get(route, 0) + 1",
        '    if route == "large+human":',
        '        print(f"{ticket_id}: {intent} -> {route} (human review)")',
        "    else:",
        '        print(f"{ticket_id}: {intent} -> {route}")',
        "",
        'print("large:", counts["large"], "small:", counts["small"],',
        '      "human:", counts["large+human"])',
        "",
        "hits = sum(1 for _, hit, _ in CACHE_LOG if hit)",
        "wrong = sum(1 for _, hit, bad in CACHE_LOG if hit and bad)",
        "lookups = len(CACHE_LOG)",
        'print(f"hit rate {hits / lookups:.2f}")',
        'print(f"wrong-hit rate {wrong / hits:.2f}")',
        'print("fallbacks:", len(TIMEOUTS), "-> secondary model")',
      ].join("\n"),
    },
  },
  prove: {
    prompt: "Which stage did you change, and how did the metric move?",
    placeholder: "I changed X; the result was Y.",
    maxLength: 280,
    debounceMs: 800,
    savedMessage: "Proof saved on this device.",
  },
  citation:
    "Further reading: AI Engineering by Chip Huyen (O'Reilly). This course is independent and reproduces no book text or figures.",
} as const satisfies Lesson);
