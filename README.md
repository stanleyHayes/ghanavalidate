# GhanaValidate

Deterministic, dependency-light Ghana-specific **syntax** validation and normalisation primitives — phone numbers, GhanaPostGPS address text, human-entered text, and versioned reference lookups — with stable reason codes, versioned rules, and an explicit refusal to pretend that a valid shape is a verified fact.

![Licence Apache-2.0](https://img.shields.io/badge/licence-Apache--2.0-blue.svg)
![Quality workflow](https://img.shields.io/github/actions/workflow/status/stanleyHayes/ghanavalidate/quality.yml?branch=main&label=quality)
![Live at validate.digitalghana.dev](https://img.shields.io/badge/live-validate.digitalghana.dev-brightgreen)
![TypeScript 5.9 on Node 20+](https://img.shields.io/badge/runtime-TypeScript%205.9%20%7C%20Node%20%E2%89%A5%2020-black)

---

## Try it

**Public workbench — [validate.digitalghana.dev](https://validate.digitalghana.dev)** (live, verified 2026-09-12). The workbench runs the same package in your browser. No input leaves the page: there is no server-side validation endpoint, no database, no telemetry.

There is **no `api-validate` hostname, and none is planned for beta.** GhanaValidate is package-first by design ([ADR-0001](docs/adr/0001-product-boundary.md)); a network API is a separately gated later surface, not a missing piece. Nothing here is hosted on Render, so no cold-start delay applies.

Run the real thing locally in four commands — this is copy-pasteable and the output below is the actual output, not an illustration:

```sh
git clone https://github.com/stanleyHayes/ghanavalidate.git
cd ghanavalidate
pnpm install && pnpm build
node --input-type=module -e "import { normalizeGhanaPhone } from './dist/index.js'; console.log(JSON.stringify(normalizeGhanaPhone('024 123 4567'), null, 2));"
```

```json
{
  "valid": true,
  "normalizedValue": {
    "e164": "+233241234567",
    "local": "0241234567",
    "national": "241234567"
  },
  "reasonCode": "VALID",
  "warnings": [
    "SYNTAX_ONLY_NOT_REACHABILITY_OR_OWNERSHIP_VERIFICATION"
  ],
  "rule": {
    "id": "ghana-phone",
    "version": "1.0.0"
  }
}
```

That warning is not decoration. It is the product.

> **`valid: true` means one thing only: the input satisfies the named local rule at the named version.** It is never evidence of identity, ownership, reachability, number allocation, address existence, authenticity, legal status, or that any person or place is real. GhanaValidate validates syntax and returns reference *candidates*. It verifies nothing. See [`contracts/validation-result.md`](contracts/validation-result.md).

---

## The problem this solves

### For developers

If you have shipped a form, an import job or a CRM integration in Ghana, you have already written some of this:

- **The `+233` / `0` regex, again.** Users type `024 123 4567`, `+233 24 123 4567`, `233241234567` and `241234567`, and every one of them is the same subscriber. Each project reinvents the strip-and-prefix logic with slightly different edge cases, and two services that both "validate phone numbers" end up disagreeing about whether the same record is a duplicate. Joins fail quietly, SMS goes to a malformed MSISDN, and nobody finds out until a delivery report comes back.
- **A GhanaPostGPS parser pulled out of a help page.** The digital address format (`GA-543-0125`) is documented in prose on a help site, not in a spec you can pin. So a regex gets written from an example, stored uppercase in one system and hyphenated in another, and someone eventually treats a passing regex as proof the address exists.
- **Silent over-claiming.** The worst defects here are not crashes. A field marked "verified" because a regex matched is a *trust* bug: it tells a support agent, an auditor or a customer that something was checked when nothing was. That is expensive to unwind and nearly impossible to catch in tests, because the code is behaving exactly as written.
- **Free-text names that never match.** `"  Ama   Mensah  "`, `"Ama Mensah"` and a field carrying a non-normalised Unicode composition are three strings and one person. Without NFKC normalisation and whitespace collapsing, deduplication and search both degrade.
- **Reference lookups that invent an answer.** "Ga" matches Ga East *and* Ga West. Fuzzy matchers routinely take the first hit, attach no dataset version, and produce a record that cannot be reproduced or audited six months later.

What GhanaValidate gives you instead:

| You get | Concretely |
|---|---|
| One normalisation, four forms in, one form out | `normalizeGhanaPhone` accepts local, international, bare-national and punctuated input and returns `e164`, `local` and `national` together |
| Machine-readable failure | A stable `reasonCode` such as `PHONE_INVALID_LENGTH` or `REFERENCE_AMBIGUOUS` — never a bare `false`, never a thrown exception |
| A version on every answer | Every result carries `rule: { id, version }`, so a decision made last quarter can be explained this quarter |
| Determinism | Same input, same options, same pinned dataset ⇒ same result. No network, no clock, no locale surprise, no state |
| Ambiguity preserved | `resolveReference` returns *all* candidates plus the dataset type and version rather than guessing |
| An honesty boundary in the type system | Warnings such as `SYNTAX_ONLY_NOT_ADDRESS_EXISTENCE_OR_OWNERSHIP_VERIFICATION` travel with the value |

No runtime dependencies in `src/` — the four primitives import nothing (the root manifest carries the workbench's `next`/`react` build dependencies, which are not used by the package code). ESM-only, `sideEffects: false`, strict TypeScript with `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`.

### For the community and the public interest

Input validation is where software quietly decides whether a person exists in a system. A validator that overstates what it checked pushes the cost of that error onto the person being validated — the applicant whose number "failed", the resident whose address "could not be confirmed".

Open, source-linked, independent primitives matter because **provenance is written down** (the two external facts this package relies on — the `+233` country code with a nine-digit national significant number, and the documented GhanaPostGPS textual shape — are recorded with authority, URL, licence position and review date in [`docs/governance/source-register.json`](docs/governance/source-register.json), and no source dataset is redistributed); because **results are reproducible and citable** (rule identifiers and semantic versions let a result be explained later rather than re-derived from whatever the code happens to do today); because **there is no lock-in** (Apache-2.0, no service dependency, no account, no API key — it runs offline, in a browser or in a build step, and it is forkable if this project stops); and because **the safety boundary is auditable** (the non-verification language is enforced in the contract and the tests, not left to a disclaimer nobody reads — see [`tests/validation.test.ts`](tests/validation.test.ts)).

### What this is not

Drawn from the stated non-goals in [`docs/product-definition.md`](docs/product-definition.md), [`docs/adr/0001-product-boundary.md`](docs/adr/0001-product-boundary.md) and [`agent_plan.md`](agent_plan.md):

- **Not a verification service.** It never claims a person owns, controls or can be reached at a number; that a GhanaPostGPS address exists, resolves, is current or belongs to anyone; that a name is a legal identity; or that a Ghana Card, TIN, account, licence or credential is authentic.
- **Not a government service.** Not operated by, endorsed by or affiliated with the Government of Ghana, the NCA, GhanaPost or any agency.
- **Not a telephone-numbering database.** Prefix and operator allocation are deliberately excluded, because assignments change and this package will not ship a stale copy of them.
- **Not a geocoder.** It parses the GhanaPostGPS *text shape*. It does not resolve, look up or geolocate an address.
- **Not a reference dataset.** Region, MMDA, institution and code data are never bundled. `resolveReference` works only against a versioned dataset you supply, or a pinned public contract from another Digital Ghana product.
- **Not a network service.** No API host, no stored input, no telemetry, no analytics on what you validate.
- **Not published on npm yet.** Package publication is an open gate — see [`ROADMAP.md`](ROADMAP.md). Use it from a clone or a workspace until then.

---

## Quickstart

Prerequisites: **Node.js ≥ 20** (`engines` in [`package.json`](package.json)), **pnpm 10.17.1** (pinned via `packageManager`), and **Ruby 3.4** for the governance validator (the version CI pins in [`.github/workflows/quality.yml`](.github/workflows/quality.yml)).

```sh
git clone https://github.com/stanleyHayes/ghanavalidate.git
cd ghanavalidate
pnpm install
pnpm build          # package only — tsc → dist/; required before the workbench can resolve it
pnpm dev            # the workbench at http://localhost:3000
pnpm test           # tsx --test tests/*.test.ts
```

---

## Usage

Four primitives, exported from [`src/index.ts`](src/index.ts). Every one returns the same discriminated `ValidationResult<T>` defined in [`contracts/validation-result.md`](contracts/validation-result.md).

```ts
import { normalizeGhanaPhone, normalizeGhanaPostAddress, normalizeGhanaText, resolveReference } from "@digitalghana/validate";
```

| Function | Input | `normalizedValue` on success | Rule id |
|---|---|---|---|
| `normalizeGhanaPhone` | any spacing/punctuation, `+233`, `233`, `0` or bare national | `{ e164, local, national }` | `ghana-phone` |
| `normalizeGhanaPostAddress` | GhanaPostGPS text, any case, spaced or hyphenated | `{ formatted, compact, districtCode, areaCode, uniqueAddress }` | `ghana-post-digital-address-syntax` |
| `normalizeGhanaText` | free text | NFKC-normalised, trimmed, whitespace-collapsed `string` | `ghana-text` |
| `resolveReference` | search term + versioned dataset | `{ dataset: { type, version }, candidates }` | `versioned-reference` |

All rules are at version `1.0.0`.

A digital address is parsed, not resolved — `normalizeGhanaPostAddress("ga 543 0125")`:

```json
{
  "valid": true,
  "normalizedValue": { "formatted": "GA-543-0125", "compact": "GA5430125", "districtCode": "GA", "areaCode": "543", "uniqueAddress": "0125" },
  "reasonCode": "VALID",
  "warnings": ["SYNTAX_ONLY_NOT_ADDRESS_EXISTENCE_OR_OWNERSHIP_VERIFICATION"],
  "rule": { "id": "ghana-post-digital-address-syntax", "version": "1.0.0" }
}
```

Ambiguity is returned, never resolved by guessing. Given a dataset of `ga-east` and `ga-west`, `resolveReference("Ga", dataset)` returns:

```json
{
  "valid": false,
  "normalizedValue": {
    "dataset": { "type": "mmda", "version": "synthetic-test-v1" },
    "candidates": [{ "id": "ga-east", "name": "Ga East Municipal" }, { "id": "ga-west", "name": "Ga West Municipal" }]
  },
  "reasonCode": "REFERENCE_AMBIGUOUS",
  "warnings": [],
  "rule": { "id": "versioned-reference", "version": "1.0.0" }
}
```

A dataset without a non-empty `type` and `version` is rejected outright with `REFERENCE_DATASET_UNVERSIONED`: an unversioned match is not an auditable answer.

### Reason codes

| Code | Meaning |
|---|---|
| `VALID` | Input satisfies the named rule at the named version — and nothing more |
| `PHONE_EMPTY` / `PHONE_INVALID_CHARACTERS` | Nothing to parse / non-digit content after punctuation is stripped |
| `PHONE_INVALID_LENGTH` / `PHONE_INVALID_NATIONAL_NUMBER` | National significant number is not exactly nine digits / starts with `0` |
| `POSTAL_EMPTY` / `POSTAL_INVALID_FORMAT` | Nothing to parse / text does not match the documented GhanaPostGPS shape |
| `TEXT_EMPTY` / `REFERENCE_EMPTY` | Input or search term normalises to an empty string |
| `REFERENCE_DATASET_UNVERSIONED` | Caller-supplied dataset lacks a `type` or `version` |
| `REFERENCE_NOT_FOUND` / `REFERENCE_AMBIGUOUS` | No candidate matched, and none is invented / several matched, and all are returned |

---

## Data and provenance

GhanaValidate bundles **no dataset**. It relies on two narrow external format facts, both recorded in [`docs/governance/source-register.json`](docs/governance/source-register.json) against [its schema](docs/governance/source-register.schema.json), each marked `reference-only` and reviewed on **2026-09-01**:

| Source | Authority | What it supports | Licence position |
|---|---|---|---|
| [National numbering plan](https://nca.org.gh/wp-content/uploads/2021/11/NUMBERING-PLAN-FOR-GHANA.pdf) | National Communications Authority, Ghana | Country code `+233` and the nine-digit national significant-number invariant | Copyright not expressly stated; facts referenced, source not redistributed |
| [GhanaPostGPS help](https://nas.ghanapostgps.com/get-help/) | GhanaPostGPS | Syntax-only parsing of the documented address shape | Terms apply; format facts referenced, service data not copied |

- **Licence boundary.** [`LICENSE`](LICENSE) and [`NOTICE`](NOTICE) are Apache-2.0. The `license` field in [`package.json`](package.json) and the workbench JSON-LD still say MIT; reconciling them is an open gate (see [`ROADMAP.md`](ROADMAP.md)). That licence does not relicense the referenced source documents, and no third-party dataset is redistributed by inclusion. See [`NOTICE`](NOTICE).
- **Versioning.** Every rule carries a stable id and a semantic version. A breaking rule change requires a new major rule version; source changes are recorded in the register and in release evidence. The package release is `0.1.0-beta.1`.
- **Corrections.** Open an issue or pull request with the rule id, the current behaviour, the proposed behaviour, the authoritative source with a stable URL, and its publication date. A human reviewer approves any change to a published rule. Full workflow in [`CONTRIBUTING.md`](CONTRIBUTING.md).

---

## Project layout

```text
ghanavalidate/
├── src/                 # the package — four primitives, zero runtime dependencies
├── tests/               # deterministic acceptance fixtures (node:test via tsx)
├── contracts/           # versioned public result contract
├── apps/web/            # Next.js 16 workbench deployed to validate.digitalghana.dev
├── docs/
│   ├── adr/             # 0001 — product boundary and package-first decision
│   ├── governance/      # source register + JSON Schema
│   ├── runbooks/        # operations baseline and dated release evidence
│   └── product-definition.md
├── scripts/validate.rb  # dependency-free governance validator
├── infra/               # deployment configuration
└── .github/workflows/   # quality.yml — the single CI workflow
```

---

## Verification

```sh
pnpm validate     # ruby scripts/validate.rb — required files, source register, template/secret scan
pnpm typecheck    # tsc --noEmit
pnpm test         # tsx --test tests/*.test.ts
pnpm build        # tsc → dist/
pnpm build:web    # next build for apps/web
pnpm check        # all five, in that order
```

[`.github/workflows/quality.yml`](.github/workflows/quality.yml) runs `pnpm check` on every pull request and every push to `main`, on Node 22, pnpm 10.17.1 and Ruby 3.4. [`scripts/validate.rb`](scripts/validate.rb) has no third-party dependencies: it asserts that every required governance, contract and application file exists, that the source register is non-empty and contains no `blocked` or `unknown` publication decision, that no template token survives, and that no private key is committed.

The five tests in [`tests/validation.test.ts`](tests/validation.test.ts) prove local/international phone parity, malformed-input reason codes, GhanaPostGPS syntax-only behaviour, conservative text normalisation, and honest ambiguity handling — including that the non-verification warnings are actually present on the results.

Immutable deployment, smoke and rollback evidence is in [`docs/runbooks/release-evidence.md`](docs/runbooks/release-evidence.md); the operational baseline is in [`docs/runbooks/operations.md`](docs/runbooks/operations.md).

---

## Status and roadmap

**Public beta.** The package and the workbench are shipped and reachable; npm publication, framework hooks, a batch surface and any network API remain gated later phases.

[`ROADMAP.md`](ROADMAP.md) sets out what has shipped, the open gates and their blocking dependencies, and what is explicitly out of scope. It is directional, not a commitment. The machine-readable state of record is [`agent_plan.md`](agent_plan.md).

---

## Contributing and policy

- [`CONTRIBUTING.md`](CONTRIBUTING.md) — setup, verification, commit and PR conventions, rule and source corrections, good first contributions.
- [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) — Contributor Covenant v2.1; reports go to the private channel documented there.
- [`SECURITY.md`](SECURITY.md) — vulnerability reporting. Do not open a public issue containing exploit details.
- [`AGENTS.md`](AGENTS.md) — coordination rules for automated and human contributors.
- [`LICENSE`](LICENSE) and [`NOTICE`](NOTICE) — Apache License 2.0, inbound = outbound.

Part of the [Digital Ghana](https://digitalghana.dev) portfolio of independent, source-linked public-interest infrastructure.

---

## Independence

GhanaValidate is an independent open-source project. It is **not operated by, endorsed by, or affiliated with the Government of Ghana**, the National Communications Authority, GhanaPost, or any ministry, agency or public institution. Official sources are cited, never redistributed or represented as this project's own. No result produced by this software is an official record, and nothing it returns should be treated as evidence of official status, identity or entitlement.
