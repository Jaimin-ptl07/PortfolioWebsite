import type { EvidenceKind } from "./types";

/**
 * Human-readable definitions for each evidence class. The glyph shape is the
 * primary encoding (colour is never the only signal).
 */
export const evidenceMeta: Record<
  EvidenceKind,
  { label: string; glyph: "disc" | "ring" | "half" | "square" | "diamond" | "dashed" | "bar" | "triangle"; definition: string }
> = {
  production: {
    label: "Production",
    glyph: "disc",
    definition: "Verified on a running production system.",
  },
  observed: {
    label: "Observed",
    glyph: "half",
    definition: "Observed while operating the system. Not a controlled benchmark.",
  },
  benchmark: {
    label: "Benchmark",
    glyph: "ring",
    definition: "Controlled benchmark run. Workload and configuration are stated with the result.",
  },
  "load-test": {
    label: "Load test",
    glyph: "square",
    definition: "Load test of one component. Shows capacity, not end-to-end performance.",
  },
  research: {
    label: "Research evaluation",
    glyph: "diamond",
    definition: "Initial research evaluation. Read the methodology caveats before comparing numbers.",
  },
  poc: {
    label: "POC result",
    glyph: "triangle",
    definition: "Measured in a proof of concept, on its own test set. Not a production claim.",
  },
  target: {
    label: "Design target",
    glyph: "dashed",
    definition: "What the architecture was designed for. Not a measured result.",
  },
  scope: {
    label: "Workload scope",
    glyph: "bar",
    definition: "A descriptive fact about the data or workload, such as a count or size.",
  },
};
