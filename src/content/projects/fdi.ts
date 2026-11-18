import type { Project } from "../types";

export const fdi: Project = {
  slug: "financial-document-intelligence",
  title: "Financial Document Intelligence",
  shortTitle: "Financial Document Intelligence",
  subtitle:
    "A 22-stage pipeline that turns listed-company annual reports into traceable financial data. The LLM is allowed to read; only deterministic code is allowed to calculate.",
  category: "Independent AI systems project",
  status: "Independent POC",
  role: "Sole architect and developer",
  featured: true,
  order: 4,
  glyph: "fdi",
  focus: ["document", "retrieval", "backend"],
  card: {
    problem: "Annual reports bury financial statements in multi-page tables, footnotes and inconsistent layouts.",
    solution: "A content-addressed processing DAG with hybrid retrieval, schema-driven extraction, deterministic ratios and bounding-box provenance.",
    impact: "Hybrid retrieval raised field recall from 70.4% to 91.3% (138 → 179 of 196 fields) on the POC test set.",
  },
  techSummary: ["Python", "Celery", "RabbitMQ", "Azure Document Intelligence", "BM25 + embeddings", "Next.js", "Docker Compose"],

  overview: [
    "Annual reports of listed companies hold structured financial data in an unstructured form. Statements run across pages, tables carry multi-level headers, and the number that matters is often qualified by a footnote three pages later.",
    "FDI is an independent proof of concept I designed and built alone. It converts annual reports into a Financial Object Graph: every extracted value is tagged against a 400+ tag taxonomy and linked back to its exact location in the PDF. Calculations, ratios and validation run deterministically on that graph, and the result can be exported as XBRL.",
    "The central design rule is a hard boundary. The LLM extracts values, which is probabilistic work. Everything after extraction — arithmetic, ratios, validation — is deterministic code.",
  ],

  problem: {
    context: [
      "Financial values in annual reports are not independent facts. They add up to totals, carry over between statements, and change meaning with their units and footnotes. An extraction pipeline that gets each value right in isolation can still produce a set of numbers that doesn't reconcile.",
      "Anyone using the output needs to check where a number came from. An extracted value with no source location is not usable for financial work.",
    ],
    who: "Analysts and systems that need structured, checkable financial data from annual reports.",
    why: "Manual extraction is slow. Unverifiable automated extraction is risky.",
    functional: [
      "Ingest annual-report PDFs and OCR them.",
      "Reconstruct tables, including those split across pages.",
      "Extract financial values into a taxonomy-tagged graph.",
      "Compute ratios and run validation deterministically.",
      "Export XBRL, and show each value's source region in a PDF viewer.",
    ],
    nonFunctional: [
      "Traceability: every value links back to its bounding box.",
      "Reproducibility: re-running unchanged inputs gives the same outputs.",
      "Calculations never depend on LLM output beyond the extracted inputs.",
    ],
    constraints: ["Built and run by one person, packaged with Docker Compose."],
  },

  contribution: {
    designed: ["The entire architecture: DAG, graph model, taxonomy integration, retrieval design and provenance model."],
    implemented: ["All pipeline stages, the retrieval experiment and the Next.js provenance viewer."],
    dependencies: ["Azure Document Intelligence for OCR.", "An external LLM API for schema-driven extraction."],
  },

  architecture: {
    intro: [
      "The pipeline is a 22-stage, content-addressed DAG orchestrated by Celery on RabbitMQ. Each stage's output is keyed by a hash of its inputs, so an unchanged input never recomputes a stage.",
      "The diagram groups the main stages by the kind of work they do. The upper band is where probabilistic components (retrieval, the LLM) operate. The lower band is fully deterministic.",
    ],
    diagram: {
      id: "fdi-dag",
      title: "Annual report to financial graph",
      caption: "Main stages of the 22-stage DAG. The LLM's output crosses into the deterministic band once, as tagged values. Nothing flows back.",
      width: 1000,
      height: 470,
      groups: [
        { label: "Probabilistic: retrieval and LLM extraction", x: 638, y: 40, w: 356, h: 120 },
        { label: "Deterministic: graph, calculations, validation, export", x: 310, y: 245, w: 684, h: 120 },
      ],
      nodes: [
        { id: "pdf", label: "Annual report", sub: "PDF", x: 15, y: 72, w: 130, kind: "source", step: 1, detail: "A listed company's annual report as a PDF." },
        { id: "ocr", label: "OCR", sub: "Azure Doc. Intelligence", x: 165, y: 72, w: 145, kind: "process", step: 2, detail: "Text, layout and table cells with page coordinates, which everything downstream keeps for provenance." },
        { id: "norm", label: "Normalisation", x: 330, y: 72, w: 135, kind: "process", step: 3, detail: "Builds a consistent document representation from the raw OCR output." },
        { id: "tables", label: "Table rebuild", sub: "multi-page merge", x: 485, y: 72, w: 140, kind: "process", step: 4, detail: "Merges tables split across pages and recovers multi-level headers and cell spans." },
        { id: "retrieval", label: "Hybrid retrieval", sub: "dense + BM25 + RRF", x: 655, y: 72, w: 150, kind: "process", step: 5, detail: "Finds the passages relevant to each target field. Dense and BM25 rankings are fused with reciprocal rank fusion." },
        { id: "extract", label: "LLM extraction", sub: "schema-driven", x: 825, y: 72, w: 155, kind: "model", step: 6, detail: "Fills schema-defined fields from retrieved passages. This is the only probabilistic step that produces values." },
        { id: "fog", label: "Financial Object Graph", sub: "400+ tag taxonomy", x: 815, y: 277, w: 165, kind: "store", step: 7, detail: "Extracted values as taxonomy-tagged nodes, each carrying its source page and bounding box." },
        { id: "calc", label: "Calculations", sub: "ratios, deterministic", x: 650, y: 277, w: 145, kind: "process", step: 8, detail: "Derived values and financial ratios computed in code from graph values. No LLM involvement." },
        { id: "valid", label: "Validation", x: 490, y: 277, w: 140, kind: "control", step: 9, detail: "Deterministic checks over the graph before export." },
        { id: "xbrl", label: "XBRL export", x: 330, y: 277, w: 140, kind: "api", step: 10, detail: "Standards-based export of the validated graph." },
        { id: "viewer", label: "Provenance viewer", sub: "Next.js, bounding boxes", x: 15, y: 380, w: 190, kind: "app", detail: "Click a value, see the exact region of the PDF it came from." },
      ],
      edges: [
        { from: "pdf", to: "ocr" },
        { from: "ocr", to: "norm" },
        { from: "norm", to: "tables" },
        { from: "tables", to: "retrieval" },
        { from: "retrieval", to: "extract" },
        { from: "extract", to: "fog", fromSide: "b", toSide: "t", label: "tagged values" },
        { from: "fog", to: "calc", fromSide: "l", toSide: "r" },
        { from: "calc", to: "valid", fromSide: "l", toSide: "r" },
        { from: "valid", to: "xbrl", fromSide: "l", toSide: "r" },
        { from: "fog", to: "viewer", fromSide: "b", toSide: "r", label: "provenance" },
        { from: "viewer", to: "pdf", fromSide: "t", toSide: "b", kind: "control", label: "bounding boxes" },
      ],
    },
    notes: [
      {
        title: "Provenance end to end",
        body: "Page coordinates from OCR are carried through normalisation, table reconstruction and extraction. Every value in the graph knows its page and bounding box, which is what the viewer uses to highlight the source.",
      },
    ],
  },

  decisions: [
    {
      title: "LLMs extract, code calculates",
      context: "Financial ratios and totals must be exact and reproducible. LLM output is neither guaranteed.",
      choice: "Restrict the LLM to schema-driven extraction. Compute all derived values and run all validation deterministically over the Financial Object Graph.",
      rationale: [
        "A ratio computed in code from tagged inputs is exact and repeatable.",
        "Errors are localised: a wrong ratio traces to a wrong extracted input, not to an opaque generation.",
        "Validation can check extracted values against each other in code.",
      ],
      tradeoffs: [
        "Needs an explicit graph model and taxonomy mapping up front.",
        "Every calculation has to be written and maintained by hand.",
      ],
    },
    {
      title: "A content-addressed DAG",
      context: "Twenty-two stages over large PDFs are slow to re-run, and iterating on one stage shouldn't recompute the others.",
      choice: "Key every stage's output by a hash of its inputs and orchestrate stages with Celery on RabbitMQ.",
      rationale: [
        "Unchanged inputs skip recomputation, so iterating on a late stage is cheap.",
        "The same inputs always map to the same artefacts, which makes runs reproducible.",
      ],
      tradeoffs: [
        "Intermediate artefacts take storage.",
        "Correctness depends on hashing every input that affects a stage, including configuration.",
      ],
    },
    {
      title: "Hybrid retrieval over dense-only",
      context: "Dense-only retrieval found the right passage for 138 of 196 target fields.",
      choice: "Add BM25 alongside dense retrieval and fuse the two rankings with reciprocal rank fusion (RRF).",
      rationale: [
        "Measured on the POC field set: recall rose from 70.4% to 91.3%.",
        "RRF combines rankings by rank position, so the two scorers' scores never need calibrating against each other.",
      ],
      tradeoffs: ["Two indexes to build and keep in sync.", "17 of 196 fields were still missed."],
    },
  ],

  challenges: [
    {
      title: "Tables that span pages",
      problem: "Financial statements routinely continue across pages. OCR returns each page's fragment as a separate table, with headers sometimes repeated and sometimes missing.",
      solution: "A table-reconstruction stage that scores candidate merges on structure, content, position, style and gap signals, then recovers multi-level headers and cell spans in the merged table.",
      outcome: "Downstream stages see logical tables instead of page fragments. The merge weights are tunable constants and are not yet calibrated against a broad set of real reports.",
    },
    {
      title: "Dense retrieval missed 58 of 196 fields",
      problem: "With dense-only retrieval, the passage holding the target value was not retrieved for 58 of 196 fields (70.4% recall).",
      diagnosis: "Measured field-level recall on a fixed set of 196 target fields.",
      solution: "Added BM25 and fused rankings with reciprocal rank fusion.",
      outcome: "Recall rose to 179 of 196 (91.3%), recovering 41 of the 58 misses.",
    },
    {
      title: "Embedding preparation took about 18 minutes",
      problem: "Preparing embeddings for a document took about 18 minutes across roughly 1,985 chunks, too slow to iterate on.",
      solution: "Re-chunked the document representation, reducing it to 767 chunks.",
      outcome: "Embedding preparation dropped to 210 seconds and recall was unchanged.",
    },
  ],

  implementation: [
    {
      title: "Orchestration",
      body: [
        "Celery workers consume stage tasks from RabbitMQ. Each stage reads input artefacts by content hash and writes its outputs under a new hash, so the DAG can resume or partially re-run without bookkeeping beyond the hashes.",
      ],
    },
    {
      title: "Extraction and the graph",
      body: [
        "For each schema field, hybrid retrieval selects candidate passages and the LLM fills the field. Values enter the Financial Object Graph tagged against a taxonomy of more than 400 tags, with source page and bounding box attached.",
      ],
    },
    {
      title: "Deterministic layer",
      body: [
        "Ratios and derived values are computed in code from graph nodes, then validated before XBRL export. The LLM has no role after extraction.",
      ],
    },
    {
      title: "Reciprocal rank fusion",
      body: ["RRF scores each passage by its rank in each list, so dense and BM25 scores never need to be on the same scale."],
      code: {
        language: "python",
        caption: "Reciprocal rank fusion, the standard formulation (k = 60 is the conventional constant)",
        source: `def rrf(rankings: list[list[str]], k: int = 60) -> list[str]:
    scores: dict[str, float] = {}
    for ranking in rankings:            # e.g. [dense_ids, bm25_ids]
        for rank, doc_id in enumerate(ranking, start=1):
            scores[doc_id] = scores.get(doc_id, 0.0) + 1.0 / (k + rank)
    return sorted(scores, key=scores.__getitem__, reverse=True)`,
      },
    },
  ],

  results: {
    intro: [
      "These are POC results on one fixed field set. They are not a general extraction-accuracy claim, and FDI has no production adoption.",
    ],
    headline: [
      { label: "Field recall, hybrid vs dense-only", before: 70.4, after: 91.3, unit: "%", better: "higher", decimals: 1, context: "138 → 179 of 196 target fields.", evidence: "poc" },
      { label: "Embedding preparation", before: 1080, after: 210, unit: "s", better: "lower", context: "≈18 min → 210 s after re-chunking. Recall unchanged.", evidence: "poc" },
      { label: "Pipeline stages", value: "22", unit: "stages", context: "Content-addressed DAG.", evidence: "scope" },
      { label: "Taxonomy", value: "400+", unit: "tags", context: "Tags available to the Financial Object Graph.", evidence: "scope" },
    ],
    metrics: [
      { label: "Fields retrieved", before: 138, after: 179, unit: "of 196", better: "higher", context: "Dense-only vs dense + BM25 + RRF.", evidence: "poc" },
      { label: "Field recall", before: 70.4, after: 91.3, unit: "%", better: "higher", decimals: 1, context: "Same 196-field set.", evidence: "poc" },
      { label: "Chunks", before: 1985, after: 767, unit: "chunks", better: "lower", context: "After re-chunking (≈1,985 before).", evidence: "poc" },
      { label: "Embedding preparation", before: 1080, after: 210, unit: "s", better: "lower", context: "≈18 minutes → 210 seconds, recall unchanged.", evidence: "poc" },
    ],
    viz: ["fdi-recall", "fdi-embedding"],
    caveats: [
      "Recall is measured on one fixed set of 196 target fields in a POC. It says nothing about extraction accuracy in general.",
      "FDI is an independent POC with no production deployment.",
    ],
  },

  lessons: [
    {
      title: "Draw the probabilistic boundary on purpose",
      body: "Deciding exactly where LLM output stops and deterministic code starts was the most important design choice. It made the rest of the system testable.",
    },
    {
      title: "Lexical retrieval still earns its place",
      body: "Adding BM25 to dense retrieval recovered 41 of the 58 fields dense-only missed. For documents full of fixed financial terminology, keyword matching is worth keeping.",
    },
    {
      title: "Fewer, better chunks",
      body: "Cutting chunks from about 1,985 to 767 made embedding preparation about five times faster, with recall unchanged. More chunks were not buying recall.",
    },
  ],

  stack: [
    { purpose: "Programming", items: [{ name: "Python", use: "Pipeline and services" }] },
    { purpose: "Backend", items: [{ name: "Celery + RabbitMQ", use: "DAG stage orchestration" }] },
    { purpose: "AI / ML", items: [
      { name: "Azure Document Intelligence", use: "OCR with coordinates" },
      { name: "Embeddings + BM25 + RRF", use: "Hybrid retrieval" },
      { name: "LLM (schema-driven)", use: "Field extraction" },
    ] },
    { purpose: "Data processing", items: [
      { name: "Financial Object Graph", use: "Tagged values with provenance" },
      { name: "XBRL", use: "Standards-based export" },
    ] },
    { purpose: "Frontend", items: [{ name: "Next.js", use: "PDF viewer with bounding-box provenance" }] },
    { purpose: "Deployment", items: [{ name: "Docker Compose", use: "Local multi-service stack" }] },
  ],

  evidence: [],
  related: { notes: ["dense-only-missed-58-fields", "llm-reads-code-calculates"], articles: ["vector-search-graphrag"] },
  todo: [
    "The local repo has a GitHub remote (Jaimin-ptl07/FinancialDocIntelligence). If it is public, add it under evidence. Not linked until confirmed.",
    "The repo README currently describes a 9-measured-stage slice. This page follows your brief's 22-stage DAG. Confirm which version the site should describe.",
    "Which LLM performs extraction (an earlier resume listed the Claude API).",
    "How the 196 target fields were chosen and how 'retrieved' was judged.",
    "Screenshots of the provenance viewer, if you want them shown (real captures only).",
  ],
};
