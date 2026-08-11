"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { briefingResultSchema, type BriefingResult, type ScenarioMode } from "@/lib/contracts";
import { BrandMark } from "@/components/brand-mark";
import { DesignDrawer } from "@/components/design-drawer";
import { ResultPanel } from "@/components/result-panel";
import { WorkflowRail } from "@/components/workflow-rail";

const controls: Array<{ mode: ScenarioMode; label: string; detail: string; response: string }> = [
  { mode: "baseline", label: "Safe baseline", detail: "Three consistent notes with a confirmed window.", response: "Draft + review" },
  { mode: "missing_eta", label: "Remove confirmed ETA", detail: "Take away the only supported delivery window.", response: "Withhold" },
  { mode: "conflicting_status", label: "Introduce conflicting statuses", detail: "Add a later depot hold against a departed route.", response: "Escalate" },
  { mode: "sensitive_information", label: "Add sensitive information", detail: "Insert a synthetic name, phone number and gate code.", response: "Redact" },
];

export function HandoffLab() {
  const [activeStage, setActiveStage] = useState(0);
  const [activeMode, setActiveMode] = useState<ScenarioMode>("baseline");
  const [result, setResult] = useState<BriefingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const selectStage = (stage: number) => {
    setActiveStage(stage);
    document.getElementById("lab")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const runScenario = useCallback(async (mode: ScenarioMode) => {
    setActiveMode(mode);
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/briefing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode }),
      });
      if (!response.ok) throw new Error("The guarded briefing route rejected this run.");
      setResult(briefingResultSchema.parse(await response.json()));
    } catch (runError) {
      setResult(null);
      setError(runError instanceof Error ? runError.message : "The run failed safely.");
    } finally {
      setLoading(false);
    }
  }, []);

  const startLab = () => selectStage(0);

  return (
    <>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="AI Enablement Handoff Lab home">
          <BrandMark />
          <span>AI Enablement Handoff Lab</span>
        </Link>
        <div className="header-actions">
          <span className="synthetic-label">Synthetic data only</span>
          <button className="inspect-button" onClick={() => setDrawerOpen(true)}>
            Inspect the design <span aria-hidden="true">↗</span>
          </button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow"><span /> Independent public work sample</p>
            <h1>Turn one repeated task into a controlled handoff.</h1>
            <p className="hero-promise">
              Turn one recurring business task into a safe AI-assisted workflow, test its limits and leave the team with everything needed to own it.
            </p>
            <div className="hero-actions">
              <button className="button button-primary" onClick={startLab}>
                Start the 3-minute lab <span aria-hidden="true">→</span>
              </button>
              <button className="button button-secondary" onClick={() => setDrawerOpen(true)}>
                See how safety works
              </button>
            </div>
            <div className="hero-proof">
              <div><strong>1</strong><span>realistic task</span></div>
              <div><strong>3</strong><span>failure controls</span></div>
              <div><strong>0</strong><span>facts without sources</span></div>
            </div>
          </div>

          <div className="hero-visual" aria-label="Workflow outcome preview">
            <div className="visual-header">
              <div><span className="visual-dot" /><span className="visual-dot" /><span className="visual-dot" /></div>
              <span>Exception brief · DX-4821</span>
              <span className="live-pill">CONTROLLED</span>
            </div>
            <div className="visual-body">
              <div className="visual-route">
                <div className="route-node route-node-done"><span>1</span><div><small>NOTE</small><strong>Weather hold cleared</strong></div></div>
                <div className="route-line" />
                <div className="route-node route-node-active"><span>2</span><div><small>CHECK</small><strong>Sources agree</strong></div></div>
                <div className="route-line route-line-dashed" />
                <div className="route-node"><span>3</span><div><small>RELEASE</small><strong>Human approval</strong></div></div>
              </div>
              <div className="visual-output">
                <div className="visual-output-head"><span>Draft customer update</span><span>2 sources</span></div>
                <p>Your delivery is on its way.</p>
                <p>The confirmed window is <mark>2:00-4:00 pm</mark>.</p>
                <div className="visual-source-row"><span>SRC-02</span><span>SRC-03</span></div>
              </div>
              <div className="visual-gate"><span>✓</span><div><strong>Guardrail passed</strong><small>No unsupported timing or sensitive data</small></div></div>
            </div>
            <div className="visual-caption">
              <span>Provider optional</span><span>Zod validated</span><span>Seeded fallback ready</span>
            </div>
          </div>
        </section>

        <section className="outcome-strip" aria-label="Handoff outcome">
          <div><span className="outcome-icon">!</span><strong>2 risk categories detected</strong><small>Operational uncertainty · sensitive data</small></div>
          <div><span className="outcome-icon">↻</span><strong>1 reusable pattern registered</strong><small>Source-grounded exception briefing</small></div>
          <div><span className="outcome-icon">?</span><strong>1 documentation gap raised</strong><small>No owner for conflicting scan status</small></div>
          <div><span className="outcome-icon">✓</span><strong>Ownership transferred</strong><small>Owner, controls and training included</small></div>
        </section>

        <section className="lab-shell" id="lab">
          <div className="lab-heading">
            <div>
              <p className="eyebrow">One scenario · five decisions · three minutes</p>
              <h2>From messy notes to a controlled handoff</h2>
            </div>
            <div className="owner-chip"><span>Owner</span><strong>Priya Nair</strong><small>Operations Enablement Lead · synthetic persona</small></div>
          </div>

          <WorkflowRail activeStage={activeStage} onSelect={selectStage} />

          <div className="stage-panel" data-testid={`stage-${activeStage}`}>
            {activeStage === 0 ? (
              <section className="stage-content discover-stage">
                <div className="stage-intro">
                  <p className="stage-label">01 · Discover</p>
                  <h3>Start with the work, not the model.</h3>
                  <p>A short SME-style intake makes the operational task and the cost of getting it wrong visible before a prototype exists.</p>
                </div>
                <div className="intake-grid">
                  <article className="intake-card intake-card-featured"><span>Recurring task</span><strong>Turn delivery-exception notes into an internal briefing and a draft customer update.</strong><p>About 12 times per weekday · 4-7 notes per exception</p></article>
                  <article className="intake-card"><span>SME signal</span><strong>“We lose time deciding which note is current.”</strong><p>Mia, Dispatch Coordinator · synthetic interview note</p></article>
                  <article className="intake-card"><span>Good outcome</span><strong>One short brief, one cautious draft and visible evidence.</strong><p>The reviewer can verify each factual sentence in seconds.</p></article>
                  <article className="intake-card"><span>Failure cost</span><strong>A plausible ETA becomes a promise the operation did not make.</strong><p>Wrong timing damages trust and triggers avoidable follow-up.</p></article>
                </div>
                <div className="decision-line"><div><span className="decision-index">D1</span><p><strong>Prototype decision</strong> Narrow to one repeatable task with observable inputs and a human release point.</p></div><button className="button button-primary" onClick={() => selectStage(1)}>Set the boundary <span>→</span></button></div>
              </section>
            ) : null}

            {activeStage === 1 ? (
              <section className="stage-content boundary-stage">
                <div className="stage-intro">
                  <p className="stage-label">02 · Set the boundary</p>
                  <h3>Decide what the workflow may do before asking it to do anything.</h3>
                  <p>The boundary is a product requirement: clear enough for the SME, reviewer and engineer to use the same rule.</p>
                </div>
                <div className="boundary-decision-grid">
                  <article className="boundary-card data-card"><span className="card-number">A</span><p className="section-kicker">Data-sensitivity decision</p><h4>Internal operational data</h4><p>Use only prepared shipment notes. Exclude or redact customer contact details, access codes and free-text identifiers.</p><div className="sensitivity-meter"><span className="meter-on"/><span className="meter-on"/><span/><span/><small>Internal · constrained</small></div></article>
                  <article className="boundary-card allowed-card"><span className="card-number">B</span><p className="section-kicker">Allowed use</p><ul><li>Synthesise supplied notes</li><li>Draft cautious internal and customer copy</li><li>Label unknowns and cite sources</li><li>Suggest the required reviewer</li></ul></article>
                  <article className="boundary-card prohibited-card"><span className="card-number">C</span><p className="section-kicker">Prohibited use</p><ul><li>Invent or “best guess” an ETA</li><li>Resolve conflicting operations data</li><li>Send or publish a customer message</li><li>Process contact or security details</li></ul></article>
                </div>
                <div className="authority-grid">
                  <div><span>Mandatory approval</span><strong>Priya Nair</strong><p>Owns the workflow and every customer-facing release.</p></div>
                  <div><span>Specialist escalation</span><strong>Dispatch · Privacy · Security</strong><p>Triggered by missing timing, conflicting status, personal data or access credentials.</p></div>
                </div>
                <div className="decision-line"><div><span className="decision-index">D2</span><p><strong>Boundary set</strong> AI drafts. Deterministic checks constrain. A person releases.</p></div><button className="button button-primary" onClick={() => selectStage(2)}>Try the workflow <span>→</span></button></div>
              </section>
            ) : null}

            {activeStage === 2 ? (
              <section className="stage-content try-stage">
                <div className="stage-intro stage-intro-split">
                  <div><p className="stage-label">03 · Try the workflow</p><h3>Generate a brief that shows its work.</h3><p>Every operational claim must carry a source ID. The output is a draft until the named owner approves it.</p></div>
                  <button className="button button-primary run-button" onClick={() => runScenario("baseline")} disabled={loading} data-testid="run-baseline">
                    {loading ? <><span className="spinner"/> Checking sources…</> : <>Run safe draft <span>→</span></>}
                  </button>
                </div>
                {error ? <div className="safe-error" role="alert"><strong>Safe stop</strong><p>{error} No draft was released.</p></div> : null}
                {result ? <ResultPanel result={result} /> : <div className="empty-run"><div className="empty-run-mark">↳</div><h4>Three prepared source notes are ready.</h4><p>Run the workflow to validate the contract, check the boundary and mint an evidence receipt.</p><div><span>SRC-01</span><span>SRC-02</span><span>SRC-03</span></div></div>}
                {result ? <div className="decision-line"><div><span className="decision-index">D3</span><p><strong>Draft, not decision</strong> Sources are inspectable and human approval remains mandatory.</p></div><button className="button button-primary" onClick={() => selectStage(3)}>Break it safely <span>→</span></button></div> : null}
              </section>
            ) : null}

            {activeStage === 3 ? (
              <section className="stage-content break-stage">
                <div className="stage-intro">
                  <p className="stage-label">04 · Break it safely</p>
                  <h3>A guardrail only counts when a prepared failure turns it red.</h3>
                  <p>Choose a control. The same route must visibly withhold, escalate or redact instead of filling the gap with confident prose.</p>
                </div>
                <div className="control-grid" role="group" aria-label="Failure controls">
                  {controls.map((control) => (
                    <button
                      key={control.mode}
                      className={activeMode === control.mode ? "control-card control-card-active" : "control-card"}
                      onClick={() => runScenario(control.mode)}
                      disabled={loading}
                      data-testid={`control-${control.mode}`}
                    >
                      <span className="control-radio" aria-hidden="true"><span /></span>
                      <span className="control-copy"><strong>{control.label}</strong><small>{control.detail}</small></span>
                      <span className="response-tag">{control.response}</span>
                    </button>
                  ))}
                </div>
                {loading ? <div className="loading-line"><span className="spinner"/> Re-running the same contract against the changed evidence…</div> : null}
                {error ? <div className="safe-error" role="alert"><strong>Safe stop</strong><p>{error} No draft was released.</p></div> : null}
                {result ? <ResultPanel result={result} /> : <div className="empty-run"><h4>Select a control to challenge the workflow.</h4></div>}
                {result ? <div className="decision-line"><div><span className="decision-index">D4</span><p><strong>Failure made visible</strong> Missing, conflicting and sensitive inputs produce distinct safe states.</p></div><button className="button button-primary" onClick={() => selectStage(4)}>Hand it back <span>→</span></button></div> : null}
              </section>
            ) : null}

            {activeStage === 4 ? (
              <section className="stage-content handback-stage">
                <div className="stage-intro stage-intro-split">
                  <div><p className="stage-label">05 · Hand it back</p><h3>The team receives an operating kit, not a mysterious demo.</h3><p>Ownership, versions, escalation and the next documentation question are recorded together.</p></div>
                  <a className="button button-primary" href="/AI-Enablement-Handoff-One-Page.pdf" download>Download one-page handoff <span>↓</span></a>
                </div>
                <div className="handoff-grid">
                  <article className="handoff-card handoff-card-owner"><p className="section-kicker">Business owner</p><div className="owner-avatar">PN</div><h4>Priya Nair</h4><p>Operations Enablement Lead<br/><small>Synthetic persona for this work sample</small></p><span className="owner-status">Ownership accepted</span></article>
                  <article className="handoff-card handoff-card-assets"><p className="section-kicker">Operating kit · 6/6 complete</p><ul><li><span>✓</span><div><strong>Reusable input template</strong><small>Exception note · source · time · author · status</small></div></li><li><span>✓</span><div><strong>Approved / prohibited-use guide</strong><small>Clear drafting and authority boundary</small></div></li><li><span>✓</span><div><strong>Reviewer checklist</strong><small>Sources, conflicts, sensitivity, wording, release</small></div></li><li><span>✓</span><div><strong>Escalation guide</strong><small>Dispatch, privacy and security triggers</small></div></li><li><span>✓</span><div><strong>Five-minute training resource</strong><small>Run, inspect, challenge, approve</small></div></li><li><span>✓</span><div><strong>Version record</strong><small>Model, prompt and guidance pinned</small></div></li></ul></article>
                  <article className="handoff-card handoff-card-version"><p className="section-kicker">Version record</p><dl><div><dt>Model</dt><dd>{result?.receipt.modelVersion ?? "seeded-brief-compiler-v1.0.0"}</dd></div><div><dt>Prompt</dt><dd>delivery-brief-v1.2.0</dd></div><div><dt>Guidance</dt><dd>handoff-boundary-v1.0.0</dd></div><div><dt>Schema</dt><dd>briefing-output-v1</dd></div></dl></article>
                  <article className="handoff-card handoff-card-pattern"><p className="section-kicker">Reusable-pattern register · RP-001</p><h4>Source-grounded exception briefing</h4><p>Use when short operational notes must become a reviewable internal brief and draft outward communication.</p><div className="pattern-tags"><span>bounded drafting</span><span>source anchors</span><span>human release</span></div></article>
                  <article className="handoff-card handoff-card-gap"><p className="section-kicker">New documentation gap · GAP-001</p><h4>Who owns scan-status reconciliation?</h4><p>The current synthetic guidance names dispatch and operations, but does not define who is final authority when the courier app and depot board disagree.</p><span className="gap-action">Raised for owner decision before reuse</span></article>
                </div>
                <div className="final-outcome" data-testid="final-outcome">
                  <div><span>02</span><small>risks detected</small></div><i>·</i><div><span>01</span><small>reusable pattern registered</small></div><i>·</i><div><span>01</span><small>documentation gap raised</small></div><i>·</i><div className="final-transfer"><span>✓</span><small>ownership transferred</small></div>
                </div>
              </section>
            ) : null}
          </div>
        </section>

        <section className="closing-section">
          <p className="eyebrow">The enablement standard</p>
          <h2>Useful on day one. Operable on day two.</h2>
          <p>The workflow, its failure states and the handoff evidence remain inspectable after the builder leaves.</p>
          <div className="closing-links"><a href="https://github.com/AlexanderT142/ai-enablement-handoff-lab" target="_blank" rel="noreferrer">View source on GitHub ↗</a><button onClick={() => setDrawerOpen(true)}>Inspect architecture ↗</button><a href="/handoff">Open printable handoff ↗</a></div>
        </section>
      </main>

      <footer>
        <div className="brand"><BrandMark/><span>AI Enablement Handoff Lab</span></div>
        <p>Independently built by Alexander Tian · Entirely synthetic operational data · No company involvement implied</p>
      </footer>

      <DesignDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} result={result} />
    </>
  );
}
