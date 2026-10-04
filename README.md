# oddsyy.com — pre-launch waitlist (legacy)

The landing page and waitlist for **Oddsyy**, the local task marketplace launching in Lahore.

> **Status: legacy, pre-launch only.** This site is deliberately kept separate from the Oddsyy app
> (repo `Oddsyy-App`, Firebase projects `oddsyy-app-dev` / `oddsyy-app-prod`). It shares nothing with
> the app except the brand. When the app launches it is retired — see [Retirement](#retirement).

| | |
|---|---|
| Live URL | https://oddsyy.com (and www) |
| Firebase project | `oddsyy-79` — **with** a hyphen. Not `oddsyy79` (legacy app project) |
| Firestore region | `asia-south1` |
| Stack | React 19 + Vite, plain JSX, GSAP, Firebase JS SDK (Firestore Lite, Auth for `/admin` only) |
| Pages | `/` landing + form · `/privacy` waitlist privacy notice · `/admin` staff view |

## How it works

- **Sign-up** writes one document to `waitlist/{sha256(email)}` with `name`, `email`, `role`, `created_at`.
  Using the hash of the lower-cased email as the ID makes duplicates impossible: a second sign-up with the
  same email is an update, which the rules deny, and the form shows "You're already on the list".
- **Nobody can read the waitlist from the website.** `firestore.rules` allows public *create* only.
  (Rules can't tell a count query from a full list, so the count is kept in its own document.)
- **"N people are already waiting"** is the real number from `stats/waitlist` — the only public document.
  The sign-up and `count + 1` go in one write; the rules allow the increment only if `last` names a
  sign-up that didn't exist before that write and does after it, so the count can't be inflated without
  real sign-ups. If the counter write fails, the sign-up is saved on its own (the count can only fall
  behind, never block anyone). `/admin` lowers it when deleting an entry. The page reads it with a plain
  `fetch` to the Firestore REST API, so Firebase still isn't loaded up front. It only appears once the
  real count reaches `COUNT_SHOW_FROM` in `src/config.js` (currently 1,001); below that, nothing is shown.
  It is never a placeholder number. If the count ever drifts, set `stats/waitlist.count` to the
  number of documents in `waitlist` from the Firebase console.
- **`/admin`** uses Google sign-in. Only Google accounts with a document in the private `admins`
  collection can read, export (CSV) or delete entries. There is no password in the app bundle.
- **Motion** lives in `src/lib/motion.js`: the hero builds in on load, sections and cards ease in as they
  scroll into view, the background glows drift with parallax, and Lenis smooths wheel scrolling. Hover effects
  are CSS (bottom of `src/index.css`) and use the `translate`/`scale`/`rotate` properties so they never fight
  GSAP's `transform`. With *reduce motion* switched on in the OS, all of it is off and the page is static.
- **Anti-spam:** a hidden honeypot field; strict field validation in the rules.
- **Security headers** (CSP, frame blocking, nosniff, referrer and permissions policies) are set in
  `firebase.json`.
- Firebase is loaded only when someone submits the form or opens `/admin`, so the landing page stays light
  (the count is one small REST request).

## Develop

Requires Node 22+ and Java 21+ (for the Firebase emulators).

```bash
npm ci
npm run dev:emulators   # site on http://localhost:5174 against local Firestore + Auth emulators
npm run dev             # site against the real project (needs .env.local — writes are real!)
npm run lint
npm run test:rules      # security-rules tests on the Firestore emulator
npm run build
```

`.env.local` (not committed) holds the six `VITE_FIREBASE_*` values from Firebase console →
Project settings → Your apps. `.env.emulator` (committed) holds fake values for emulator mode.

## Deploy

Push to `main`. GitHub Actions (`.github/workflows/deploy.yml`) lints, runs the rules tests and a
dependency audit, then builds and deploys **hosting and Firestore rules** together to `oddsyy-79`.
Pull requests run the checks only.

Secrets used: `VITE_FIREBASE_*` (6) and `FIREBASE_TOKEN`. When setting a secret from PowerShell use
`gh secret set NAME --body "$value"` — piping adds a byte-order mark and corrupts it.

## Admin access

1. Firebase console → `oddsyy-79` → Authentication → Sign-in method → enable **Google** (one time).
2. Firebase console → Firestore → start collection **`admins`** → add a document whose **ID is the
   staff member's Google email** (any field, e.g. `note: "founder"`). Delete the document to remove access.
   The list lives in the database rather than in `firestore.rules` because this repository is public;
   nobody can read or change it from the website.
3. Open https://oddsyy.com/admin and sign in with that Google account.

## Privacy

What is collected and why is published at `/privacy`. Deletion requests go to the address in
`src/config.js`; delete the entry from `/admin` within 7 days. Don't copy the list into other tools
except the email service used for launch invites.

## Retirement

The waitlist exists only to invite people when the app launches. After launch:

1. **Launch week:** export the CSV from `/admin`; invite Hustlers first, then Seekers, in waves.
2. **Launch + 2 weeks:** replace the form with a "Get the app" page (Play Store link) or point
   `oddsyy.com` at the app's own website on `oddsyy-app-prod` Hosting (DNS change at Hostinger).
3. **No later than 6 months after launch** (the promise on `/privacy`): delete every document in
   `waitlist` and `admins`, and delete exported CSVs.
4. Disable billing on `oddsyy-79`, delete the `FIREBASE_TOKEN` secret, and archive this repository.
