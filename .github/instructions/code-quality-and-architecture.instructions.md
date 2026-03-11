---
description: "Use when implementing or reviewing code to enforce clean code, constants centralization, wrapper-only API access, dependency abstraction, and modular separation of concerns."
name: "Code Quality and Architecture Standards"
---

# Code Quality and Architecture Standards

Apply these rules to all code changes unless a stronger repository rule overrides them.

## 1. Clean Code Principles

- Use descriptive names for variables, functions, classes, files, and modules.
- Keep functions focused on one responsibility.
- Keep control flow shallow. If a function has deep branching, extract helpers.
- Prefer code that explains itself through naming and structure.
- Comments should explain why, not restate what the code already shows.
- Remove dead logic, stale branches, and unused imports in the same change set.
- Prefer composition over inheritance when possible.

## 2. Centralized Constants and Config

- Do not hardcode repeated literals in business logic.
- Store reusable values in dedicated modules:
    - `constants/`
    - `config/`
    - `enums/`
- Extract and centralize:
    - API endpoints and route fragments
    - status codes
    - default values
    - magic numbers
    - reusable string literals
    - environment key names

## 3. API Access Through Wrappers

- Business logic must not call `fetch`, `axios`, `requests`, or similar clients directly.
- Internal frontend-backend calls use Hono RPC.
- External integrations must go through wrappers in `api/`, `services/`, or `clients/`.
- If HTTP library details change, only wrapper files should be affected.

## 4. Dependency Abstraction

- Put third-party provider code behind interfaces/adapters where practical.
- Keep infrastructure details out of domain logic.
- Define contracts that can be mocked easily in tests.

## 5. Reusability and Modularity

- Avoid duplicate logic across routes, services, and UI modules.
- Extract reusable logic into shared modules (`utils/`, `helpers/`) with clear ownership.
- Preserve separation between:
    - business logic
    - API communication
    - UI/presentation
    - configuration/constants

## 6. Functional HTML Element Encapsulation

Functional HTML elements must be encapsulated within reusable components. This ensures **centralized control, maintainability, consistency, and accessibility**.

### 6.1 Functional vs. Structural Elements

**Functional Elements (Must Be Wrapped)**

These elements provide **user interaction or form-related functionality** and must never be used directly in application code. Always use dedicated component wrappers:

- `<input>` → use `<Input />`
- `<textarea>` → use `<TextArea />`
- `<select>` → use `<Select />`
- `<button>` → use `<Button />`
- `<input type="checkbox">` → use `<Checkbox />`
- `<input type="radio">` → use `<Radio />`

Even if a component only wraps the native element initially without custom styling, this abstraction enables future updates (styling, validation logic, accessibility improvements, analytics hooks, state management) to be applied in **one centralized place**.

**Structural Elements (Direct Use Allowed)**

These elements are used strictly for layout or local structure and carry no reusable functionality. Direct use is acceptable:

- `<div>` — generic container
- `<section>` — semantic section
- `<span>` — inline text wrapper
- `<article>` — semantic content block
- `<header>` — semantic page header
- `<footer>` — semantic page footer
- `<nav>` — semantic navigation
- `<main>` — semantic main content
- Other layout-only wrappers without inherent behavior

### 6.2 Rationale

Encapsulation ensures:

- Centralized control of form behavior and interaction patterns
- Easier future styling updates across the entire application
- Consistent validation handling and error display
- Improved accessibility management (ARIA, semantic HTML, keyboard support)
- Simplified refactoring and reduced duplication
- Single source of truth for component behavior

### 6.3 Enforced by Validation

- Automated script: `scripts/validate-functional-html-encapsulation.sh` detects raw functional HTML usage in `apps/web/src`
- Component structure validation: `scripts/validate-component-structure.sh` ensures components expose variant/size/state prop APIs

## 7. Optional Validation Heuristics

These checks are optional and intended for local verification.

```bash
# Potential direct HTTP usage outside common API layers
rg "fetch\(|axios\.|new\s+Axios|requests\." apps packages \
  -g '!**/api/**' -g '!**/services/**' -g '!**/clients/**'

# Potential magic numbers (tune pattern per codebase)
rg "\b\d{2,}\b" apps packages

# Potential duplicated literal strings (quick heuristic)
rg "'[^']{8,}'|\"[^\"]{8,}\"" apps packages
```

## 8. Related Skills

- `enforce-clean-code-principles`
- `manage-centralized-constants`
- `create-api-service-wrapper`
- `implement-dependency-adapter-layer`
