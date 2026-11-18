"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { EvidenceBadge } from "@/components/ui/Evidence";

type Config = { label: string; app: number; gateway: number; throughput: number; queue: string };

/**
 * Application-level bottleneck: pipe width is proportional to each layer's
 * concurrency cap. The model server's configuration is deliberately not drawn
 * as a number: it was not part of this change, and mixing snapshots would be
 * misleading.
 */
export function BottleneckMap({ configs }: { configs: [Config, Config] }) {
  const [idx, setIdx] = useState(0);
  const reduce = useReducedMotion();
  const c = configs[idx];
  const maxCap = 64;
  const spring = reduce ? { duration: 0 } : { type: "spring" as const, stiffness: 140, damping: 22 };
  const binding = c.app <= c.gateway ? "app" : "gateway";
  const layers = [
    { id: "app", name: "PARAKH app", cap: c.app, capLabel: `concurrency ${c.app}` },
    { id: "gateway", name: "API gateway", cap: c.gateway, capLabel: `cap ${c.gateway}` },
  ];

  return (
    <div className="rounded-sm border border-rule bg-raised">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule px-5 py-3">
        <div>
          <p className="text-small font-medium text-ink">Where requests queued</p>
          <p className="text-[0.78rem] text-graphite">Pipe width is proportional to each layer&apos;s concurrency cap.</p>
        </div>
        <div role="radiogroup" aria-label="Configuration" className="inline-flex rounded-full border border-rule-strong p-0.5 text-[0.8rem]">
          {configs.map((cfg, i) => (
            <button key={cfg.label} role="radio" aria-checked={idx === i} onClick={() => setIdx(i)} className={`relative rounded-full px-3.5 py-1.5 ${idx === i ? "text-on-signal" : "text-graphite hover:text-ink"}`}>
              {idx === i && <motion.span layoutId="bottleneck-pill" className="absolute inset-0 rounded-full bg-signal" transition={spring} />}
              <span className="relative">{cfg.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 py-8">
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-0">
          {layers.map((l) => (
            <div key={l.id} className="flex flex-1 flex-col sm:flex-row sm:items-center">
              <div className="sm:w-full">
                <p className="mb-2 flex items-baseline justify-between text-small text-ink">
                  {l.name}
                  <span className="font-mono text-[0.75rem] text-graphite">{l.capLabel}</span>
                </p>
                <div className="flex h-16 items-center">
                  <motion.div
                    className={`w-full rounded-sm ${binding === l.id ? "bg-ink" : "bg-signal/70"}`}
                    animate={{ height: `${Math.max(8, (l.cap / maxCap) * 100)}%` }}
                    transition={spring}
                  />
                </div>
                <p className={`mt-2 h-4 font-mono text-[0.7rem] ${binding === l.id ? "text-ink" : "text-transparent"}`}>
                  {binding === l.id ? "binding limit" : "."}
                </p>
              </div>
              <span className="hidden px-3 text-faint sm:block" aria-hidden>→</span>
            </div>
          ))}
          <div className="flex-1">
            <p className="mb-2 text-small text-ink">vLLM model server</p>
            <div className="flex h-16 items-center justify-center rounded-sm border border-dashed border-rule-strong px-3 text-center text-[0.75rem] text-graphite">
              configured separately, not part of this change
            </div>
            <p className="mt-2 h-4" />
          </div>
        </div>

        <div className="mt-6 grid gap-4 border-t border-rule pt-5 sm:grid-cols-2">
          <div>
            <p className="text-[0.78rem] text-graphite">Application-level throughput</p>
            <p className="font-mono text-h3 text-ink">
              {c.throughput} <span className="text-small text-graphite">tok/s</span>
            </p>
          </div>
          <div>
            <p className="text-[0.78rem] text-graphite">Queue wait in front of the model</p>
            <p className="font-mono text-h3 text-ink">{c.queue}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <EvidenceBadge kind="observed" />
          <p className="text-[0.78rem] text-graphite">Application-level throughput includes queueing. It is not model-server output throughput.</p>
        </div>
      </div>
    </div>
  );
}
