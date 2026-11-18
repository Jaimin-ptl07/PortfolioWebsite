"use client";

import { useEffect, useState } from "react";

/** Sticky case-study rail with an active-section indicator. */
export function SectionNav({ sections }: { sections: { id: string; label: string }[] }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-8% 0px -70% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  return (
    <nav aria-label="Case study sections" className="sticky top-24">
      <p className="mb-3 font-mono text-[0.7rem] text-faint">On this page</p>
      <ol className="space-y-0.5 border-l border-rule">
        {sections.map((s, i) => {
          const on = s.id === active;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={on ? "location" : undefined}
                className={`-ml-px flex gap-2.5 border-l py-1.5 pl-3 text-[0.82rem] transition-colors ${
                  on ? "border-signal text-ink" : "border-transparent text-graphite hover:text-ink"
                }`}
              >
                <span className={`font-mono text-[0.68rem] leading-5 ${on ? "text-signal-ink" : "text-faint"}`}>{String(i + 1).padStart(2, "0")}</span>
                {s.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
