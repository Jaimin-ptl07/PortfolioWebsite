"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { EvidenceBadge } from "@/components/ui/Evidence";

/**
 * 196 cells, one per target field. Cell order is arbitrary: it shows counts,
 * not which specific fields were found.
 */
export function RecallWaffle({ total, modes }: { total: number; modes: { label: string; found: number }[] }) {
  const [idx, setIdx] = useState(modes.length - 1);
  const reduce = useReducedMotion();
  const found = modes[idx].found;
  const base = modes[0].found;
  const cols = 14;

  return (
    <div className="rounded-sm border border-rule bg-raised">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule px-5 py-3">
        <p className="text-small font-medium text-ink">Target fields whose source passage was retrieved</p>
        <div role="radiogroup" aria-label="Retrieval method" className="inline-flex rounded-full border border-rule-strong p-0.5 text-[0.8rem]">
          {modes.map((m, i) => (
            <button key={m.label} role="radio" aria-checked={idx === i} onClick={() => setIdx(i)} className={`relative rounded-full px-3.5 py-1.5 ${idx === i ? "text-on-signal" : "text-graphite hover:text-ink"}`}>
              {idx === i && <motion.span layoutId="waffle-pill" className="absolute inset-0 rounded-full bg-signal" transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30 }} />}
              <span className="relative">{m.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-8 px-5 py-6 md:grid-cols-[19rem_1fr] md:items-center">
        <div
          className="grid w-full max-w-[19rem] gap-[3px]"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          role="img"
          aria-label={`${found} of ${total} fields retrieved with ${modes[idx].label}`}
        >
          {Array.from({ length: total }, (_, i) => {
            const state = i < base ? "base" : i < found ? "gained" : "missed";
            return (
              <motion.span
                key={i}
                className="aspect-square rounded-[2px]"
                animate={{
                  backgroundColor: state === "base" ? "var(--ink)" : state === "gained" ? "var(--signal)" : "var(--paper-sunk)",
                }}
                transition={reduce ? { duration: 0 } : { duration: 0.2, delay: state === "gained" ? (i - base) * 0.012 : 0 }}
              />
            );
          })}
        </div>
        <div className="space-y-4">
          <p className="font-mono text-h1 leading-none text-ink">
            {found}
            <span className="text-lead text-graphite">/{total}</span>
          </p>
          <p className="font-mono text-small text-graphite">recall {((found / total) * 100).toFixed(1)}%</p>
          <ul className="space-y-1.5 text-[0.8rem] text-graphite">
            <li className="flex items-center gap-2"><span className="size-2.5 rounded-[2px] bg-ink" />found by dense-only ({base})</li>
            <li className="flex items-center gap-2"><span className="size-2.5 rounded-[2px] bg-signal" />added by hybrid ({modes[modes.length - 1].found - base})</li>
            <li className="flex items-center gap-2"><span className="size-2.5 rounded-[2px] border border-rule bg-sunk" />missed</li>
          </ul>
          <p className="text-[0.75rem] text-faint">Cell order is illustrative. It shows counts, not which fields.</p>
          <EvidenceBadge kind="poc" />
        </div>
      </div>
    </div>
  );
}
