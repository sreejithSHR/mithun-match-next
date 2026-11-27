# Mithun's Soulmate 💘

A birthday prank "compatibility dating" site for Mithun. Next.js, with applicants stored in **Neon** (Postgres).

## Run it on your PC

```
npm install
npm run dev            # http://localhost:3000
```

Without `DATABASE_URL` the applicants are kept in `data/applicants.json`, which is handy for testing.
To use Neon locally too, put the connection string in `.env.local`:

```
DATABASE_URL=postgresql://USER:PASSWORD@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require
```

The `applicants` table is created automatically on the first visit, so there's no SQL to run.

## Put it on Hostinger (Node.js)

Hostinger runs Next.js as a **Node.js app**, which needs a plan with Node.js apps (Business or Cloud web hosting, or a VPS).

1. In hPanel, add a Node.js website and connect this folder (upload it, or push it to GitHub and connect the repository).
2. Build command: `npm run build`. Start command: `npm start`. Node version: 18 or newer.
3. Add the environment variable `DATABASE_URL` with your Neon connection string (from the Neon console's "Connection string"),
   and `ADMIN_PASSWORD` with the password for the `/mate` page.
4. Deploy, then open the site. Mithun's photos are in `public/photos`, and the intro poster is `public/intro.jpg`.

If your Hostinger plan can't run Node.js apps, the same project deploys as-is to Vercel (free), with the same `DATABASE_URL`.

## Handy links

- `/?nointro`: straight to the site, skipping the torn-poster intro.
- `/mate`: Mithun's private list of everyone who applied (selfie, Instagram, city, quiz answers, score), with delete and CSV download. It asks for `ADMIN_PASSWORD`, and stays locked if that isn't set.

## Changing words and photos

Everything is in `lib/content.js`:
- the gallery captions;
- the four postcards;
- the blush photo and its date;
- the fact sheet;
- the quiz questions.
