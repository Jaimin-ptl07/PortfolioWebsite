/** Minimal code block: no highlighter dependency; diff lines get +/− tinting. */
export function CodeBlock({ language, source, caption }: { language: string; source: string; caption?: string }) {
  const lines = source.split("\n");
  return (
    <figure className="my-6 overflow-hidden rounded-sm border border-rule bg-sunk">
      <div className="flex items-center justify-between border-b border-rule px-4 py-2 font-mono text-[0.7rem] text-faint">
        <span>{caption}</span>
        <span>{language}</span>
      </div>
      <pre className="overflow-x-auto px-4 py-4 font-mono text-[0.8rem] leading-6 text-ink" tabIndex={0}>
        <code>
          {lines.map((l, i) => {
            const cls =
              language === "diff"
                ? l.startsWith("+")
                  ? "text-signal-ink"
                  : l.startsWith("-")
                    ? "text-graphite line-through decoration-faint/60"
                    : l.startsWith("#")
                      ? "text-faint"
                      : ""
                : l.trimStart().startsWith("#")
                  ? "text-faint"
                  : "";
            return (
              <span key={i} className={`block ${cls}`}>
                {l || " "}
              </span>
            );
          })}
        </code>
      </pre>
    </figure>
  );
}
