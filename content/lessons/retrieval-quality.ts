import type { Lesson } from "@/lib/types";
import { deepFreeze } from "../freeze";

export const retrievalQualityLesson = deepFreeze({
  slug: "retrieval-quality",
  order: 15,
  title: "Measure and repair retrieval",
  chapterId: "ch-06",
  chapterOrder: 6,
  status: "live",
  outcome:
    "You can compute recall@k, MRR and nDCG, diagnose a query failure, and prove a retrieval repair. Prerequisite: lesson 14, retrieval.",
  artifact:
    "A runnable quality.py over six fixed queries, with three metrics before and after a rewrite.",
  readingMinutes: 24,
  difficulty: "advanced",
  terms: [
    {
      term: "Recall@k",
      definition: "The share of relevant documents found in the top k results.",
    },
    {
      term: "MRR (mean reciprocal rank)",
      definition: "The average of 1/rank of the first relevant result.",
    },
    {
      term: "nDCG",
      definition:
        "A graded ranking score that discounts each relevant item by its position.",
    },
    {
      term: "Query rewriting",
      definition: "The rewrite of a user query into a form that searches better.",
    },
    {
      term: "Contextual retrieval",
      definition:
        "Adding document or chunk context to a chunk before embedding it.",
    },
  ],
  evalCase: {
    id: "case-retrieval-quality",
    brief: "Diagnose a retrieval failure that is a query failure.",
  },
  sections: [
    {
      id: "what-it-is",
      title: "What it is",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "rq-p-1",
          text: "Retrieval quality is the measured fit between a query and the chunks that a retriever returns. Quality work starts with an eval set, a fixed collection of inputs with expected labels. For retrieval, each input is a query, and each label names the relevant chunk ids.",
        },
        {
          kind: "paragraph",
          id: "rq-p-2",
          text: "Recall@k is the share of relevant chunks found in the top k results. MRR (mean reciprocal rank) is the average of 1/rank of the first relevant result. nDCG is a graded ranking score that discounts each relevant item by its position.",
        },
        {
          kind: "paragraph",
          id: "rq-p-3",
          text: "A worked example: a team freezes 40 search queries. Each query names one to three relevant chunks. The baseline finds 32 of 48 relevant chunks inside the top five, so recall@5 is 0.67. After a query rewrite, it finds 41, so recall@5 is 0.85.",
        },
        {
          kind: "paragraph",
          id: "rq-p-4",
          text: "A non-example: one query returns a good answer for one reader. One query is not a measurement, because one success can hide many misses. A metric needs a frozen set and a written label rule.",
        },
      ],
    },
    {
      id: "eli5-a-helper-with-a-book-list",
      title: "A helper with a book list",
      register: "eli5",
      blocks: [
        {
          kind: "analogy",
          id: "rq-analogy-1",
          text: "Think of a librarian who holds a list of six books that answer one question. A helper brings a stack of five books. Recall@k asks how many listed books are in the stack. MRR asks how high the first listed book sits. nDCG asks whether the most useful book sits above a partly useful one. The list is the eval set, and the counter is the metric.",
          breaks:
            "Where it breaks: a librarian knows the exact list of books. A retrieval label is a person's judgment, so two people can disagree about which chunk is relevant.",
        },
        {
          kind: "paragraph",
          id: "rq-p-5",
          text: "The stack holds three of the six listed books, and the first listed book is third in the stack. Which number is lower, recall@5 or MRR?",
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
          id: "rq-p-6",
          text: "Retrieval work follows one order. Measure first, change one part, and measure again on the same frozen set.",
        },
        {
          kind: "list",
          id: "rq-list-1",
          ordered: true,
          items: [
            "Collect 30 to 100 real queries. Label each relevant chunk id, and add a grade when order matters.",
            "Choose one headline metric. Use recall@k for coverage, MRR for one answer, and nDCG for graded relevance.",
            "Record each query result, not only the mean. A mean can hide one broken slice.",
            "Split the failure. A chunk absent from every list is an index failure. A chunk present but low is a rank or query failure.",
            "Rewrite the query for the index vocabulary, or prepend context to the chunk before you embed it.",
            "Re-run the frozen set. Keep the change only when the headline metric rises and no slice falls.",
          ],
        },
        {
          kind: "paragraph",
          id: "rq-p-7",
          text: "Recall@k divides the relevant chunks found by all relevant chunks. A top-5 list with 3 of 5 scores 0.6. MRR gives 1.0 for a first hit at rank 1 and 0.25 for a first hit at rank 4. nDCG adds a grade and divides by the best order, so a useful chunk beats a partly useful one.",
        },
        {
          kind: "paragraph",
          id: "rq-p-8",
          text: "Query rewriting changes the search text, not the index. A user writes send something back, and the index says refunds. A rewrite adds return and refund, so the lexical pass finds the chunk. Keep the original query for the answer, and test the rewrite on an adversarial query.",
        },
        {
          kind: "paragraph",
          id: "rq-p-9",
          text: "Contextual retrieval changes the chunk at index time. Prepend the document title and a short summary, then embed the enriched text. Store the original chunk for the citation and the enriched text for the vector. This fix helps short chunks and adds one summary per document.",
        },
        {
          kind: "table",
          id: "rq-table-1",
          columns: ["Stage", "Input", "Output"],
          rows: [
            ["Eval set", "Queries, labels, grades", "Frozen metric baseline"],
            ["Query rewrite", "User query, synonym map", "Search text"],
            ["Contextual index", "Chunk, document title", "Enriched vector"],
          ],
          caption: "Inputs and outputs for the measure and repair loop.",
        },
        {
          kind: "diagram",
          id: "rq-diagram-1",
          variant: "flow",
          spec: {
            nodes: [
              { id: "query", label: "Query" },
              { id: "rewrite", label: "Rewrite" },
              { id: "retrieve", label: "Retrieve" },
              { id: "grade", label: "Grade" },
              { id: "fix", label: "Fix index or query" },
              { id: "keep", label: "Keep or reject" },
            ],
            edges: [
              ["query", "rewrite"],
              ["rewrite", "retrieve"],
              ["retrieve", "grade"],
              ["grade", "fix"],
              ["fix", "rewrite"],
              ["grade", "keep"],
            ],
          },
          caption:
            "A query is rewritten, retrieved and graded; a failed grade sends the work back to the index or the query.",
          alt: "Flow from a query to a rewrite, retrieval and grade, then back to the fix or out to keep or reject.",
        },
        {
          kind: "paragraph",
          id: "rq-p-10",
          text: "Every repair is a trade. A rewrite raises recall and can change intent. A contextual index adds one summary per document. A larger k adds tokens and noise.",
        },
      ],
    },
    {
      id: "eli5-a-parcel-queue",
      title: "A parcel queue",
      register: "eli5",
      blocks: [
        {
          kind: "analogy",
          id: "rq-analogy-2",
          text: "Think of a parcel office with a queue and a short list of parcels that belong to you. A clerk brings five parcels. Recall@k counts your parcels in the five. MRR looks at the position of your first parcel. nDCG values a priority parcel above a standard one. The clerk is the retriever, and your list is the label.",
          breaks:
            "Where it breaks: parcels are physical and the list is exact. A relevant chunk is a judgment, and one chunk can answer a question only in part.",
        },
        {
          kind: "paragraph",
          id: "rq-p-11",
          text: "Your first parcel sits third in the queue, and one priority parcel sits fifth. Which metric notices the priority parcel more: MRR or nDCG?",
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
          id: "rq-table-2",
          columns: ["Symptom", "Cause", "Check", "Fix"],
          rows: [
            [
              "The answer misses a chunk that the index holds",
              "The chunk sits below top-k",
              "Compare recall@k with k plus five",
              "Raise k or add a reranker",
            ],
            [
              "A rewritten query returns the wrong topic",
              "The rewrite changes intent",
              "Read the rewritten text and the first hit",
              "Constrain the rewrite to known phrases",
            ],
            [
              "A short chunk never ranks high",
              "The chunk lacks its topic words",
              "Embed the chunk with and without its title",
              "Use contextual retrieval",
            ],
            [
              "The score moves with no product change",
              "The eval set or index changed",
              "Diff the query list, labels and index build",
              "Freeze and version both",
            ],
          ],
          caption: "Four retrieval failures, from the cut back to the index.",
        },
        {
          kind: "paragraph",
          id: "rq-p-12",
          text: "Every repair trades cost for quality: a rewrite adds a call, and a contextual index adds a summary per document.",
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
          id: "rq-p-13",
          text: "The support assistant answers from twelve fixed documents. A reader asks: how long do I have to send something back? The label names doc-07, the refund document, as the only relevant chunk. The expected rank is 1.",
        },
        {
          kind: "paragraph",
          id: "rq-p-14",
          text: "The baseline returns doc-08, doc-02, doc-04, then doc-07. Recall@3 is 0.0, and MRR is 0.25. The index holds doc-07 with the text refunds are available within 30 days. The dense list puts doc-07 first, so the index and the vector hold the answer.",
        },
        {
          kind: "paragraph",
          id: "rq-p-15",
          text: "The trace shows the layer. The query words send and back never appear in doc-07, and the lexical pass dominates the fused list. The failure is the query, not the chunk. The team adds a phrase rewrite: send something back becomes return an item. The same index now ranks doc-07 first. Recall@3 is 1.0, and MRR is 1.0. A second check runs the rewrite on an account query that says returning customer, and the new term pulls doc-07 above doc-01. The team limits the rewrite to the full phrase and keeps the account query on a held-out slice.",
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
          id: "rq-p-16",
          text: "Answer five questions on the metrics, the failure and the repairs.",
        },
        { kind: "check", id: "rq-check-1", checkId: "check-1" },
        { kind: "check", id: "rq-check-2", checkId: "check-2" },
        { kind: "check", id: "rq-check-3", checkId: "check-3" },
        { kind: "check", id: "rq-check-4", checkId: "check-4" },
        { kind: "check", id: "rq-check-5", checkId: "check-5" },
      ],
    },
    {
      id: "evaluation-task",
      title: "Evaluation task",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "rq-p-17",
          text: "Use the six fixed queries and their labeled grades. Compute the three metrics before a rewrite, apply one phrase rewrite, and recompute. Tick each step when its output is visible.",
        },
        { kind: "task", id: "task-retrieval-quality" },
        {
          kind: "paragraph",
          id: "rq-p-18",
          text: "The reference solution prints mean recall@3 0.83 and mean MRR 0.62 before the rewrite. After the rewrite it prints mean recall@3 1.00, mean MRR 0.75 and mean nDCG@3 0.81. Query q6 prints MRR 1.00 before and 0.50 after, the limit of the rule.",
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
          id: "rq-p-19",
          text: "Write the query, the old rank and the new rank. Name the rewrite or the contextual change, and give the metric before and after. Name one query where the change fails.",
        },
        {
          kind: "paragraph",
          id: "rq-p-20",
          text: "Self-rubric: mechanism names the layer and the rule; evidence gives a fixed number; limit names one blind spot.",
        },
        {
          kind: "note",
          id: "rq-note-1",
          text: "A metric without a frozen set is a number that cannot repeat.",
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
          id: "rq-interview-1",
          items: [
            {
              question: "What is recall@k?",
              answer:
                "Recall@k is the share of relevant chunks found in the top k results. It measures coverage, not order, so three relevant chunks at ranks 1, 2 and 3 score the same as three at ranks 8, 9 and 10 when k is 10. Use it when a missing chunk costs more than a low rank.",
            },
            {
              question: "When do you use MRR or nDCG instead of recall@k?",
              answer:
                "Use MRR when one first correct result ends the task, such as a single answer lookup. Use nDCG when the labels have grades and the order of useful chunks matters. Recall@k still belongs in the report, because a high MRR can hide missing chunks below the first hit.",
            },
            {
              question: "How does a retrieval eval fail, and what do you check?",
              answer:
                "A retrieval eval fails when the labels are stale, the set is too small, or the score is a mean over one easy slice. Check the per-query output, the label agreement on a sample, and a held-out slice. A rewrite that lifts the mean but drops one slice is not a win.",
            },
            {
              question:
                "How does retrieval evaluation change at 10x corpus or query volume?",
              answer:
                "At 10x corpus size, recompute recall@k after each reindex, because new chunks change the candidate pool. At 10x query volume, sample the logs and refresh the eval set, but keep a frozen set for comparisons. Track the metric per slice and p95 retrieval latency together, because a slower index can raise quality and miss the budget.",
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
      prompt: "Which metric is the share of relevant chunks in the top k results?",
      options: [
        { id: "option-a", label: "Recall@k" },
        { id: "option-b", label: "MRR" },
        { id: "option-c", label: "nDCG" },
        { id: "option-d", label: "Precision" },
      ],
      correctOptionId: "option-a",
      explanation:
        "Recall@k divides the relevant chunks found in the top k by all relevant chunks. MRR measures the rank of the first hit, and nDCG adds a grade to each hit.",
    },
    {
      id: "check-2",
      kind: "apply",
      prompt:
        "A query has one relevant chunk, and the chunk sits at rank 3. What is the reciprocal rank for this query?",
      options: [
        { id: "option-a", label: "0.33" },
        { id: "option-b", label: "0.50" },
        { id: "option-c", label: "1.00" },
        { id: "option-d", label: "3.00" },
      ],
      correctOptionId: "option-a",
      explanation:
        "The reciprocal rank is 1 divided by the rank of the first relevant chunk, so 1/3 is 0.33. A value of 1.00 needs the chunk at rank 1, and 0.50 needs rank 2.",
    },
    {
      id: "check-3",
      kind: "calculate",
      prompt:
        "An eval set holds 4 relevant chunks. The top 5 results contain 3 of them. What is recall@5?",
      options: [
        { id: "option-a", label: "0.60" },
        { id: "option-b", label: "0.75" },
        { id: "option-c", label: "0.80" },
        { id: "option-d", label: "1.00" },
      ],
      correctOptionId: "option-b",
      explanation:
        "Recall@5 divides the 3 relevant chunks found by all 4 relevant chunks, so 3/4 is 0.75. A value of 1.00 needs all four chunks inside the top five.",
    },
    {
      id: "check-4",
      kind: "diagnose",
      prompt:
        "A relevant chunk never appears in any candidate list. Which check comes first?",
      options: [
        { id: "option-a", label: "Rewrite the query" },
        { id: "option-b", label: "Inspect the index and the chunk" },
        { id: "option-c", label: "Rerank the shortlist" },
        { id: "option-d", label: "Raise k by ten" },
      ],
      correctOptionId: "option-b",
      explanation:
        "A chunk absent from every list never entered the index, so a query change cannot recover it. Check the chunking rule, the ingest job and the document id first.",
    },
    {
      id: "check-5",
      kind: "apply",
      prompt:
        "A chunk about refund windows embeds poorly because it never names refunds. Which fix fits contextual retrieval?",
      options: [
        {
          id: "option-a",
          label: "Prepend the document title and a summary before embedding",
        },
        { id: "option-b", label: "Lower k to three" },
        { id: "option-c", label: "Remove the chunk metadata" },
        { id: "option-d", label: "Use BM25 only" },
      ],
      correctOptionId: "option-a",
      explanation:
        "Contextual retrieval adds the document context to the chunk before the embedding call, so the vector carries the topic. Lowering k or removing metadata changes the cut or the filter, not the embedding.",
    },
  ],
  task: {
    id: "task-retrieval-quality",
    scope:
      "Measure three retrieval metrics on six fixed queries, repair one query, and prove the change.",
    items: [
      {
        id: "item-1",
        label:
          "Write the six queries with their relevant chunk ids and grades.",
      },
      {
        id: "item-2",
        label: "Compute recall@3, MRR and nDCG@3 per query before the rewrite.",
      },
      {
        id: "item-3",
        label: "Apply one phrase rewrite to the failing query.",
      },
      {
        id: "item-4",
        label:
          "Recompute the three metrics on the same set and report the means.",
      },
      {
        id: "item-5",
        label:
          "Apply the rewrite to the billing query and q6, and state where it holds and where it breaks.",
      },
    ],
    solution: {
      filename: "retrieval/quality.py",
      language: "python",
      code: [
        "import math",
        "",
        "QUERIES = [",
        '    {"id": "q1", "text": "how long do I have to send something back",',
        '     "grades": {"doc-07": 3},',
        '     "before": ["doc-08", "doc-02", "doc-04", "doc-07"],',
        '     "after": ["doc-07", "doc-08", "doc-02", "doc-04"]},',
        '    {"id": "q2", "text": "billing cycle",',
        '     "grades": {"doc-02": 3, "doc-09": 1},',
        '     "before": ["doc-02", "doc-03", "doc-09"],',
        '     "after": ["doc-02", "doc-03", "doc-09"]},',
        '    {"id": "q3", "text": "late parcel tracking stopped",',
        '     "grades": {"doc-05": 2},',
        '     "before": ["doc-04", "doc-05", "doc-10"],',
        '     "after": ["doc-04", "doc-05", "doc-10"]},',
        '    {"id": "q4", "text": "return label cost",',
        '     "grades": {"doc-08": 2},',
        '     "before": ["doc-02", "doc-08", "doc-07"],',
        '     "after": ["doc-02", "doc-08", "doc-07"]},',
        '    {"id": "q5", "text": "stop paying",',
        '     "grades": {"doc-02": 2},',
        '     "before": ["doc-09", "doc-02", "doc-03"],',
        '     "after": ["doc-02", "doc-09", "doc-03"]},',
        '    {"id": "q6", "text": "returning customer account help",',
        '     "grades": {"doc-01": 2},',
        '     "before": ["doc-01", "doc-07", "doc-02"],',
        '     "after": ["doc-07", "doc-01", "doc-02"]},',
        "]",
        "K = 3",
        "",
        "",
        "def recall_at_k(ranked, relevant, k):",
        "    return len(set(ranked[:k]) & set(relevant)) / len(relevant)",
        "",
        "",
        "def reciprocal_rank(ranked, relevant):",
        "    for rank, doc_id in enumerate(ranked, 1):",
        "        if doc_id in relevant:",
        "            return 1 / rank",
        "    return 0.0",
        "",
        "",
        "def ndcg_at_k(ranked, grades, k):",
        "    dcg = sum(grades.get(doc_id, 0) / math.log2(rank + 1)",
        "              for rank, doc_id in enumerate(ranked[:k], 1))",
        "    ideal = sorted(grades.values(), reverse=True)[:k]",
        "    idcg = sum(grade / math.log2(rank + 1)",
        "               for rank, grade in enumerate(ideal, 1))",
        "    return dcg / idcg if idcg else 0.0",
        "",
        "",
        "def score(query, key):",
        '    ranked = query[key]',
        '    relevant = set(query["grades"])',
        "    return (recall_at_k(ranked, relevant, K),",
        "            reciprocal_rank(ranked, relevant),",
        '            ndcg_at_k(ranked, query["grades"], K))',
        "",
        "",
        "for query in QUERIES:",
        '    before = score(query, "before")',
        '    after = score(query, "after")',
        '    print(f\'{query["id"]} before recall@{K} {before[0]:.2f} mrr {before[1]:.2f} ndcg@{K} {before[2]:.2f}\')',
        '    print(f\'{query["id"]} after  recall@{K} {after[0]:.2f} mrr {after[1]:.2f} ndcg@{K} {after[2]:.2f}\')',
        "",
        'for key in ("before", "after"):',
        "    rows = [score(query, key) for query in QUERIES]",
        "    mean = tuple(sum(row[i] for row in rows) / len(rows) for i in range(3))",
        "    print(f'mean {key:6} recall@{K} {mean[0]:.2f} mrr {mean[1]:.2f} ndcg@{K} {mean[2]:.2f}')",
        "",
        'q6 = next(query for query in QUERIES if query["id"] == "q6")',
        "print(f'q6 mrr before {score(q6, \"before\")[1]:.2f} after {score(q6, \"after\")[1]:.2f}')",
      ].join("\n"),
    },
  },
  prove: {
    prompt: "Which query did you rewrite, and how did the metrics move?",
    placeholder: "I changed X; the result was Y.",
    maxLength: 280,
    debounceMs: 800,
    savedMessage: "Proof saved on this device.",
  },
  citation:
    "Further reading: AI Engineering by Chip Huyen (O'Reilly). This course is independent and reproduces no book text or figures.",
} as const satisfies Lesson);
