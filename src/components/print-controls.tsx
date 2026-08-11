"use client";

import Link from "next/link";

export function PrintControls() {
  return (
    <div className="print-controls">
      <Link href="/">← Back to the lab</Link>
      <button onClick={() => window.print()}>Print this page</button>
      <a href="/AI-Enablement-Handoff-One-Page.pdf" download>Download PDF ↓</a>
    </div>
  );
}
