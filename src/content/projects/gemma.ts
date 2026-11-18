import type { Project } from "../types";

export const gemma: Project = {
  slug: "gemma-4-inference",
  title: "Gemma 4 31B: self-hosted LLM inference",
  shortTitle: "Gemma 4 31B inference",
  subtitle:
    "Serving a 31B-parameter model for a prefill-heavy document workload on one AMD MI300X, and finding out which bottlenecks lived in the model server and which did not.",
  category: "LLM infrastructure / GPU inference",
  status: "Production",
  organisation: "Silver Touch Technologies Ltd.",
  role: "Owned self-hosted serving, benchmarking and tuning",
  featured: true,
  order: 3,
  glyph: "gemma",
  focus: ["llm", "backend"],
  card: {
    problem: "Long document prompts made first tokens slow and queues long on a self-hosted 31B model.",
    solution: "Benchmarked with production prompts, tuned vLLM scheduling, then removed caps in the application and gateway.",
    impact: "P95 time-to-first-token 39.4 s → 4.9 s in the batched-token benchmark. Application throughput ≈4×.",
  },
  techSummary: ["vLLM 0.19.1", "google/gemma-4-31B-it", "AMD Instinct MI300X", "ROCm", "Docker"],

  overview: [
    "PARAKH and the document platforms send the model long inputs: pages of OCR text, rule-book passages and extraction schemas. They expect comparatively short answers. That makes the workload prefill-dominated. Most of the GPU's work goes into reading the prompt, not generating tokens.",
    "I owned the self-hosted serving of google/gemma-4-31B-it on vLLM 0.19.1, running on an AMD Instinct MI300X virtual GPU in a container. I benchmarked it with production prompts and tuned it. The deployment was verified at roughly 60 concurrent production requests.",
    "This case study covers three changes and what each one cost. Two were vLLM scheduler settings, measured in controlled runs. The third was outside the model server entirely: concurrency caps in the application and the API gateway.",
  ],

  problem: {
    context: [
      "Document-processing requests carry large prompts. When many arrive together, each one needs its prefill pass before it can emit a first token. Under the initial configuration, requests waited a long time to see a first token, and aggregate throughput was low.",
      "Throughput, time-to-first-token (TTFT) and inter-token latency (ITL) pull against each other. Raising one setting to improve one of them usually moves another. So the goal was not one number. It was a configuration whose trade-offs matched how the applications actually use the model.",
    ],
    who: "The internal applications calling the model, PARAKH's document pipeline first, and the engineers waiting on their batch jobs.",
    why: "Slow first tokens and long queue waits held up every downstream processing stage. Throughput set how fast large document sets could be processed at all.",
    functional: [
      "Serve google/gemma-4-31B-it behind an API used by multiple internal applications.",
      "Handle concurrent requests carrying long document-derived prompts.",
    ],
    nonFunctional: [
      "Low TTFT at realistic concurrency.",
      "High aggregate output throughput for batch document jobs.",
      "Inter-token latency that stays usable for streamed responses.",
      "Predictable GPU memory behaviour with KV-cache headroom.",
    ],
    constraints: [
      "One AMD Instinct MI300X virtual GPU on ROCm, not a multi-GPU cluster.",
      "Input-heavy prompts: prefill cost dominates per request.",
      "The serving stack is shared, so other traffic can affect a measurement.",
    ],
  },

  contribution: {
    designed: [
      "The benchmarking approach: production prompts at fixed concurrency, with TTFT, ITL, latency percentiles and KV-cache use recorded for every run.",
      "The tuning sequence: scheduler token budget first, then concurrent sequences, then the application and gateway caps.",
    ],
    implemented: [
      "Containerised vLLM deployment of google/gemma-4-31B-it on the MI300X.",
      "The benchmark runs and their analysis.",
      "Concurrency changes in the PARAKH application (10 → 32) and the gateway cap (20 → 64).",
    ],
    dependencies: [
      "GPU provisioning and the virtualised MI300X environment.",
      "The PARAKH application and the gateway as systems. My change was to their concurrency limits, not their design.",
    ],
  },

  architecture: {
    intro: [
      "A request crosses two layers that each limit concurrency on their own terms. The application layer (PARAKH and the gateway in front of the model) decides how many requests are in flight. The model server (vLLM) decides how many sequences run per step and how many prompt tokens are processed per step.",
      "The diagram below follows a request through both layers. Select a component to see what limits it.",
    ],
    diagram: {
      id: "gemma-serving",
      title: "Model-serving path",
      caption: "Concurrency is capped at three points: the application, the gateway and the vLLM scheduler. The first two were outside the model server.",
      width: 1000,
      height: 400,
      groups: [
        { label: "Application layer", x: 10, y: 40, w: 370, h: 230 },
        { label: "Model server: vLLM 0.19.1 on MI300X", x: 400, y: 40, w: 590, h: 340 },
      ],
      nodes: [
        { id: "app", label: "PARAKH app", sub: "concurrency 10 → 32", x: 30, y: 130, kind: "app", step: 1, detail: "Sends document-processing prompts. Its own worker concurrency was 10, which capped how many requests could ever reach the model. Raised to 32." },
        { id: "gw", label: "API gateway", sub: "cap 20 → 64", x: 215, y: 130, kind: "api", step: 2, detail: "Fronts the model server for internal applications. A concurrency cap of 20 produced an observed 120-second queue wait. Raised to 64." },
        { id: "sched", label: "vLLM scheduler", sub: "max_num_seqs", x: 425, y: 130, kind: "control", step: 3, detail: "Decides which sequences run in each step. max_num_seqs limits concurrent sequences; max_num_batched_tokens limits tokens processed per step." },
        { id: "prefill", label: "Prefill", sub: "prompt tokens", x: 625, y: 70, kind: "process", step: 4, detail: "Processes the prompt to build its KV cache. Dominant cost for this workload because prompts are long. Its share of each step is bounded by max_num_batched_tokens." },
        { id: "decode", label: "Decode", sub: "one token / step", x: 625, y: 200, kind: "process", step: 5, detail: "Generates output tokens one step at a time for every running sequence. Inter-token latency (ITL) is the time between these steps as seen by a client." },
        { id: "kv", label: "GPU memory", sub: "KV cache", x: 825, y: 130, w: 145, kind: "store", step: 6, detail: "Holds attention keys and values for every running sequence. More concurrent sequences and longer prompts both consume it. Peak use reached 91% at max_num_seqs = 64." },
        { id: "tokens", label: "Token stream", sub: "back to caller", x: 425, y: 300, kind: "api", step: 7, detail: "Generated tokens return through the gateway to the application." },
      ],
      edges: [
        { from: "app", to: "gw" },
        { from: "gw", to: "sched" },
        { from: "sched", to: "prefill" },
        { from: "sched", to: "decode" },
        { from: "prefill", to: "kv", label: "writes" },
        { from: "decode", to: "kv", label: "reads" },
        { from: "decode", to: "tokens", fromSide: "b", toSide: "r" },
        { from: "tokens", to: "app", fromSide: "l", toSide: "b", label: "streamed" },
      ],
    },
    notes: [
      {
        title: "Two throughput numbers, two layers",
        body: "Model-server output throughput (tok/s from vLLM) and application-level document-processing throughput (tok/s as PARAKH sees it) are different measurements. The app-level figure includes queueing in the application and the gateway. This page always says which one a number is.",
      },
    ],
  },

  decisions: [
    {
      title: "Benchmark with production prompts, not synthetic ones",
      context: "The workload's defining property is its input length distribution. Synthetic prompts of a fixed short length would mainly have measured decode behaviour.",
      choice: "Replay production prompts at fixed concurrency (25 concurrent requests for the token-budget runs, 100 offered requests for the concurrency runs).",
      rationale: [
        "Prefill cost scales with prompt length, so the prompt mix decides where the bottleneck sits.",
        "Results then describe this workload rather than a generic one.",
      ],
      tradeoffs: [
        "Results do not generalise to other prompt distributions.",
        "On a shared serving environment, a run can pick up interference from other traffic. The first baseline may have had some.",
      ],
    },
    {
      title: "Raise the per-step token budget for a prefill-heavy workload",
      context: "With max_num_batched_tokens at 8,192, each scheduler step could only process that many tokens. Long prompts needed many steps to finish prefill before producing a first token.",
      choice: "Raise max_num_batched_tokens from 8,192 to 20,480.",
      rationale: [
        "A larger budget lets more prompt tokens through per step, so prefill completes in fewer steps.",
      ],
      tradeoffs: [
        "Larger steps can make decode tokens for running requests wait behind big prefill chunks. ITL is the metric to watch for this.",
        "In this run ITL improved rather than degraded. Because the baseline may have included interference, I treat that as an observation, not a property of the setting.",
      ],
    },
    {
      title: "Accept higher ITL to cut queueing at high load",
      context: "At 100 offered requests, max_num_seqs = 25 meant most requests waited in the queue. P95 TTFT reached 120 s.",
      choice: "Raise max_num_seqs from 25 to 64.",
      rationale: [
        "For batch document processing, waiting two minutes for a first token is worse than slower token streaming once started.",
        "Higher concurrency raised aggregate output throughput (273 → 334 tok/s).",
      ],
      tradeoffs: [
        "P95 ITL rose from 125 ms to 318 ms: more sequences share each decode step.",
        "Peak KV-cache use rose from 46% to 91%, leaving much less headroom for longer prompts or traffic bursts.",
      ],
    },
    {
      title: "Fix the application and gateway caps, not just the model server",
      context: "Even with vLLM tuned, the application only ever sent 10 requests at a time, and the gateway admitted 20. Requests queued before reaching the model.",
      choice: "Raise PARAKH concurrency from 10 to 32 and the gateway cap from 20 to 64.",
      rationale: [
        "The model server could not use capacity it never received.",
        "The observed 120-second queue wait was in front of the model, not inside it.",
      ],
      tradeoffs: [
        "More in-flight requests push more load onto the model server, so the KV-cache and ITL trade-offs above become live in production.",
      ],
    },
  ],

  challenges: [
    {
      title: "First tokens took tens of seconds at moderate concurrency",
      problem: "At 25 concurrent production requests, P95 TTFT was 39.4 s and P50 was 23.9 s.",
      cause: "Long prompts competed for a per-step budget of 8,192 tokens, so each request's prefill was spread across many scheduler steps.",
      diagnosis: "Controlled runs at 25 concurrent requests using production prompts, comparing TTFT and ITL percentiles and request throughput across configurations.",
      solution: "Raised max_num_batched_tokens to 20,480.",
      outcome: "P95 TTFT fell to 4.9 s and P50 to 0.25 s, and output throughput rose from 121 to 269 tok/s in the tested run. The baseline may have included interference from other traffic, so the size of the gain is an observed result, not a clean causal measurement.",
    },
    {
      title: "Queueing dominated latency at 100 offered requests",
      problem: "With max_num_seqs = 25 and 100 offered requests, P95 TTFT was 120 s.",
      cause: "Only 25 sequences could run at once. The remaining requests queued in the scheduler before starting prefill.",
      solution: "Raised max_num_seqs to 64.",
      outcome: "P95 TTFT fell to 44 s and output throughput rose to 334 tok/s. P95 ITL rose to 318 ms and peak KV-cache use to 91%.",
    },
    {
      title: "A two-minute queue that wasn't in the model server",
      problem: "Requests showed an observed 120-second queue wait, and application-level throughput stayed at 221 tok/s.",
      cause: "The PARAKH application sent at most 10 concurrent requests and the gateway admitted at most 20, below what the model server could take.",
      solution: "Raised application concurrency to 32 and the gateway cap to 64.",
      outcome: "The observed queue wait was eliminated and application-level document-processing throughput rose from 221 to 890 tok/s, about 4×.",
    },
  ],

  implementation: [
    {
      title: "Deployment",
      body: [
        "vLLM 0.19.1 serves google/gemma-4-31B-it in a container on an AMD Instinct MI300X virtual GPU under ROCm. Internal applications reach it through an API gateway.",
      ],
    },
    {
      title: "Benchmark method",
      body: [
        "Each run replays production prompts at a fixed concurrency. Recorded per run: request throughput, aggregate output tokens per second, TTFT P50/P95, ITL P95, end-to-end latency P95 and peak KV-cache use.",
      ],
      points: [
        "Batched-token runs: 25 concurrent requests.",
        "Concurrency runs: 100 offered requests.",
        "One setting changes per experiment. Each experiment is a separate configuration snapshot.",
      ],
    },
    {
      title: "The two scheduler changes",
      body: ["Only the flag changed in each experiment is shown. The two experiments are separate snapshots, not one combined configuration."],
      code: {
        language: "diff",
        caption: "vLLM launch flags changed per experiment",
        source: `# Experiment 1: per-step token budget (25 concurrent requests)
- --max-num-batched-tokens 8192
+ --max-num-batched-tokens 20480

# Experiment 2: concurrent sequences (100 offered requests)
- --max-num-seqs 25
+ --max-num-seqs 64`,
      },
    },
  ],

  results: {
    intro: [
      "Results are grouped by experiment because they come from different configurations and workloads. Each figure is labelled with its evidence class.",
    ],
    headline: [
      { label: "P95 time to first token", before: 39.4, after: 4.9, unit: "s", better: "lower", decimals: 1, context: "Experiment 1, 25 concurrent production prompts.", evidence: "benchmark", note: "Baseline may have included interference from other traffic." },
      { label: "Model-server output throughput", before: 121, after: 269, unit: "tok/s", better: "higher", context: "Experiment 1, 25 concurrent production prompts.", evidence: "benchmark" },
      { label: "Application-level throughput", before: 221, after: 890, unit: "tok/s", better: "higher", context: "PARAKH document processing, after raising app and gateway concurrency.", evidence: "observed", note: "Application-level, including queueing. Not the same measurement as model-server throughput." },
      { label: "Concurrent production requests", value: "≈60", unit: "requests", context: "Verified on the production deployment.", evidence: "production" },
    ],
    metrics: [
      { label: "Request throughput", before: 0.29, after: 0.64, unit: "req/s", better: "higher", decimals: 2, context: "Exp. 1: max_num_batched_tokens 8,192 → 20,480, 25 concurrent requests.", evidence: "benchmark" },
      { label: "Output throughput", before: 121, after: 269, unit: "tok/s", better: "higher", context: "Exp. 1, aggregate across requests.", evidence: "benchmark" },
      { label: "TTFT P50", before: 23.9, after: 0.25, unit: "s", better: "lower", decimals: 2, context: "Exp. 1.", evidence: "benchmark" },
      { label: "TTFT P95", before: 39.4, after: 4.9, unit: "s", better: "lower", decimals: 1, context: "Exp. 1.", evidence: "benchmark" },
      { label: "ITL P95", before: 414, after: 123, unit: "ms", better: "lower", context: "Exp. 1.", evidence: "benchmark", note: "Improved in this run. Not assumed to generalise." },
      { label: "End-to-end latency P95", before: 193, after: 164, unit: "s", better: "lower", context: "Exp. 1.", evidence: "benchmark" },
      { label: "Output throughput", before: 273, after: 334, unit: "tok/s", better: "higher", context: "Exp. 2: max_num_seqs 25 → 64, 100 offered requests.", evidence: "benchmark" },
      { label: "TTFT P95", before: 120, after: 44, unit: "s", better: "lower", context: "Exp. 2.", evidence: "benchmark" },
      { label: "ITL P95", before: 125, after: 318, unit: "ms", better: "lower", tradeoff: true, context: "Exp. 2.", evidence: "benchmark", note: "Accepted trade-off." },
      { label: "Peak KV-cache use", before: 46, after: 91, unit: "%", better: "lower", tradeoff: true, context: "Exp. 2.", evidence: "benchmark", note: "Much less memory headroom." },
      { label: "Document-processing throughput", before: 221, after: 890, unit: "tok/s", better: "higher", context: "Application level: PARAKH concurrency 10 → 32, gateway cap 20 → 64.", evidence: "observed" },
      { label: "Queue wait in front of the model", value: "120 s → none", unit: "", context: "Observed before and after the application and gateway changes.", evidence: "observed" },
    ],
    viz: ["gemma-batched", "gemma-concurrency", "gemma-bottleneck"],
    caveats: [
      "Experiment 1's baseline may have included interference from other traffic on the shared environment. Its improvement is an observed result, not an isolated causal effect.",
      "Experiments 1 and 2 used different workloads (25 concurrent vs 100 offered requests) and separate configuration snapshots. Their numbers should not be combined.",
      "Application-level throughput (221 → 890 tok/s) is measured at PARAKH and includes queueing. It is not model-server output throughput.",
    ],
  },

  lessons: [
    {
      title: "The largest gain was outside the model server",
      body: "Tuning vLLM got the attention, but the ≈4× application-level improvement came from two concurrency limits in front of it. When latency looks like a model problem, I now check every queue on the request's path before changing model settings.",
    },
    {
      title: "Every setting moved a cost somewhere",
      body: "max_num_seqs = 64 bought lower TTFT and higher throughput by spending ITL and KV-cache headroom. At 91% peak KV-cache use there is little margin left. Writing the trade-off down next to the gain is what makes the setting defensible.",
    },
    {
      title: "One run is an observation",
      body: "The first baseline may have shared the GPU with other traffic. The honest claim is \"in this run, P95 TTFT went from 39.4 s to 4.9 s\", not \"this flag makes TTFT 8× faster\". A clean causal claim needs repeated runs on an isolated environment.",
    },
  ],

  stack: [
    { purpose: "AI / ML", items: [
      { name: "google/gemma-4-31B-it", use: "Served model" },
      { name: "vLLM 0.19.1", use: "Inference server and scheduler" },
    ] },
    { purpose: "Infrastructure", items: [
      { name: "AMD Instinct MI300X (virtual GPU)", use: "Inference accelerator" },
      { name: "ROCm", use: "GPU software stack" },
      { name: "Docker", use: "Containerised serving" },
    ] },
    { purpose: "Backend", items: [
      { name: "API gateway", use: "Front door and concurrency cap for internal callers" },
    ] },
  ],

  evidence: [],
  related: { notes: ["max-num-batched-tokens-prefill", "max-num-seqs-tradeoff", "bottleneck-outside-the-model"], projects: ["parakh"] },
  todo: [
    "Confirm the ROCm version. \"6.12.12\" looks like an amdgpu driver version, not a ROCm release. It is held back from the page until confirmed.",
    "Team context: who else worked on serving, gateway and GPU provisioning?",
    "Was the 221 → 890 tok/s application-level figure measured on production traffic or in a staging run? It is currently labelled \"Observed\".",
    "Benchmark tool used (e.g. vLLM benchmark_serving or a custom harness), if you want to cite it.",
    "Optional: a \"what I'd change\" note for each decision, in your own words.",
  ],
};
