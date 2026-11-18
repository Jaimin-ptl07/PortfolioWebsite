import type { FocusId } from "./types";

export const focusAreas: { id: FocusId; title: string; body: string }[] = [
  {
    id: "document",
    title: "Document intelligence and AI pipelines",
    body: "OCR, layout and reading order, table reconstruction and schema-driven extraction over documents of 200 to 2,500+ pages.",
  },
  {
    id: "llm",
    title: "LLM systems and inference infrastructure",
    body: "Self-hosted serving on vLLM, scheduler tuning, and measuring TTFT, ITL, throughput and KV-cache trade-offs.",
  },
  {
    id: "backend",
    title: "Backend engineering and distributed processing",
    body: "FastAPI services, Celery and RabbitMQ pipelines, idempotency, checkpointing, retries and circuit breakers.",
  },
  {
    id: "retrieval",
    title: "Retrieval, knowledge systems and agentic workflows",
    body: "Hybrid dense + BM25 retrieval, RBAC-governed knowledge layers and LangGraph workflows with bounded tool use.",
  },
];

/** The journey, in order. Each step is a real stage; no dates are inferred. */
export const journey: { title: string; body: string; project?: string }[] = [
  {
    title: "Computer Engineering at CHARUSAT",
    body: "A B.Tech in Computer Engineering (CGPA 8.81) gave me the foundation, and the habit of asking how something works underneath.",
  },
  {
    title: "Research at SAC-ISRO",
    body: "A year predicting pixel-level flood extent along the Ganga taught me to work with large rasters, and to state a comparison's caveats as clearly as its result.",
    project: "sac-isro-flood-inundation",
  },
  {
    title: "Applied AI and document intelligence",
    body: "At Silver Touch I conceived and led the IDP platform: turning long PDFs into structured, schema-defined data that other projects reuse.",
    project: "intelligent-document-processing",
  },
  {
    title: "Enterprise knowledge and appraisal systems",
    body: "On PARAKH I designed the knowledge architecture over thousands of pages of DPRs, engineering books and rule books, built for failure from the start.",
    project: "parakh",
  },
  {
    title: "LLM inference and performance engineering",
    body: "Serving Gemma 4 31B on an MI300X meant learning where latency actually comes from, inside the model server and outside it.",
    project: "gemma-4-inference",
  },
  {
    title: "Independent building and experimentation",
    body: "Outside work, Financial Document Intelligence and Finqora are where I test ideas end to end: content-addressed pipelines, hybrid retrieval and deterministic boundaries around LLMs.",
    project: "financial-document-intelligence",
  },
];

export const experience = [
  {
    org: "Silver Touch Technologies Ltd.",
    role: "AI/ML Engineer",
    start: "Oct 2025",
    end: "Present",
    summary: "Document-intelligence platforms, engineering knowledge systems and self-hosted LLM infrastructure.",
    projects: ["intelligent-document-processing", "parakh", "gemma-4-inference"],
  },
  {
    org: "Space Applications Centre (SAC), ISRO",
    role: "Research Intern",
    start: "May 2024",
    end: "May 2025",
    summary: "Pixel-level flood-inundation prediction for five Ganga River sections, evaluated against Sentinel-1 SAR flood masks.",
    projects: ["sac-isro-flood-inundation"],
  },
];

export const education = {
  degree: "B.Tech, Computer Engineering",
  institution: "Charotar University of Science and Technology (CHARUSAT)",
  start: "Sep 2021",
  end: "Apr 2025",
  cgpa: "8.81",
};

export const certifications = [
  { name: "Google Advanced Data Analytics Certificate", issuer: "Coursera", year: "2024" },
  { name: "Google Business Intelligence Certificate", issuer: "Coursera", year: "2024" },
];

export const principles: { title: string; body: string; project: string; projectLabel: string }[] = [
  {
    title: "Understand the workload before choosing the architecture",
    body: "The Gemma deployment was tuned against production prompts because a prefill-heavy workload behaves nothing like a synthetic one.",
    project: "gemma-4-inference",
    projectLabel: "Gemma 4 inference",
  },
  {
    title: "Separate probabilistic behaviour from deterministic logic",
    body: "In FDI the LLM extracts values, but ratios and validation are code. In Finqora allocation is Decimal arithmetic, and the assistant only consults it.",
    project: "financial-document-intelligence",
    projectLabel: "Financial Document Intelligence",
  },
  {
    title: "Design for failure and recovery",
    body: "PARAKH's ETL is idempotent and checkpointed, so a failure on page 2,000 of a DPR resumes there, not at page one.",
    project: "parakh",
    projectLabel: "PARAKH",
  },
  {
    title: "Measure before claiming",
    body: "Dense-only vs hybrid retrieval was settled by recall on 196 fields, not intuition. Where something was only designed for, it is labelled a target.",
    project: "financial-document-intelligence",
    projectLabel: "FDI retrieval",
  },
];
