---
name: implement-dependency-adapter-layer
description: "Abstract third-party dependencies behind interfaces/adapters to minimize coupling and simplify replacement and testing."
---

# Skill: Implement Dependency Adapter Layer

## Description

Create interfaces and adapter implementations for external dependencies so core modules depend on stable contracts rather than vendor-specific SDKs.

## Architectural Constraints

- **Required**: Contract-first interfaces for external services where practical
- **Boundary**: Provider-specific logic remains in adapter layer
- **Domain Rule**: Business logic depends on contracts, not vendor SDK types
- **Testing**: Adapters must be swappable with mocks/fakes

## Trigger Examples

- "Abstract payment provider integration"
- "Create adapter for email client"
- "Decouple business logic from Redis client"
- "Add interface for third-party dependency"

## Implementation Steps

### 1. Define Contract

- Add interface for the required capability (`sendEmail`, `chargePayment`, `cacheSet`).
- Keep method names domain-focused and stable.

### 2. Implement Provider Adapter

- Create adapter class/module that maps contract to provider SDK.
- Translate provider errors into domain-level errors.

### 3. Inject Adapter into Services

- Pass adapter via constructor/factory/context where used.
- Avoid importing provider SDK directly in domain services.

### 4. Add Test Double

- Add mock/fake adapter that conforms to the same interface.
- Use it in tests to avoid network/provider dependencies.

## Example Shape

```ts
export interface EmailGateway {
    sendWelcomeEmail(input: { to: string; name: string }): Promise<void>;
}

export class SendgridEmailGateway implements EmailGateway {
    async sendWelcomeEmail(input: { to: string; name: string }): Promise<void> {
        // provider-specific implementation
    }
}
```

## Optional Validation Snippets

```bash
# Heuristic: provider SDK imports in domain folders (adjust paths as needed)
rg "from 'redis|from 'stripe|from 'sendgrid|from \"redis|from \"stripe|from \"sendgrid" apps packages \
  -g '**/domain/**' -g '**/use-cases/**'

# Search for interface contract usage
rg "interface .*Gateway|interface .*Client|implements .*Gateway|implements .*Client" apps packages
```

## Expected Outputs

- Interface contracts for targeted external dependencies
- Adapter implementations for provider-specific details
- Domain services using contracts instead of SDKs
- Test doubles for adapter contracts

## Validation Checklist

- [ ] Interface/contract created for external dependency
- [ ] Provider-specific code isolated in adapter
- [ ] Business logic uses contract type only
- [ ] Adapter can be replaced without domain rewrites
- [ ] Mock/fake adapter available for tests

## Related Skills

- `create-api-service-wrapper` - wrapper layer around HTTP access
- `enforce-clean-code-principles` - modularity and low coupling
- `validate-import-paths` - architectural boundaries
- `validate-tech-stack` - dependency governance

## Enforcement

This skill enforces:

- Loose coupling to external providers
- Better replaceability and extension safety
- Easier mocking and testing in application services
