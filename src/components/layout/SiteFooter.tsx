import Link from "next/link";
import { nav, site } from "@/config/site";
import { SocialLinks, ResumeLink } from "@/components/ui/Links";

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-rule">
      <div className="mx-auto grid max-w-[84rem] gap-10 px-5 py-14 sm:px-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="font-display text-h3 text-ink">{site.name}</p>
          <p className="mt-2 max-w-sm text-small text-graphite">
            Applied AI engineer building document intelligence, knowledge pipelines and LLM inference infrastructure. Based in {site.location}.
          </p>
        </div>
        <nav aria-label="Footer" className="md:col-span-3">
          <ul className="space-y-2 text-small">
            <li><Link href="/" className="text-graphite hover:text-ink">Home</Link></li>
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-graphite hover:text-ink">{n.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-4 md:col-span-4">
          <SocialLinks className="flex-col !items-start" />
          <ResumeLink variant="text" />
        </div>
      </div>
      <div className="mx-auto max-w-[84rem] px-5 pb-10 font-mono text-[0.7rem] text-faint sm:px-8">
        Every figure on this site is labelled with how it was measured.
      </div>
    </footer>
  );
}
