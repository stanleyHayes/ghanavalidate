#!/usr/bin/env ruby

# These scripts read UTF-8 Markdown and JSON. Ruby derives its default external
# encoding from the locale, so on a machine with LANG unset it defaults to
# US-ASCII and every read of a file containing an em dash raises
# ArgumentError: invalid byte sequence. Pin the encoding so the checks behave
# the same for every contributor regardless of their shell locale.
Encoding.default_external = Encoding::UTF_8
Encoding.default_internal = Encoding::UTF_8

require "json"
require "pathname"

root = Pathname.new(__dir__).parent
required = %w[README.md AGENTS.md agent_plan.md SECURITY.md LICENSE package.json pnpm-workspace.yaml tsconfig.json vercel.json src/index.ts tests/validation.test.ts apps/web/package.json apps/web/app/layout.tsx apps/web/app/page.tsx apps/web/app/validator.tsx apps/web/app/styles.css apps/web/app/icon.svg apps/web/app/opengraph-image.tsx contracts/README.md contracts/validation-result.md docs/product-definition.md docs/adr/0001-product-boundary.md docs/governance/source-register.json docs/runbooks/operations.md docs/runbooks/release-evidence.md infra/vercel.json]
missing = required.reject { |path| root.join(path).file? }
abort "missing required files: #{missing.join(', ')}" unless missing.empty?

source_register = JSON.parse(root.join("docs/governance/source-register.json").read)
abort "source register must contain at least one record" if source_register.fetch("sources", []).empty?
abort "source register contains blocked or unknown publication decisions" if source_register.fetch("sources").any? { |source| ["blocked", "unknown"].include?(source.fetch("publicationDecision")) }

contents = required.map { |path| root.join(path).read }.join("\n")
template_marker = ["__", "PRODUCT_"].join
abort "unresolved template token" if contents.include?(template_marker)
private_key_pattern = Regexp.new(["-----BEGIN", ".*PRIVATE KEY-----"].join(" "))
abort "possible private key" if contents.match?(private_key_pattern)

puts "Product foundation validation passed"
