# Thabrez — Tax Consulting Platform

> **Turborepo monorepo** containing the marketing site, client portal, admin console, and backend API for Thabrez Tax Consulting.

---

## Repository Structure

```
thabrez/
├── apps/
│   ├── web/       Next.js 15 — public marketing site + auth-gated client portal  → :3000
│   ├── admin/     Next.js 15 — staff/CA management console                       → :3001
│   └── api/       NestJS 11  — REST API, business logic, background jobs         → :4000
│
├── packages/
│   ├── ui/        Shared shadcn/ui component library (Button, Card, Badge, …)
│   ├── db/        Prisma schema + generated client — single source of truth for the data model
│   ├── types/     Shared TypeScript enums, interfaces, and Zod DTOs
│   └── config/    Shared ESLint, TypeScript, and Tailwind configs
│
├── infra/
│   ├── docker-compose.yml   Local Postgres 16 + Redis 7
│   └── dev.mjs              Dev launcher — starts Docker, then all three apps
│
├── turbo.json               Turborepo pipeline config
├── pnpm-workspace.yaml      pnpm workspace definition
├── .env.example             All required environment variables (safe placeholder values)
└── README.md
```

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | ≥ 20 | [nodejs.org](https://nodejs.org) |
| pnpm | ≥ 9 | `npm install -g pnpm` |
| Docker Desktop | latest | [docker.com](https://www.docker.com/products/docker-desktop/) |

---

## Getting Started

### 1 · Clone the repository

```bash
git clone <repo-url> thabrez
cd thabrez
```

### 2 · Copy and fill in environment variables

```bash
cp .env.example .env
```

Open `.env` and update at minimum:

| Variable | What to set |
|---|---|
| `DATABASE_URL` | Leave as-is if using the default docker-compose credentials |
| `REDIS_URL` | Leave as-is if using the default docker-compose Redis |
| `NEXTAUTH_SECRET` | Run `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` |
| `NEXTAUTH_URL` | `http://localhost:3000` for local dev |
| `S3_*` | Leave as placeholder until Phase 2 (document uploads) |
| `RAZORPAY_*` | Leave as placeholder until Phase 4 (payments) |
| `RESEND_API_KEY` | Leave as placeholder until Phase 4 (email) |
| `MSG91_API_KEY` | Leave as placeholder until Phase 4 (SMS/WhatsApp) |

### 3 · Install dependencies

```bash
npm install -g pnpm   # skip if pnpm is already installed
pnpm install
```

### 4 · Start the databases

```bash
# Start Postgres 16 + Redis 7 in the background
pnpm infra:up

# Verify both containers are healthy
docker ps
```

### 5 · Set up the database schema

```bash
# Generate the Prisma client from schema.prisma
pnpm db:generate

# Apply the schema to the local database (creates all tables)
pnpm db:migrate
```

### 6 · Run all three apps

```bash
pnpm dev
```

This single command:
1. Checks that Docker is running and starts containers if not already up
2. Waits for Postgres and Redis to be healthy
3. Launches all three apps concurrently via Turborepo

| App | URL | Description |
|-----|-----|-------------|
| `web` | http://localhost:3000 | Marketing site + client portal |
| `admin` | http://localhost:3001 | Staff/CA management console |
| `api` | http://localhost:4000/api/v1 | REST API |
| `api/health` | http://localhost:4000/api/v1/health | Health check |

> **Tip:** Press `Ctrl+C` to stop all apps. Containers keep running in the background.

---

## Available Scripts

### Development

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Docker + all apps (recommended) |
| `pnpm turbo:dev` | Start only apps (assumes Docker already running) |
| `pnpm build` | Production build for all apps |
| `pnpm type-check` | TypeScript check across all packages |
| `pnpm lint` | ESLint across all packages |
| `pnpm lint:fix` | ESLint with auto-fix |
| `pnpm format` | Prettier format all files |
| `pnpm test` | Run tests across all packages |

### Infrastructure

| Command | Description |
|---------|-------------|
| `pnpm infra:up` | Start Postgres + Redis in the background |
| `pnpm infra:down` | Stop containers (data preserved) |
| `pnpm infra:reset` | Stop containers and **wipe all data** |
| `pnpm infra:logs` | Tail container logs |

### Database

| Command | Description |
|---------|-------------|
| `pnpm db:generate` | Regenerate Prisma client after schema changes |
| `pnpm db:migrate` | Create and apply a new migration |
| `pnpm db:push` | Push schema without a migration (dev only) |
| `pnpm db:studio` | Open Prisma Studio (visual DB browser) |
| `pnpm db:seed` | Seed the database with sample data |

---

## Environment Variables Reference

See [`.env.example`](.env.example) for the full list with comments.

| Group | Variables |
|-------|-----------|
| **Database** | `DATABASE_URL` |
| **Redis** | `REDIS_URL` |
| **API** | `PORT`, `NODE_ENV`, `CORS_ORIGINS` |
| **Auth** | `NEXTAUTH_SECRET`, `NEXTAUTH_URL` |
| **Storage** | `S3_ENDPOINT`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`, `S3_BUCKET` |
| **Payments** | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` |
| **Email** | `RESEND_API_KEY`, `EMAIL_FROM` |
| **SMS/WhatsApp** | `MSG91_API_KEY`, `MSG91_SENDER_ID`, `MSG91_TEMPLATE_ID` |

---

## Data Model

The full Prisma schema lives at [`packages/db/prisma/schema.prisma`](packages/db/prisma/schema.prisma).

| Model | Purpose |
|-------|---------|
| `User` | Platform user — Client / Associate / Senior CA / Admin |
| `Client` | Client profile — PAN, GSTIN, entity type, assigned CA |
| `Case` | Filing / service case — the primary unit of work |
| `Document` | S3 document metadata (binary stored in S3, never in DB) |
| `Deadline` | Compliance deadline — auto-generated per client |
| `Invoice` | Invoice + Razorpay payment tracking |
| `Message` | Per-case threaded messaging |
| `Lead` | Inbound marketing leads |
| `BlogPost` | Staff-authored blog content |
| `Resource` | Acts, rules, forms, and circulars |
| `AuditLog` | Immutable audit trail — append-only, never deleted |

---

## Design System

Brand palette: **deep navy blue + warm gold** — communicates trust and authority.

CSS design tokens live in [`packages/ui/src/globals.css`](packages/ui/src/globals.css).
Shared Tailwind config is in [`packages/config/tailwind/base.ts`](packages/config/tailwind/base.ts).

Import shared components in any app:

```tsx
import { Button, Card, Badge } from '@thabrez/ui';
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router, TypeScript) |
| Styling | Tailwind CSS 3 + shadcn/ui |
| Backend | NestJS 11 (TypeScript) |
| Database | PostgreSQL 16 (Prisma ORM) |
| Queue | Redis 7 + BullMQ (Phase 4) |
| Auth | Auth.js / NextAuth (Phase 2) |
| Storage | S3-compatible (Phase 2) |
| Payments | Razorpay (Phase 4) |
| Email | Resend (Phase 4) |
| SMS/WhatsApp | MSG91 (Phase 4) |
| Monorepo | Turborepo + pnpm workspaces |

---

## Build Phases

| Phase | Scope | Status |
|-------|-------|--------|
| **Scaffold** | Monorepo structure, all configs, shared packages, Docker infra | ✅ Done |
| **Phase 1** | Marketing site, calculators, lead capture | 🔜 Next |
| **Phase 2** | Client portal — auth, document uploads, case tracker | 🔜 Planned |
| **Phase 3** | Admin console — CRM, case management, deadline engine | 🔜 Planned |
| **Phase 4** | Billing, Razorpay, WhatsApp/SMS, email automation | 🔜 Planned |
| **Phase 5** | Audit hardening, DPDP Act compliance, e-signature | 🔜 Planned |

---

## Security Notes

- **MFA** required for Staff/Admin accounts (Phase 2)
- **RBAC**: clients are restricted to their own rows at the Prisma middleware layer — not just UI
- **Document binaries** are stored in S3 — never in the database
- **`AuditLog`** is append-only — no `UPDATE` or `DELETE` queries ever run against it
- **DPDP Act 2023**: consent capture required on all public lead-capture forms
- **Backups**: configure automated daily snapshots for the production database

---

*Built with ❤️ for Thabrez Tax Consulting.*
