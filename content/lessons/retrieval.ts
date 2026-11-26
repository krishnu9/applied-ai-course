import type { Lesson } from "@/lib/types";
import { deepFreeze } from "../freeze";

export const retrievalLesson = deepFreeze({
  slug: "retrieval",
  order: 14,
  title: "Retrieval that earns its place",
  chapterId: "ch-06",
  chapterOrder: 6,
  status: "live",
  outcome:
    "You can define retrieval-augmented generation, choose a retrieval design, and prove a ranking repair. Prerequisite: lesson 13, context engineering.",
  artifact:
    "A runnable search.py over the twelve fixed documents, with recall@3 before and after.",
  readingMinutes: 25,
  difficulty: "advanced",
  layerId: "layer-03",
  terms: [
    {
      term: "RAG (retrieval-augmented generation)",
      definition: "Supplying retrieved documents to a model at answer time.",
    },
    {
      term: "index time vs query time",
      definition:
        "The offline build of the search index compared with the online lookup.",
    },
    {
      term: "chunk",
      definition: "A small passage that is indexed and retrieved as one unit.",
    },
    {
      term: "BM25",
      definition:
        "A lexical ranking function that scores term matches with length and frequency limits.",
    },
    {
      term: "ANN (approximate nearest neighbor)",
      definition:
        "A fast search that returns close vectors without checking all of them.",
    },
    {
      term: "RRF (reciprocal rank fusion)",
      definition: "A fusion rule that adds 1/(k + rank) across result lists.",
    },
  ],
  evalCase: {
    id: "case-retrieval",
    brief: "Fix the refund policy ranking and prove recall at k.",
  },
  sections: [
    {
      id: "what-it-is",
      title: "What it is",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "retrieval-p-1",
          text: "Retrieval-augmented generation (RAG) supplies retrieved documents to a model at answer time. The model reads those documents as evidence and writes an answer. Each chunk keeps its source id, so the answer can cite it.",
        },
        {
          kind: "paragraph",
          id: "retrieval-p-2",
          text: "RAG has two phases. Index time builds the search index offline: the pipeline splits documents into chunks, small passages that the index stores as one unit. It turns each chunk into an embedding, a dense vector that represents meaning. It then stores the text, the vector, and the metadata. Query time is the online lookup: the same model embeds the question, and the index returns the closest chunks.",
        },
        {
          kind: "paragraph",
          id: "retrieval-p-3",
          text: "A worked example: a team indexes 200 product manuals. Index time turns each manual into about 40 chunks. A reader asks how to replace a filter. Query time returns five chunks from two manuals, and the model answers with steps and two citations.",
        },
        {
          kind: "paragraph",
          id: "retrieval-p-4",
          text: "A non-example: a search box returns ten links and no answer. The retriever works, but no model reads the text. The product is search, not RAG.",
        },
      ],
    },
    {
      id: "explain-it-simply",
      title: "A library with three helpers",
      register: "eli5",
      blocks: [
        {
          kind: "analogy",
          id: "retrieval-analogy-1",
          text: "Think of a library with three helpers. The first helper searches the card catalog for the exact words on your note. The second helper walks the shelves and brings books that feel related to your topic. A third helper reads the shortlist and picks the few books that answer the question. The first helper is BM25, the second is dense retrieval, and the third is the reranker: precise, paraphrase-aware, and careful.",
          breaks:
            "A library holds complete books, while a retrieval index holds small chunks. A chunk can match the words and still lack the sentence that answers the question.",
        },
        {
          kind: "paragraph",
          id: "retrieval-p-6",
          text: "Prediction: your note says late parcel. Which helper finds a chapter titled Delayed deliveries, and which helper ranks the final shortlist? Say which helper finds it, and why, before you read on.",
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
          id: "retrieval-p-7",
          text: "The pipeline has an offline half and an online half. The offline half builds two indexes. The online half reads them, fuses the results, and cuts the list.",
        },
        {
          kind: "list",
          id: "retrieval-list-1",
          ordered: true,
          items: [
            "Split each document into chunks at index time. Keep the document id, the chunk text, and the metadata.",
            "Embed every chunk with one pinned embedding model. Store the vector beside its source id.",
            "Build two indexes: an inverted index for BM25, and a vector index for dense retrieval.",
            "Normalize the query, then run BM25 and dense retrieval in parallel.",
            "Fuse the two ranked lists with reciprocal rank fusion.",
            "Rerank the shortlist with a model that reads the query and each candidate together.",
            "Cut the list to top-k, put the chunks in the prompt, and require a source id for each claim.",
          ],
        },
        {
          kind: "paragraph",
          id: "retrieval-p-8",
          text: "TF-IDF is the earlier lexical weighting idea: it multiplies term frequency by inverse document frequency. BM25 is the lexical ranker that adds saturation and length normalization to that idea. It scores a chunk by the query terms it contains, and it limits the gain from a repeated term. It also divides by chunk length, so a long chunk cannot win by size alone. The constants k1 and b control saturation and length correction. Typical values are k1 = 1.5 and b = 0.75. Take a rare term that appears in 2 of 100 chunks. It earns a high weight. A chunk with two hits beats a chunk with one hit, but the gain flattens. A short chunk with one hit beats a long chunk with one hit.",
        },
        {
          kind: "paragraph",
          id: "retrieval-p-9",
          text: "A chunk of 200 to 500 tokens is common. A 10 to 20 percent overlap keeps a sentence whole across a boundary. Overlap stores duplicate text, so remove near-identical chunks before the prompt grows. Metadata travels with each chunk: product area, language, date, and access level. The rank can use the metadata, and the caller can filter on it.",
        },
        {
          kind: "paragraph",
          id: "retrieval-p-10",
          text: "An embedding is a dense vector that represents meaning. Dense retrieval compares the query vector with chunk vectors by cosine similarity. A corpus of millions of chunks makes an exact scan too slow. ANN (approximate nearest neighbor) search often walks a graph of nearby vectors and returns close results without checking all of them. A graph index starts at an entry point and walks to closer neighbors. The search width controls how many candidates it keeps; a wider search raises recall and latency.",
        },
        {
          kind: "paragraph",
          id: "retrieval-p-11",
          text: "Hybrid retrieval runs BM25 and dense retrieval together. BM25 catches names, codes, and rare words. Dense retrieval catches paraphrase and synonyms. The two lists use different score scales, so RRF (reciprocal rank fusion) combines ranks, not raw scores. For each document, RRF adds 1/(k + rank) across the lists; k is usually 60. A document that ranks well in both lists wins.",
        },
        {
          kind: "paragraph",
          id: "retrieval-p-12",
          text: "A small example shows the rule. Doc-A ranks 1 in BM25 and 4 in dense. Doc-B ranks 3 in both lists. With k = 60, doc-A scores 1/61 + 1/64 = 0.0320, and doc-B scores 1/63 + 1/63 = 0.0317. Doc-A wins, because one first place outweighs two middle places.",
        },
        {
          kind: "paragraph",
          id: "retrieval-p-13",
          text: "A reranker is a second model that scores the query and one candidate together. It is more accurate than either first pass and slower, because it makes one call per candidate. A cross-encoder reads the pair token by token. It cannot precompute a chunk vector, so the cost grows with the candidate count. The usual pattern retrieves 50 candidates, reranks them, and keeps 5. Top-k is the cut that sends chunks to the prompt. Recall@k is the share of relevant chunks inside that cut. If the corpus holds 5 relevant chunks and the top 5 results contain 3 of them, recall@5 is 0.6.",
        },
        {
          kind: "paragraph",
          id: "retrieval-p-14",
          text: "Freshness is a pipeline property. A policy edit needs an incremental upsert, not a monthly rebuild. Keep a review date in the metadata and filter out expired chunks. Access control is a filter, not a rank. A document the reader may not see must leave the candidate list before the model reads it. The citation is also a pipeline property: the chunk text travels with its document id, and the output check rejects a claim without one.",
        },
        {
          kind: "paragraph",
          id: "retrieval-p-14b",
          text: "RAG beyond text covers images, tables and SQL. A multimodal retriever embeds an image or a page layout as a vector, so a query can return a diagram or a scanned form. A text-only prompt cannot read a chart, so keep the caption and the image id with the vector. A table needs a schema and row-level chunks. Keep the header on every chunk and store the table id. A text-to-SQL step reads the schema, writes a query and returns rows, not passages. The answer must cite the table and the filter, and a wrong join is a retrieval fault. The same recall and citation checks apply.",
        },
        {
          kind: "table",
          id: "retrieval-table-1",
          columns: ["Stage", "Input", "Output"],
          rows: [
            [
              "Index time",
              "Documents, chunk rule, embedding model",
              "Inverted index, vector index, chunk store",
            ],
            [
              "Query time",
              "Question, filters, k",
              "Ranked chunks with source ids",
            ],
            [
              "Answer",
              "Top-k chunks, question, output contract",
              "Answer with citations",
            ],
          ],
          caption: "Inputs and outputs at each stage.",
        },
        {
          kind: "diagram",
          id: "retrieval-diagram-1",
          variant: "flow",
          spec: {
            nodes: [
              { id: "query", label: "Question" },
              { id: "bm25", label: "BM25" },
              { id: "dense", label: "Dense ANN" },
              { id: "fusion", label: "RRF" },
              { id: "rerank", label: "Rerank" },
              { id: "topk", label: "Top-k" },
              { id: "cite", label: "Cite" },
            ],
            edges: [
              ["query", "bm25"],
              ["query", "dense"],
              ["bm25", "fusion"],
              ["dense", "fusion"],
              ["fusion", "rerank"],
              ["rerank", "topk"],
              ["topk", "cite"],
            ],
          },
          caption:
            "BM25 and dense retrieval run in parallel; RRF merges them, rerank orders the list, and top-k chunks keep source ids.",
          alt: "Flow from a question to BM25 and dense retrieval, then RRF, rerank, a top-k cut, and a cited source.",
        },
        {
          kind: "paragraph",
          id: "retrieval-p-15",
          text: "Every stage is a trade. A larger k raises recall and adds tokens, cost, and noise. A reranker raises precision and adds latency per candidate. Hybrid retrieval raises recall and adds a second index and its cost. The budget decides each value.",
        },
      ],
    },
    {
      id: "explain-it-simply-again",
      title: "A hiring shortlist",
      register: "eli5",
      blocks: [
        {
          kind: "analogy",
          id: "retrieval-analogy-2",
          text: "Think of a hiring process. A keyword filter reads each application for the exact skills in the job post. A recruiter reads for fit and adds people with related experience. A senior interviewer then speaks with the shortlist and ranks the final few. The keyword filter is BM25, the recruiter is dense retrieval, and the senior interviewer is the reranker: cheap, broad, and careful.",
          breaks:
            "A hiring decision needs judgment and a person, while fusion and reranking use fixed rules and scores. A chunk that ranks first is not a person who will succeed.",
        },
        {
          kind: "paragraph",
          id: "retrieval-p-16",
          text: "Prediction: the post says Kubernetes and a candidate writes container orchestration. Which pass finds the candidate, and which pass ranks the shortlist?",
        },
      ],
    },
    {
      id: "where-it-breaks",
      title: "Where it breaks",
      register: "standard",
      blocks: [
        {
          kind: "table",
          id: "retrieval-table-2",
          columns: ["Symptom", "Cause", "Check", "Fix"],
          rows: [
            [
              "The answer ignores a relevant document",
              "The chunk sits below top-k",
              "Print the candidate list and recall@k",
              "Raise k or repair the cut",
            ],
            [
              "A paraphrase question misses the answer",
              "The first pass is lexical only",
              "Compare the BM25 list with the dense list",
              "Add dense retrieval and fuse with RRF",
            ],
            [
              "The answer cites an outdated rule",
              "A stale chunk ranks high",
              "Read the chunk date and version",
              "Filter by date or reindex the source",
            ],
            [
              "The prompt fills with near-duplicate chunks",
              "Chunk overlap is too large",
              "Count duplicate texts in top-k",
              "Dedupe and reduce the overlap",
            ],
          ],
          caption: "Four failures, from the cut back to the index.",
        },
        {
          kind: "paragraph",
          id: "retrieval-p-17",
          text: "Retrieval is a cost decision, not a quality switch. A reranker and a larger k both raise quality on some queries and add latency on every query. A cheaper first pass with a reranker often beats a larger k, because the reranker reads each candidate in full. Set a recall target and a latency budget first, then choose the cheapest design that meets both. RAG earns its place when the corpus is large, changes often, or needs citations; a small static corpus fits in the prompt.",
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
          id: "retrieval-p-18",
          text: "The support assistant answers from twelve fixed documents. A reader asks about the refund policy. The expected order is doc-07, doc-08, then doc-02, with fixed scores 0.91, 0.74, and 0.61.",
        },
        {
          kind: "paragraph",
          id: "retrieval-p-19",
          text: "The broken pipeline runs BM25 on body text only and ignores the dense list. BM25 sees the word policy in doc-02, the billing document, and returns it first. The tokenizer does not stem, so the refund document, which says refunds, not refund, scores zero in that pass. The top three become doc-02, doc-01, and doc-03, and recall@3 is 1/3.",
        },
        {
          kind: "paragraph",
          id: "retrieval-p-20",
          text: "The trace shows the layer. The index holds the right text, and the fixed dense scores put doc-07 first. The break is the lexical-only first pass and the missing synonym. The team adds refund to returns, gives a tag match a bonus of 2.0, and fuses the lists with RRF. The top three become doc-07, doc-08, doc-02, and recall@3 is 3/3. The reply can now cite the refund document. If the reply still fails, the next check is the generator, not the retriever.",
        },
      ],
    },
    {
      id: "rank-the-candidates",
      title: "Rank the candidates yourself",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "retrieval-p-21",
          text: "Run the fixed refund policy query. The single control sets the word-overlap weight. The score is a simplified word-overlap score, not BM25. At 0.0 the fixed dense scores hold doc-07 first. At 1.0 doc-02 rises, because doc-02 matches policy and the weight favors the lexical score. Watch the order.",
        },
        {
          kind: "interactive",
          id: "retrieval-interactive-1",
          widget: "rag-rank-lab",
          caption:
            "Move the word-overlap weight on the fixed refund policy query and watch the ranking change.",
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
          id: "retrieval-p-22",
          text: "Answer four questions on the mechanism, the design choice, the failure, and the metric.",
        },
        { kind: "check", id: "retrieval-check-1", checkId: "check-1" },
        { kind: "check", id: "retrieval-check-2", checkId: "check-2" },
        { kind: "check", id: "retrieval-check-3", checkId: "check-3" },
        { kind: "check", id: "retrieval-check-4", checkId: "check-4" },
      ],
    },
    {
      id: "evaluation-task",
      title: "Evaluation task",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "retrieval-p-23",
          text: "Use the twelve fixed documents and the three fixed presets. Build one script that prints the candidates, repairs the rank, and reports recall@3. Tick each step when its output is visible.",
        },
        { kind: "task", id: "task-retrieval" },
      ],
    },
    {
      id: "prove-the-change",
      title: "Prove the change",
      register: "standard",
      blocks: [
        {
          kind: "paragraph",
          id: "retrieval-p-24",
          text: "The proof note has three parts: the query, the old order, and the new order. Name the layer and the rule you changed. Give a fixed number, such as recall@3 before and after. Name one query where the change does not help. Write the note while the trace is open. The exact order is the evidence, and the numbers fade.",
        },
        {
          kind: "paragraph",
          id: "retrieval-p-25",
          text: "Self-rubric: mechanism names the layer and the rule; evidence gives a fixed number or order; limit names one blind spot or failed case.",
        },
        {
          kind: "note",
          id: "retrieval-note-1",
          text: "A note that starts from the failing order is easier to verify than a note that starts from the fix.",
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
          id: "retrieval-interview-1",
          items: [
            {
              question: "What is RAG, and which two phases does it have?",
              answer:
                "RAG (retrieval-augmented generation) supplies retrieved documents to a model at answer time. Index time builds chunks, embeddings, and the BM25 and ANN indexes. Query time retrieves and fuses candidates, then reranks them and puts the top-k chunks in the prompt. Every claim must carry the document id of its chunk.",
            },
            {
              question:
                "When do you choose hybrid retrieval over dense retrieval alone?",
              answer:
                "Choose hybrid retrieval when the corpus holds exact names, codes, or rare terms that an embedding can blur. BM25 finds those tokens, and dense retrieval finds paraphrase; RRF merges the two lists without score calibration. Dense retrieval alone is simpler when the vocabulary is stable and queries use natural language.",
            },
            {
              question: "How does retrieval fail, and what do you check first?",
              answer:
                "Retrieval fails when the relevant chunk is absent or below top-k, or when a stale chunk outranks a fresh one. Check the candidate dump and recall@k before you edit the prompt. If the chunk is absent from both lists, inspect the index; if it is present and ranked low, inspect fusion and the reranker.",
            },
            {
              question: "How does retrieval change at 10x traffic or corpus size?",
              answer:
                "At 10x corpus size, an exact vector scan is too slow, so ANN search and index shards carry the load. At 10x traffic, cache frequent queries and precompute embeddings, because the embedding call and the reranker dominate latency. Track p95 latency, index build time, and recall@k together; a faster index that loses recall is not a win. Budget the reranker call separately, because its cost grows with the candidate count.",
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
      prompt: "Which sentence defines hybrid retrieval?",
      options: [
        { id: "option-a", label: "It stores each chunk in two separate indexes." },
        {
          id: "option-b",
          label: "It combines a lexical ranked list and a dense ranked list.",
        },
        { id: "option-c", label: "It replaces the index with a reranker." },
        { id: "option-d", label: "It reads every document at query time." },
      ],
      correctOptionId: "option-b",
      explanation:
        "Hybrid retrieval runs BM25 and dense retrieval and merges their results. A second index or a reranker changes one part, but neither combines the two lists.",
    },
    {
      id: "check-2",
      kind: "apply",
      prompt:
        "A catalog has exact part codes and free-text complaints. Which design fits best?",
      options: [
        { id: "option-a", label: "BM25 only" },
        { id: "option-b", label: "Dense only" },
        {
          id: "option-c",
          label: "BM25 and dense retrieval, fused with RRF, then reranked",
        },
        { id: "option-d", label: "A larger top-k with no fusion" },
      ],
      correctOptionId: "option-c",
      explanation:
        "BM25 catches the exact codes, and dense retrieval catches the complaints; RRF merges the lists. One retriever alone misses half of the query types, and a larger k only adds noise.",
    },
    {
      id: "check-3",
      kind: "diagnose",
      prompt:
        "A relevant chunk sits at rank 6 while k is 3. What happens to that chunk?",
      options: [
        { id: "option-a", label: "The reranker cites it" },
        { id: "option-b", label: "It never reaches the prompt" },
        { id: "option-c", label: "It lowers the query cost" },
        { id: "option-d", label: "It changes the embedding" },
      ],
      correctOptionId: "option-b",
      explanation:
        "The top-k cut passes only three chunks to the prompt, so rank 6 is invisible to the model. The index still holds the chunk, but the answer cannot cite it.",
    },
    {
      id: "check-4",
      kind: "calculate",
      prompt:
        "The corpus holds 5 relevant chunks. The top 5 results contain 3 of them. What is recall@5?",
      options: [
        { id: "option-a", label: "0.3" },
        { id: "option-b", label: "0.5" },
        { id: "option-c", label: "0.6" },
        { id: "option-d", label: "1.0" },
      ],
      correctOptionId: "option-c",
      explanation:
        "Recall@k divides the relevant chunks found by all relevant chunks, so 3/5 is 0.6. A value of 0.3 would mean only 3 of 10 relevant chunks, and 1.0 needs all five.",
    },
  ],
  task: {
    id: "task-retrieval",
    scope:
      "Repair the refund-policy ranking on the fixed corpus and prove recall@3.",
    items: [
      {
        id: "item-1",
        label: "Write the failing query and its expected top three documents.",
      },
      {
        id: "item-2",
        label: "Print the BM25 and dense candidate lists before fusion.",
      },
      {
        id: "item-3",
        label: "Add one synonym pair and give a tag match a bonus of 2.0.",
      },
      {
        id: "item-4",
        label: "Report recall@3 before and after on all three presets.",
      },
      {
        id: "item-5",
        label: "Apply the rule to the billing preset and state whether the order holds.",
      },
    ],
    solution: {
      filename: "retrieval/search.py",
      language: "python",
      code: [
        "import math",
        "import re",
        "",
        "DOCS = {",
        '    "doc-01": ("Account recovery", {"account", "sign-in", "security"},',
        '               "Use the sign-in page to reset a password. A recovery code or a verified email opens the account. Support never asks for a password."),',
        '    "doc-02": ("Billing cycles", {"billing", "invoice", "payments"},',
        '               "Billing runs on a monthly cycle from the signup date. The billing policy sets the cycle and the invoice date. A failed charge retries after three days."),',
        '    "doc-03": ("Payment methods", {"payments", "cards", "retries"},',
        '               "The account stores one default card. A declined payment retries twice before the order pauses. Update the card from the billing page."),',
        '    "doc-04": ("Shipping options", {"shipping", "tracking", "delivery"},',
        '               "Standard shipping takes three to five working days. Express shipping takes one to two days. The tracking link appears on the order page."),',
        '    "doc-05": ("Late deliveries", {"delivery", "delays", "support"},',
        '               "A parcel counts as late after the delivery window closes. The order page shows the last tracking event. Open a support request when tracking stops for two days."),',
        '    "doc-06": ("Orders and changes", {"orders", "changes", "support"},',
        '               "An order accepts changes until the packing step starts. Address and item changes use the order page. A packed order needs a return instead."),',
        '    "doc-07": ("Refunds and returns", {"refunds", "returns", "policy"},',
        '               "Refunds are available within 30 days of delivery. The item must be unused and in the original packaging. Start a return from the order page."),',
        '    "doc-08": ("Return labels", {"labels", "returns", "shipping"},',
        '               "A return label is free for returns and exchanges. Print the label or show the code at a drop-off point. The label expires after 14 days."),',
        '    "doc-09": ("Plans and seats", {"plans", "billing", "seats"},',
        '               "A plan sets the seat count and the monthly price. Add a seat from the team page and the invoice adjusts at the next cycle. Removed seats stay active until the cycle ends."),',
        '    "doc-10": ("Customs and import fees", {"customs", "fees", "shipping"},',
        '               "Customs fees depend on the destination country. The carrier collects the fee before delivery. The order total does not include these fees."),',
        '    "doc-11": ("Warranty and repairs", {"warranty", "repairs", "support"},',
        '               "A warranty claim needs the order number and a photo of the fault. Repair takes up to ten working days. Support sends a prepaid label for the return."),',
        '    "doc-12": ("Contact and hours", {"contact", "support", "hours"},',
        '               "Support answers chat from 08:00 to 20:00 on working days. Email replies arrive within one working day. The help centre lists the phone line for urgent orders."),',
        "}",
        "",
        "DENSE = {",
        '    "refund policy": [("doc-07", 0.91), ("doc-08", 0.74), ("doc-02", 0.61)],',
        '    "billing": [("doc-02", 0.88), ("doc-03", 0.79), ("doc-09", 0.63)],',
        '    "late delivery": [("doc-05", 0.92), ("doc-04", 0.70), ("doc-10", 0.55)],',
        "}",
        "",
        "EXPECTED = {",
        '    "refund policy": ["doc-07", "doc-08", "doc-02"],',
        '    "billing": ["doc-02", "doc-03", "doc-09"],',
        '    "late delivery": ["doc-05", "doc-04", "doc-10"],',
        "}",
        "",
        'SYNONYMS = {"refund": "returns"}',
        "K1, B, RRF_K = 1.5, 0.75, 60",
        "",
        "",
        "def tokens(text):",
        '    return re.findall(r"[a-z0-9]+", text.lower())',
        "",
        "",
        "BODY = {doc_id: tokens(text) for doc_id, (_, _, text) in DOCS.items()}",
        "ALL = {",
        '    doc_id: tokens(title + " " + " ".join(tags) + " " + text)',
        "    for doc_id, (title, tags, text) in DOCS.items()",
        "}",
        "N = len(DOCS)",
        "",
        "",
        "def idf(term, corpus):",
        "    df = sum(1 for words in corpus.values() if term in words)",
        "    return math.log((N - df + 0.5) / (df + 0.5) + 1)",
        "",
        "",
        "def bm25(query, doc_id, use_all_fields):",
        "    corpus = ALL if use_all_fields else BODY",
        "    words = corpus[doc_id]",
        "    avgdl = sum(len(items) for items in corpus.values()) / len(corpus)",
        "    total = 0.0",
        "    for term in query:",
        "        freq = words.count(term)",
        "        if freq == 0:",
        "            continue",
        "        norm = 1 - B + B * len(words) / avgdl",
        "        total += idf(term, corpus) * (freq * (K1 + 1)) / (freq + K1 * norm)",
        "    return total",
        "",
        "",
        "def terms(query):",
        "    words = set(tokens(query))",
        "    return words | {SYNONYMS[w] for w in words if w in SYNONYMS}",
        "",
        "",
        "def lexical_before(query):",
        "    query_terms = set(tokens(query))",
        "    rows = [(bm25(query_terms, doc_id, False), doc_id) for doc_id in DOCS]",
        "    return [doc_id for score, doc_id in sorted(rows, key=lambda row: (-row[0], row[1]))]",
        "",
        "",
        "def lexical_after(query):",
        "    query_terms = terms(query)",
        "    rows = []",
        "    for doc_id, (_, tags, _) in DOCS.items():",
        "        score = bm25(query_terms, doc_id, True) + 2.0 * len(query_terms & tags)",
        "        rows.append((score, doc_id))",
        "    return [doc_id for score, doc_id in sorted(rows, key=lambda row: (-row[0], row[1]))]",
        "",
        "",
        "def fuse(lexical, dense):",
        "    scores = {}",
        "    dense_rank = {doc_id: rank for rank, (doc_id, _) in enumerate(dense, 1)}",
        "    for rank, doc_id in enumerate(lexical, 1):",
        "        scores[doc_id] = scores.get(doc_id, 0.0) + 1 / (RRF_K + rank)",
        "    for rank, (doc_id, _) in enumerate(dense, 1):",
        "        scores[doc_id] = scores.get(doc_id, 0.0) + 1 / (RRF_K + rank)",
        "    key = lambda doc_id: (-scores[doc_id], dense_rank.get(doc_id, 99), doc_id)",
        "    return sorted(scores, key=key)",
        "",
        "",
        "def recall_at_k(ranked, relevant, k):",
        "    return len(set(ranked[:k]) & set(relevant)) / len(relevant)",
        "",
        "",
        "def show(query):",
        "    before = lexical_before(query)[:3]",
        "    after = fuse(lexical_after(query), DENSE[query])[:3]",
        '    print("query: " + query)',
        '    print("  expected: " + " ".join(EXPECTED[query]))',
        '    print("  before:   " + " ".join(before) + "  recall@3 " + format(recall_at_k(before, EXPECTED[query], 3), ".2f"))',
        '    print("  after:    " + " ".join(after) + "  recall@3 " + format(recall_at_k(after, EXPECTED[query], 3), ".2f"))',
        "",
        "",
        'print("candidate dump")',
        'print("  BM25 lexical: " + " ".join(lexical_before("refund policy")[:5]))',
        'print("  dense ANN:    " + " ".join(doc_id for doc_id, _ in DENSE["refund policy"]))',
        "print()",
        "before_scores = []",
        "after_scores = []",
        "for query in DENSE:",
        "    show(query)",
        "    before_scores.append(recall_at_k(lexical_before(query)[:3], EXPECTED[query], 3))",
        "    after_scores.append(recall_at_k(fuse(lexical_after(query), DENSE[query])[:3], EXPECTED[query], 3))",
        "print()",
        'print("mean recall@3 before " + format(sum(before_scores) / 3, ".2f"))',
        'print("mean recall@3 after  " + format(sum(after_scores) / 3, ".2f"))',
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
