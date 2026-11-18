"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

export type MapLayer = {
  id: string;
  label: string;
  sub: string;
  projects: { href: string; name: string }[];
};

/**
 * The hero's system map: the layers my work spans, connected in data-flow
 * order. Hover or focus a layer to see which projects touch it. Plays one
 * short intro sequence, then idles with slow packets.
 */
export function SystemMap({ layers }: { layers: MapLayer[] }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px" });
  const [active, setActive] = useState<string | null>(null);
  const [intro, setIntro] = useState<number>(-1);
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);

  // One orchestrated intro: light each layer in order, once.
  useEffect(() => {
    if (reduce) return;
    let i = 0;
    const t = setInterval(() => {
      setIntro(i);
      i += 1;
      if (i > layers.length) clearInterval(t);
    }, 260);
    return () => clearInterval(t);
  }, [layers.length, reduce]);

  const W = 1200;
  const H = 170;
  const n = layers.length;
  const gap = W / n;
  const nodeW = 132;
  const nodeH = 64;
  const cy = 84;
  const pos = (i: number) => ({ x: gap * i + gap / 2, y: cy + (i % 2 === 0 ? -16 : 16) });

  const selected = layers.find((l) => l.id === active);
  const lit = (i: number) => (active ? layers[i].id === active : intro >= i && intro < n ? i === intro : false);

  return (
    <div
      ref={ref}
      className="relative"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        setPointer({ x: e.clientX - r.left, y: e.clientY - r.top });
      }}
      onPointerLeave={() => setPointer(null)}
    >
      {/* Drafting crosshair: follows the mouse, shows sheet coordinates. Mouse only. */}
      {pointer && (
        <div className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden md:block" aria-hidden="true">
          <div className="absolute inset-y-0 w-px bg-signal/25" style={{ left: pointer.x }} />
          <div className="absolute inset-x-0 h-px bg-signal/25" style={{ top: pointer.y }} />
          <span className="absolute font-mono text-[0.62rem] text-signal-ink/80" style={{ left: pointer.x + 8, top: pointer.y + 6 }}>
            {Math.round(pointer.x)}, {Math.round(pointer.y)}
          </span>
        </div>
      )}

      {/* md and up: horizontal map */}
      <svg viewBox={`0 0 ${W} ${H}`} className="relative z-10 hidden h-auto w-full md:block" role="group" aria-label="System map: the layers of the systems I build, from documents to applications">
        <defs>
          <marker id="sm-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,1 L9,5 L0,9 z" fill="var(--rule-strong)" />
          </marker>
        </defs>
        {layers.slice(0, -1).map((l, i) => {
          const a = pos(i);
          const b = pos(i + 1);
          const x1 = a.x + nodeW / 2;
          const x2 = b.x - nodeW / 2;
          const d = `M${x1},${a.y} C${x1 + 40},${a.y} ${x2 - 40},${b.y} ${x2},${b.y}`;
          return (
            <g key={l.id}>
              <path id={`sm-e${i}`} d={d} fill="none" stroke="var(--rule-strong)" strokeWidth={1.2} markerEnd="url(#sm-arrow)" />
              {inView && !reduce && (
                <circle r={3} fill="var(--signal)" className="motion-packet">
                  <animateMotion dur="3.2s" begin={`${i * 0.45}s`} repeatCount="indefinite">
                    <mpath href={`#sm-e${i}`} />
                  </animateMotion>
                </circle>
              )}
            </g>
          );
        })}
        {layers.map((l, i) => {
          const p = pos(i);
          const on = lit(i);
          const dim = active && !on;
          return (
            <g
              key={l.id}
              role="button"
              tabIndex={0}
              aria-label={`${l.label}: ${l.sub}. Projects: ${l.projects.map((x) => x.name).join(", ")}`}
              aria-pressed={active === l.id}
              onMouseEnter={() => setActive(l.id)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(l.id)}
              onBlur={() => setActive(null)}
              className="cursor-default outline-none [&:focus-visible>rect]:[stroke-width:2.5]"
              opacity={dim ? 0.45 : 1}
              style={{ transition: "opacity .25s" }}
            >
              <rect
                x={p.x - nodeW / 2}
                y={p.y - nodeH / 2}
                width={nodeW}
                height={nodeH}
                rx={4}
                fill={on ? "var(--signal-wash)" : "var(--paper-raised)"}
                stroke={on ? "var(--signal)" : "var(--rule-strong)"}
                strokeWidth={on ? 1.6 : 1}
                style={{ transition: "fill .3s, stroke .3s" }}
              />
              <text x={p.x - nodeW / 2 + 10} y={p.y - nodeH / 2 + 15} fontSize={9.5} className="fill-[var(--faint)] font-mono">
                {String(i + 1).padStart(2, "0")}
              </text>
              <text x={p.x} y={p.y + 2} textAnchor="middle" fontSize={14} fontWeight={500} className="fill-[var(--ink)] font-sans">
                {l.label}
              </text>
              <text x={p.x} y={p.y + 19} textAnchor="middle" fontSize={10} className="fill-[var(--graphite)] font-mono">
                {l.projects.length} project{l.projects.length === 1 ? "" : "s"}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="relative z-10 mt-1 hidden min-h-[3.25rem] items-start gap-6 border-t border-rule pt-3 md:flex" aria-live="polite">
        {selected ? (
          <>
            <p className="w-56 shrink-0 text-small text-ink">
              {selected.label}
              <span className="block text-[0.78rem] text-graphite">{selected.sub}</span>
            </p>
            <ul className="flex flex-wrap gap-2">
              {selected.projects.map((p) => (
                <li key={p.href}>
                  <Link href={p.href} className="inline-flex rounded-full border border-signal/50 px-3 py-1 text-[0.8rem] text-signal-ink hover:bg-signal-wash">
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-small text-faint">Hover a layer to see which projects work there.</p>
        )}
      </div>

      {/* Mobile: the same map as a vertical list */}
      <ol className="relative z-10 border-l border-rule pl-5 md:hidden">
        {layers.map((l, i) => (
          <li key={l.id} className="relative pb-4 last:pb-0">
            <span className="absolute -left-[1.6rem] top-1.5 size-2.5 rounded-full border border-signal bg-paper" aria-hidden />
            <p className="text-small font-medium text-ink">
              <span className="mr-2 font-mono text-[0.68rem] text-faint">{String(i + 1).padStart(2, "0")}</span>
              {l.label}
            </p>
            <p className="text-[0.78rem] text-graphite">{l.sub}</p>
            <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
              {l.projects.map((p) => (
                <Link key={p.href} href={p.href} className="text-[0.78rem] text-signal-ink underline decoration-signal/30 underline-offset-2">
                  {p.name}
                </Link>
              ))}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
