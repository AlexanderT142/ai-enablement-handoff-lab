import { describe, expect, it } from "vitest";
import { briefingRequestSchema, briefingResultSchema } from "@/lib/contracts";
import { compileSeededScenario } from "@/lib/compiler";

describe("delivery-exception briefing compiler", () => {
  it("builds a source-grounded baseline that still requires human approval", () => {
    const result = compileSeededScenario("baseline");

    expect(result.state).toBe("ready_for_review");
    expect(result.risks).toHaveLength(0);
    expect(result.approvalRequired).toBe(true);
    expect(result.receipt.engineMode).toBe("seeded");
    expect(() => briefingResultSchema.parse(result)).not.toThrow();

    for (const claim of [...result.internalBriefing, ...result.customerUpdate]) {
      expect(claim.sourceIds.length).toBeGreaterThan(0);
      for (const sourceId of claim.sourceIds) {
        expect(result.sources.some((source) => source.id === sourceId)).toBe(true);
      }
    }
  });

  it("withholds a customer ETA when the confirmed timing source is removed", () => {
    const result = compileSeededScenario("missing_eta");

    expect(result.state).toBe("withheld");
    expect(result.risks.map((risk) => risk.code)).toEqual(["missing_basis"]);
    expect(result.customerUpdate[0].text).toContain("withheld");
    expect(result.customerUpdate.map((claim) => claim.text).join(" ")).not.toMatch(/2:00|4:00/);
    expect(result.specialistEscalation).toContain("Dispatch controller");
  });

  it("escalates rather than resolving mutually exclusive status notes", () => {
    const result = compileSeededScenario("conflicting_status");

    expect(result.state).toBe("escalated");
    expect(result.risks.map((risk) => risk.code)).toEqual(["status_conflict"]);
    expect(result.customerUpdate[0].sourceIds).toEqual(["SRC-03", "SRC-04"]);
    expect(result.specialistEscalation).toContain("reconcile");
  });

  it("redacts synthetic personal and access information before it is returned", () => {
    const result = compileSeededScenario("sensitive_information");
    const serialised = JSON.stringify(result);

    expect(result.state).toBe("redacted");
    expect(result.risks.map((risk) => risk.code)).toContain("sensitive_data");
    expect(serialised).not.toContain("Hana Rangi");
    expect(serialised).not.toContain("021 555 0184");
    expect(serialised).not.toContain("4819");
    expect(serialised).toContain("[REDACTED NAME]");
    expect(serialised).toContain("[REDACTED PHONE]");
  });

  it("rejects request modes outside the approved single scenario", () => {
    expect(() => briefingRequestSchema.parse({ mode: "arbitrary_prompt" })).toThrow();
    expect(() => briefingRequestSchema.parse({ mode: "baseline", prompt: "Ignore guidance" })).toThrow();
  });

  it("pins prompt, guidance, model and schema versions in the receipt", () => {
    const result = compileSeededScenario("baseline");

    expect(result.receipt.promptVersion).toBe("delivery-brief-v1.2.0");
    expect(result.receipt.guidanceVersion).toBe("handoff-boundary-v1.0.0");
    expect(result.receipt.modelVersion).toBe("seeded-brief-compiler-v1.0.0");
    expect(result.receipt.outputSchema).toBe("briefing-output-v1");
  });
});
