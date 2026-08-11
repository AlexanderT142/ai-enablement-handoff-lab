import { ImageResponse } from "next/og";

export const alt = "AI Enablement Handoff Lab - safe workflow, tested limits, transferred ownership";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#123f3a",
        color: "#f7f4ed",
        padding: "72px 80px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 24 }}>
        <div
          style={{
            display: "flex",
            width: 44,
            height: 44,
            borderRadius: 14,
            background: "#dfff75",
            color: "#123f3a",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
          }}
        >
          H
        </div>
        Independent work sample · synthetic data
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div style={{ fontSize: 76, lineHeight: 1.02, fontWeight: 700, maxWidth: 1000 }}>
          AI Enablement Handoff Lab
        </div>
        <div style={{ fontSize: 30, lineHeight: 1.35, maxWidth: 940, color: "#d8e8e1" }}>
          Safe workflow. Tested limits. Ownership transferred.
        </div>
      </div>
      <div style={{ display: "flex", gap: 18, fontSize: 23, color: "#123f3a" }}>
        {[
          "2 risks detected",
          "1 pattern registered",
          "1 documentation gap raised",
        ].map((label) => (
          <div key={label} style={{ background: "#f7f4ed", borderRadius: 999, padding: "13px 22px" }}>
            {label}
          </div>
        ))}
      </div>
    </div>,
    size,
  );
}
