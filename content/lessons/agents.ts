import type { Lesson } from "@/lib/types";
import { deepFreeze } from "../freeze";

export const agentsLesson = deepFreeze({
  slug: "agents",
  order: 4,
  title: "Agents with a stop rule",
  outcome: "You can describe an agent as a loop and add a budget guard.",
  artifact: "An agent loop with two tools and three stop conditions.",
  readingMinutes: 11,
  difficulty: "core",
  layerId: "layer-04",
  sections: [
    {
      id: "read-the-unbounded-loop",
      title: "Read: the unbounded loop",
      blocks: [
        {
          kind: "paragraph",
          id: "p-agents-1",
          text: "An agent is a loop around a model. The model reads a goal and a transcript. It chooses one action. A tool runs the action and appends the result. The loop repeats until a stop condition holds. Without a stop condition, the loop is a bill with no ceiling.",
        },
        {
          kind: "paragraph",
          id: "p-agents-2",
          text: "The sample agent answers order questions. It has two tools: lookup_order and draft_reply. The first tool reads the order status. The second tool writes a reply. The model chooses the tool and the arguments.",
        },
        {
          kind: "paragraph",
          id: "p-agents-3",
          text: "An agent is not a better prompt. It is a control loop with side effects. A tool can read a real order, send a message or charge a card. The side effect makes the stop rule mandatory.",
        },
        {
          kind: "callout",
          id: "callout-agents-loop",
          tone: "warning",
          title: "A loop is not a plan.",
          text: "A model can call a tool again with the same arguments. The loop then repeats the same step until the budget runs out.",
        },
      ],
    },
    {
      id: "read-the-stop-rule",
      title: "Read: three stop conditions",
      blocks: [
        {
          kind: "paragraph",
          id: "p-agents-4",
          text: "Three stop conditions cover most support agents. Done: the agent has the answer and the reply. Budget: the step or token limit is reached. Error: a tool fails twice and the agent cannot continue.",
        },
        {
          kind: "paragraph",
          id: "p-agents-5",
          text: "The stop rule is data, not a hope. Write the limit in the code and print the reason on exit. A run that stops must say which condition fired. A run that stops without a reason cannot be tuned.",
        },
        {
          kind: "paragraph",
          id: "p-agents-6",
          text: "A budget has two parts. The step budget counts tool calls. The token budget counts model input and output. A step can be cheap or expensive, so count both. The lower limit wins.",
        },
        {
          kind: "paragraph",
          id: "p-agents-7",
          text: "The loop also needs a progress check. If the transcript does not change after a step, the agent is stuck. Treat a repeated state as an error and stop.",
        },
        {
          kind: "paragraph",
          id: "p-agents-8",
          text: "The model does not know the budget. The code enforces it. Never ask the prompt to remember a limit, because the model can forget or ignore it.",
        },
        {
          kind: "diagram",
          id: "agent-loop",
          spec: {
            nodes: [
              { id: "goal", label: "Goal" },
              { id: "plan", label: "Model picks" },
              { id: "tool", label: "Run tool" },
              { id: "observe", label: "Add result" },
              { id: "check", label: "Stop check" },
              { id: "answer", label: "Reply" },
            ],
            edges: [
              ["goal", "plan"],
              ["plan", "tool"],
              ["tool", "observe"],
              ["observe", "check"],
              ["check", "plan"],
              ["check", "answer"],
            ],
          },
          caption:
            "The model picks a tool; the result returns to the transcript; the stop check ends the loop or repeats it.",
          alt: "Loop from goal to model choice, tool run, result, stop check, then back to the model or out to a reply.",
        },
      ],
    },
    {
      id: "check-the-stop",
      title: "Check: test the stop",
      blocks: [
        {
          kind: "paragraph",
          id: "p-agents-9",
          text: "A stop rule is testable. Give the agent a task that needs two tools. Count the steps. Then give it a task with no answer. The run must stop on the error condition, not on the step limit.",
        },
        {
          kind: "paragraph",
          id: "p-agents-10",
          text: "The second test is a repeated step. Make the first tool return the same result twice. A good guard stops on the repeat, before the budget. The transcript shows the repeated state.",
        },
        {
          kind: "paragraph",
          id: "p-agents-11",
          text: "Write three small tests, one per stop condition. A task with an answer, a task with no answer and a task with a repeated result. Run all three after every prompt change.",
        },
        { kind: "check", id: "check-agents-a", checkId: "check-1" },
        { kind: "check", id: "check-agents-b", checkId: "check-2" },
        {
          kind: "callout",
          id: "callout-agents-log",
          tone: "production-tip",
          title: "Log the stop reason.",
          text: "One line per run with the reason, the step count and the tool names turns a guard into a metric.",
        },
      ],
    },
    {
      id: "build-the-guard",
      title: "Build: the budget guard",
      blocks: [
        {
          kind: "paragraph",
          id: "p-agents-12",
          text: "The guard is small. Keep a step counter, a call counter and a seen set of tool calls. Before a tool call, check the budget and the repeat. After a tool call, add the result to the transcript.",
        },
        {
          kind: "paragraph",
          id: "p-agents-13",
          text: "Return a result object, not a bare string. The object holds the reply, the reason and the steps. The caller stores the reason with the score. A guard that hides its reason cannot be debugged.",
        },
        {
          kind: "paragraph",
          id: "p-agents-14",
          text: "Keep the tool set small. Two tools with clear inputs are easier to guard than ten tools with overlapping jobs. A tool that can do anything makes the loop impossible to stop.",
        },
        {
          kind: "code",
          id: "code-agents-loop",
          filename: "agents/agent_loop.py",
          language: "python",
          code: [
            "MAX_STEPS = 3",
            "",
            "def lookup_order(order_id: str) -> str:",
            '    return "late" if order_id == "A-17" else "unknown"',
            "",
            'TOOLS = {"lookup_order": lookup_order, "draft_reply": lambda text: "Reply: " + text}',
            "",
            "def run_agent(task: str) -> dict:",
            "    transcript, seen, steps = [], set(), 0",
            "    while steps < MAX_STEPS:",
            "        steps += 1",
            '        if any("late" in line for line in transcript):',
            '            reply = TOOLS["draft_reply"]("the parcel is late")',
            '            return {"reply": reply, "reason": "done", "steps": steps}',
            '        call = ("lookup_order", "A-17")',
            "        if call in seen:",
            '            return {"reply": "", "reason": "repeat", "steps": steps}',
            "        seen.add(call)",
            '        transcript.append(f"lookup_order -> {TOOLS[call[0]](call[1])}")',
            '    return {"reply": "", "reason": "budget", "steps": steps}',
            "",
            'print(run_agent("where is my order"))',
          ].join("\n"),
          output: {
            label: "Sample output. Fixed data.",
            text: "{'reply': 'Reply: the parcel is late', 'reason': 'done', 'steps': 2}",
          },
        },
        {
          kind: "paragraph",
          id: "p-agents-15",
          text: "Read the result. The run stops after two steps with the reason done. The reply names the late parcel. The step count is the budget evidence, and the reason is the exit evidence.",
        },
        {
          kind: "paragraph",
          id: "p-agents-16",
          text: "The loop returns one object with a fixed shape. The caller stores the reason next to the score. When a run stops on budget, the score falls and the reason explains why.",
        },
        { kind: "task", id: "task-agents" },
        {
          kind: "note",
          id: "note-agents",
          text: "A stop reason is part of the product. Show it to the operator, not only to the log.",
        },
      ],
    },
    {
      id: "prove-the-loop",
      title: "Prove: name the stop",
      blocks: [
        {
          kind: "paragraph",
          id: "p-agents-17",
          text: "The proof note names the guard and the result. For example, I added a repeat check and a step budget of three. The stuck task stopped with reason repeat after one step, not at the limit.",
        },
        {
          kind: "paragraph",
          id: "p-agents-18",
          text: "A note that says the agent works is weak. Name the task, the reason and the step count. Those three values show that the loop ended on purpose.",
        },
        {
          kind: "paragraph",
          id: "p-agents-19",
          text: "Run the three stop tests after a tool change. A new tool can add a step and break a task that passed before.",
        },
        {
          kind: "callout",
          id: "callout-agents-calls",
          tone: "note",
          title: "Count the calls, not the words.",
          text: "A long answer can take one step. A short answer can take six tool calls. The budget follows the calls.",
        },
      ],
    },
  ],
  checks: [
    {
      id: "check-1",
      prompt: "A tool returns the same result twice. Which stop condition should fire first?",
      options: [
        { id: "option-a", label: "Budget, after the step limit" },
        { id: "option-b", label: "Repeat, before the budget" },
        { id: "option-c", label: "Done, with the answer" },
        { id: "option-d", label: "No condition; run once more" },
      ],
      correctOptionId: "option-b",
      explanation:
        "A repeated state means the loop makes no progress, so the guard stops before the budget. Waiting for the budget spends steps on a task that cannot finish.",
    },
    {
      id: "check-2",
      prompt: "Where should the step budget live?",
      options: [
        { id: "option-a", label: "In the prompt text" },
        { id: "option-b", label: "In the code around the loop" },
        { id: "option-c", label: "Inside the tool" },
        { id: "option-d", label: "In the transcript" },
      ],
      correctOptionId: "option-b",
      explanation:
        "The code counts steps and enforces the limit on every pass. A prompt can state a limit, but the model can ignore it and the loop keeps running.",
    },
  ],
  task: {
    id: "task-agents",
    scope: "Add a budget guard and three stop conditions to the order agent.",
    items: [
      { id: "item-1", label: "List the two tools and their inputs." },
      { id: "item-2", label: "Write the step budget in the loop code." },
      { id: "item-3", label: "Add a repeat check for the same tool call." },
      { id: "item-4", label: "Return a result object with reply, reason and steps." },
      { id: "item-5", label: "Run a task with no answer and record the stop reason." },
    ],
    solution: {
      filename: "agents/agent_loop.py",
      language: "python",
      code: [
        "MAX_STEPS = 3",
        "",
        "def run_agent(task: str) -> dict:",
        "    transcript, seen, steps = [], set(), 0",
        "    while steps < MAX_STEPS:",
        "        steps += 1",
        '        call = ("lookup_order", "A-17")',
        "        if call in seen:",
        '            return {"reply": "", "reason": "repeat", "steps": steps}',
        "        seen.add(call)",
        "        transcript.append('lookup_order -> late')",
        '    return {"reply": "", "reason": "budget", "steps": steps}',
      ].join("\n"),
    },
  },
  prove: {
    prompt: "Which guard did you add, and why did the loop stop?",
    placeholder: "I changed X; the result was Y.",
    maxLength: 280,
    debounceMs: 800,
    savedMessage: "Proof saved on this device.",
  },
  citation:
    "Further reading on agents: AI Engineering by Chip Huyen (O'Reilly). This course is independent and reproduces no book text or figures.",
} as const satisfies Lesson);
