# Greenline SaaS (MVP Monorepo)

This repository contains the initial scaffolding for the Greenline SaaS platform as outlined in `comprehensive_blueprint.txt`.

- Apps:
  - `apps/api` – Node.js + TypeScript (Express) API
  - `apps/web` – React + Vite + TypeScript web app
- Packages:
  - `packages/types` – Shared TypeScript types
  - `packages/ui` – Shared UI components (minimal)

## Quick start

1. Install dependencies (workspace-aware):

```powershell
# From repo root
npm install
```

2. Start the API and Web in parallel:

```powershell
npm run dev
```

- API runs on `http://localhost:4000`
- Web runs on `http://localhost:5173`

3. Test API health:

```powershell
Invoke-WebRequest http://localhost:4000/health -UseBasicParsing | Select-Object -ExpandProperty StatusCode
```

## Environment

- `apps/api/.env` (copy from `.env.example`):
```
PORT=4000
JWT_SECRET=dev_secret_change_me
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/greenline?schema=public"
```

## Scripts

- `npm run dev` – run API and Web together
- `npm run dev:api` – run API only
- `npm run dev:web` – run Web only
- `npm run build` – build all workspaces

## Notes

- Database is optional for this MVP skeleton; Prisma schema is included for future migration.
- Pricing endpoint `/pricing/quote` is implemented using the blueprint logic.