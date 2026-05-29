# College Compass

College Compass is a full-stack React + Express app for exploring, comparing, and predicting college admissions.

## Requirements
- Node.js 22+
- npm 10+

## Quick start (local)
```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173` and proxies API calls to the SSR server.

## Production build
```bash
npm run build
npm start
```

## Environment variables
Copy `env.example` to `.env` and set the values that match your deployment:

- `VITE_PUBLIC_URL` – Public site URL used for canonical/OG tags (e.g. `https://college.example.com`)
- `VITE_API_URL` – Public API base URL (e.g. `https://college.example.com/api`)
- `PUBLIC_URL` / `SITE_URL` – Server-side base URL used for sitemap/robots
- `BETTER_AUTH_SECRET` – Secret for BetterAuth (when auth is enabled)

## Assets
Local placeholder images live in `public/images`. Replace them with your own assets using the same paths.

## Deployment
See [DEPLOYMENT.md](./DEPLOYMENT.md) for Railway, Docker, and self-hosted instructions.
