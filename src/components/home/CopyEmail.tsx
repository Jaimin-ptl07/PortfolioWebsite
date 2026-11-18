"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyEmail({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email);
          setState("copied");
        } catch {
          setState("failed");
        }
        setTimeout(() => setState("idle"), 2200);
      }}
      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-rule-strong px-5 text-small text-ink transition-colors hover:border-ink"
    >
      {state === "copied" ? <Check aria-hidden className="size-4 text-signal-ink" /> : <Copy aria-hidden className="size-4" />}
      <span aria-live="polite">{state === "copied" ? "Email address copied" : state === "failed" ? "Copy failed. Select the address instead." : "Copy email address"}</span>
    </button>
  );
}
