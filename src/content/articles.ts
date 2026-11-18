/**
 * Articles published on Medium (https://medium.com/@pateljaimin1707).
 * Titles, URLs and dates come from the Medium RSS feed. Summaries describe only
 * what each article itself says; numbers are quoted from the article.
 */

export type Article = {
  id: string;
  title: string;
  url: string;
  platform: "Medium";
  topic: string;
  /** ISO date from the feed. */
  date: string;
  summary: string;
  /** A sentence quoted verbatim from the article. */
  quote?: string;
  /** Older, non-engineering-focused writing is listed separately and compactly. */
  earlier?: boolean;
};

export const articles: Article[] = [
  {
    id: "fastapi-limits",
    title: "What Actually Limits a FastAPI System?",
    url: "https://medium.com/@pateljaimin1707/what-actually-limits-a-fastapi-system-1369f4f4030e",
    platform: "Medium",
    topic: "Backend performance",
    date: "2026-09-15",
    summary:
      "A load-testing experiment on a FastAPI, SQLAlchemy and PostgreSQL service covering thread pools versus async, connection-pool sizing, per-process pools and multiple workers. At 500 offered QPS, raising the pool from 15 to 100 connections removed all 1,056 errors and cut p95 latency from 38.5 s to 1.78 s. The bigger finding: the single load generator had become the bottleneck. Splitting it across four generators raised measured throughput from 85 to 133 req/s on the same Docker Desktop host.",
    quote: "Measurement methodology is part of performance engineering.",
  },
  {
    id: "vector-search-graphrag",
    title: "I Thought Vector Search Was Enough. Then the Questions Got Harder.",
    url: "https://medium.com/@pateljaimin1707/i-thought-vector-search-was-enough-then-the-questions-got-harder-49f75aeb1b4e",
    platform: "Medium",
    topic: "Retrieval",
    date: "2026-09-07",
    summary:
      "Why some enterprise document questions need more than semantic similarity. The article separates localised questions, where vector retrieval works well, from multi-hop, cross-document and entity-centric questions that depend on relationships. It covers what GraphRAG adds, what it costs (entity extraction, entity resolution, graph maintenance), and a framework for choosing between keyword, vector, hybrid, graph and agentic retrieval.",
    quote: "Don’t choose the retrieval technology first. Understand the question and the knowledge structure first.",
  },
  {
    id: "pdf-is-not-just-text",
    title: "A PDF Is Not Just Text: What I Learned Building Enterprise Document Intelligence Systems",
    url: "https://medium.com/@pateljaimin1707/a-pdf-is-not-just-text-what-i-learned-building-enterprise-document-intelligence-systems-834aa9300740",
    platform: "Medium",
    topic: "Document intelligence",
    date: "2026-08-30",
    summary:
      "OCR is one step, not document understanding: table and layout structure has to survive extraction for downstream reasoning to work. A bad answer can come from extraction, representation, retrieval, context construction or generation, and each needs a different fix. The article argues for evaluating retrieval and generation separately, and for running document processing as asynchronous jobs rather than inside one HTTP request.",
    quote: "An LLM can only reason over the information that reaches its context.",
  },
  {
    id: "depth-limited-crawler",
    title: "Exploring the Depths: Building a Depth-Limited Web Crawler in Python",
    url: "https://medium.com/@pateljaimin1707/exploring-the-depths-building-a-depth-limited-web-crawler-in-python-f5e8c4e6afce",
    platform: "Medium",
    topic: "Python",
    date: "2025-05-18",
    summary: "An introduction to crawl depth, with a breadth-first Python crawler (requests and BeautifulSoup) that stops at a maximum depth to stay focused and save resources.",
    earlier: true,
  },
  {
    id: "oasis-infobyte-internship",
    title: "My Journey as an Intern at Oasis Infobyte",
    url: "https://medium.com/@pateljaimin1707/my-journey-as-an-intern-at-oasis-infobyte-534ebda05f95",
    platform: "Medium",
    topic: "Internship",
    date: "2023-05-23",
    summary: "A data science internship write-up covering three tasks: iris flower classification, unemployment analysis and car price prediction.",
    earlier: true,
  },
  {
    id: "data-science-2023",
    title: "Understanding Data Science in 2023",
    url: "https://medium.com/@pateljaimin1707/understanding-data-science-in-2023-4f4023e802c1",
    platform: "Medium",
    topic: "Data science",
    date: "2023-04-15",
    summary: "An introductory overview of data science: what it is, the stages a project moves through, the types of analytics and the disciplines it draws on.",
    earlier: true,
  },
];

export const recentArticles = articles.filter((a) => !a.earlier);
export const earlierArticles = articles.filter((a) => a.earlier);

export function getArticle(id: string) {
  return articles.find((a) => a.id === id);
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-09-15" → "15 Sep 2026". Parsed by hand so it never depends on locale or time zone. */
export function formatArticleDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}
