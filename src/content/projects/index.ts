import type { AdditionalProject, FocusId, Project } from "../types";
import { idp } from "./idp";
import { parakh } from "./parakh";
import { gemma } from "./gemma";
import { fdi } from "./fdi";
import { finqora } from "./finqora";
import { sacIsro } from "./sac-isro";

export const projects: Project[] = [idp, parakh, gemma, fdi, finqora, sacIsro].sort((a, b) => a.order - b.order);

export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function projectsForFocus(focus: FocusId) {
  return projects.filter((p) => p.focus.includes(focus));
}

export const additionalProjects: AdditionalProject[] = [
  {
    slug: "tender-ai",
    title: "NHAI / AMC Tender AI",
    status: "POC",
    role: "Sole developer",
    organisation: "Silver Touch Technologies Ltd.",
    summary: "Tender-document processing with RFP-aware segmentation, retrieval scoped to a single tender, and LLM-drafted pre-bid answers that a person reviews.",
    points: [
      "RFP-aware segmentation of tender documents.",
      "Tender-scoped hybrid retrieval, so answers draw only on the tender in question.",
      "LLM-assisted drafting of pre-bid query answers, with human review before anything is sent.",
      "Bid completeness and prequalification checks.",
      "Configurable bid evaluation methods.",
    ],
    stack: ["Python", "Hybrid retrieval (dense + BM25)", "LLMs"],
    focus: ["document", "retrieval"],
  },
  {
    slug: "cwc-agentic-analytics",
    title: "CWC Agentic Analytics",
    status: "POC",
    role: "Sole developer",
    organisation: "Silver Touch Technologies Ltd.",
    summary: "A stateful, multi-step analytics workflow orchestrated with LangGraph, calling an external natural-language-to-SQL service.",
    points: [
      "LangGraph-orchestrated, stateful multi-step workflow.",
      "Integration with an external natural-language-to-SQL service.",
    ],
    stack: ["Python", "LangGraph"],
    focus: ["retrieval", "llm"],
    todo: ["An earlier resume described this as LlamaIndex + Azure OpenAI NL-to-SQL with schema context. Confirm which description is current."],
  },
  {
    slug: "logistics-icd",
    title: "Logistics & ICD platform",
    status: "POC",
    role: "Built the data pipeline",
    organisation: "Silver Touch Technologies Ltd.",
    summary: "A data pipeline for tracking and reporting on Inland Container Depot (ICD) operations.",
    points: ["ETL pipeline for logistics and ICD operations tracking and reporting."],
    stack: ["Python", "PostgreSQL", "ETL", "FastAPI"],
    focus: ["backend"],
    todo: ["Status is set to POC because the resume lists it under Silver Touch POCs. Confirm, and add your role and scope."],
  },
];
