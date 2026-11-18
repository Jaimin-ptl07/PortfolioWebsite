import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[84rem] px-5 py-32 sm:px-8">
      <p className="font-mono text-[0.75rem] text-faint">404</p>
      <h1 className="mt-3 font-display text-h1 text-ink">This page doesn&apos;t exist.</h1>
      <p className="mt-4 max-w-[50ch] text-graphite">The link may be out of date. The case studies and notes are all listed from the pages below.</p>
      <div className="mt-8 flex flex-wrap gap-4 text-small">
        <Link href="/work" className="text-signal-ink link-underline">Work</Link>
        <Link href="/notes" className="text-signal-ink link-underline">Notes</Link>
        <Link href="/" className="text-signal-ink link-underline">Home</Link>
      </div>
    </div>
  );
}
