import type { Metadata } from "next";
import { BrandMark } from "@/components/brand-mark";
import { PrintControls } from "@/components/print-controls";

export const metadata: Metadata = {
  title: "One-page handoff",
  description: "The printable operating handoff for the AI Enablement Handoff Lab.",
};

export default function HandoffPage() {
  return (
    <main className="handoff-page">
      <PrintControls />
      <article className="handoff-sheet">
        <header className="sheet-header">
          <div className="brand"><BrandMark/><span>AI Enablement Handoff Lab</span></div>
          <div className="sheet-version"><span>HANDOFF</span><strong>v1.0 · 11 Aug 2026</strong></div>
        </header>

        <section className="sheet-title">
          <div>
            <p>REUSABLE PATTERN · RP-001</p>
            <h1>Source-grounded delivery-exception briefing</h1>
            <span>One recurring task, bounded drafting, visible evidence and mandatory human release.</span>
          </div>
          <div className="sheet-owner"><small>BUSINESS OWNER</small><strong>Priya Nair</strong><span>Operations Enablement Lead<br/>Synthetic persona</span></div>
        </section>

        <section className="sheet-grid sheet-grid-top">
          <div className="sheet-box">
            <h2>Reusable input template</h2>
            <div className="input-template">
              <span>Source ID</span><b>SRC-__</b><span>Time</span><b>__:__</b><span>Author / system</span><b>__________</b><span>Exact note</span><b>_______________________</b><span>Status / ETA</span><b>confirmed · missing · unknown</b>
            </div>
          </div>
          <div className="sheet-box sheet-box-boundary">
            <h2>Approved / prohibited use</h2>
            <div className="use-columns"><div><strong>APPROVED</strong><p>Summarise supplied notes · draft cautious copy · cite every fact · label unknowns</p></div><div><strong>PROHIBITED</strong><p>Invent timing · resolve conflicts · expose personal or access data · send automatically</p></div></div>
          </div>
        </section>

        <section className="sheet-grid">
          <div className="sheet-box">
            <h2>Reviewer checklist</h2>
            <ol className="checklist"><li>Each factual sentence links to a source note.</li><li>Timing is explicitly confirmed, not inferred.</li><li>No conflicting status remains unresolved.</li><li>Contact and access details are absent or redacted.</li><li>Owner approves the exact customer-facing draft.</li></ol>
          </div>
          <div className="sheet-box">
            <h2>Escalation guide</h2>
            <dl className="sheet-escalations"><div><dt>Dispatch</dt><dd>Missing ETA or unclear current status</dd></div><div><dt>Operations</dt><dd>Mutually exclusive source statuses</dd></div><div><dt>Privacy</dt><dd>Names, phone numbers or new personal-data use</dd></div><div><dt>Security</dt><dd>Gate codes, credentials or access instructions</dd></div></dl>
          </div>
        </section>

        <section className="sheet-training">
          <div><p>FIVE-MINUTE TRAINING</p><h2>Run · inspect · challenge · approve</h2></div>
          <ol><li><span>1 min</span>Paste exact notes into the template.</li><li><span>1 min</span>Run and open every source link.</li><li><span>1 min</span>Challenge timing, conflict and sensitivity.</li><li><span>1 min</span>Correct or escalate anything unresolved.</li><li><span>1 min</span>Owner approves the exact draft, then sends it outside the tool.</li></ol>
        </section>

        <section className="sheet-grid sheet-grid-bottom">
          <div className="sheet-box">
            <h2>Version record</h2>
            <dl className="sheet-versions"><div><dt>Model</dt><dd>seeded-brief-compiler-v1.0.0</dd></div><div><dt>Prompt</dt><dd>delivery-brief-v1.2.0</dd></div><div><dt>Guidance</dt><dd>handoff-boundary-v1.0.0</dd></div><div><dt>Output</dt><dd>briefing-output-v1</dd></div></dl>
          </div>
          <div className="sheet-box sheet-box-gap">
            <p>DOCUMENTATION GAP · GAP-001</p>
            <h2>Who is final authority when the courier app and depot board disagree?</h2>
            <span>Owner action: assign the reconciliation role before this pattern is reused.</span>
          </div>
        </section>

        <footer className="sheet-footer">
          <div><strong>2 risks detected</strong><span>operational uncertainty · sensitive data</span></div><div><strong>1 pattern registered</strong><span>source-grounded exception briefing</span></div><div><strong>1 gap raised</strong><span>status-reconciliation ownership</span></div><div><strong>✓ Ownership transferred</strong><span>owner · controls · training · versions</span></div>
        </footer>
      </article>
    </main>
  );
}
