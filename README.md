# Jaimin Patel: engineering portfolio

A Next.js (App Router) site that presents six engineering case studies, native engineering notes, an about page and contact details. Every number on the site carries an evidence label (production, observed, benchmark, load test, research evaluation, POC result, design target or workload scope).

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck    # route types + tsc
npm run build        # production build (all pages are statically generated)
npm start            # serve the production build
```

Requires Node 20.9+ (tested on Node 22).

In `npm run dev`, every case study shows a dashed **Content needed** panel listing details that are still missing. These panels are never rendered in production builds.

## Routes

| Route | What it is |
|---|---|
| `/` | Hero with interactive system map, featured work, focus areas, experiments, about preview, notes, contact |
| `/work` | All case studies (filterable), smaller projects, GitHub repos |
| `/work/[slug]` | Case study with 11 sections: overview, problem, role, architecture, decisions, challenges, implementation, results, lessons, stack, further reading |
| `/notes`, `/notes/[slug]` | Writing: Medium articles, engineering notes written from measured project data, and earlier writing |
| `/about` | Journey, interests, principles, timeline, education |
| `/contact` | Email, LinkedIn, GitHub, resume |
| `/sitemap.xml`, `/robots.txt`, `/opengraph-image` | SEO |

## Editing content

All content is typed TypeScript data, kept separate from the layout code.

| File | Contents |
|---|---|
| `src/config/site.ts` | Name, links (LinkedIn, GitHub, Medium, email), availability, resume path, featured repos |
| `src/content/articles.ts` | Medium articles (title, URL, date, summary, quote). Set `earlier: true` for older writing; link one from a case study with `related.articles` |
| `src/content/projects/*.ts` | One file per case study (schema in `src/content/types.ts`) |
| `src/content/projects/index.ts` | Ordering, plus the compact "More projects" entries |
| `src/content/notes/index.ts` | Native notes, written as blocks (paragraph, heading, list, code, callout, metrics) |
| `src/content/profile.ts` | Focus areas, journey, experience, education, certifications, principles |
| `src/content/evidence.ts` | Evidence-label definitions |

### Adding a case study

1. Copy an existing file in `src/content/projects/`, change `slug`, and fill in every field.
2. Add it to the array in `src/content/projects/index.ts`.
3. Architecture diagrams are data: give each node `x`, `y` (top-left, in a 1000-wide coordinate space) and optional `w`, `kind` and `step`. Edges connect node ids, and the sides are chosen automatically or set with `fromSide`/`toSide`. Below 1024px, the diagram renders as an ordered list automatically.
4. Every `Metric` needs `label`, `unit`, `context` and `evidence`. Use `before`/`after` for comparisons, or `value` for single facts. Set `tradeoff: true` for a deliberate regression.
5. Put anything you don't know yet in `todo`. It appears only in dev.

### Visualisations

Custom charts are registered by id in `src/components/viz/registry.tsx`, which passes them only the numbers they need. To add one, create a component in `src/components/viz/`, add its id to `VizId` in `types.ts`, then list it in the project's `results.viz`.

## Assets

- **Resume:** place the PDF at `public/resume/Jaimin_Patel_Resume.pdf` (path configurable in `site.ts`). The file is already copied from the repo root. If the file is missing, every resume link hides itself at build time.
- **Screenshots:** none are used. If you add real screenshots, put them in `public/images/` and reference them with `next/image`. Do not add mock-ups that look like real product UI.

## Environment variables

See `.env.example`. All of them are optional.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical production URL (no trailing slash). Used for canonical links, Open Graph, sitemap and robots. Defaults to `http://localhost:3000`. |
| `GITHUB_REPOS_LIVE` | Set to `1` to merge your latest public GitHub repos into `/work` at build time (revalidated hourly). |
| `GITHUB_TOKEN` | Optional, server-only token to raise the GitHub API rate limit. Never prefix it with `NEXT_PUBLIC_`. |

## Deploy

**Vercel (simplest):** import the repo, set `NEXT_PUBLIC_SITE_URL` to your domain, and deploy. No other configuration is needed.

**Any Node host:**

```bash
npm ci && npm run build && npm start   # PORT env var sets the port
```

There is no contact form, because no email backend is configured. Contact is by email, LinkedIn or GitHub.

## Stack

Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS 4, Motion (`motion/react`) and Lucide icons. Diagrams and charts are hand-written SVG and CSS, with no chart or diagram library. Fonts: Newsreader (display), Geist (text) and JetBrains Mono (annotations), loaded with `next/font`.

## Motion and accessibility

- The hero intro is pure CSS, so text is never hidden waiting for JavaScript. Route transitions run only on client-side navigation.
- `prefers-reduced-motion` disables packets, count-ups, transitions and the intro.
- Diagram nodes are keyboard-focusable buttons with full descriptions. Below 1024px, diagrams render as text lists.
- Visible focus rings, a skip link, semantic landmarks, and evidence labels encoded by shape as well as colour.

## Missing details to supply

These are also listed in each case study's dev-only panel:

1. **ROCm version** for the Gemma deployment. "6.12.12" looks like a driver version, so the page shows "ROCm" without a version until confirmed.
2. **Public GitHub repos** to feature (e.g. whether `FinancialDocIntelligence` is public) → `site.github.featuredRepos`.
3. **IDP:** confirm the OCR engine, timeline, adopter names (if shareable), and the roles of LangChain and LangGraph.
4. **PARAKH:** team size, timeline, OCR engine, where checkpoints and RBAC live, and how LangGraph is used.
5. **Gemma:** team context, whether the 221 → 890 tok/s figure was production traffic, and which benchmark tool was used.
6. **FDI:** which architecture version to describe (22-stage DAG vs the repo's current 9-stage slice), which LLM was used, and how the 196 fields were selected.
7. **SAC-ISRO:** interpolation weighting, the interpolation method's own results, and any linkable report.
8. **CWC:** the brief says LangGraph + external NL-to-SQL service, while the resume says LlamaIndex + Azure OpenAI. Confirm which is current.
9. **Logistics & ICD:** status, role and scope.
10. **"If I rebuilt it today"** notes per decision (`revisit` field), in your own words.
11. Reflections in "What I learned" are drafted from the project facts. Review them in your own voice.
12. **Availability** label (`site.availability`): leave it `null` unless it is current.
13. **Production domain** → `NEXT_PUBLIC_SITE_URL`.
