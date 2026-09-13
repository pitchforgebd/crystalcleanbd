# Crystal Clean Service — Cursor AI Project Rules

## Included
- `PROJECT_SPEC.md` — complete project requirements and phases
- `TASK_STATE.md` — lightweight phase state
- `.cursor/rules/` — modular Cursor Agent rules

## Usage
Copy this package into the root of the Crystal Clean Service project.

The expected structure:

```text
project-root/
├── .cursor/
│   └── rules/
├── PROJECT_SPEC.md
├── TASK_STATE.md
└── ...
```

Then open the project in Cursor.

## Recommended first prompt

Read `PROJECT_SPEC.md`, `TASK_STATE.md`, and the applicable `.cursor/rules/*.mdc` rules.

Do not start coding yet. Confirm the current project state and wait for my explicit Phase 1 instruction.

## Important
The rules are intentionally modular so Cursor can load relevant guidance without keeping one huge rules file in context.

## Phase 2 — Database

The project now reads from MySQL via Prisma. Mocks have been removed.

### Environment

`.env` (committed for local development only):

```
DATABASE_URL="mysql://root:@127.0.0.1:3306/crystal_clean"
```

`.env.example` documents every variable: database, admin auth, contact-form SMTP and the
upload folder.

### Scripts

- `npm run db:generate` — regenerate the Prisma client
- `npm run db:migrate`  — `prisma migrate dev` (interactive)
- `npm run db:seed`     — `prisma db seed` (idempotent — uses upsert by unique key)
- `npm run db:reset`    — `prisma migrate reset --force` (dev only)
- `npm run start:cpanel` — production start through `server.js` (what Passenger runs)

On the server, migrations are applied with `npx prisma migrate deploy` — never `migrate dev`.

### Data layer

- Schema: `prisma/schema.prisma` — 20+ models, all `utf8mb4`, cuid string PKs (auto-increment for singleton rows)
- Seed: `prisma/seed.ts` — reads the prior mock content and upserts it; safe to re-run
- Repository (read): `src/lib/repository/*.ts` — typed functions returning the existing domain types from `src/lib/types.ts`
- Server Actions (write): `src/server/actions/*.ts` — every action validates with zod, calls Prisma, and `revalidatePath`s affected routes
- Validation: `src/server/validation/*.ts` — one zod schema per module

### Auth

Sessions are an HMAC-signed, httpOnly cookie; passwords are hashed with scrypt. `src/proxy.ts`
keeps unauthenticated visitors out of `/admin/*`, and every Server Action re-checks with
`requireAdmin()` / `requireOwner()` — route protection alone is not enough, because actions
are ordinary HTTP endpoints. Roles: `owner` (admins, storage, content) and `editor` (content).

### Deploying

See [DEPLOYMENT.md](./DEPLOYMENT.md) — cPanel + Node (Passenger) with MySQL, including the
`.env` template, build commands and a post-deploy checklist.

The app writes uploaded images to `UPLOAD_DIR` on disk, so a serverless host (Netlify,
Vercel) would lose them on every deploy unless uploads are moved to object storage first.
