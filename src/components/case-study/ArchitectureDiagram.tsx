"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { Pause, Play, StepBack, StepForward } from "lucide-react";
import type { Diagram, DiagramEdge, DiagramNode, DiagramNodeKind } from "@/content/types";

const NODE_W = 140;
const NODE_H = 54;

type Side = "l" | "r" | "t" | "b";
type Pt = { x: number; y: number };

const dir: Record<Side, Pt> = { l: { x: -1, y: 0 }, r: { x: 1, y: 0 }, t: { x: 0, y: -1 }, b: { x: 0, y: 1 } };

function box(n: DiagramNode) {
  return { x: n.x, y: n.y, w: n.w ?? NODE_W, h: n.h ?? NODE_H };
}
function anchor(n: DiagramNode, side: Side): Pt {
  const b = box(n);
  if (side === "l") return { x: b.x, y: b.y + b.h / 2 };
  if (side === "r") return { x: b.x + b.w, y: b.y + b.h / 2 };
  if (side === "t") return { x: b.x + b.w / 2, y: b.y };
  return { x: b.x + b.w / 2, y: b.y + b.h };
}
function autoSides(a: DiagramNode, b: DiagramNode): [Side, Side] {
  const A = box(a);
  const B = box(b);
  const dx = B.x + B.w / 2 - (A.x + A.w / 2);
  const dy = B.y + B.h / 2 - (A.y + A.h / 2);
  if (Math.abs(dx) >= Math.abs(dy) * 0.9) return dx >= 0 ? ["r", "l"] : ["l", "r"];
  return dy >= 0 ? ["b", "t"] : ["t", "b"];
}
function edgeGeometry(e: DiagramEdge, nodes: Map<string, DiagramNode>) {
  const a = nodes.get(e.from)!;
  const b = nodes.get(e.to)!;
  const [s1, s2] = autoSides(a, b);
  const fs = e.fromSide ?? s1;
  const ts = e.toSide ?? s2;
  const p0 = anchor(a, fs);
  const p3 = anchor(b, ts);
  const dist = Math.hypot(p3.x - p0.x, p3.y - p0.y);
  const o = Math.max(28, Math.min(120, dist * 0.42));
  const c1 = { x: p0.x + dir[fs].x * o, y: p0.y + dir[fs].y * o };
  const c2 = { x: p3.x + dir[ts].x * o, y: p3.y + dir[ts].y * o };
  const mid = {
    x: 0.125 * p0.x + 0.375 * c1.x + 0.375 * c2.x + 0.125 * p3.x,
    y: 0.125 * p0.y + 0.375 * c1.y + 0.375 * c2.y + 0.125 * p3.y,
  };
  return { d: `M${p0.x},${p0.y} C${c1.x},${c1.y} ${c2.x},${c2.y} ${p3.x},${p3.y}`, mid };
}

const kindLabel: Record<DiagramNodeKind, string> = {
  source: "Source",
  process: "Processing stage",
  store: "Storage / state",
  model: "Model / probabilistic",
  api: "Interface",
  app: "Application",
  control: "Control / policy",
};

function NodeShape({ n, state }: { n: DiagramNode; state: "idle" | "dim" | "active" | "visited" }) {
  const b = box(n);
  const kind = n.kind ?? "process";
  const stroke = state === "active" || state === "visited" ? "var(--signal)" : kind === "app" ? "var(--ink)" : "var(--rule-strong)";
  const fill = state === "active" ? "var(--signal-wash)" : kind === "model" ? "var(--signal-wash)" : "var(--paper-raised)";
  const rx = kind === "api" ? b.h / 2 : 3;
  return (
    <>
      <rect
        x={b.x}
        y={b.y}
        width={b.w}
        height={b.h}
        rx={rx}
        fill={fill}
        stroke={stroke}
        strokeWidth={kind === "app" || state === "active" ? 1.6 : 1}
        strokeDasharray={kind === "control" ? "4 3" : undefined}
      />
      {kind === "store" && <line x1={b.x} x2={b.x + b.w} y1={b.y + 7} y2={b.y + 7} stroke={stroke} strokeWidth={1} />}
      {kind === "source" && <path d={`M${b.x + b.w - 12} ${b.y} L${b.x + b.w} ${b.y} L${b.x + b.w} ${b.y + 12} Z`} fill="var(--rule-strong)" />}
      {kind === "model" && <rect x={b.x} y={b.y} width={3} height={b.h} fill="var(--signal)" />}
    </>
  );
}

export function ArchitectureDiagram({ diagram, figure }: { diagram: Diagram; figure?: number }) {
  const uid = useId().replace(/:/g, "");
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });
  const [hover, setHover] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [trace, setTrace] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);

  const nodeMap = useMemo(() => new Map(diagram.nodes.map((n) => [n.id, n])), [diagram.nodes]);
  const steps = useMemo(() => diagram.nodes.filter((n) => n.step !== undefined).sort((a, b) => a.step! - b.step!), [diagram.nodes]);
  const context = useMemo(() => diagram.nodes.filter((n) => n.step === undefined), [diagram.nodes]);
  const edges = useMemo(() => diagram.edges.map((e, i) => ({ ...e, id: `${uid}-e${i}`, ...edgeGeometry(e, nodeMap) })), [diagram.edges, nodeMap, uid]);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setTrace((cur) => {
        const next = cur === null ? 0 : cur + 1;
        if (next >= steps.length) {
          setPlaying(false);
          return cur;
        }
        return next;
      });
    }, reduce ? 1800 : 1300);
    return () => clearInterval(t);
  }, [playing, steps.length, reduce]);

  const traceNode = trace !== null ? steps[trace] : undefined;
  const activeId = hover ?? traceNode?.id ?? selected;
  const active = activeId ? nodeMap.get(activeId) : undefined;
  const visitedSteps = trace !== null ? new Set(steps.slice(0, trace + 1).map((n) => n.id)) : null;

  const connected = useMemo(() => {
    if (!activeId) return null;
    const s = new Set<string>([activeId]);
    diagram.edges.forEach((e) => {
      if (e.from === activeId) s.add(e.to);
      if (e.to === activeId) s.add(e.from);
    });
    return s;
  }, [activeId, diagram.edges]);

  const nodeState = (id: string): "idle" | "dim" | "active" | "visited" => {
    if (id === activeId) return "active";
    if (visitedSteps?.has(id)) return "visited";
    if (connected && !connected.has(id)) return "dim";
    return "idle";
  };

  const edgeActive = (e: DiagramEdge) =>
    activeId ? e.from === activeId || e.to === activeId : visitedSteps ? visitedSteps.has(e.from) && visitedSteps.has(e.to) : false;

  const startTrace = () => {
    if (playing) return setPlaying(false);
    setSelected(null);
    if (trace === null || trace >= steps.length - 1) setTrace(0);
    setPlaying(true);
  };
  const stepBy = (delta: number) => {
    setPlaying(false);
    setTrace((cur) => {
      const base = cur ?? (delta > 0 ? -1 : steps.length);
      return Math.min(steps.length - 1, Math.max(0, base + delta));
    });
  };

  const kindsPresent = Array.from(new Set(diagram.nodes.map((n) => n.kind ?? "process")));

  return (
    <figure ref={ref} className="my-10">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-3">
        <div>
          <p className="font-mono text-[0.72rem] text-faint">
            {figure !== undefined && <>Fig. {figure} </>}
            {diagram.conceptual ? "conceptual model" : "system map"}
          </p>
          <h3 className="mt-1 font-display text-h3 text-ink">{diagram.title}</h3>
        </div>
        <div className="hidden items-center gap-1 lg:flex">
          <button type="button" onClick={() => stepBy(-1)} className="inline-flex size-9 items-center justify-center rounded-full text-graphite hover:bg-sunk hover:text-ink" aria-label="Previous step">
            <StepBack className="size-4" />
          </button>
          <button
            type="button"
            onClick={startTrace}
            className="inline-flex items-center gap-2 rounded-full border border-rule-strong px-4 py-1.5 text-small text-ink transition-colors hover:border-ink"
          >
            {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
            {playing ? "Pause" : trace !== null ? "Replay the flow" : "Trace the flow"}
          </button>
          <button type="button" onClick={() => stepBy(1)} className="inline-flex size-9 items-center justify-center rounded-full text-graphite hover:bg-sunk hover:text-ink" aria-label="Next step">
            <StepForward className="size-4" />
          </button>
          {trace !== null && (
            <span className="ml-2 font-mono text-[0.72rem] text-graphite" aria-live="polite">
              step {trace + 1}/{steps.length}
            </span>
          )}
        </div>
      </div>

      {/* Desktop: interactive SVG */}
      <div className="drafting-grid relative mt-4 hidden rounded-sm border border-rule bg-paper lg:block">
        <svg
          viewBox={`0 0 ${diagram.width} ${diagram.height}`}
          className="block h-auto w-full"
          role="group"
          aria-label={`${diagram.title}. ${diagram.caption}`}
          onMouseLeave={() => setHover(null)}
        >
          <defs>
            <marker id={`${uid}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,1 L9,5 L0,9 z" fill="var(--faint)" />
            </marker>
            <marker id={`${uid}-arrow-on`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,1 L9,5 L0,9 z" fill="var(--signal)" />
            </marker>
          </defs>

          {diagram.groups?.map((g) => (
            <g key={g.label} aria-hidden="true">
              <rect x={g.x} y={g.y} width={g.w} height={g.h} rx={4} fill="none" stroke="var(--rule-strong)" strokeDasharray="2 4" />
              <text x={g.x + 8} y={g.y - 6} className="fill-[var(--graphite)] font-mono" fontSize={10.5}>
                {g.label}
              </text>
            </g>
          ))}

          {edges.map((e) => {
            const on = edgeActive(e);
            const dim = activeId && !on;
            return (
              <g key={e.id} aria-hidden="true" opacity={dim ? 0.25 : 1} style={{ transition: "opacity .25s" }}>
                <path
                  id={e.id}
                  d={e.d}
                  fill="none"
                  stroke={on ? "var(--signal)" : "var(--faint)"}
                  strokeWidth={on ? 1.7 : 1.2}
                  strokeDasharray={e.kind === "control" ? "3 4" : undefined}
                  className={e.kind === "retry" ? "edge-flow" : undefined}
                  markerEnd={`url(#${uid}-arrow${on ? "-on" : ""})`}
                />
                {e.label && (
                  <g>
                    <rect x={e.mid.x - e.label.length * 3.15 - 5} y={e.mid.y - 9} width={e.label.length * 6.3 + 10} height={16} rx={2} fill="var(--paper)" />
                    <text x={e.mid.x} y={e.mid.y + 3} textAnchor="middle" fontSize={10} className="fill-[var(--graphite)] font-mono">
                      {e.label}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {inView && !reduce &&
            edges
              .filter((e) => (e.kind ?? "data") === "data")
              .map((e, i) => (
                <circle key={`${e.id}-p`} r={2.6} fill="var(--signal)" className="motion-packet" opacity={activeId && !edgeActive(e) ? 0.15 : 0.9}>
                  <animateMotion dur="2.6s" repeatCount="indefinite" begin={`${(i * 0.37) % 2.6}s`}>
                    <mpath href={`#${e.id}`} />
                  </animateMotion>
                </circle>
              ))}

          {diagram.nodes.map((n) => {
            const b = box(n);
            const state = nodeState(n.id);
            return (
              <g
                key={n.id}
                role="button"
                tabIndex={0}
                aria-pressed={selected === n.id}
                aria-label={`${n.label}${n.sub ? `, ${n.sub}` : ""}. ${n.detail}`}
                className="cursor-pointer outline-none [&:focus-visible>rect:first-child]:stroke-[var(--signal)] [&:focus-visible>rect:first-child]:[stroke-width:2.5]"
                opacity={state === "dim" ? 0.4 : 1}
                style={{ transition: "opacity .25s" }}
                onMouseEnter={() => setHover(n.id)}
                onFocus={() => setHover(n.id)}
                onBlur={() => setHover(null)}
                onClick={() => {
                  setPlaying(false);
                  setTrace(null);
                  setSelected((s) => (s === n.id ? null : n.id));
                }}
                onKeyDown={(ev) => {
                  if (ev.key === "Enter" || ev.key === " ") {
                    ev.preventDefault();
                    setTrace(null);
                    setSelected((s) => (s === n.id ? null : n.id));
                  }
                }}
              >
                <NodeShape n={n} state={state} />
                {n.step !== undefined && (
                  <text x={b.x + 8} y={b.y + 15} fontSize={9.5} className="fill-[var(--faint)] font-mono">
                    {String(n.step).padStart(2, "0")}
                  </text>
                )}
                <text x={b.x + b.w / 2} y={b.y + (n.sub ? b.h / 2 - 1 : b.h / 2 + 4.5)} textAnchor="middle" fontSize={12.5} fontWeight={500} className="fill-[var(--ink)] font-sans">
                  {n.label}
                </text>
                {n.sub && (
                  <text x={b.x + b.w / 2} y={b.y + b.h / 2 + 14} textAnchor="middle" fontSize={9.8} className="fill-[var(--graphite)] font-mono">
                    {n.sub}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        <div className="min-h-[5.5rem] border-t border-rule bg-raised px-5 py-4" aria-live="polite">
          {active ? (
            <div className="grid gap-1 md:grid-cols-[14rem_1fr] md:gap-6">
              <p className="text-small font-medium text-ink">
                {active.label}
                <span className="block font-mono text-[0.7rem] font-normal text-faint">{kindLabel[active.kind ?? "process"]}</span>
              </p>
              <p className="text-small text-graphite">{active.detail}</p>
            </div>
          ) : (
            <p className="text-small text-faint">Hover, focus or select a component to see what it does. Trace the flow to step through it in order.</p>
          )}
        </div>
      </div>

      {/* Below lg: the same content as an ordered list */}
      <div className="mt-4 lg:hidden">
        <ol className="relative space-y-0 border-l border-rule pl-6">
          {steps.map((n) => (
            <li key={n.id} className="relative pb-5">
              <span className="absolute -left-[1.85rem] top-1 flex size-[0.85rem] items-center justify-center rounded-full border border-signal bg-paper" aria-hidden />
              <p className="font-mono text-[0.7rem] text-faint">{String(n.step).padStart(2, "0")} {kindLabel[n.kind ?? "process"].toLowerCase()}</p>
              <p className="font-medium text-ink">
                {n.label}
                {n.sub && <span className="ml-2 font-mono text-[0.72rem] font-normal text-graphite">{n.sub}</span>}
              </p>
              <p className="mt-1 text-small text-graphite">{n.detail}</p>
            </li>
          ))}
        </ol>
        {context.length > 0 && (
          <div className="mt-2 rounded-sm border border-rule bg-raised p-4">
            <p className="font-mono text-[0.7rem] text-faint">also in the system</p>
            <ul className="mt-2 space-y-3">
              {context.map((n) => (
                <li key={n.id}>
                  <p className="text-small font-medium text-ink">{n.label}</p>
                  <p className="text-small text-graphite">{n.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <figcaption className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <span className="max-w-[60ch] text-small text-graphite">{diagram.caption}</span>
        <span className="hidden flex-wrap gap-x-4 gap-y-1 font-mono text-[0.68rem] text-faint lg:flex" aria-hidden="true">
          {kindsPresent.map((k) => (
            <span key={k} className="inline-flex items-center gap-1.5">
              <svg width="16" height="10" viewBox="0 0 16 10">
                <rect
                  x="0.5"
                  y="0.5"
                  width="15"
                  height="9"
                  rx={k === "api" ? 4.5 : 1.5}
                  fill={k === "model" ? "var(--signal-wash)" : "var(--paper-raised)"}
                  stroke={k === "app" ? "var(--ink)" : "var(--rule-strong)"}
                  strokeDasharray={k === "control" ? "2 1.5" : undefined}
                />
                {k === "store" && <line x1="0.5" x2="15.5" y1="3" y2="3" stroke="var(--rule-strong)" />}
                {k === "model" && <rect x="0.5" y="0.5" width="2" height="9" fill="var(--signal)" />}
                {k === "source" && <path d="M11 0.5 L15.5 0.5 L15.5 5 Z" fill="var(--rule-strong)" />}
              </svg>
              {kindLabel[k].toLowerCase()}
            </span>
          ))}
        </span>
      </figcaption>
    </figure>
  );
}
