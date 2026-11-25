import type { Lesson } from "@/lib/types";
import { deepFreeze } from "../freeze";

export const agentsLesson = deepFreeze({
  slug: "agents",
  order: 16,
  title: "Agents with stop rules",
  chapterId: "ch-06",
  chapterOrder: 6,
  status: "live",
  terms: [
    {
      term: "Agent",
      definition:
        "A model that plans, calls tools, observes results and repeats until a stop rule fires.",
    },
    {
      term: "Tool schema",
      definition:
        "The typed description of a tool name, arguments and return shape.",
    },
    {
      term: "Function calling",
      definition:
        "The model's structured request to run a named tool with arguments.",
    },
    {
      term: "Trajectory",
      definition:
        "The ordered record of an agent's steps, tool calls and observations.",
    },
    {
      term: "Stop condition",
      definition:
        "A rule that ends the agent loop, such as a step budget or a final answer.",
    },
    {
      term: "Planning",
      definition:
        "The decomposition of a goal into ordered steps before action.",
    },
  ],
  evalCase: {
    id: "case-agents",
    brief: "Repair a loop that repeats a failed tool call.",
  },
  outcome:
    "You can define an agent loop, write a tool schema, choose stop conditions and repair a stuck run. Prerequisite: lesson 14, retrieval.",
  artifact:
    "A runnable agent_loop.py with three tools, five stop rules and four fixed scenarios.",
  readingMinutes: 28,
  difficulty: "advanced",
  layerId: "layer-04",
  sections: [
    {
      id: "what-it-is",
      title: "What it is",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "ag-p-1",
          text: "An agent is a model that plans, calls tools, observes results and repeats until a stop rule fires. The loop has three parts: a goal, a set of tools and a stop condition. The code runs the tools, so the loop has side effects.",
        },
        {
          kind: "paragraph",
          id: "ag-p-2",
          text: "A tool schema is the typed description of a tool name, arguments and return shape. Function calling is the model's structured request to run a named tool with arguments. The code validates the request against the schema before it runs the tool.",
        },
        {
          kind: "paragraph",
          id: "ag-p-3",
          text: "A worked example: a research agent answers questions about a document set. Its tools are search_docs and draft_summary. The model reads the goal and the trajectory, calls search_docs with a query, reads the passages, and calls draft_summary. The loop stops when the summary is ready or the step budget is spent.",
        },
        {
          kind: "paragraph",
          id: "ag-p-4",
          text: "A non-example: a prompt that returns one answer is not an agent. It makes no tool call and reads no new observation. A chain of fixed prompts is also not an agent, because no decision at one step changes the next step.",
        },
      ],
    },
    {
      id: "eli5-a-cook-with-a-ticket",
      title: "A cook with a ticket",
      register: "eli5",
      blocks: [
        {
          kind: "analogy",
          id: "ag-analogy-1",
          text: "Think of a cook in a kitchen with a fixed number of actions. The cook reads the order, picks one tool, uses it, and looks at the result. A knife, an oven or a phone is a tool, and the ticket is the goal. The ticket lists the goal, and the kitchen holds the tools. The head chef ends the shift with one clear rule: the dish is ready, the same action fails twice, or the timer rings.",
          breaks:
            "Where it breaks: a cook can taste the dish and knows when it is ready. A model has no taste, so the stop rule and the success test must live in code.",
        },
        {
          kind: "paragraph",
          id: "ag-p-5",
          text: "The cook drops the same pan twice. Which rule ends the shift: the dish is ready, the failed-action rule, or the timer?",
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
          id: "ag-p-6",
          text: "An agent is a control loop, not one prompt. The code owns the loop, the tools and the limits. The model owns one choice at each step.",
        },
        {
          kind: "list",
          id: "ag-list-1",
          ordered: true,
          items: [
            "Write the goal and the success test in words that a person can check.",
            "Define each tool schema: name, arguments, types, return shape and error shape.",
            "Send the goal, the schemas and the trajectory to the model.",
            "Parse the function call, and validate the arguments against the schema.",
            "Run the tool, and capture its output or its error.",
            "Append the observation to the trajectory.",
            "Check the stop conditions: done, repeat, tool error, step budget and token budget.",
            "Return a result object with the reply, the reason and the step count.",
            "Store memory outside the window, and retrieve only what the next step needs.",
          ],
        },
        {
          kind: "paragraph",
          id: "ag-p-7",
          text: "The tool schema is the contract. Name each tool, list each argument and its type, and state the return shape. A schema with free text arguments invites an invalid call, because the model can invent a field. Validate every argument in code, and return a typed error to the model. A tool with one clear job is easier to guard than a tool that can do anything.",
        },
        {
          kind: "paragraph",
          id: "ag-p-8",
          text: "Function calling turns a model choice into a structured request. The model returns a tool name and arguments, and the code decides whether to run it. The model does not run the tool, and it does not see the result until the code appends it. This split keeps the side effect under code control. A tool call without a schema check is untrusted input.",
        },
        {
          kind: "paragraph",
          id: "ag-p-9",
          text: "Planning decomposes the goal into ordered steps before action. A plan helps when the task needs several tools in a known order. A plan also raises a risk, because the model can follow a stale plan after an observation changes the task. Keep the plan short, and let the loop revise it after each observation. A plan is not a substitute for a stop rule.",
        },
        {
          kind: "paragraph",
          id: "ag-p-10",
          text: "The stop condition is data in the code. A done check tests the success test. A repeat check compares the tool name and arguments with the trajectory. An error check tests the tool result. A budget check counts steps and tokens, and the lower limit wins. The model does not enforce a budget, because the model can forget or ignore a prompt limit.",
        },
        {
          kind: "paragraph",
          id: "ag-p-11",
          text: "The common failures fall into four classes. An invalid tool or argument fails the schema. A goal failure returns a fluent answer that does not meet the success test. A reflection error accepts a wrong result as done. An efficiency failure spends many steps on a simple task. Each class needs its own check in the trajectory, and the stop reason names the class.",
        },
        {
          kind: "paragraph",
          id: "ag-p-12",
          text: "Agent memory has two parts. Short-term memory is the trajectory of this run, and it grows with each step. Long-term memory is stored state that a later run reads, such as a customer fact. The context window limits both, so summarize old steps or retrieve a stored fact. Memory can carry a stale fact into a new run, so store the source and the date.",
        },
        {
          kind: "paragraph",
          id: "ag-p-25",
          text: "A schema also needs a failure shape. State what the tool returns on a bad argument, on a timeout and on an empty result. The model reads that error text as an observation, so a clear error helps the next step. A tool that raises a raw stack trace gives the model no useful signal. Return a short code and one sentence that names the fix.",
        },
        {
          kind: "paragraph",
          id: "ag-p-26",
          text: "A stop reason is a metric, not a log line. Count the reasons across runs: done, repeat, error and budget. A rise in repeat points to a stale plan or a broken tool. A rise in budget points to a goal that is too broad or a step that is too slow. A rise in error points to a schema or a service fault. Review the counts per tool and per task type.",
        },
        {
          kind: "table",
          id: "ag-table-1",
          columns: ["Stage", "Input", "Output"],
          rows: [
            ["Model call", "Goal, schemas, trajectory", "Tool name and arguments"],
            ["Tool call", "Name, arguments, schema", "Observation or typed error"],
            ["Stop check", "Trajectory, budgets, success test", "Reason or next step"],
          ],
          caption: "Inputs and outputs at each point in the loop.",
        },
        {
          kind: "diagram",
          id: "ag-diagram-1",
          variant: "flow",
          spec: {
            nodes: [
              { id: "goal", label: "Goal" },
              { id: "plan", label: "Model picks" },
              { id: "tool", label: "Validate and run" },
              { id: "observe", label: "Observe" },
              { id: "check", label: "Stop check" },
              { id: "answer", label: "Answer" },
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
            "The model picks a tool, the code validates and runs it, and the stop check repeats the loop or returns an answer.",
          alt: "Loop from goal to model choice, tool run, observation and stop check, then back to the model or out to an answer.",
        },
        {
          kind: "paragraph",
          id: "ag-p-13",
          text: "A larger step budget raises success and cost. A richer tool set raises capability and the chance of a wrong call. A longer memory raises continuity and the token bill.",
        },
      ],
    },
    {
      id: "eli5-a-driver-with-a-route",
      title: "A driver with a route",
      register: "eli5",
      blocks: [
        {
          kind: "analogy",
          id: "ag-analogy-2",
          text: "Think of a driver with a delivery list and a fuel tank. Each stop is a tool call, and the odometer is the step count. The dispatcher ends the route with one rule: the parcel is delivered, the driver returns to the same address, or the fuel is empty. A written note of each stop is the trajectory.",
          breaks:
            "Where it breaks: a driver sees the road and knows a bad turn. An agent sees only text observations, so a wrong result can look like progress.",
        },
        {
          kind: "paragraph",
          id: "ag-p-14",
          text: "The driver returns to the same address a second time. Which rule stops the route first: delivered, repeat, or fuel?",
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
          id: "ag-table-2",
          columns: ["Symptom", "Cause", "Check", "Fix"],
          rows: [
            [
              "The agent repeats the same call",
              "No progress check",
              "Find duplicate name and argument pairs",
              "Add a repeat guard on the call key",
            ],
            [
              "The tool rejects the arguments",
              "The schema is not enforced",
              "Validate each field and type",
              "Reject the call and return a schema error",
            ],
            [
              "The run stops at the budget with no answer",
              "The goal was not decomposed",
              "Read the stop reason and the last observation",
              "Add a plan step, then raise the budget",
            ],
            [
              "A simple task takes many steps",
              "No efficiency budget",
              "Count steps and calls per run",
              "Set a step target and a p95 target",
            ],
          ],
          caption: "Four agent failures, each with one check.",
        },
        {
          kind: "paragraph",
          id: "ag-p-15",
          text: "A stop rule is a trade. A small budget cuts cost and can end a valid plan. A large budget raises success and lets a stuck run spend money.",
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
          id: "ag-p-16",
          text: "The support agent answers order questions from a fixed order service. The goal is a reply with the parcel status. The tools are lookup_order and draft_reply. The budget is six steps, and the loop counts steps only.",
        },
        {
          kind: "paragraph",
          id: "ag-p-17",
          text: "A reader asks where is my order B-00. The trace shows step 1 lookup_order B-00, and the tool returns error: timeout. Step 2 sends the same call with the same arguments, and step 3 does the same. The loop has a done check and a step budget, so the run reaches step 6 with an empty reply and the reason budget.",
        },
        {
          kind: "paragraph",
          id: "ag-p-18",
          text: "The state does not change after step 1, so more steps cannot help. The break is the missing repeat guard, not the model. The team adds a seen set of tool name and argument pairs, checks it before each call, and stops with reason repeat at step 2. The run now makes one tool call and returns a result object with reply, reason and steps. A test with a valid order returns reason done at step 3. A test with a tool that raises stops with reason error at step 1.",
        },
      ],
    },
    {
      id: "run-the-agent-trace",
      title: "Run the agent trace",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "ag-p-19",
          text: "Press Step to advance the fixed trace. Set the step budget to three, then inject a tool error. Watch which stop reason fires first.",
        },
        {
          kind: "interactive",
          id: "ag-interactive-1",
          widget: "agent-trace",
          caption:
            "Advance a fixed agent trace and change the step budget and the tool error.",
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
          id: "ag-p-20",
          text: "Answer five questions on the loop, the schema, the stop rule and the cost.",
        },
        { kind: "check", id: "ag-check-1", checkId: "check-1" },
        { kind: "check", id: "ag-check-2", checkId: "check-2" },
        { kind: "check", id: "ag-check-3", checkId: "check-3" },
        { kind: "check", id: "ag-check-4", checkId: "check-4" },
        { kind: "check", id: "ag-check-5", checkId: "check-5" },
      ],
    },
    {
      id: "evaluation-task",
      title: "Evaluation task",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "ag-p-21",
          text: "Use the four fixed scenarios and the fixed tool table. Build the loop, run each scenario, and record the reason, the steps and the calls. Tick each step when its output is visible.",
        },
        { kind: "task", id: "task-agents" },
        {
          kind: "paragraph",
          id: "ag-p-22",
          text: "The reference solution prints reason done after 3 steps and 3 calls for the happy run. The repeat run prints reason repeat after 2 steps and 1 call. The error run prints reason error after 1 step, and the short-budget run prints reason budget after 2 steps.",
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
          id: "ag-p-23",
          text: "Write the guard, the reason and the step count. Name the failure class, the check that caught it, and the cost in calls.",
        },
        {
          kind: "paragraph",
          id: "ag-p-24",
          text: "Self-rubric: mechanism names the layer and the rule; evidence gives a fixed number; limit names one blind spot.",
        },
        {
          kind: "note",
          id: "ag-note-1",
          text: "A stop reason is part of the product. Show it to the operator, not only to the log.",
        },
      ],
    },
    {
      id: "interview-corner",
      title: "Interview practice",
      register: "standard",
      blocks: [
        {
          kind: "interview",
          id: "ag-interview-1",
          items: [
            {
              question: "What is an agent?",
              answer:
                "An agent is a model in a loop with tools and a stop rule. It reads a goal and a trajectory, chooses one tool call, observes the result, and repeats. The code runs the tools and enforces the limits, so the loop has controlled side effects.",
            },
            {
              question: "When do you choose an agent over a single prompt?",
              answer:
                "Choose an agent when the task needs several tool calls and the next call depends on an observation. A single prompt is cheaper and safer when the task needs one answer and no side effect. An agent adds latency, cost and a new failure surface, so it needs a measured gain.",
            },
            {
              question: "How does an agent fail, and what do you check?",
              answer:
                "An agent fails on an invalid tool call, a missed goal, a wrong reflection or wasted steps. Read the trajectory and the stop reason first, then check the schema, the success test and the call count. A repeated tool name and argument pair is the cheapest sign of a stuck loop.",
            },
            {
              question: "How does agent cost change at 10x traffic or steps?",
              answer:
                "Each step is a model call plus a tool call, so 10x steps cost about 10x tokens and 10x tool time. Cap steps and tokens per run, and log the reason and the call count for every run. Track p95 steps and p95 cost together, because a budget that is too small saves money and lowers the pass rate.",
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
      prompt: "Which sentence defines a tool schema?",
      options: [
        {
          id: "option-a",
          label:
            "The typed description of a tool name, arguments and return shape",
        },
        { id: "option-b", label: "The prompt that asks the model to use a tool" },
        { id: "option-c", label: "The log of every tool call in a run" },
        { id: "option-d", label: "The maximum number of steps in a run" },
      ],
      correctOptionId: "option-a",
      explanation:
        "A tool schema states the name, the arguments, the types and the return shape, so the code can check a call. A prompt or a log can describe a tool, but neither is the typed contract that the code enforces.",
    },
    {
      id: "check-2",
      kind: "apply",
      prompt:
        "A model returns a tool call with a missing required argument. Which failure class is this?",
      options: [
        { id: "option-a", label: "Invalid tool or parameters" },
        { id: "option-b", label: "Goal failure" },
        { id: "option-c", label: "Reflection error" },
        { id: "option-d", label: "Efficiency failure" },
      ],
      correctOptionId: "option-a",
      explanation:
        "A call that breaks the schema is an invalid tool or parameter failure, and the code must reject it. A goal failure returns a valid reply that misses the success test, and an efficiency failure spends too many steps.",
    },
    {
      id: "check-3",
      kind: "diagnose",
      prompt:
        "A tool returns the same error twice, and the loop calls it again. Which stop condition must fire first?",
      options: [
        { id: "option-a", label: "Repeat, before the budget" },
        { id: "option-b", label: "Budget, after the step limit" },
        { id: "option-c", label: "Done, with the answer" },
        { id: "option-d", label: "No condition; run once more" },
      ],
      correctOptionId: "option-a",
      explanation:
        "A repeated call cannot change the state, so a repeat guard stops the loop before the budget. Waiting for the budget spends steps on a task that cannot finish.",
    },
    {
      id: "check-4",
      kind: "calculate",
      prompt:
        "A run has a budget of 8 steps. The repeat guard fires at step 3 before the third call. How many tool calls does the run make?",
      options: [
        { id: "option-a", label: "2" },
        { id: "option-b", label: "3" },
        { id: "option-c", label: "8" },
        { id: "option-d", label: "0" },
      ],
      correctOptionId: "option-a",
      explanation:
        "Steps 1 and 2 run their calls, and step 3 is detected before execution, so the run makes 2 calls. A count of 3 would include the blocked call, and 8 would ignore the guard.",
    },
    {
      id: "check-5",
      kind: "apply",
      prompt:
        "A task needs lookup, then read, then draft. Which part of the loop decides this order?",
      options: [
        { id: "option-a", label: "Planning" },
        { id: "option-b", label: "The tool schema" },
        { id: "option-c", label: "The stop condition" },
        { id: "option-d", label: "Agent memory" },
      ],
      correctOptionId: "option-a",
      explanation:
        "Planning decomposes the goal into ordered steps, so the loop follows a plan before action. A tool schema defines one call, and a stop condition ends the loop.",
    },
  ],
  task: {
    id: "task-agents",
    scope:
      "Build the order agent with three tools and five stop rules, then run four fixed scenarios.",
    items: [
      {
        id: "item-1",
        label: "Write the three tool schemas and their argument types.",
      },
      {
        id: "item-2",
        label: "Add a step budget, a token budget and a repeat guard to the loop.",
      },
      {
        id: "item-3",
        label: "Return a result object with reply, reason, steps and calls.",
      },
      {
        id: "item-4",
        label: "Run the happy, repeat, error and short-budget scenarios.",
      },
      {
        id: "item-5",
        label:
          "Change one tool to raise an error and state which reason fires first.",
      },
    ],
    solution: {
      filename: "agents/agent_loop.py",
      language: "python",
      code: [
        "import json",
        "",
        "MAX_STEPS = 6",
        "MAX_TOKENS = 1200",
        "TOKENS_PER_STEP = 120",
        "",
        "",
        "class ToolError(Exception):",
        "    pass",
        "",
        "",
        "def search_tickets(query: str) -> list:",
        '    if query == "refund":',
        '        return ["T-07", "T-08"]',
        '    raise ToolError("search service timeout")',
        "",
        "",
        "def read_ticket(ticket_id: str) -> str:",
        '    if ticket_id == "T-07":',
        '        return "Refunds are available within 30 days of delivery."',
        '    raise ToolError("ticket " + ticket_id + " not found")',
        "",
        "",
        "def draft_reply(text: str) -> str:",
        '    return "Reply: " + text',
        "",
        "",
        "TOOLS = {",
        '    "search_tickets": {',
        '        "params": {"query": str},',
        '        "run": lambda args: search_tickets(args["query"]),',
        "    },",
        '    "read_ticket": {',
        '        "params": {"ticket_id": str},',
        '        "run": lambda args: read_ticket(args["ticket_id"]),',
        "    },",
        '    "draft_reply": {',
        '        "params": {"text": str},',
        '        "run": lambda args: draft_reply(args["text"]),',
        "    },",
        "}",
        "",
        "",
        "def validate(name: str, args: dict) -> None:",
        '    schema = TOOLS[name]["params"]',
        "    if set(args) != set(schema):",
        '        raise ToolError("argument names do not match the schema")',
        "    for key, expected in schema.items():",
        "        if not isinstance(args[key], expected):",
        '            raise ToolError("argument " + key + " has the wrong type")',
        "",
        "",
        "def run_agent(plan: list, max_steps: int = MAX_STEPS) -> dict:",
        "    plan = list(plan)",
        '    seen, transcript, steps, calls, reply = set(), [], 0, 0, ""',
        "    while steps < max_steps:",
        "        if not plan:",
        '            reason = "done" if reply else "stuck"',
        '            return {"reply": reply, "reason": reason, "steps": steps, "calls": calls}',
        "        steps += 1",
        "        name, args = plan.pop(0)",
        '        key = (name, json.dumps(args, sort_keys=True))',
        "        if key in seen:",
        '            return {"reply": reply, "reason": "repeat", "steps": steps, "calls": calls}',
        "        seen.add(key)",
        "        calls += 1",
        "        try:",
        "            validate(name, args)",
        '            observation = TOOLS[name]["run"](args)',
        "        except ToolError:",
        '            return {"reply": reply, "reason": "error", "steps": steps, "calls": calls}',
        '        transcript.append(name + " -> " + str(observation))',
        '        if name == "draft_reply":',
        "            reply = observation",
        "        if len(transcript) * TOKENS_PER_STEP > MAX_TOKENS:",
        '            return {"reply": reply, "reason": "budget", "steps": steps, "calls": calls}',
        '    return {"reply": reply, "reason": "budget", "steps": steps, "calls": calls}',
        "",
        "",
        "HAPPY = [",
        '    ("search_tickets", {"query": "refund"}),',
        '    ("read_ticket", {"ticket_id": "T-07"}),',
        '    ("draft_reply", {"text": "Refunds close 30 days after delivery."}),',
        "]",
        "REPEAT = [",
        '    ("search_tickets", {"query": "refund"}),',
        '    ("search_tickets", {"query": "refund"}),',
        "]",
        'ERROR = [("read_ticket", {"ticket_id": "T-99"})]',
        "",
        "print(run_agent(HAPPY))",
        "print(run_agent(REPEAT))",
        "print(run_agent(ERROR))",
        "print(run_agent(HAPPY, max_steps=2))",
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
    "Further reading: AI Engineering by Chip Huyen (O'Reilly). This course is independent and reproduces no book text or figures.",
} as const satisfies Lesson);
