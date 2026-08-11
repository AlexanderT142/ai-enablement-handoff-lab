import { z } from "zod";

export const scenarioModeSchema = z.enum([
  "baseline",
  "missing_eta",
  "conflicting_status",
  "sensitive_information",
]);

export type ScenarioMode = z.infer<typeof scenarioModeSchema>;

export const briefingRequestSchema = z
  .object({ mode: scenarioModeSchema })
  .strict();

export const sourceNoteSchema = z
  .object({
    id: z.string().regex(/^SRC-\d{2}$/),
    time: z.string(),
    author: z.string(),
    text: z.string(),
    sensitivity: z.enum(["internal", "redacted"]),
  })
  .strict();

export const sourcedClaimSchema = z
  .object({
    id: z.string(),
    text: z.string().min(1),
    sourceIds: z.array(z.string().regex(/^SRC-\d{2}$/)).min(1),
  })
  .strict();

export const riskSchema = z
  .object({
    code: z.enum(["missing_basis", "status_conflict", "sensitive_data"]),
    label: z.string(),
    detail: z.string(),
    action: z.string(),
  })
  .strict();

export const evaluationReceiptSchema = z
  .object({
    receiptId: z.string(),
    evaluatedAt: z.string(),
    inputSchema: z.literal("briefing-input-v1"),
    outputSchema: z.literal("briefing-output-v1"),
    promptVersion: z.string(),
    guidanceVersion: z.string(),
    modelVersion: z.string(),
    engineMode: z.enum(["seeded", "provider"]),
    checks: z.array(
      z.object({
        name: z.string(),
        status: z.enum(["passed", "triggered"]),
        detail: z.string(),
      }),
    ),
  })
  .strict();

export const briefingResultSchema = z
  .object({
    mode: scenarioModeSchema,
    state: z.enum(["ready_for_review", "withheld", "escalated", "redacted"]),
    stateLabel: z.string(),
    summary: z.string(),
    sources: z.array(sourceNoteSchema).min(1),
    internalBriefing: z.array(sourcedClaimSchema).min(1),
    customerUpdate: z.array(sourcedClaimSchema).min(1),
    risks: z.array(riskSchema),
    approvalRequired: z.literal(true),
    approvalOwner: z.literal("Priya Nair, Operations Enablement Lead"),
    specialistEscalation: z.string().nullable(),
    receipt: evaluationReceiptSchema,
  })
  .strict();

export type BriefingResult = z.infer<typeof briefingResultSchema>;

export const modelDraftSchema = z
  .object({
    internalBriefing: z.array(sourcedClaimSchema).min(1).max(5),
    customerUpdate: z.array(sourcedClaimSchema).min(1).max(4),
  })
  .strict();

export type ModelDraft = z.infer<typeof modelDraftSchema>;
