# Test receipt

- Receipt date: 11 August 2026, Pacific/Auckland
- Scope: one synthetic delivery-exception workflow
- Runtime mode: `seeded-brief-compiler-v1.0.0` because no configured model credential was available
- Input contract: `briefing-input-v1`
- Output contract: `briefing-output-v1`

## Static and automated gates

| Gate | Result |
| --- | --- |
| `npm run lint` | PASS, exit 0 |
| `npm run typecheck` | PASS, exit 0 |
| `npm test` | PASS, 1 file and 6 tests |
| `npm run build` | PASS, Next.js 16.3 production build; 10 static pages generated and 2 dynamic API routes compiled |
| `git diff --check` | PASS |
| dependency audit | PASS, 0 vulnerabilities reported by install audit |

## Automated failure campaign

| Control | Expected state | Observed state | Risk set |
| --- | --- | --- | --- |
| Safe baseline | Draft held for human review | `ready_for_review` | none |
| Remove confirmed ETA | Withhold timing | `withheld` | `missing_basis` only |
| Introduce conflicting status | Escalate unresolved status | `escalated` | `status_conflict` only |
| Add sensitive information | Redact before response | `redacted` | `sensitive_data` only |

The suite also verifies strict request rejection, source-ID membership, mandatory approval, output-schema validation and pinned model/prompt/guidance versions.

## Failure-revealing evidence

The first test run found that capitalised `Customer` text escaped the synthetic-name detector while phone and gate-code values were redacted. The detector and regression test were corrected.

The first browser campaign then found an over-broad name rule that misclassified `customer delivery window` as a person's name. The input marker was narrowed to `Customer name:` and cross-control assertions now prevent sensitivity risk from leaking into missing-ETA or conflict states.

No false green from either defect was accepted as completion.

## Local browser campaign

- Desktop viewport: 1440 x 1000; homepage content present; no framework overlay; no horizontal overflow.
- Mobile viewport: 390 x 844; homepage and failure controls responsive; no horizontal overflow.
- Safe baseline: rendered five factual claims with six clickable source references; clicking `SRC-02` focused the exact source note.
- Missing ETA: showed `ETA withheld` and dispatch-controller escalation.
- Conflict: showed `Status conflict escalated` and operations-specialist escalation.
- Sensitive information: removed the synthetic name, phone number and gate code from the returned sources and drafts.
- Design drawer: architecture, trust boundary and versioned evaluation receipt opened and rendered.
- Final state: `2 risks detected · 1 reusable pattern registered · 1 documentation gap raised · ownership transferred` rendered.
- Printable handoff page: owner, five-minute training and documentation gap present on mobile with no overflow.
- Browser console: zero warning or error entries.

## Local HTTP campaign

- `/` -> 200
- `/handoff` -> 200
- `/AI-Enablement-Handoff-One-Page.pdf` -> 200
- `/api/health` -> 200 with fallback and version record
- `POST /api/briefing` -> 200 for baseline and all three failure modes

## PDF receipt

- File: `output/pdf/AI-Enablement-Handoff-One-Page.pdf`
- Pages: 1
- Geometry: A4 landscape, 841.89 x 595.276 points
- Text: extractable; all operating-kit sections present
- Visual inspection: PASS at 150 DPI; no clipped text, overlaps, broken glyphs or unreadable sections

## Production receipt

Production deployment `dpl_Eij3j6j6CyKEk3vf3bnzQ2pUjscj` reached READY and was assigned the stable alias `https://ai-enablement-handoff-lab.vercel.app`.

- All seven public routes in the HTTP campaign returned 200.
- All four API modes returned 200, the expected distinct state and mandatory human approval.
- The production desktop and mobile browser campaign repeated the baseline and all three failure checks without overflow or console errors.
- Production request logs contained only 200/304 responses; an error-level query returned no logs.
- Full production evidence, release identity and screenshots are recorded in `APPLICATION_HANDOFF.md`.
