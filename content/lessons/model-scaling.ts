import type { Lesson } from "@/lib/types";
import { deepFreeze } from "../freeze";

export const modelScalingLesson = deepFreeze({
  slug: "model-scaling",
  order: 3,
  title: "Model size, data and compute",
  chapterId: "ch-02",
  chapterOrder: 2,
  status: "live",
  outcome:
    "You can define a parameter, read a scaling law, and decide whether a larger model is the right repair. Prerequisite: lesson 2, foundation models.",
  artifact: "A runnable scaling.py that compares three fixed models on loss, cost and slices.",
  readingMinutes: 23,
  difficulty: "core",
  terms: [
    {
      term: "Parameter",
      definition: "One learned weight in the model; the count measures model size.",
    },
    {
      term: "Scaling law",
      definition:
        "An empirical rule that predicts loss from model size, data and compute.",
    },
    {
      term: "Mixture of experts (MoE)",
      definition:
        "A sparse architecture that routes each token to a few expert subnetworks.",
    },
    {
      term: "Sparse model",
      definition: "A model that activates only part of its parameters for each token.",
    },
    {
      term: "Pretraining",
      definition:
        "The first training stage that learns general language patterns from large text.",
    },
  ],
  evalCase: {
    id: "case-model-scaling",
    brief: "Decide if a larger model is the right repair for a long-tail failure.",
  },
  sections: [
    {
      id: "outcome-and-prerequisites",
      title: "Outcome and prerequisites",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "model-scaling-p-1",
          text: "You can define a parameter, read a scaling law, and decide whether a larger model repairs a failure. You need lesson 2 on tokens and attention. The task uses fixed loss and cost numbers.",
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
          id: "model-scaling-p-2",
          text: "A parameter is one learned weight in the model, and the count measures model size. A scaling law is an empirical rule that predicts loss from model size, data and compute. Pretraining is the first training stage, and it learns general language patterns from large text.",
        },
        {
          kind: "paragraph",
          id: "model-scaling-p-3",
          text: "Training has three inputs: parameters, training tokens and compute. A larger model with too little data wastes compute. A common starting rule is about 20 training tokens per parameter for a compute-optimal run.",
        },
        {
          kind: "paragraph",
          id: "model-scaling-p-4",
          text: "A sparse model activates only part of its parameters for each token. A mixture of experts (MoE) routes each token to a few expert subnetworks. A 400B-parameter MoE can use about 40B active parameters per token. Serving compute follows the active count, and memory holds every weight.",
        },
        {
          kind: "paragraph",
          id: "model-scaling-p-5",
          text: "A worked example is a team with two models and 200B training tokens. The 7B dense model reaches loss 2.31. The 70B dense model reaches loss 2.12. The larger model gains 0.19 loss and costs about 10 times more per token. The team checks whether the product needs that 0.19.",
        },
        {
          kind: "paragraph",
          id: "model-scaling-p-6",
          text: "A non-example is a larger lookup table. It adds memory and no learning capacity. Scaling adds parameters, data and compute together.",
        },
      ],
    },
    {
      id: "eli5-a-bigger-kitchen",
      title: "A bigger bakery",
      register: "eli5",
      blocks: [
        {
          kind: "analogy",
          id: "model-scaling-analogy-1",
          text: "Think of a bakery that wants more bread. The owner buys a bigger oven, more flour and more working hours. Bread output rises, but each extra loaf costs more fuel and the gain shrinks. The oven is the parameter count, the flour is the training data, and the working hours are the compute.",
          breaks:
            "Where it breaks: a bakery can add ovens without limit, while a model needs more data to use more parameters well.",
        },
        {
          kind: "paragraph",
          id: "model-scaling-p-7a",
          text: "The oven has a limit, and the flour decides how many loaves the oven can fill. More fuel alone does not help.",
        },
        {
          kind: "paragraph",
          id: "model-scaling-p-7",
          text: "Prediction: the owner doubles the oven size and keeps the same flour. Does output double, and why?",
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
          id: "model-scaling-p-8",
          text: "A scaling plan pairs size, data and compute. The plan is a testable prediction, not a promise.",
        },
        {
          kind: "list",
          id: "model-scaling-list-1",
          ordered: true,
          items: [
            "Choose a parameter count and a training token count.",
            "Set the compute budget from the two counts.",
            "Train and measure loss on a held-out set.",
            "Fit the scaling curve: loss falls as a power law in each input.",
            "Balance parameters and data at about 20 tokens per parameter.",
            "Add sparse experts when serving compute limits the size.",
            "Measure serving cost from active parameters and output tokens.",
          ],
        },
        {
          kind: "paragraph",
          id: "model-scaling-p-9",
          text: "A scaling law has a simple shape. Loss falls as a power law in parameters, with an exponent near 0.3 in many studies. It also falls as a power law in training tokens. The slow growth of loss past a point is the return on a larger model.",
        },
        {
          kind: "paragraph",
          id: "model-scaling-p-10",
          text: "Most loss falls smoothly with scale. Some task scores stay near zero and then rise at a size threshold, and people call this an emergent gain. The sharp rise can come from an all-or-nothing metric. Read the per-case scores before you call an ability emergent.",
        },
        {
          kind: "paragraph",
          id: "model-scaling-p-11",
          text: "A MoE router learns a score per expert and sends each token to the top few. A load balance loss keeps the traffic spread across the experts. Serving cost falls with the active parameter count. Memory and routing complexity rise with the total parameter count.",
        },
        {
          kind: "paragraph",
          id: "model-scaling-p-12",
          text: "Pretraining data bounds capability. A model cannot learn a language or a domain with no examples in the data. A large model on narrow data still fails the missing domain.",
        },
        {
          kind: "table",
          id: "model-scaling-table-1",
          columns: ["Quantity", "What it sets", "How to measure"],
          rows: [
            ["Parameters", "Model capacity", "Weight count"],
            ["Training tokens", "Exposure to language", "Token count"],
            ["Compute", "Training work", "Floating-point operations"],
            ["Active parameters", "Serving work per token", "Router count"],
          ],
          caption: "Four quantities, each with one measure.",
        },
        {
          kind: "diagram",
          id: "model-scaling-diagram-1",
          variant: "bars",
          spec: {
            nodes: [
              { id: "dense7", label: "7B dense", value: 7, unit: "B active" },
              { id: "dense70", label: "70B dense", value: 70, unit: "B active" },
              { id: "moe400", label: "400B MoE", value: 40, unit: "B active" },
              { id: "moe1t", label: "1T MoE", value: 60, unit: "B active" },
            ],
            edges: [
              ["dense7", "dense70"],
              ["dense70", "moe400"],
              ["moe400", "moe1t"],
            ],
          },
          caption:
            "Serving work follows active parameters: a 400B sparse model activates 40B, below a dense 70B.",
          alt: "Bars of active parameters for four models: 7B dense, 70B dense, 400B mixture of experts and 1T mixture of experts.",
        },
      ],
    },
    {
      id: "eli5-a-hospital-of-specialists",
      title: "A hospital of specialists",
      register: "eli5",
      blocks: [
        {
          kind: "analogy",
          id: "model-scaling-analogy-2",
          text: "Think of a large hospital with many specialist teams. A patient sees two or three specialists, not every doctor in the building. The hospital holds many teams, and each visit uses a small set. The hospital is a sparse model, the teams are the experts, and the small visit set is the active parameters.",
          breaks:
            "Where it breaks: a hospital assigns a patient by hand, while a router assigns a token with a learned score and can overload one team.",
        },
        {
          kind: "paragraph",
          id: "model-scaling-p-13a",
          text: "The hospital pays to keep every team, even on a quiet day. The visit cost follows the two specialists, and the building cost follows all the teams.",
        },
        {
          kind: "paragraph",
          id: "model-scaling-p-13",
          text: "Prediction: the hospital adds 20 teams and each patient still sees two. Does the visit cost rise or stay flat, and does the building cost rise?",
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
          id: "model-scaling-p-14",
          text: "Scaling fails when the binding limit is data, cost or latency. Each fault has one check.",
        },
        {
          kind: "table",
          id: "model-scaling-table-2",
          columns: ["Symptom", "Cause", "Check", "Fix"],
          rows: [
            [
              "A larger model gives no quality gain",
              "The task needs data or retrieval, not capacity",
              "Compare per-slice scores at two sizes",
              "Fix the data or the prompt before you scale",
            ],
            [
              "Training loss falls, and the product score does not",
              "The metric hides the gain or the data is narrow",
              "Read per-case results and check coverage",
              "Add a task eval and more domain data",
            ],
            [
              "The new model is slower and the bill rises",
              "The dense model reads all weights per token",
              "Compare active parameters and cost per 1k",
              "Choose a sparse or smaller model",
            ],
            [
              "One expert receives most of the tokens",
              "The router has no load balance",
              "Read the expert load histogram",
              "Add a load balance loss or adjust the router",
            ],
          ],
          caption: "Four scaling faults, each with one check.",
        },
        {
          kind: "paragraph",
          id: "model-scaling-p-15",
          text: "Scale buys quality with money and latency. A sparse model lowers serving compute and raises memory and routing complexity. The choice follows the constraint that binds: quality, cost or latency.",
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
          id: "model-scaling-p-16",
          text: "The support classifier mislabels long-tail billing tickets. The team proposes a model four times larger. The trace shows the 7B model scores 0.72 on common tickets and 0.41 on long-tail tickets. A 70B trial scores 0.73 and 0.42. Cost per 1,000 requests rises from 0.94 to 9.40 dollars. The long-tail tickets use a language that is rare in the training data.",
        },
        {
          kind: "paragraph",
          id: "model-scaling-p-17",
          text: "The trace names the limit. The larger model gains 0.01 on each slice and costs 10 times more. The long-tail gap follows a data gap, not a capacity gap. The repair is data and retrieval, not size.",
        },
        {
          kind: "paragraph",
          id: "model-scaling-p-18",
          text: "The decision is to keep the 7B model. Add 300 long-tail examples to the training data and one retrieval step for the rare language. Re-run the slice eval against the same fixed set. Revisit the larger model only when the data gain stops and the slice scores are close.",
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
          id: "model-scaling-p-19",
          text: "Answer five questions on the parameter, the sparse model, the failure and the cost.",
        },
        { kind: "check", id: "model-scaling-check-1", checkId: "check-1" },
        { kind: "check", id: "model-scaling-check-2", checkId: "check-2" },
        { kind: "check", id: "model-scaling-check-3", checkId: "check-3" },
        { kind: "check", id: "model-scaling-check-4", checkId: "check-4" },
        { kind: "check", id: "model-scaling-check-5", checkId: "check-5" },
      ],
    },
    {
      id: "evaluation-task",
      title: "Evaluation task",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "model-scaling-p-20",
          text: "Use the three fixed models, the loss floor of 2.20 and the cost ceiling of 6.00 dollars per 1,000 requests. Build one script that reports the gain, the cost ratio and the slice gain. The 70B model gains 0.19 loss at 10 times the cost. The 400B MoE gains 0.15 loss at 5.6 times the cost. Both slices gain only 0.01. The script chooses the MoE at 5.30 dollars.",
        },
        { kind: "task", id: "task-model-scaling" },
      ],
    },
    {
      id: "prove-the-change",
      title: "Prove the change",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "model-scaling-p-21",
          text: "Write one sentence with the form: I changed X; the result was Y. Name the model size, the cost ratio and the slice gain.",
        },
        {
          kind: "paragraph",
          id: "model-scaling-p-22",
          text: "Self-rubric: mechanism names the scaling limit and the rule; evidence gives a fixed loss or cost; limit names one constraint that still binds.",
        },
        {
          kind: "note",
          id: "model-scaling-note-1",
          text: "A larger model is a repair only when capacity is the binding limit.",
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
          id: "model-scaling-interview-1",
          items: [
            {
              question: "What is a parameter, and how does its count relate to quality?",
              answer:
                "A parameter is one learned weight, and the count measures model capacity. More parameters can lower loss under a fixed scaling law, but the gain shrinks as size grows. Data and compute must grow with the parameters, or the extra capacity goes unused.",
            },
            {
              question: "When do you choose a sparse model over a dense model?",
              answer:
                "Choose a sparse MoE when serving compute per token binds and memory is available. A 400B MoE with 40B active parameters serves less compute than a dense 70B model. Choose dense when memory is tight or the routing complexity is not worth the gain.",
            },
            {
              question: "How does scaling fail, and what do you check?",
              answer:
                "Scaling fails when data coverage, cost or latency binds before capacity. Compare per-slice scores at two sizes and the cost per 1,000 requests. A gain of 0.01 on a slice with a 10 times cost is not a repair.",
            },
            {
              question: "How does serving cost change at 10x tokens?",
              answer:
                "Cost grows with active parameters and output tokens, so 10x tokens raises the bill about 10x at a fixed price. A sparse model lowers the active count, and batching raises throughput. Track cost per 1,000 requests with the latency percentiles, because cheap and slow is not a win.",
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
      prompt: "Which sentence defines a parameter?",
      options: [
        { id: "option-a", label: "One training example." },
        { id: "option-b", label: "One learned weight in the model." },
        { id: "option-c", label: "One token in the output." },
        { id: "option-d", label: "One expert in a router." },
      ],
      correctOptionId: "option-b",
      explanation:
        "A parameter is one learned weight, and the count measures model size. A training example supplies data, and an expert is a subnet inside a sparse model.",
    },
    {
      id: "check-2",
      kind: "apply",
      prompt:
        "A 400B MoE activates 40B parameters per token. Which number sets the serving compute for one token?",
      options: [
        { id: "option-a", label: "400B, the total parameter count" },
        { id: "option-b", label: "40B, the active parameter count" },
        { id: "option-c", label: "The number of experts in the model" },
        { id: "option-d", label: "The context window size" },
      ],
      correctOptionId: "option-b",
      explanation:
        "Serving compute per token follows the active parameters that the router selects. The total count sets memory, because every expert weight must be resident.",
    },
    {
      id: "check-3",
      kind: "diagnose",
      prompt:
        "A 10x larger model gains 0.01 on every slice, and the long-tail slice has few training examples. What is the binding limit?",
      options: [
        { id: "option-a", label: "Model capacity" },
        { id: "option-b", label: "Data coverage" },
        { id: "option-c", label: "Context window size" },
        { id: "option-d", label: "The tokenizer" },
      ],
      correctOptionId: "option-b",
      explanation:
        "A flat gain across a slice with few examples points to a data gap, not a capacity gap. A larger model cannot learn a case that the pretraining data does not cover.",
    },
    {
      id: "check-4",
      kind: "calculate",
      prompt:
        "A 7B model costs 0.94 dollars per 1,000 requests. A dense model with 10 times the parameters costs about 10 times more per token. What is its cost per 1,000 requests?",
      options: [
        { id: "option-a", label: "1.88 dollars" },
        { id: "option-b", label: "4.70 dollars" },
        { id: "option-c", label: "9.40 dollars" },
        { id: "option-d", label: "94.00 dollars" },
      ],
      correctOptionId: "option-c",
      explanation:
        "0.94 dollars times 10 is 9.40 dollars per 1,000 requests. A value of 94 dollars would apply a factor of 100, not 10.",
    },
    {
      id: "check-5",
      kind: "apply",
      prompt:
        "A product has a tight memory limit, a small load and a simple task. Which model fits the limit best?",
      options: [
        { id: "option-a", label: "A 400B MoE" },
        { id: "option-b", label: "A 70B dense model" },
        { id: "option-c", label: "A 7B dense model" },
        { id: "option-d", label: "A 1T MoE" },
      ],
      correctOptionId: "option-c",
      explanation:
        "A small dense model holds the fewest weights, so it fits a tight memory limit. A sparse model with a large total count still needs memory for every expert weight.",
    },
  ],
  task: {
    id: "task-model-scaling",
    scope:
      "Compare three fixed models on loss and cost, apply a floor and a ceiling, and test a held model.",
    items: [
      {
        id: "item-1",
        label: "Write the loss floor and the cost ceiling for the choice.",
      },
      {
        id: "item-2",
        label: "Report the loss and cost of each of the three fixed models.",
      },
      {
        id: "item-3",
        label: "Compute the gain over the 7B model and the cost ratio.",
      },
      {
        id: "item-4",
        label: "Choose a model that meets both limits and print the reason.",
      },
      {
        id: "item-5",
        label: "Apply the same limits to the held 200B model and state the verdict.",
      },
    ],
    solution: {
      filename: "scaling/choose.py",
      language: "python",
      code: [
        "LOSS_FLOOR = 2.20",
        "COST_CEILING = 6.00",
        "",
        "MODELS = [",
        '    {"id": "m7", "params_b": 7, "active_b": 7, "loss": 2.31, "cost_per_1k": 0.94},',
        '    {"id": "m70", "params_b": 70, "active_b": 70, "loss": 2.12, "cost_per_1k": 9.40},',
        '    {"id": "moe400", "params_b": 400, "active_b": 40, "loss": 2.16, "cost_per_1k": 5.30},',
        "]",
        "",
        'HELD = {"id": "m200", "params_b": 200, "active_b": 200, "loss": 2.05, "cost_per_1k": 20.00}',
        "",
        'print(f"loss floor {LOSS_FLOOR:.2f} cost ceiling {COST_CEILING:.2f}")',
        "print()",
        "",
        "SLICES = [",
        '    {"name": "common", "small": 0.72, "large": 0.73},',
        '    {"name": "long_tail", "small": 0.41, "large": 0.42},',
        "]",
        "",
        "baseline = MODELS[0]",
        "",
        "",
        "def eligible(model):",
        "    return model[\"loss\"] <= LOSS_FLOOR and model[\"cost_per_1k\"] <= COST_CEILING",
        "",
        "",
        "print(\"model   params  active  loss  cost_per_1k\")",
        "for model in MODELS:",
        '    print(f"{model[\'id\']:7} {model[\'params_b\']:5}B {model[\'active_b\']:5}B {model[\'loss\']:.2f}  {model[\'cost_per_1k\']:.2f}")',
        "",
        "for model in MODELS[1:]:",
        "    gain = baseline[\"loss\"] - model[\"loss\"]",
        "    ratio = model[\"cost_per_1k\"] / baseline[\"cost_per_1k\"]",
        '    print(f"{model[\'id\']} gain {gain:.2f} cost ratio {ratio:.2f}")',
        "",
        "for slic in SLICES:",
        '    print(f"slice {slic[\'name\']} gain {slic[\'large\'] - slic[\'small\']:.2f}")',
        "",
        "choice = next(model for model in MODELS if eligible(model))",
        'print(f"choice {choice[\'id\']} loss {choice[\'loss\']:.2f} cost {choice[\'cost_per_1k\']:.2f}")',
        "",
        'print(f"{HELD[\'id\']} held eligible {eligible(HELD)} loss {HELD[\'loss\']:.2f} cost {HELD[\'cost_per_1k\']:.2f}")',
      ].join("\n"),
    },
  },
  prove: {
    prompt: "Which model choice did you defend, and what did the numbers show?",
    placeholder: "I changed X; the result was Y.",
    maxLength: 280,
    debounceMs: 800,
    savedMessage: "Proof saved on this device.",
  },
  citation:
    "Further reading: AI Engineering by Chip Huyen (O'Reilly). This course is independent and reproduces no book text or figures.",
} as const satisfies Lesson);
