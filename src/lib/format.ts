import type { Metric } from "@/content/types";

export function formatNumber(n: number, decimals = 0) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: decimals });
}

/** Ratio/difference description for a before → after metric. */
export function describeChange(m: Metric) {
  if (m.before === undefined || m.after === undefined) return null;
  const { before, after } = m;
  const improved = m.better ? (m.better === "higher" ? after > before : after < before) : null;
  let text: string;
  if (m.unit === "%") {
    const d = after - before;
    text = `${d > 0 ? "+" : "−"}${formatNumber(Math.abs(d), 1)} pts`;
  } else if (before !== 0) {
    const ratio = after / before;
    text = ratio >= 1.5 ? `${formatNumber(ratio, 1)}×` : ratio <= 1 / 1.5 ? `${formatNumber(1 / ratio, 1)}× lower` : `${after > before ? "+" : "−"}${formatNumber(Math.abs((after - before) / before) * 100, 0)}%`;
  } else {
    text = "";
  }
  return { text, improved, tradeoff: Boolean(m.tradeoff) };
}

export function metricValue(m: Metric, which: "before" | "after" | "value") {
  const v = m[which];
  if (typeof v === "number") return formatNumber(v, m.decimals ?? 0);
  return v ?? "";
}
