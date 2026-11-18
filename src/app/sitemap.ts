import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";
import { projects } from "@/content/projects";
import { notes } from "@/content/notes";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["/", "/work", "/notes", "/about", "/contact"].map((p) => ({
    url: absoluteUrl(p),
    changeFrequency: "monthly" as const,
    priority: p === "/" ? 1 : 0.8,
  }));
  return [
    ...staticRoutes,
    ...projects.map((p) => ({ url: absoluteUrl(`/work/${p.slug}`), changeFrequency: "monthly" as const, priority: p.featured ? 0.9 : 0.7 })),
    ...notes.map((n) => ({ url: absoluteUrl(`/notes/${n.slug}`), changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}
