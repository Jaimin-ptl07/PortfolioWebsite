import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const alt = `${site.name}, Applied AI Engineer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default social card. Uses system fonts so the build needs no font fetch. */
export default function OpenGraphImage() {
  const layers = ["Documents", "OCR", "Processing", "Knowledge", "Inference", "APIs", "Apps"];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#f3f4f1",
          backgroundImage: "linear-gradient(rgba(27,30,34,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(27,30,34,0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          color: "#1b1e22",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, color: "#5a6068", fontFamily: "monospace" }}>{site.name} / Applied AI Engineer / AI Systems Engineer</div>
        <div style={{ display: "flex", fontSize: 76, lineHeight: 1.04, maxWidth: 980, letterSpacing: -1 }}>
          Engineering intelligent systems that work beyond the demo.
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {layers.map((l, i) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  display: "flex",
                  padding: "10px 16px",
                  border: `2px solid ${i === 4 ? "#1e49f0" : "#b9bdb7"}`,
                  background: i === 4 ? "#e3e8fd" : "#fafbf9",
                  borderRadius: 6,
                  fontSize: 22,
                  fontFamily: "sans-serif",
                }}
              >
                {l}
              </div>
              {i < layers.length - 1 && <div style={{ display: "flex", width: 12, height: 2, background: "#b9bdb7" }} />}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
