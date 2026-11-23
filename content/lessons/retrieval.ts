import type { Lesson } from "@/lib/types";
import { deepFreeze } from "../freeze";

export const retrievalLesson = deepFreeze({
  slug: "retrieval",
  order: 3,
  title: "Retrieval that earns its keep",
  outcome: "You can chunk, rank and cite sources in a retrieval pipeline.",
  artifact: "A 40-line search.py over 12 fixed documents.",
  readingMinutes: 25,
  difficulty: "advanced",
  layerId: "layer-03",
  sections: [
    {
      id: "read-the-feature",
      title: "Read: one broken triage feature",
      blocks: [
        {
          kind: "paragraph",
          id: "p-retrieval-1",
          text: "The support assistant answers questions from a fixed knowledge base of twelve documents. A person types a question. The assistant finds a few documents, adds them to the prompt and writes a reply. The reply is only as good as the documents that reach it.",
        },
        {
          kind: "paragraph",
          id: "p-retrieval-2",
          text: "The assistant has a broken retrieval layer. For the query refund policy it puts the billing cycle document above the return label document. The reply then talks about invoices when the reader asks about a refund. The labeler is not the cause. The ranking is.",
        },
        {
          kind: "paragraph",
          id: "p-retrieval-3",
          text: "Support sees the failure as a wrong answer. The team reads the answer and edits the prompt. The next query still ranks the wrong document first. A prompt edit cannot repair a missing document. The repair belongs in the retrieval layer.",
        },
        {
          kind: "paragraph",
          id: "p-retrieval-4",
          text: "Retrieval has one job. Put the document that answers the question inside the top few results. A reply can fail after a good retrieval, but it cannot succeed after a bad one. The ranking is the gate.",
        },
        {
          kind: "paragraph",
          id: "p-retrieval-29",
          text: "A wrong document is worse than no document. The model trusts the text it receives and writes a confident reply from it. The reader then acts on a billing rule while asking about a refund. The failure reaches the customer, not the log.",
        },
        {
          kind: "paragraph",
          id: "p-retrieval-30",
          text: "The knowledge base changes every week. A policy edit lands on Monday and the answer must use it on Monday. An index that rebuilds once a month serves the old rule with full confidence.",
        },
        {
          kind: "callout",
          id: "callout-retrieval-see",
          tone: "warning",
          title: "The prompt cannot cite what it never sees.",
          text: "When the right document is outside the top results, the model writes around the gap. The reply sounds sure and stays wrong.",
        },
      ],
    },
    {
      id: "read-the-index",
      title: "Read: chunks, vectors and top-k",
      blocks: [
        {
          kind: "paragraph",
          id: "p-retrieval-5",
          text: "A document is too large to send whole. The pipeline splits each document into chunks, usually a paragraph or a few sentences. A chunk carries the document id, so the reply can cite its source. Small chunks sharpen the match and lose context. Large chunks keep context and blur the match.",
        },
        {
          kind: "paragraph",
          id: "p-retrieval-6",
          text: "Each chunk becomes a vector, a list of numbers. A model turns text into the vector during an indexing pass. At query time the same model turns the question into a vector. The score is a distance between the two vectors. Close vectors mean close meaning.",
        },
        {
          kind: "paragraph",
          id: "p-retrieval-31",
          text: "The embedding model has a version. A new version produces new vectors that do not compare with the old index. Change the model and rebuild the index in one step, or the scores mix two spaces.",
        },
        {
          kind: "paragraph",
          id: "p-retrieval-7",
          text: "Two families of search exist. Lexical search matches words and their counts. Dense search matches vectors and meaning. Lexical search is exact and cheap. Dense search handles paraphrase and misses rare names. Most production systems run both and fuse the lists.",
        },
        {
          kind: "paragraph",
          id: "p-retrieval-32",
          text: "Metadata travels with each chunk: product area, language, date and access level. The rank can use the metadata, and the caller can filter on it. A chunk without metadata is hard to remove when it goes stale.",
        },
        {
          kind: "paragraph",
          id: "p-retrieval-8",
          text: "Top-k is the number of chunks that reach the prompt. A k of three keeps the prompt short and misses the fourth best chunk. A k of fifty raises recall and adds tokens, cost and noise. The right k follows from the budget, not from a default.",
        },
        {
          kind: "paragraph",
          id: "p-retrieval-33",
          text: "Chunk overlap is a trade. A fifty-token overlap keeps a sentence whole across a boundary. The same overlap stores duplicate text and can return two near-identical chunks. A dedupe step removes the twin before the prompt grows.",
        },
        {
          kind: "diagram",
          id: "retrieval-flow",
          spec: {
            nodes: [
              { id: "query", label: "Question" },
              { id: "normalize", label: "Normalize" },
              { id: "lexical", label: "Word search" },
              { id: "dense", label: "Vector search" },
              { id: "fuse", label: "Fuse lists" },
              { id: "topk", label: "Top-k cut" },
              { id: "cite", label: "Cite source" },
            ],
            edges: [
              ["query", "normalize"],
              ["normalize", "lexical"],
              ["normalize", "dense"],
              ["lexical", "fuse"],
              ["dense", "fuse"],
              ["fuse", "topk"],
              ["topk", "cite"],
            ],
          },
          caption:
            "Two searches run in parallel; the fused list is cut to k and each chunk keeps its source id.",
          alt: "Flow from a question through normalization, two searches, fusion, a top-k cut and a cited source.",
        },
        {
          kind: "paragraph",
          id: "p-retrieval-9",
          text: "The vector index has its own cost. Every chunk needs an embedding at index time. The index needs memory and a fast nearest-neighbour search. A rebuild after a document change is a batch job, not a page edit.",
        },
        {
          kind: "paragraph",
          id: "p-retrieval-34",
          text: "A vector is not a summary. It keeps enough signal to find the chunk, not enough to answer from it. The reply still needs the chunk text, and so does the citation.",
        },
        {
          kind: "callout",
          id: "callout-retrieval-index",
          tone: "production-tip",
          title: "Store the source id with the vector.",
          text: "A vector without its source cannot be cited. Keep the document id and the chunk text beside the vector at index time.",
        },
      ],
    },
    {
      id: "trace-one-query",
      title: "Trace one query",
      blocks: [
        {
          kind: "paragraph",
          id: "p-retrieval-10",
          text: "Trace the failing query end to end. The reader types refund policy. The pipeline lowercases the query and splits it into two terms. The lexical search scores each chunk by term overlap. The dense search adds its own list. The fusion step combines the two lists.",
        },
        {
          kind: "paragraph",
          id: "p-retrieval-11",
          text: "The billing document wins the lexical list. It repeats the word policy in a sentence about the billing policy. The return label document says return and label, not refund. The exact words do not meet, so the lexical score stays low.",
        },
        {
          kind: "paragraph",
          id: "p-retrieval-12",
          text: "The dense list does better. It puts the refund document first because the vectors sit close. The fusion step weights the lexical list too high, so the billing document rises again. The bug is in the weights and in the missing synonyms.",
        },
        {
          kind: "paragraph",
          id: "p-retrieval-13",
          text: "The trace names the break. The query and the document use different words for one idea. The index is fine. The documents are fine. The matching rule needs repair. A trace that stops at the answer cannot show this, because the answer hides the candidate list.",
        },
        {
          kind: "list",
          id: "list-retrieval-trace",
          ordered: true,
          items: [
            "Read the query terms after normalization.",
            "List the candidates from each retriever.",
            "Compare the fused order with the expected order.",
            "Name the rule that put the wrong document first.",
          ],
        },
        {
          kind: "paragraph",
          id: "p-retrieval-35",
          text: "Keep a candidate dump for each failing query. The dump lists the retrievers, the raw scores and the fused order. A dump turns a vague complaint into a table that shows where the order went wrong.",
        },
        {
          kind: "paragraph",
          id: "p-retrieval-36",
          text: "Compare the dump with the expected order from the check. If the right document is absent from both lists, the problem is the index. If it is present and ranked low, the problem is the fusion weights.",
        },
      ],
    },
    {
      id: "check-the-ranking",
      title: "Check: rank the candidates",
      blocks: [
        {
          kind: "paragraph",
          id: "p-retrieval-14",
          text: "The expected order for refund policy is doc-07, then doc-08, then doc-02. The sample score falls from 0.91 to 0.74 to 0.61. The gap between the first two is small enough that a weight change can flip them.",
        },
        { kind: "check", id: "check-retrieval-a", checkId: "check-1" },
        {
          kind: "paragraph",
          id: "p-retrieval-15",
          text: "A ranking is a claim about relevance. The claim needs a fixed expected order, or every change starts an argument. Write the order down before the repair.",
        },
        {
          kind: "paragraph",
          id: "p-retrieval-37",
          text: "A score is not a probability. A 0.91 means close in the embedding space or high in the lexical score, not a 91 percent chance of a correct answer. Calibrate the cutoff with labeled queries before you show a score to a reader.",
        },
      ],
    },
    {
      id: "build-the-fix",
      title: "Build: repair the ranking",
      blocks: [
        {
          kind: "paragraph",
          id: "p-retrieval-16",
          text: "The repair has two parts. Add a synonym map, so refund also searches returns. Add a tag boost, so a document whose tags match the query outranks a document that only repeats one word. Both changes target the trace, not the whole pipeline.",
        },
        {
          kind: "paragraph",
          id: "p-retrieval-17",
          text: "A synonym map is small and explicit. List the pairs the support vocabulary needs: refund and return, late and delayed, cancel and stop. Review the map like code. A bad pair creates a false match that looks like a good result.",
        },
        {
          kind: "paragraph",
          id: "p-retrieval-18",
          text: "The tag boost uses data the index already holds. Tags are short and curated. They carry less noise than body text. Give a tag match double weight and keep the text match at single weight.",
        },
        {
          kind: "code",
          id: "code-retrieval-search",
          filename: "retrieval/search.py",
          language: "python",
          code: [
            'QUERY = "refund policy"',
            "",
            "DOCS = {",
            '    "doc-07": {',
            '        "tags": {"refunds", "returns", "policy"},',
            '        "text": "refunds are available within 30 days of delivery. start a return from the order page.",',
            "    },",
            '    "doc-08": {',
            '        "tags": {"labels", "returns", "shipping"},',
            '        "text": "a return label is free for refunds and exchanges. the label expires after 14 days.",',
            "    },",
            '    "doc-02": {',
            '        "tags": {"billing", "invoice", "payments"},',
            '        "text": "billing runs on a monthly cycle. an invoice appears on the first day.",',
            "    },",
            "}",
            "",
            'SYNONYMS = {"refund": "returns", "policy": "policy"}',
            "",
            "def terms(query: str) -> set[str]:",
            "    words = set(query.lower().split())",
            "    return words | {SYNONYMS[w] for w in words if w in SYNONYMS}",
            "",
            'def score(query: str, doc: dict) -> float:',
            "    words = terms(query)",
            '    tag_hits = len(words & doc["tags"])',
            '    text_hits = sum(1 for w in words if w in doc["text"])',
            "    return 2.0 * tag_hits + 1.0 * text_hits",
            "",
            "ranked = sorted(DOCS, key=lambda doc_id: (-score(QUERY, DOCS[doc_id]), doc_id))",
            "for doc_id in ranked:",
            '    print(f"{doc_id} {score(QUERY, DOCS[doc_id]):.1f}")',
          ].join("\n"),
          output: {
            label: "Sample output. Fixed data.",
            text: "doc-07 5.0\ndoc-08 3.0\ndoc-02 0.0",
          },
        },
        {
          kind: "paragraph",
          id: "p-retrieval-19",
          text: "Read the output. The refund document scores 5.0, the return label scores 3.0 and the billing document scores 0.0. The order now matches the expected order, and the gap is wide enough to survive a small weight change.",
        },
        {
          kind: "paragraph",
          id: "p-retrieval-38",
          text: "Test the repair against the old ranking, not against a hunch. Run the three presets and the eval queries. Count how many expected documents stay in the top three. A repair that lifts one query and drops another is not a repair.",
        },
        {
          kind: "paragraph",
          id: "p-retrieval-39",
          text: "A reranker is the next rung. It reads the query and each candidate together and scores the pair. It is slower and costs another model call, so use it after a cheap first pass, not instead of one.",
        },
        {
          kind: "paragraph",
          id: "p-retrieval-40",
          text: "The synonym map needs a review step. A pair that is too broad, such as cancel and refund, pulls unrelated documents into the top results. Review the map with the support team and keep the pairs short.",
        },
        { kind: "task", id: "task-retrieval" },
        {
          kind: "note",
          id: "note-retrieval",
          text: "A ranking fix that helps one query and breaks two is a regression. Run the full preset list before you ship.",
        },
      ],
    },
    {
      id: "run-the-explorer",
      title: "Run the explorer",
      blocks: [
        {
          kind: "paragraph",
          id: "p-retrieval-20",
          text: "The explorer runs the same three preset queries on the twelve fixed documents. Type a query or press a preset. The rows show the rank, the score, the chunk text and the source id. The scores are fixed sample data, so the same query gives the same rows.",
        },
        {
          kind: "widget",
          id: "widget-retrieval-explorer",
          widget: "retrieval-explorer",
          caption:
            "Run three fixed queries on twelve documents. Scores are sample data and do not change.",
        },
        {
          kind: "paragraph",
          id: "p-retrieval-21",
          text: "Use the explorer to test a claim. If a repair changes the order of a preset, the row moves at once. If the order stays, the repair did not touch that path. A demo that cannot move is not evidence.",
        },
        {
          kind: "paragraph",
          id: "p-retrieval-41",
          text: "The explorer shows the fixed preset scores, not the scores from the search.py run. The two numbers answer different questions. The preset shows the expected order. The script shows how a simple scorer reaches that order.",
        },
        {
          kind: "paragraph",
          id: "p-retrieval-22",
          text: "The no-results state is part of the test. A query outside the three presets returns no rows and asks for a known query. An empty answer is better than a confident wrong match.",
        },
      ],
    },
    {
      id: "check-the-limit",
      title: "Check: name the limit",
      blocks: [
        {
          kind: "paragraph",
          id: "p-retrieval-23",
          text: "Retrieval has a limit. It finds text that is close to the query. It does not check that the text is true, current or allowed for this reader. A stale document ranks as well as a fresh one when the words match.",
        },
        {
          kind: "paragraph",
          id: "p-retrieval-24",
          text: "The second limit is the cutoff. A document outside top-k never reaches the prompt, so the model cannot cite it. Raising k helps recall and raises cost, latency and the chance of a distracting chunk. The budget decides k.",
        },
        {
          kind: "paragraph",
          id: "p-retrieval-42",
          text: "Access control is a filter, not a rank. A document the reader may not see must leave the candidate list before the model reads it. A high score cannot grant permission.",
        },
        { kind: "check", id: "check-retrieval-b", checkId: "check-2" },
        { kind: "check", id: "check-retrieval-c", checkId: "check-3" },
        {
          kind: "paragraph",
          id: "p-retrieval-25",
          text: "A metadata filter is the cheap lever. Filter by product area, language or date before the rank. A filter removes candidates the reader cannot use. It costs one predicate and no extra tokens.",
        },
        {
          kind: "paragraph",
          id: "p-retrieval-43",
          text: "A fresh document needs a date and an owner. A stale document with a high score is a trap. Put the review date in the metadata and filter out anything past it.",
        },
        {
          kind: "callout",
          id: "callout-retrieval-truth",
          tone: "note",
          title: "Matched is not correct.",
          text: "A score measures similarity. A currency check, a date check and a source allowlist measure truth.",
        },
      ],
    },
    {
      id: "prove-the-change",
      title: "Prove: state your change",
      blocks: [
        {
          kind: "paragraph",
          id: "p-retrieval-26",
          text: "The proof note names the query, the old order and the new order. Example: I added a refund-return synonym and a tag boost; refund policy moved doc-08 from rank three to rank two on the twelve fixed documents.",
        },
        {
          kind: "paragraph",
          id: "p-retrieval-44",
          text: "Name the check that failed before the repair. A note that starts from the failing order is easier to verify than a note that starts from the fix.",
        },
        {
          kind: "paragraph",
          id: "p-retrieval-27",
          text: "A result on one query is a start, not a proof. Run the three presets and the eval set from lesson one. A repair that helps one query and breaks two is a regression.",
        },
        {
          kind: "paragraph",
          id: "p-retrieval-28",
          text: "Write the note while the trace is open. The numbers fade, and the exact order is the evidence.",
        },
      ],
    },
  ],
  checks: [
    {
      id: "check-1",
      prompt: "Which order matches the expected ranking for the query refund policy?",
      options: [
        { id: "option-a", label: "doc-02, doc-07, doc-08" },
        { id: "option-b", label: "doc-07, doc-08, doc-02" },
        { id: "option-c", label: "doc-08, doc-07, doc-02" },
        { id: "option-d", label: "doc-07, doc-02, doc-08" },
      ],
      correctOptionId: "option-b",
      explanation:
        "The refund document holds the query tag and matches both terms, so it ranks first. The return label comes next because it shares the return family, and the billing document only repeats one word.",
    },
    {
      id: "check-2",
      prompt: "A relevant document sits at rank six with k set to three. What happens to that document?",
      options: [
        { id: "option-a", label: "The model still cites it" },
        { id: "option-b", label: "It never reaches the prompt" },
        { id: "option-c", label: "It lowers the cost" },
        { id: "option-d", label: "It fixes the ranking" },
      ],
      correctOptionId: "option-b",
      explanation:
        "Only the top k chunks enter the prompt, so a document below the cut is invisible to the model. The ranking may still hold the document, but the reply cannot cite it.",
    },
    {
      id: "check-3",
      prompt: "A reader asks about one product area, but the index mixes all areas. Which lever removes wrong candidates without extra tokens?",
      options: [
        { id: "option-a", label: "Raise k from three to fifty" },
        { id: "option-b", label: "Add a metadata filter for the product area" },
        { id: "option-c", label: "Add a synonym pair" },
        { id: "option-d", label: "Rewrite every document" },
      ],
      correctOptionId: "option-b",
      explanation:
        "A metadata filter removes candidates before the rank, so the prompt never pays for them. Raising k adds tokens, and a synonym pair fixes wording, not the product area.",
    },
  ],
  task: {
    id: "task-retrieval",
    scope: "Repair the ranking of the support search for one failing query.",
    items: [
      { id: "item-1", label: "Write the failing query and its expected top three documents." },
      { id: "item-2", label: "Print the candidate list from the word search." },
      { id: "item-3", label: "Add one synonym pair to the query terms." },
      { id: "item-4", label: "Give a tag match double weight." },
      { id: "item-5", label: "Run the three preset queries and record the order." },
    ],
    solution: {
      filename: "retrieval/search.py",
      language: "python",
      code: [
        "def terms(query: str) -> set[str]:",
        "    words = set(query.lower().split())",
        '    synonyms = {"refund": "returns"}',
        "    return words | {synonyms[w] for w in words if w in synonyms}",
        "",
        'def score(query: str, doc: dict) -> float:',
        "    words = terms(query)",
        '    tag_hits = len(words & doc["tags"])',
        '    text_hits = sum(1 for w in words if w in doc["text"])',
        "    return 2.0 * tag_hits + 1.0 * text_hits",
      ].join("\n"),
    },
  },
  prove: {
    prompt: "Which query did you repair, and how did the order change?",
    placeholder: "I changed X; the result was Y.",
    maxLength: 280,
    debounceMs: 800,
    savedMessage: "Proof saved on this device.",
  },
  citation:
    "Further reading on retrieval: AI Engineering by Chip Huyen (O'Reilly). This course is independent and reproduces no book text or figures.",
} as const satisfies Lesson);
