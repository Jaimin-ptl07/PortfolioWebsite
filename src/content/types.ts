/**
 * Content schema for the portfolio. All project, note and timeline content
 * lives in plain TypeScript data so it can be edited without touching layout
 * code. Everything here must be serialisable (no functions) because parts of
 * it are passed to client components.
 */

/** What kind of claim a number is. Rendered as a glyph + label everywhere. */
export type EvidenceKind =
  | "production" // verified on a production system
  | "observed" // observed in operation, not a controlled benchmark
  | "benchmark" // controlled benchmark run
  | "load-test" // load test of a component
  | "research" // research evaluation (with methodology caveats)
  | "poc" // result from a proof of concept
  | "target" // architectural/design target, not measured
  | "scope"; // descriptive workload or scale fact (counts, sizes)

export type ProjectStatus =
  | "Production"
  | "Internal platform"
  | "Enterprise project"
  | "Client-delivered"
  | "Independent POC"
  | "POC"
  | "Research";

export type Metric = {
  label: string;
  unit: string;
  /** Single-value metric. */
  value?: number | string;
  /** Comparison metric. */
  before?: number;
  after?: number;
  /** Which direction counts as an improvement. Omit for neutral trade-offs. */
  better?: "higher" | "lower";
  /** Mark a change that moved in the unfavourable direction on purpose. */
  tradeoff?: boolean;
  decimals?: number;
  /** Benchmark context: workload, configuration, what was held constant. */
  context: string;
  evidence: EvidenceKind;
  /** Caveat or source note. */
  note?: string;
};

export type DiagramNodeKind = "source" | "process" | "store" | "model" | "api" | "app" | "control";

export type DiagramNode = {
  id: string;
  label: string;
  sub?: string;
  /** Top-left position in diagram units. */
  x: number;
  y: number;
  w?: number;
  h?: number;
  kind?: DiagramNodeKind;
  detail: string;
  /** Order in the "trace the flow" sequence. Nodes without a step are context. */
  step?: number;
};

export type DiagramEdge = {
  from: string;
  to: string;
  label?: string;
  kind?: "data" | "control" | "retry";
  fromSide?: "l" | "r" | "t" | "b";
  toSide?: "l" | "r" | "t" | "b";
};

export type DiagramGroup = {
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

export type Diagram = {
  id: string;
  title: string;
  caption: string;
  width: number;
  height: number;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  groups?: DiagramGroup[];
  /** True when the diagram is a conceptual model rather than a system map. */
  conceptual?: boolean;
};

export type Decision = {
  title: string;
  context: string;
  choice: string;
  rationale: string[];
  tradeoffs: string[];
  /** Only alternatives that were genuinely weighed. */
  alternatives?: { option: string; note: string }[];
  /** What would change if rebuilt today. Written by the author only. */
  revisit?: string;
};

export type Challenge = {
  title: string;
  /** What failed or became difficult. */
  problem: string;
  /** Why it happened. */
  cause?: string;
  /** How it was diagnosed. */
  diagnosis?: string;
  /** What was implemented. */
  solution: string;
  /** What changed afterward. */
  outcome?: string;
};

export type ImplementationBlock = {
  title: string;
  body: string[];
  points?: string[];
  code?: { language: string; caption: string; source: string };
};

export type TechGroup = {
  purpose:
    | "Programming"
    | "Backend"
    | "AI / ML"
    | "Data processing"
    | "Databases & caching"
    | "Infrastructure"
    | "Deployment"
    | "Frontend"
    | "Geospatial"
    | "Integrations";
  items: { name: string; use: string }[];
};

export type EvidenceLink = {
  label: string;
  url: string;
  kind: "GitHub" | "Medium" | "LinkedIn" | "Docs" | "Demo" | "Note";
};

/** Visualisations are registered by id in components/viz/registry.tsx. */
export type VizId =
  | "gemma-batched"
  | "gemma-concurrency"
  | "gemma-bottleneck"
  | "fdi-recall"
  | "fdi-embedding"
  | "sac-interpolation"
  | "sac-evaluation"
  | "parakh-workload";

export type FocusId = "document" | "llm" | "backend" | "retrieval";

export type GlyphId = "idp" | "parakh" | "gemma" | "fdi" | "finqora" | "sac";

export type Project = {
  slug: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  category: string;
  status: ProjectStatus;
  organisation?: string;
  role: string;
  team?: string;
  /** Only when known. */
  timeline?: string;
  featured: boolean;
  order: number;
  glyph: GlyphId;
  focus: FocusId[];
  /** One line each, used on cards. */
  card: { problem: string; solution: string; impact: string };
  techSummary: string[];

  overview: string[];
  problem: {
    context: string[];
    who: string;
    why: string;
    previous?: string;
    functional?: string[];
    nonFunctional?: string[];
    constraints?: string[];
  };
  contribution: {
    designed: string[];
    implemented: string[];
    led?: string[];
    team?: string[];
    dependencies?: string[];
  };
  architecture: { intro: string[]; diagram: Diagram; notes?: { title: string; body: string }[] };
  decisions: Decision[];
  challenges: Challenge[];
  implementation: ImplementationBlock[];
  results: {
    intro: string[];
    headline?: Metric[];
    metrics: Metric[];
    viz?: VizId[];
    caveats?: string[];
  };
  lessons: { title: string; body: string }[];
  stack: TechGroup[];
  evidence: EvidenceLink[];
  related?: { notes?: string[]; projects?: string[]; /** Article ids from content/articles.ts. */ articles?: string[] };
  /**
   * Missing information. Shown as a dashed "content needed" panel in
   * development only; never rendered in production builds.
   */
  todo?: string[];
};

export type AdditionalProject = {
  slug: string;
  title: string;
  status: ProjectStatus;
  role: string;
  organisation?: string;
  summary: string;
  points: string[];
  stack: string[];
  focus: FocusId[];
  todo?: string[];
};

/** Native portfolio notes, written as structured blocks (no MDX dependency). */
export type NoteBlock =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "code"; language: string; source: string; caption?: string }
  | { type: "callout"; title: string; text: string }
  | { type: "metrics"; metrics: Metric[] };

export type Note = {
  slug: string;
  title: string;
  topic: string;
  summary: string;
  /** Present only once the note is also published elsewhere. */
  externalUrl?: string;
  platform: "Portfolio note" | "Medium" | "LinkedIn";
  /** ISO date, only when known. */
  date?: string;
  project?: string;
  blocks: NoteBlock[];
};
