import { site, type ManualRepo } from "@/config/site";

export type Repo = ManualRepo & { stars?: number; forks?: number; pushedAt?: string };

type ApiRepo = {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  archived: boolean;
  pushed_at: string;
};

/**
 * Manually configured repos, optionally merged with live public repos from the
 * GitHub REST API (only when GITHUB_REPOS_LIVE=1). Runs on the server at build
 * or revalidation time; the token, if any, never reaches the browser.
 */
export async function getRepos(): Promise<Repo[]> {
  const manual: Repo[] = [...site.github.featuredRepos];
  if (process.env.GITHUB_REPOS_LIVE !== "1") return manual;

  try {
    const res = await fetch(`https://api.github.com/users/${site.github.username}/repos?per_page=100&sort=pushed`, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "portfolio-site",
        ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return manual;
    const data = (await res.json()) as ApiRepo[];
    const live = data
      .filter((r) => !r.fork && !r.archived)
      .slice(0, 6)
      .map<Repo>((r) => ({
        name: r.name,
        url: r.html_url,
        description: r.description ?? "",
        language: r.language ?? undefined,
        stars: r.stargazers_count,
        forks: r.forks_count,
        pushedAt: r.pushed_at,
      }));
    const seen = new Set(manual.map((m) => m.url));
    return [...manual, ...live.filter((r) => !seen.has(r.url))];
  } catch {
    return manual;
  }
}
