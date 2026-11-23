# Users — lastminute.dev

This document defines the audience of the product. The product is a written course. The course covers the chapters of the book *AI Engineering* by Chip Huyen. The format follows educative.io and systemdesignschool.io.

The evidence base is `docs/idea/IDEA.md`, `docs/idea/BUILD_GUIDE.md`, and the public style of the named course sites. No user interviews exist. Section 6 marks each assumption.

## 1. Audience segments

### A. Software engineers moving into AI

- **Who:** engineers with 2–8 years in web or backend work. They ship APIs, databases, and deployments.
- **Level:** strong in software practice, beginner in AI engineering.
- **What they want:** a mental model that maps to skills they already have. They want to build and debug AI features, not read math papers.

### B. Product managers and technical founders

- **Who:** people who own a roadmap or a small company. They decide which AI features to build.
- **Level:** little or no coding. They read code and specs with help.
- **What they want:** enough depth to judge feasibility, set scope, and question cost and quality. They do not want to train a model.

### C. Students and career switchers

- **Who:** final-year computer science students, bootcamp graduates, and analysts who move toward AI.
- **Level:** mixed. They know Python. They lack production experience.
- **What they want:** a fixed path with exercises and answers. They want work to show and answers for an interview.

### D. Data scientists and ML practitioners

- **Who:** people who train models and work in notebooks. Their models often stay in notebooks.
- **Level:** strong in modelling, weaker in product serving. They know model metrics, not product metrics.
- **What they want:** the bridge from a model metric to a product result.

## 2. Jobs to be done

### Segment A — Software engineers

- When I ship a feature that calls a model, I want to know which layer fails, so I can fix the right layer and not guess.
- When I read about retrieval, I want a worked example with code and data, so I can copy the pattern into my own service.
- When my manager asks for an estimate, I want to know the cost and latency levers, so I can give a number I can defend.

### Segment B — PMs and founders

- When I plan a quarter, I want to know which AI features are cheap and which are risky, so I can cut scope early.
- When the model gives a wrong answer, I want a plain explanation of the cause, so I can set a team policy.
- When I compare vendors, I want one shared vocabulary, so I can compare cost and quality on equal terms.

### Segment C — Students

- When I prepare for an interview, I want a path with exercises and solutions, so I can show real work.
- When a concept feels abstract, I want a small runnable example, so I can see the concept work.

### Segment D — Data scientists

- When my prototype must go to production, I want the serving and evaluation steps, so I can hand it over with confidence.

## 3. Pains today

Each pain has a visible symptom.

| Pain | Symptom |
| --- | --- |
| The book is dense. | The reader stops after the first two chapters. The book tab stays open for weeks. |
| Papers assume math. | The reader copies a formula but cannot explain it one week later. |
| Blog posts show toy code. | The snippet fails on the reader's data. It skips chunking, retries, and cost limits. |
| Tutorials chain five tools. | The reader cannot tell which part failed. |
| Evaluation gets one paragraph. | The reader ships a system and cannot say if it improved. |
| No feedback loop. | The reader has no way to check understanding and forgets the chapter. |
| Cost surprise. | A demo works, then the bill at real traffic is far above the estimate. |
| Mobile reading breaks. | Code blocks scroll sideways. The reader gives up on the train. |
| Terminology drift. | "Agent", "tool", and "retrieval" mean different things in each post. |

## 4. What one chapter page must include

These are design targets for the demo, not measured data.

- **Length:** 1,500–2,500 words of body text. One chapter fits one sitting.
- **Reading time:** 10–15 minutes for the text. 20–30 minutes with the exercises.
- **Code:** one main example per chapter. The code is short and runnable. It has a copy button and visible output. Optional variants follow the main example.
- **Diagrams:** one architecture or flow diagram per chapter. A text description sits below the diagram.
- **Exercises:** two or three per chapter. One quiz checks understanding and explains each answer. One build task has a starter and a solution.
- **Page frame:** an opener states what the reader can do after the chapter. A key-terms box, a difficulty tag, and an estimated time follow. The footer links to the next chapter.
- **Mobile:** one column. Only code blocks scroll sideways, inside their own box. Diagrams open in a zoom view. Reading progress is saved.

## 5. First segment for the demo

Serve **Segment A — software engineers moving into AI** first.

Reasons:

1. The book addresses people who build applications with foundation models. Engineers are that audience.
2. Engineers turn reading into code fast. The demo can therefore show code, diagrams, and exercises at full strength.
3. Engineers are likely to share a good technical page with their team.
4. A page that satisfies engineers is also honest for the other segments. PMs read the summaries and diagrams. Students use the exercises later.

The demo serves one segment well. The other segments read the same pages, with no separate product.

## 6. Assumptions

- **No user research.** The four segments come from the idea, the book's audience, and the public format of educative.io and systemdesignschool.io. No interviews or surveys support them.
- **Chapter list.** The chapter topics here rest on the known table of contents: evaluation, prompt engineering, retrieval and agents, finetuning, dataset engineering, and inference optimization. Check the edition before chapter writing starts.
- **No statistics.** This document contains no traffic, payment, or completion numbers. All such numbers are unknown.
- **Reading times and exercise counts** are design targets. No reader has tested them.
- **Mobile share.** The document assumes that many students read on a phone. This is not measured.
- **Willingness to pay** is unknown. The first segment is chosen for fit with the material, not for revenue evidence.
- **Second segment.** PMs and founders are the likely second audience. This is a judgement, not a finding.
