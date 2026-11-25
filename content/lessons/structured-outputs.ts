import type { Lesson } from "@/lib/types";
import { deepFreeze } from "../freeze";

export const structuredOutputsLesson = deepFreeze({
  slug: "structured-outputs",
  order: 12,
  title: "Reliable structured output",
  chapterId: "ch-05",
  chapterOrder: 5,
  status: "live",
  outcome:
    "You can write a JSON schema, choose an enforcement method, and repair a malformed reply. Prerequisite: lesson 11 on prompt contracts. You need six fixed raw outputs and one validator.",
  artifact:
    "A schema, a validator with one repair step, and a valid-shape rate before and after.",
  readingMinutes: 19,
  difficulty: "core",
  terms: [
    {
      term: "Structured output",
      definition: "A response that follows a fixed schema, such as JSON.",
    },
    {
      term: "Constrained decoding",
      definition:
        "Decoding that masks tokens which would break a required grammar or schema.",
    },
    {
      term: "Function calling",
      definition:
        "The model's structured request to run a named tool with arguments.",
    },
    {
      term: "Tool schema",
      definition: "The typed description of a tool name, arguments and return shape.",
    },
    {
      term: "Output contract",
      definition: "The required shape, fields and failure behavior of a response.",
    },
  ],
  evalCase: {
    id: "case-structured-outputs",
    brief: "Diagnose malformed label JSON and add validation with one repair.",
  },
  sections: [
    {
      id: "before-you-start",
      title: "Before you start",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "structured-p-1",
          text: "This lesson needs lesson 11 on prompt contracts. You need six fixed raw outputs, one schema and one validator.",
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
          id: "structured-p-2",
          text: "A structured output is a response that follows a fixed schema, such as JSON. The schema names each field, its type and its allowed values. The caller parses the reply into data before any code reads it.",
        },
        {
          kind: "paragraph",
          id: "structured-p-3",
          text: "An invoice extractor returns vendor, total and currency. The schema marks all three as required, sets total to a number and limits currency to three uppercase letters. A reply with a sentence and a total passes the parse and fails the schema check.",
        },
        {
          kind: "paragraph",
          id: "structured-p-4",
          text: "A reply says the total is 42 dollars and the vendor is Acme. A person can read it, but a caller cannot split the two values with a rule. The reply is informative and unstructured.",
        },
      ],
    },
    {
      id: "eli5-customs-form",
      title: "A customs form",
      register: "eli5",
      blocks: [
        {
          kind: "analogy",
          id: "structured-analogy-1",
          text: "Think of a customs form with one box for each fact. The traveller writes a name, a country and a value in the marked boxes. The officer checks each box against a rule and rejects a form with a missing or wrong box, with one written error code in red. The form is the schema, the boxes are the fields, and the officer is the validator. A correct form still accepts a false value, so the officer also checks the receipt.",
          breaks:
            "the form catches a wrong shape, while a schema cannot catch a wrong number written in the right box, even a false one.",
        },
        {
          kind: "paragraph",
          id: "structured-p-5",
          text: "Prediction: the value box holds 12 and the receipt says 21. Does the form catch the error? Say which check finds it.",
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
          id: "structured-p-6",
          text: "Pick the enforcement first, then validate shape and meaning.",
        },
        {
          kind: "list",
          id: "structured-list-1",
          ordered: true,
          items: [
            "Write the schema with required fields, types, enums and a closed key set.",
            "Choose an enforcement level: prompt only, JSON mode, function calling or constrained decoding.",
            "Send the schema near the end of the prompt.",
            "Parse the reply as JSON. A parse error is a shape failure.",
            "Validate the object against the schema.",
            "Repair once with the error message and the invalid reply.",
            "Fall back to a safe value and a human review when the repair fails.",
          ],
        },
        {
          kind: "paragraph",
          id: "structured-p-7",
          text: "A JSON schema names each property and its type. It marks required fields, lists the allowed values for an enum and sets additionalProperties to false. A closed schema rejects an extra key. A nested schema describes an object inside an object, such as a list of invoice lines.",
        },
        {
          kind: "paragraph",
          id: "structured-p-8",
          text: "Constrained decoding masks every token that would break the grammar. It makes the syntax valid by construction. It cannot make a value true, because the grammar does not know the source document. A value check needs a second rule that compares the object with the input.",
        },
        {
          kind: "paragraph",
          id: "structured-p-9",
          text: "Function calling is the model's structured request to run a named tool with arguments. The provider supplies a tool schema and returns the call as an object. Treat the arguments as untrusted data and validate them like any other output.",
        },
        {
          kind: "paragraph",
          id: "structured-p-10",
          text: "Validation has two layers: shape and meaning. The schema checks shape. A second rule checks meaning, such as a total that matches the source. Repair sends the validator error and the bad reply back once. A second failure returns the fallback, because a loop of retries adds cost and hides a broken schema.",
        },
        {
          kind: "table",
          id: "structured-table-1",
          columns: ["Method", "Shape guarantee", "Cost"],
          rows: [
            ["Prompt only", "No guarantee", "Low"],
            ["JSON mode", "Valid JSON, not your schema", "Low"],
            ["Function calling", "Arguments match the tool schema", "Medium"],
            ["Constrained decoding", "Tokens follow the grammar", "Medium to high"],
          ],
          caption: "Four enforcement methods and the guarantee each one gives.",
        },
        {
          kind: "diagram",
          id: "structured-diagram-1",
          variant: "timeline",
          spec: {
            nodes: [
              { id: "schema", label: "Schema" },
              { id: "prompt", label: "Prompt" },
              { id: "model", label: "Model" },
              { id: "parse", label: "Parse" },
              { id: "validate", label: "Validate" },
              { id: "repair", label: "Repair or fallback" },
            ],
            edges: [
              ["schema", "prompt"],
              ["prompt", "model"],
              ["model", "parse"],
              ["parse", "validate"],
              ["validate", "repair"],
            ],
          },
          caption:
            "The schema travels with the prompt; parse and validate catch a bad reply before repair.",
          alt: "Timeline from schema and prompt through the model, parse and validate to a repair or fallback.",
        },
        {
          kind: "paragraph",
          id: "structured-p-11",
          text: "Each method is a trade. Prompt only is cheap and unguaranteed. JSON mode fixes syntax, not keys. Constrained decoding raises the valid-shape rate and can add latency. A repair step doubles the calls for a failed output.",
        },
      ],
    },
    {
      id: "eli5-label-printer",
      title: "A label printer",
      register: "eli5",
      blocks: [
        {
          kind: "analogy",
          id: "structured-analogy-2",
          text: "Think of a label printer with a fixed template. The template has slots for name, street and postal code. The printer rejects a job with a missing slot and prints a clear label when every slot is full. A template cannot tell whether the street is real, so a clerk checks the parcel against the order. The template is the schema, the slots are the fields, and the clerk is the meaning check.",
          breaks:
            "a printer can fill a slot with the wrong text, while a schema accepts any string that fits the type, even a false one.",
        },
        {
          kind: "paragraph",
          id: "structured-p-12",
          text: "Prediction: a job fills the postal code slot with ABC. Does the template catch the wrong code, or does the clerk read the order?",
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
          id: "structured-p-13",
          text: "A structured output fails in four common ways. Each one has a cheap check.",
        },
        {
          kind: "table",
          id: "structured-table-2",
          columns: ["Symptom", "Cause", "Check", "Fix"],
          rows: [
            [
              "JSON ends mid-string",
              "The token limit is too low",
              "Read the finish reason",
              "Raise the limit or shorten the reason",
            ],
            [
              "The JSON is valid and the value is false",
              "The schema checks shape, not meaning",
              "Compare the value with the source",
              "Add a meaning rule and a review",
            ],
            [
              "A key is added or renamed",
              "The schema is open",
              "Run the schema validator",
              "Close the schema and use a native mode",
            ],
            [
              "The schema is ignored on a long prompt",
              "The schema sits in a weak position",
              "Move the schema to the end and rerun",
              "Repeat the schema and use constrained decoding",
            ],
          ],
          caption: "Four shape failures, from the token limit to the schema position.",
        },
        {
          kind: "paragraph",
          id: "structured-p-14",
          text: "A strict schema and a repair step raise the valid-shape rate and add tokens, latency and a fallback path. A loose prompt is cheaper and fails later, inside the caller.",
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
          id: "structured-p-15",
          text: "The support labeler returns one object for each ticket. On a fixed sample of 20 outputs, 16 parse and 13 are correct: a parse rate of 0.80 and a correct-label rate of 0.65.",
        },
        {
          kind: "paragraph",
          id: "structured-p-16",
          text: "The trace shows two groups: four replies stop mid-string at 60 tokens, and three use an outside category.",
        },
        {
          kind: "paragraph",
          id: "structured-p-17",
          text: "The broken layer is the output contract. The schema sits mid-prompt, the key set is open and max_tokens is too low. The team moves the schema to the end, closes the key set, raises max_tokens to 160 and adds validate-and-repair once. On the same 20 outputs, all 20 have a valid shape and 18 are correct. A person reviews the two remaining labels.",
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
          id: "structured-p-18",
          text: "Answer four checks on the definition, the method, the failure and the pass rate.",
        },
        { kind: "check", id: "structured-check-1", checkId: "check-1" },
        { kind: "check", id: "structured-check-2", checkId: "check-2" },
        { kind: "check", id: "structured-check-3", checkId: "check-3" },
        { kind: "check", id: "structured-check-4", checkId: "check-4" },
      ],
    },
    {
      id: "evaluation-task",
      title: "Evaluation task",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "structured-p-19",
          text: "Use the six fixed raw outputs and the one schema. Write one script that prints the failure mode, the valid-shape rate and the correct-label rate. Tick each step when its output is visible.",
        },
        { kind: "task", id: "task-structured-outputs" },
        {
          kind: "paragraph",
          id: "structured-p-20",
          text: "The reference solution prints a valid-shape rate of 0.33 before and 1.00 after. The correct-label rate is 0.33 before and 0.67 after. A fallback keeps a valid shape, and the nested line_items case fails the type check.",
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
          id: "structured-p-21",
          text: "Write one sentence: I changed X; the result was Y. Name the schema change and the two rates.",
        },
        {
          kind: "paragraph",
          id: "structured-p-22",
          text: "Self-rubric: mechanism names the layer and the rule; evidence gives a fixed number or order; limit names one blind spot or failed case.",
        },
        {
          kind: "paragraph",
          id: "structured-p-23",
          text: "Example: I moved the schema to the end, closed the key set and added one repair. The valid-shape rate rose from 0.33 to 1.00 on six outputs, but a truncated nested object still falls back to other.",
        },
        {
          kind: "note",
          id: "structured-note-1",
          text: "A valid shape is not a correct answer. Report both rates, or a schema hides a wrong value.",
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
          id: "structured-interview-1",
          items: [
            {
              question: "What is a structured output?",
              answer:
                "A structured output is a response that follows a fixed schema, such as JSON. The schema sets the keys, the types and the allowed values, and the caller parses the reply into data. The shape makes the output checkable; it does not make the values true.",
            },
            {
              question: "When do you choose constrained decoding over a prompt-only request?",
              answer:
                "Choose constrained decoding when a parse failure stops the pipeline and the schema is fixed. It guarantees the grammar, and it adds latency and cannot check meaning. A prompt-only request is simpler and cheaper when a person reads every reply.",
            },
            {
              question: "How does structured output fail, and what do you check first?",
              answer:
                "It fails with truncated JSON, a wrong type, an extra key or a valid value that is false. Check the finish reason and the validator error before you edit the prompt. Then close the schema, add one repair step and measure the valid-shape rate.",
            },
            {
              question: "How does the cost change at 10x requests?",
              answer:
                "At 10x requests, each repair doubles the cost of a failed request, so track the repair rate. Constrained decoding moves work to the server and can raise p95 latency. Cache the schema prefix and batch the calls; a valid-shape rate of 0.99 still leaves 1,000 failures in 100,000 calls.",
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
      prompt: "Which sentence defines constrained decoding?",
      options: [
        { id: "option-a", label: "The model asks a tool to run with arguments." },
        {
          id: "option-b",
          label: "Decoding masks tokens that would break a required grammar.",
        },
        { id: "option-c", label: "The caller compares the output with a source." },
        { id: "option-d", label: "The schema is sent in a second call." },
      ],
      correctOptionId: "option-b",
      explanation:
        "Constrained decoding removes every token that cannot continue the grammar, so the syntax holds by construction. A tool request is function calling, and a source check is a meaning rule.",
    },
    {
      id: "check-2",
      kind: "apply",
      prompt:
        "A pipeline stops on a missing key and the schema is fixed. Which method gives the strongest shape guarantee?",
      options: [
        { id: "option-a", label: "Prompt only" },
        { id: "option-b", label: "JSON mode" },
        { id: "option-c", label: "Constrained decoding over the schema" },
        { id: "option-d", label: "A second retry with the same prompt" },
      ],
      correctOptionId: "option-c",
      explanation:
        "Constrained decoding masks the tokens that would break the required schema, so a missing key cannot appear. JSON mode guarantees syntax only, and a retry repeats the same risk.",
    },
    {
      id: "check-3",
      kind: "diagnose",
      prompt:
        "A reply ends as {\"category\": \"bil. Which cause fits first?",
      options: [
        { id: "option-a", label: "The enum is too wide" },
        { id: "option-b", label: "The token limit is too low" },
        { id: "option-c", label: "The schema has an extra key" },
        { id: "option-d", label: "The meaning rule failed" },
      ],
      correctOptionId: "option-b",
      explanation:
        "The object stops in the middle of a string, which is the usual sign of a token limit. An enum or key problem leaves a complete object, and a meaning rule runs after a parse.",
    },
    {
      id: "check-4",
      kind: "calculate",
      prompt: "A validator accepts 34 of 40 outputs. What is the valid-shape rate?",
      options: [
        { id: "option-a", label: "0.75" },
        { id: "option-b", label: "0.80" },
        { id: "option-c", label: "0.85" },
        { id: "option-d", label: "0.90" },
      ],
      correctOptionId: "option-c",
      explanation:
        "34 divided by 40 is 0.85. A rate of 0.80 would need 32 valid outputs, and 0.90 would need 36.",
    },
  ],
  task: {
    id: "task-structured-outputs",
    scope:
      "Validate six fixed raw outputs, repair once, and report two rates.",
    items: [
      {
        id: "item-1",
        label: "Write the schema for the label object with a closed key set.",
      },
      {
        id: "item-2",
        label: "Classify each of the six raw outputs by failure mode.",
      },
      {
        id: "item-3",
        label: "Add validation and one repair; send a failed repair to the fallback.",
      },
      {
        id: "item-4",
        label: "Report the valid-shape rate and the correct-label rate before and after.",
      },
      {
        id: "item-5",
        label:
          "Apply the schema to the nested line_items object and state which check fails.",
      },
    ],
    solution: {
      filename: "structured/validate.py",
      language: "python",
      code: [
        "import json",
        "",
        'KEYS = {"category", "confidence", "reason"}',
        'ALLOWED = {"billing", "refund", "shipping", "account", "other"}',
        "",
        "RAW = [",
        '    {"id": "c1", "expected": "billing", "raw": \'{"category": "billing", "confidence": 0.82, "reason": "wrong total"}\'},',
        '    {"id": "c2", "expected": "refund", "raw": \'{"category": "refund", "confidence": 0.9, "reason": "late parcel", "urgent": true}\'},',
        '    {"id": "c3", "expected": "shipping", "raw": \'{"category": "shipping", "confidence": "0.82", "reason": "late parcel"}\'},',
        '    {"id": "c4", "expected": "shipping", "raw": \'{"category": "shipping", "confidence": 0.7, "reas\'},',
        '    {"id": "c5", "expected": "billing", "raw": \'{"category": "urgent", "confidence": 0.6, "reason": "customer is angry"}\'},',
        '    {"id": "c6", "expected": "account", "raw": \'{"category": "account", "confidence": 0.95, "reason": "password reset"}\'},',
        "]",
        "",
        "",
        "def validate(obj):",
        "    if set(obj) != KEYS:",
        '        return False, "key set"',
        '    if not isinstance(obj.get("confidence"), (int, float)):',
        '        return False, "confidence type"',
        '    if obj["category"] not in ALLOWED:',
        '        return False, "category enum"',
        '    if not 0.0 <= float(obj["confidence"]) <= 1.0:',
        '        return False, "confidence range"',
        "    return True, \"ok\"",
        "",
        "",
        "def repair(obj):",
        "    if not isinstance(obj, dict):",
        "        return None",
        "    fixed = {key: obj[key] for key in obj if key in KEYS}",
        '    if isinstance(fixed.get("confidence"), str):',
        '        fixed["confidence"] = float(fixed["confidence"])',
        "    ok, _ = validate(fixed)",
        "    return fixed if ok else None",
        "",
        "",
        "def fallback():",
        '    return {"category": "other", "confidence": 0.0, "reason": "validation fallback"}',
        "",
        "",
        "def run(record):",
        "    try:",
        "        obj = json.loads(record[\"raw\"])",
        "    except json.JSONDecodeError:",
        '        return fallback(), "parse", "fallback"',
        "    ok, reason = validate(obj)",
        "    if ok:",
        '        return obj, "ok", "kept"',
        "    fixed = repair(obj)",
        "    if fixed is not None:",
        '        return fixed, reason, "repaired"',
        '    return fallback(), reason, "fallback"',
        "",
        "",
        "before_valid = 0",
        "before_correct = 0",
        "after_valid = 0",
        "after_correct = 0",
        "for record in RAW:",
        '    try:',
        '        parsed = json.loads(record["raw"])',
        '        before = validate(parsed)[0]',
        "    except json.JSONDecodeError:",
        "        before = False",
        "    before_valid += before",
        '    before_correct += before and parsed.get("category") == record["expected"]',
        '    result, reason, action = run(record)',
        '    after = validate(result)[0]',
        "    after_valid += after",
        '    after_correct += after and result["category"] == record["expected"]',
        '    print(f\'{record["id"]} {reason:16s} {action:8s} -> {result["category"]}\')',
        "",
        "total = len(RAW)",
        'print(f"valid shape before {before_valid / total:.2f} after {after_valid / total:.2f}")',
        'print(f"correct label before {before_correct / total:.2f} after {after_correct / total:.2f}")',
        "",
        'NESTED = {"category": "billing", "confidence": 0.8, "line_items": {"sku": "A-1"}}',
        'item = NESTED.get("line_items")',
        'ok = isinstance(item, list)',
        'print(f"nested line_items: type check {\'passes\' if ok else \'fails\'} -> {NESTED[\'category\']}")',
      ].join("\n"),
    },
  },
  prove: {
    prompt: "Which schema change did you make, and how did the two rates move?",
    placeholder: "I changed X; the result was Y.",
    maxLength: 280,
    debounceMs: 800,
    savedMessage: "Proof saved on this device.",
  },
  citation:
    "Further reading: AI Engineering by Chip Huyen (O'Reilly). This course is independent and reproduces no book text or figures.",
} as const satisfies Lesson);
