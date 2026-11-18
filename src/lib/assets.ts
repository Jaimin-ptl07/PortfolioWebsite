import fs from "node:fs";
import path from "node:path";
import { site } from "@/config/site";

/** True when the configured resume PDF exists in /public. Checked at build time. */
export function resumeAvailable() {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", site.resume.path));
  } catch {
    return false;
  }
}
