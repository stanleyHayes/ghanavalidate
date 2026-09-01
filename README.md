# GhanaValidate

`GhanaValidate` is an independent, package-first Digital Ghana public-infrastructure product for deterministic Ghana-specific input normalization. The public beta workbench is live at [validate.digitalghana.dev](https://validate.digitalghana.dev).

It validates syntax and returns reference candidates. It never verifies identity, ownership, reachability, authenticity or legal status.

## Before implementation

1. Record the problem, users, non-goals, source rights and acceptance evidence in `agent_plan.md`.
2. Replace the placeholder source-register record only after authority and licence review.
3. Add domain contracts before transport or UI code.
4. Keep deployments fail-closed until required provider values exist.

## Verification

Run `pnpm install` and `pnpm check` to validate governance files, typecheck, run contract tests, build the package and produce the public site.

Official references: the [NCA national numbering plan](https://nca.org.gh/numbering/) and [GhanaPostGPS format guide](https://nas.ghanapostgps.com/get-help/). They support limited format facts only; GhanaValidate does not redistribute either service's data.
