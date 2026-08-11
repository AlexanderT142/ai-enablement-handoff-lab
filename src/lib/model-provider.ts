import "server-only";

import { modelDraftSchema, type ModelDraft } from "@/lib/contracts";
import { getScenarioSources } from "@/lib/scenario";
import { GUIDANCE_VERSION, PROMPT_VERSION } from "@/lib/versions";
import type { ScenarioMode } from "@/lib/contracts";

type ProviderDraft = {
  draft: ModelDraft;
  modelVersion: string;
};

export async function tryProviderDraft(mode: ScenarioMode): Promise<ProviderDraft | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || mode !== "baseline") return null;

  const modelVersion = process.env.OPENAI_MODEL || "gpt-5-mini";
  const sources = getScenarioSources(mode).map(({ id, time, author, text }) => ({
    id,
    time,
    author,
    text,
  }));

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: modelVersion,
      instructions: [
        `Prompt version: ${PROMPT_VERSION}`,
        `Guidance version: ${GUIDANCE_VERSION}`,
        "Draft a concise internal briefing and customer update using only the supplied source notes.",
        "Every claim must cite one or more exact source IDs. Do not infer timing, cause, or outcome.",
        "Return JSON only.",
      ].join("\n"),
      input: JSON.stringify(sources),
      text: {
        format: {
          type: "json_schema",
          name: "source_grounded_delivery_brief",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            required: ["internalBriefing", "customerUpdate"],
            properties: {
              internalBriefing: {
                type: "array",
                minItems: 1,
                maxItems: 5,
                items: { $ref: "#/$defs/claim" },
              },
              customerUpdate: {
                type: "array",
                minItems: 1,
                maxItems: 4,
                items: { $ref: "#/$defs/claim" },
              },
            },
            $defs: {
              claim: {
                type: "object",
                additionalProperties: false,
                required: ["id", "text", "sourceIds"],
                properties: {
                  id: { type: "string" },
                  text: { type: "string" },
                  sourceIds: {
                    type: "array",
                    minItems: 1,
                    items: { type: "string", pattern: "^SRC-\\d{2}$" },
                  },
                },
              },
            },
          },
        },
      },
    }),
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) return null;
  const payload = (await response.json()) as { output_text?: string };
  if (!payload.output_text) return null;

  try {
    return {
      draft: modelDraftSchema.parse(JSON.parse(payload.output_text)),
      modelVersion,
    };
  } catch {
    return null;
  }
}
