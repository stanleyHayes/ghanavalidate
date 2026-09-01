import assert from "node:assert/strict";
import test from "node:test";
import { normalizeGhanaPhone, normalizeGhanaPostAddress, normalizeGhanaText, resolveReference } from "../src/index.js";

test("local and international Ghana phone forms normalize identically", () => {
  const forms = ["024 123 4567", "+233 24 123 4567", "233241234567", "241234567"];
  const results = forms.map(normalizeGhanaPhone);
  for (const result of results) {
    assert.equal(result.valid, true);
    assert.equal(result.normalizedValue?.e164, "+233241234567");
    assert.equal(result.rule.version, "1.0.0");
    assert.match(result.warnings.join(" "), /NOT_REACHABILITY_OR_OWNERSHIP/);
  }
});

test("phone rules reject malformed input without claiming allocation", () => {
  assert.equal(normalizeGhanaPhone("+233 24 ABC 4567").reasonCode, "PHONE_INVALID_CHARACTERS");
  assert.equal(normalizeGhanaPhone("024123").reasonCode, "PHONE_INVALID_LENGTH");
});

test("GhanaPostGPS examples normalize as syntax only", () => {
  for (const [input, expected] of [["ga 543 0125", "GA-543-0125"], ["ER-0254-2310", "ER-0254-2310"]]) {
    const result = normalizeGhanaPostAddress(input);
    assert.equal(result.valid, true);
    assert.equal(result.normalizedValue?.formatted, expected);
    assert.match(result.warnings.join(" "), /NOT_ADDRESS_EXISTENCE_OR_OWNERSHIP/);
  }
  assert.equal(normalizeGhanaPostAddress("Accra").valid, false);
});

test("text normalization is conservative and deterministic", () => {
  assert.deepEqual(normalizeGhanaText("  Ama   Mensah  ").normalizedValue, "Ama Mensah");
});

test("unknown or ambiguous references return honest candidates and dataset version", () => {
  const dataset = {
    type: "mmda",
    version: "synthetic-test-v1",
    records: [
      { id: "ga-east", name: "Ga East Municipal" },
      { id: "ga-west", name: "Ga West Municipal" }
    ]
  } as const;
  const ambiguous = resolveReference("Ga", dataset);
  assert.equal(ambiguous.valid, false);
  assert.equal(ambiguous.reasonCode, "REFERENCE_AMBIGUOUS");
  assert.equal(ambiguous.normalizedValue?.candidates.length, 2);
  assert.equal(ambiguous.normalizedValue?.dataset.version, "synthetic-test-v1");
  assert.equal(resolveReference("Unknown district", dataset).reasonCode, "REFERENCE_NOT_FOUND");
});
