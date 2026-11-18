import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { notes, readingMinutes } from "@/content/notes";
import { recentArticles, earlierArticles, formatArticleDate } from "@/content/articles";
import { getProject } from "@/content/projects";
import { site } from "@/config/site";
import { ExternalLink } from "@/components/ui/Links";

export const metadata: Metadata = {
  title: "Writing: articles and engineering notes",
  description:
    "Articles on document intelligence, retrieval and backend performance, plus measured engineering notes on vLLM scheduling, concurrency trade-offs, hybrid retrieval and deterministic boundaries.",
  alternates: { canonical: "/notes" },
};

export default function NotesPage() {
  const topics = Array.from(new Set(notes.map((n) => n.topic)));
  return (
    <div className="mx-auto max-w-[84rem] px-5 pt-14 sm:px-8 md:pt-20">
      <header className="max-w-3xl">
        <h1 className="font-display text-[2.6rem] leading-[1.05] text-ink sm:text-h1">Writing</h1>
        <p className="mt-5 text-lead text-graphite">
          Long-form articles on Medium about how AI systems behave once they leave the notebook, and shorter notes on changes I measured on real systems.
        </p>
      </header>

      <section aria-labelledby="articles-h" className="mt-16">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 id="articles-h" className="font-display text-h2 text-ink">Articles</h2>
          {site.links.medium && (
            <ExternalLink href={site.links.medium} className="text-small text-signal-ink">
              All on Medium
            </ExternalLink>
          )}
        </div>
        <ol className="mt-6 border-t border-ink">
          {recentArticles.map((a) => (
            <li key={a.id} className="grid gap-4 border-b border-rule py-9 md:grid-cols-12 md:gap-8">
              <p className="font-mono text-[0.72rem] leading-relaxed text-faint md:col-span-2">
                <time dateTime={a.date}>{formatArticleDate(a.date)}</time>
                <span className="block">{a.topic.toLowerCase()}</span>
              </p>
              <div className="md:col-span-6">
                <h3 className="font-display text-h3 text-ink">
                  <a href={a.url} target="_blank" rel="noopener noreferrer" className="group hover:text-signal-ink">
                    {a.title}
                    <ArrowUpRight aria-hidden className="ml-1 inline size-4 align-[-0.1em] opacity-50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    <span className="sr-only"> (opens Medium in a new tab)</span>
                  </a>
                </h3>
                <p className="mt-3 max-w-[62ch] text-small text-graphite">{a.summary}</p>
              </div>
              {a.quote && (
                <blockquote className="border-l-2 border-signal pl-5 md:col-span-4 md:self-center">
                  <p className="font-display text-[1.2rem] italic leading-snug text-ink">{a.quote}</p>
                </blockquote>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="notes-h" className="mt-24">
        <h2 id="notes-h" className="font-display text-h2 text-ink">Engineering notes</h2>
        <p className="mt-3 max-w-[60ch] text-body text-graphite">
          Short write-ups of changes I measured: what I changed, what moved, what it cost and what the numbers don&apos;t prove.
        </p>
        {topics.map((topic) => (
          <div key={topic} className="mt-12">
            <h3 className="font-mono text-[0.75rem] text-faint">{topic.toLowerCase()}</h3>
            <ul className="mt-4 border-t border-rule">
              {notes
                .filter((n) => n.topic === topic)
                .map((n) => {
                  const p = n.project ? getProject(n.project) : undefined;
                  return (
                    <li key={n.slug} className="border-b border-rule">
                      <Link href={`/notes/${n.slug}`} className="group grid gap-3 py-7 md:grid-cols-12 md:gap-8">
                        <span className="font-display text-h3 text-ink group-hover:text-signal-ink md:col-span-5">{n.title}</span>
                        <span className="text-small text-graphite md:col-span-5">{n.summary}</span>
                        <span className="font-mono text-[0.72rem] text-faint md:col-span-2 md:text-right">
                          {readingMinutes(n)} min read
                          {p && <span className="block">{p.shortTitle}</span>}
                        </span>
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </div>
        ))}
      </section>

      {earlierArticles.length > 0 && (
        <section aria-labelledby="earlier-h" className="mt-24">
          <h2 id="earlier-h" className="font-display text-h3 text-ink">Earlier writing</h2>
          <ul className="mt-4 border-t border-rule">
            {earlierArticles.map((a) => (
              <li key={a.id} className="grid gap-1 border-b border-rule py-4 md:grid-cols-12 md:gap-8">
                <p className="font-mono text-[0.72rem] text-faint md:col-span-2">
                  <time dateTime={a.date}>{formatArticleDate(a.date)}</time>
                </p>
                <a href={a.url} target="_blank" rel="noopener noreferrer" className="group text-small text-ink hover:text-signal-ink md:col-span-4">
                  {a.title}
                  <ArrowUpRight aria-hidden className="ml-1 inline size-3.5 align-[-0.15em] opacity-50" />
                  <span className="sr-only"> (opens Medium in a new tab)</span>
                </a>
                <p className="text-small text-graphite md:col-span-6">{a.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
