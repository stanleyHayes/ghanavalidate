# ADR-0001: Independent product boundary

Status: Accepted

## Decision

GhanaValidate owns its repository, release lifecycle, data, credentials, contracts and operational evidence. It may consume another Digital Ghana product only through a versioned public contract or pinned dataset artifact.

The canonical web hostname is `validate.digitalghana.dev`. Additional API or operational hostnames require an explicit ADR and portfolio registry entry before deployment.

The first release is a dependency-light TypeScript package. It performs deterministic syntax validation and normalization only. It does not verify identity, ownership, reachability, allocation, legal status, or the real-world existence of a phone number, address, institution, or person.

Reference adapters accept versioned caller-supplied records or consume an explicitly pinned public contract. GhanaValidate does not copy GhanaGeo, GhanaCodes, GhanaGov, GhanaPostGPS, NCA, or identity-provider databases into this repository.

## Consequences

Failures remain isolated, histories remain understandable, and a portfolio-wide platform outage is not created by convenience. Some configuration and small primitives may be repeated until two proven consumers justify a versioned shared package.
