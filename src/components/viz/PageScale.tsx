import { EvidenceBadge } from "@/components/ui/Evidence";

/** A page-count ruler for PARAKH's corpus. Static; no animation needed. */
export function PageScale() {
  const max = 2800;
  const pct = (n: number) => `${(n / max) * 100}%`;
  const ticks = [0, 500, 1000, 1500, 2000, 2500];
  return (
    <div className="rounded-sm border border-rule bg-raised px-5 py-5">
      <p className="text-small font-medium text-ink">How long a single DPR is</p>
      <p className="text-[0.78rem] text-graphite">Pages per document, with an IDP-sized document for comparison.</p>
      <div className="relative mt-10 h-16" role="img" aria-label="Typical DPRs are 1,000 to 1,500 pages; some exceed 2,500. An IDP document is 200 to 300 pages.">
        <div className="absolute inset-x-0 top-8 h-px bg-rule-strong" />
        {ticks.map((t) => (
          <div key={t} className="absolute top-8" style={{ left: pct(t) }}>
            <div className="h-2 w-px bg-rule-strong" />
            <span className="absolute left-0 top-3 -translate-x-1/2 font-mono text-[0.68rem] text-faint">{t.toLocaleString("en-US")}</span>
          </div>
        ))}
        <div className="absolute top-5 h-3 rounded-sm bg-rule-strong" style={{ left: pct(200), width: pct(100) }} />
        <span className="absolute -top-1 -translate-x-1/2 whitespace-nowrap font-mono text-[0.68rem] text-graphite" style={{ left: pct(250) }}>IDP doc</span>
        <div className="absolute top-5 h-3 rounded-sm bg-signal" style={{ left: pct(1000), width: pct(500) }} />
        <span className="absolute -top-1 -translate-x-1/2 whitespace-nowrap font-mono text-[0.68rem] text-signal-ink" style={{ left: pct(1250) }}>typical DPR</span>
        <div className="absolute top-4 h-5 w-[2px] bg-ink" style={{ left: pct(2500) }} />
        <span className="absolute -top-1 right-0 whitespace-nowrap font-mono text-[0.68rem] text-ink">some &gt;2,500</span>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <EvidenceBadge kind="scope" />
        <span className="text-[0.78rem] text-graphite">Design target: three such 2,500-page DPRs processed concurrently.</span>
        <EvidenceBadge kind="target" />
      </div>
    </div>
  );
}
