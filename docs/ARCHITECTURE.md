# Architecture

## Product boundary

The lab demonstrates one three-minute workflow. The browser selects an approved synthetic evidence mode and renders results. It cannot submit arbitrary prompts, access a model credential, change shipment state or send a message.

## Request path

1. The client sends `{ mode }` to `POST /api/briefing`.
2. A strict Zod input contract accepts only the four prepared modes for the one scenario.
3. Server code expands the synthetic notes and runs deterministic checks for missing confirmed timing, mutually exclusive statuses and sensitive patterns.
4. For the safe baseline only, a provider may be called when `OPENAI_API_KEY` is already configured. The key, system guidance and provider request stay in a module guarded by `server-only`.
5. Without a provider, or if the provider fails or returns an invalid contract, the seeded compiler returns the reviewable result.
6. The final result is parsed against a strict Zod output contract. Every claim must carry at least one source ID, and each cited ID must exist in the scenario.
7. The browser parses the response again before rendering it.

## Control order

Deterministic safety decisions precede prose:

- no confirmed ETA -> timing is withheld and dispatch escalation is required;
- departed plus held -> the status is unresolved and operations escalation is required;
- name, phone or access code -> sensitive values are redacted and privacy review is required.

The optional model is never asked to decide these states.

## Runtime design

- Next.js App Router and TypeScript
- React client island for the five-stage lab
- Node.js route handlers for the briefing and health routes
- Zod contracts shared across the route, compiler and client response boundary
- Vitest failure tests for every prepared control
- No database, authentication, analytics, persistence or operational integration

## Versions

- Model fallback: `seeded-brief-compiler-v1.0.0`
- Prompt: `delivery-brief-v1.2.0`
- Guidance: `handoff-boundary-v1.0.0`
- Input schema: `briefing-input-v1`
- Output schema: `briefing-output-v1`
