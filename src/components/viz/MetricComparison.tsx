"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import type { Metric } from "@/content/types";
import { describeChange, formatNumber, metricValue } from "@/lib/format";
import { EvidenceBadge } from "@/components/ui/Evidence";

/**
 * Before → after dumbbells, one scale per row (rows have different units).
 * Every track starts at zero so dot positions are honest proportions.
 */
export function MetricComparison({ metrics, title, note }: { metrics: Metric[]; title?: string; note?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const rows = metrics.filter((m) => m.before !== undefined && m.after !== undefined);

  return (
    <div ref={ref} className="rounded-sm border border-rule bg-raised">
      {title && (
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-rule px-5 py-3">
          <p className="text-small font-medium text-ink">{title}</p>
          <p className="flex items-center gap-4 font-mono text-[0.68rem] text-faint" aria-hidden="true">
            <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full border border-graphite" />before</span>
            <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-signal" />after</span>
          </p>
        </div>
      )}
      <ul className="divide-y divide-rule">
        {rows.map((m, i) => {
          const max = Math.max(m.before!, m.after!) * 1.08;
          const b = (m.before! / max) * 100;
          const a = (m.after! / max) * 100;
          const change = describeChange(m);
          const lo = Math.min(a, b);
          const hi = Math.max(a, b);
          return (
            <li key={`${m.label}-${i}`} className="grid gap-3 px-5 py-4 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_8.5rem] md:items-center md:gap-6">
              <div>
                <p className="text-small font-medium text-ink">{m.label}</p>
                <p className="mt-0.5 text-[0.78rem] leading-snug text-graphite">{m.context}</p>
              </div>
              <div>
                <div className="relative h-6" aria-hidden="true">
                  <div className="absolute inset-x-0 top-1/2 h-px bg-rule" />
                  <motion.div
                    className={`absolute top-1/2 h-[3px] -translate-y-1/2 ${m.tradeoff ? "bg-graphite/50" : "bg-signal/40"}`}
                    style={{ left: `${lo}%` }}
                    initial={reduce ? { width: `${hi - lo}%` } : { width: 0 }}
                    animate={inView ? { width: `${hi - lo}%` } : undefined}
                    transition={{ duration: 0.8, delay: 0.1 + i * 0.06, ease: [0.25, 1, 0.5, 1] }}
                  />
                  <span className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-graphite bg-paper" style={{ left: `${b}%` }} />
                  <motion.span
                    className={`absolute top-1/2 size-3 -translate-y-1/2 rounded-full ${m.tradeoff ? "border-2 border-ink bg-paper" : "bg-signal"}`}
                    initial={reduce ? { left: `${a}%`, x: "-50%" } : { left: `${b}%`, x: "-50%" }}
                    animate={inView ? { left: `${a}%`, x: "-50%" } : undefined}
                    transition={{ duration: 0.8, delay: 0.1 + i * 0.06, ease: [0.25, 1, 0.5, 1] }}
                  />
                </div>
                <p className="mt-1 font-mono text-[0.78rem] text-ink">
                  <span className="text-graphite">{metricValue(m, "before")}</span>
                  <span className="px-1.5 text-faint">→</span>
                  {metricValue(m, "after")}
                  <span className="ml-1 text-graphite">{m.unit}</span>
                </p>
                <p className="sr-only">
                  {m.label}: from {formatNumber(m.before!, m.decimals ?? 0)} to {formatNumber(m.after!, m.decimals ?? 0)} {m.unit}.
                </p>
              </div>
              <div className="flex flex-row items-center justify-between gap-2 md:flex-col md:items-end">
                {change && (
                  <span className={`font-mono text-small ${change.tradeoff ? "text-ink" : change.improved ? "text-signal-ink" : "text-graphite"}`}>
                    {change.text}
                    {change.tradeoff && <span className="ml-1.5 text-[0.7rem] text-graphite">trade-off</span>}
                  </span>
                )}
                <EvidenceBadge kind={m.evidence} />
              </div>
              {m.note && <p className="text-[0.78rem] text-graphite md:col-span-3">Note: {m.note}</p>}
            </li>
          );
        })}
      </ul>
      {note && <p className="border-t border-rule px-5 py-3 text-[0.78rem] text-graphite">{note}</p>}
    </div>
  );
}
