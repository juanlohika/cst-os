# Workflow: Build CST OS

## Objective
Build the CST OS platform module by module, following the spec in `docs/cst-os-spec.md`.

## Inputs Required
- Spec doc: `docs/cst-os-spec.md`
- API key: stored in `cst-os/apps/api/.env`

## Project Location
`/Users/tarkielester/Documents/cst-apps/cst-os/`

## Tech Stack
- Frontend: `apps/web` — Next.js 14, TypeScript, Tailwind, shadcn/ui
- Backend: `apps/api` — NestJS, TypeScript, Prisma ORM
- DB: PostgreSQL (Cloud SQL in prod, local docker in dev)
- AI: Anthropic Claude API via `src/shared/ai/`

## Build Order (Phase 1 MVP)

### Step 1: Database
- [ ] Finalize Prisma schema (`apps/api/prisma/schema.prisma`)
- [ ] Run `prisma migrate dev` once local DB is ready
- [ ] Seed initial data (roles, default AI app entries)

### Step 2: Backend — Core Modules
1. `users` module — CRUD, Google OAuth user sync, role management
2. `clients` module — CRUD, health score calculation
3. `projects` module — CRUD, phase management, template support
4. `tasks` module — CRUD, Kanban/list views, time logging
5. `audit` module — middleware that logs all changes automatically
6. `notifications` module — in-app + email via WebSocket + BullMQ

### Step 3: AI Infrastructure
- [ ] `AiModule` — already scaffolded at `src/shared/ai/`
- [ ] `ai-apps` module — CRUD for AI App registry
- [ ] `ai-skills` module — Skills registry
- [ ] First AI App: BRD Maker with full CLAUDE.md instruction

### Step 4: Frontend
- [ ] shadcn/ui setup
- [ ] NextAuth with Google OAuth (domain restriction)
- [ ] Layout: sidebar nav + top bar + global search (Cmd+K)
- [ ] Module pages: Clients, Projects, Tasks, BRD

### Step 5: Google Integrations
- [ ] Google Docs API — create BRD from template
- [ ] Google Drive — folder structure per client/project

## Key Files
- Spec: `docs/cst-os-spec.md`
- Schema: `apps/api/prisma/schema.prisma`
- AI Service: `apps/api/src/shared/ai/`
- Env (API): `apps/api/.env`
- Env (Web): `apps/web/.env.local`

## Notes
- Each NestJS module goes in `apps/api/src/modules/[name]/`
- Each module must have: controller, service, DTOs, Prisma queries
- Swagger auto-docs at `/api/docs` (already configured in main.ts)
- The Comment model uses a polymorphic pattern — entityType + entityId at app level
- BullMQ handles async AI jobs (transcript processing, BRD generation)
