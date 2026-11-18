import type { Project } from "../types";

export const parakh: Project = {
  slug: "parakh",
  title: "PARAKH: DPR appraisal and engineering knowledge platform",
  shortTitle: "PARAKH",
  subtitle:
    "A fault-tolerant knowledge layer built from thousands of pages of project reports, engineering books and rule books, governed by role-based access and wired into DPR appraisal workflows.",
  category: "Engineering knowledge systems / document AI",
  status: "Enterprise project",
  organisation: "Silver Touch Technologies Ltd.",
  role: "Owned unstructured-data processing, ETL and knowledge architecture",
  featured: true,
  order: 2,
  glyph: "parakh",
  focus: ["document", "backend", "retrieval"],
  card: {
    problem: "Appraising Detailed Project Reports means checking 1,000–2,500-page documents against engineering books and rule books.",
    solution: "An asynchronous OCR and ETL pipeline that builds an access-controlled knowledge store, with checkpoints, retries and circuit breakers throughout.",
    impact: "Ingests 15–20 DPRs, about 25 engineering books and about 150 rule books. The OCR layer cleared a 7,000-page load test.",
  },
  techSummary: ["Python", "FastAPI", "Celery", "RabbitMQ", "PostgreSQL", "OCR", "LangGraph", "RBAC"],

  overview: [
    "A Detailed Project Report (DPR) is the document an infrastructure project is appraised on. A typical one runs 1,000–1,500 pages, and some exceed 2,500. Appraising one means checking it against engineering reference books and regulatory rule books, which are equally unstructured.",
    "PARAKH is the platform built for that appraisal work. Within it, I owned the unstructured-data side. I analysed the SOW, designed the processing and knowledge architecture, and shaped the major architectural decisions, including a modular monolith. I also designed the ETL pipelines that build the knowledge base and the RBAC model that governs it, and implemented the core PDF, OCR and data-processing components.",
    "The rest of the appraisal platform was a team effort. This case study covers the knowledge layer I was responsible for and how it plugs into the appraisal workflow.",
  ],

  problem: {
    context: [
      "The source material is large and varied: about 15–20 DPRs, about 25 engineering books and about 150 rule books. Most of it arrives as PDFs with scanned pages, tables and inconsistent formatting.",
      "Appraisal steps need answers grounded in the right reference text, and not every user should see every document. The knowledge layer has to be accurate about what it holds and strict about who can read it.",
    ],
    who: "Appraisal teams reviewing DPRs, and the appraisal workflows that need grounded access to standards and reference texts.",
    why: "If the knowledge base is incomplete or ungoverned, every appraisal built on it inherits the gap.",
    functional: [
      "Ingest DPRs, engineering books and rule books as PDFs, including scanned pages.",
      "Turn them into a managed engineering knowledge base.",
      "Enforce role-based access to knowledge.",
      "Expose the knowledge to DPR appraisal workflows.",
    ],
    nonFunctional: [
      "Survive failures in multi-hour jobs without starting over.",
      "Make re-runs safe: no duplicated knowledge from a retried stage.",
      "Bounded concurrency, so downstream OCR and model services are not overwhelmed.",
    ],
    constraints: [
      "SOW design target: three concurrent DPRs of about 2,500 pages each.",
      "External dependencies (OCR, model serving) can be slow or briefly unavailable.",
    ],
  },

  contribution: {
    designed: [
      "The unstructured-data processing architecture, starting from SOW analysis.",
      "The ETL pipelines for engineering knowledge creation and management.",
      "The RBAC model for knowledge access.",
      "Reliability mechanisms: idempotent stages, checkpointing, retries with backoff, circuit breakers, failure recovery.",
    ],
    implemented: [
      "Core PDF, OCR and data-processing components.",
      "Integration of the knowledge layer with DPR appraisal workflows.",
    ],
    led: ["Major architectural decisions, including the modular-monolith structure."],
    team: ["The wider appraisal platform: other modules, interfaces and workflow logic were built by the team."],
    dependencies: ["Self-hosted model serving (see the Gemma 4 case study)."],
  },

  architecture: {
    intro: [
      "Documents enter through intake and are processed asynchronously by queue workers: OCR and layout, normalisation, then knowledge ETL. Stages are idempotent and checkpointed, so a failed job resumes from its last completed stage instead of page one.",
      "The knowledge store is read only through an RBAC layer. Appraisal workflows query it with the user's permissions, never directly.",
    ],
    diagram: {
      id: "parakh-knowledge",
      title: "Knowledge pipeline and access path",
      caption: "The dashed region is the asynchronous ETL path. Checkpoints feed retries, so recovery restarts at the failed stage.",
      width: 1000,
      height: 420,
      groups: [{ label: "Async ETL: idempotent stages, checkpoints, retries with backoff, circuit breakers", x: 372, y: 18, w: 618, h: 200 }],
      nodes: [
        { id: "dpr", label: "DPRs", sub: "≈15–20, 1,000–2,500+ pp", x: 15, y: 40, w: 160, kind: "source", step: 1, detail: "Detailed Project Reports, typically 1,000–1,500 pages; some exceed 2,500." },
        { id: "books", label: "Engineering books", sub: "≈25", x: 15, y: 130, w: 160, kind: "source", detail: "Reference texts used to check engineering content in DPRs." },
        { id: "rules", label: "Rule books", sub: "≈150", x: 15, y: 220, w: 160, kind: "source", detail: "Regulatory and standards documents appraisal steps must be checked against." },
        { id: "intake", label: "Intake", sub: "register + enqueue", x: 205, y: 130, w: 140, kind: "api", step: 2, detail: "Registers each document and enqueues processing jobs." },
        { id: "queue", label: "Task queue", sub: "Celery + RabbitMQ", x: 390, y: 40, w: 150, kind: "control", step: 3, detail: "Dispatches stage jobs to workers and re-dispatches failed ones with backoff." },
        { id: "ocr", label: "OCR + layout", x: 390, y: 140, w: 150, kind: "process", step: 4, detail: "Extracts text and structure from scanned and digital pages. Load-tested at about 7,000 pages." },
        { id: "norm", label: "Normalisation", x: 590, y: 140, w: 140, kind: "process", step: 5, detail: "Turns OCR output into a consistent representation for knowledge creation." },
        { id: "etl", label: "Knowledge ETL", sub: "≤4 books concurrently", x: 780, y: 140, w: 190, kind: "process", step: 6, detail: "Builds and manages knowledge entries from normalised documents. Processes up to four engineering books concurrently." },
        { id: "ckpt", label: "Checkpoint store", sub: "last completed stage", x: 780, y: 40, w: 190, kind: "store", detail: "Records stage completion. Combined with idempotent stages, a retry resumes at the failed stage without duplicating work." },
        { id: "store", label: "Knowledge store", sub: "PostgreSQL", x: 780, y: 300, w: 190, kind: "store", step: 7, detail: "The managed engineering knowledge base." },
        { id: "rbac", label: "RBAC access", sub: "role-scoped reads", x: 560, y: 300, w: 160, kind: "control", step: 8, detail: "Every read is filtered by the caller's role, so appraisal steps only see permitted knowledge." },
        { id: "appraisal", label: "DPR appraisal", sub: "workflow steps", x: 330, y: 300, w: 170, kind: "app", step: 9, detail: "Appraisal workflow steps query the knowledge layer for standards and reference texts, through RBAC." },
      ],
      edges: [
        { from: "dpr", to: "intake" },
        { from: "books", to: "intake" },
        { from: "rules", to: "intake" },
        { from: "intake", to: "queue", fromSide: "t", toSide: "l" },
        { from: "queue", to: "ocr", fromSide: "b", toSide: "t", kind: "control", label: "dispatch" },
        { from: "ocr", to: "norm" },
        { from: "norm", to: "etl" },
        { from: "etl", to: "ckpt", fromSide: "t", toSide: "b", kind: "control", label: "checkpoint" },
        { from: "ckpt", to: "queue", fromSide: "l", toSide: "r", kind: "retry", label: "resume / retry" },
        { from: "etl", to: "store", fromSide: "b", toSide: "t" },
        { from: "store", to: "rbac", fromSide: "l", toSide: "r" },
        { from: "rbac", to: "appraisal", fromSide: "l", toSide: "r" },
      ],
    },
    notes: [
      {
        title: "Design target, not benchmark",
        body: "The architecture was designed to an SOW target of three concurrent DPRs of about 2,500 pages each. That is a design target. It has not been verified as a benchmark, and the 7,000-page OCR load test is a separate, component-level result.",
      },
    ],
  },

  decisions: [
    {
      title: "A modular monolith",
      context: "The platform has several distinct concerns (document processing, knowledge management, access control, appraisal workflows), built by one team.",
      choice: "One deployable application with clear module boundaries. Long-running document work runs in asynchronous workers.",
      rationale: [
        "Module boundaries keep concerns separate without distributed-system overhead between them.",
        "One deployable is simpler to operate for a single team.",
        "Heavy processing runs in queue workers, so it does not block request handling.",
      ],
      tradeoffs: [
        "Modules share a release cycle; one module's change ships the whole application.",
        "Boundaries are enforced by discipline and structure, not network separation.",
      ],
    },
    {
      title: "Reliability built into every ETL stage",
      context: "Jobs over 1,000–2,500-page documents run for a long time and depend on services that can fail. A failure at page 2,000 should not mean starting again from page 1.",
      choice: "Idempotent stages, checkpointing, automatic retries with backoff, circuit breakers around dependencies, and explicit failure recovery.",
      rationale: [
        "Checkpoints let a job resume at the failed stage.",
        "Idempotency makes retries safe: a stage that runs twice produces the same result once.",
        "Backoff and circuit breakers stop a struggling dependency from being hammered by retries.",
      ],
      tradeoffs: [
        "More state to manage: checkpoint records and idempotency keys.",
        "Every stage has to be written so it can safely run more than once.",
      ],
    },
    {
      title: "Access control at the knowledge layer",
      context: "DPRs, engineering books and rule books have different audiences.",
      choice: "Enforce RBAC on every knowledge read, so appraisal workflows inherit the user's permissions.",
      rationale: [
        "One enforcement point instead of checks scattered through workflow code.",
        "Retrieval can never surface a document the user is not allowed to see.",
      ],
      tradeoffs: ["Every read pays for an access check.", "The role model has to be maintained as users and documents change."],
    },
    {
      title: "Bounded ETL concurrency",
      context: "Knowledge creation competes with OCR and model serving for the same downstream capacity.",
      choice: "Process up to four engineering books concurrently.",
      rationale: ["Keeps load on downstream services predictable."],
      tradeoffs: ["Caps ingestion throughput even when capacity is free."],
    },
  ],

  challenges: [
    {
      title: "Failures in very long jobs",
      problem: "A single DPR can exceed 2,500 pages. Any transient failure in a long job risked throwing away hours of processing.",
      solution: "Idempotent stages with checkpointing, so recovery restarts at the failed stage, plus automatic retries with backoff.",
      outcome: "A failed job resumes from its last checkpoint instead of reprocessing the whole document.",
    },
    {
      title: "Dependencies that slow down or fail",
      problem: "OCR and model services can become slow or unavailable. Naive retries make that worse.",
      solution: "Circuit breakers around external dependencies, combined with retry backoff.",
      outcome: "When a dependency is struggling, work pauses and resumes instead of piling retries onto it.",
    },
    {
      title: "Confidence in OCR capacity",
      problem: "The OCR layer had to handle document sets far larger than a typical test file.",
      diagnosis: "Load-tested the OCR layer with about 7,000 pages.",
      solution: "Validated the OCR layer at that scale before relying on it for the full corpus.",
      outcome: "The OCR layer cleared the 7,000-page load test.",
    },
    {
      title: "Application concurrency below model capacity",
      problem: "Document processing was slower than the model server could support.",
      cause: "PARAKH's own processing concurrency (10) and the gateway cap (20) limited requests before they reached the model.",
      solution: "Raised PARAKH concurrency to 32 and the gateway cap to 64.",
      outcome: "Application-level document-processing throughput rose from 221 to 890 tok/s. The Gemma 4 case study has the details.",
    },
  ],

  implementation: [
    {
      title: "Processing pipeline",
      body: [
        "Intake registers documents and enqueues work on RabbitMQ. Celery workers run OCR and layout, normalisation and knowledge ETL as separate stages, and stage completion is checkpointed so recovery can resume mid-pipeline.",
      ],
    },
    {
      title: "Reliability mechanisms",
      body: ["The mechanisms work together. Each covers a failure the others don't."],
      points: [
        "Idempotency: re-running a completed stage changes nothing, so retries are always safe.",
        "Checkpointing: recovery starts from the last completed stage.",
        "Retries with backoff: transient failures are retried with increasing delays.",
        "Circuit breakers: a failing dependency stops receiving work until it recovers.",
        "Failure recovery: a failed job is resumed from its checkpoint, not restarted.",
      ],
    },
    {
      title: "Knowledge access",
      body: [
        "The knowledge store sits behind an RBAC layer. Appraisal workflow steps request standards and reference passages through it, scoped to the user's role.",
      ],
    },
  ],

  results: {
    intro: [
      "Figures below describe the workload and component-level validation. The three-DPR concurrency target is a design target and is labelled as one.",
    ],
    headline: [
      { label: "Typical DPR size", value: "1,000–1,500", unit: "pages", context: "Some DPRs exceed 2,500 pages.", evidence: "scope" },
      { label: "OCR load test", value: "≈7,000", unit: "pages", context: "Component-level load test of the OCR layer.", evidence: "load-test" },
      { label: "Rule books in the knowledge base", value: "≈150", unit: "books", context: "Plus about 25 engineering books and 15–20 DPRs.", evidence: "scope" },
      { label: "Concurrency target", value: "3 × 2,500", unit: "pages", context: "SOW target: three concurrent DPRs of about 2,500 pages.", evidence: "target", note: "Not a verified benchmark." },
    ],
    metrics: [
      { label: "DPRs", value: "≈15–20", unit: "documents", context: "In the knowledge base.", evidence: "scope" },
      { label: "Engineering books", value: "≈25", unit: "books", context: "In the knowledge base.", evidence: "scope" },
      { label: "Rule books", value: "≈150", unit: "books", context: "In the knowledge base.", evidence: "scope" },
      { label: "Largest DPRs", value: ">2,500", unit: "pages", context: "Upper end of the corpus.", evidence: "scope" },
      { label: "Concurrent book ETL", value: "4", unit: "books", context: "Configured ETL concurrency for engineering books.", evidence: "scope" },
      { label: "OCR load test", value: "≈7,000", unit: "pages", context: "Cleared by the OCR layer.", evidence: "load-test" },
      { label: "Document-processing throughput", before: 221, after: 890, unit: "tok/s", better: "higher", context: "Application level, after concurrency 10 → 32 and gateway cap 20 → 64.", evidence: "observed" },
      { label: "Concurrent DPR target", value: "3 × ≈2,500", unit: "pages", context: "SOW design target.", evidence: "target", note: "Designed for, not measured." },
    ],
    viz: ["parakh-workload"],
    caveats: [
      "The three-concurrent-DPR figure is an SOW design target, not a measured result.",
      "The 7,000-page OCR load test validates the OCR component only, not the end-to-end pipeline.",
    ],
  },

  lessons: [
    {
      title: "Long jobs need resumability from day one",
      body: "With 2,500-page documents, recovery cannot be added later. Idempotency and checkpoints decide how every stage is written, so they had to be in the first design.",
    },
    {
      title: "Govern knowledge where it is read",
      body: "Putting RBAC in the knowledge layer instead of the workflows meant every appraisal step got access control without having to remember it.",
    },
    {
      title: "Label targets as targets",
      body: "An SOW target is easy to repeat as if it were a result. Keeping \"designed for three concurrent 2,500-page DPRs\" separate from \"cleared a 7,000-page OCR load test\" keeps the claims honest.",
    },
  ],

  stack: [
    { purpose: "Programming", items: [{ name: "Python", use: "Pipelines and services" }] },
    { purpose: "Backend", items: [
      { name: "FastAPI", use: "Application APIs" },
      { name: "Celery + RabbitMQ", use: "Asynchronous stage execution and retries" },
    ] },
    { purpose: "Data processing", items: [
      { name: "OCR + layout processing", use: "Text and structure from scanned and digital PDFs" },
      { name: "ETL pipelines", use: "Knowledge creation and management" },
    ] },
    { purpose: "AI / ML", items: [
      { name: "LangGraph", use: "Appraisal workflow orchestration" },
      { name: "Self-hosted LLMs (vLLM)", use: "Model calls during processing" },
    ] },
    { purpose: "Databases & caching", items: [{ name: "PostgreSQL", use: "Knowledge store" }] },
  ],

  evidence: [],
  related: { notes: ["bottleneck-outside-the-model"], projects: ["gemma-4-inference", "intelligent-document-processing"] },
  todo: [
    "Team size and your scope within it.",
    "Timeline (start date, current phase).",
    "Confirm the OCR engine (an earlier resume listed PaddleOCR) before naming it on this page.",
    "Where checkpoints and RBAC data are stored (shown generically as \"Checkpoint store\" in the diagram).",
    "Confirm how LangGraph is used in appraisal workflows, and by whom.",
    "Any measured ETL timings (e.g. pages per hour), with method. Leave empty if not measured.",
    "What you'd change if rebuilding the knowledge layer today.",
  ],
};
