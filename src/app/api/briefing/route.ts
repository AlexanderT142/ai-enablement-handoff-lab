import { briefingRequestSchema, briefingResultSchema } from "@/lib/contracts";
import { compileSeededScenario } from "@/lib/compiler";
import { tryProviderDraft } from "@/lib/model-provider";

export async function POST(request: Request) {
  try {
    const input = briefingRequestSchema.parse(await request.json());
    const providerDraft = await tryProviderDraft(input.mode).catch(() => null);
    const result = compileSeededScenario(
      input.mode,
      providerDraft?.draft,
      providerDraft ? { modelVersion: providerDraft.modelVersion } : undefined,
    );

    return Response.json(briefingResultSchema.parse(result), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return Response.json(
      {
        error: "The briefing request did not match the approved input contract.",
        detail: error instanceof Error ? error.message : "Unknown validation error",
      },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }
}
