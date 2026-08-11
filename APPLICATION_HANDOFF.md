# Application handoff

- Receipt date: 11 August 2026, Pacific/Auckland
- Scope: independently built public work sample using entirely synthetic operational data
- Runtime: deterministic seeded fallback; no provider credential was configured locally or in Vercel

## Canonical links and release identity

- Production: https://ai-enablement-handoff-lab.vercel.app
- Public repository: https://github.com/AlexanderT142/ai-enablement-handoff-lab
- Verified application release commit: `bcc26f11e828278070c8e57f60b311fae02b1a02`
- Verified production deployment: `dpl_Eij3j6j6CyKEk3vf3bnzQ2pUjscj`

The final evidence-only commit follows the application release. Its SHA is reported in the release handoff because a Git commit cannot truthfully contain its own hash.

## Commands and results

| Command | Result |
| --- | --- |
| `npm run lint` | PASS, exit 0 |
| `npm run typecheck` | PASS, exit 0 |
| `npm test` | PASS, 1 file and 6 tests |
| `npm run build` | PASS, Next.js 16.3; 10 static pages and 2 dynamic API routes |
| `git diff --check` | PASS |
| `vercel build --prod` | PASS |
| `vercel deploy --prebuilt --prod --yes` | PASS, production READY and stable alias assigned |

## Production browser checks

- Desktop, 1440 x 1000: hero, five-stage workflow and final handoff rendered without horizontal overflow.
- Safe baseline: `ready_for_review`; all five factual claims carried one or more clickable source IDs; selecting `SRC-02` focused the matching source note.
- Remove confirmed ETA: `withheld`; the customer ETA was withheld and the dispatch-controller escalation was visible.
- Introduce conflicting statuses: `escalated`; both `SRC-03` and `SRC-04` remained visible and operations-specialist reconciliation was required.
- Add sensitive information: `redacted`; the synthetic name, phone number and gate code were absent from the returned interface and replaced with redaction markers.
- Design inspection: architecture, trust boundary, receipt, source coverage and pinned model/prompt/guidance versions rendered.
- Mobile, 390 x 844: homepage, failure interaction and printable handoff rendered without horizontal overflow.
- Browser console: zero warning or error events after production navigation and reload.

## Production HTTP and runtime checks

- HTTP 200: `/`, `/handoff`, `/AI-Enablement-Handoff-One-Page.pdf`, `/api/health`, `/robots.txt`, `/sitemap.xml`, `/opengraph-image`.
- `POST /api/briefing`: HTTP 200 for baseline, missing ETA, conflicting status and sensitive-information modes.
- Exact states: `ready_for_review`, `withheld`, `escalated`, `redacted`; `approvalRequired` remained `true` in all four responses.
- Live engine: `seeded`; prompt `delivery-brief-v1.2.0`; guidance `handoff-boundary-v1.0.0`; model `seeded-brief-compiler-v1.0.0`.
- Headers include HSTS, `nosniff`, strict-origin referrer policy and disabled camera/microphone/geolocation permissions.
- Vercel deployment: READY in `syd1`; request log campaign showed 200/304 responses only; error-level query returned no logs.

## Screenshots

- [`public/screenshots/production-home.png`](public/screenshots/production-home.png) — production desktop recruiter view
- [`public/screenshots/production-conflict.png`](public/screenshots/production-conflict.png) — prepared conflicting-status escalation
- [`public/screenshots/production-mobile.png`](public/screenshots/production-mobile.png) — production mobile recruiter view
- [`public/screenshots/design-receipt.png`](public/screenshots/design-receipt.png) — architecture and evaluation receipt
- [`public/screenshots/ownership-handoff.png`](public/screenshots/ownership-handoff.png) — final ownership-transfer state

## Exact truthful CV claims

- Built and deployed a public Next.js and TypeScript AI enablement work sample that turns synthetic delivery-exception notes into source-grounded internal and customer drafts, with strict Zod contracts and mandatory human approval.
- Implemented deterministic missing-ETA, status-conflict and sensitivity controls that withhold, escalate or redact instead of inventing an answer, verified by six automated tests and desktop/mobile browser checks.
- Produced a reusable operating handoff covering an input template, approved and prohibited use, reviewer checklist, escalation guide, five-minute training, version record, reusable pattern and newly raised documentation gap.
- Published the work sample on GitHub and Vercel with a deterministic seeded fallback and an optional server-only model path.

## Claims that must not be made

- Do not imply this was built for, used by or commissioned by the target employer or any logistics company.
- Do not imply the synthetic persona, notes, shipment or operating outcomes are real.
- Do not describe the narrow deterministic detector as general privacy, safety or compliance assurance.
- Do not claim production integration, automated sending, authentication, persistence, multi-agent operation or organisational adoption.
- Do not claim that the live deployment uses a model provider; no provider credential is configured.
- Do not claim that a real SME, business owner, customer or delivery operation participated.

## Residual limitation

This is intentionally one bounded, synthetic scenario. The sensitivity checks recognise prepared patterns, the seeded fallback is not open-ended language generation, and no operational system can be read from or written to.
