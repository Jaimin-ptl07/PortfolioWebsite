import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/content/projects";
import { absoluteUrl, site } from "@/config/site";
import { ArchitectureDiagram } from "@/components/case-study/ArchitectureDiagram";
import { SectionNav } from "@/components/case-study/SectionNav";
import {
  CaseSection,
  Caveats,
  ChallengeBreakdown,
  ContributionSection,
  EngineeringDecision,
  EvidenceKey,
  HeadlineMetrics,
  ImplementationSection,
  LessonsLearned,
  ProblemStatement,
  ProjectHero,
  ProjectNavigation,
  Prose,
  RelatedWriting,
  SingleMetrics,
  TechStack,
} from "@/components/case-study/sections";
import { MetricComparison } from "@/components/viz/MetricComparison";
import { Viz } from "@/components/viz/registry";
import { ContentTodo } from "@/components/ui/ContentTodo";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  const description = `${p.card.problem} ${p.card.solution}`;
  return {
    title: p.shortTitle,
    description,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: { type: "article", title: `${p.title} | ${site.name}`, description, url: absoluteUrl(`/work/${p.slug}`) },
    twitter: { card: "summary_large_image", title: p.title, description },
  };
}

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "problem", label: "The problem" },
  { id: "role", label: "My role" },
  { id: "architecture", label: "Architecture" },
  { id: "decisions", label: "Decisions & trade-offs" },
  { id: "challenges", label: "Challenges" },
  { id: "implementation", label: "Implementation" },
  { id: "results", label: "Results" },
  { id: "lessons", label: "What I learned" },
  { id: "stack", label: "Technologies" },
  { id: "evidence", label: "Further reading" },
];

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const comparisons = p.results.metrics.filter((m) => m.before !== undefined && m.after !== undefined);
  // These visualisations already plot every before → after metric of their project.
  const coveredByViz = p.results.viz?.some((v) => v === "gemma-batched" || v === "fdi-recall");
  const tableRows = coveredByViz ? [] : comparisons;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: p.title,
    description: p.subtitle,
    author: { "@type": "Person", name: site.name, url: site.url },
    url: absoluteUrl(`/work/${p.slug}`),
    about: p.category,
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProjectHero project={p} />
      {p.results.headline && <HeadlineMetrics metrics={p.results.headline} />}

      <div className="mx-auto mt-16 grid max-w-[84rem] gap-10 px-5 sm:px-8 lg:grid-cols-[12.5rem_minmax(0,1fr)] lg:gap-16">
        <aside className="hidden lg:block">
          <SectionNav sections={SECTIONS} />
        </aside>

        <div className="min-w-0 max-w-[60rem]">
          <ContentTodo items={p.todo} title={`Content needed for ${p.shortTitle}`} />

          <CaseSection id="overview" index={1} title="Overview">
            <Prose paragraphs={p.overview} />
          </CaseSection>

          <CaseSection id="problem" index={2} title="The problem">
            <ProblemStatement problem={p.problem} />
          </CaseSection>

          <CaseSection id="role" index={3} title="My role and ownership" lead="What I personally owned, separated from what the team and other systems delivered.">
            <ContributionSection c={p.contribution} />
          </CaseSection>

          <CaseSection id="architecture" index={4} title="Architecture and system design">
            <Prose paragraphs={p.architecture.intro} />
            <ArchitectureDiagram diagram={p.architecture.diagram} figure={1} />
            {p.architecture.notes?.map((n) => (
              <div key={n.title} className="mt-6 border-l-2 border-rule-strong pl-5">
                <p className="text-small font-medium text-ink">{n.title}</p>
                <p className="mt-1 max-w-[68ch] text-small text-graphite">{n.body}</p>
              </div>
            ))}
          </CaseSection>

          <CaseSection id="decisions" index={5} title="Engineering decisions and trade-offs" lead="Each decision with its reasoning and what it cost.">
            <div className="border-t border-rule">
              {p.decisions.map((d, i) => (
                <EngineeringDecision key={d.title} d={d} index={i + 1} open={i === 0} />
              ))}
            </div>
          </CaseSection>

          <CaseSection id="challenges" index={6} title="Technical challenges">
            <div className="space-y-3">
              {p.challenges.map((c, i) => (
                <ChallengeBreakdown key={c.title} c={c} index={i + 1} open={i === 0} />
              ))}
            </div>
          </CaseSection>

          <CaseSection id="implementation" index={7} title="Implementation">
            <ImplementationSection blocks={p.implementation} />
          </CaseSection>

          <CaseSection id="results" index={8} title="Performance, results and impact">
            <Prose paragraphs={p.results.intro} />
            {p.results.caveats && (
              <div className="mt-8">
                <Caveats items={p.results.caveats} />
              </div>
            )}
            <div className="mt-8 space-y-8">
              {p.results.viz?.map((v) => <Viz key={v} id={v} project={p} />)}
              {tableRows.length > 0 && <MetricComparison title="Measured changes" metrics={tableRows} />}
              <SingleMetrics metrics={p.results.metrics} />
              <EvidenceKey project={p} />
            </div>
          </CaseSection>

          <CaseSection id="lessons" index={9} title="What I learned">
            <LessonsLearned lessons={p.lessons} />
          </CaseSection>

          <CaseSection id="stack" index={10} title="Technologies, by purpose">
            <TechStack stack={p.stack} />
          </CaseSection>

          <CaseSection id="evidence" index={11} title="Evidence and further reading">
            <RelatedWriting project={p} />
          </CaseSection>
        </div>
      </div>

      <ProjectNavigation project={p} />
    </article>
  );
}
