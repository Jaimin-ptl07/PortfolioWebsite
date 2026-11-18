/**
 * Marks content the author still needs to supply. Rendered only in
 * development (`next dev`); production builds render nothing.
 */
export function ContentTodo({ items, title = "Content needed" }: { items?: string[]; title?: string }) {
  if (process.env.NODE_ENV === "production" || !items?.length) return null;
  return (
    <aside className="my-8 rounded-sm border border-dashed border-rule-strong bg-raised p-5 font-mono text-[0.78rem] leading-relaxed text-graphite">
      <p className="mb-2 text-ink">
        {title} <span className="text-faint">(visible in development only)</span>
      </p>
      <ul className="list-disc space-y-1 pl-4">
        {items.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </aside>
  );
}
