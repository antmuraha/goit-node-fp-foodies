# goit-node-fp-foodies

## First Run

From project root:

```bash
# 1) Install dependencies
npm --prefix backend install
npm --prefix frontend install

# 2) Create backend env file
cp backend/.env.example backend/.env
```

Then edit `backend/.env` if needed (DB credentials, JWT, email settings).

## Run From Root (Backend + Frontend)

```bash
# Start database first
docker-compose -f backend/docker-compose.dev.yaml up -d postgres

# Apply database migrations
npm --prefix backend run db:migrate

# (Optional) Seed the database — SEED_PASSWORD is required
SEED_PASSWORD=ExampleSecurePassword npm --prefix backend run db:seed

# Run backend and frontend together
npx concurrently -n backend,frontend -c green,blue \
	"npm --prefix backend run dev" \
	"npm --prefix frontend run dev"
```

## Formatting And Linting (Biome)

Run checks:

```bash
# Run formatting backend and frontend together
npm --prefix backend run format && npm --prefix frontend run format

# OR
npm --prefix backend run format:check
npm --prefix frontend run format:check
```

Auto-fix formatting and lint issues:

```bash
npm --prefix backend run format
npm --prefix frontend run format
```

## Run Split (Separate Terminals)

Terminal 1 (database):

```bash
docker-compose -f backend/docker-compose.dev.yaml up -d postgres
```

Terminal 2 (backend):

```bash
npm --prefix backend run db:migrate
npm --prefix backend run dev
```

Terminal 3 (frontend):

```bash
npm --prefix frontend run dev
```

## Temporary UI Kit Page

For quick UI component previews (storybook-like), a temporary frontend page is available at:

- `http://localhost:5173/ui-kit`

This page is intended for internal development only and showcases reusable UI primitives and states.
