# Contributing to GhanaValidate

GhanaValidate welcomes contributions to the validation primitives, the result contract, the public workbench, the documentation and the source provenance record.

This repository owns one product. It is deliberately small and deliberately boring: deterministic syntax primitives with versioned rules and an explicit refusal to overstate what they checked. The most valuable contribution here is usually a correction, a missing test, or a place where the copy claims more than the code does.

## Before you start

1. **Read the boundary.** [`docs/product-definition.md`](docs/product-definition.md) and [`docs/adr/0001-product-boundary.md`](docs/adr/0001-product-boundary.md) define what this product does and, more importantly, what it must never claim. A change that makes a result sound more certain than it is will be rejected, however well written.
2. **Read the ledger.** [`agent_plan.md`](agent_plan.md) is the execution ledger and the machine-readable state of record; [`ROADMAP.md`](ROADMAP.md) is the readable summary. Check whether the work is already claimed or blocked on an open gate.
3. **Confirm a clean checkout passes verification before you change anything.** If it does not, that is itself a bug worth reporting.
4. **Open an issue first for anything non-trivial** — a new rule, a rule-behaviour change, a new export, a new ADR, or a source correction. Evidence is easier to agree on before code exists.
5. **Keep the change small.** One concern per pull request.

## Prerequisites

| Tool | Version | Where it is pinned |
|---|---|---|
| Node.js | ≥ 20 | `engines.node` in [`package.json`](package.json); CI runs Node 22 |
| pnpm | 10.17.1 | `packageManager` in [`package.json`](package.json) |
| Ruby | 3.4 | `ruby/setup-ruby` in [`.github/workflows/quality.yml`](.github/workflows/quality.yml) |
| TypeScript | 5.9.2 | `devDependencies` in [`package.json`](package.json) |
| Git | any recent version | — |

## Local setup

```sh
git clone https://github.com/stanleyHayes/ghanavalidate.git
cd ghanavalidate
pnpm install
pnpm check          # confirm a clean tree is green before editing
pnpm dev            # workbench on http://localhost:3000
```

The workspace is defined in [`pnpm-workspace.yaml`](pnpm-workspace.yaml): the package lives at the repository root and `apps/web` consumes it as `@digitalghana/validate` via `workspace:*`. Run `pnpm build` after changing `src/` if you are exercising the package outside the web app, which transpiles it directly.

## Verification

Run all of these before opening a pull request, and paste what you ran into the description:

```sh
pnpm validate     # ruby scripts/validate.rb
pnpm typecheck    # tsc -p tsconfig.json --noEmit
pnpm test         # tsx --test tests/*.test.ts
pnpm build        # tsc -p tsconfig.json
pnpm build:web    # pnpm --dir apps/web build
```

`pnpm check` runs all five in that order and is exactly what CI runs. [`.github/workflows/quality.yml`](.github/workflows/quality.yml) executes it on every pull request and every push to `main`.

[`scripts/validate.rb`](scripts/validate.rb) is dependency-free. It asserts that every required governance, contract and application file is present, that [`docs/governance/source-register.json`](docs/governance/source-register.json) is non-empty and contains no `blocked` or `unknown` publication decision, that no unresolved template token survives, and that no private key has been committed. **If you add a file that the product depends on, add it to the `required` list in that script**; if you remove one, remove it there too.

> Note: the validator reads Markdown with the default external encoding. On a machine whose default locale is not UTF-8 (an older system Ruby on macOS, for example) it aborts with `invalid byte sequence in US-ASCII`, because the governance documents contain non-ASCII characters. Run it under Ruby 3.4, or prefix the command with `RUBYOPT="-E UTF-8"`. CI is unaffected.

TypeScript is strict, with `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` and `verbatimModuleSyntax`. Do not loosen them to make a change compile.

## Change expectations

- **Never widen a claim.** Public copy, warnings, JSDoc, README text and UI strings use "syntax valid", "normalized" or "reference candidate". They must not use "verified", "authentic", "confirmed", "official owner" or any equivalent trust language for these results.
- **Every result keeps its rule id and version.** A result without `rule: { id, version }` is not shippable.
- **Reason codes are a public interface.** Adding one is a feature; renaming or removing one is a breaking change. Document it and version the rule accordingly.
- **Determinism is not negotiable.** No network access, no clock reads, no ambient locale dependence, no module-level mutable state. The same input, options and pinned dataset must produce the same result on any machine.
- **Never bundle a dataset.** Region, MMDA, institution, code, operator-prefix and address data stay out of this repository. Reference adapters take a caller-supplied versioned dataset, or consume another Digital Ghana product through a published versioned contract or a pinned dataset artifact — never a shared database, never a copied source tree.
- **Keep runtime dependencies at zero** for the package. New dependencies need a written justification in the pull request.
- **Add tests proportional to risk**, and update the public documentation in the same pull request.
- **Do not invent interface parity.** Per [`contracts/README.md`](contracts/README.md), REST, GraphQL, event or SDK surfaces are added from demonstrated consumers and a documented decision, not to fill out a template.
- **Never imply government endorsement or official status** in code, copy, metadata or structured data.
- **Never commit credentials, personal data, real customer inputs or provider environment files.** Examples use synthetic values.

## Commit and pull-request conventions

Commits follow the existing history in this repository: a lowercase `type: imperative summary` subject, no scope, no trailing full stop, short enough to read in `git log --oneline`.

Types in use here: `feat`, `fix`, `docs`, `chore`.

```text
feat: build GhanaValidate beta candidate
fix: expose Next runtime to Vercel
chore: add Vercel production config
docs: record GhanaValidate public beta
```

A pull request should state:

- the scope of the change, and which rule id or surface it affects;
- the source, ADR or evidence file it relies on;
- the verification actually performed — paste the commands and their result;
- whether any reason code, rule version or exported type changed, and the migration impact;
- any open gate the change depends on.

## Proposing a rule or source correction

Corrections need evidence, not confidence. A correction to a rule's behaviour or to the source register must provide:

- the affected **rule id** (`ghana-phone`, `ghana-post-digital-address-syntax`, `ghana-text`, `versioned-reference`) or the affected source `id` in [`docs/governance/source-register.json`](docs/governance/source-register.json);
- the current behaviour or current recorded value, exactly;
- the proposed behaviour or value;
- the **authoritative source**, with a stable URL and its publishing authority;
- the source's publication or effective date;
- whether the change is breaking for existing callers, and therefore whether it needs a new major rule version;
- a failing test that the change makes pass.

Rules on the publication side:

- A source is recorded with its authority, title, URL, licence position, publication decision and review date. **Unknown rights are recorded as unknown, never assumed open.**
- Referenced facts may be used; source datasets are not redistributed. A correction that requires copying a third party's dataset into this repository will be declined regardless of how useful it is.
- Automation may draft a correction; a human reviewer approves any change to a published rule.

## Good first contributions

Each of these is a real, currently open gap in this repository:

1. **Reconcile the licence metadata.** [`LICENSE`](LICENSE) and [`NOTICE`](NOTICE) are Apache-2.0, but the `license` field in [`package.json`](package.json) and the `SoftwareSourceCode` JSON-LD block in `apps/web/app/page.tsx` still say MIT. Make the machine-readable metadata match the licence the repository actually ships under.
2. **Add negative tests for the governance validator.** [`scripts/validate.rb`](scripts/validate.rb) guards required files, source-register decisions, template tokens and committed private keys, but nothing proves those guards actually fail. A small Ruby test that builds a temporary tree and asserts each abort path would make the validator trustworthy.
3. **Close the reason-code test gaps.** [`tests/validation.test.ts`](tests/validation.test.ts) covers five behaviours. `PHONE_EMPTY`, `PHONE_INVALID_NATIONAL_NUMBER`, `POSTAL_EMPTY`, `TEXT_EMPTY`, `REFERENCE_EMPTY` and `REFERENCE_DATASET_UNVERSIONED` are all reachable in [`src/index.ts`](src/index.ts) and none of them is asserted.
4. **Publish the reason-code table in the contract.** [`contracts/validation-result.md`](contracts/validation-result.md) specifies the result shape but not the enumerated codes, so consumers have to read the implementation to learn the interface they are pinning. Add the codes, their meanings and their stability guarantee to the contract itself.
5. **Draft the network-API ADR.** [`docs/adr/0001-product-boundary.md`](docs/adr/0001-product-boundary.md) requires an explicit ADR and portfolio registry entry before any additional hostname exists, and [`docs/runbooks/operations.md`](docs/runbooks/operations.md) lists the pre-API checklist (payload limits, log redaction, rate limits, request identifiers, retention decision). A proposed ADR is useful long before the gate is met.
6. **Write a worked reference-adapter example.** `resolveReference` is designed to consume a pinned public contract from another Digital Ghana product, but no example shows how to build that adapter without copying the other product's data. A documented example using a versioned dataset artifact would make the safe path the obvious one.

## Review expectations

- A maintainer reviews every pull request. Expect questions about the claim boundary and provenance before questions about style.
- Changes that alter published behaviour — a reason code, a rule version, a normalisation result — need the evidence and the test in the diff, not in the conversation.
- CI must be green. A red validator is treated as a blocking defect, not a flake.
- Discussion stays on evidence and public benefit. Conduct expectations are in [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).
- Maintainers may edit, reject or remove contributions that violate the policies above.

## Security

Do not report vulnerabilities in public issues. Follow [`SECURITY.md`](SECURITY.md) and email the private channel in `SECURITY.md`. Do not include live credentials or personal data in a report.

## Licensing

Unless explicitly stated otherwise, contributions intentionally submitted for inclusion are provided under the Apache License 2.0 under that licence's inbound = outbound terms (section 5). See [`LICENSE`](LICENSE) and [`NOTICE`](NOTICE).

Contributions must not include third-party data or documents without recorded permission. The Apache-2.0 repository licence does not relicense referenced source documents or any third-party dataset.

## Independence

GhanaValidate is an independent open-source project. It is not operated by, endorsed by, or affiliated with the Government of Ghana, the National Communications Authority, GhanaPost or any agency. Do not submit changes that imply otherwise.
