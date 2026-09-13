# Crystal Clean Service — Task State

Current Phase: Phase 9 — storage cleanup (COMPLETE) + full end-to-end verification

Status: 12 public pages, 21 admin pages and every save flow verified in a real browser

Completed:
- Project specification created
- Cursor rules created
- Phase 1: Client Frontend (public site + mock data)
- Phase 1B: Admin Dashboard Frontend (mock/static)
  - Separated public site into `(public)` route group
  - Admin shell (sidebar, topbar, responsive)
  - Mock login page (`/admin/login`)
  - Dashboard overview
  - Modules: Settings, Homepage, Hero Slides, Services, Statistics, Testimonials, Clients, Gallery Images/Videos, Blog Categories/Posts, FAQ, Contact Messages, SEO, Our Concern, Legal Pages, Account
  - Local-state CRUD demos with confirmation before delete
  - Clear demo banners (no database writes)
- Phase 2: Backend & Database
  - Prisma 6 + MySQL (Laragon local); schema for 20+ content tables
  - Idempotent seed script reading previous mock content
  - Typed repository layer (`src/lib/repository/`) — every public read goes through it
  - Server Actions (`src/server/actions/`) for every admin write module, validated by zod
  - Public pages migrated from mock data to repository
  - Admin services page is the Phase 2 canary — full CRUD via Server Actions
  - All other admin pages read from DB; writes still use local state (Phase 4)
  - `useServerAction` hook + `MockModeBanner` for the in-between pages
  - Static `adminNav` and `roleLabels` (not CMS-managed)
  - Mocks deleted (`src/data/mock.ts`, `src/data/admin-mock.ts`)
  - Minimal `sitemap.xml` and `robots.txt` route handlers
  - 49 routes build successfully; lint clean

Verification:
- `npm run lint` — pass
- `npm run build` — pass (49 routes: 16 admin, 12 public, sitemap, robots, dynamic blog & service slugs)
- `npm run db:seed` — idempotent (re-runs without duplicating)

Phase 3 — Admin authentication (done):
- scrypt password hashing via node:crypto (`src/lib/auth/password.ts`) — no native deps
- HMAC-signed, httpOnly, SameSite=Lax session cookie, 7-day expiry (`src/lib/auth/session.ts`)
- `proxy.ts` (Next 16 renamed middleware → proxy) redirects unauthenticated /admin/* to the
  login page with `?next=`, and bounces signed-in users away from /admin/login. It also
  forwards `x-admin-path` so the admin layout can guard without a redirect loop
- `requireAdmin()` / `requireOwner()` in `src/lib/auth/current.ts`; all 46 write actions are
  guarded (Server Actions are public endpoints — route protection alone is not enough)
- Seed creates/updates the owner from ADMIN_EMAIL / ADMIN_NAME / ADMIN_PASSWORD
- Real sign-in/sign-out UI; AdminShell shows who is signed in

Public contact form (done):
- `submitContactMessage()` writes to ContactMessage — zod validation, hidden honeypot field,
  per-IP rate limit (`src/server/rate-limit.ts`, 5 per 10 min, single-process)

Phase 4 — admin writes (done):
- Every admin module calls its Server Action: settings, homepage, hero-slides, statistics,
  testimonials, clients, gallery images/videos, blog categories/posts, faq, messages, seo,
  concern, legal, account (services was already wired as the Phase 2 canary)
- `useAdminCrud` in AdminActions.tsx carries the shared list-CRUD wiring (rows in sync with
  create/update/delete, one feedback line, pending state)
- Homepage sections: toggle + move up/down, saved immediately, screen rolls back on failure
- Messages: status changes and a new `deleteMessage` action, plus a reply-by-email link
- Account: new `updateOwnProfile` / `changeOwnPassword` actions (current password verified
  before the hash is replaced)
- `HomepageSection` now carries `key` so the admin can address rows the way the action expects
- Mock helpers deleted: `useMockSave`, `MockModeBanner`, `Phase2Banner`, `DemoBanner`

Phase 5 — contact email (done):
- `src/server/email.ts` (nodemailer): notification to the business with Reply-To set to the
  visitor and an "Open in admin" link, plus an optional auto-acknowledgement to the visitor
- Fully optional: with SMTP_HOST/CONTACT_TO_EMAIL unset the site works exactly as before and
  messages are still stored. Delivery failures never fail the visitor's submission —
  verified by submitting with the SMTP server switched off
- 8s connect/greeting/socket timeouts so a stalled mail host cannot hold the request open
- The admin Messages page states whether notifications are on and where they go

Phase 6 — media uploads (done):
- `POST /api/admin/upload` behind requireAdmin(): 5 MB cap, magic-byte type sniffing
  (JPG/PNG/GIF/WEBP only — SVG excluded because it can carry script), original filename
  slugified plus a random suffix so URLs are unguessable and cacheable forever
- Files live in `UPLOAD_DIR` (default `./uploads`), NOT in `public/`: Next builds the list
  of public assets at build time, so runtime writes there are served as 404 (verified).
  `/uploads/[...path]` streams them back with the right content type, immutable caching and
  path-traversal protection
- `ImageField` (upload button, drag & drop, preview, remove, paste-a-URL fallback) is wired
  into services, hero slides, gallery images, testimonials, clients, blog posts and concern.
  Blog posts and services previously had NO image field at all
- Image validation now accepts a site-relative path as well as an absolute URL
  (`imageSource` in `src/server/validation/shared.ts`) — the old `z.string().url()` rejected
  every uploaded file
- The paste-a-URL box is type="text", not type="url": a url input fails HTML5 validation on
  `/uploads/...` and silently blocks the whole form from submitting

Phase 7 — About page + branding (done):
- New `/admin/about` module. `updateAboutContent` already existed but had NO editor, so the
  public About page could not be changed at all: story, mission, vision, proprietor message,
  values, "why choose us" and the three photos are now editable
- Site logo, footer logo and favicon are CMS-managed. The three `*Label` columns were
  repurposed as URLs with Prisma `@map`, so the migration only widens columns — no data loss
  (migration `20260912095313_site_logo_urls`)
- `BrandLogo` takes an optional CMS image and falls back to the bundled file; Navbar, Footer
  and the admin shell pass it through
- `src/app/favicon.ico` was deleted: the file convention always beat `metadata.icons`, so the
  CMS favicon could never take effect

Phase 8 — admin users (done):
- `/admin/users` (owner-only): list, create, edit, delete admins and set someone's password
- `createAdmin` / `updateAdmin` / `resetAdminPassword` / `deleteAdmin` all behind
  `requireOwner()`, with guards that cannot be bypassed from the UI:
  you cannot delete your own account, and the last owner can be neither deleted nor demoted
- The nav entry is hidden from editors and the page itself refuses them; editors keep full
  access to content modules
- Fixed: the Account page used `getAdminAccount()`, which returned the FIRST row in the
  table rather than the signed-in admin — with more than one admin it showed (and let you
  edit) the wrong profile. It now reads the session. The misleading helper was deleted

Phase 9 — storage cleanup (done):
- `/admin/storage` (owner-only): how many files are stored, total size, and the list of files
  nothing links to, with previews and per-file checkboxes
- `scanStorage()` reads every content table and matches `/uploads/...` anywhere in the row
  JSON — not just in image columns — so a path pasted inside blog copy or a JSON array still
  counts as "in use"
- Files newer than GRACE_HOURS (24) are held back, so an image uploaded while a form is still
  being filled in cannot be swept away
- `deleteOrphanUploads` recomputes the orphan list server-side instead of trusting the
  browser's list, so a stale page cannot delete a file that is now in use

Deployment preparation (done):
- Removed the stale Netlify setup: `netlify.toml` still said `publish = "out"` from the
  Phase 1 static export, which this app no longer produces, and the 6.8 MB `out/` folder was
  left over. `@netlify/plugin-nextjs` uninstalled
- Added `server.js` — cPanel's Setup Node.js App (Passenger) boots a single startup file and
  will not run `npm start`. Verified by serving the production build through it: pages,
  the /admin redirect and uploaded images all work
- `DEPLOYMENT.md`: cPanel + MySQL steps, `.env` template, build/migrate commands, a
  post-deploy checklist and troubleshooting
- README no longer points at `npm run db:remote` / `REMOTE_DATABASE_URL` (neither exists) and
  its "auth deferral" section was replaced with how auth actually works
- Demo content is intentionally left in place — the client will edit it from the admin

Logo sizing (done):
- `mainLogoHeight` / `footerLogoHeight` columns (migration `20260912143227_logo_sizes`,
  additive, defaults 32 and 40) drive the rendered logo height in pixels
- `LogoSize` control in Settings: slider + number box + live preview (the footer preview sits
  on the footer's blue so the size can be judged against the real background)
- `BrandLogo` takes an optional height; the width stays automatic so proportions hold. When a
  height is set it replaces the old fixed `h-7/h-8` classes, and the footer's hardcoded
  `h-9 md:h-10` was removed so it no longer fights the CMS value
- Clamped 16–160 px in the UI and again in the zod schema, so a stray number cannot break the
  header layout

Social links are now editable:
- The Settings page listed them read-only even though create/update/delete actions existed.
  `AdminSocialLinks` adds the full editor (platform picker with matching icon, label, URL,
  edit and delete) in its own card — outside the settings form, because HTML forms cannot
  nest and each link saves on its own
- Verified end to end: add, rename, public top bar picks it up, delete

Verification sweep + fixes:
- All 12 public pages and all 21 admin pages load; settings/statistics/faq/about/homepage
  saves all confirmed against MySQL
- Reported bug "Save failed: Failed to update site settings" was a STALE DEV SERVER: the
  process started 13:40, the Prisma client was regenerated at 15:53 by the logo migration,
  so the running server still knew `mainLogoLabel` and rejected `mainLogo`. Reproduced on
  the dev server and confirmed working on a fresh build. Fix: restart `npm run dev` after a
  schema change
- Every action now reports the underlying cause in development through
  `src/server/action-error.ts` (55 handlers) — a bare "Failed to update …" gave the person
  at the keyboard nothing to work with
- Fixed a React hydration error on /admin/messages: `toLocaleString()` renders differently
  on the server and in the browser. `formatDateTime()` in `src/lib/utils.ts` is
  locale-independent; the storage page had the same latent bug

Known Issues:
- `npm audit` reports 3 high advisories inside prisma's dev dependency chain (deepmerge-ts),
  unrelated to the app bundle

Recent polish:
- Phase 2 backend integration across public + admin
- Public header now has a contact/social top bar above the navbar (folds away on scroll)
- Homepage hero slider replaced by a static `HeroSpotlight` (CMS hero slide 1 drives the copy,
  slide images form the circular cluster, service quick-finder routes into the catalog)
- Homepage video section rebuilt as `VideoShowcase` — featured player + playlist rail,
  YouTube poster facades so no iframe loads until the visitor presses play
- Brand palette: `--brand` #109cf6 and `--brand-deep` #0157bd, both used as SOLID colours —
  no gradients anywhere in the brand system (only image scrims and the shine sweep remain).
  Deep #0157bd: primary buttons, page hero, popular services, video section, footer, top bar.
  Primary #109cf6: CTA panels, hero headline, header rule, icons, links, active states.
- Base element rules (`a`, `body`, `img`, …) moved into `@layer base`. They were unlayered,
  which beats EVERY layer — so `a { color: inherit }` was overriding `.btn-*` text colours
  on every link button (white-on-white ghost buttons, dark-on-blue primary). Layer order is
  now base < components < utilities
- Native <select> in the hero finder replaced by `SelectMenu` — an accessible listbox
  (arrow keys / Home / End / Enter / Escape, outside-click close, focus return) that can
  actually be styled; the finder card needs `z-30` because framer-motion's animated
  siblings create stacking contexts that would paint over the open menu
- `/services` category chips were decorative spans; now `ServiceCatalog` filters for real
  (chips with counts + search box + live result count + empty state)
- PageHero/CTA surfaces are solid brand blue, so their actions use `ghost`/`outline`
  (never the blue `primary`, which vanished into the background)
- Custom component classes moved into `@layer components` — Tailwind utilities can now
  override `.btn`/`.section-space` etc. (previously unlayered CSS silently beat them,
  which is why button usages needed `!important` and `hidden` did not work on `.btn`)
- Buttons rebuilt as solid fills with explicit text colours and a border that always
  matches the fill (no transparent ring); `.btn-outline` added for coloured surfaces.
  Every button pair measures >= 5.9:1 contrast
- Section audit fixes: leftover teal wash in ServicesOverview, doubled top margin on the
  featured slider, stray divider lines in the statistics grid, square gallery tiles,
  marquee edge fades replaced by a background-proof mask, hardcoded concern name in the
  CTA, vague "More" blog label, and the collapsed top bar no longer holds keyboard focus

Next (Phase 4 — wire each admin module to its existing Server Action):
settings, homepage, hero-slides, statistics, testimonials, clients, gallery images/videos,
blog categories/posts, faq, messages, seo, concern, legal, account
