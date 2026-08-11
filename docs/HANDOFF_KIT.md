# Workflow handoff kit

## Ownership

- Business owner: Priya Nair, Operations Enablement Lead
- Persona status: synthetic, created for this public work sample
- Release authority: the owner approves every customer-facing draft
- Specialist routes: Dispatch controller, Operations specialist, Privacy lead, Security specialist

## Reusable input template

| Field | Required entry |
| --- | --- |
| Source ID | Stable identifier such as `SRC-01` |
| Time | Time recorded by the source |
| Author or system | Exact person role or operating system |
| Exact note | Original operational wording, not a paraphrase |
| Status | Confirmed status, `missing` or `unknown` |
| Confirmed ETA | Exact window only when a source explicitly confirms it |

## Approved use

- Summarise only the supplied operational notes.
- Draft concise internal and customer copy.
- Carry source IDs on every factual sentence.
- Label missing or conflicting evidence.
- Suggest the named reviewer or specialist route.

## Prohibited use

- Invent, estimate or best-guess delivery timing.
- Resolve conflicting source systems through prose.
- Include customer names, phone numbers, addresses, credentials or access codes.
- Send or publish any customer message.
- Change operational status or replace specialist judgment.

## Reviewer checklist

1. Open every source link and confirm the sentence says no more than the note.
2. Confirm delivery timing is explicit in a source and is still current.
3. Check no mutually exclusive shipment status remains unresolved.
4. Check personal and access information is absent or visibly redacted.
5. Check tone is clear and does not convert a draft into a promise.
6. Approve the exact customer-facing text before sending it outside the tool.

## Escalation guide

- Dispatch controller: missing or unconfirmed delivery timing.
- Operations specialist: conflicting courier-app and depot-board status.
- Privacy lead: contact details or a proposed expansion in personal-data use.
- Security specialist: credentials, gate codes or physical-access information.
- Engineering: invalid schema, unknown source ID or repeated provider failure.

## Five-minute training resource

1. Minute 1 - enter exact notes using stable source IDs.
2. Minute 2 - run the workflow and open every source link.
3. Minute 3 - challenge the output with missing timing, conflict and sensitivity controls.
4. Minute 4 - correct or escalate anything unresolved; never improve a gap with prose.
5. Minute 5 - the business owner approves the exact draft, then sends it outside the tool.

## Version record

- Model fallback: `seeded-brief-compiler-v1.0.0`
- Prompt: `delivery-brief-v1.2.0`
- Guidance: `handoff-boundary-v1.0.0`
- Output schema: `briefing-output-v1`

## Reusable-pattern register

- ID: `RP-001`
- Name: Source-grounded exception briefing
- Reuse when: short operational notes need to become a reviewable internal briefing and draft outward communication
- Required controls: stable source IDs, deterministic missing/conflict/sensitivity states and human release

## Documentation gap

- ID: `GAP-001`
- Question: Who is final authority when the courier app and depot board disagree?
- Owner action: assign the reconciliation role before this pattern is reused in an operating team.
