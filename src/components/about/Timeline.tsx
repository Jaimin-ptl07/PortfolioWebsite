"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

export type TimelineItem = { when: string; title: string; org: string; body: string; links?: { href: string; label: string }[]; current?: boolean };

/** Vertical timeline whose rule draws in with scroll progress (no scroll-jacking). */
export function Timeline({ items }: { items: TimelineItem[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <ol ref={ref} className="relative">
      <span className="absolute left-[0.31rem] top-2 bottom-2 w-px bg-rule md:left-[11.31rem]" aria-hidden />
      <motion.span
        className="absolute left-[0.31rem] top-2 bottom-2 w-px origin-top bg-signal md:left-[11.31rem]"
        style={reduce ? { scaleY: 1 } : { scaleY }}
        aria-hidden
      />
      {items.map((it) => (
        <li key={it.title + it.when} className="relative grid gap-2 pb-12 pl-8 last:pb-0 md:grid-cols-[10rem_1fr] md:gap-10 md:pl-0">
          <p className="font-mono text-[0.75rem] leading-6 text-graphite md:text-right">{it.when}</p>
          <div className="relative md:pl-8">
            <span
              className={`absolute -left-8 top-1.5 size-[0.7rem] rounded-full border-2 md:-left-[0.35rem] ${it.current ? "border-signal bg-signal" : "border-signal bg-paper"}`}
              aria-hidden
            />
            <h3 className="font-display text-h3 text-ink">{it.title}</h3>
            <p className="text-small text-graphite">{it.org}</p>
            <p className="mt-3 max-w-[60ch] text-small text-ink/85">{it.body}</p>
            {it.links && (
              <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                {it.links.map((l) => (
                  <Link key={l.href} href={l.href} className="text-small text-signal-ink link-underline">
                    {l.label}
                  </Link>
                ))}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
