# College Compass - Deployment Guide

This is a full-stack application with React frontend, Express.js backend, and server-side rendering (SSR). This guide explains how to deploy it.

## Quick Start

### Local Development
```bash
npm install
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

## Deployment Options

### Option 1: Railway.app (Recommended for Simplicity)

1. Create a Railway account at https://railway.app
2. Connect your GitHub repository
3. Configure environment variables in Railway dashboard:
   - `VITE_APP_NAME`
   - `VITE_PUBLIC_URL` (your Railway domain)
   - `VITE_API_URL` (same as VITE_PUBLIC_URL + /api)
   - `NODE_ENV=production`
   - Database URL if needed

4. Deploy button or connect GitHub for automatic deployment

### Option 2: Docker-based Deployment (Render, Fly.io, etc.)

Using the included `Dockerfile`:

```bash
# Local testing with Docker Compose
docker-compose up

# Or deploy to your hosting platform:
# - Render.com: Connect GitHub repo, it will detect Dockerfile
# - Fly.io: `flyctl deploy`
# - Any Docker-compatible platform
```

### Option 3: Vercel (with limitations)

Vercel can host this, but requires configuration for Node.js backend:
1. Push code to GitHub
2. Create Vercel project
3. Add environment variables
4. Set "Output Directory" to `dist`

**Note**: Vercel's free tier has limitations for long-running processes. For production, Railway or Render is recommended.

### Option 4: Heroku

1. Create a `Procfile` (already included):
   ```
   web: npm start
   ```

2. Deploy:
   ```bash
   heroku create college-compass
   heroku config:set NODE_ENV=production
   git push heroku main
   ```

### Option 5: Self-hosted (VPS, AWS EC2, DigitalOcean, etc.)

1. Set up Node.js 22+ on your server
2. Clone repository:
   ```bash
   git clone <your-repo>
   cd college-compass
   ```

3. Install dependencies and build:
   ```bash
   npm ci
   npm run build
   ```

4. Set environment variables in `.env`

5. Start with PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start "npm start" --name "college-compass"
   pm2 save
   ```

6. Configure reverse proxy (Nginx/Apache)

## Environment Variables

Create a `.env` file based on `env.example`:

```bash
# Application URLs
VITE_APP_NAME=College Compass
VITE_PUBLIC_URL=https://your-domain.com
VITE_API_URL=https://your-domain.com/api

# Server
NODE_ENV=production
PORT=3000

# Database (if using)
DATABASE_URL=mysql://user:pass@host/dbname

# Features
VITE_ENABLE_SSR=true
VITE_SHOW_DEV_TOOLS=false
```

## Database Setup

If your app uses a database, configure it before deployment:

1. Create database on your hosting platform
2. Set `DATABASE_URL` environment variable
3. Run migrations (if any)

## Monitoring & Logs

- **Railway**: View logs in dashboard
- **Render**: Real-time logs in dashboard
- **Fly.io**: Use `fly logs` command
- **Self-hosted**: Check PM2 logs with `pm2 logs`

## Performance Tips

1. The build has large chunks. Consider code-splitting for better performance
2. Enable compression in your server/reverse proxy
3. Set up CDN for static assets (if behind a CDN)
4. Monitor bundle size and optimize if needed

## Common Issues

### Build fails with "out of memory"
```bash
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

### Port already in use
```bash
# Change port
PORT=8080 npm start
```

### Database connection errors
- Verify DATABASE_URL is correct
- Ensure database is running and accessible
- Check firewall rules if using remote database

## Support

For deployment-specific issues:
- Railway support: https://docs.railway.app
- Render support: https://render.com/docs
- Fly.io support: https://fly.io/docs
- Heroku support: https://devcenter.heroku.com
