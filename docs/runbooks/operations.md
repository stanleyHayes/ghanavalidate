# Operations baseline

The stateless public workbench is hosted on Vercel at `validate.digitalghana.dev`. Validation runs locally in the browser; the beta has no application database, private API, secrets or user-input telemetry.

## Routine checks

- Confirm `/`, `/robots.txt`, `/sitemap.xml`, `/icon.svg`, `/manifest.webmanifest` and `/opengraph-image` return 200.
- Exercise local/international phone parity and GhanaPostGPS syntax in a production browser.
- Confirm the non-verification warning and rule version remain visible.
- Run `pnpm check` before release and require the GitHub Quality workflow to pass.
- Review NCA numbering and GhanaPostGPS format references before changing a rule.

## Incident and rollback

Use an immutable Vercel deployment ID for rollback, then smoke the canonical hostname. Reassign `validate.digitalghana.dev` to the intended known-good deployment if the custom alias does not follow the project promotion automatically. Record the exact target and result in `release-evidence.md`.

Before a network API or stateful admin surface, define and verify:

- health, readiness and dependency checks;
- structured logs with request/correlation identifiers and secret redaction;
- latency, error, saturation and domain-correctness signals;
- alert routes with an acknowledged owner;
- backup/restore where state exists;
- least-privilege provider credentials and rotation;
- rate limits, abuse controls and audit trails for privileged publication;
- rollback and incident communication steps.
