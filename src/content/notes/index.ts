import type { Note } from "../types";

/**
 * Native portfolio notes. Each one is written from measured project data.
 * When a note is also published elsewhere, set `externalUrl` and `platform`.
 */
export const notes: Note[] = [
  {
    slug: "max-num-batched-tokens-prefill",
    title: "What max_num_batched_tokens did to a prefill-heavy workload",
    topic: "LLM inference",
    summary: "Raising vLLM's per-step token budget from 8,192 to 20,480 cut P95 time-to-first-token from 39.4 s to 4.9 s on production document prompts, with one caveat about the baseline.",
    platform: "Portfolio note",
    project: "gemma-4-inference",
    blocks: [
      { type: "p", text: "Our self-hosted Gemma 4 31B deployment serves document-processing work: long prompts built from OCR text and schemas, with comparatively short answers. That shape matters more than anything else about the workload. Most of the GPU time goes into prefill, reading the prompt, rather than generating tokens." },
      { type: "h", text: "The setting" },
      { type: "p", text: "In vLLM, max_num_batched_tokens caps how many tokens the scheduler processes in a single step. Prefill tokens from new requests and decode tokens from running ones share that budget. When prompts are long and the budget is small, a request's prefill is spread across many steps, and the request emits nothing until prefill finishes." },
      { type: "h", text: "The run" },
      { type: "p", text: "I replayed production prompts at 25 concurrent requests on vLLM 0.19.1 on an AMD Instinct MI300X, changing only max_num_batched_tokens from 8,192 to 20,480." },
      { type: "metrics", metrics: [
        { label: "TTFT P95", before: 39.4, after: 4.9, unit: "s", better: "lower", decimals: 1, context: "25 concurrent production prompts.", evidence: "benchmark" },
        { label: "TTFT P50", before: 23.9, after: 0.25, unit: "s", better: "lower", decimals: 2, context: "Same run.", evidence: "benchmark" },
        { label: "Output throughput", before: 121, after: 269, unit: "tok/s", better: "higher", context: "Aggregate.", evidence: "benchmark" },
        { label: "Request throughput", before: 0.29, after: 0.64, unit: "req/s", better: "higher", decimals: 2, context: "Same run.", evidence: "benchmark" },
        { label: "ITL P95", before: 414, after: 123, unit: "ms", better: "lower", context: "Same run.", evidence: "benchmark" },
        { label: "End-to-end latency P95", before: 193, after: 164, unit: "s", better: "lower", context: "Same run.", evidence: "benchmark" },
      ] },
      { type: "h", text: "The caveat" },
      { type: "p", text: "The baseline may have included interference from other traffic on the shared serving environment. So the result I can defend is \"in this run, these numbers moved this much\", not \"this flag makes TTFT eight times faster\"." },
      { type: "p", text: "The ITL improvement is the clearest example. A bigger per-step budget can make decode tokens wait behind larger prefill chunks, so worse ITL would not have been surprising. It improved here, and I don't treat that as a general property of the setting." },
      { type: "callout", title: "Takeaway", text: "For a prefill-dominated workload, the per-step token budget is the first setting to examine. Measure with your real prompt distribution, and record what else was running." },
    ],
  },
  {
    slug: "max-num-seqs-tradeoff",
    title: "Raising max_num_seqs: faster first tokens, slower streams",
    topic: "LLM inference",
    summary: "Going from 25 to 64 concurrent sequences cut P95 TTFT from 120 s to 44 s at 100 offered requests, and spent ITL and KV-cache headroom to do it.",
    platform: "Portfolio note",
    project: "gemma-4-inference",
    blocks: [
      { type: "p", text: "max_num_seqs caps how many sequences vLLM runs at once. Requests beyond the cap wait in a queue before their prefill even starts. With 100 offered requests and a cap of 25, that queue was where most of the latency lived: P95 TTFT was 120 seconds." },
      { type: "p", text: "Raising the cap to 64 attacks the queue directly. More requests start sooner, and the GPU batches more decode work per step. It also means every decode step is shared by more sequences, and every running sequence holds KV cache." },
      { type: "metrics", metrics: [
        { label: "TTFT P95", before: 120, after: 44, unit: "s", better: "lower", context: "100 offered requests.", evidence: "benchmark" },
        { label: "Output throughput", before: 273, after: 334, unit: "tok/s", better: "higher", context: "Same run.", evidence: "benchmark" },
        { label: "ITL P95", before: 125, after: 318, unit: "ms", better: "lower", tradeoff: true, context: "Same run.", evidence: "benchmark" },
        { label: "Peak KV-cache use", before: 46, after: 91, unit: "%", better: "lower", tradeoff: true, context: "Same run.", evidence: "benchmark" },
      ] },
      { type: "h", text: "Was it worth it?" },
      { type: "p", text: "For batch document processing, yes. A two-minute wait for the first token stalls the whole pipeline, while a slower stream after that costs comparatively little. For an interactive chat product the answer could easily be the opposite: 318 ms between tokens is noticeable." },
      { type: "p", text: "The KV-cache number is the one to watch. At 91% peak, there is little headroom for longer prompts or a burst of traffic. The setting is right for this workload today, and it is the first thing I would revisit if the prompt distribution changed." },
      { type: "callout", title: "Takeaway", text: "Concurrency settings move cost between metrics; they rarely remove it. Write the cost down next to the gain." },
    ],
  },
  {
    slug: "bottleneck-outside-the-model",
    title: "The bottleneck wasn't in the model server",
    topic: "Systems performance",
    summary: "An observed 120-second queue wait came from concurrency caps in the application and gateway. Raising them took application-level throughput from 221 to 890 tok/s.",
    platform: "Portfolio note",
    project: "gemma-4-inference",
    blocks: [
      { type: "p", text: "PARAKH's document processing was slower than the model server could support. Requests showed a queue wait of around 120 seconds, and application-level throughput sat at 221 tok/s." },
      { type: "p", text: "The model server wasn't the cause. Two limits in front of it were. PARAKH's own processing concurrency was 10, and the API gateway admitted at most 20 concurrent requests. However the model server was configured, it never saw more than that." },
      { type: "list", items: [
        "PARAKH processing concurrency: 10 → 32.",
        "Gateway concurrency cap: 20 → 64.",
      ] },
      { type: "metrics", metrics: [
        { label: "Application-level throughput", before: 221, after: 890, unit: "tok/s", better: "higher", context: "PARAKH document processing.", evidence: "observed" },
      ] },
      { type: "p", text: "The queue wait disappeared and application-level throughput rose about 4×, from changes made entirely outside the model server." },
      { type: "h", text: "Two throughputs" },
      { type: "p", text: "This figure is application-level: tokens per second as PARAKH experiences them, queueing included. It is not the same measurement as model-server output throughput, and the two should never be compared directly." },
      { type: "callout", title: "Takeaway", text: "When latency looks like a model problem, list every queue on the request's path first: worker pools, gateways, connection pools. Then tune the model." },
    ],
  },
  {
    slug: "dense-only-missed-58-fields",
    title: "Dense-only retrieval missed 58 of 196 fields",
    topic: "Retrieval",
    summary: "In a financial-document POC, adding BM25 and reciprocal rank fusion to dense retrieval raised field recall from 70.4% to 91.3%. Re-chunking then cut embedding time from 18 minutes to 210 seconds without losing any of it.",
    platform: "Portfolio note",
    project: "financial-document-intelligence",
    blocks: [
      { type: "p", text: "Financial Document Intelligence extracts a fixed set of fields from annual reports. For each field, retrieval has one job: put the passage containing the value in front of the extraction model. If retrieval misses, extraction cannot succeed." },
      { type: "p", text: "I measured that directly on 196 target fields. With dense-only retrieval, the right passage was retrieved for 138 of them." },
      { type: "metrics", metrics: [
        { label: "Fields retrieved", before: 138, after: 179, unit: "of 196", better: "higher", context: "Dense-only → dense + BM25 + RRF.", evidence: "poc" },
        { label: "Recall", before: 70.4, after: 91.3, unit: "%", better: "higher", decimals: 1, context: "Same field set.", evidence: "poc" },
      ] },
      { type: "h", text: "Fusion without calibration" },
      { type: "p", text: "Dense similarity and BM25 scores live on different scales. Reciprocal rank fusion sidesteps that by using only each passage's rank in each list." },
      { type: "code", language: "python", caption: "Reciprocal rank fusion (k = 60 is the conventional constant)", source: `def rrf(rankings, k=60):
    scores = {}
    for ranking in rankings:
        for rank, doc_id in enumerate(ranking, start=1):
            scores[doc_id] = scores.get(doc_id, 0.0) + 1 / (k + rank)
    return sorted(scores, key=scores.get, reverse=True)` },
      { type: "h", text: "Then, fewer chunks" },
      { type: "p", text: "Embedding preparation took about 18 minutes over roughly 1,985 chunks. After re-chunking to 767 chunks it took 210 seconds, and recall did not change. The extra chunks had been costing time without adding recall." },
      { type: "callout", title: "Scope", text: "These are POC results on one fixed field set. They show what hybrid retrieval did here, not a general accuracy figure." },
    ],
  },
  {
    slug: "llm-reads-code-calculates",
    title: "The LLM reads, code calculates",
    topic: "AI systems design",
    summary: "Two projects, one rule: keep probabilistic model output on one side of a hard boundary and deterministic logic on the other.",
    platform: "Portfolio note",
    project: "financial-document-intelligence",
    blocks: [
      { type: "p", text: "In both Financial Document Intelligence and Finqora, the most important design decision was where the LLM's responsibility ends." },
      { type: "h", text: "FDI: extraction stops at the graph" },
      { type: "p", text: "The LLM fills schema-defined fields from retrieved passages. Those values enter a Financial Object Graph, tagged against a 400+ tag taxonomy and linked to their bounding boxes in the PDF. From that point everything is code: ratios, derived values, validation and XBRL export." },
      { type: "p", text: "So a wrong ratio always traces back to a wrong input value, which traces back to a highlighted region of a page. Nothing in between was generated." },
      { type: "h", text: "Finqora: the assistant consults, it doesn't allocate" },
      { type: "p", text: "Suitability is rule-based and allocation is computed with Decimal arithmetic. The assistant uses function calling with a bounded number of rounds to help users explore. It does not decide or allocate portfolios. Identical inputs always produce identical allocations." },
      { type: "list", items: [
        "Put the boundary where exactness or auditability starts to matter.",
        "Pass typed, validated data across it, not free text.",
        "Bound what happens on the probabilistic side: schemas, tool lists, round limits.",
      ] },
      { type: "callout", title: "Takeaway", text: "LLMs are good at reading messy input. Calculation, allocation and validation belong in code you can test." },
    ],
  },
];

export function getNote(slug: string) {
  return notes.find((n) => n.slug === slug);
}

export function readingMinutes(note: Note) {
  const words = note.blocks
    .map((b) => {
      if (b.type === "p" || b.type === "h") return b.text;
      if (b.type === "list") return b.items.join(" ");
      if (b.type === "callout") return `${b.title} ${b.text}`;
      if (b.type === "code") return b.source;
      return "";
    })
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}
