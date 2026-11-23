import type { Lesson } from "@/lib/types";
import { deepFreeze } from "../freeze";

export const loraMemoryLesson = deepFreeze({
  slug: "lora-memory",
  order: 18,
  title: "LoRA and memory maths",
  chapterId: "ch-07",
  chapterOrder: 7,
  status: "draft",
  outcome: "This lesson is being written.",
  artifact: "A full lesson when the course is complete.",
  readingMinutes: 1,
  difficulty: "core",
  sections: [
    {
      id: "in-progress",
      title: "In progress",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "p-lora-memory",
          text: "This lesson is being written. It will cover rank, trainable parameters, optimizer state and GPU memory.",
        },
      ],
    },
  ],
  checks: [],
  task: {
    id: "task-lora-memory",
    scope: "This draft lesson has no build task yet.",
    items: [
      { id: "item-1", label: "Placeholder step 1." },
      { id: "item-2", label: "Placeholder step 2." },
      { id: "item-3", label: "Placeholder step 3." },
      { id: "item-4", label: "Placeholder step 4." },
      { id: "item-5", label: "Placeholder step 5." },
    ],
    solution: {
      filename: "draft/placeholder.py",
      language: "python",
      code: "print(\"placeholder\")",
    },
  },
  prove: {
    prompt: "What did you change, and what did the result show?",
    placeholder: "I changed X; the result was Y.",
    maxLength: 280,
    debounceMs: 800,
    savedMessage: "Proof saved on this device.",
  },
  citation:
    "Further reading: AI Engineering by Chip Huyen (O'Reilly). No book text is reproduced.",
} as const satisfies Lesson);
