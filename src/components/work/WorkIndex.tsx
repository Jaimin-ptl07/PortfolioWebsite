"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { FocusId, GlyphId, ProjectStatus } from "@/content/types";
import { ProjectGlyph } from "@/components/ui/ProjectGlyph";

export type WorkItem = {
  slug: string;
  title: string;
  category: string;
  status: ProjectStatus;
  role: string;
  glyph: GlyphId;
  focus: FocusId[];
  problem: string;
  impact: string;
};

export function WorkIndex({ items, filters }: { items: WorkItem[]; filters: { id: FocusId; label: string }[] }) {
  const [focus, setFocus] = useState<FocusId | "all">("all");
  const reduce = useReducedMotion();
  const shown = items.filter((i) => focus === "all" || i.focus.includes(focus));

  return (
    <div>
      <div role="radiogroup" aria-label="Filter by area" className="flex flex-wrap gap-2">
        {[{ id: "all" as const, label: "All" }, ...filters].map((f) => (
          <button
            key={f.id}
            role="radio"
            aria-checked={focus === f.id}
            onClick={() => setFocus(f.id)}
            className={`min-h-9 rounded-full border px-4 text-[0.82rem] transition-colors ${focus === f.id ? "border-ink bg-ink text-paper" : "border-rule-strong text-graphite hover:border-ink hover:text-ink"}`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">{shown.length} projects shown</p>

      <ul className="mt-10 border-t border-rule">
        <AnimatePresence initial={false}>
          {shown.map((p) => (
            <motion.li
              key={p.slug}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-b border-rule"
            >
              <Link href={`/work/${p.slug}`} className="group grid gap-6 py-8 md:grid-cols-12 md:items-center">
                <div className="drafting-grid hidden rounded-sm border border-rule p-3 transition-colors group-hover:border-ink md:col-span-3 md:block">
                  <ProjectGlyph id={p.glyph} className="h-auto w-full" />
                </div>
                <div className="md:col-span-6">
                  <p className="font-mono text-[0.72rem] text-faint">
                    {p.status.toLowerCase()} <span className="px-1">/</span> {p.category.toLowerCase()}
                  </p>
                  <h2 className="mt-2 font-display text-h3 text-ink group-hover:text-signal-ink sm:text-[1.9rem] sm:leading-[2.3rem]">{p.title}</h2>
                  <p className="mt-2 text-small text-graphite">{p.problem}</p>
                </div>
                <div className="md:col-span-3">
                  <p className="text-small text-ink">{p.impact}</p>
                  <p className="mt-2 text-[0.78rem] text-graphite">{p.role}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-small text-signal-ink" aria-hidden>
                    Case study <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
