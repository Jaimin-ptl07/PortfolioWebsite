import type { GlyphId } from "@/content/types";

/**
 * Per-project drawn identities. Abstract, but each one depicts the project's
 * actual mechanism. Nothing here pretends to be a screenshot or real output.
 * Elements with `group-hover:` classes respond when a parent `.group` is hovered.
 */
export function ProjectGlyph({ id, className = "" }: { id: GlyphId; className?: string }) {
  const S = "var(--ink)";
  const M = "var(--rule-strong)";
  const A = "var(--signal)";
  const t = "transition-transform duration-500 ease-[cubic-bezier(.25,1,.5,1)]";
  return (
    <svg viewBox="0 0 240 160" className={className} aria-hidden="true" fill="none">
      {id === "idp" && (
        <g strokeWidth={1.2}>
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={22 + i * 5} y={30 + i * 5} width={62} height={84} rx={2} fill="var(--paper-raised)" stroke={M} />
          ))}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <line key={i} x1={44} x2={i % 2 ? 90 : 96} y1={60 + i * 9} y2={60 + i * 9} stroke={M} />
          ))}
          <path d="M112 80 h24" stroke={S} markerEnd="" />
          <path d="M132 75 l6 5 -6 5" stroke={S} />
          {[0, 1, 2, 3].map((i) => (
            <g key={i} className={`${t} group-hover:translate-x-1`} style={{ transitionDelay: `${i * 50}ms` }}>
              <rect x={150} y={44 + i * 20} width={22} height={11} rx={1.5} fill={i === 1 ? A : "var(--paper-sunk)"} />
              <rect x={176} y={44 + i * 20} width={44} height={11} rx={1.5} stroke={i === 1 ? A : M} />
            </g>
          ))}
        </g>
      )}

      {id === "parakh" && (
        <g strokeWidth={1.2}>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <rect key={`a${i}`} x={20} y={112 - i * 9} width={46} height={7} rx={1} fill="var(--paper-raised)" stroke={M} />
          ))}
          {[0, 1, 2].map((i) => (
            <rect key={`b${i}`} x={74} y={112 - i * 12} width={14} height={10} rx={1} stroke={M} />
          ))}
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={`c${i}`} x={94} y={114 - i * 8} width={10} height={6} rx={1} stroke={M} />
          ))}
          {[0, 1, 2].map((r) =>
            [0, 1, 2].map((c) => (
              <circle key={`n${r}${c}`} cx={150 + c * 26} cy={50 + r * 26} r={4} fill={r === 1 && c === 1 ? A : "var(--paper-raised)"} stroke={r === 1 && c === 1 ? A : S} />
            )),
          )}
          <path d="M154 50h18M180 50h18M150 54v18M176 54v18M202 54v18M154 76h18M180 76h18M150 80v18M176 80v18M202 80v18M154 102h18M180 102h18" stroke={M} />
          <g className={`${t} group-hover:-translate-y-1`}>
            <rect x={196} y={118} width={18} height={14} rx={2} stroke={S} fill="var(--paper)" />
            <path d="M200 118v-5a5 5 0 0 1 10 0v5" stroke={S} />
          </g>
          <path d="M112 90 C124 90 128 76 140 76" stroke={A} strokeDasharray="3 3" />
        </g>
      )}

      {id === "gemma" && (
        <g>
          <rect x={20} y={38} width={110} height={18} rx={2} fill={A} opacity={0.9} />
          <text x={24} y={33} fontSize={8} className="fill-[var(--graphite)] font-mono">prefill</text>
          {Array.from({ length: 12 }).map((_, i) => (
            <rect key={i} x={136 + i * 7} y={38} width={4} height={18} rx={1} fill={S} className={`${t} origin-bottom group-hover:scale-y-75`} style={{ transitionDelay: `${i * 25}ms` }} />
          ))}
          <text x={136} y={33} fontSize={8} className="fill-[var(--graphite)] font-mono">decode</text>
          <rect x={20} y={64} width={64} height={10} rx={2} fill={A} opacity={0.55} />
          {Array.from({ length: 14 }).map((_, i) => (
            <rect key={i} x={90 + i * 7} y={64} width={4} height={10} rx={1} fill={S} opacity={0.7} />
          ))}
          <text x={20} y={104} fontSize={8} className="fill-[var(--graphite)] font-mono">kv cache</text>
          {Array.from({ length: 20 }).map((_, i) => (
            <rect key={i} x={20 + i * 10} y={110} width={8} height={12} rx={1} fill={i < 18 ? (i >= 15 ? S : A) : "var(--paper-sunk)"} opacity={i < 18 ? 1 : 1} />
          ))}
        </g>
      )}

      {id === "fdi" && (
        <g strokeWidth={1.1}>
          {[0, 1, 2, 3, 4].map((r) => (
            <line key={r} x1={20} x2={128} y1={36 + r * 18} y2={36 + r * 18} stroke={M} />
          ))}
          {[20, 74, 101, 128].map((x) => (
            <line key={x} x1={x} x2={x} y1={36} y2={108} stroke={M} />
          ))}
          <rect x={74} y={72} width={27} height={18} fill="var(--signal-wash)" stroke={A} strokeWidth={1.6} className={`${t} origin-center group-hover:scale-110`} />
          <path d="M101 81 C140 81 150 64 176 64" stroke={A} strokeDasharray="3 3" />
          <circle cx={182} cy={64} r={7} fill={A} />
          <circle cx={214} cy={44} r={5} stroke={S} fill="var(--paper)" />
          <circle cx={214} cy={88} r={5} stroke={S} fill="var(--paper)" />
          <path d="M188 60 L209 47 M188 68 L209 85" stroke={S} />
          <line x1={20} x2={220} y1={128} y2={128} stroke={S} strokeDasharray="1 4" />
          <text x={20} y={142} fontSize={8} className="fill-[var(--graphite)] font-mono">probabilistic ↑ deterministic ↓</text>
        </g>
      )}

      {id === "finqora" && (
        <g strokeWidth={1.2}>
          <rect x={20} y={36} width={92} height={70} rx={10} stroke={M} strokeDasharray="4 3" />
          <rect x={30} y={48} width={60} height={9} rx={4.5} fill="var(--paper-sunk)" />
          <rect x={40} y={63} width={62} height={9} rx={4.5} fill="var(--paper-sunk)" />
          <rect x={30} y={78} width={44} height={9} rx={4.5} fill="var(--paper-sunk)" />
          <path d="M120 72 h14" stroke={S} />
          <path d="M130 68 l5 4 -5 4" stroke={S} />
          {[56, 34, 22, 12].map((w, i) => (
            <g key={i}>
              <rect x={146} y={42 + i * 18} width={74} height={10} rx={1} fill="var(--paper-sunk)" />
              <rect x={146} y={42 + i * 18} width={w * 1.3} height={10} rx={1} fill={i === 0 ? A : S} className={`${t} origin-left group-hover:scale-x-[0.94]`} />
            </g>
          ))}
          <text x={146} y={128} fontSize={8} className="fill-[var(--graphite)] font-mono">Decimal</text>
        </g>
      )}

      {id === "sac" && (
        <g>
          {Array.from({ length: 8 }).map((_, r) =>
            Array.from({ length: 14 }).map((_, c) => {
              const d = Math.abs(r - (3.5 + Math.sin(c / 2.2) * 2));
              const op = Math.max(0, 1 - d / 3);
              return <rect key={`${r}-${c}`} x={20 + c * 14.5} y={28 + r * 13} width={13} height={12} rx={1} fill={A} opacity={op * 0.85 + 0.04} />;
            }),
          )}
          <path d="M20 79 C 60 60, 90 104, 130 83 S 200 60, 222 82" stroke={S} strokeWidth={1.6} />
        </g>
      )}
    </svg>
  );
}
