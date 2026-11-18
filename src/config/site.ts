/**
 * Site-wide configuration. Every external link on the site is read from here.
 * A link set to `null` is never rendered — nothing on the site points to a
 * placeholder URL.
 */

export type ManualRepo = {
  name: string;
  url: string;
  description: string;
  language?: string;
  /** Slug of the related case study, if any. */
  project?: string;
};

export type ExternalArticle = {
  title: string;
  url: string;
  platform: "Medium" | "LinkedIn" | "GitHub" | "Other";
  topic: string;
  summary: string;
  /** ISO date, e.g. "2026-10-02". Leave undefined if unknown. */
  date?: string;
  readingMinutes?: number;
};

export const site = {
  name: "Jaimin Patel",
  title: "Applied AI Engineer | AI Systems Engineer",
  description:
    "Jaimin Patel builds AI systems that solve real engineering and business problems, from document intelligence and knowledge pipelines to LLM inference infrastructure and intelligent backend applications.",
  /** Canonical URL. Set NEXT_PUBLIC_SITE_URL in production. */
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  locale: "en_IN",
  location: "Surat, Gujarat, India",

  /**
   * Availability is shown only when set. Do not fill this in unless it is
   * current, e.g. "Open to Applied AI roles from January 2027".
   */
  availability: null as string | null,

  resume: {
    /** Path under /public. The download link is hidden if the file is absent. */
    path: "/resume/Jaimin_Patel_Resume.pdf",
    fileName: "Jaimin_Patel_Resume.pdf",
  },

  links: {
    email: "pateljaimin1707@gmail.com",
    linkedin: "https://www.linkedin.com/in/jaimin-patel-aa470721a/",
    github: "https://github.com/Jaimin-ptl07",
    /** Add your verified Medium profile URL, e.g. "https://medium.com/@handle". */
    medium: null as string | null,
  },

  github: {
    username: "Jaimin-ptl07",
    /**
     * Public repositories to feature. Only add repos that are public and that
     * you want recruiters to open. Shown even when the live API is disabled.
     */
    featuredRepos: [] as ManualRepo[],
  },

  /** Published articles elsewhere (Medium, LinkedIn, etc.). Verified URLs only. */
  externalArticles: [] as ExternalArticle[],

  /** LinkedIn posts worth linking from case studies. Verified URLs only. */
  linkedinPosts: [] as { title: string; url: string; project?: string }[],
} as const;

export const nav = [
  { href: "/work", label: "Work" },
  { href: "/notes", label: "Notes" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function absoluteUrl(path = "/") {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}
