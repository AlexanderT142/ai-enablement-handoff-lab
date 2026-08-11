import { useEffect, useState } from "react";
import type { BriefingResult } from "@/lib/contracts";

type DrawerTab = "architecture" | "boundary" | "receipt";

export function DesignDrawer({
  open,
  onClose,
  result,
}: {
  open: boolean;
  onClose: () => void;
  result: BriefingResult | null;
}) {
  const [tab, setTab] = useState<DrawerTab>("architecture");

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    document.body.classList.add("drawer-open");
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.classList.remove("drawer-open");
    };
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div className="drawer-layer">
      <button className="drawer-backdrop" aria-label="Close design inspection" onClick={onClose} />
      <aside className="design-drawer" role="dialog" aria-modal="true" aria-labelledby="design-drawer-title">
        <header className="drawer-header">
          <div>
            <p className="eyebrow">Technical review</p>
            <h2 id="design-drawer-title">Inspect the design</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close drawer">×</button>
        </header>

        <div className="drawer-tabs" role="tablist" aria-label="Design inspection sections">
          {(["architecture", "boundary", "receipt"] as DrawerTab[]).map((tabName) => (
            <button
              key={tabName}
              role="tab"
              aria-selected={tab === tabName}
              onClick={() => setTab(tabName)}
            >
              {tabName === "boundary" ? "Trust boundary" : tabName[0].toUpperCase() + tabName.slice(1)}
            </button>
          ))}
        </div>

        <div className="drawer-content">
          {tab === "architecture" ? (
            <div className="drawer-section" data-testid="architecture-panel">
              <p className="drawer-lead">
                A narrow briefing compiler, not an autonomous operations system.
              </p>
              <div className="architecture-flow" aria-label="Architecture flow">
                <div className="architecture-node">
                  <span>01 · Browser</span>
                  <strong>Scenario control only</strong>
                  <p>Sends one approved synthetic mode. No provider key or prompt is shipped.</p>
                </div>
                <span className="flow-arrow" aria-hidden="true">↓</span>
                <div className="architecture-node architecture-node-boundary">
                  <span>02 · Server trust boundary</span>
                  <strong>Zod input + deterministic checks</strong>
                  <p>Missing basis, conflicts and sensitive patterns are evaluated before drafting.</p>
                </div>
                <span className="flow-arrow" aria-hidden="true">↓</span>
                <div className="architecture-split">
                  <div className="architecture-node">
                    <span>03A · Optional provider</span>
                    <strong>Server-side only</strong>
                    <p>Used only when a configured credential exists and only for the safe baseline.</p>
                  </div>
                  <div className="architecture-node">
                    <span>03B · Seeded fallback</span>
                    <strong>Always available</strong>
                    <p>Produces the same reviewable result without a provider or network dependency.</p>
                  </div>
                </div>
                <span className="flow-arrow" aria-hidden="true">↓</span>
                <div className="architecture-node architecture-node-final">
                  <span>04 · Evidence gate</span>
                  <strong>Zod output + source-ID validation</strong>
                  <p>Only a draft or a visible withhold/redact/escalate state can reach the reviewer.</p>
                </div>
              </div>
            </div>
          ) : null}

          {tab === "boundary" ? (
            <div className="drawer-section" data-testid="boundary-panel">
              <p className="drawer-lead">The system assists with synthesis. People retain authority.</p>
              <dl className="boundary-list">
                <div><dt>Inside</dt><dd>Synthetic note ingestion, factual synthesis, citations, draft copy and deterministic risk checks.</dd></div>
                <div><dt>Outside</dt><dd>Sending messages, changing shipment state, customer identity, access credentials and specialist judgment.</dd></div>
                <div><dt>Withhold</dt><dd>No confirmed ETA, unsupported factual basis or malformed structured output.</dd></div>
                <div><dt>Escalate</dt><dd>Conflicting operational status, privacy boundary change or security-relevant content.</dd></div>
                <div><dt>Approve</dt><dd>Priya Nair, the named synthetic business owner, must approve every customer-facing draft.</dd></div>
              </dl>
              <p className="boundary-note">The demo stores nothing, sends nothing and connects to no operational system.</p>
            </div>
          ) : null}

          {tab === "receipt" ? (
            <div className="drawer-section" data-testid="receipt-panel">
              {result ? (
                <>
                  <div className="receipt-header">
                    <div><span>Receipt</span><strong>{result.receipt.receiptId}</strong></div>
                    <span className="receipt-status">Validated</span>
                  </div>
                  <div className="receipt-grid">
                    <div><span>Engine</span><strong>{result.receipt.engineMode}</strong></div>
                    <div><span>Model</span><strong>{result.receipt.modelVersion}</strong></div>
                    <div><span>Prompt</span><strong>{result.receipt.promptVersion}</strong></div>
                    <div><span>Guidance</span><strong>{result.receipt.guidanceVersion}</strong></div>
                  </div>
                  <div className="check-list">
                    {result.receipt.checks.map((check) => (
                      <div key={check.name} className={check.status === "triggered" ? "check-row check-row-triggered" : "check-row"}>
                        <span>{check.status === "passed" ? "✓" : "!"}</span>
                        <div><strong>{check.name}</strong><p>{check.detail}</p></div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="empty-receipt">
                  <span>EV-PENDING</span>
                  <h3>Run the workflow to mint an evaluation receipt.</h3>
                  <p>The receipt records versions, validation and every control that passed or triggered.</p>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
