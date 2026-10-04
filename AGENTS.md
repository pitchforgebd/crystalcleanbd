<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

- Install dependencies with `npm ci`. The `postinstall` script runs `prisma generate`. `.npmrc` sets `include=dev` so the Prisma CLI, TypeScript, and `tsx` are installed.
- MySQL 8 is part of the environment. systemd is not running in this VM; start the database with `sudo service mysql start` and wait until `sudo mysqladmin --protocol=socket ping` succeeds.
- Local database URL, matching `.env.example`: `mysql://root:@127.0.0.1:3306/crystal_clean`. The boot script creates that database and a passwordless `root` account for `127.0.0.1`.
- When `.env` is missing, the boot script writes `AUTH_SECRET`, `ADMIN_EMAIL=admin@example.com`, and a generated `ADMIN_PASSWORD`. Sign in at `/admin/login` with those values. Do not commit `.env`.
- Apply migrations with `npx prisma migrate deploy`. `npm run db:migrate` runs interactive `prisma migrate dev`.
- `npx prisma db seed` is safe to re-run. It replaces contact messages with the sample set.
- Dev server: `npm run dev` on port 3000. The environment start script launches it after MySQL, migrations, and seed.
- Checks: `npm run lint`, `npx tsc --noEmit`, `npm run build`.
- SMTP is optional. Contact submissions are stored when `SMTP_HOST` is unset.
