import type { Lesson } from "@/lib/types";
import { deepFreeze } from "../freeze";

export const contextEngineeringLesson = deepFreeze({
  slug: "context-engineering",
  order: 13,
  title: "Spend context on purpose",
  chapterId: "ch-05",
  chapterOrder: 5,
  status: "live",
  outcome:
    "You can build a token budget, diagnose a lost-in-the-middle failure, and defend a long-context or RAG choice. Prerequisite: lesson 2 on context windows and lesson 11 on prompt contracts. You need the fixed 8,000-token budget and four parts.",
  artifact:
    "A token budget, a compression plan and a recall-by-position table.",
  readingMinutes: 26,
  difficulty: "advanced",
  terms: [
    {
      term: "Context engineering",
      definition: "The deliberate selection of what enters the context window.",
    },
    {
      term: "Context budget",
      definition:
        "The token allowance split across rules, examples, chunks and history.",
    },
    {
      term: "Context window",
      definition:
        "The maximum number of tokens that a model can read in one call, input plus output.",
    },
    {
      term: "Lost in the middle",
      definition:
        "The drop in recall for facts placed in the middle of a long context.",
    },
    {
      term: "Prefix caching (prompt caching)",
      definition:
        "Reuse of a cached prompt prefix to cut cost and time to first token.",
    },
    {
      term: "Token",
      definition:
        "A unit of text that a tokenizer maps to a number; models read and write tokens, not words.",
    },
  ],
  evalCase: {
    id: "case-context-engineering",
    brief: "Cut a prompt to budget without losing the refund rule.",
  },
  sections: [
    {
      id: "before-you-start",
      title: "Before you start",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "context-p-1",
          text: "This lesson needs lesson 2 on context windows and lesson 11 on prompt contracts. You need the fixed 8,000-token budget and the four parts from the lab.",
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
          id: "context-p-2",
          text: "Context engineering is the deliberate selection of what enters the context window. The context window is the maximum number of tokens that a model can read in one call, input plus output. The work sets a context budget: the token allowance split across rules, examples, retrieved chunks and history.",
        },
        {
          kind: "paragraph",
          id: "context-p-3",
          text: "A support agent has 8,000 tokens. It assigns 600 to rules, 500 to examples, 2,400 to chunks and 800 to history, and it reserves 1,200 tokens for the answer. The remaining 2,500 tokens are headroom for a longer chunk or a tool result.",
        },
        {
          kind: "paragraph",
          id: "context-p-4",
          text: "A team pastes the whole knowledge base into every call. The prompt is long, the middle is ignored and the cost rises with every document. The team selects nothing, so the work is not context engineering.",
        },
      ],
    },
    {
      id: "eli5-day-pack",
      title: "A day pack",
      register: "eli5",
      blocks: [
        {
          kind: "analogy",
          id: "context-analogy-1",
          text: "Think of a day pack with a fixed weight limit. You choose a map, a water bottle, a rain coat and a lunch, and you leave the heavy book at home. The map goes in the top pocket, because you need it at the start and at the end. The pack is the context window, the items are the tokens, and the top pocket is the start and end of the prompt. A full pack is not a good pack if the map sits at the bottom.",
          breaks:
            "a pack keeps every item at full weight, while a model reads the middle of a long prompt less reliably than the start and end.",
        },
        {
          kind: "paragraph",
          id: "context-p-5",
          text: "Prediction: the map sits in the middle of the pack. Will you find it as fast as the map in the top pocket?",
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
          id: "context-p-6",
          text: "Context engineering is a budget problem with a recall problem inside it. Count first, then order, then measure.",
        },
        {
          kind: "list",
          id: "context-list-1",
          ordered: true,
          items: [
            "Count the prompt in tokens with the model tokenizer.",
            "Reserve the output tokens first.",
            "Assign the fixed parts: rules, examples and history.",
            "Assign the variable parts: retrieved chunks and tool results.",
            "Order the prompt: stable rules first, question near the end, data between.",
            "Measure recall by position on a fixed eval.",
            "Compress or split the task when the total passes the budget.",
          ],
        },
        {
          kind: "paragraph",
          id: "context-p-7",
          text: "The context budget is the token allowance split across rules, examples, chunks and history. Count with the tokenizer, not with words. A rough ratio of one token to four characters helps a first estimate, but the tokenizer sets the bill. Reserve the output tokens before you fill the input.",
        },
        {
          kind: "paragraph",
          id: "context-p-8",
          text: "Lost in the middle is the drop in recall for facts placed in the middle of a long context. A model often recalls a fact at the start or the end better than the same fact in the middle. Put the rule at the start, repeat it after the data and put the most relevant chunk next to the question. A fixed eval with one fact in three positions measures the gap for your model.",
        },
        {
          kind: "paragraph",
          id: "context-p-9",
          text: "Long context sends every document in one call. It preserves cross-references, needs no index and costs tokens on every request. RAG sends a few retrieved chunks. It is cheaper and fresher and can miss a document. Choose long context for a small static corpus and RAG for a large or changing one. A hybrid sends the top few full documents after retrieval.",
        },
        {
          kind: "paragraph",
          id: "context-p-9a",
          text: "A simple count decides the choice. Count the tokens of the full corpus. If the count fits the budget with room for the answer, long context is a candidate. If the corpus changes daily, or the count passes the budget, retrieval is the safer design. A hybrid is the middle rung: retrieve the top few documents, then send each one in full.",
        },
        {
          kind: "paragraph",
          id: "context-p-10",
          text: "Compression removes tokens without removing the answer. Summarize old history, extract fields from tool output, dedupe chunks and drop boilerplate. A summary can lose a date or a negation, so eval the compressed prompt on the same cases. Compress the low-value parts first, such as repeated instructions.",
        },
        {
          kind: "paragraph",
          id: "context-p-11",
          text: "Prefix caching (prompt caching) reuses a cached prompt prefix to cut cost and time to first token. The cache hits only when the first tokens match exactly, so put the stable rules and examples first and the variable data last. A rule change starts a new prefix and a cache miss. Measure the hit rate and the saved cost.",
        },
        {
          kind: "paragraph",
          id: "context-p-12",
          text: "Order matters as much as size. A prompt that begins with a stable rule block can use a cache. A prompt that puts the question last gives the model a clear final target. A prompt that repeats the key rule after a long data block fights lost in the middle. Keep a table of the budget beside the prompt, so each part has a named owner and a limit.",
        },
        {
          kind: "paragraph",
          id: "context-p-12a",
          text: "A task that does not fit has a second repair: split it. Summarize one section per call, or send one question per document and merge the answers. A split adds calls and a merge step, and it keeps each call inside the window. Measure the merged answer, because a split can lose a link between two sections.",
        },
        {
          kind: "table",
          id: "context-table-1",
          columns: ["Part", "Budget", "Rule"],
          rows: [
            ["Rules and role", "600 tokens", "Stable, cacheable, first"],
            ["Examples", "500 tokens", "Two or three, consistent"],
            ["Chunks and history", "3,200 tokens", "Rank by relevance, compress"],
            ["Output reserve", "1,200 tokens", "Reserved before input"],
          ],
          caption: "A fixed 8,000-token budget and the rule for each part.",
        },
        {
          kind: "diagram",
          id: "context-diagram-1",
          variant: "bars",
          spec: {
            nodes: [
              { id: "rules", label: "Rules", value: 600, unit: "tokens" },
              { id: "examples", label: "Examples", value: 500, unit: "tokens" },
              { id: "chunks", label: "Chunks", value: 2400, unit: "tokens" },
              { id: "history", label: "History", value: 800, unit: "tokens" },
              { id: "output", label: "Output reserve", value: 1200, unit: "tokens" },
              { id: "free", label: "Free", value: 2500, unit: "tokens" },
            ],
            edges: [
              ["rules", "examples"],
              ["examples", "chunks"],
              ["chunks", "history"],
              ["history", "output"],
              ["output", "free"],
            ],
          },
          caption:
            "Six parts share the 8,000-token budget; output is reserved before input is filled.",
          alt: "Bars from rules and examples through chunks, history and output reserve to 2,500 free tokens.",
        },
        {
          kind: "paragraph",
          id: "context-p-13",
          text: "Each choice is a trade. A larger budget raises recall on some cases and adds cost, latency and middle-position noise. Compression cuts cost and can drop a date or a negation. A cache cuts cost and time to first token and fails on the first changed token.",
        },
      ],
    },
    {
      id: "eli5-reading-lamp",
      title: "A reading lamp",
      register: "eli5",
      blocks: [
        {
          kind: "analogy",
          id: "context-analogy-2",
          text: "Think of a wide desk with one lamp above the middle. Papers at the two ends of the desk catch the light at an angle, and papers under the lamp are bright. A reader starts at the left edge and the right edge, and the middle page is easy to skip. The desk is the context window, the papers are chunks, and the lamp is the model's attention. The most important page belongs at an edge, not in the pile.",
          breaks:
            "a lamp lights every page the same way, while a model's recall also depends on the content and the question.",
        },
        {
          kind: "paragraph",
          id: "context-p-14",
          text: "Prediction: the refund rule sits in the middle page. Will the model quote it as often as the same rule on the first page?",
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
          id: "context-p-15",
          text: "Context selection fails in four common ways. Each one has a cheap check.",
        },
        {
          kind: "table",
          id: "context-table-2",
          columns: ["Symptom", "Cause", "Check", "Fix"],
          rows: [
            [
              "The answer misses a rule in the middle",
              "Lost in the middle",
              "Place one fact at three positions and score",
              "Move the rule to the start and repeat it at the end",
            ],
            [
              "The bill rises with every call",
              "The prompt repeats a large static block",
              "Count the prefix tokens",
              "Cache the prefix and move variable data last",
            ],
            [
              "The answer mixes two documents",
              "Too many chunks with no order",
              "Inspect the chunk order and duplicates",
              "Rank, dedupe and cut to top-k",
            ],
            [
              "The summary drops a date",
              "Compression removed a critical token",
              "Compare answers before and after compression",
              "Keep dates, numbers and negations; compress the rest",
            ],
          ],
          caption: "Four context failures, from position to compression.",
        },
        {
          kind: "paragraph",
          id: "context-p-16",
          text: "A larger budget raises recall on some cases and adds cost, latency and middle-position noise. A smaller budget is cheaper and can drop the one chunk that answers the question.",
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
          id: "context-p-17",
          text: "The support assistant has an 8,000-token budget. On a fixed 30-case refund sample, the answer matches the expected policy on 18 cases, a pass rate of 0.60. The cost is 0.94 per 1,000 calls and the p95 is 2,400 ms.",
        },
        {
          kind: "paragraph",
          id: "context-p-18",
          text: "The team adds three long policy documents to fix a missing answer. The trace shows the refund rule at token 5,800, after the documents. The model quotes the first document and misses the 30-day window in the middle. The pass rate stays at 0.60, the cost rises to 1.28 per 1,000 calls and the p95 rises to 3,100 ms.",
        },
        {
          kind: "paragraph",
          id: "context-p-19",
          text: "The broken layer is context selection, not the model. The team moves the rule to the start, repeats it after the documents, ranks chunks by relevance and cuts three documents to one. The sample rises to 27 of 30, a pass rate of 0.90. The cost falls to 0.74 per 1,000 calls and the p95 falls to 2,050 ms. The decision is to keep the position test in the eval set.",
        },
      ],
    },
    {
      id: "run-the-budget-lab",
      title: "Run the budget lab",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "context-p-20",
          text: "The lab holds the 8,000-token budget and four parts. Move one slider and read the overflow line. The fixed budget is the only constraint.",
        },
        {
          kind: "interactive",
          id: "context-interactive-1",
          widget: "context-budget-lab",
          caption:
            "Move the four token sliders against the fixed 8,000-token budget and watch the overflow.",
        },
        {
          kind: "paragraph",
          id: "context-p-21",
          text: "Try this: set chunks to 4,000 and history to 3,000. The line crosses the budget. Cut history to 800 and read the line again.",
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
          id: "context-p-22",
          text: "Answer five checks on the definition, the choice, the failure and the budget.",
        },
        { kind: "check", id: "context-check-1", checkId: "check-1" },
        { kind: "check", id: "context-check-2", checkId: "check-2" },
        { kind: "check", id: "context-check-3", checkId: "check-3" },
        { kind: "check", id: "context-check-4", checkId: "check-4" },
        { kind: "check", id: "context-check-5", checkId: "check-5" },
      ],
    },
    {
      id: "evaluation-task",
      title: "Evaluation task",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "context-p-23",
          text: "Use the four fixed parts and the 8,000-token budget. Build one script that prints the planned split, the overflow, the compressed split and the recall by position. Tick each step when its output is visible.",
        },
        { kind: "task", id: "task-context-engineering" },
        {
          kind: "paragraph",
          id: "context-p-24",
          text: "The reference solution prints 5,500 used and 2,500 free. A 5,000-token chunk block overflows by 100, and the compressed split leaves 1,400 free. Recall is 1.00 at the start, 0.33 in the middle and 1.00 at the end. The middle fact rises to 1.00 after a move to the end.",
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
          id: "context-p-25",
          text: "Write one sentence: I changed X; the result was Y. Name the position rule, the budget and the recall number.",
        },
        {
          kind: "paragraph",
          id: "context-p-26",
          text: "Self-rubric: mechanism names the layer and the rule; evidence gives a fixed number or order; limit names one blind spot or failed case.",
        },
        {
          kind: "paragraph",
          id: "context-p-27",
          text: "Example: I moved the refund rule to the start and repeated it after the chunks. Recall on the middle fact rose from 0.33 to 1.00, but a longer answer can still push the rule past the cache line.",
        },
        {
          kind: "note",
          id: "context-note-1",
          text: "A budget without a position test is only a token count. Measure where the fact sits.",
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
          id: "context-interview-1",
          items: [
            {
              question: "What is context engineering?",
              answer:
                "Context engineering is the deliberate selection of what enters the context window, not only the wording of one instruction. It sets a context budget for rules, examples, chunks and history. Prompt wording shapes one instruction; context engineering decides which evidence the model can see.",
            },
            {
              question: "When do you choose long context over RAG?",
              answer:
                "Choose long context when the corpus is small, static and full of cross-references, such as one contract set. It avoids an index and keeps every link. Choose RAG when the corpus is large or changes often, because tokens cost money on every call and the middle loses recall.",
            },
            {
              question: "How does context fail, and what do you check first?",
              answer:
                "It fails when a rule in the middle is missed, when a large static prefix raises cost, or when too many chunks blur the answer. Check the position of the missing fact and the token count before you change the model. Then move the rule to an edge, dedupe the chunks and cache the stable prefix.",
            },
            {
              question: "At 10x tokens or traffic, what changes?",
              answer:
                "At 10x tokens, a full-context call grows linearly in cost and the middle recall gap widens, so compress or retrieve. At 10x traffic, prefix caching and batched calls carry the load, and the cache hit rate becomes a cost metric. Track p95 latency, cost per 1,000 calls and recall on the position eval together.",
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
      prompt: "Which sentence defines lost in the middle?",
      options: [
        { id: "option-a", label: "The model forgets the system prompt." },
        {
          id: "option-b",
          label: "Recall drops for facts placed in the middle of a long context.",
        },
        { id: "option-c", label: "A cache misses when the prefix changes." },
        { id: "option-d", label: "The tokenizer splits a word into parts." },
      ],
      correctOptionId: "option-b",
      explanation:
        "Lost in the middle is a position effect: the same fact is recalled less often in the middle than at an edge. A cache miss is a prefix effect, not a recall effect.",
    },
    {
      id: "check-2",
      kind: "apply",
      prompt:
        "A corpus holds 200,000 documents and changes every day. Which design fits best?",
      options: [
        { id: "option-a", label: "Send every document in one call" },
        { id: "option-b", label: "Retrieve a few chunks at query time" },
        { id: "option-c", label: "Cache every document in the prompt" },
        { id: "option-d", label: "Drop the corpus and use the model's memory" },
      ],
      correctOptionId: "option-b",
      explanation:
        "A large, fresh corpus needs retrieval, because a full-context call costs a token for every document. Caching every document does not fit the window, and model memory is not a source of policy facts.",
    },
    {
      id: "check-3",
      kind: "diagnose",
      prompt:
        "A model misses a rule at token 5,800 of an 8,000-token prompt. What do you change first?",
      options: [
        { id: "option-a", label: "Buy a larger context window" },
        { id: "option-b", label: "Move the rule to the start and repeat it at the end" },
        { id: "option-c", label: "Raise the temperature" },
        { id: "option-d", label: "Add ten more examples" },
      ],
      correctOptionId: "option-b",
      explanation:
        "The failure follows the position, so move the rule to an edge and repeat it after the data. A larger window adds cost and keeps the middle gap, and more examples add more middle text.",
    },
    {
      id: "check-4",
      kind: "calculate",
      prompt:
        "A budget holds 8,000 tokens. The output reserve is 1,200, the rules are 600 and the examples are 500. How many tokens remain for chunks and history?",
      options: [
        { id: "option-a", label: "4,500 tokens" },
        { id: "option-b", label: "5,700 tokens" },
        { id: "option-c", label: "6,900 tokens" },
        { id: "option-d", label: "7,400 tokens" },
      ],
      correctOptionId: "option-b",
      explanation:
        "The fixed parts cost 2,300 tokens, so 5,700 tokens remain. A value of 7,400 forgets the output reserve and the rules.",
    },
    {
      id: "check-5",
      kind: "apply",
      prompt: "Which change keeps a prefix cache hit?",
      options: [
        { id: "option-a", label: "Edit one sentence in the system rules." },
        { id: "option-b", label: "Add a new question to the end of the prompt." },
        { id: "option-c", label: "Swap the first two examples." },
        { id: "option-d", label: "Replace the role at the start." },
      ],
      correctOptionId: "option-b",
      explanation:
        "A cache hit needs the first tokens to match, so a change at the end keeps the prefix. A rule, example or role edit changes the prefix and starts a new cache entry.",
    },
  ],
  task: {
    id: "task-context-engineering",
    scope:
      "Build an 8,000-token budget, compress it, and measure recall by position.",
    items: [
      {
        id: "item-1",
        label: "Print the planned split and the free tokens.",
      },
      {
        id: "item-2",
        label: "Add one long part and compute the overflow.",
      },
      {
        id: "item-3",
        label: "Compress history and chunks until the total fits, and name the removed content.",
      },
      {
        id: "item-4",
        label: "Score recall for one fact at the start, middle and end.",
      },
      {
        id: "item-5",
        label:
          "Apply the reorder rule to a second fact and state whether recall rises.",
      },
    ],
    solution: {
      filename: "context/budget.py",
      language: "python",
      code: [
        "BUDGET = 8000",
        "",
        "PLANNED = {",
        '    "rules": 600,',
        '    "examples": 500,',
        '    "chunks": 2400,',
        '    "history": 800,',
        '    "output": 1200,',
        "}",
        "",
        "",
        "def used(parts):",
        "    return sum(parts.values())",
        "",
        "",
        "def report(name, parts):",
        "    total = used(parts)",
        '    print(f"{name}: used {total} free {BUDGET - total}")',
        "",
        "",
        "report(\"planned\", PLANNED)",
        "",
        'long_parts = dict(PLANNED, chunks=5000)',
        'report("long chunks", long_parts)',
        'print(f"overflow {used(long_parts) - BUDGET}")',
        "",
        "COMPRESSED = {",
        '    "rules": 600,',
        '    "examples": 500,',
        '    "chunks": 4000,',
        '    "history": 300,',
        '    "output": 1200,',
        "}",
        'report("compressed", COMPRESSED)',
        'print("removed: repeated history and near-duplicate chunk text")',
        "",
        "POSITIONS = [(\"start\", 3, 3), (\"middle\", 1, 3), (\"end\", 3, 3)]",
        "",
        "",
        "def recall(found, total):",
        "    return found / total",
        "",
        "",
        "for position, found, total in POSITIONS:",
        '    print(f"recall {position}: {found}/{total} {recall(found, total):.2f}")',
        "",
        'after = ("end", 3, 3)',
        'print(f"after move: {after[0]} {after[1]}/{after[2]} {recall(after[1], after[2]):.2f}")',
        "",
        'second_before = ("middle", 2, 3)',
        'second_after = ("end", 3, 3)',
        'print(f"second fact before {second_before[0]} {recall(second_before[1], second_before[2]):.2f}")',
        'print(f"second fact after  {second_after[0]} {recall(second_after[1], second_after[2]):.2f}")',
      ].join("\n"),
    },
  },
  prove: {
    prompt: "Which position rule did you change, and how did recall move?",
    placeholder: "I changed X; the result was Y.",
    maxLength: 280,
    debounceMs: 800,
    savedMessage: "Proof saved on this device.",
  },
  citation:
    "Further reading: AI Engineering by Chip Huyen (O'Reilly). This course is independent and reproduces no book text or figures.",
} as const satisfies Lesson);
