#!/usr/bin/env ruby

require "json"
require "pathname"

root = Pathname.new(__dir__).parent
required = %w[README.md AGENTS.md agent_plan.md SECURITY.md LICENSE package.json pnpm-workspace.yaml tsconfig.json src/index.ts tests/validation.test.ts apps/web/package.json apps/web/app/layout.tsx apps/web/app/page.tsx apps/web/app/validator.tsx apps/web/app/styles.css apps/web/app/icon.svg apps/web/app/opengraph-image.tsx contracts/README.md contracts/validation-result.md docs/product-definition.md docs/adr/0001-product-boundary.md docs/governance/source-register.json docs/runbooks/operations.md docs/runbooks/release-evidence.md infra/vercel.json]
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
