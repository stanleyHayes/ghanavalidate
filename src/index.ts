export type RuleReference = Readonly<{ id: string; version: string }>;

export type ValidationResult<T> =
  | Readonly<{
      valid: true;
      normalizedValue: T;
      reasonCode: "VALID";
      warnings: readonly string[];
      rule: RuleReference;
    }>
  | Readonly<{
      valid: false;
      normalizedValue: T | null;
      reasonCode: string;
      warnings: readonly string[];
      rule: RuleReference;
    }>;

const PHONE_RULE = { id: "ghana-phone", version: "1.0.0" } as const;
const POSTAL_RULE = { id: "ghana-post-digital-address-syntax", version: "1.0.0" } as const;
const TEXT_RULE = { id: "ghana-text", version: "1.0.0" } as const;
const REFERENCE_RULE = { id: "versioned-reference", version: "1.0.0" } as const;

function invalid<T>(rule: RuleReference, reasonCode: string, normalizedValue: T | null = null): ValidationResult<T> {
  return { valid: false, normalizedValue, reasonCode, warnings: [], rule };
}

export type PhoneNormalization = Readonly<{ e164: string; local: string; national: string }>;

export function normalizeGhanaPhone(input: string): ValidationResult<PhoneNormalization> {
  const compact = input.trim().replace(/[\s().-]/g, "");
  if (!compact) return invalid(PHONE_RULE, "PHONE_EMPTY");
  if (!/^\+?\d+$/.test(compact)) return invalid(PHONE_RULE, "PHONE_INVALID_CHARACTERS");

  let national: string;
  if (compact.startsWith("+233")) national = compact.slice(4);
  else if (compact.startsWith("233")) national = compact.slice(3);
  else if (compact.startsWith("0")) national = compact.slice(1);
  else national = compact;

  if (national.length !== 9) return invalid(PHONE_RULE, "PHONE_INVALID_LENGTH");
  if (national.startsWith("0")) return invalid(PHONE_RULE, "PHONE_INVALID_NATIONAL_NUMBER");

  return {
    valid: true,
    normalizedValue: { e164: `+233${national}`, local: `0${national}`, national },
    reasonCode: "VALID",
    warnings: ["SYNTAX_ONLY_NOT_REACHABILITY_OR_OWNERSHIP_VERIFICATION"],
    rule: PHONE_RULE
  };
}

export type GhanaPostAddress = Readonly<{ formatted: string; compact: string; districtCode: string; areaCode: string; uniqueAddress: string }>;

export function normalizeGhanaPostAddress(input: string): ValidationResult<GhanaPostAddress> {
  const compact = input.trim().toUpperCase().replace(/[\s-]/g, "");
  const match = /^([A-Z][A-Z0-9])(\d{3,4})(\d{4})$/.exec(compact);
  if (!match) return invalid(POSTAL_RULE, input.trim() ? "POSTAL_INVALID_FORMAT" : "POSTAL_EMPTY");
  const [, districtCode, areaCode, uniqueAddress] = match;
  if (!districtCode || !areaCode || !uniqueAddress) return invalid(POSTAL_RULE, "POSTAL_INVALID_FORMAT");

  return {
    valid: true,
    normalizedValue: {
      formatted: `${districtCode}-${areaCode}-${uniqueAddress}`,
      compact,
      districtCode,
      areaCode,
      uniqueAddress
    },
    reasonCode: "VALID",
    warnings: ["SYNTAX_ONLY_NOT_ADDRESS_EXISTENCE_OR_OWNERSHIP_VERIFICATION"],
    rule: POSTAL_RULE
  };
}

export function normalizeGhanaText(input: string): ValidationResult<string> {
  const normalized = input.normalize("NFKC").trim().replace(/\s+/g, " ");
  if (!normalized) return invalid(TEXT_RULE, "TEXT_EMPTY", "");
  return { valid: true, normalizedValue: normalized, reasonCode: "VALID", warnings: [], rule: TEXT_RULE };
}

export type ReferenceRecord = Readonly<{ id: string; name: string; aliases?: readonly string[] }>;
export type ReferenceDataset = Readonly<{ type: string; version: string; records: readonly ReferenceRecord[] }>;
export type ReferenceResolution = Readonly<{ dataset: { type: string; version: string }; candidates: readonly ReferenceRecord[] }>;

function searchKey(value: string): string {
  return value.normalize("NFKD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase("en-GH").trim().replace(/[^a-z0-9]+/g, " ");
}

export function resolveReference(input: string, dataset: ReferenceDataset): ValidationResult<ReferenceResolution> {
  const needle = searchKey(input);
  if (!needle) return invalid(REFERENCE_RULE, "REFERENCE_EMPTY");
  if (!dataset.type.trim() || !dataset.version.trim()) return invalid(REFERENCE_RULE, "REFERENCE_DATASET_UNVERSIONED");

  const exact = dataset.records.filter((record) => [record.id, record.name, ...(record.aliases ?? [])].some((value) => searchKey(value) === needle));
  const candidates = exact.length > 0
    ? exact
    : dataset.records.filter((record) => [record.id, record.name, ...(record.aliases ?? [])].some((value) => searchKey(value).includes(needle)));

  if (candidates.length === 0) return invalid(REFERENCE_RULE, "REFERENCE_NOT_FOUND", { dataset: { type: dataset.type, version: dataset.version }, candidates: [] });
  if (candidates.length > 1) return invalid(REFERENCE_RULE, "REFERENCE_AMBIGUOUS", { dataset: { type: dataset.type, version: dataset.version }, candidates });

  return {
    valid: true,
    normalizedValue: { dataset: { type: dataset.type, version: dataset.version }, candidates },
    reasonCode: "VALID",
    warnings: ["REFERENCE_MATCH_NOT_AUTHORITY_OR_IDENTITY_VERIFICATION"],
    rule: REFERENCE_RULE
  };
}
