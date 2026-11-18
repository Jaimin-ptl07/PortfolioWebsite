import type { Metadata } from "next";
import Link from "next/link";
import { notes, readingMinutes } from "@/content/notes";
import { getProject } from "@/content/projects";
import { site } from "@/config/site";
import { ExternalLink } from "@/components/ui/Links";

export const metadata: Metadata = {
  title: "Engineering notes and experiments",
  description: "Measured engineering notes on LLM inference, retrieval and AI system design: vLLM scheduling, concurrency trade-offs, hybrid retrieval and deterministic boundaries.",
  alternates: { canonical: "/notes" },
};

export default function NotesPage() {
  const topics = Array.from(new Set(notes.map((n) => n.topic)));
  return (
    <div className="mx-auto max-w-[84rem] px-5 pt-14 sm:px-8 md:pt-20">
      <header className="max-w-3xl">
        <h1 className="font-display text-[2.6rem] leading-[1.05] text-ink sm:text-h1">Engineering notes and experiments</h1>
        <p className="mt-5 text-lead text-graphite">
          Short write-ups of changes I measured on real systems: what I changed, what moved, what it cost and what the numbers don&apos;t prove.
        </p>
      </header>

      {topics.map((topic) => (
        <section key={topic} aria-labelledby={`t-${topic}`} className="mt-16">
          <h2 id={`t-${topic}`} className="font-mono text-[0.75rem] text-faint">{topic.toLowerCase()}</h2>
          <ul className="mt-4 border-t border-rule">
            {notes
              .filter((n) => n.topic === topic)
              .map((n) => {
                const p = n.project ? getProject(n.project) : undefined;
                return (
                  <li key={n.slug} className="border-b border-rule">
                    <Link href={`/notes/${n.slug}`} className="group grid gap-3 py-7 md:grid-cols-12 md:gap-8">
                      <h3 className="font-display text-h3 text-ink group-hover:text-signal-ink md:col-span-5">{n.title}</h3>
                      <p className="text-small text-graphite md:col-span-5">{n.summary}</p>
                      <p className="font-mono text-[0.72rem] text-faint md:col-span-2 md:text-right">
                        {readingMinutes(n)} min read
                        <span className="block">{n.platform.toLowerCase()}</span>
                        {p && <span className="block">{p.shortTitle}</span>}
                      </p>
                    </Link>
                  </li>
                );
              })}
          </ul>
        </section>
      ))}

      {site.externalArticles.length > 0 && (
        <section aria-labelledby="elsewhere-h" className="mt-20">
          <h2 id="elsewhere-h" className="font-display text-h2 text-ink">Published elsewhere</h2>
          <ul className="mt-6 border-t border-rule">
            {site.externalArticles.map((a) => (
              <li key={a.url} className="grid gap-2 border-b border-rule py-6 md:grid-cols-12 md:gap-8">
                <ExternalLink href={a.url} className="font-display text-h3 text-ink hover:text-signal-ink md:col-span-5">
                  {a.title}
                </ExternalLink>
                <p className="text-small text-graphite md:col-span-5">{a.summary}</p>
                <p className="font-mono text-[0.72rem] text-faint md:col-span-2 md:text-right">
                  {a.platform}
                  {a.date && <span className="block">{a.date}</span>}
                  {a.readingMinutes && <span className="block">{a.readingMinutes} min read</span>}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {site.links.medium && (
        <p className="mt-12 text-small text-graphite">
          More writing on{" "}
          <ExternalLink href={site.links.medium} className="text-signal-ink">
            Medium
          </ExternalLink>
        </p>
      )}
    </div>
  );
}
