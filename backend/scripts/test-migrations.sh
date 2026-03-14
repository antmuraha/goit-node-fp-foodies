#!/usr/bin/env bash
# test-migrations.sh — Verify all recipe-domain migrations can be applied,
# rolled back, and re-applied without errors (idempotency check).
#
# Usage (from the repo root):
#   bash backend/scripts/test-migrations.sh
#
# Or from the backend/ directory:
#   bash scripts/test-migrations.sh
#
# Prerequisites:
#   - PostgreSQL is reachable (Docker Compose stack is up)
#   - backend/.env is populated with valid DB credentials

set -euo pipefail

# ── helpers ──────────────────────────────────────────────────────────────────

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RESET='\033[0m'

pass() { echo -e "${GREEN}PASS${RESET} $*"; }
fail() { echo -e "${RED}FAIL${RESET} $*"; exit 1; }
info() { echo -e "${BLUE}>>${RESET} $*"; }
warn() { echo -e "${YELLOW}WARN${RESET} $*"; }

# ── resolve paths ─────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$BACKEND_DIR"

# ── expected tables (in apply order) ─────────────────────────────────────────

EXPECTED_TABLES=(
  "categories"
  "users"
  "areas"
  "ingredients"
  "testimonials"
  "recipes"
  "recipeIngredients"
  "recipeAreas"
  "favorites"
  "follows"
)

# ── load .env ─────────────────────────────────────────────────────────────────

info "Loading environment from .env ..."
if [[ ! -f ".env" ]]; then
  fail ".env file not found in $BACKEND_DIR. Copy .env.example and fill in your credentials."
fi

# Source .env, stripping Windows CR characters if present
set -a
while IFS= read -r line || [[ -n "$line" ]]; do
  line="${line%$'\r'}"
  [[ "$line" =~ ^[[:space:]]*# ]] && continue
  [[ -z "$line" ]] && continue
  export "$line" 2>/dev/null || true
done < .env
set +a

DB_NAME="${POSTGRES_DB:-postgres}"
DB_USER="${POSTGRES_USER:-postgres}"

# Detect postgres container name from running containers
PG_CONTAINER=$(docker ps --filter "ancestor=postgres" --format "{{.Names}}" 2>/dev/null | head -1)
if [[ -z "$PG_CONTAINER" ]]; then
  PG_CONTAINER=$(docker ps --format "{{.Names}}" 2>/dev/null | grep -i postgres | head -1)
fi
if [[ -z "$PG_CONTAINER" ]]; then
  fail "No running PostgreSQL container found. Start it with: docker-compose -f docker-compose.dev.yaml up -d"
fi

info "Using PostgreSQL container: $PG_CONTAINER"

# ── helper: run SQL via docker exec ──────────────────────────────────────────

run_sql() {
  docker exec -e PGPASSWORD="${POSTGRES_PASSWORD:-postgres}" "$PG_CONTAINER" \
    psql -U "$DB_USER" -d "$DB_NAME" -tAc "$1" 2>/dev/null
}

table_exists() {
  local tbl="$1"
  run_sql "SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='$tbl';" \
    | grep -q 1
}

# ── DB connectivity check ─────────────────────────────────────────────────────

info "Checking PostgreSQL connectivity ..."
run_sql "SELECT 1;" > /dev/null \
  || fail "Cannot connect to PostgreSQL inside container '$PG_CONTAINER'."
pass "PostgreSQL is reachable."

# ── PHASE 1: apply all migrations ────────────────────────────────────────────

echo ""
info "=============================================="
info "PHASE 1: Apply all migrations"
info "=============================================="

npm run db:migrate
pass "db:migrate completed successfully."

echo ""
info "Migration status after apply:"
npm run db:migrate:status 2>/dev/null || warn "db:migrate:status not available; skipping."

echo ""
info "Verifying all expected tables exist ..."
for tbl in "${EXPECTED_TABLES[@]}"; do
  if table_exists "$tbl"; then
    pass "  Table '$tbl' exists."
  else
    fail "  Table '$tbl' is MISSING after migration."
  fi
done

# ── PHASE 2: undo all migrations one by one ───────────────────────────────────

echo ""
info "=============================================="
info "PHASE 2: Roll back all migrations (one by one)"
info "=============================================="

MIGRATION_COUNT=${#EXPECTED_TABLES[@]}
info "Rolling back $MIGRATION_COUNT migrations ..."

for i in $(seq 1 "$MIGRATION_COUNT"); do
  info "  Undo step $i ..."
  npm run db:migrate:undo
done

pass "All $MIGRATION_COUNT migrations rolled back."

echo ""
info "Verifying all tables have been dropped ..."
ORPHAN_FOUND=false
for tbl in "${EXPECTED_TABLES[@]}"; do
  if table_exists "$tbl"; then
    warn "  Orphaned table '$tbl' still exists after full rollback!"
    ORPHAN_FOUND=true
  else
    pass "  Table '$tbl' correctly dropped."
  fi
done

if [[ "$ORPHAN_FOUND" == "true" ]]; then
  fail "Orphaned tables detected after full rollback."
fi

# ── PHASE 3: idempotency — re-apply all migrations ───────────────────────────

echo ""
info "=============================================="
info "PHASE 3: Idempotency - re-apply all migrations"
info "=============================================="

npm run db:migrate
pass "db:migrate re-applied successfully (idempotency confirmed)."

echo ""
info "Verifying all expected tables exist again ..."
for tbl in "${EXPECTED_TABLES[@]}"; do
  if table_exists "$tbl"; then
    pass "  Table '$tbl' exists."
  else
    fail "  Table '$tbl' is MISSING after re-apply."
  fi
done

# ── PHASE 4: PostgreSQL sequence validation ───────────────────────────────────

echo ""
info "=============================================="
info "PHASE 4: PostgreSQL sequence validation"
info "=============================================="

SEQUENCES=$(run_sql "SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema='public';")

if [[ -n "$SEQUENCES" ]]; then
  while IFS= read -r seq; do
    [[ -z "$seq" ]] && continue
    pass "  Sequence '$seq' present."
  done <<< "$SEQUENCES"
else
  warn "No sequences found (may indicate auto-increment columns were not created)."
fi

# ── Summary ───────────────────────────────────────────────────────────────────

echo ""
echo -e "${GREEN}=============================================="
echo -e "  All migration rollback tests PASSED!"
echo -e "==============================================${RESET}"
