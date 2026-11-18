"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { FileDown, Menu, X } from "lucide-react";
import { nav, site } from "@/config/site";

export function SiteHeader({ resumeAvailable }: { resumeAvailable: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled || open ? "border-rule bg-paper/95 backdrop-blur-sm" : "border-transparent bg-paper"
      }`}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:bg-ink focus:px-3 focus:py-2 focus:text-paper">
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-[84rem] items-center justify-between px-5 sm:px-8">
        <Link href="/" className="group flex items-baseline gap-3" aria-label={`${site.name}, home`}>
          <span className="font-display text-[1.35rem] leading-none tracking-tight text-ink">{site.name}</span>
          <span className="hidden font-mono text-[0.68rem] text-faint transition-colors group-hover:text-graphite md:inline">
            applied AI / AI systems
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`relative px-3 py-2 text-small transition-colors ${isActive(item.href) ? "text-ink" : "text-graphite hover:text-ink"}`}
            >
              {item.label}
              {isActive(item.href) && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute inset-x-3 -bottom-px h-px bg-signal"
                  transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
            </Link>
          ))}
          {resumeAvailable && (
            <a
              href={site.resume.path}
              download={site.resume.fileName}
              className="ml-4 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-1.5 text-small font-medium text-paper transition-colors hover:bg-signal hover:text-on-signal"
            >
              <FileDown aria-hidden className="size-3.5" />
              Resume
            </a>
          )}
        </nav>

        <button
          type="button"
          className="-mr-2 inline-flex size-11 items-center justify-center text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="Primary"
            initial={reduce ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="border-t border-rule bg-paper px-5 pb-6 pt-2 md:hidden"
          >
            <ul>
              <li>
                <Link href="/" className="flex min-h-12 items-center border-b border-rule text-lead text-ink">
                  Home
                </Link>
              </li>
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`flex min-h-12 items-center justify-between border-b border-rule text-lead ${isActive(item.href) ? "text-signal-ink" : "text-ink"}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            {resumeAvailable && (
              <a href={site.resume.path} download={site.resume.fileName} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 text-small font-medium text-paper">
                <FileDown aria-hidden className="size-4" />
                Download resume
              </a>
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
