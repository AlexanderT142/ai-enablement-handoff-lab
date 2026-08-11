# AI Enablement Handoff Lab

A public, independently built work sample showing the complete handoff of one narrow AI-assisted business workflow: synthetic delivery-exception notes become a source-grounded internal briefing and draft customer update, with visible withhold, redact and escalation states.

The demo uses entirely synthetic operational data. It is not associated with, commissioned by or connected to any logistics company.

**Live work sample:** [ai-enablement-handoff-lab.vercel.app](https://ai-enablement-handoff-lab.vercel.app)

## What to inspect

- Five-stage experience: Discover, Set the boundary, Try the workflow, Break it safely, Hand it back
- Strict Zod input and output contracts
- Deterministic missing-ETA, conflicting-status and sensitivity checks
- Claim-level source IDs and mandatory human approval
- Server-only optional model call with a fully functional seeded fallback
- Versioned prompt, model, guidance and evaluation receipt
- One-page printable/downloadable handoff and reusable operating kit

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. No environment variables are required. If `OPENAI_API_KEY` is already configured, the safe baseline may use the optional server-side provider path; every failure control stays deterministic.

## Verify

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Architecture and safety details live in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md), [`docs/THREAT_BOUNDARY.md`](docs/THREAT_BOUNDARY.md) and [`docs/HANDOFF_KIT.md`](docs/HANDOFF_KIT.md). Release evidence is recorded in [`TEST_RECEIPT.md`](TEST_RECEIPT.md) and [`APPLICATION_HANDOFF.md`](APPLICATION_HANDOFF.md).

## Scope boundary

This is one synthetic scenario, not a platform. It has no authentication, persistence, operational integration, automated sending or multi-agent system.

## Licence

MIT
