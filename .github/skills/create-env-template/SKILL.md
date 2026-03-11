---
name: create-env-template
description: "Create or update backend/frontend .env.example files with documented variables used by this project."
---

# Skill: Create Env Template

## Description

Create or update environment variable templates for the current architecture:

- `backend/.env.example`
- `frontend/.env.example`

Templates must reflect real variables used by source code and docker infrastructure, with safe placeholders only.

## Architectural Constraints

- **Canonical location**: app-level templates (`backend/.env.example`, `frontend/.env.example`)
- **Format**: `KEY=value` with concise comments for non-obvious variables
- **Security**: never commit real credentials or secrets
- **Consistency**: keys must match runtime usage in code and compose config
- **Compatibility**: preserve existing keys used by current code paths

## Trigger Examples

- "Create .env.example files"
- "Document environment variables"
- "Update env templates"
- "Sync env docs with code"

## Current Canonical Variables

### Backend (`backend/.env.example`)

```bash
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
# POSTGRES_SSL=true

# PgAdmin
PGADMIN_DEFAULT_EMAIL=admin@admin.com
PGADMIN_DEFAULT_PASSWORD=admin
PGADMIN_DEFAULT_PORT=5050

# Seeder users (current compatibility keys)
SEED_USER_STARTER_EMAIL=test-starter@example.com
SEED_USER_STARTER_PASSWORD=starter-test-password
SEED_USER_PRO_EMAIL=test-pro@example.com
SEED_USER_PRO_PASSWORD=pro-test-password
SEED_USER_BUSINEES_EMAIL=test-business@example.com
SEED_USER_BUSINEES_PASSWORD=business-test-password

# API runtime
APP_PORT=3000
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=24h

# Email verification
EMAIL_SERVICE_HOST=smtp.ukr.net
EMAIL_SERVICE_PORT=465
EMAIL_SERVICE_USER=your-email@ukr.net
EMAIL_SERVICE_PASSWORD=your-app-password
BASE_API_URL=http://localhost:3000/api
```

### Frontend (`frontend/.env.example`)

```bash
VITE_API_URL=http://localhost:3000/api
```

## Migration Note: Typo Compatibility

The project currently uses:

- `SEED_USER_BUSINEES_EMAIL`
- `SEED_USER_BUSINEES_PASSWORD`

Recommended migration path:

1. Add corrected keys (`SEED_USER_BUSINESS_*`) in code with fallback to current keys.
2. Update templates to include both old and new keys during transition.
3. Remove legacy keys only after all environments are migrated.

## Implementation Steps

1. Collect variables from runtime usage.

```bash
rg "process\.env\.[A-Z0-9_]+" backend
rg "import\.meta\.env\.[A-Z0-9_]+" frontend/src
```

2. Collect compose-driven variables.

```bash
rg "\$\{[A-Z0-9_]+\}" backend/docker-compose.dev.yaml
```

3. Update `backend/.env.example` and `frontend/.env.example` to include all required keys.
4. Use safe placeholders only.
5. Keep comments brief and focused on operational meaning.

## Validation Commands

```bash
# Variables used by backend runtime
rg "process\.env\.[A-Z0-9_]+" backend | sort -u

# Variables used by frontend runtime
rg "import\.meta\.env\.[A-Z0-9_]+" frontend/src | sort -u

# Variables referenced by compose
rg "\$\{[A-Z0-9_]+\}" backend/docker-compose.dev.yaml | sort -u
```

## Expected Outputs

- Updated `backend/.env.example` with DB/auth/email/seed/infra vars
- Updated `frontend/.env.example` with public frontend vars
- No real credentials committed
- Variable names aligned with runtime code and compose

## Validation Checklist

- [ ] `backend/.env.example` exists and is current
- [ ] `frontend/.env.example` exists and is current
- [ ] Backend `process.env.*` keys are documented
- [ ] Frontend `import.meta.env.*` keys are documented
- [ ] Compose-required keys are documented
- [ ] Secrets use placeholders only
- [ ] Typo compatibility note for `SEED_USER_BUSINEES_*` is preserved

## Related Skills

- `validate-tech-stack` - architecture and dependency compliance
- `manage-centralized-constants` - env key centralization strategy
- `enforce-clean-code-principles` - consistency and maintainability
