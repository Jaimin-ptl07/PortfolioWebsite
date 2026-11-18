import { Fragment } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, FileText } from "lucide-react";
import { site } from "@/config/site";
import { featuredProjects, projectsForFocus } from "@/content/projects";
import { focusAreas, experience } from "@/content/profile";
import { notes, readingMinutes } from "@/content/notes";
import { recentArticles, formatArticleDate } from "@/content/articles";
import type { EvidenceKind, Project } from "@/content/types";
import { ProjectGlyph } from "@/components/ui/ProjectGlyph";
import { EvidenceBadge, EvidenceLegend } from "@/components/ui/Evidence";
import { ExternalLink, SocialLinks } from "@/components/ui/Links";
import { CountUp } from "@/components/viz/CountUp";
import { StatusMark } from "@/components/case-study/sections";
import { SystemMap, type MapLayer } from "./SystemMap";
import { CopyEmail } from "./CopyEmail";

function SectionHead({ id, title, children, action }: { id: string; title: string; children?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="grid gap-4 md:grid-cols-12 md:items-end">
      <div className="md:col-span-8">
        <h2 id={id} className="font-display text-h2 text-ink sm:text-[2.6rem] sm:leading-[1.1]">
          {title}
        </h2>
        {children && <p className="mt-3 max-w-[58ch] text-body text-graphite">{children}</p>}
      </div>
      {action && <div className="md:col-span-4 md:text-right">{action}</div>}
    </div>
  );
}

const wrap = "mx-auto max-w-[84rem] px-5 sm:px-8";

/* ------------------------------------------------------------------ */

const heading = "Engineering intelligent systems that work beyond the demo.";

export function Hero({ resumeAvailable }: { resumeAvailable: boolean }) {
  const layers: MapLayer[] = [
    { id: "docs", label: "Documents", sub: "RFPs, DPRs, annual reports, rule books", projects: [
      { href: "/work/intelligent-document-processing", name: "IDP" },
      { href: "/work/parakh", name: "PARAKH" },
      { href: "/work/financial-document-intelligence", name: "FDI" },
      { href: "/work#tender-ai", name: "Tender AI" },
    ] },
    { id: "ingest", label: "Ingestion + OCR", sub: "Scanned and digital PDFs up to 2,500+ pages", projects: [
      { href: "/work/intelligent-document-processing", name: "IDP" },
      { href: "/work/parakh", name: "PARAKH" },
      { href: "/work/financial-document-intelligence", name: "FDI" },
    ] },
    { id: "process", label: "Processing", sub: "Reading order, normalisation, table rebuild", projects: [
      { href: "/work/intelligent-document-processing", name: "IDP" },
      { href: "/work/parakh", name: "PARAKH" },
      { href: "/work/financial-document-intelligence", name: "FDI" },
    ] },
    { id: "knowledge", label: "Knowledge", sub: "ETL, RBAC-governed stores, hybrid retrieval", projects: [
      { href: "/work/parakh", name: "PARAKH" },
      { href: "/work/financial-document-intelligence", name: "FDI" },
      { href: "/work#tender-ai", name: "Tender AI" },
    ] },
    { id: "inference", label: "LLM inference", sub: "vLLM on MI300X, schema-driven extraction", projects: [
      { href: "/work/gemma-4-inference", name: "Gemma 4 31B" },
      { href: "/work/intelligent-document-processing", name: "IDP" },
      { href: "/work/financial-document-intelligence", name: "FDI" },
    ] },
    { id: "api", label: "Backend APIs", sub: "FastAPI, queues, adapters, circuit breakers", projects: [
      { href: "/work/intelligent-document-processing", name: "IDP" },
      { href: "/work/parakh", name: "PARAKH" },
      { href: "/work/finqora", name: "Finqora" },
    ] },
    { id: "apps", label: "Applications", sub: "Appraisal, RFP workflows, investor app", projects: [
      { href: "/work/parakh", name: "PARAKH appraisal" },
      { href: "/work/intelligent-document-processing", name: "NHAI RFP workflow" },
      { href: "/work/finqora", name: "Finqora" },
    ] },
  ];

  const words = heading.split(" ");
  return (
    <section aria-labelledby="hero-h" className="drafting-grid relative overflow-hidden border-b border-rule">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-paper/0 via-paper/40 to-paper" aria-hidden />
      <div className={`${wrap} relative pt-12 pb-10 md:pt-16`}>
        <p className="font-mono text-[0.78rem] text-graphite">
          Applied AI Engineer <span className="text-faint">/</span> AI Systems Engineer
        </p>
        <h1 id="hero-h" className="mt-5 max-w-[20ch] font-display text-[2.7rem] leading-[1.03] text-ink text-balance sm:text-[3.8rem] lg:text-[4.6rem] lg:leading-[1]" aria-label={heading}>
          {words.map((w, i) => (
            <Fragment key={i}>
              <span aria-hidden="true" className="rise" style={{ animationDelay: `${80 + i * 55}ms` }}>
                {w}
              </span>
              {i < words.length - 1 && " "}
            </Fragment>
          ))}
        </h1>
        <div className="mt-8 grid gap-8 md:grid-cols-12 md:items-end">
          <p className="max-w-[56ch] text-lead text-graphite md:col-span-7">
            I build AI-powered applications, document intelligence platforms, reliable backend systems and self-hosted LLM infrastructure, with a focus on architecture, performance and real-world engineering constraints.
          </p>
          <div className="flex flex-wrap items-center gap-3 md:col-span-5 md:justify-end">
            <Link href="/work" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-signal px-5 text-small font-medium text-on-signal transition-colors hover:bg-signal-ink">
              Explore my work
              <ArrowRight aria-hidden className="size-4" />
            </Link>
            {resumeAvailable && (
              <a href={site.resume.path} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-ink px-5 text-small font-medium text-ink transition-colors hover:bg-ink hover:text-paper">
                <FileText aria-hidden className="size-4" />
                View resume
              </a>
            )}
          </div>
        </div>
        <SocialLinks className="mt-6" />
        {site.availability && <p className="mt-4 font-mono text-[0.78rem] text-signal-ink">{site.availability}</p>}

        <div className="mt-12">
          <p className="mb-3 font-mono text-[0.7rem] text-faint">the systems I build, in data-flow order</p>
          <SystemMap layers={layers} />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function FeaturedCard({ p, wide, metric }: { p: Project; wide?: boolean; metric?: { value?: number; display?: string; decimals?: number; prefix?: string; unit: string; label: string; evidence: EvidenceKind } }) {
  return (
    <article className={`group relative flex flex-col border border-rule bg-paper transition-colors duration-300 hover:border-ink ${wide ? "md:col-span-7" : "md:col-span-5"}`}>
      <div className={`drafting-grid flex items-center justify-center border-b border-rule px-6 ${wide ? "py-8" : "py-6"}`}>
        <ProjectGlyph id={p.glyph} className={`h-auto w-full ${wide ? "max-w-[22rem]" : "max-w-[17rem]"}`} />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <StatusMark status={p.status} />
          <span className="font-mono text-[0.7rem] text-faint">{p.category}</span>
        </div>
        <h3 className="mt-4 font-display text-h3 text-ink sm:text-[1.75rem] sm:leading-[2.1rem]">
          <Link href={`/work/${p.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
            {p.title}
          </Link>
        </h3>
        <dl className="mt-5 space-y-3 text-small">
          {(
            [
              ["Problem", p.card.problem],
              ["Approach", p.card.solution],
              ["Outcome", p.card.impact],
            ] as const
          ).map(([k, v]) => (
            <div key={k} className="grid grid-cols-[5.5rem_1fr] gap-3">
              <dt className="font-mono text-[0.72rem] leading-6 text-faint">{k.toLowerCase()}</dt>
              <dd className="text-graphite">{v}</dd>
            </div>
          ))}
        </dl>
        {metric && (
          <div className="mt-6 flex items-end justify-between gap-4 border-t border-rule pt-4">
            <div>
              <p className="font-mono text-h2 leading-none text-ink">
                {metric.prefix}
                {metric.display ?? <CountUp value={metric.value ?? 0} decimals={metric.decimals} />}
                <span className="ml-1 text-small text-graphite">{metric.unit}</span>
              </p>
              <p className="mt-1 text-[0.78rem] text-graphite">{metric.label}</p>
            </div>
            <EvidenceBadge kind={metric.evidence} />
          </div>
        )}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-small text-signal-ink" aria-hidden>
          Read the case study <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}

export function FeaturedWork() {
  const [idp, parakh, gemma, fdi] = featuredProjects;
  return (
    <section aria-labelledby="work-h" className={`${wrap} pt-24`} id="work">
      <SectionHead id="work-h" title="Featured work" action={<Link href="/work" className="text-small text-signal-ink link-underline">All projects</Link>}>
        Four systems, each written up in full: the problem, the architecture, the decisions and what they cost, and how the outcome was measured.
      </SectionHead>
      <div className="mt-12 grid gap-5 md:grid-cols-12">
        <FeaturedCard p={idp} wide metric={{ display: "≈2–3", unit: "projects", label: "internal projects reuse the platform", evidence: "observed" }} />
        <FeaturedCard p={parakh} metric={{ value: 7000, prefix: "≈", unit: "pages", label: "OCR load test cleared", evidence: "load-test" }} />
        <FeaturedCard p={gemma} metric={{ value: 4.9, decimals: 1, prefix: "39.4 → ", unit: "s", label: "P95 time to first token", evidence: "benchmark" }} />
        <FeaturedCard p={fdi} wide metric={{ value: 91.3, decimals: 1, prefix: "70.4 → ", unit: "%", label: "field recall, dense-only → hybrid", evidence: "poc" }} />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function FocusAreas() {
  return (
    <section aria-labelledby="focus-h" className={`${wrap} pt-28`}>
      <SectionHead id="focus-h" title="Where I work">
        Four areas, each linked to the projects where I did the work.
      </SectionHead>
      <div className="mt-12 grid border-t border-rule md:grid-cols-2">
        {focusAreas.map((f, i) => (
          <div key={f.id} className={`border-b border-rule py-8 md:px-8 ${i % 2 === 0 ? "md:border-r md:pl-0" : "md:pr-0"}`}>
            <h3 className="font-display text-h3 text-ink">{f.title}</h3>
            <p className="mt-2 max-w-[48ch] text-small text-graphite">{f.body}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {projectsForFocus(f.id).map((p) => (
                <li key={p.slug}>
                  <Link href={`/work/${p.slug}`} className="inline-flex rounded-full border border-rule-strong px-3 py-1 text-[0.8rem] text-ink transition-colors hover:border-signal hover:text-signal-ink">
                    {p.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

type Experiment = { title: string; setup: string; before: string; after: number; decimals?: number; unit: string; metric: string; evidence: EvidenceKind; href: string; caveat?: string };

const experiments: Experiment[] = [
  { title: "vLLM per-step token budget", setup: "max_num_batched_tokens 8,192 → 20,480, 25 concurrent production prompts", before: "39.4", after: 4.9, decimals: 1, unit: "s", metric: "P95 TTFT", evidence: "benchmark", href: "/notes/max-num-batched-tokens-prefill", caveat: "Baseline may include other traffic" },
  { title: "Concurrent sequences vs. latency", setup: "max_num_seqs 25 → 64, 100 offered requests", before: "120", after: 44, unit: "s", metric: "P95 TTFT, at the cost of ITL 125 → 318 ms", evidence: "benchmark", href: "/notes/max-num-seqs-tradeoff" },
  { title: "Queues outside the model server", setup: "App concurrency 10 → 32, gateway cap 20 → 64", before: "221", after: 890, unit: "tok/s", metric: "application-level throughput", evidence: "observed", href: "/notes/bottleneck-outside-the-model" },
  { title: "Hybrid vs. dense-only retrieval", setup: "Dense + BM25 + RRF on 196 target fields", before: "138", after: 179, unit: "of 196", metric: "fields retrieved", evidence: "poc", href: "/notes/dense-only-missed-58-fields" },
  { title: "Re-chunking before embedding", setup: "≈1,985 → 767 chunks, recall unchanged", before: "≈1,080", after: 210, unit: "s", metric: "embedding preparation", evidence: "poc", href: "/work/financial-document-intelligence#results" },
  { title: "Flood extent prediction", setup: "Per-pixel LinearFit vs 10-category baseline, 45 evaluations", before: "0.723", after: 0.794, decimals: 3, unit: "", metric: "mean F1 (initial)", evidence: "research", href: "/work/sac-isro-flood-inundation#results", caveat: "Not threshold-matched, years not fully held out" },
];

export function Experiments() {
  return (
    <section aria-labelledby="exp-h" className={`${wrap} pt-28`}>
      <SectionHead id="exp-h" title="Selected engineering experiments" action={<Link href="/notes" className="text-small text-signal-ink link-underline">All notes</Link>}>
        Measured changes, each labelled with how it was measured. Trade-offs and caveats are part of the result.
      </SectionHead>
      <div className="mt-12 overflow-hidden border-y border-rule">
        <ul className="divide-y divide-rule">
          {experiments.map((e) => (
            <li key={e.title}>
              <Link href={e.href} className="group grid gap-3 py-6 transition-colors hover:bg-raised md:grid-cols-12 md:items-center md:gap-6 md:px-3">
                <div className="md:col-span-5">
                  <p className="font-medium text-ink group-hover:text-signal-ink">{e.title}</p>
                  <p className="mt-1 font-mono text-[0.75rem] text-graphite">{e.setup}</p>
                </div>
                <div className="md:col-span-4">
                  <p className="font-mono text-ink">
                    <span className="text-graphite">{e.before}</span>
                    <span className="px-2 text-faint">→</span>
                    <CountUp value={e.after} decimals={e.decimals} className="text-h3" />
                    {e.unit && <span className="ml-1 text-small text-graphite">{e.unit}</span>}
                  </p>
                  <p className="text-[0.78rem] text-graphite">{e.metric}</p>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 md:col-span-3 md:flex-col md:items-end">
                  <EvidenceBadge kind={e.evidence} />
                  {e.caveat && <span className="text-[0.72rem] text-faint md:text-right">{e.caveat}</span>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <details className="mt-6 max-w-3xl">
        <summary className="cursor-pointer text-small text-graphite hover:text-ink">What the evidence labels mean</summary>
        <div className="mt-4">
          <EvidenceLegend />
        </div>
      </details>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function AboutPreview() {
  return (
    <section aria-labelledby="about-h" className={`${wrap} pt-28`}>
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-7">
          <h2 id="about-h" className="font-display text-h2 text-ink sm:text-[2.6rem] sm:leading-[1.1]">
            I start with the workload, then choose the architecture.
          </h2>
          <div className="prose-body mt-6 text-graphite">
            <p>
              I&apos;m an AI/ML Engineer at Silver Touch Technologies, where I lead document-intelligence work, design knowledge pipelines and run self-hosted LLM inference. Before that I spent a year as a research intern at SAC-ISRO, predicting flood extent along the Ganga from river discharge.
            </p>
            <p>
              What I care about is the part after the demo: separating what the model guesses from what code must guarantee, designing for failure, and measuring before claiming.
            </p>
          </div>
          <Link href="/about" className="mt-6 inline-flex items-center gap-1.5 text-small text-signal-ink link-underline">
            My engineering journey
            <ArrowRight aria-hidden className="size-3.5" />
          </Link>
        </div>
        <div className="md:col-span-5">
          <ol className="border-l border-rule">
            {experience.map((x) => (
              <li key={x.org} className="relative pb-8 pl-6 last:pb-0">
                <span className="absolute -left-[5px] top-2 size-[9px] rounded-full border border-signal bg-paper" aria-hidden />
                <p className="font-mono text-[0.72rem] text-faint">
                  {x.start} – {x.end}
                </p>
                <p className="mt-1 font-medium text-ink">{x.role}</p>
                <p className="text-small text-graphite">{x.org}</p>
              </li>
            ))}
            <li className="relative pl-6 pt-8">
              <span className="absolute -left-[5px] top-10 size-[9px] rounded-full border border-rule-strong bg-paper" aria-hidden />
              <p className="font-mono text-[0.72rem] text-faint">Sep 2021 – Apr 2025</p>
              <p className="mt-1 font-medium text-ink">B.Tech, Computer Engineering</p>
              <p className="text-small text-graphite">CHARUSAT, CGPA 8.81</p>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function WritingPreview() {
  const list = notes.slice(0, 3);
  return (
    <section aria-labelledby="writing-h" className={`${wrap} pt-28`}>
      <SectionHead
        id="writing-h"
        title="Writing"
        action={
          <span className="flex flex-wrap items-center gap-4 md:justify-end">
            <Link href="/notes" className="text-small text-signal-ink link-underline">All writing</Link>
            {site.links.medium && (
              <ExternalLink href={site.links.medium} className="text-small text-graphite">
                Medium
              </ExternalLink>
            )}
          </span>
        }
      >
        Articles on what happens around the model: document processing, retrieval and backend capacity. Plus shorter notes on changes I measured.
      </SectionHead>
      <ul className="mt-12 grid gap-px overflow-hidden border border-rule bg-rule md:grid-cols-3">
        {recentArticles.slice(0, 3).map((a) => (
          <li key={a.id} className="bg-paper">
            <a href={a.url} target="_blank" rel="noopener noreferrer" className="group flex h-full flex-col p-6 transition-colors hover:bg-raised">
              <p className="font-mono text-[0.7rem] text-faint">
                <time dateTime={a.date}>{formatArticleDate(a.date)}</time>, {a.topic.toLowerCase()}
              </p>
              <h3 className="mt-3 font-display text-h3 text-ink group-hover:text-signal-ink">{a.title}</h3>
              {a.quote && <p className="mt-4 border-l-2 border-signal pl-4 text-small italic text-graphite">{a.quote}</p>}
              <p className="mt-auto inline-flex items-center gap-1 pt-6 text-[0.75rem] text-faint">
                Read on Medium <ArrowUpRight aria-hidden className="size-3.5" />
                <span className="sr-only">(opens in a new tab)</span>
              </p>
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-10 grid gap-4 md:grid-cols-12 md:gap-8">
        <h3 className="text-small font-medium text-ink md:col-span-3">Engineering notes</h3>
        <ul className="divide-y divide-rule border-y border-rule md:col-span-9">
          {list.map((n) => (
            <li key={n.slug}>
              <Link href={`/notes/${n.slug}`} className="group flex items-baseline justify-between gap-4 py-3.5">
                <span className="text-small text-ink group-hover:text-signal-ink">{n.title}</span>
                <span className="shrink-0 font-mono text-[0.7rem] text-faint">{readingMinutes(n)} min</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function ContactCTA({ resumeAvailable }: { resumeAvailable: boolean }) {
  return (
    <section aria-labelledby="contact-h" className={`${wrap} pt-32`}>
      <div className="border-t-2 border-ink pt-12">
        <h2 id="contact-h" className="max-w-[24ch] font-display text-[2.5rem] leading-[1.05] text-ink sm:text-[3.6rem]">
          Building something interesting with AI systems? Let&apos;s talk engineering.
        </h2>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a href={`mailto:${site.links.email}`} className="inline-flex min-h-11 items-center rounded-full bg-signal px-6 text-small font-medium text-on-signal hover:bg-signal-ink">
            Email {site.links.email}
          </a>
          <CopyEmail email={site.links.email} />
          {resumeAvailable && (
            <a href={site.resume.path} download={site.resume.fileName} className="inline-flex min-h-11 items-center rounded-full border border-ink px-5 text-small font-medium text-ink hover:bg-ink hover:text-paper">
              Download resume
            </a>
          )}
        </div>
        <SocialLinks className="mt-8" />
      </div>
    </section>
  );
}

