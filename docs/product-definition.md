# GhanaValidate product definition

## Problem and users

Ghanaian forms, imports and backend services repeatedly clean the same inputs in inconsistent ways. GhanaValidate gives application developers, data teams and civic-technology maintainers small deterministic primitives with stable reason codes and rule versions.

The product reduces avoidable formatting errors. It is not a trust, identity or entitlement service.

## First release

- Normalize Ghana telephone inputs between local `0XXXXXXXXX` and E.164 `+233XXXXXXXXX` forms when the national significant number contains exactly nine digits.
- Normalize and check the documented GhanaPostGPS textual shape without resolving an address.
- Normalize human-entered names and search text without attempting legal-name matching.
- Resolve region, MMDA, institution and code inputs only through versioned caller-supplied reference adapters.
- Return a discriminated validation result containing `valid`, normalized value, stable reason code, warnings and rule version.

## Non-goals and safety language

GhanaValidate never claims that:

- a person owns, controls or can receive calls at a number;
- a GhanaPostGPS address exists, resolves, is current, or belongs to anyone;
- a name is a legal identity or two people are the same person;
- a Ghana Card, TIN, account, licence or credential is authentic;
- a candidate returned by a reference adapter is authoritative without the named dataset and version.

Product copy must use “syntax valid”, “normalized” or “reference candidate”; it must not use “verified”, “authentic”, “official owner” or equivalent trust language for these results.

## Determinism and versioning

Every rule has a stable identifier and semantic version. The same input, options and pinned reference dataset must produce the same result. Breaking rule changes require a new major rule version; source or reference changes are recorded in the source register and release notes.

## Privacy and misuse

The package is local and stateless. It emits no telemetry and stores no inputs. Examples use synthetic values. Future network APIs must add payload limits, log redaction, rate limits, request identifiers and a retention decision before launch.

## Definition-gate acceptance

- Official references support the limited phone and address-format invariants.
- Unknown or ambiguous reference inputs return candidates rather than an invented match.
- Every result exposes a rule version and machine-readable reason code.
- Tests prove the non-verification language and international/local normalization parity.
- No restricted or bulk source dataset is bundled.
