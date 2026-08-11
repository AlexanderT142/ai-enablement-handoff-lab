import type { BriefingResult } from "@/lib/contracts";

function SourceLinks({ sourceIds }: { sourceIds: string[] }) {
  const focusSource = (sourceId: string) => {
    const target = document.getElementById(sourceId);
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
    target?.focus({ preventScroll: true });
  };

  return (
    <span className="source-links" aria-label="Sources">
      {sourceIds.map((sourceId) => (
        <button key={sourceId} onClick={() => focusSource(sourceId)}>
          {sourceId}
        </button>
      ))}
    </span>
  );
}

function ClaimList({
  claims,
}: {
  claims: BriefingResult["internalBriefing"] | BriefingResult["customerUpdate"];
}) {
  return (
    <ul className="claim-list">
      {claims.map((claim) => (
        <li key={claim.id}>
          <span>{claim.text}</span>
          <SourceLinks sourceIds={claim.sourceIds} />
        </li>
      ))}
    </ul>
  );
}

export function ResultPanel({ result }: { result: BriefingResult }) {
  const stateClass = `result-state result-state-${result.state}`;

  return (
    <div className="result-layout" data-testid="briefing-result">
      <section className="source-column" aria-labelledby="source-notes-heading">
        <div className="section-kicker-row">
          <p className="section-kicker" id="source-notes-heading">
            Supplied notes
          </p>
          <span>{result.sources.length} sources</span>
        </div>
        <div className="source-list">
          {result.sources.map((source) => (
            <article
              className={source.sensitivity === "redacted" ? "source-card source-card-redacted" : "source-card"}
              id={source.id}
              key={source.id}
              tabIndex={-1}
            >
              <div className="source-meta">
                <span>{source.id}</span>
                <span>{source.time}</span>
                <span>{source.author}</span>
              </div>
              <p>{source.text}</p>
              {source.sensitivity === "redacted" ? (
                <span className="redaction-label">Sensitive values removed</span>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="output-column" aria-labelledby="generated-output-heading">
        <div className={stateClass} data-testid="result-state">
          <span className="state-signal" aria-hidden="true" />
          <div>
            <strong>{result.stateLabel}</strong>
            <p>{result.summary}</p>
          </div>
        </div>

        <div className="output-card">
          <div className="section-kicker-row">
            <p className="section-kicker" id="generated-output-heading">
              Internal briefing
            </p>
            <span>Source-grounded</span>
          </div>
          <ClaimList claims={result.internalBriefing} />
        </div>

        <div className={result.state === "ready_for_review" || result.state === "redacted" ? "output-card customer-card" : "output-card customer-card output-card-held"}>
          <div className="section-kicker-row">
            <p className="section-kicker">Draft customer update</p>
            <span>{result.state === "ready_for_review" || result.state === "redacted" ? "Draft only" : "Not releasable"}</span>
          </div>
          <ClaimList claims={result.customerUpdate} />
        </div>

        {result.risks.length > 0 ? (
          <div className="risk-list" data-testid="risk-list">
            {result.risks.map((risk) => (
              <article key={risk.code} className="risk-card">
                <span className="risk-icon" aria-hidden="true">!</span>
                <div>
                  <strong>{risk.label}</strong>
                  <p>{risk.detail}</p>
                  <small>{risk.action}</small>
                </div>
              </article>
            ))}
          </div>
        ) : null}

        <div className="approval-line">
          <span className="approval-check" aria-hidden="true">✓</span>
          <div>
            <strong>Human approval is mandatory</strong>
            <p>{result.approvalOwner} owns release. The workflow cannot send the draft.</p>
          </div>
        </div>

        {result.specialistEscalation ? (
          <div className="escalation-line" data-testid="specialist-escalation">
            <span>Escalation</span>
            <p>{result.specialistEscalation}</p>
          </div>
        ) : null}
      </section>
    </div>
  );
}
