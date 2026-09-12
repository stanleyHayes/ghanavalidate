# GhanaValidate roadmap

This roadmap is **directional, not a commitment**. It contains no delivery dates and no promises; the only dates it records are evidence dates for work already done. It is a readable summary of the execution ledger; the machine-readable state of record is [`agent_plan.md`](agent_plan.md), and that file wins wherever this page disagrees with it.

Lifecycle words are used exactly: *proposed*, *building*, *beta*, *stable*, *externally blocked*, *retired*, *deferred*. Nothing is marked done here without linked evidence in the ledger or in [`docs/runbooks/release-evidence.md`](docs/runbooks/release-evidence.md).

Current lifecycle: **public beta**.

---

## Now — shipped in the current beta

Product definition gate, all five items closed in [`agent_plan.md`](agent_plan.md):

- [x] Problem, users and non-goals approved and written down in [`docs/product-definition.md`](docs/product-definition.md).
- [x] Source authority and licence review complete for the reference-only NCA numbering and GhanaPostGPS format facts. No source dataset is redistributed. Three records in [`docs/governance/source-register.json`](docs/governance/source-register.json), reviewed 2026-09-01.
- [x] Domain model and deterministic acceptance fixtures approved and implemented in [`contracts/validation-result.md`](contracts/validation-result.md) and [`tests/validation.test.ts`](tests/validation.test.ts).
- [x] Security, privacy and misuse risks reviewed. The package is local and stateless: no telemetry, no stored input, synthetic examples only. The non-verification boundary is enforced in the returned warnings and in the public copy.
- [x] Package-first scope and the independent web deployment boundary approved in [`docs/adr/0001-product-boundary.md`](docs/adr/0001-product-boundary.md). A network API is a later, separately gated surface.

Implementation and release, tasks P-0.1 through P-2.1 recorded as Done:

- [x] **Four primitives** in [`src/index.ts`](src/index.ts) with zero runtime dependencies: `normalizeGhanaPhone`, `normalizeGhanaPostAddress`, `normalizeGhanaText`, `resolveReference`.
- [x] **Versioned discriminated result contract** — `valid`, `normalizedValue`, stable `reasonCode`, `warnings` and `rule: { id, version }` on every answer. All four rules at `1.0.0`.
- [x] **Phone normalisation parity** across local `0XXXXXXXXX`, `+233`, bare `233` and bare national forms, with the nine-digit national significant-number invariant.
- [x] **GhanaPostGPS syntax parsing** of the documented textual shape, returning district, area and unique-address components without resolving anything.
- [x] **Honest reference resolution** — unknown inputs return `REFERENCE_NOT_FOUND`, ambiguous inputs return every candidate with the dataset type and version, and an unversioned dataset is rejected outright.
- [x] **Deterministic acceptance tests** — five test cases, including assertions that the non-verification warnings are actually present on the results.
- [x] **Dependency-free governance validator** ([`scripts/validate.rb`](scripts/validate.rb)) covering required files, source-register publication decisions, unresolved template tokens and committed private keys.
- [x] **CI on every pull request and push to `main`** ([`.github/workflows/quality.yml`](.github/workflows/quality.yml)), running the full `pnpm check` chain.
- [x] **Public workbench live** at `validate.digitalghana.dev`, running the package in the browser with no input leaving the page, and displaying the rule version and the syntax-only warning alongside every result.
- [x] **Production release evidence** — canonical TLS, robots, sitemap, favicon, manifest and Open Graph smoke; a production browser QA pass; and a completed rollback-and-restore drill, all recorded in [`docs/runbooks/release-evidence.md`](docs/runbooks/release-evidence.md).

No part of this product has reached **stable**.

---

## Next — the open gates

These are the real blockers recorded in the repository. Several are decisions rather than code.

| Gate | What it unblocks | Blocking dependency |
|---|---|---|
| Package publication scope | `npm install @digitalghana/validate` instead of cloning the repository | Publication was deliberately deferred at the beta release; needs an owner decision on the package owner and scope before anything is pushed to a registry |
| Framework hooks and adapters | Drop-in React/form integration | Deferred as later scope in the ledger, and gated by [`contracts/README.md`](contracts/README.md): interface surfaces are chosen from demonstrated consumers, not added to satisfy a template. Also depends on the publication gate above |
| Batch validation surface | Cleaning an import file in one call | Same demonstrated-consumer rule; no consumer has been recorded yet |
| Administrative rule tooling | Steward-managed rule versions and changelog | Listed as a gated later phase; no admin surface is specified, and any stateful surface first needs the operational baseline below |
| Network API (`api-validate`) | HTTP access for non-JavaScript callers | [ADR-0001](docs/adr/0001-product-boundary.md) requires an explicit ADR and a portfolio registry entry before any additional hostname exists; [`docs/runbooks/operations.md`](docs/runbooks/operations.md) additionally requires health/readiness checks, structured logs with redaction, latency/error/saturation signals, alert routes with an acknowledged owner, least-privilege credentials, rate limits and audit trails, and a tested rollback path. [`docs/product-definition.md`](docs/product-definition.md) adds payload limits, request identifiers and a retention decision |
| Operator and prefix allocation | Operator-aware phone checks | Excluded on purpose: allocations change, and a stale bundled copy would be worse than nothing. Needs a maintained, licensed, dated source recorded in the source register |
| Pinned cross-product reference adapters | Region, MMDA, institution and code resolution without the caller supplying a dataset | Depends on another Digital Ghana product publishing a versioned public contract or a pinned dataset artifact. Copying GhanaGeo, GhanaCodes, GhanaGov, GhanaPostGPS, NCA or identity-provider data into this repository is forbidden by ADR-0001 |
| Licence metadata reconciliation | An unambiguous machine-readable licence for consumers | [`LICENSE`](LICENSE) and [`NOTICE`](NOTICE) are Apache-2.0; the `license` field in [`package.json`](package.json) and the JSON-LD block on the workbench still say MIT. Needs an owner decision recorded, then a single reconciling change |
| Runtime-dependency metadata reconciliation | A published manifest that carries no runtime dependencies | The root [`package.json`](package.json) is the manifest for `@digitalghana/validate`, and it lists `next`, `react` and `react-dom` under `dependencies` even though nothing in [`src/`](src/index.ts) imports them; `apps/web` declares its own copies in [`apps/web/package.json`](apps/web/package.json). Moving them to `devDependencies` needs the root-level Vercel build in [`vercel.json`](vercel.json) confirmed green first, and must land before the publication gate above |

---

## Later — deferred by design

- **Additional primitives.** New rules are added from a demonstrated need with a named authoritative source, not from a list of things that could plausibly be validated.
- **Shared portfolio packages.** Per the consequences section of [ADR-0001](docs/adr/0001-product-boundary.md), small primitives and configuration may be repeated across products until two proven consumers justify a versioned shared package. Duplication is the cheaper mistake.
- **Richer text handling.** Anything beyond conservative NFKC normalisation, trimming and whitespace collapsing — transliteration, name parsing, script-aware folding — stays out until there is a consumer and a defensible rule.
- **Rule changelog and migration tooling.** Rule versions are stable today because there is only one of each. A published changelog and migration notes become necessary at the first major rule bump, not before.

---

## Explicitly out of scope

These are stated non-goals from [`docs/product-definition.md`](docs/product-definition.md) and [ADR-0001](docs/adr/0001-product-boundary.md), not a backlog:

- Claiming that a person owns, controls or can receive calls at a telephone number.
- Claiming that a GhanaPostGPS address exists, resolves, is current, or belongs to anyone. GhanaValidate parses text; it does not geocode.
- Claiming that a name is a legal identity, or that two names are the same person.
- Claiming that a Ghana Card, TIN, bank account, licence or credential is authentic.
- Presenting a reference candidate as authoritative without the named dataset and version.
- Any use of "verified", "authentic", "official owner" or equivalent trust language for a syntax result.
- Bundling or redistributing a restricted, unknown-licence or bulk source dataset to increase coverage.
- Copying another Digital Ghana product's database, source tree or credentials across the repository boundary.
- Any claim of government operation, endorsement, affiliation or official status, in code, copy, metadata or structured data.
- Collecting, storing or transmitting the inputs people validate. The package is local, stateless and telemetry-free, and any future network surface must answer the privacy questions above before it launches.

---

Changes to this page follow changes to the ledger, never the other way round. If you want to move something out of **Next**, close the gate first and bring the evidence.
