# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Cloudflare Workers (static assets + API) with D1 (SQLite). Plain HTML/CSS/JS, no frontend framework. Chosen by the user over Coolify and Vercel.

## Users

- **Participants:** women, mostly from the doctor's Instagram audience (San Juan, Argentina, and beyond), who are trying to conceive or dream of becoming mothers. They arrive from an Instagram link, almost always on a phone inside Instagram's in-app browser. Their job: leave their name and birth date in under a minute, and feel they joined something hopeful.
- **The doctor (owner):** a physician and influencer from San Juan who runs the campaign. Her job: collect entries without reading DMs, remove junk, close the form when she decides, and download a PDF to print.

## Product Purpose

Project name: **Bebés 2027**. A Christmas campaign: a list of women who wish to become mothers and dream of welcoming a baby during 2027.

Replace a manual process (Instagram DMs copied into a document, then printed) with a public form and a private panel. Per a popular tradition, the printed names and birth dates of women who wish to conceive are placed in the doctor's baby's Christmas sock as a symbolic way to accompany that wish. Success: participants submit easily, the doctor gets a clean printable list.

## Positioning

A personal, symbolic ritual led by one known doctor, not a service or a medical product. The page must never imply medical outcomes.

## Operating Context

- Link shared in Instagram stories/bio; heavy mobile traffic in bursts.
- The doctor closes the form manually from the panel; no public closing date.
- Output is a printed PDF (compact multi-column list) that goes physically into a baby's sock.

## Capabilities and Constraints

- Public form fields: name and birth date only.
- Public page shows the form and a participant counter, never the list.
- Admin panel behind a secret: count, list, delete entries, close/reopen, download PDF.
- Data is sensitive (name + birth date tied to a fertility wish): keep lists behind auth, show a short consent note.
- UI copy and PDF in Spanish (Argentine voseo, matching the campaign copy). Code and docs in English.
- Doctor's signature shown in the footer: `@dra.olivarescecilia` (`SIGNATURE` var).

## Brand Commitments

Name "Bebés 2027". Two campaign texts supplied by the user: the description ("Vamos a crear una lista de mujeres que desean convertirse en mamás…", ending "…el deseo más grande de Navidad no viene envuelto en papel de regalo… viene en forma de un bebé.") and the motive ("Un deseo, una esperanza, una nueva vida…"). Both live verbatim in `public/index.html`. Voice: tender, hopeful, warm, Argentine Spanish with voseo.

## Evidence on Hand

Only the campaign text. No logo, photos, or testimonials. Do not fabricate any.

## Product Principles

1. Submitting must be effortless on a phone in the Instagram browser.
2. Respect privacy: nobody but the doctor sees who joined.
3. Symbolic, never medical: no promises of pregnancy.
4. The printed list is the real deliverable; it must be legible and complete.

## Accessibility & Inclusion

Readable at phone width with large tap targets; works without JS-heavy frameworks on slow connections.
