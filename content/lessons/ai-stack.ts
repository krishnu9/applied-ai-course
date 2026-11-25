import type { Lesson } from "@/lib/types";
import { deepFreeze } from "../freeze";

export const aiStackLesson = deepFreeze({
  slug: "ai-stack",
  order: 1,
  title: "The AI engineering stack",
  chapterId: "ch-01",
  chapterOrder: 1,
  status: "live",
  outcome:
    "You can name the three layers of an AI product, place a failure on one layer, and defend a build or buy choice. Prerequisite: none. This is the first lesson.",
  artifact: "A runnable stack.py that assigns fixed incidents to one layer and names the owner.",
  readingMinutes: 18,
  difficulty: "starter",
  terms: [
    {
      term: "AI engineering stack",
      definition:
        "The three cooperating layers of an AI product: application, model and infrastructure.",
    },
    {
      term: "Application layer",
      definition: "The product code that shapes input, calls a model and uses the output.",
    },
    {
      term: "Model layer",
      definition:
        "The trained model and the sampling, prompting and fine-tuning that shape its behavior.",
    },
    {
      term: "Infrastructure layer",
      definition:
        "The serving, storage, network and monitoring that run the model and the product.",
    },
    {
      term: "Build vs buy",
      definition:
        "The choice to self-host open weights or to call a hosted model API.",
    },
    {
      term: "Failure ownership",
      definition:
        "The assignment of a failure to one layer so the repair has one owner.",
    },
  ],
  evalCase: {
    id: "case-ai-stack",
    brief: "Place three fixed faults on the right layer and name the owner.",
  },
  sections: [
    {
      id: "outcome-and-prerequisites",
      title: "Outcome and prerequisites",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "ai-stack-p-1",
          text: "You can name the three layers, place a failure on one layer, and defend a build or buy choice. You need one computer and the five fixed incidents in the task. No model access is necessary.",
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
          id: "ai-stack-p-2",
          text: "The AI engineering stack has three layers: application, model and infrastructure. Each layer has one job, and each layer can fail alone.",
        },
        {
          kind: "paragraph",
          id: "ai-stack-p-3",
          text: "The application layer is the product code. It shapes the input, calls a model, and uses the output. The model layer is the trained model plus the sampling, prompting and fine-tuning that shape its behavior. The infrastructure layer is the serving, storage, network and monitoring that run the model and the product.",
        },
        {
          kind: "paragraph",
          id: "ai-stack-p-4",
          text: "A worked example is an email assistant. The application puts a message into a prompt and checks the JSON reply. The model reads the prompt and writes a label. The infrastructure runs the model and logs the latency. A wrong label, a slow reply and a high bill can each start on a different layer.",
        },
        {
          kind: "paragraph",
          id: "ai-stack-p-5",
          text: "A non-example is a spreadsheet formula. It computes one fixed rule, and no model writes text. The stack needs a trained model that makes a probabilistic choice.",
        },
        {
          kind: "paragraph",
          id: "ai-stack-p-6",
          text: "AI engineering differs from ML engineering and from full-stack work. ML engineering starts from data and trains a model. Full-stack work owns the application and its database. AI engineering starts from a product and also owns the model behavior, its evaluation and its serving cost.",
        },
        {
          kind: "paragraph",
          id: "ai-stack-p-7",
          text: "Build vs buy is the choice to self-host open weights or to call a hosted model API. Buy moves most of the model layer and the infrastructure layer to a vendor. Build keeps control and adds a serving team, a GPU budget and an on-call duty.",
        },
      ],
    },
    {
      id: "eli5-a-restaurant",
      title: "A restaurant with three rooms",
      register: "eli5",
      blocks: [
        {
          kind: "analogy",
          id: "ai-stack-analogy-1",
          text: "Think of a restaurant. The dining room takes the order and serves the plate. The kitchen turns the order into food. The building supplies power, water and a roof. The dining room is the application layer, the kitchen is the model layer, and the building is the infrastructure layer.",
          breaks:
            "Where it breaks: a restaurant has one kitchen and a fixed menu, while a model layer can change with one prompt or one sampling setting.",
        },
        {
          kind: "paragraph",
          id: "ai-stack-p-8",
          text: "The dining room cannot cook, and the kitchen cannot seat a guest. Each room does one job, so a fault starts in one room and stays with one owner. One room owns one repair.",
        },
        {
          kind: "paragraph",
          id: "ai-stack-p-8b",
          text: "Prediction: the lights go out and every table waits. Which layer failed: the dining room, the kitchen or the building?",
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
          id: "ai-stack-p-9",
          text: "The layers cooperate through one request. Each step has one owner, and the trace records each step.",
        },
        {
          kind: "list",
          id: "ai-stack-list-1",
          ordered: true,
          items: [
            "The application shapes the request into a prompt and adds the output contract.",
            "The application sends the prompt to the model layer through a client.",
            "The model layer reads the input tokens and samples an output.",
            "The application validates the output against the contract.",
            "The infrastructure serves the model, stores logs and reports cost and latency.",
            "The trace returns a failed step to one layer and one owner.",
          ],
        },
        {
          kind: "paragraph",
          id: "ai-stack-p-10",
          text: "Failure ownership is the assignment of a failure to one layer. A wrong label with a correct prompt starts on the model layer. A slow reply with a fast model starts on the infrastructure layer. A missing field starts in the application output check. One trace names one owner, and one owner repairs one layer.",
        },
        {
          kind: "paragraph",
          id: "ai-stack-p-11",
          text: "The build vs buy choice follows volume and control. A small product with a variable load buys capacity from a hosted API. A large steady load with a privacy rule builds a serving stack. Buy trades control for speed. Build trades speed for control and a fixed monthly cost.",
        },
        {
          kind: "table",
          id: "ai-stack-table-1",
          columns: ["Layer", "Input", "Output"],
          rows: [
            ["Application", "Ticket text and output contract", "Prompt and checked label"],
            ["Model", "Prompt and sampling settings", "Label tokens and scores"],
            ["Infrastructure", "Model weights and traffic", "Replies, logs and cost"],
          ],
          caption: "The input and output of each layer.",
        },
        {
          kind: "diagram",
          id: "ai-stack-diagram-1",
          variant: "stack",
          spec: {
            nodes: [
              {
                id: "application",
                label: "Application layer",
                detail: "prompt, output contract, product logic",
              },
              {
                id: "model",
                label: "Model layer",
                detail: "model, sampling and fine-tuning",
              },
              {
                id: "infrastructure",
                label: "Infrastructure layer",
                detail: "serving, storage, network",
              },
              {
                id: "monitoring",
                label: "Evaluation and monitoring",
                detail: "scores, traces, cost",
              },
            ],
            edges: [
              ["application", "model"],
              ["model", "infrastructure"],
              ["infrastructure", "monitoring"],
            ],
          },
          caption:
            "A request moves down three layers, and the trace assigns each fault to one owner.",
          alt: "Stack from the application layer through the model layer and infrastructure layer to evaluation and monitoring.",
        },
      ],
    },
    {
      id: "eli5-a-hospital",
      title: "A hospital with one doctor",
      register: "eli5",
      blocks: [
        {
          kind: "analogy",
          id: "ai-stack-analogy-2",
          text: "Think of a hospital. Reception takes your details and sends you to a room. A doctor reads the details and makes a decision. The building supplies power, beds and records. Reception is the application layer, the doctor is the model layer, and the building is the infrastructure layer.",
          breaks:
            "Where it breaks: a doctor asks follow-up questions, while a model reads one fixed context and cannot ask for the missing fact.",
        },
        {
          kind: "paragraph",
          id: "ai-stack-p-12",
          text: "Reception cannot treat a patient, and the doctor cannot supply power. Each part does one job, so a fault starts in one part and stays with one owner. One part owns one repair.",
        },
        {
          kind: "paragraph",
          id: "ai-stack-p-12b",
          text: "Prediction: a patient gets the right room but the wrong medicine. Which layer owns the mistake?",
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
          id: "ai-stack-p-13",
          text: "A stack review looks for the first broken step. These four faults cover most products.",
        },
        {
          kind: "table",
          id: "ai-stack-table-2",
          columns: ["Symptom", "Cause", "Check", "Fix"],
          rows: [
            [
              "The label is wrong on most tickets",
              "The prompt or the model is wrong",
              "Compare the prompt with the label in one trace",
              "Fix the prompt, then change the model",
            ],
            [
              "The reply is slow at peak hours",
              "The serving layer lacks capacity",
              "Read the queue depth and the p95 latency",
              "Add capacity or batch requests",
            ],
            [
              "The monthly bill doubles",
              "More input tokens or a larger model",
              "Split cost by prompt size and model",
              "Cut context or choose a cheaper model",
            ],
            [
              "A field is missing from the JSON",
              "The application has no output check",
              "Replay the reply through the schema",
              "Add a validate and repair step",
            ],
          ],
          caption: "Four faults, each with one layer and one check.",
        },
        {
          kind: "paragraph",
          id: "ai-stack-p-14",
          text: "Every layer choice trades one cost for another. A larger model raises quality and raises cost and latency. A stricter output check raises reliability and adds a retry. The stack review names the trade before the team pays for it.",
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
          id: "ai-stack-p-15",
          text: "The support assistant has three faults at the same time. A late-parcel ticket gets the label billing. The same reply takes 2.4 seconds at noon, and the monthly bill doubled. The team reads one trace for each fault before it changes anything.",
        },
        {
          kind: "paragraph",
          id: "ai-stack-p-16",
          text: "The first trace holds the correct prompt and a valid schema. The model still writes billing, so the model layer owns the wrong label. The second trace shows a model time of 320 milliseconds and a queue wait of 1.8 seconds, so the infrastructure layer owns the slow reply. The third trace shows 8,000 input tokens on every ticket from a repeated policy block, so the application layer owns the cost.",
        },
        {
          kind: "paragraph",
          id: "ai-stack-p-17",
          text: "The decision is three repairs with three owners. The model layer gets a clearer label rule. The infrastructure layer gets more capacity. The application layer trims the repeated policy text. A single model upgrade would raise the bill and leave the other two faults in place.",
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
          id: "ai-stack-p-18",
          text: "Answer five questions on the layer, the design choice, the failure and the cost.",
        },
        { kind: "check", id: "ai-stack-check-1", checkId: "check-1" },
        { kind: "check", id: "ai-stack-check-2", checkId: "check-2" },
        { kind: "check", id: "ai-stack-check-3", checkId: "check-3" },
        { kind: "check", id: "ai-stack-check-4", checkId: "check-4" },
        { kind: "check", id: "ai-stack-check-5", checkId: "check-5" },
      ],
    },
    {
      id: "evaluation-task",
      title: "Evaluation task",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "ai-stack-p-19",
          text: "Use the five fixed incidents. Build one script that assigns each incident to one layer, names the owner and prints a repair. The script reports two incidents on the application layer, two on the model layer and one on the infrastructure layer. Then apply the same rule to the two held incidents.",
        },
        { kind: "task", id: "task-ai-stack" },
      ],
    },
    {
      id: "prove-the-change",
      title: "Prove the change",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "ai-stack-p-20",
          text: "Write one sentence with the form: I changed X; the result was Y. Name the layer you moved and the trace line that decided it.",
        },
        {
          kind: "paragraph",
          id: "ai-stack-p-21",
          text: "Self-rubric: mechanism names the layer and the rule; evidence gives a fixed count or a trace value; limit names one blind spot or failed case.",
        },
        {
          kind: "note",
          id: "ai-stack-note-1",
          text: "A layer claim is only as good as the trace line that shows it.",
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
          id: "ai-stack-interview-1",
          items: [
            {
              question: "What is the AI engineering stack?",
              answer:
                "The AI engineering stack has three layers: application, model and infrastructure. The application shapes input and uses output, the model writes the answer, and the infrastructure serves it. Failure ownership assigns each fault to one layer and one owner.",
            },
            {
              question: "When do you build rather than buy a model?",
              answer:
                "Buy when the load is small, variable or urgent, because a hosted API removes the serving team. Build when the load is large and steady, or when a privacy rule keeps data in house. Compare the monthly API cost with the GPU, staff and on-call cost before you choose.",
            },
            {
              question: "How does an AI product fail, and what do you check first?",
              answer:
                "Read one trace before you change a model. A wrong label with a correct prompt points to the model layer, a slow reply with a fast model points to infrastructure, and a missing field points to the application check. One trace names one owner and stops a blind model upgrade.",
            },
            {
              question: "How does the stack change at 10x traffic or tokens?",
              answer:
                "At 10x traffic, the infrastructure layer needs batching, a queue and a p95 latency budget. At 10x tokens, the application layer needs a context budget, because cost grows with input size. Buy becomes cheaper at small scale, and build becomes cheaper at large steady scale.",
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
      prompt: "Which layer holds the prompt and the output contract?",
      options: [
        { id: "option-a", label: "The application layer" },
        { id: "option-b", label: "The model layer" },
        { id: "option-c", label: "The infrastructure layer" },
        { id: "option-d", label: "The hosted model vendor" },
      ],
      correctOptionId: "option-a",
      explanation:
        "The application layer shapes the input, builds the prompt and checks the output against the contract. The model layer writes the answer, but it does not own the prompt or the schema.",
    },
    {
      id: "check-2",
      kind: "apply",
      prompt:
        "A team calls a hosted model API and runs no server. Which layers does the team still own?",
      options: [
        { id: "option-a", label: "No layer, because the vendor runs the model" },
        { id: "option-b", label: "The application layer only" },
        {
          id: "option-c",
          label: "The application layer and the model behavior settings",
        },
        { id: "option-d", label: "The infrastructure layer only" },
      ],
      correctOptionId: "option-c",
      explanation:
        "The team still writes the product code and chooses the prompt, sampling and fine-tuning. The vendor runs most of the infrastructure, but it does not choose the behavior settings for the product.",
    },
    {
      id: "check-3",
      kind: "diagnose",
      prompt:
        "The p95 latency rises while model time stays flat and the queue wait grows. Which layer owns the fault?",
      options: [
        { id: "option-a", label: "The application layer" },
        { id: "option-b", label: "The model layer" },
        { id: "option-c", label: "The infrastructure layer" },
        { id: "option-d", label: "The output contract" },
      ],
      correctOptionId: "option-c",
      explanation:
        "A growing queue wait with a flat model time points to serving capacity, which belongs to the infrastructure layer. A model fault would raise model time, and an application fault would not change the queue.",
    },
    {
      id: "check-4",
      kind: "calculate",
      prompt:
        "One request costs 0.00094 dollars. The product sends 10,000 requests a day for 30 days. What is the monthly model cost?",
      options: [
        { id: "option-a", label: "94 dollars" },
        { id: "option-b", label: "282 dollars" },
        { id: "option-c", label: "940 dollars" },
        { id: "option-d", label: "2,820 dollars" },
      ],
      correctOptionId: "option-b",
      explanation:
        "10,000 requests a day cost 9.40 dollars, and 30 days give 282 dollars. A value of 94 dollars would cover only 10 days at this rate.",
    },
    {
      id: "check-5",
      kind: "diagnose",
      prompt:
        "A JSON field disappears after a model upgrade. The reply is valid text, and the application has no schema check. Which layer owns the failure, and what is the first fix?",
      options: [
        { id: "option-a", label: "The model layer; replace the model" },
        {
          id: "option-b",
          label: "The application layer; add a schema check and a repair",
        },
        { id: "option-c", label: "The infrastructure layer; add capacity" },
        { id: "option-d", label: "The vendor; ask for a new contract" },
      ],
      correctOptionId: "option-b",
      explanation:
        "The application has no output check, so a valid reply with a missing field passes into the product. A schema check and a repair step catch the fault before the user sees it.",
    },
  ],
  task: {
    id: "task-ai-stack",
    scope:
      "Assign five fixed incidents to one layer, name the owner, and test the rule on two held incidents.",
    items: [
      {
        id: "item-1",
        label: "Write the three layers and one job for each layer.",
      },
      {
        id: "item-2",
        label: "Classify the five fixed incidents with one rule per layer.",
      },
      {
        id: "item-3",
        label: "Print the owner and one repair for each incident.",
      },
      {
        id: "item-4",
        label: "Report the count of incidents on each layer.",
      },
      {
        id: "item-5",
        label: "Apply the rule to the two held incidents and state whether the owner holds.",
      },
    ],
    solution: {
      filename: "stack/route.py",
      language: "python",
      code: [
        "INCIDENTS = [",
        '    {"id": "i1", "symptom": "wrong label", "schema_ok": True,',
        '     "queue_ms": 20, "tokens_over_budget": False, "training_gap": False},',
        '    {"id": "i2", "symptom": "slow reply", "schema_ok": True,',
        '     "queue_ms": 1800, "tokens_over_budget": False, "training_gap": False},',
        '    {"id": "i3", "symptom": "high bill", "schema_ok": True,',
        '     "queue_ms": 20, "tokens_over_budget": True, "training_gap": False},',
        '    {"id": "i4", "symptom": "missing field", "schema_ok": False,',
        '     "queue_ms": 20, "tokens_over_budget": False, "training_gap": False},',
        '    {"id": "i5", "symptom": "wrong label on long tail", "schema_ok": True,',
        '     "queue_ms": 20, "tokens_over_budget": False, "training_gap": True},',
        "]",
        "",
        "HELD = [",
        '    {"id": "h1", "symptom": "slow reply", "schema_ok": True,',
        '     "queue_ms": 2200, "tokens_over_budget": False, "training_gap": False},',
        '    {"id": "h2", "symptom": "high bill", "schema_ok": True,',
        '     "queue_ms": 20, "tokens_over_budget": True, "training_gap": False},',
        "]",
        "",
        "REPAIR = {",
        '    "application": "trim the context and add a schema check",',
        '    "model": "fix the prompt or the sampling setting",',
        '    "infrastructure": "add capacity or batch requests",',
        "}",
        "",
        "JOBS = {",
        '    "application": "shape input, call the model, use the output",',
        '    "model": "read the prompt and write the answer",',
        '    "infrastructure": "serve the model, store logs, report cost",',
        "}",
        "",
        "for layer in sorted(JOBS):",
        '    print(f"{layer}: {JOBS[layer]}")',
        "print()",
        "",
        "",
        "def owner(incident):",
        "    if not incident[\"schema_ok\"]:",
        '        return "application"',
        "    if incident[\"tokens_over_budget\"]:",
        '        return "application"',
        "    if incident[\"queue_ms\"] > 1000:",
        '        return "infrastructure"',
        '    return "model"',
        "",
        "",
        "counts = {}",
        "for incident in INCIDENTS:",
        "    layer = owner(incident)",
        "    counts[layer] = counts.get(layer, 0) + 1",
        '    print(f"{incident[\'id\']} {layer:14} repair: {REPAIR[layer]}")',
        "",
        'print("counts " + " ".join(f"{layer} {counts[layer]}" for layer in sorted(counts)))',
        "",
        "for incident in HELD:",
        "    layer = owner(incident)",
        '    print(f"{incident[\'id\']} held {layer}")',
      ].join("\n"),
    },
  },
  prove: {
    prompt: "Which fault did you place, and who owns the repair?",
    placeholder: "I changed X; the result was Y.",
    maxLength: 280,
    debounceMs: 800,
    savedMessage: "Proof saved on this device.",
  },
  citation:
    "Further reading: AI Engineering by Chip Huyen (O'Reilly). This course is independent and reproduces no book text or figures.",
} as const satisfies Lesson);
