import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNote, notes, readingMinutes } from "@/content/notes";
import { getProject } from "@/content/projects";
import { absoluteUrl, site } from "@/config/site";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { MetricComparison } from "@/components/viz/MetricComparison";
import { ExternalLink } from "@/components/ui/Links";

export function generateStaticParams() {
  return notes.map((n) => ({ slug: n.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/notes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const n = getNote(slug);
  if (!n) return {};
  return {
    title: n.title,
    description: n.summary,
    alternates: { canonical: n.externalUrl ?? `/notes/${n.slug}` },
    openGraph: { type: "article", title: n.title, description: n.summary, url: absoluteUrl(`/notes/${n.slug}`) },
    twitter: { card: "summary_large_image", title: n.title, description: n.summary },
  };
}

export default async function NotePage({ params }: PageProps<"/notes/[slug]">) {
  const { slug } = await params;
  const n = getNote(slug);
  if (!n) notFound();
  const project = n.project ? getProject(n.project) : undefined;
  const others = notes.filter((x) => x.slug !== n.slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: n.title,
    description: n.summary,
    author: { "@type": "Person", name: site.name, url: site.url },
    url: absoluteUrl(`/notes/${n.slug}`),
    ...(n.date ? { datePublished: n.date } : {}),
  };

  return (
    <article className="mx-auto max-w-[84rem] px-5 pt-14 sm:px-8 md:pt-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-[44rem]">
        <nav aria-label="Breadcrumb" className="font-mono text-[0.72rem] text-faint">
          <Link href="/notes" className="hover:text-ink">notes</Link>
          <span className="px-2">/</span>
          <span className="text-graphite">{n.topic.toLowerCase()}</span>
        </nav>
        <h1 className="mt-6 font-display text-[2.3rem] leading-[1.08] text-ink text-balance sm:text-[3rem]">{n.title}</h1>
        <p className="mt-5 text-lead text-graphite">{n.summary}</p>
        <p className="mt-6 flex flex-wrap gap-x-5 gap-y-1 border-y border-rule py-3 font-mono text-[0.72rem] text-graphite">
          <span>{readingMinutes(n)} min read</span>
          <span>{n.platform}</span>
          {n.date && <time dateTime={n.date}>{n.date}</time>}
          {project && (
            <Link href={`/work/${project.slug}`} className="text-signal-ink">
              from the {project.shortTitle} case study
            </Link>
          )}
        </p>

        <div className="mt-10 space-y-6">
          {n.blocks.map((b, i) => {
            switch (b.type) {
              case "p":
                return <p key={i} className="text-body text-ink/90">{b.text}</p>;
              case "h":
                return <h2 key={i} className="pt-4 font-display text-h3 text-ink">{b.text}</h2>;
              case "list":
                return b.ordered ? (
                  <ol key={i} className="list-decimal space-y-2 pl-6 text-ink/90">{b.items.map((it) => <li key={it}>{it}</li>)}</ol>
                ) : (
                  <ul key={i} className="space-y-2">
                    {b.items.map((it) => (
                      <li key={it} className="flex gap-3 text-ink/90">
                        <span className="mt-[0.8rem] h-px w-3 shrink-0 bg-rule-strong" aria-hidden />
                        {it}
                      </li>
                    ))}
                  </ul>
                );
              case "code":
                return <CodeBlock key={i} language={b.language} source={b.source} caption={b.caption} />;
              case "callout":
                return (
                  <aside key={i} className="border-l-2 border-signal bg-raised px-5 py-4">
                    <p className="text-small font-medium text-ink">{b.title}</p>
                    <p className="mt-1 text-small text-ink/85">{b.text}</p>
                  </aside>
                );
              case "metrics":
                return (
                  <div key={i} className="md:-mx-16">
                    <MetricComparison metrics={b.metrics} />
                  </div>
                );
            }
          })}
        </div>

        {n.externalUrl && (
          <p className="mt-10 text-small text-graphite">
            Also published on{" "}
            <ExternalLink href={n.externalUrl} className="text-signal-ink">
              {n.platform}
            </ExternalLink>
          </p>
        )}
      </div>

      <aside aria-labelledby="more-notes" className="mx-auto mt-24 max-w-[60rem] border-t border-rule pt-10">
        <h2 id="more-notes" className="font-mono text-[0.75rem] text-faint">more notes</h2>
        <ul className="mt-4 grid gap-6 md:grid-cols-3">
          {others.map((o) => (
            <li key={o.slug}>
              <Link href={`/notes/${o.slug}`} className="group block">
                <span className="font-display text-lead text-ink group-hover:text-signal-ink">{o.title}</span>
                <span className="mt-1 block font-mono text-[0.7rem] text-faint">{readingMinutes(o)} min read</span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </article>
  );
}
