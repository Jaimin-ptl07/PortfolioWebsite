import type { Metadata } from "next";
import { ChevronDown, Star, GitFork } from "lucide-react";
import { additionalProjects, projects } from "@/content/projects";
import { focusAreas } from "@/content/profile";
import { site } from "@/config/site";
import { getRepos } from "@/lib/github";
import { WorkIndex } from "@/components/work/WorkIndex";
import { ExternalLink } from "@/components/ui/Links";
import { ContentTodo } from "@/components/ui/ContentTodo";

export const metadata: Metadata = {
  title: "Work",
  description: "Case studies in document intelligence, engineering knowledge systems, LLM inference infrastructure, retrieval and AI backends, each with architecture, trade-offs and measured results.",
  alternates: { canonical: "/work" },
};

const shortFocus: Record<string, string> = {
  document: "Document intelligence",
  llm: "LLM systems",
  backend: "Backend & distributed",
  retrieval: "Retrieval & agents",
};

export default async function WorkPage() {
  const repos = await getRepos();
  const items = projects.map((p) => ({
    slug: p.slug,
    title: p.title,
    category: p.category,
    status: p.status,
    role: p.role,
    glyph: p.glyph,
    focus: p.focus,
    problem: p.card.problem,
    impact: p.card.impact,
  }));

  return (
    <div className="mx-auto max-w-[84rem] px-5 pt-14 sm:px-8 md:pt-20">
      <header className="max-w-3xl">
        <h1 className="font-display text-[2.6rem] leading-[1.05] text-ink sm:text-h1">Work</h1>
        <p className="mt-5 text-lead text-graphite">
          Six case studies: production systems, internal platforms, independent proofs of concept and research. Each one says which of those it is, what I personally owned and how its results were measured.
        </p>
      </header>

      <div className="mt-12">
        <WorkIndex items={items} filters={focusAreas.map((f) => ({ id: f.id, label: shortFocus[f.id] }))} />
      </div>

      <section aria-labelledby="more-h" className="mt-24">
        <h2 id="more-h" className="font-display text-h2 text-ink">More projects</h2>
        <p className="mt-2 max-w-[60ch] text-graphite">Smaller proofs of concept and pipelines, summarised here rather than written up in full.</p>
        <div className="mt-8 border-t border-rule">
          {additionalProjects.map((a) => (
            <details key={a.slug} id={a.slug} className="group/a border-b border-rule">
              <summary className="grid cursor-pointer gap-2 py-6 md:grid-cols-12 md:items-baseline">
                <span className="font-mono text-[0.72rem] text-faint md:col-span-2">{a.status.toLowerCase()}</span>
                <span className="font-display text-h3 text-ink md:col-span-4">{a.title}</span>
                <span className="text-small text-graphite md:col-span-5">{a.summary}</span>
                <ChevronDown aria-hidden className="hidden size-4 justify-self-end text-graphite transition-transform group-open/a:rotate-180 md:col-span-1 md:block" />
              </summary>
              <div className="grid gap-6 pb-8 md:grid-cols-12">
                <div className="md:col-span-2 md:col-start-3">
                  <p className="font-mono text-[0.7rem] text-faint">role</p>
                  <p className="text-small text-ink">{a.role}</p>
                  {a.organisation && <p className="mt-1 text-[0.78rem] text-graphite">{a.organisation}</p>}
                </div>
                <ul className="space-y-2 md:col-span-5">
                  {a.points.map((pt) => (
                    <li key={pt} className="flex gap-3 text-small text-ink/85">
                      <span className="mt-[0.6rem] h-px w-3 shrink-0 bg-rule-strong" aria-hidden />
                      {pt}
                    </li>
                  ))}
                </ul>
                <p className="font-mono text-[0.75rem] text-graphite md:col-span-3">{a.stack.join(", ")}</p>
                <div className="md:col-span-10 md:col-start-3">
                  <ContentTodo items={a.todo} />
                </div>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section aria-labelledby="code-h" className="mt-24">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 id="code-h" className="font-display text-h2 text-ink">Code</h2>
          <ExternalLink href={site.links.github} className="text-small text-signal-ink">
            github.com/{site.github.username}
          </ExternalLink>
        </div>
        {repos.length > 0 ? (
          <ul className="mt-8 grid gap-px overflow-hidden border border-rule bg-rule md:grid-cols-2 lg:grid-cols-3">
            {repos.map((r) => (
              <li key={r.url} className="bg-paper">
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="flex h-full flex-col p-5 hover:bg-raised">
                  <span className="font-mono text-small text-ink">{r.name}</span>
                  {r.description && <span className="mt-2 text-small text-graphite">{r.description}</span>}
                  <span className="mt-auto flex items-center gap-4 pt-4 font-mono text-[0.72rem] text-faint">
                    {r.language && <span>{r.language}</span>}
                    {r.stars !== undefined && (
                      <span className="inline-flex items-center gap-1"><Star aria-hidden className="size-3" />{r.stars}</span>
                    )}
                    {r.forks !== undefined && (
                      <span className="inline-flex items-center gap-1"><GitFork aria-hidden className="size-3" />{r.forks}</span>
                    )}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 max-w-[60ch] text-graphite">
            Code for client and employer projects isn&apos;t public. My public repositories are on GitHub.
          </p>
        )}
      </section>
    </div>
  );
}
