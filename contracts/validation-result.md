# Validation result contract v1

All public primitives return one of two JSON-compatible shapes.

```ts
type ValidationResult<T> =
  | {
      valid: true;
      normalizedValue: T;
      reasonCode: "VALID";
      warnings: string[];
      rule: { id: string; version: string };
    }
  | {
      valid: false;
      normalizedValue: T | null;
      reasonCode: string;
      warnings: string[];
      rule: { id: string; version: string };
    };
```

`valid` means only that the input satisfies the named local rule version. It is never evidence of identity, ownership, reachability, allocation, authenticity or real-world existence.
