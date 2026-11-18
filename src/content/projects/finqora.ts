import type { Project } from "../types";

export const finqora: Project = {
  slug: "finqora",
  title: "Finqora: investment discovery for Indian retail investors",
  shortTitle: "Finqora",
  subtitle:
    "A FastAPI and Next.js application where rules and Decimal arithmetic decide portfolio allocation, and an LLM assistant explains and explores without being allowed to decide.",
  category: "Client-delivered application / AI backend",
  status: "Client-delivered",
  role: "Designer and primary developer",
  featured: false,
  order: 5,
  glyph: "finqora",
  focus: ["backend", "llm"],
  card: {
    problem: "Retail investors need discovery and planning across many asset types, with market data that comes from unreliable third-party APIs.",
    solution: "Rule-based suitability and deterministic Decimal allocation, with a bounded tool-calling assistant and resilient market-data adapters around them.",
    impact: "14 asset categories and three market-data sources, delivered to a client.",
  },
  techSummary: ["FastAPI", "Next.js", "PostgreSQL", "Redis", "APScheduler", "Razorpay", "Docker Compose"],

  overview: [
    "Finqora helps Indian retail investors discover investments across 14 asset categories, plan a portfolio, and ask questions in plain language. I designed it and was its primary developer, and it was delivered to a client.",
    "The engineering problem was keeping each kind of logic in its proper place. Suitability is rules. Allocation is deterministic arithmetic on Decimal values. The LLM assistant helps users explore and understand, using tools with a bounded number of rounds. It does not decide or allocate portfolios.",
  ],

  problem: {
    context: [
      "Investors want help across mutual funds, equities and other asset types, and they want it conversationally. Allocation advice has to be consistent and explainable. Two users with the same inputs must get the same allocation.",
      "Market data comes from three external sources with different shapes, limits and failure modes.",
    ],
    who: "Indian retail investors using the application, and the client operating it.",
    why: "An assistant that improvised allocations would be inconsistent and impossible to audit. Market data that fails hard would take the whole product down with it.",
    functional: [
      "Investment discovery across 14 asset categories.",
      "Rule-based suitability and deterministic portfolio allocation.",
      "A conversational assistant with tool access.",
      "Market data from Kite, yfinance and MFAPI.",
      "Paid subscriptions through Razorpay.",
    ],
    nonFunctional: [
      "Allocation is reproducible and exact (no floating-point drift).",
      "Assistant tool use is bounded in rounds.",
      "Degrades gracefully when a market-data source fails.",
    ],
  },

  contribution: {
    designed: ["Application architecture, the deterministic/LLM boundary, the adapter layer and the streaming protocol."],
    implemented: ["The FastAPI backend, Next.js frontend integration, market-data adapters, scheduled jobs, caching, payments and Docker Compose setup."],
    dependencies: ["Kite, yfinance and MFAPI for market data.", "Razorpay for payments.", "An LLM API for the assistant."],
  },

  architecture: {
    intro: [
      "The backend has three kinds of logic side by side. Rules decide suitability. A Decimal-based engine computes allocation. The assistant works through typed tools with a bounded number of rounds. Market data enters only through adapters that own retries, circuit breaking and caching.",
    ],
    diagram: {
      id: "finqora-architecture",
      title: "Application architecture",
      caption: "The assistant sits beside the deterministic engines, not above them. External data enters only through the adapter layer.",
      width: 1000,
      height: 440,
      groups: [
        { label: "Deterministic", x: 385, y: 160, w: 200, h: 225 },
        { label: "External, behind adapters", x: 815, y: 75, w: 180, h: 270 },
      ],
      nodes: [
        { id: "client", label: "Next.js client", sub: "typed SSE stream", x: 15, y: 182, w: 145, kind: "app", step: 1, detail: "The investor-facing web app. Receives assistant output as a typed SSE stream." },
        { id: "api", label: "FastAPI", sub: "API layer", x: 200, y: 182, w: 140, kind: "api", step: 2, detail: "Routes requests to the rules, the allocation engine or the assistant." },
        { id: "assistant", label: "LLM assistant", sub: "bounded tool rounds", x: 400, y: 50, w: 170, kind: "model", step: 3, detail: "Answers questions using function calling. The number of tool-call rounds per turn is capped, so a conversation can't loop indefinitely." },
        { id: "tools", label: "Typed tools", x: 620, y: 50, w: 150, kind: "control", step: 4, detail: "The functions the assistant may call. Results come back as typed data." },
        { id: "suit", label: "Suitability rules", sub: "rule-based", x: 400, y: 190, w: 170, kind: "control", detail: "Rule-based suitability, not model-based." },
        { id: "alloc", label: "Allocation engine", sub: "Decimal arithmetic", x: 400, y: 300, w: 170, kind: "process", detail: "Deterministic portfolio allocation computed with Decimal arithmetic. The same inputs always give the same allocation." },
        { id: "adapters", label: "Market-data adapters", sub: "breaker + retry", x: 620, y: 190, w: 160, kind: "api", step: 5, detail: "One adapter per source. Each owns retries and a circuit breaker, so a failing source is isolated." },
        { id: "kite", label: "Kite", x: 835, y: 100, w: 140, kind: "source", detail: "Market data source." },
        { id: "yf", label: "yfinance", x: 835, y: 185, w: 140, kind: "source", detail: "Market data source." },
        { id: "mf", label: "MFAPI", sub: "mutual funds", x: 835, y: 270, w: 140, kind: "source", detail: "Mutual fund data source." },
        { id: "cache", label: "Redis + PostgreSQL", sub: "cache + storage", x: 620, y: 300, w: 160, kind: "store", step: 6, detail: "Caches market data and stores application state." },
        { id: "sched", label: "APScheduler", sub: "background jobs", x: 835, y: 370, w: 140, kind: "control", detail: "Scheduled background jobs, such as refreshing market data ahead of requests." },
        { id: "pay", label: "Razorpay", sub: "subscriptions", x: 200, y: 330, w: 140, kind: "source", detail: "Subscription payments." },
      ],
      edges: [
        { from: "client", to: "api" },
        { from: "api", to: "assistant", fromSide: "t", toSide: "l" },
        { from: "assistant", to: "tools" },
        { from: "tools", to: "adapters", fromSide: "b", toSide: "t" },
        { from: "api", to: "suit" },
        { from: "api", to: "alloc", fromSide: "b", toSide: "l" },
        { from: "adapters", to: "kite", toSide: "l" },
        { from: "adapters", to: "yf" },
        { from: "adapters", to: "mf", toSide: "l" },
        { from: "adapters", to: "cache", fromSide: "b", toSide: "t" },
        { from: "sched", to: "cache", fromSide: "l", toSide: "r", kind: "control", label: "refresh" },
        { from: "api", to: "pay", fromSide: "b", toSide: "t" },
      ],
    },
  },

  decisions: [
    {
      title: "Allocation is deterministic. The assistant is not in charge of it.",
      context: "An assistant that generates allocations would give different answers to identical inputs and couldn't be audited.",
      choice: "Compute allocation in a rule-based, Decimal-arithmetic engine. The LLM assistant handles conversation and exploration only.",
      rationale: [
        "Identical inputs give identical allocations.",
        "Decimal arithmetic avoids floating-point rounding errors on money.",
        "The allocation logic can be reviewed and tested like any other code.",
      ],
      tradeoffs: ["Allocation rules must be written and maintained explicitly."],
    },
    {
      title: "Bounded multi-round tool orchestration",
      context: "Function-calling assistants can chain tool calls, and without a limit a turn can loop or run up cost and latency.",
      choice: "Allow multiple tool-call rounds per turn, up to a fixed bound.",
      rationale: ["Multi-step questions still work.", "Latency and cost per turn have a ceiling."],
      tradeoffs: ["Some very long chains are cut off and need a follow-up question."],
    },
    {
      title: "Typed SSE streaming",
      context: "The assistant's output is a mix of streamed text and other events, and the client must handle each correctly.",
      choice: "Stream Server-Sent Events with an explicit type on every event.",
      rationale: [
        "The client handles events by type instead of guessing from content.",
        "SSE is one-directional and HTTP-native, which fits server-to-client streaming.",
      ],
      tradeoffs: ["The event types are a contract that the frontend and backend must change together."],
    },
    {
      title: "One adapter per market-data source",
      context: "Kite, yfinance and MFAPI differ in data shape, limits and failure modes.",
      choice: "Put each source behind its own adapter that owns normalisation, retries and a circuit breaker. Cache results in Redis and PostgreSQL, refreshed by APScheduler jobs.",
      rationale: [
        "A failing source is contained in its adapter.",
        "The rest of the application sees one consistent interface.",
        "Scheduled refreshes and caching reduce live calls to external APIs.",
      ],
      tradeoffs: ["Cached data can be stale between refreshes."],
    },
  ],

  challenges: [
    {
      title: "Third-party market data fails in different ways",
      problem: "Each external source can be slow, rate-limited or unavailable, independently of the others.",
      solution: "Per-source adapters with retries and circuit breakers, plus Redis/PostgreSQL caching fed by scheduled APScheduler jobs.",
      outcome: "A source outage is contained in one adapter instead of failing user requests across the app.",
    },
    {
      title: "Keeping the assistant inside its lane",
      problem: "A capable function-calling model can drift into producing advice it shouldn't, or loop through tools.",
      solution: "Allocation and suitability live in deterministic code. The assistant reaches the system only through typed tools, with a bounded number of rounds.",
    },
    {
      title: "Exact arithmetic on money",
      problem: "Floating-point arithmetic introduces rounding errors in allocation percentages and amounts.",
      solution: "All allocation arithmetic uses Python's Decimal type.",
      outcome: "Allocations are exact and reproducible.",
    },
  ],

  implementation: [
    {
      title: "Backend",
      body: ["FastAPI serves the API. Suitability rules and the Decimal allocation engine are plain, testable modules. The assistant uses LLM function calling with a bounded round count and streams typed SSE events to the client."],
    },
    {
      title: "Data and reliability",
      body: ["Kite, yfinance and MFAPI each have an adapter with retries and a circuit breaker. APScheduler runs background jobs. Redis and PostgreSQL provide caching and persistence."],
    },
    {
      title: "Payments and packaging",
      body: ["Razorpay handles subscriptions. The full stack runs under Docker Compose."],
    },
  ],

  results: {
    intro: ["Finqora's outcomes are about scope and delivery. No user counts or performance numbers are claimed."],
    metrics: [
      { label: "Asset categories", value: "14", unit: "categories", context: "Covered by discovery and planning.", evidence: "scope" },
      { label: "Market-data sources", value: "3", unit: "sources", context: "Kite, yfinance, MFAPI, each behind its own adapter.", evidence: "scope" },
    ],
  },

  lessons: [
    {
      title: "Give the LLM a narrow job",
      body: "The assistant is more useful and much safer when the decisions it might be tempted to make are already made by code it can only consult.",
    },
    {
      title: "Every external API needs a boundary",
      body: "Putting each market-data source behind its own adapter turned three different failure modes into one interface.",
    },
  ],

  stack: [
    { purpose: "Backend", items: [
      { name: "FastAPI", use: "API and SSE streaming" },
      { name: "APScheduler", use: "Background jobs" },
    ] },
    { purpose: "AI / ML", items: [{ name: "LLM function calling", use: "Conversational assistant with bounded tool rounds" }] },
    { purpose: "Databases & caching", items: [
      { name: "PostgreSQL", use: "Persistence and caching" },
      { name: "Redis", use: "Caching" },
    ] },
    { purpose: "Integrations", items: [
      { name: "Kite, yfinance, MFAPI", use: "Market data" },
      { name: "Razorpay", use: "Subscriptions" },
    ] },
    { purpose: "Frontend", items: [{ name: "Next.js", use: "Client application" }] },
    { purpose: "Deployment", items: [{ name: "Docker Compose", use: "Packaging" }] },
  ],

  evidence: [],
  related: { notes: ["llm-reads-code-calculates"] },
  todo: [
    "Timeline and engagement context (client name only if shareable).",
    "The tool-round bound value, and which tools the assistant can call.",
    "Event types used in the SSE protocol, if you want to show a snippet.",
  ],
};
