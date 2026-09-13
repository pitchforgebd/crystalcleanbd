# Deployment — Crystal Clean Service

Target: **cPanel with Node.js (Phusion Passenger) + MySQL**, which is what the app
needs because it writes uploaded images to disk and talks to MySQL directly.

> **Not suitable for Netlify/Vercel as-is.** Those run the app on serverless
> functions with a read-only, throwaway filesystem: images uploaded from the
> admin would disappear on the next deploy. Moving to that kind of host means
> switching uploads to object storage (S3, Cloudinary, …) first.

---

## 1. What you need before starting

- cPanel with **Setup Node.js App** (Node 20 or newer) and SSH/Terminal access
- A MySQL database and user
- A mailbox for the contact form (e.g. `info@yourdomain.com`)
- The domain pointed at the hosting account

---

## 2. One-time setup

### 2.1 Create the database
cPanel → **MySQL Databases** → create a database and a user, then add the user to
the database with **ALL PRIVILEGES**. Note the three values — cPanel usually
prefixes them with your account name (`cpaneluser_...`).

### 2.2 Create the Node application
cPanel → **Setup Node.js App** → Create Application:

| Field | Value |
|---|---|
| Node.js version | 20 or newer |
| Application mode | Production |
| Application root | e.g. `crystal-clean` |
| Application URL | your domain |
| Application startup file | `server.js` |

`server.js` starts Next programmatically and listens on the port Passenger
assigns — Passenger boots a single file and will not run `npm start` for you.

### 2.3 Upload the code
Upload the repository to the application root (Git, or a zip via File Manager).
Do **not** upload `node_modules`, `.next`, or `.env`.

### 2.4 Create `.env` on the server
In the application root, create `.env` (see `.env.example` for the full list):

```env
DATABASE_URL="mysql://cpaneluser_dbuser:PASSWORD@localhost:3306/cpaneluser_dbname"

# Signs the admin session cookie. Generate a fresh one — never reuse the dev value:
#   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
AUTH_SECRET="<64 random characters>"

# The first owner account. Remove ADMIN_PASSWORD again after seeding.
ADMIN_EMAIL="you@yourdomain.com"
ADMIN_NAME="Your Name"
ADMIN_PASSWORD="<a strong password>"

# Contact form email. Leave SMTP_HOST empty to keep messages admin-only.
SMTP_HOST="mail.yourdomain.com"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER="info@yourdomain.com"
SMTP_PASSWORD="<mailbox password>"
CONTACT_FROM_EMAIL="info@yourdomain.com"
CONTACT_TO_EMAIL="info@yourdomain.com"
CONTACT_AUTOREPLY="true"

SITE_URL="https://yourdomain.com"

# Where uploaded images are stored. Point this OUTSIDE the application root so a
# redeploy can never wipe the client's photos:
UPLOAD_DIR="/home/cpaneluser/crystal-clean-uploads"
```

Then lock the file down:

```bash
chmod 600 .env
```

---

## 3. Build and start

From the application root, in cPanel Terminal (or "Run NPM Install" then the
script runner):

```bash
npm ci                     # installs dependencies and runs prisma generate
npx prisma migrate deploy  # creates/updates the tables — never use migrate dev here
npm run db:seed            # first deploy only: base content + the owner account
npm run build
```

Then press **Restart** on the Node app in cPanel (Passenger serves `server.js`).

After the first successful sign-in, delete the `ADMIN_PASSWORD` line from `.env`
and restart again — the password is already hashed in the database.

---

## 4. After deploying — check these

1. `https://yourdomain.com` loads, with images
2. `https://yourdomain.com/admin` redirects to the login page, and your account signs in
3. Admin → **Website Settings**: upload the logo, then confirm it shows on the site —
   this proves `UPLOAD_DIR` is writable and served
4. Send a message through the contact form: it appears under Admin → Contact Messages,
   and (if SMTP is set) lands in the mailbox. The Messages page states whether
   email delivery is on
5. Replace the demo content: address, email, social links, the WhatsApp number
   (it drives the floating chat button), services, testimonials, blog posts
6. Admin → **SEO**: set the canonical base to your real domain, otherwise the
   sitemap and canonical tags keep pointing at `example.com`

---

## 5. Deploying an update later

```bash
git pull                   # or re-upload the changed files
npm ci
npx prisma migrate deploy  # only needed when prisma/schema.prisma changed
npm run build
```

Then **Restart** the Node app. Do not re-run `npm run db:seed` on an existing
site: it resets seeded content such as hero slides and statistics.

Keep the `UPLOAD_DIR` folder between deploys — it holds the client's photos.

---

## 6. Troubleshooting

**"Failed to update …" on every admin save, right after a schema change**
The running server still holds the previous Prisma client. Restart the Node app
(in development: stop and restart `npm run dev`). In development the error
message now also shows the underlying cause.

**Uploaded images return 404**
`UPLOAD_DIR` is missing or not writable by the Node user. Create it and
`chmod 755`. Note that images are deliberately *not* stored in `public/` — Next
indexes that folder at build time, so anything written there at runtime is not
served.

**Contact form works but no email arrives**
Check SMTP values; cPanel mailboxes usually want port 465 with
`SMTP_SECURE="true"`. A message is always stored first, so nothing is lost while
you fix delivery. Gmail needs an App Password, not the account password.

**Admin login loops back to the login page**
`AUTH_SECRET` is missing or shorter than 32 characters, or it changed — changing
it signs everyone out.

**Passenger shows an application error**
Check the log in cPanel → Setup Node.js App, and confirm the startup file is
`server.js` and that `npm run build` finished successfully.

---

## 7. Notes on this build

- Admin routes are protected by `src/proxy.ts` (Next 16 renamed middleware to
  proxy) **and** re-checked inside every Server Action
- Roles: `owner` manages admins, storage and content; `editor` manages content only
- Admin → **Storage** lists uploaded files nothing links to, so the disk can be
  cleaned safely
- `npm run lint` and `npm run build` are the gate before every deploy
