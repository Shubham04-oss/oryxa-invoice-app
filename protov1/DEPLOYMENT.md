# Oryxa Deployment Guide

## 🚀 Quick Deployment (15 minutes)

### Prerequisites Completed
Ensure you've completed all steps in the main README's "Prerequisites & Setup Checklist" section.

---

## 1. Deploy API to Vercel

### Via CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
cd apps/api
vercel link

# Set environment variables
vercel env add DATABASE_URL production
vercel env add JWT_SECRET production
vercel env add B2_ACCESS_KEY production
vercel env add B2_SECRET_KEY production
vercel env add B2_BUCKET production
vercel env add S3_ENDPOINT production
vercel env add SENDGRID_API_KEY production
vercel env add SENDGRID_SENDER production
vercel env add WHATSAPP_PHONE_ID production
vercel env add WHATSAPP_ACCESS_TOKEN production
# ... add all other env vars

# Deploy to production
vercel --prod
```

### Via Vercel Dashboard
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Set root directory to `apps/api`
4. Add environment variables in Settings → Environment Variables
5. Deploy

**API URL**: `https://your-project.vercel.app/api`

---

## 2. Deploy Worker to Render

### Via Dashboard
1. Go to [render.com/dashboard](https://dashboard.render.com)
2. Click "New +" → "Background Worker"
3. Connect your GitHub repository
4. Settings:
   - **Name**: oryxa-worker
   - **Environment**: Node
   - **Build Command**: `npm install && cd worker && npm install`
   - **Start Command**: `node worker/index.js`
   - **Plan**: Free (or Starter $7/month)

5. Add environment variables:
   ```
   DATABASE_URL
   B2_ACCESS_KEY
   B2_SECRET_KEY
   B2_BUCKET
   S3_ENDPOINT
   SENDGRID_API_KEY
   SENDGRID_SENDER
   WHATSAPP_PHONE_ID
   WHATSAPP_ACCESS_TOKEN
   NODE_ENV=production
   ```

6. Click "Create Background Worker"

### Via render.yaml (Infrastructure as Code)
Create `render.yaml` in project root:
```yaml
services:
  - type: worker
    name: oryxa-worker
    env: node
    buildCommand: npm install && cd worker && npm install
    startCommand: node worker/index.js
    envVars:
      - key: DATABASE_URL
        sync: false
      - key: NODE_ENV
        value: production
```

Deploy:
```bash
# Install Render CLI
brew tap render-oss/render
brew install render

# Login and deploy
render login
render deploy
```

---

## 3. Deploy Landing Page to Hostinger

### Via FTP (Automated)
```bash
cd apps/landing
chmod +x deploy.sh
./deploy.sh
```

### Via Hostinger File Manager
1. Login to Hostinger control panel
2. Go to Files → File Manager
3. Navigate to `public_html/`
4. Upload `index.html` from `apps/landing/`
5. Visit your domain: `https://yourdomain.com`

### Via FTP Client (FileZilla/Cyberduck)
1. Open FTP client
2. Connect with credentials:
   - Host: `ftp.yourdomain.com`
   - Username: Your FTP username
   - Password: Your FTP password
3. Upload `apps/landing/index.html` to `public_html/`

**Landing Page URL**: `https://yourdomain.com`

---

## 4. Run Database Migrations

```bash
# From project root
npx prisma migrate deploy
```

Or set up automatic migrations on Render:
```yaml
# In render.yaml, add:
- type: web
  name: oryxa-migrations
  env: node
  buildCommand: npm install
  startCommand: npx prisma migrate deploy && echo "Migrations complete"
  plan: free
```

---

## 5. Set Up GitHub Actions CI/CD

The workflow is already configured in `.github/workflows/deploy.yml`.

**Required GitHub Secrets**:
1. Go to your GitHub repo → Settings → Secrets and variables → Actions
2. Add the following secrets:

```
VERCEL_TOKEN (from vercel.com/account/tokens)
VERCEL_ORG_ID (from .vercel/project.json after `vercel link`)
VERCEL_PROJECT_ID (from .vercel/project.json)
RENDER_API_KEY (from render.com/dashboard → Account Settings → API Keys)
RENDER_SERVICE_ID (from Render service URL)
FTP_HOST (Hostinger FTP host)
FTP_USER (Hostinger FTP username)
FTP_PASSWORD (Hostinger FTP password)
FTP_PATH (/public_html)
```

Now every push to `main` branch will automatically deploy all services.

---

## 6. Configure Custom Domain

### Vercel (API)
1. Vercel Dashboard → Your Project → Settings → Domains
2. Add domain: `api.yourdomain.com`
3. Add DNS record in your domain registrar:
   ```
   Type: CNAME
   Name: api
   Value: cname.vercel-dns.com
   ```

### Render (Worker - Optional)
Workers don't need public domains, but if you add a health check endpoint:
1. Render Dashboard → Your Worker → Settings → Add Health Check Path
2. Path: `/health` (implement in worker)

### Hostinger (Landing Page)
1. Hostinger → Domains → Point domain to your hosting
2. DNS records should be:
   ```
   Type: A
   Name: @
   Value: Your Hostinger IP
   ```

---

## 7. Verify Deployment

### Test API
```bash
# Health check
curl https://your-api-domain.vercel.app/api/health

# Create test invoice (replace YOUR_TOKEN)
curl -X POST https://your-api-domain.vercel.app/api/invoices \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "clientName": "Test Client",
    "clientEmail": "test@example.com",
    "items": [{"description": "Test", "quantity": 1, "unitPrice": 100, "taxRate": 0}],
    "dueDate": "2025-12-01",
    "currency": "USD"
  }'
```

### Check Worker Logs
```bash
# Render CLI
render logs -s oryxa-worker

# Or in Render dashboard → Logs tab
```

### Test Landing Page
Visit: `https://yourdomain.com`

---

## 8. Set Up Monitoring (Optional but Recommended)

### Sentry (Error Tracking)
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

Add to `apps/api/sentry.server.config.js`:
```js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Uptime Monitoring
1. Sign up: [uptimerobot.com](https://uptimerobot.com) (free)
2. Add monitor:
   - Type: HTTPS
   - URL: `https://your-api-domain.vercel.app/api/health`
   - Interval: 5 minutes

---

## 9. Backups

### Database Backups (Supabase)
- Automatic daily backups on Pro plan
- Manual backup: Settings → Database → Backups → Download

### Database Backups (Neon)
- Point-in-time restore up to 7 days (free tier)
- Manual export:
  ```bash
  pg_dump $DATABASE_URL > backup.sql
  ```

### Storage Backups (Backblaze B2)
- Enable versioning in bucket settings
- Lifecycle rules to keep versions for 30 days

---

## 10. Post-Deployment Checklist

- [ ] API responding at `/api/health`
- [ ] Database migrations applied
- [ ] Worker processing jobs (check logs)
- [ ] Landing page accessible
- [ ] Custom domains configured
- [ ] SSL certificates active (auto via Vercel/Hostinger)
- [ ] Environment variables set in all services
- [ ] GitHub Actions workflow passing
- [ ] Monitoring/alerts configured
- [ ] Backups enabled
- [ ] Rate limiting active
- [ ] CORS configured for production domains
- [ ] Security headers enabled (check with securityheaders.com)

---

## Troubleshooting

### API 500 Error
- Check Vercel logs: `vercel logs`
- Verify all environment variables are set
- Check DATABASE_URL is accessible from Vercel

### Worker Not Processing Jobs
- Check Render logs for errors
- Verify DATABASE_URL connection
- Ensure Redis/queue is accessible
- Check environment variables

### PDF Generation Failing
- Verify B2_ACCESS_KEY and B2_SECRET_KEY
- Check S3_ENDPOINT is correct
- Test storage upload manually

### Email Not Sending
- Verify SENDGRID_API_KEY is valid
- Check SendGrid sender verification
- Review SendGrid activity logs

### WhatsApp Not Sending
- Verify WHATSAPP_ACCESS_TOKEN is valid
- Check Meta Business API rate limits
- Ensure phone number format is correct (+1234567890)

---

## Rollback Procedure

### Vercel
```bash
vercel rollback [deployment-url]
```

### Render
- Dashboard → Deployments → Redeploy previous version

### Database (if migration failed)
```bash
npx prisma migrate resolve --rolled-back [migration-name]
```

---

## Scaling Checklist

When you hit 100+ users:
- [ ] Upgrade Vercel to Pro ($20/month)
- [ ] Upgrade Render worker to paid ($7/month)
- [ ] Add Upstash Redis for queue ($10/month)
- [ ] Enable database connection pooling
- [ ] Add CDN for PDFs (Cloudflare R2)
- [ ] Implement read replicas for database
- [ ] Set up load testing (k6/Artillery)

---

## Cost Summary After Deployment

| Service | Free Tier | Paid (Initial) |
|---------|-----------|----------------|
| Vercel | 100GB/month | $20/month (Pro) |
| Render | 750 hrs/month | $7/month (Starter) |
| Hostinger | N/A | $5/month |
| Supabase | 500MB DB | $25/month (Pro) |
| Backblaze B2 | 10GB storage | $0.50/month (50GB) |
| SendGrid | 100 emails/day | $20/month (40k emails) |
| Domain | N/A | $12/year |
| **TOTAL** | **$0-20/month** | **$80-100/month** |

---

## Support

- **Documentation**: [docs.oryxa.com](https://docs.oryxa.com)
- **Issues**: [github.com/your-username/oryxa/issues](https://github.com/your-username/oryxa/issues)
- **Email**: support@oryxa.com
- **Discord**: [discord.gg/oryxa](https://discord.gg/oryxa)
