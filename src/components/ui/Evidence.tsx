import { evidenceMeta } from "@/content/evidence";
import type { EvidenceKind } from "@/content/types";

/** Shape-encoded evidence glyph. Shape, not colour, carries the meaning. */
export function EvidenceGlyph({ kind, size = 10 }: { kind: EvidenceKind; size?: number }) {
  const g = evidenceMeta[kind].glyph;
  const s = size;
  const c = s / 2;
  const common = { stroke: "currentColor", strokeWidth: 1.4, fill: "none" } as const;
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} aria-hidden="true" className="shrink-0">
      {g === "disc" && <circle cx={c} cy={c} r={c - 1} fill="currentColor" />}
      {g === "ring" && <circle cx={c} cy={c} r={c - 1} {...common} />}
      {g === "half" && (
        <>
          <circle cx={c} cy={c} r={c - 1} {...common} />
          <path d={`M${c} 1 A${c - 1} ${c - 1} 0 0 0 ${c} ${s - 1} Z`} fill="currentColor" />
        </>
      )}
      {g === "square" && <rect x={1} y={1} width={s - 2} height={s - 2} {...common} />}
      {g === "diamond" && <path d={`M${c} 0.8 L${s - 0.8} ${c} L${c} ${s - 0.8} L0.8 ${c} Z`} {...common} />}
      {g === "triangle" && <path d={`M${c} 1 L${s - 1} ${s - 1} L1 ${s - 1} Z`} {...common} />}
      {g === "dashed" && <circle cx={c} cy={c} r={c - 1} {...common} strokeDasharray="1.6 1.6" />}
      {g === "bar" && <rect x={1} y={c - 1.5} width={s - 2} height={3} fill="currentColor" />}
    </svg>
  );
}

export function EvidenceBadge({ kind, className = "" }: { kind: EvidenceKind; className?: string }) {
  const meta = evidenceMeta[kind];
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono text-[0.7rem] leading-none text-graphite ${className}`}
      title={meta.definition}
    >
      <EvidenceGlyph kind={kind} />
      {meta.label}
    </span>
  );
}

/** Legend explaining every evidence class. */
export function EvidenceLegend({ kinds }: { kinds?: EvidenceKind[] }) {
  const list = kinds ?? (Object.keys(evidenceMeta) as EvidenceKind[]);
  return (
    <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
      {list.map((k) => (
        <div key={k} className="flex gap-3">
          <dt className="mt-1.5 text-ink">
            <EvidenceGlyph kind={k} size={11} />
            <span className="sr-only">{evidenceMeta[k].label}</span>
          </dt>
          <dd className="text-small text-graphite">
            <span className="font-medium text-ink">{evidenceMeta[k].label}.</span> {evidenceMeta[k].definition}
          </dd>
        </div>
      ))}
    </dl>
  );
}
