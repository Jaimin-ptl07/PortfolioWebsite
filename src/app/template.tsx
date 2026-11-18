"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";

// The first page load renders immediately (no hidden server HTML). Only later
// client-side navigations get the short fade.
let hasMounted = false;

export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const animate = hasMounted && !reduce;
  useEffect(() => {
    hasMounted = true;
  }, []);
  return (
    <motion.div initial={animate ? { opacity: 0, y: 6 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}>
      {children}
    </motion.div>
  );
}
