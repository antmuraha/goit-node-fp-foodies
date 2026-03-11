---
name: manage-centralized-constants
description: "Centralize reusable constants, config values, enums, and key names into dedicated modules; avoid hardcoded literals in business logic."
---

# Skill: Manage Centralized Constants

## Description

Move reusable literals and default values into dedicated constant/config/enum modules to reduce duplication and improve consistency.

## Architectural Constraints

- **Required**: Shared constants in `constants/`, `config/`, or `enums/`
- **UI Required**: Shared design tokens in CSS token modules (for example `styles/tokens.css`, `styles/theme.css`)
- **Forbidden**: Repeated magic literals in business logic
- **UI Forbidden**: Hardcoded colors, spacing, typography, and breakpoints inside components
- **Separation**: Environment values belong to env/config layer
- **Scope**: Reuse across routes, services, UI, and tests

## Trigger Examples

- "Extract magic numbers into constants"
- "Centralize API endpoint strings"
- "Create shared status constants"
- "Refactor repeated defaults into config"

## Implementation Patterns

### 1. Decide Module Type

- `constants/` for fixed literals used broadly.
- `config/` for default behaviors and feature toggles.
- `enums/` for bounded value sets used in app logic.

### 2. Extract Common Values

- API endpoints/path segments
- status codes and status labels
- retry/backoff defaults
- common error code strings
- feature flags and key names

### 2.1 Extract UI Design Tokens (CSS-native)

- Create and reuse CSS custom properties for:
    - colors (`--color-primary`, `--color-surface`, `--color-text-muted`)
    - typography (`--font-family-base`, `--font-size-md`, `--line-height-base`)
    - spacing (`--space-1`, `--space-2`, `--space-4`)
    - radius/shadows (`--radius-md`, `--shadow-sm`)
    - breakpoints (`--breakpoint-sm`, `--breakpoint-lg`) or centralized media constants
- Components should consume shared tokens, not ad-hoc literals.

### 3. Replace Inline Usage

- Replace duplicated literals with named exports.
- Keep names stable and semantic (`AUTH_REFRESH_PATH`, `DEFAULT_PAGE_SIZE`).

### 4. Keep Boundaries Clear

- Do not mix secrets into constants modules.
- Keep secret values in environment variables and runtime config.

## Optional Validation Snippets

```bash
# Search for hardcoded endpoints or common status literals
rg "'/api/|\"/api/|status\s*===\s*'" apps packages

# Search for repeated numeric literals (quick heuristic)
rg "\b(10|15|30|60|100|500|1000)\b" apps packages

# Track central constants usage
rg "from '.*constants|from \".*constants" apps packages

# Potential hardcoded UI colors in components
rg -n "#[0-9A-Fa-f]{3,8}|rgb\(|hsl\(" apps packages --glob '**/*.{tsx,jsx,astro,css}'
```

## Expected Outputs

- Shared constants/config/enums modules added or expanded
- Inline duplicated literals replaced with imports
- Clear naming for default values and keys
- Fewer hardcoded values in business logic

## Validation Checklist

- [ ] Reusable literals extracted to shared modules
- [ ] API paths and default values are centralized
- [ ] Enums are defined once and reused
- [ ] UI style values are sourced from shared CSS tokens
- [ ] Secrets are not moved into constants files
- [ ] Touched files no longer rely on repeated magic values

## Related Skills

- `create-env-template` - environment variable documentation
- `enforce-clean-code-principles` - readability and naming quality
- `create-api-service-wrapper` - endpoint and client constant reuse
- `enforce-typed-contract-flow` - consistent contract constants across layers

## Enforcement

This skill enforces:

- Constant and config deduplication
- Better maintainability for shared values
- Clear boundary between code constants and runtime secrets
