import type { Metadata } from "next";
import { Mail, BookOpen } from "lucide-react";
import { site } from "@/config/site";
import { CopyEmail } from "@/components/home/CopyEmail";
import { ResumeLink } from "@/components/ui/Links";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Jaimin Patel about applied AI, AI systems, LLM infrastructure and document intelligence roles or projects.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const channels = [
    { label: "Email", value: site.links.email, href: `mailto:${site.links.email}`, Icon: Mail, note: "Direct email.", external: false },
    { label: "LinkedIn", value: "jaimin-patel-aa470721a", href: site.links.linkedin, Icon: LinkedinIcon, note: "Professional updates and messages.", external: true },
    { label: "GitHub", value: site.github.username, href: site.links.github, Icon: GithubIcon, note: "Public code.", external: true },
    ...(site.links.medium ? [{ label: "Medium", value: "Articles", href: site.links.medium, Icon: BookOpen, note: "Long-form technical writing.", external: true }] : []),
  ];
  return (
    <div className="mx-auto max-w-[84rem] px-5 pt-14 sm:px-8 md:pt-20">
      <header className="max-w-3xl">
        <h1 className="font-display text-[2.6rem] leading-[1.05] text-ink sm:text-h1">Let&apos;s talk engineering</h1>
        <p className="mt-5 text-lead text-graphite">
          I&apos;m interested in applied AI, AI systems and LLM infrastructure work: document intelligence, retrieval, inference and the backend systems around them.
        </p>
      </header>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <a href={`mailto:${site.links.email}`} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-signal px-6 text-small font-medium text-on-signal hover:bg-signal-ink">
          <Mail aria-hidden className="size-4" />
          Write an email
        </a>
        <CopyEmail email={site.links.email} />
        <ResumeLink />
      </div>

      <ul className="mt-16 border-t border-rule">
        {channels.map(({ label, value, href, Icon, note, external }) => (
          <li key={label} className="border-b border-rule">
            <a
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer me" } : {})}
              className="group grid items-center gap-2 py-6 sm:grid-cols-12 sm:gap-6"
            >
              <span className="flex items-center gap-3 text-ink sm:col-span-3">
                <Icon aria-hidden className="size-4" />
                {label}
              </span>
              <span className="break-all font-mono text-small text-ink group-hover:text-signal-ink sm:col-span-5">{value}</span>
              <span className="text-small text-graphite sm:col-span-4">{note}</span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-small text-graphite">Based in {site.location}.</p>
    </div>
  );
}
