import type { Project } from "../types";

export const idp: Project = {
  slug: "intelligent-document-processing",
  title: "Intelligent Document Processing Platform",
  shortTitle: "IDP platform",
  subtitle:
    "A reusable internal platform that turns 200–300-page PDFs into structured, schema-defined fields that other projects can consume through an API or as a module.",
  category: "Enterprise AI / document intelligence",
  status: "Internal platform",
  organisation: "Silver Touch Technologies Ltd.",
  role: "Project lead: architecture, core pipeline, CI/CD",
  team: "Team of about 4–5",
  featured: true,
  order: 1,
  glyph: "idp",
  focus: ["document", "backend"],
  card: {
    problem: "Each project that needed to read large PDFs was on track to build its own ingestion and extraction code.",
    solution: "One multi-stage pipeline: OCR, reading order, normalisation and schema-driven LLM extraction, exposed as a REST API and a Python module.",
    impact: "Reused by about 2–3 internal projects, including an NHAI RFP workflow that extracts 25–30 fields per RFP.",
  },
  techSummary: ["Python", "FastAPI", "Azure Document Intelligence", "LangChain", "LangGraph", "PostgreSQL", "GitLab CI/CD"],

  overview: [
    "Several projects at Silver Touch needed the same capability: take a long PDF, understand its structure, and pull out specific fields as structured data. Building that once per project would have meant several half-finished pipelines.",
    "I conceived the IDP platform, designed its architecture and led a team of about four to five engineers building it. I set the technical direction and wrote core pipeline code myself. I also built the GitLab CI/CD pipeline, including blue-green deployment.",
    "The platform handles documents of roughly 200–300 pages and has been reused by about two to three internal projects. One of them is an NHAI integration that extracts 25–30 fields from each RFP and checks them against predefined templates.",
  ],

  problem: {
    context: [
      "Enterprise documents such as RFPs and project reports are long, laid out in columns and tables, and inconsistent between issuers. Teams needed specific fields out of them, in a structure their own applications could use.",
      "Each new use case needed the same groundwork: get text out of a scanned or digital PDF, fix the order it is read in, clean it up, then extract fields. Only the field definitions differed.",
    ],
    who: "Internal project teams whose applications depend on fields locked inside large PDFs.",
    why: "Without a shared platform, every team would rebuild OCR handling, layout recovery and extraction prompts, each with its own gaps.",
    functional: [
      "Ingest PDFs of 200–300 pages.",
      "Recover document structure: text, layout and reading order.",
      "Extract fields defined per use case into structured output.",
      "Serve both networked services (REST) and in-process consumers (Python module).",
    ],
    nonFunctional: [
      "Reusable across projects without forking the pipeline.",
      "Deployable without interrupting the projects that depend on it.",
    ],
  },

  contribution: {
    designed: [
      "The platform concept and its overall architecture.",
      "The stage boundaries: ingestion, OCR, layout and reading order, normalisation, schema-driven extraction.",
      "The two integration surfaces: REST API and direct module import.",
    ],
    implemented: [
      "Core pipeline components, hands-on.",
      "The full GitLab CI/CD pipeline.",
      "Blue-green deployment.",
      "The NHAI RFP integration: RFP structure extraction, 25–30 fields per RFP, template checks.",
    ],
    led: ["A team of about 4–5 engineers: technical direction, architecture decisions and review."],
    team: ["The wider team delivered parts of the pipeline and integrations under that direction."],
    dependencies: ["Azure Document Intelligence for OCR.", "LLM services used by the extraction stage."],
  },

  architecture: {
    intro: [
      "The pipeline is a sequence of stages, each with a narrow job. Upstream stages produce clean, correctly ordered text. Only the last stage uses an LLM, and it is driven by a schema that defines which fields each use case needs.",
      "Downstream projects never call the stages directly. They get structured output through the REST API or by importing the platform as a module.",
    ],
    diagram: {
      id: "idp-pipeline",
      title: "IDP pipeline and integrations",
      caption: "Stages run left to right. The extraction schema is the only per-project input; everything upstream of it is shared.",
      width: 1000,
      height: 470,
      groups: [
        { label: "Shared pipeline", x: 8, y: 105, w: 880, h: 100 },
        { label: "Delivery", x: 8, y: 240, w: 180, h: 215 },
      ],
      nodes: [
        { id: "schema", label: "Extraction schema", sub: "fields per use case", x: 725, y: 15, w: 150, kind: "store", detail: "Defines the fields a consuming project needs. Swapping the schema is how one pipeline serves different projects." },
        { id: "upload", label: "PDF upload", sub: "200–300 pages", x: 22, y: 128, kind: "source", step: 1, detail: "Long, scanned or digital PDFs such as RFPs, typically 200–300 pages." },
        { id: "ocr", label: "OCR", sub: "Azure Doc. Intelligence", x: 198, y: 128, w: 150, kind: "process", step: 2, detail: "Converts page images into text with positional information." },
        { id: "layout", label: "Layout + reading order", x: 373, y: 128, w: 155, kind: "process", step: 3, detail: "Recovers columns, tables and the order a person would read the page in, so later stages see coherent text." },
        { id: "norm", label: "Normalisation", x: 553, y: 128, kind: "process", step: 4, detail: "Cleans and standardises the ordered text into a consistent structure for extraction." },
        { id: "extract", label: "LLM extraction", sub: "schema-driven", x: 725, y: 128, w: 150, kind: "model", step: 5, detail: "An LLM fills the fields defined in the schema from the normalised document." },
        { id: "output", label: "Structured output", sub: "schema fields", x: 725, y: 268, w: 150, kind: "store", step: 6, detail: "The extracted fields, shaped by the schema, ready for downstream use." },
        { id: "api", label: "REST API", sub: "FastAPI", x: 480, y: 268, kind: "api", step: 7, detail: "Networked integration for services that call the platform." },
        { id: "module", label: "Python module", sub: "direct import", x: 480, y: 372, kind: "api", detail: "In-process integration for projects that embed the pipeline." },
        { id: "nhai", label: "NHAI RFP workflow", sub: "25–30 fields / RFP", x: 228, y: 268, w: 150, kind: "app", step: 8, detail: "Extracts RFP structure and 25–30 fields per RFP, then checks them against predefined templates." },
        { id: "others", label: "Other projects", sub: "≈2–3 adopters in total", x: 228, y: 372, w: 150, kind: "app", detail: "The platform has been reused by about two to three internal projects in total." },
        { id: "ci", label: "GitLab CI/CD", sub: "built end-to-end", x: 22, y: 268, w: 145, kind: "control", detail: "The full pipeline: build, test, package and deploy." },
        { id: "bg", label: "Blue-green", sub: "switch + rollback", x: 22, y: 372, w: 145, kind: "control", detail: "New versions go to an idle environment and traffic switches over once it is healthy. The old environment remains available for rollback." },
      ],
      edges: [
        { from: "upload", to: "ocr" },
        { from: "ocr", to: "layout" },
        { from: "layout", to: "norm" },
        { from: "norm", to: "extract" },
        { from: "schema", to: "extract", fromSide: "b", toSide: "t", kind: "control" },
        { from: "extract", to: "output", fromSide: "b", toSide: "t" },
        { from: "output", to: "api" },
        { from: "output", to: "module", fromSide: "l", toSide: "r" },
        { from: "api", to: "nhai" },
        { from: "module", to: "others" },
        { from: "ci", to: "bg", fromSide: "b", toSide: "t", kind: "control" },
      ],
    },
  },

  decisions: [
    {
      title: "One platform instead of per-project pipelines",
      context: "Multiple projects needed the same ingest-and-extract capability, differing mainly in which fields they wanted.",
      choice: "Build a shared, reusable platform whose only per-project input is an extraction schema.",
      rationale: [
        "OCR, layout recovery and normalisation are the same work whatever field is being extracted.",
        "Improvements to shared stages reach every consumer at once.",
      ],
      tradeoffs: [
        "A platform has consumers, so changes need care. A regression affects every project at once.",
        "The schema interface has to be general enough for different projects without becoming vague.",
      ],
    },
    {
      title: "Schema-driven extraction",
      context: "Each consumer needs different fields, and the output has to be something an application can rely on structurally.",
      choice: "Define the target fields as a schema per use case and drive the LLM extraction stage from it.",
      rationale: [
        "New use cases mostly mean a new schema, not new pipeline code.",
        "Consumers receive output in a known shape.",
      ],
      tradeoffs: [
        "The quality of the schema (field names, descriptions) directly affects extraction quality.",
      ],
    },
    {
      title: "Two integration surfaces: REST API and direct module",
      context: "Some consuming projects are separate services. Others are Python applications that can embed the pipeline.",
      choice: "Expose the platform through a FastAPI REST API and as an importable Python module.",
      rationale: [
        "Services integrate over the network without sharing a runtime.",
        "In-process consumers avoid a network hop and a separate deployment.",
      ],
      tradeoffs: ["Two surfaces to keep consistent and versioned."],
    },
    {
      title: "Blue-green deployment",
      context: "Other projects depend on the platform, so a broken deploy affects more than one team.",
      choice: "Deploy each new version beside the running one and switch traffic only when the new version is healthy.",
      rationale: [
        "Switching traffic avoids downtime during releases.",
        "Rollback means switching back to an environment that is still running.",
      ],
      tradeoffs: ["Two environments run during a release, which costs extra resources."],
    },
  ],

  challenges: [
    {
      title: "Reading order on complex layouts",
      problem: "Raw OCR output from multi-column pages and tables does not follow the order a person reads in. Fields that belong together end up far apart in the text.",
      cause: "OCR reports text by position on the page, not by logical flow.",
      solution: "A dedicated layout and reading-order stage before normalisation and extraction, so the LLM only ever sees ordered text.",
      outcome: "Extraction works on coherent text instead of untangling layout and extracting fields in one step.",
    },
    {
      title: "Serving several projects from one pipeline",
      problem: "Each consumer had its own field list and integration style. Hard-coding either would have turned the platform back into per-project code.",
      solution: "Kept per-project knowledge in the extraction schema, and offered both a REST API and a module interface.",
      outcome: "About two to three internal projects reuse the same pipeline.",
    },
    {
      title: "Shipping changes to a shared platform",
      problem: "Every release affects every consumer.",
      solution: "Built the GitLab CI/CD pipeline end-to-end with blue-green deployment.",
      outcome: "Releases switch traffic to a healthy new environment, and rollback is a switch back.",
    },
  ],

  implementation: [
    {
      title: "Pipeline",
      body: [
        "Each stage takes the previous stage's output and adds one kind of structure. Ingestion accepts the PDF. OCR (Azure Document Intelligence) produces positioned text. The layout stage recovers reading order. Normalisation produces a consistent document representation. The extraction stage runs the LLM against the use case's schema.",
      ],
    },
    {
      title: "Integration",
      body: [
        "FastAPI exposes the platform to networked consumers. The same pipeline is importable as a Python module for in-process use. The NHAI integration uses it to extract RFP structure and 25–30 fields per RFP, then checks the extracted values against predefined templates.",
      ],
    },
    {
      title: "Delivery",
      body: [
        "I built the GitLab CI/CD pipeline end-to-end. Deployments are blue-green: the new version comes up in an idle environment, traffic moves once it is healthy, and the previous environment stays available for rollback.",
      ],
    },
  ],

  results: {
    intro: [
      "This platform's outcomes are about reuse and scale, not speed. No accuracy, latency or time-saving figures are claimed because none were formally measured.",
    ],
    metrics: [
      { label: "Document size handled", value: "200–300", unit: "pages", context: "Typical documents processed by the pipeline.", evidence: "scope" },
      { label: "Fields per NHAI RFP", value: "25–30", unit: "fields", context: "Extracted per RFP, then checked against predefined templates.", evidence: "scope" },
      { label: "Internal projects reusing the platform", value: "≈2–3", unit: "projects", context: "Adoption across Silver Touch projects.", evidence: "observed" },
      { label: "Team led", value: "4–5", unit: "people", context: "Engineers on the platform.", evidence: "scope" },
    ],
  },

  lessons: [
    {
      title: "Put the variation in data, not code",
      body: "The platform stayed reusable because what differs between projects, the fields, lives in a schema. Everything else is the same code path for every consumer.",
    },
    {
      title: "Deployment strategy is part of the architecture",
      body: "Once other teams depend on a service, how it is released matters as much as how it is built. Blue-green deployment was a requirement that came from having consumers.",
    },
  ],

  stack: [
    { purpose: "Programming", items: [{ name: "Python", use: "Pipeline and services" }] },
    { purpose: "Backend", items: [{ name: "FastAPI", use: "REST API for consuming services" }] },
    { purpose: "AI / ML", items: [
      { name: "Azure Document Intelligence", use: "OCR and layout signals" },
      { name: "LangChain, LangGraph", use: "LLM extraction layer" },
    ] },
    { purpose: "Databases & caching", items: [{ name: "PostgreSQL", use: "Platform persistence" }] },
    { purpose: "Deployment", items: [
      { name: "Docker", use: "Packaging" },
      { name: "GitLab CI/CD", use: "Build, test and blue-green deploy pipeline" },
    ] },
  ],

  evidence: [],
  related: { projects: ["parakh", "tender-ai"] },
  todo: [
    "Confirm the OCR engine. The brief says Azure Document Intelligence, but earlier notes marked it unconfirmed.",
    "Timeline: when did IDP start, and when was it first adopted?",
    "Which projects adopted it (names, if shareable)?",
    "What LangChain and LangGraph each do in the extraction layer.",
    "Any measured accuracy, latency or effort savings, with the measurement method. Leave empty if not measured.",
    "Alternatives you genuinely considered (e.g. per-project pipelines, other OCR engines) and what you'd change today.",
  ],
};
