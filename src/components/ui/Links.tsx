import Link from "next/link";
import { ArrowUpRight, FileDown, Mail, BookOpen } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";
import { site } from "@/config/site";
import { resumeAvailable } from "@/lib/assets";

type IconT = React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;

export function ExternalLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1 ${className}`}>
      {children}
      <ArrowUpRight aria-hidden className="size-3.5 opacity-60" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

/** Profile links. Unconfigured links (null) are simply not rendered. */
export function SocialLinks({ className = "", withLabels = true }: { className?: string; withLabels?: boolean }) {
  const items = [
    { href: site.links.github as string | null, label: "GitHub", Icon: GithubIcon as IconT },
    { href: site.links.linkedin as string | null, label: "LinkedIn", Icon: LinkedinIcon as IconT },
    { href: site.links.medium as string | null, label: "Medium", Icon: BookOpen as IconT },
  ].filter((i): i is { href: string; label: string; Icon: IconT } => Boolean(i.href));
  return (
    <ul className={`flex flex-wrap items-center gap-x-5 gap-y-2 ${className}`}>
      {items.map(({ href, label, Icon }) => (
        <li key={label}>
          <a href={href} target="_blank" rel="noopener noreferrer me" className="inline-flex items-center gap-2 text-small text-graphite transition-colors hover:text-ink" aria-label={withLabels ? undefined : label}>
            <Icon aria-hidden className="size-4" />
            {withLabels && <span className="link-underline">{label}</span>}
          </a>
        </li>
      ))}
      <li>
        <a href={`mailto:${site.links.email}`} className="inline-flex items-center gap-2 text-small text-graphite transition-colors hover:text-ink" aria-label={withLabels ? undefined : "Email"}>
          <Mail aria-hidden className="size-4" />
          {withLabels && <span className="link-underline">Email</span>}
        </a>
      </li>
    </ul>
  );
}

export function ResumeLink({ variant = "button", className = "" }: { variant?: "button" | "text"; className?: string }) {
  if (!resumeAvailable()) return null;
  const base =
    variant === "button"
      ? "inline-flex items-center gap-2 rounded-full border border-ink px-4 py-2 text-small font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
      : "inline-flex items-center gap-1.5 text-small text-ink link-underline";
  return (
    <a href={site.resume.path} download={site.resume.fileName} className={`${base} ${className}`}>
      <FileDown aria-hidden className="size-4" />
      Download resume
    </a>
  );
}

export function TextLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link href={href} className={`text-signal-ink link-underline ${className}`}>
      {children}
    </Link>
  );
}
