---
name: validate-tech-stack
description: "Scan the project for unauthorized technologies and frameworks, enforcing the approved canonical stack only."
---

# Skill: Validate Tech Stack

## Description

Validate that this repository follows the current locked stack and does not introduce technologies that conflict with project requirements.

## Architectural Constraints

- **Backend**: Express.js API in `backend/`
- **Frontend**: React + Vite SPA in `frontend/`
- **State**: Redux Toolkit
- **Data layer**: PostgreSQL + Sequelize + sequelize-cli migrations
- **Validation**: Joi baseline at API boundary (incremental policy-layer evolution allowed)
- **Auth**: JWT with cookie transport (HttpOnly/Secure/SameSite)
- **Package manager**: npm for backend and frontend

## Trigger Examples

- "Check tech stack compliance"
- "Validate project dependencies"
- "Audit technology choices"
- "Scan for unauthorized frameworks"

## Validation Rules

### Approved Core Dependencies

#### Backend

- `express`
- `sequelize`
- `sequelize-cli`
- `pg`
- `jsonwebtoken`
- `joi`

#### Frontend

- `react`
- `react-dom`
- `react-router-dom`
- `@reduxjs/toolkit`
- `react-redux`
- `vite`

#### Infrastructure and Tooling

- `docker` / `docker-compose`
- `npm`

Notes:

- Some libraries may coexist temporarily during migration work; only flag as hard violation when they are introduced for runtime architecture paths.
- This project is `backend/` + `frontend/`, not `apps/*` + `packages/*`.

## Implementation

### 1. Package Scanner (`scripts/validate-stack.ts`)

```ts
import fs from "fs";
import path from "node:path";

const FORBIDDEN = [
    "hono",
    "fastify",
    "koa",
    "@nestjs/core",
    "drizzle-orm",
    "prisma",
    "typeorm",
    "mongoose",
    "mongodb",
    "astro",
    "next",
    "nuxt",
    "sveltekit",
    "turbo",
    "nx",
    "lerna",
];

interface ValidationResult {
    valid: boolean;
    violations: string[];
}

export function validatePackageJson(filePath: string): ValidationResult {
    const pkg = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const allDeps = {
        ...pkg.dependencies,
        ...pkg.devDependencies,
    };

    const violations: string[] = [];

    for (const dep of Object.keys(allDeps)) {
        if (FORBIDDEN.some((forbidden) => dep === forbidden || dep.startsWith(`${forbidden}/`))) {
            violations.push(`Forbidden dependency: ${dep} in ${filePath}`);
        }
    }

    return {
        valid: violations.length === 0,
        violations,
    };
}

export function scanRepository(rootDir: string): ValidationResult {
    const files = [path.join(rootDir, "backend/package.json"), path.join(rootDir, "frontend/package.json")];

    const allViolations: string[] = [];

    for (const file of files) {
        if (!fs.existsSync(file)) continue;
        const result = validatePackageJson(file);
        allViolations.push(...result.violations);
    }

    return {
        valid: allViolations.length === 0,
        violations: allViolations,
    };
}
```

### 2. Import Scanner (`scripts/scan-imports.ts`)

```ts
import fs from "fs";
import { globSync } from "glob";

const FORBIDDEN_IMPORTS = [
    /from ['"]hono['"]/,
    /from ['"]fastify['"]/,
    /from ['"]koa['"]/,
    /from ['"]drizzle-orm['"]/,
    /from ['"]prisma['"]/,
    /from ['"]mongoose['"]/,
    /from ['"]next['"]/,
    /from ['"]astro['"]/,
];

export function scanFileImports(filePath: string): string[] {
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");
    const violations: string[] = [];

    lines.forEach((line, index) => {
        for (const pattern of FORBIDDEN_IMPORTS) {
            if (pattern.test(line)) {
                violations.push(`${filePath}:${index + 1} - Forbidden import: ${line.trim()}`);
            }
        }
    });

    return violations;
}

export function scanDirectory(dir: string): string[] {
    const allViolations: string[] = [];

    const files = globSync(`${dir}/**/*.{ts,tsx,js,jsx}`, { ignore: ["**/node_modules/**"] });

    for (const file of files) {
        const violations = scanFileImports(file);
        allViolations.push(...violations);
    }

    return allViolations;
}
```

### 3. CLI Tool (`scripts/validate.ts`)

```ts
#!/usr/bin/env node
import { scanRepository } from "./validate-stack";
import { scanDirectory } from "./scan-imports";

console.log("Validating tech stack...\n");

// Check package.json files
const pkgResult = scanRepository(process.cwd());

if (!pkgResult.valid) {
    console.error("Package.json violations:");
    pkgResult.violations.forEach((v) => console.error(`  - ${v}`));
    process.exit(1);
}

console.log("Package.json validation passed\n");

// Check imports
console.log("Scanning imports...\n");

const importViolations = [...scanDirectory("backend"), ...scanDirectory("frontend/src")];

if (importViolations.length > 0) {
    console.error("Import violations:");
    importViolations.forEach((v) => console.error(`  - ${v}`));
    process.exit(1);
}

console.log("Import validation passed\n");
console.log("Tech stack is compliant");
```

### 4. CI Integration (`.github/workflows/validate.yml`)

```yaml
name: Validate Architecture

on: [push, pull_request]

jobs:
    validate-stack:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4
            - uses: actions/setup-node@v4
              with:
                  node-version: "22"
                  cache: "npm"

            - run: npm ci --prefix backend
            - run: npm ci --prefix frontend
            - run: npm run validate:stack
```

### 5. Package.json Script

```json
{
    "scripts": {
        "validate:stack": "tsx scripts/validate.ts"
    },
    "devDependencies": {
        "glob": "^11.0.0",
        "tsx": "^4.0.0"
    }
}
```

## Violation Examples

### Forbidden Dependency

```json
{
    "dependencies": {
        "hono": "^4.0.0"
    }
}
```

### Forbidden Import

```ts
import { Hono } from "hono";
```

### Correct Usage

```json
{
    "dependencies": {
        "express": "^5.2.1",
        "sequelize": "^6.37.8"
    }
}
```

```ts
import express from "express";
```

## Expected Outputs

- List of dependencies in `backend` and `frontend`
- Violations for forbidden dependencies
- Violations for forbidden imports
- File locations for each violation
- Exit code `1` on violations
- CI-ready command examples based on npm

## Validation Checklist

- [ ] `backend/package.json` scanned
- [ ] `frontend/package.json` scanned
- [ ] Forbidden dependencies detected
- [ ] Source files scanned for forbidden imports
- [ ] Clear error messages with file locations
- [ ] Validation fails with non-zero exit code
- [ ] CI integration uses npm

## Related Skills

- `validate-import-paths` - module boundary validation
- `enforce-clean-code-principles` - code hygiene and readability
- `implement-dependency-adapter-layer` - external dependency isolation strategy
- `manage-centralized-constants` - shared config/constants governance

## Enforcement

This skill enforces the current canonical architecture and prevents accidental drift away from Express + React SPA + Sequelize/Postgres + npm.
