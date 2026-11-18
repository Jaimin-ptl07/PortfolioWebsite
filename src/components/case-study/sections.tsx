import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import type { Challenge, Decision, Metric, Project, ProjectStatus } from "@/content/types";
import { EvidenceBadge, EvidenceLegend } from "@/components/ui/Evidence";
import { ProjectGlyph } from "@/components/ui/ProjectGlyph";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ExternalLink } from "@/components/ui/Links";
import { CountUp } from "@/components/viz/CountUp";
import { metricValue } from "@/lib/format";
import { getNote, readingMinutes } from "@/content/notes";
import { getProject, projects } from "@/content/projects";

/* ---------------------------------------------------------------- */

export function StatusMark({ status }: { status: ProjectStatus }) {
  const solid = status === "Production" || status === "Internal platform" || status === "Enterprise project" || status === "Client-delivered";
  return (
    <span className="inline-flex items-center gap-2 text-small text-ink">
      <span className={`size-2 rounded-full ${solid ? "bg-ink" : "border border-ink"}`} aria-hidden />
      {status}
    </span>
  );
}

export function CaseSection({ id, index, title, children, lead }: { id: string; index: number; title: string; lead?: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="border-t border-rule pt-10 pb-16 first:border-t-0 first:pt-0">
      <p className="font-mono text-[0.72rem] text-faint">{String(index).padStart(2, "0")}</p>
      <h2 id={`${id}-h`} className="mt-1 font-display text-h2 text-ink">
        {title}
      </h2>
      {lead && <p className="mt-3 max-w-[62ch] text-lead text-graphite">{lead}</p>}
      <div className="mt-8">{children}</div>
    </section>
  );
}

/* ---------------------------------------------------------------- */

export function ProjectHero({ project }: { project: Project }) {
  return (
    <header className="mx-auto max-w-[84rem] px-5 pt-10 sm:px-8 md:pt-16">
      <nav aria-label="Breadcrumb" className="font-mono text-[0.72rem] text-faint">
        <Link href="/work" className="hover:text-ink">work</Link>
        <span className="px-2">/</span>
        <span className="text-graphite">{project.shortTitle.toLowerCase()}</span>
      </nav>
      <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <p className="text-small text-graphite">{project.category}</p>
          <h1 className="mt-3 font-display text-[2.5rem] leading-[1.05] text-ink text-balance sm:text-h1 lg:text-[3.6rem] lg:leading-[1.02]">
            {project.title}
          </h1>
          <p className="mt-6 max-w-[62ch] text-lead text-graphite">{project.subtitle}</p>
        </div>
        <div className="group hidden lg:col-span-4 lg:block">
          <div className="drafting-grid rounded-sm border border-rule p-6">
            <ProjectGlyph id={project.glyph} className="h-auto w-full" />
          </div>
        </div>
      </div>
      <ProjectMetadata project={project} />
    </header>
  );
}

export function ProjectMetadata({ project }: { project: Project }) {
  const rows: [string, React.ReactNode][] = [
    ["Role", project.role],
    ...(project.team ? ([["Team", project.team]] as [string, React.ReactNode][]) : []),
    ...(project.organisation ? ([["Organisation", project.organisation]] as [string, React.ReactNode][]) : []),
    ["Status", <StatusMark key="s" status={project.status} />],
    ...(project.timeline ? ([["Timeline", project.timeline]] as [string, React.ReactNode][]) : []),
    ["Stack", project.techSummary.join(", ")],
  ];
  return (
    <dl className="mt-12 grid grid-cols-1 border-y border-rule sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(11rem,1fr))]">
      {rows.map(([k, v]) => (
        <div key={k} className="border-b border-rule py-4 pr-6 last:border-b-0 sm:border-b-0 lg:border-l lg:pl-5 lg:first:border-l-0 lg:first:pl-0">
          <dt className="font-mono text-[0.7rem] text-faint">{k.toLowerCase()}</dt>
          <dd className="mt-1 text-small text-ink">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ---------------------------------------------------------------- */

export function HeadlineMetrics({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="mx-auto mt-10 max-w-[84rem] px-5 sm:px-8">
      <ul className="grid gap-px overflow-hidden rounded-sm border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <li key={m.label} className="flex flex-col gap-6 bg-paper p-5">
            <p className="text-small text-graphite">{m.label}</p>
            <div className="flex flex-1 flex-col">
              <p className="font-mono text-ink">
                {m.before !== undefined && m.after !== undefined ? (
                  <>
                    <span className="text-lead text-faint line-through decoration-1">{metricValue(m, "before")}</span>
                    <span className="px-1.5 text-faint">→</span>
                    <CountUp value={m.after} decimals={m.decimals ?? 0} className="text-h2" />
                  </>
                ) : (
                  <span className="text-h2">{metricValue(m, "value")}</span>
                )}
                <span className="ml-1.5 text-small text-graphite">{m.unit}</span>
              </p>
              <p className="mt-2 text-[0.78rem] leading-snug text-graphite">{m.context}</p>
              <EvidenceBadge kind={m.evidence} className="mt-auto pt-3" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------------------------------------------------------- */

export function Prose({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="prose-body text-body text-ink/90">
      {paragraphs.map((p) => (
        <p key={p.slice(0, 40)}>{p}</p>
      ))}
    </div>
  );
}

export function ProblemStatement({ problem }: { problem: Project["problem"] }) {
  return (
    <div className="space-y-10">
      <Prose paragraphs={problem.context} />
      <dl className="grid gap-6 border-l-2 border-signal pl-6 md:grid-cols-2">
        <div>
          <dt className="font-mono text-[0.7rem] text-faint">who experienced it</dt>
          <dd className="mt-1 text-small text-ink">{problem.who}</dd>
        </div>
        <div>
          <dt className="font-mono text-[0.7rem] text-faint">why it mattered</dt>
          <dd className="mt-1 text-small text-ink">{problem.why}</dd>
        </div>
        {problem.previous && (
          <div className="md:col-span-2">
            <dt className="font-mono text-[0.7rem] text-faint">previous approach</dt>
            <dd className="mt-1 text-small text-ink">{problem.previous}</dd>
          </div>
        )}
      </dl>
      {(problem.functional || problem.nonFunctional) && (
        <div className="grid gap-8 md:grid-cols-2">
          {problem.functional && <ReqList title="Functional requirements" items={problem.functional} />}
          {problem.nonFunctional && <ReqList title="Non-functional requirements" items={problem.nonFunctional} />}
        </div>
      )}
      {problem.constraints && <ReqList title="Constraints" items={problem.constraints} />}
    </div>
  );
}

function ReqList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-small font-medium text-ink">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((i) => (
          <li key={i} className="flex gap-3 text-small text-graphite">
            <span className="mt-[0.6rem] h-px w-3 shrink-0 bg-rule-strong" aria-hidden />
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------------------------------------------------------- */

export function ContributionSection({ c }: { c: Project["contribution"] }) {
  const cols: { title: string; items?: string[]; mine: boolean }[] = [
    { title: "I designed", items: c.designed, mine: true },
    { title: "I implemented", items: c.implemented, mine: true },
    { title: "I led", items: c.led, mine: true },
    { title: "The team delivered", items: c.team, mine: false },
    { title: "Depended on", items: c.dependencies, mine: false },
  ];
  return (
    <div className="grid gap-px overflow-hidden rounded-sm border border-rule bg-rule md:grid-cols-2">
      {cols
        .filter((col) => col.items?.length)
        .map((col) => (
          <div key={col.title} className={`p-5 ${col.mine ? "bg-raised" : "bg-paper"}`}>
            <h3 className={`flex items-center gap-2 text-small font-medium ${col.mine ? "text-ink" : "text-graphite"}`}>
              <span className={`size-2 rounded-full ${col.mine ? "bg-signal" : "border border-graphite"}`} aria-hidden />
              {col.title}
            </h3>
            <ul className="mt-3 space-y-2">
              {col.items!.map((i) => (
                <li key={i} className={`text-small ${col.mine ? "text-ink/85" : "text-graphite"}`}>
                  {i}
                </li>
              ))}
            </ul>
          </div>
        ))}
    </div>
  );
}

/* ---------------------------------------------------------------- */

export function EngineeringDecision({ d, index, open }: { d: Decision; index: number; open?: boolean }) {
  return (
    <details className="group/d border-b border-rule" open={open}>
      <summary className="flex cursor-pointer items-start gap-5 py-5">
        <span className="mt-1 font-mono text-[0.72rem] text-faint">D{index}</span>
        <span className="flex-1">
          <span className="block font-display text-h3 text-ink">{d.title}</span>
          <span className="mt-1 block text-small text-graphite">{d.choice}</span>
        </span>
        <ChevronDown aria-hidden className="mt-2 size-4 shrink-0 text-graphite transition-transform group-open/d:rotate-180" />
      </summary>
      <div className="grid gap-8 pb-8 pl-0 md:grid-cols-2 md:pl-10">
        <div className="md:col-span-2">
          <p className="font-mono text-[0.7rem] text-faint">context</p>
          <p className="mt-1 max-w-[68ch] text-small text-ink">{d.context}</p>
        </div>
        <div>
          <p className="font-mono text-[0.7rem] text-faint">why this approach</p>
          <ul className="mt-2 space-y-2">
            {d.rationale.map((r) => (
              <li key={r} className="flex gap-3 text-small text-ink/85">
                <span className="mt-[0.45rem] size-1.5 shrink-0 rounded-full bg-signal" aria-hidden />
                {r}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-mono text-[0.7rem] text-faint">what it costs</p>
          <ul className="mt-2 space-y-2">
            {d.tradeoffs.map((r) => (
              <li key={r} className="flex gap-3 text-small text-ink/85">
                <span className="mt-[0.45rem] size-1.5 shrink-0 rounded-full border border-ink" aria-hidden />
                {r}
              </li>
            ))}
          </ul>
        </div>
        {d.alternatives?.length ? (
          <div className="md:col-span-2">
            <p className="font-mono text-[0.7rem] text-faint">alternatives weighed</p>
            <ul className="mt-2 space-y-2">
              {d.alternatives.map((a) => (
                <li key={a.option} className="text-small text-ink/85">
                  <span className="font-medium">{a.option}:</span> {a.note}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {d.revisit && (
          <div className="md:col-span-2 border-l-2 border-rule-strong pl-4">
            <p className="font-mono text-[0.7rem] text-faint">if I rebuilt it today</p>
            <p className="mt-1 text-small text-ink">{d.revisit}</p>
          </div>
        )}
      </div>
    </details>
  );
}

/* ---------------------------------------------------------------- */

export function ChallengeBreakdown({ c, index, open }: { c: Challenge; index: number; open?: boolean }) {
  const steps = [
    { k: "What failed", v: c.problem },
    { k: "Why", v: c.cause },
    { k: "How it was diagnosed", v: c.diagnosis },
    { k: "What I did", v: c.solution },
    { k: "What changed", v: c.outcome },
  ].filter((s): s is { k: string; v: string } => Boolean(s.v));
  return (
    <details className="group/c rounded-sm border border-rule bg-raised" open={open}>
      <summary className="flex cursor-pointer items-center gap-4 px-5 py-4">
        <span className="font-mono text-[0.72rem] text-faint">C{index}</span>
        <span className="flex-1 font-medium text-ink">{c.title}</span>
        <ChevronDown aria-hidden className="size-4 text-graphite transition-transform group-open/c:rotate-180" />
      </summary>
      <ol className="relative mx-5 mb-5 border-l border-rule pl-6">
        {steps.map((s, i) => (
          <li key={s.k} className="relative pb-5 last:pb-1">
            <span
              className={`absolute -left-[1.83rem] top-1.5 size-[0.7rem] rounded-full border ${i === steps.length - 1 ? "border-signal bg-signal" : "border-rule-strong bg-paper"}`}
              aria-hidden
            />
            <p className="font-mono text-[0.7rem] text-faint">{s.k.toLowerCase()}</p>
            <p className="mt-0.5 max-w-[68ch] text-small text-ink/90">{s.v}</p>
          </li>
        ))}
      </ol>
    </details>
  );
}

/* ---------------------------------------------------------------- */

export function ImplementationSection({ blocks }: { blocks: Project["implementation"] }) {
  return (
    <div className="space-y-10">
      {blocks.map((b) => (
        <div key={b.title} className="grid grid-cols-1 gap-3 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-8">
          <h3 className="text-small font-medium text-ink">{b.title}</h3>
          <div className="min-w-0">
            <Prose paragraphs={b.body} />
            {b.points && (
              <ul className="mt-4 space-y-2">
                {b.points.map((p) => (
                  <li key={p} className="flex gap-3 text-small text-graphite">
                    <span className="mt-[0.6rem] h-px w-3 shrink-0 bg-rule-strong" aria-hidden />
                    {p}
                  </li>
                ))}
              </ul>
            )}
            {b.code && <CodeBlock {...b.code} />}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- */

export function SingleMetrics({ metrics }: { metrics: Metric[] }) {
  const singles = metrics.filter((m) => m.value !== undefined);
  if (!singles.length) return null;
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {singles.map((m) => (
        <li key={m.label} className="rounded-sm border border-rule bg-paper p-5">
          <p className="font-mono text-h3 text-ink">
            {m.value}
            {m.unit && <span className="ml-1.5 text-small text-graphite">{m.unit}</span>}
          </p>
          <p className="mt-1 text-small font-medium text-ink">{m.label}</p>
          <p className="mt-1 text-[0.78rem] text-graphite">{m.context}</p>
          {m.note && <p className="mt-1 text-[0.78rem] text-graphite">Note: {m.note}</p>}
          <EvidenceBadge kind={m.evidence} className="mt-3" />
        </li>
      ))}
    </ul>
  );
}

export function Caveats({ items }: { items: string[] }) {
  return (
    <aside className="rounded-sm border border-ink/80 p-5" aria-label="Methodology caveats">
      <p className="text-small font-medium text-ink">Read before comparing</p>
      <ul className="mt-3 space-y-2">
        {items.map((c) => (
          <li key={c} className="flex gap-3 text-small text-ink/85">
            <span className="mt-[0.45rem] size-1.5 shrink-0 rotate-45 border border-ink" aria-hidden />
            {c}
          </li>
        ))}
      </ul>
    </aside>
  );
}

export function EvidenceKey({ project }: { project: Project }) {
  const kinds = Array.from(new Set([...(project.results.headline ?? []), ...project.results.metrics].map((m) => m.evidence)));
  return (
    <details className="rounded-sm border border-rule px-5 py-4">
      <summary className="cursor-pointer text-small text-graphite hover:text-ink">How to read the evidence labels</summary>
      <div className="mt-4">
        <EvidenceLegend kinds={kinds} />
      </div>
    </details>
  );
}

/* ---------------------------------------------------------------- */

export function LessonsLearned({ lessons }: { lessons: Project["lessons"] }) {
  return (
    <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
      {lessons.map((l) => (
        <div key={l.title}>
          <h3 className="font-display text-h3 text-ink">{l.title}</h3>
          <p className="mt-2 text-small text-graphite">{l.body}</p>
        </div>
      ))}
    </div>
  );
}

export function TechStack({ stack }: { stack: Project["stack"] }) {
  return (
    <table className="w-full border-collapse text-left text-small">
      <caption className="sr-only">Technologies by purpose</caption>
      <thead>
        <tr className="border-b border-rule font-mono text-[0.7rem] text-faint">
          <th scope="col" className="w-[11rem] py-2 pr-4 font-normal">purpose</th>
          <th scope="col" className="py-2 pr-4 font-normal">tool</th>
          <th scope="col" className="hidden py-2 font-normal sm:table-cell">used for</th>
        </tr>
      </thead>
      <tbody>
        {stack.flatMap((g) =>
          g.items.map((it, i) => (
            <tr key={`${g.purpose}-${it.name}`} className="border-b border-rule align-top">
              <th scope="row" className="py-3 pr-4 font-normal text-graphite">{i === 0 ? g.purpose : <span className="sr-only">{g.purpose}</span>}</th>
              <td className="py-3 pr-4 text-ink">
                {it.name}
                <span className="mt-0.5 block text-[0.78rem] text-graphite sm:hidden">{it.use}</span>
              </td>
              <td className="hidden py-3 text-graphite sm:table-cell">{it.use}</td>
            </tr>
          )),
        )}
      </tbody>
    </table>
  );
}

/* ---------------------------------------------------------------- */

export function RelatedWriting({ project }: { project: Project }) {
  const notes = (project.related?.notes ?? []).map(getNote).filter((n): n is NonNullable<typeof n> => Boolean(n));
  const rel = (project.related?.projects ?? []).map(getProject).filter((p): p is Project => Boolean(p));
  return (
    <div className="space-y-10">
      {project.evidence.length > 0 ? (
        <ul className="space-y-2">
          {project.evidence.map((e) => (
            <li key={e.url}>
              <ExternalLink href={e.url} className="text-signal-ink">
                {e.label} <span className="font-mono text-[0.7rem] text-faint">{e.kind}</span>
              </ExternalLink>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-small text-graphite">No external links are listed for this project. The write-ups below are based on its measured results.</p>
      )}
      {notes.length > 0 && (
        <div>
          <h3 className="text-small font-medium text-ink">Engineering notes</h3>
          <ul className="mt-3 divide-y divide-rule border-y border-rule">
            {notes.map((n) => (
              <li key={n.slug}>
                <Link href={`/notes/${n.slug}`} className="group flex items-baseline justify-between gap-4 py-4">
                  <span className="text-ink group-hover:text-signal-ink">{n.title}</span>
                  <span className="shrink-0 font-mono text-[0.7rem] text-faint">{readingMinutes(n)} min</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {rel.length > 0 && (
        <div>
          <h3 className="text-small font-medium text-ink">Related case studies</h3>
          <ul className="mt-3 flex flex-wrap gap-3">
            {rel.map((p) => (
              <li key={p.slug}>
                <Link href={`/work/${p.slug}`} className="inline-flex rounded-full border border-rule-strong px-4 py-1.5 text-small text-ink hover:border-ink">
                  {p.shortTitle}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function ProjectNavigation({ project }: { project: Project }) {
  const i = projects.findIndex((p) => p.slug === project.slug);
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];
  return (
    <nav aria-label="More case studies" className="mx-auto mt-8 grid max-w-[84rem] gap-px border-y border-rule bg-rule px-0 sm:grid-cols-2">
      <Link href={`/work/${prev.slug}`} className="group bg-paper px-5 py-8 sm:px-8">
        <span className="flex items-center gap-2 font-mono text-[0.7rem] text-faint"><ArrowLeft className="size-3.5" /> previous</span>
        <span className="mt-2 block font-display text-h3 text-ink group-hover:text-signal-ink">{prev.shortTitle}</span>
      </Link>
      <Link href={`/work/${next.slug}`} className="group bg-paper px-5 py-8 text-right sm:px-8">
        <span className="flex items-center justify-end gap-2 font-mono text-[0.7rem] text-faint">next <ArrowRight className="size-3.5" /></span>
        <span className="mt-2 block font-display text-h3 text-ink group-hover:text-signal-ink">{next.shortTitle}</span>
      </Link>
    </nav>
  );
}
