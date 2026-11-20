# Bebés 2027

Public form where women who wish to become mothers in 2027 leave their name and birth date, plus a private panel for the organizer to review entries, close the form and download a printable PDF.

- **Public page** `/` — form + participant counter. The list is never public.
- **Admin panel** `/admin` — password login, list/search/delete entries, close/reopen the form, download PDF (generated in the browser, A4, 3 columns, alphabetical).

## Stack

Cloudflare Workers (static assets + `/api/*`) and D1 (SQLite). Plain HTML/CSS/JS. PDF built client-side with `pdf-lib` + `fontkit` and an embedded Figtree font.

```
src/domain.ts    validation, name normalization, date formatting (pure)
src/auth.ts      signed admin session cookie, constant-time password check
src/worker.ts    HTTP routes
public/          static site (index, admin, pdf.js, fonts)
migrations/      D1 schema
test/            node --test suites (domain rules, 5,000-entry PDF)
```

## Local development

```sh
npm install
cp .dev.vars.example .dev.vars   # then set ADMIN_PASSWORD and SESSION_SECRET
npm run dev                      # vendors pdf libs, migrates local D1, starts wrangler on :8787
npm test
```

## Deploy

Production runs on **Cloudflare Pages** (classic) at https://bebes-2027.pages.dev. The Worker in `src/worker.ts` is bundled as Pages advanced-mode `_worker.js`; config lives in `pages/wrangler.jsonc`.

```sh
npx wrangler login                 # OAuth; unset CLOUDFLARE_API_TOKEN if it lacks D1 permissions
npm run db:migrate:remote          # apply new migrations to the shared D1 database
npm run deploy:pages               # build pages/dist and deploy to the production branch (main)
# secrets (once): cd pages && npx wrangler pages secret put ADMIN_PASSWORD --project-name bebes-2027
#                 cd pages && npx wrangler pages secret put SESSION_SECRET --project-name bebes-2027
```

Secrets take effect on the next deployment. The root `wrangler.jsonc` still deploys the same code as a Worker (`npm run deploy`, `*.workers.dev`); it shares the D1 database.

## Behavior notes

- Duplicates (same name ignoring case/accents + same birth date) are accepted silently and not stored twice.
- Names accept Latin letters only (accents, ñ, ü included) so every name prints with the embedded font.
- Abuse protection: hidden honeypot field, per-IP throttle (40 submissions / 10 min; generous because mobile carriers share IPs), salted IP hashes only.
- Closing the form is enforced server-side; the public page switches to a "closed" message.
