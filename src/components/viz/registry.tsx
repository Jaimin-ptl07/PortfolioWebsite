import type { Metric, Project, VizId } from "@/content/types";
import { MetricComparison } from "./MetricComparison";
import { ConcurrencyTradeoff } from "./ConcurrencyTradeoff";
import { BottleneckMap } from "./BottleneckMap";
import { RecallWaffle } from "./RecallWaffle";
import { InterpolationExplorer } from "./InterpolationExplorer";
import { PageScale } from "./PageScale";

/**
 * Server-side registry: picks the visualisation for an id and passes only the
 * numbers it needs, taken from the project's own metrics where possible.
 */
export function Viz({ id, project }: { id: VizId; project: Project }) {
  const m = project.results.metrics;

  switch (id) {
    case "gemma-batched": {
      const rows: Metric[] = m.filter((x) => x.evidence === "benchmark" && x.before !== undefined).slice(0, 6);
      return (
        <MetricComparison
          title="Experiment 1: max_num_batched_tokens 8,192 → 20,480 (25 concurrent production prompts)"
          metrics={rows}
          note="The baseline may have included interference from other traffic. Treat these as an observed benchmark result, not an isolated causal effect."
        />
      );
    }
    case "gemma-concurrency":
      return (
        <ConcurrencyTradeoff
          states={[
            { seqs: 25, throughput: 273, ttft: 120, itl: 125, kv: 46 },
            { seqs: 64, throughput: 334, ttft: 44, itl: 318, kv: 91 },
          ]}
        />
      );
    case "gemma-bottleneck":
      return (
        <BottleneckMap
          configs={[
            { label: "Before", app: 10, gateway: 20, throughput: 221, queue: "≈120 s" },
            { label: "After", app: 32, gateway: 64, throughput: 890, queue: "none observed" },
          ]}
        />
      );
    case "fdi-recall":
      return <RecallWaffle total={196} modes={[{ label: "Dense only", found: 138 }, { label: "Dense + BM25 + RRF", found: 179 }]} />;
    case "fdi-embedding":
      return <MetricComparison title="Re-chunking before embedding" metrics={m.filter((x) => x.label === "Chunks" || x.label === "Embedding preparation")} note="Recall was unchanged after re-chunking." />;
    case "sac-interpolation":
      return <InterpolationExplorer />;
    case "sac-evaluation":
      return (
        <MetricComparison
          title="LinearFit vs category baseline: initial evaluation"
          metrics={project.results.headline?.filter((x) => x.before !== undefined) ?? []}
          note="Not threshold-matched (baseline >0.1, new methods ≥0.25), and event years were not fully held out. These are initial research results, not a definitive comparison."
        />
      );
    case "parakh-workload":
      return <PageScale />;
    default:
      return null;
  }
}
