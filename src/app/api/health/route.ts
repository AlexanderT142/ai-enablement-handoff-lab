import { GUIDANCE_VERSION, PROMPT_VERSION, SEEDED_MODEL_VERSION } from "@/lib/versions";

export async function GET() {
  return Response.json(
    {
      status: "ok",
      fallbackReady: true,
      versions: {
        model: SEEDED_MODEL_VERSION,
        prompt: PROMPT_VERSION,
        guidance: GUIDANCE_VERSION,
      },
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
