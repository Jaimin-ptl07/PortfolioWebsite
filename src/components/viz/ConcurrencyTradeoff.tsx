"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { EvidenceBadge } from "@/components/ui/Evidence";

type State = { seqs: number; throughput: number; ttft: number; itl: number; kv: number };

/** Experiment 2: max_num_seqs 25 → 64 at 100 offered requests. */
export function ConcurrencyTradeoff({ states }: { states: [State, State] }) {
  const [idx, setIdx] = useState(1);
  const reduce = useReducedMotion();
  const s = states[idx];
  const other = states[1 - idx];
  const spring = reduce ? { duration: 0 } : { type: "spring" as const, stiffness: 160, damping: 24 };

  const panels = [
    { key: "throughput", label: "Output throughput", unit: "tok/s", value: s.throughput, max: Math.max(states[0].throughput, states[1].throughput), better: "higher" as const },
    { key: "ttft", label: "TTFT P95", unit: "s", value: s.ttft, max: Math.max(states[0].ttft, states[1].ttft), better: "lower" as const },
    { key: "itl", label: "ITL P95", unit: "ms", value: s.itl, max: Math.max(states[0].itl, states[1].itl), better: "lower" as const },
  ];
  const cmp = (key: "throughput" | "ttft" | "itl", better: "higher" | "lower") => {
    const v = s[key];
    const o = other[key];
    if (v === o) return null;
    return (better === "higher" ? v > o : v < o) ? "better" : "worse";
  };

  return (
    <div className="rounded-sm border border-rule bg-raised">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule px-5 py-3">
        <div>
          <p className="text-small font-medium text-ink">Concurrency trade-off at 100 offered requests</p>
          <p className="text-[0.78rem] text-graphite">Switch the setting to see what moves. Values are from two benchmark runs.</p>
        </div>
        <div role="radiogroup" aria-label="max_num_seqs" className="inline-flex rounded-full border border-rule-strong p-0.5 font-mono text-[0.78rem]">
          {states.map((st, i) => (
            <button
              key={st.seqs}
              role="radio"
              aria-checked={idx === i}
              onClick={() => setIdx(i)}
              className={`relative rounded-full px-3.5 py-1.5 transition-colors ${idx === i ? "text-on-signal" : "text-graphite hover:text-ink"}`}
            >
              {idx === i && <motion.span layoutId="seqs-pill" className="absolute inset-0 rounded-full bg-signal" transition={spring} />}
              <span className="relative">max_num_seqs = {st.seqs}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-px bg-rule sm:grid-cols-3">
        {panels.map((p) => {
          const verdict = cmp(p.key as "throughput" | "ttft" | "itl", p.better);
          return (
            <div key={p.key} className="bg-raised px-5 py-5">
              <p className="text-[0.78rem] text-graphite">{p.label}</p>
              <p className="mt-1 font-mono text-h2 leading-none text-ink">
                {p.value}
                <span className="ml-1 text-small text-graphite">{p.unit}</span>
              </p>
              <div className="mt-4 h-1.5 w-full rounded-full bg-sunk" aria-hidden="true">
                <motion.div className="h-full rounded-full bg-ink" animate={{ width: `${(p.value / p.max) * 100}%` }} transition={spring} />
              </div>
              <p className={`mt-2 font-mono text-[0.72rem] ${verdict === "better" ? "text-signal-ink" : "text-graphite"}`}>
                {verdict ? `${verdict} than at ${other.seqs} (${p.better} is better)` : ""}
              </p>
            </div>
          );
        })}
      </div>

      <div className="border-t border-rule px-5 py-5">
        <div className="flex items-baseline justify-between">
          <p className="text-[0.78rem] text-graphite">Peak KV-cache use</p>
          <p className="font-mono text-small text-ink">{s.kv}%</p>
        </div>
        <div className="mt-2 grid grid-cols-20 gap-[3px]" role="img" aria-label={`Peak KV-cache use ${s.kv} percent`} style={{ gridTemplateColumns: "repeat(20, minmax(0, 1fr))" }}>
          {Array.from({ length: 20 }, (_, i) => {
            const filled = (i + 1) * 5 <= Math.round(s.kv / 5) * 5;
            return (
              <motion.span
                key={i}
                className="h-4 rounded-[2px]"
                animate={{ backgroundColor: filled ? (i >= 17 ? "var(--ink)" : "var(--signal)") : "var(--paper-sunk)" }}
                transition={reduce ? { duration: 0 } : { duration: 0.25, delay: i * 0.015 }}
              />
            );
          })}
        </div>
        <p className="mt-3 text-[0.78rem] text-graphite">
          Higher concurrency cut queueing and raised throughput, but each decode step is now shared by more sequences, and the KV cache is close to full.
        </p>
        <div className="mt-3"><EvidenceBadge kind="benchmark" /></div>
      </div>
    </div>
  );
}
