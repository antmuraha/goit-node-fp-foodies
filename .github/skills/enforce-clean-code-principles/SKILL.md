---
name: enforce-clean-code-principles
description: "Apply and validate clean code rules: naming clarity, single-responsibility functions, low nesting, meaningful comments, and dead code removal."
---

# Skill: Enforce Clean Code Principles

## Description

Apply clean code practices to improve readability, maintainability, and change safety. This skill is used when writing new code, reviewing existing code, or refactoring complex modules.

## Architectural Constraints

- **Naming**: Use descriptive names for symbols and modules
- **Function Scope**: Prefer one responsibility per function
- **Complexity**: Avoid deep nesting and long branches
- **Comments**: Explain why, not what
- **Hygiene**: Remove dead code and unused imports
- **Design**: Prefer composition over inheritance

## Trigger Examples

- "Refactor this service to be cleaner"
- "Apply clean code rules to this module"
- "Reduce complexity in this route"
- "Audit naming and function responsibilities"

## Implementation Rules

### 1. Naming and Cohesion

- Rename ambiguous symbols (`data`, `value`, `tmp`) to domain-relevant names.
- Keep related behavior close to the owning module.

### 2. Single Responsibility

- Split multi-purpose functions into smaller pure helpers where possible.
- Keep orchestration in one function and logic in specialized helpers.

### 3. Complexity Control

- Flatten nested conditionals with early returns.
- Extract strategy maps or guard functions for repeated branching.

### 4. Comment Policy

- Keep comments sparse and focused on business rationale or edge-case constraints.
- Remove comments that only paraphrase obvious code.

### 5. Code Hygiene

- Remove unused imports, vars, branches, and dead files touched by the change.
- Prefer small, focused diffs over mixed refactor + feature bundles.

## Optional Validation Snippets

```bash
# Unused imports/variables often surfaced by typecheck
npm run typecheck

# Heuristic: deeply nested blocks (quick scan)
rg "if\s*\(|for\s*\(|while\s*\(" apps packages

# Heuristic: TODO/FIXME accumulation
rg "TODO|FIXME" apps packages
```

## Expected Outputs

- Clear naming in changed code
- Smaller and focused functions
- Reduced nesting in key logic paths
- Comments aligned to rationale
- No dead logic in touched modules

## Validation Checklist

- [ ] Symbol names are descriptive and domain-specific
- [ ] Functions generally have one responsibility
- [ ] Deep nesting was reduced or isolated
- [ ] Comments explain rationale, not mechanics
- [ ] Unused imports and stale code removed

## Related Skills

- `manage-centralized-constants` - remove magic literals and inline defaults
- `create-api-service-wrapper` - keep HTTP concerns out of business logic
- `implement-dependency-adapter-layer` - isolate third-party complexity
- `validate-import-paths` - preserve architectural boundaries

## Enforcement

This skill enforces:

- Readable and maintainable code structure
- Lower complexity in core logic paths
- Consistent implementation hygiene across features
