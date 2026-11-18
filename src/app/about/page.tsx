import type { Metadata } from "next";
import Link from "next/link";
import { certifications, education, journey, principles } from "@/content/profile";
import { getProject } from "@/content/projects";
import { Timeline, type TimelineItem } from "@/components/about/Timeline";
import { ResumeLink, SocialLinks } from "@/components/ui/Links";
import { resumeAvailable } from "@/lib/assets";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "About",
  description: "Jaimin Patel's engineering journey: Computer Engineering at CHARUSAT, research at SAC-ISRO, and applied AI systems at Silver Touch Technologies.",
  alternates: { canonical: "/about" },
};

const interests = [
  {
    title: "Systems, not isolated models",
    body: "A model is one component. Whether it helps depends on ingestion, retrieval, validation, serving and the failure paths around it, so that is where most of my work goes.",
  },
  {
    title: "Reliable document and data processing",
    body: "Documents of 1,000 to 2,500+ pages make every shortcut visible. Idempotency, checkpointing and provenance turn a pipeline that works once into one that keeps working.",
  },
  {
    title: "LLM serving and inference performance",
    body: "Serving a 31B model showed me how much of latency is scheduling and queueing. I like the problems where a measured change in one setting moves three other numbers.",
  },
  {
    title: "Backend architecture under real constraints",
    body: "Modular monoliths, task queues, circuit breakers and typed interfaces: choices that only make sense once the workload, team and failure modes are known.",
  },
];

export default function AboutPage() {
  const timeline: TimelineItem[] = [
    {
      when: "Oct 2025 – present",
      title: "AI/ML Engineer",
      org: "Silver Touch Technologies Ltd.",
      body: "Leading the IDP platform, owning PARAKH's unstructured-data and knowledge architecture, and running self-hosted Gemma 4 31B inference on an AMD MI300X. Also sole developer on tender-AI and agentic-analytics proofs of concept.",
      links: ["intelligent-document-processing", "parakh", "gemma-4-inference"].map((s) => ({ href: `/work/${s}`, label: getProject(s)!.shortTitle })),
      current: true,
    },
    {
      when: "Independent",
      title: "Independent projects",
      org: "Financial Document Intelligence, Finqora",
      body: "Where I test ideas end to end: a content-addressed processing DAG, hybrid retrieval experiments, and deterministic boundaries around LLM assistants.",
      links: [
        { href: "/work/financial-document-intelligence", label: "FDI" },
        { href: "/work/finqora", label: "Finqora" },
      ],
    },
    {
      when: "May 2024 – May 2025",
      title: "Research Intern",
      org: "Space Applications Centre (SAC), ISRO",
      body: "Developed discharge-bracketed interpolation and per-pixel regression for Ganga flood-inundation prediction, with Python tooling over rasters of up to about 43 million pixels.",
      links: [{ href: "/work/sac-isro-flood-inundation", label: "Flood research case study" }],
    },
    {
      when: "Sep 2021 – Apr 2025",
      title: education.degree,
      org: `${education.institution}, CGPA ${education.cgpa}`,
      body: "B.Tech in Computer Engineering, graduating with a CGPA of 8.81. The research internship at SAC-ISRO ran alongside the final year.",
    },
  ];

  return (
    <div className="mx-auto max-w-[84rem] px-5 pt-14 sm:px-8 md:pt-20">
      <header className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-8">
          <h1 className="font-display text-[2.6rem] leading-[1.05] text-ink sm:text-h1">About</h1>
          <div className="prose-body mt-6 text-lead text-graphite">
            <p>
              I&apos;m Jaimin Patel, an applied AI engineer based in {site.location}. I studied Computer Engineering at Charotar University of Science and Technology (CHARUSAT) and now work as an AI/ML Engineer at Silver Touch Technologies, where I build document-intelligence platforms, engineering knowledge systems and self-hosted LLM infrastructure.
            </p>
            <p>Before that, I spent a year as a research intern at the Space Applications Centre, ISRO, working on flood-inundation prediction for the Ganga.</p>
          </div>
        </div>
        <aside className="space-y-5 md:col-span-4 md:pt-4">
          <ResumeLink />
          <SocialLinks className="flex-col !items-start" />
          {!resumeAvailable() && <p className="text-small text-graphite">Resume available on request.</p>}
        </aside>
      </header>

      <section aria-labelledby="journey-h" className="mt-24">
        <h2 id="journey-h" className="font-display text-h2 text-ink">How I got here</h2>
        <ol className="mt-10 grid gap-px overflow-hidden border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
          {journey.map((j, i) => (
            <li key={j.title} className="flex flex-col bg-paper p-6">
              <span className="font-mono text-[0.72rem] text-faint">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 font-display text-h3 text-ink">{j.title}</h3>
              <p className="mt-2 text-small text-graphite">{j.body}</p>
              {j.project && (
                <Link href={`/work/${j.project}`} className="mt-auto pt-5 text-small text-signal-ink link-underline self-start">
                  {getProject(j.project)?.shortTitle}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="interests-h" className="mt-24 grid gap-10 md:grid-cols-12">
        <h2 id="interests-h" className="font-display text-h2 text-ink md:col-span-4">What I&apos;m drawn to, and why</h2>
        <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 md:col-span-8">
          {interests.map((it) => (
            <div key={it.title}>
              <h3 className="font-medium text-ink">{it.title}</h3>
              <p className="mt-2 text-small text-graphite">{it.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="principles-h" className="mt-24">
        <h2 id="principles-h" className="font-display text-h2 text-ink">Principles, shown in the work</h2>
        <p className="mt-3 max-w-[58ch] text-graphite">Each principle links to the project where it shaped a decision.</p>
        <ul className="mt-10 border-t border-rule">
          {principles.map((p) => (
            <li key={p.title} className="grid gap-3 border-b border-rule py-6 md:grid-cols-12 md:gap-8">
              <h3 className="font-display text-h3 text-ink md:col-span-5">{p.title}</h3>
              <p className="text-small text-graphite md:col-span-5">{p.body}</p>
              <Link href={`/work/${p.project}`} className="text-small text-signal-ink link-underline md:col-span-2 md:justify-self-end">
                {p.projectLabel}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="timeline-h" className="mt-24">
        <h2 id="timeline-h" className="font-display text-h2 text-ink">Experience and education</h2>
        <div className="mt-12">
          <Timeline items={timeline} />
        </div>
      </section>

      <section aria-labelledby="certs-h" className="mt-24 grid gap-8 md:grid-cols-12">
        <h2 id="certs-h" className="font-display text-h3 text-ink md:col-span-4">Certifications and languages</h2>
        <ul className="space-y-2 md:col-span-8">
          {certifications.map((c) => (
            <li key={c.name} className="flex flex-wrap justify-between gap-2 border-b border-rule pb-2 text-small">
              <span className="text-ink">{c.name}</span>
              <span className="font-mono text-[0.75rem] text-graphite">
                {c.issuer}, {c.year}
              </span>
            </li>
          ))}
          <li className="flex flex-wrap justify-between gap-2 pt-1 text-small">
            <span className="text-ink">English, Hindi, Gujarati</span>
            <span className="font-mono text-[0.75rem] text-graphite">languages</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
