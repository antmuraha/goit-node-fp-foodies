---
name: validate-import-paths
description: "Ensure no unauthorized cross-app imports between backend and frontend."
---

# Skill: Validate Import Paths

## Description

Validate module boundaries for the current repository layout:

- `backend/` runtime code is isolated from frontend runtime code.
- `frontend/` runtime code is isolated from backend runtime code.
- Cross-imports between `backend` and `frontend` are not allowed.

## Architectural Constraints

- **Backend isolation**: files in `backend/` must not import from `frontend/`.
- **Frontend isolation**: files in `frontend/` must not import from `backend/`.
- **No shared package layer yet**: there is no `packages/*` sharing model in this repository.
- **Communication boundary**: frontend communicates with backend over HTTP API only.
- **Enforcement**: automated scripts should fail on any cross-app import.

## Trigger Examples

- "Validate import paths"
- "Check for cross-app imports"
- "Audit module boundaries"
- "Ensure backend/frontend isolation"

## Valid vs Invalid Import Patterns

### Valid Imports

```ts
// backend/controllers/authControllers.js
import authService from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";
```

```ts
// frontend/src/app/AppRouter.tsx
import { SharedLayout } from "../widgets/layout/SharedLayout";
import { HomePage } from "../pages/home/HomePage";
```

### Invalid Imports

```ts
// frontend/src/api/client.ts
import authService from "../../../backend/services/authServices.js";
```

```ts
// backend/routes/authRouter.js
import { App } from "../../frontend/src/app";
```

## Exception Policy

No cross-app import exceptions are approved in current architecture. If type sharing is needed later, introduce a dedicated shared contract layer instead of importing runtime files across `backend` and `frontend`.

## Validation Script

```bash
#!/bin/bash
# scripts/validate-import-paths.sh

set -e

echo "=== Validating Import Paths ==="
echo ""

VIOLATIONS=0

echo "Checking frontend -> backend imports..."
FRONTEND_FILES=$(find frontend/src -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) 2>/dev/null)
for file in $FRONTEND_FILES; do
  if grep -En "from ['\"][^'\"]*backend/|require\(['\"][^'\"]*backend/" "$file" > /dev/null; then
    echo "  INVALID: $file imports backend code"
    grep -En "from ['\"][^'\"]*backend/|require\(['\"][^'\"]*backend/" "$file"
    VIOLATIONS=$((VIOLATIONS + 1))
  fi
done

echo ""
echo "Checking backend -> frontend imports..."
BACKEND_FILES=$(find backend -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) 2>/dev/null)
for file in $BACKEND_FILES; do
  if grep -En "from ['\"][^'\"]*frontend/|require\(['\"][^'\"]*frontend/" "$file" > /dev/null; then
    echo "  INVALID: $file imports frontend code"
    grep -En "from ['\"][^'\"]*frontend/|require\(['\"][^'\"]*frontend/" "$file"
    VIOLATIONS=$((VIOLATIONS + 1))
  fi
done

echo ""
echo "=== Summary ==="

if [ $VIOLATIONS -eq 0 ]; then
  echo "OK: all import paths valid"
  echo "OK: backend and frontend are isolated"
  exit 0
else
  echo "ERROR: Found $VIOLATIONS violations"
  echo ""
  echo "Fix Instructions:"
  echo "1. Remove runtime cross-imports between backend and frontend"
  echo "2. Keep backend imports inside backend/*"
  echo "3. Keep frontend imports inside frontend/src/*"
  echo "4. Use HTTP API calls for frontend-backend communication"
  exit 1
fi
```

## TypeScript Validation Script

```ts
// scripts/validate-import-paths.ts
import { readFileSync } from "fs";
import { glob } from "glob";

interface ImportViolation {
    file: string;
    line: number;
    importPath: string;
    reason: string;
}

const violations: ImportViolation[] = [];

function isCrossBoundaryImport(importPath: string, currentFile: string): boolean {
    if (!importPath.startsWith(".")) return false;

    if (currentFile.startsWith("frontend/") && importPath.includes("backend/")) {
        return true;
    }

    if (currentFile.startsWith("backend/") && importPath.includes("frontend/")) {
        return true;
    }

    return false;
}

function checkFile(filePath: string) {
    const content = readFileSync(filePath, "utf-8");
    const importPattern = /import\s+(?:type\s+)?[^;]*from\s+['\"]([^'\"]+)['\"]/g;

    let match;
    while ((match = importPattern.exec(content)) !== null) {
        const importPath = match[1];

        if (isCrossBoundaryImport(importPath, filePath)) {
            const lineNumber = content.substring(0, match.index).split("\n").length;
            violations.push({
                file: filePath,
                line: lineNumber,
                importPath,
                reason: "Cross-app runtime import detected",
            });
        }
    }
}

async function validateImportPaths() {
    console.log("\n=== Validating Import Paths ===\n");

    const files = await glob("{backend,frontend/src}/**/*.{ts,tsx,js,jsx}", {
        ignore: ["**/node_modules/**", "**/dist/**", "**/build/**"],
    });

    files.forEach(checkFile);

    if (violations.length === 0) {
        console.log("OK: No cross-app imports detected");
        console.log("OK: All import paths valid\n");
        return;
    }

    console.log(`ERROR: Found ${violations.length} invalid imports:\n`);
    for (const violation of violations) {
        console.log(`${violation.file}:${violation.line} -> ${violation.importPath}`);
        console.log(`  ${violation.reason}`);
    }

    process.exit(1);
}

validateImportPaths().catch(console.error);
```

## Optional ESLint Rule

```js
// .eslintrc.js
module.exports = {
    rules: {
        "no-restricted-imports": [
            "error",
            {
                patterns: [
                    {
                        group: ["../**/backend/**", "../../**/backend/**", "../../../**/backend/**"],
                        message: "Frontend must not import backend runtime modules.",
                    },
                    {
                        group: ["../**/frontend/**", "../../**/frontend/**", "../../../**/frontend/**"],
                        message: "Backend must not import frontend runtime modules.",
                    },
                ],
            },
        ],
    },
};
```

## Implementation Steps

1. Identify runtime boundaries (`backend/` server, `frontend/src/` client).
2. Scan for cross-imports (`frontend` -> `backend` and `backend` -> `frontend`).
3. Report file and line-level violations.
4. Add script in `package.json` for local and CI execution.
5. Fix violations by moving to API communication boundaries.

## Expected Outputs

- No runtime backend/frontend cross-imports detected
- Clear file/line output for each violation
- Non-zero exit code when violations are found
- Script suitable for CI usage

## Validation Checklist

- [ ] No imports from `backend/*` in frontend runtime files
- [ ] No imports from `frontend/*` in backend runtime files
- [ ] Script scans both app roots
- [ ] Errors include exact file locations
- [ ] CI can block on violations

## Related Skills

- `validate-tech-stack` - stack policy validation
- `enforce-clean-code-principles` - code cohesion and boundaries
- `implement-dependency-adapter-layer` - boundary-safe integration design
- `manage-centralized-constants` - shared config and literals governance
