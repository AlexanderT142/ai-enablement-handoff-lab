# Threat boundary

## Assets protected

- Truthfulness of customer-facing timing and shipment status
- Customer contact and physical-access information
- Model credentials and server guidance
- The business owner's release authority
- Evidence showing why a draft was allowed, withheld, redacted or escalated

## Trust boundary

The browser is untrusted input. It may choose only a prepared scenario mode. The server owns scenario expansion, deterministic checks, optional provider access and final schema validation. No environment value is returned to the browser.

The output is still untrusted as a business decision. It is a draft with source anchors. Priya Nair, a clearly labelled synthetic business owner, must approve the exact customer wording outside the tool.

## Explicitly handled failures

| Failure | Deterministic signal | Safe state | Human route |
| --- | --- | --- | --- |
| Confirmed ETA removed | No note contains a confirmed delivery window | Withhold timing | Dispatch controller |
| Status conflict introduced | `departed` and `held` both present | Withhold and escalate | Operations specialist |
| Sensitive detail added | Name, NZ mobile number or gate-code pattern | Redact before response | Privacy lead; security if access data is real |
| Provider unavailable | No configured credential, timeout or invalid response | Seeded fallback | No escalation required |
| Output cites unknown source | Source-ID membership check fails | Request fails closed | Engineering review |

## Out of scope

- Real customer or shipment data
- Message sending or operational updates
- Identity, access control or audit persistence
- General-purpose prompting
- Multiple workflows or a multi-agent platform
- A production privacy, security or legal assessment

## Residual limitation

The sensitivity detector is intentionally narrow and demonstrative. It covers the prepared synthetic name, NZ mobile number and gate-code patterns. It is not a general PII classifier and must not be represented as one.
