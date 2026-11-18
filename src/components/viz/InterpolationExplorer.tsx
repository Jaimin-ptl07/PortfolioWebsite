"use client";

import { useId, useState } from "react";

/**
 * Conceptual explainer for discharge-bracketed interpolation. Uses symbolic
 * category bounds (no real discharge values, no imagery) and a linear blend
 * for illustration.
 */
export function InterpolationExplorer() {
  const [t, setT] = useState(35);
  const id = useId();
  const w = t / 100;

  return (
    <div className="rounded-sm border border-rule bg-raised">
      <div className="border-b border-rule px-5 py-3">
        <p className="text-small font-medium text-ink">Interpolating between bracketing category maps</p>
        <p className="text-[0.78rem] text-graphite">Conceptual illustration with symbolic values. A linear weighting is shown for clarity.</p>
      </div>
      <div className="grid gap-8 px-5 py-6 md:grid-cols-2">
        <div>
          <label htmlFor={id} className="text-[0.8rem] text-graphite">
            Target discharge Q within the bracket
          </label>
          <input
            id={id}
            type="range"
            min={0}
            max={100}
            value={t}
            onChange={(e) => setT(Number(e.target.value))}
            className="mt-3 w-full accent-[var(--signal)]"
            aria-valuetext={`${t}% of the way from the lower to the upper category bound`}
          />
          <div className="mt-1 flex justify-between font-mono text-[0.72rem] text-graphite">
            <span>Q_lower (category k)</span>
            <span>Q_upper (category k+1)</span>
          </div>

          <div className="mt-6 space-y-3">
            {[
              { name: "map k", weight: 1 - w },
              { name: "map k+1", weight: w },
            ].map((m) => (
              <div key={m.name}>
                <div className="flex justify-between font-mono text-[0.75rem] text-ink">
                  <span>{m.name}</span>
                  <span>weight {m.weight.toFixed(2)}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-sunk">
                  <div className="h-full rounded-full bg-signal transition-[width] duration-150" style={{ width: `${m.weight * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-5">
          <div>
            <p className="font-mono text-[0.72rem] text-faint">baseline</p>
            <p className="mt-1 text-small text-ink">Any Q inside category k returns map k, unchanged.</p>
          </div>
          <div>
            <p className="font-mono text-[0.72rem] text-faint">interpolation, per pixel</p>
            <p className="mt-1 font-mono text-small text-ink">
              P(Q) = (1 − w)·P<sub>k</sub> + w·P<sub>k+1</sub>
            </p>
            <p className="mt-1 font-mono text-[0.75rem] text-graphite">w = (Q − Q_lower) / (Q_upper − Q_lower) = {w.toFixed(2)}</p>
          </div>
          <div>
            <p className="font-mono text-[0.72rem] text-faint">LinearFit, per pixel i</p>
            <p className="mt-1 font-mono text-small text-ink">
              P<sub>i</sub>(h) = a<sub>i</sub>·h + b<sub>i</sub>
            </p>
            <p className="mt-1 text-[0.75rem] text-graphite">h is water level. Each pixel has its own fitted a and b.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
