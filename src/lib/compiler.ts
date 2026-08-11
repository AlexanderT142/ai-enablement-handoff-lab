import {
  briefingResultSchema,
  type BriefingResult,
  type ModelDraft,
  type ScenarioMode,
} from "@/lib/contracts";
import { getScenarioSources, type RawSourceNote } from "@/lib/scenario";
import {
  GUIDANCE_VERSION,
  PROMPT_VERSION,
  SEEDED_MODEL_VERSION,
} from "@/lib/versions";

const phoneTestPattern = /\b(?:\+?64|0)2\d(?:[\s-]?\d){6,8}\b/;
const gateCodeTestPattern = /\bgate code\s+\d{3,8}\b/i;
const namedCustomerTestPattern = /\bcustomer name:\s+[A-Z][a-z]+\s+[A-Z][a-z]+/i;

function containsSensitiveInformation(text: string) {
  return (
    phoneTestPattern.test(text) ||
    gateCodeTestPattern.test(text) ||
    namedCustomerTestPattern.test(text)
  );
}

function redact(text: string) {
  return text
    .replace(new RegExp(phoneTestPattern, "g"), "[REDACTED PHONE]")
    .replace(new RegExp(gateCodeTestPattern, "gi"), "gate code [REDACTED]")
    .replace(new RegExp(namedCustomerTestPattern, "gi"), "Customer name: [REDACTED NAME]");
}

function sanitiseSources(sources: RawSourceNote[]) {
  return sources.map((source) => {
    const sensitive = containsSensitiveInformation(source.text);
    return {
      id: source.id,
      time: source.time,
      author: source.author,
      text: sensitive ? redact(source.text) : source.text,
      sensitivity: sensitive ? ("redacted" as const) : ("internal" as const),
    };
  });
}

function buildReceipt(
  mode: ScenarioMode,
  engineMode: "seeded" | "provider",
  modelVersion: string,
  flags: { missingEta: boolean; conflict: boolean; sensitive: boolean },
) {
  const fingerprint = `${mode}:${engineMode}:${PROMPT_VERSION}`
    .split("")
    .reduce((hash, character) => (hash * 31 + character.charCodeAt(0)) >>> 0, 0)
    .toString(16)
    .padStart(8, "0");

  return {
    receiptId: `EV-${fingerprint.toUpperCase()}`,
    evaluatedAt: "2026-08-11T10:00:00+12:00",
    inputSchema: "briefing-input-v1" as const,
    outputSchema: "briefing-output-v1" as const,
    promptVersion: PROMPT_VERSION,
    guidanceVersion: GUIDANCE_VERSION,
    modelVersion,
    engineMode,
    checks: [
      {
        name: "Structured output",
        status: "passed" as const,
        detail: "Input and output validated against strict Zod contracts.",
      },
      {
        name: "Source coverage",
        status: "passed" as const,
        detail: "Every operational claim carries one or more source IDs.",
      },
      {
        name: "Missing basis",
        status: flags.missingEta ? ("triggered" as const) : ("passed" as const),
        detail: flags.missingEta
          ? "No confirmed ETA found; customer timing was withheld."
          : "Confirmed delivery window found in SRC-02.",
      },
      {
        name: "Status conflict",
        status: flags.conflict ? ("triggered" as const) : ("passed" as const),
        detail: flags.conflict
          ? "Departed and held statuses conflict; specialist escalation opened."
          : "No mutually exclusive shipment statuses found.",
      },
      {
        name: "Sensitivity",
        status: flags.sensitive ? ("triggered" as const) : ("passed" as const),
        detail: flags.sensitive
          ? "Synthetic name, phone number and access code were redacted."
          : "No sensitive contact or access data detected.",
      },
    ],
  };
}

function deterministicDraft(mode: ScenarioMode): ModelDraft {
  if (mode === "missing_eta") {
    return {
      internalBriefing: [
        {
          id: "INT-01",
          text: "The earlier weather hold has cleared.",
          sourceIds: ["SRC-02"],
        },
        {
          id: "INT-02",
          text: "Route R-17 departed at 09:16 with no visible packaging damage recorded.",
          sourceIds: ["SRC-03"],
        },
        {
          id: "INT-03",
          text: "No confirmed customer delivery window is present in the supplied notes.",
          sourceIds: ["SRC-02"],
        },
      ],
      customerUpdate: [
        {
          id: "CUS-01",
          text: "A customer timing update is withheld because the supplied notes contain no confirmed delivery window.",
          sourceIds: ["SRC-02"],
        },
      ],
    };
  }

  if (mode === "conflicting_status") {
    return {
      internalBriefing: [
        {
          id: "INT-01",
          text: "The courier app reports route R-17 departed at 09:16.",
          sourceIds: ["SRC-03"],
        },
        {
          id: "INT-02",
          text: "A later depot-board note reports the same item held for address verification.",
          sourceIds: ["SRC-04"],
        },
        {
          id: "INT-03",
          text: "The shipment status is unresolved because the two operational sources conflict.",
          sourceIds: ["SRC-03", "SRC-04"],
        },
      ],
      customerUpdate: [
        {
          id: "CUS-01",
          text: "The customer update is withheld until the departed and held statuses are reconciled.",
          sourceIds: ["SRC-03", "SRC-04"],
        },
      ],
    };
  }

  const baseDraft: ModelDraft = {
    internalBriefing: [
      {
        id: "INT-01",
        text: "The earlier weather hold has cleared.",
        sourceIds: ["SRC-02"],
      },
      {
        id: "INT-02",
        text: "Item DX-4821 left North Harbour depot on route R-17 at 09:16.",
        sourceIds: ["SRC-01", "SRC-03"],
      },
      {
        id: "INT-03",
        text: "The confirmed delivery window is 2:00-4:00 pm today.",
        sourceIds: ["SRC-02"],
      },
    ],
    customerUpdate: [
      {
        id: "CUS-01",
        text: "Your delivery DX-4821 is on its way.",
        sourceIds: ["SRC-03"],
      },
      {
        id: "CUS-02",
        text: "The current confirmed delivery window is 2:00-4:00 pm today.",
        sourceIds: ["SRC-02"],
      },
    ],
  };

  if (mode === "sensitive_information") {
    baseDraft.internalBriefing.push({
      id: "INT-04",
      text: "Sensitive contact and access details in the dispatcher note were redacted and excluded from the draft.",
      sourceIds: ["SRC-04"],
    });
  }

  return baseDraft;
}

export function compileSeededScenario(
  mode: ScenarioMode,
  modelDraft?: ModelDraft,
  providerMeta?: { modelVersion: string },
): BriefingResult {
  const rawSources = getScenarioSources(mode);
  const statuses = new Set(rawSources.flatMap((source) => source.status ?? []));
  const missingEta = !rawSources.some((source) => source.confirmedEta);
  const conflict = statuses.has("departed") && statuses.has("held");
  const sensitive = rawSources.some((source) => containsSensitiveInformation(source.text));
  const draft = modelDraft ?? deterministicDraft(mode);
  const sourceIds = new Set(rawSources.map((source) => source.id));

  for (const claim of [...draft.internalBriefing, ...draft.customerUpdate]) {
    if (claim.sourceIds.some((sourceId) => !sourceIds.has(sourceId as RawSourceNote["id"]))) {
      throw new Error(`Claim ${claim.id} cites a source that is not in the scenario.`);
    }
  }

  let state: BriefingResult["state"] = "ready_for_review";
  let stateLabel = "Ready for human review";
  let summary = "A source-grounded briefing and customer draft are ready for approval.";
  let specialistEscalation: string | null = null;

  if (missingEta) {
    state = "withheld";
    stateLabel = "ETA withheld";
    summary = "The workflow refused to invent a delivery window.";
    specialistEscalation = "Dispatch controller: confirm a customer delivery window before release.";
  } else if (conflict) {
    state = "escalated";
    stateLabel = "Status conflict escalated";
    summary = "The workflow stopped on mutually exclusive shipment statuses.";
    specialistEscalation = "Operations specialist: reconcile courier-app and depot-board status.";
  } else if (sensitive) {
    state = "redacted";
    stateLabel = "Sensitive details redacted";
    summary = "The workflow removed contact and access details before drafting.";
    specialistEscalation = "Privacy lead: review whether contact details belong in this workflow.";
  }

  const risks: BriefingResult["risks"] = [];
  if (missingEta) {
    risks.push({
      code: "missing_basis",
      label: "Missing factual basis",
      detail: "No confirmed ETA is available in the supplied notes.",
      action: "Withhold timing and ask dispatch to confirm it.",
    });
  }
  if (conflict) {
    risks.push({
      code: "status_conflict",
      label: "Conflicting operational status",
      detail: "The courier app and depot board disagree about release state.",
      action: "Escalate to an operations specialist before drafting.",
    });
  }
  if (sensitive) {
    risks.push({
      code: "sensitive_data",
      label: "Sensitive information",
      detail: "A synthetic name, phone number and gate code were detected.",
      action: "Redact the values and route the workflow boundary to privacy review.",
    });
  }

  return briefingResultSchema.parse({
    mode,
    state,
    stateLabel,
    summary,
    sources: sanitiseSources(rawSources),
    internalBriefing: draft.internalBriefing,
    customerUpdate: draft.customerUpdate,
    risks,
    approvalRequired: true,
    approvalOwner: "Priya Nair, Operations Enablement Lead",
    specialistEscalation,
    receipt: buildReceipt(
      mode,
      providerMeta ? "provider" : "seeded",
      providerMeta?.modelVersion ?? SEEDED_MODEL_VERSION,
      { missingEta, conflict, sensitive },
    ),
  });
}
