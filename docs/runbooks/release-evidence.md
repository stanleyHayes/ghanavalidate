# Public beta release evidence — 2026-09-01

## Release identity

- Repository: `https://github.com/stanleyHayes/ghanavalidate`
- Application commit: `faeceec`
- Package/rule release: `0.1.0-beta.1`; rule versions `1.0.0`
- GitHub Actions Quality run: `33522410941`, success
- Operational owner: Digital Ghana project owner

## Provider and canonical surface

- Vercel project: `hayfordstanleys-projects/ghanavalidate` (`prj_mECroTMLS8lUu52NuwtRF3zAP9rk`)
- Current deployment: `dpl_CJ3BZZWwhWq2CSDqZs9DsFrmmAWA`
- Canonical hostname: `https://validate.digitalghana.dev`
- Deployment protection is disabled for the public project; no application secrets are configured.

## Verification

- `pnpm check` passed governance validation, strict typecheck, five domain tests, package build and Next.js production build.
- Canonical `/`, robots, sitemap, SVG favicon, web manifest and Open Graph image returned HTTP 200 with valid TLS and expected content types.
- The Open Graph PNG is 1200×630; canonical, Open Graph, Twitter and JSON-LD metadata are present.
- Production Chrome QA normalized `GA 543 0125` to `GA-543-0125` and displayed the syntax-only non-ownership warning.
- Outfit body/UI and Geist Mono data labels are active; Newsreader is the title accent. No prohibited native select, dialog, checkbox, radio, date or time control renders. No horizontal overflow was observed.

## Rollback drill

- A second immutable build was produced as `dpl_CJ3BZZWwhWq2CSDqZs9DsFrmmAWA`.
- The project was rolled back to `dpl_APKJ613XQzzFYUSQyzTt5BhT4HC6`; `validate.digitalghana.dev` returned the expected hero and HTTP 200.
- The canonical alias was restored to `dpl_CJ3BZZWwhWq2CSDqZs9DsFrmmAWA`; the same smoke passed.

## Known limitations

- Syntax validity is not identity, ownership, reachability, allocation, authenticity or real-world existence verification.
- Phone rules intentionally enforce only `+233`/local normalization and the nine-digit national-number invariant; changing prefix allocations are not bundled.
- GhanaPostGPS checks only the documented textual shape and never resolves an address.
- Reference adapters require a caller-supplied named dataset version; GhanaGeo/Codes/Gov data is not bundled.
- npm publication, React hooks, a batch API and administrative rule tooling remain gated later phases.
