# 🔑 ORYXA Setup Checklist - All Keys & URLs Required

This is your **complete checklist** of every external service you need to register for and every key/URL you need to configure before running Oryxa.

---

## ⚡ Quick Summary

You need to sign up for **8 external services** and configure **30+ environment variables**.

**Time estimate**: 1-2 hours for all registrations  
**Cost**: Most have free tiers (total: $0-6/month initially)

---

## 📋 Step-by-Step Setup Guide

### ✅ Step 1: Database (PostgreSQL)

**Choose ONE option:**

#### Option A: Supabase (Recommended - Easiest)
- **Website**: https://supabase.com/
- **Sign up**: Free (500MB database, 2GB bandwidth)
- **What to get**:
  - `DATABASE_URL` - PostgreSQL connection string
  
**Steps:**
1. Go to https://supabase.com/ → Sign up (use GitHub)
2. Create new project → Choose region → Set database password
3. Wait 2-3 minutes for provisioning
4. Go to **Settings** → **Database** → Copy **Connection String (URI)**
5. Replace `[YOUR-PASSWORD]` in the URL with your database password

**Format**: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

---

#### Option B: Neon (Alternative)
- **Website**: https://neon.tech/
- **Sign up**: Free (512MB storage)
- **What to get**: Same `DATABASE_URL`

---

#### Option C: Local (For Development Only)
- **Requirement**: Docker installed
- **Command**: `docker-compose up -d`
- **URL**: `postgresql://postgres:postgres@localhost:5432/oryxa`
- **Note**: Data lost when container stops

---

### ✅ Step 2: JWT Secret (Required for Auth)

**No signup needed** - Just generate a random string

**What to get**:
- `JWT_SECRET` - Random 32+ character string

**Steps:**
```bash
# Option 1: Using OpenSSL (Mac/Linux)
openssl rand -base64 32

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Option 3: Manual - Just type random characters
# Example: aB3$xP9!mQ2@nK5#wE8%tR1^yU4&iO7*
```

**Copy the output** and use it as your `JWT_SECRET`

---

### ✅ Step 3: File Storage (Backblaze B2)

**For storing invoice PDFs**

- **Website**: https://www.backblaze.com/b2/sign-up.html
- **Sign up**: Free (10GB storage, 1GB/day download)
- **What to get**:
  - `B2_ACCOUNT_ID`
  - `B2_APPLICATION_KEY`
  - `B2_BUCKET_NAME`
  - `B2_REGION`
  - `B2_ENDPOINT`

**Steps:**
1. Sign up at https://www.backblaze.com/b2/sign-up.html
2. Verify email → Log in
3. Go to **App Keys** → Create new key
   - Key Name: "oryxa-production"
   - Allow access to: All buckets
   - Copy `keyID` → This is your `B2_ACCOUNT_ID`
   - Copy `applicationKey` → This is your `B2_APPLICATION_KEY` (shown only once!)
4. Go to **Buckets** → Create bucket
   - Bucket Name: "oryxa-invoices" → This is your `B2_BUCKET_NAME`
   - Files: Private
   - Encryption: Disable (or enable if you want)
   - Region: Choose nearest (e.g., us-west-004) → This is your `B2_REGION`
5. Endpoint format: `https://s3.{region}.backblazeb2.com`
   - Example: `https://s3.us-west-004.backblazeb2.com`

---

### ✅ Step 4: Email Service (SendGrid)

**For sending invoice emails**

- **Website**: https://signup.sendgrid.com/
- **Sign up**: Free (100 emails/day forever)
- **What to get**:
  - `SENDGRID_API_KEY`
  - `SENDGRID_FROM_EMAIL`
  - `SENDGRID_FROM_NAME`

**Steps:**
1. Sign up at https://signup.sendgrid.com/
2. Complete verification (email + optional phone)
3. Skip "Add your first sender" (do next step)
4. Go to **Settings** → **Sender Authentication** → **Verify a Single Sender**
   - Fill your email (e.g., noreply@yourdomain.com or your Gmail)
   - Verify email → This becomes your `SENDGRID_FROM_EMAIL`
   - Your name/company → This is `SENDGRID_FROM_NAME`
5. Go to **Settings** → **API Keys** → Create API Key
   - Name: "oryxa-production"
   - Permissions: Full Access
   - Copy the key (shown only once!) → This is `SENDGRID_API_KEY`

**Note**: Starts with `SG.` like `SG.abc123xyz...`

---

### ✅ Step 5: WhatsApp Business API (Optional but Recommended)

**Choose ONE option:**

#### Option A: Meta WhatsApp Business API (Free, More Features)

- **Website**: https://developers.facebook.com/
- **Sign up**: Free (1,000 conversations/month)
- **What to get**:
  - `WHATSAPP_PHONE_NUMBER_ID`
  - `WHATSAPP_ACCESS_TOKEN`
  - `WHATSAPP_BUSINESS_ACCOUNT_ID`
  - `WHATSAPP_WEBHOOK_VERIFY_TOKEN`

**Steps:**
1. Go to https://developers.facebook.com/ → Log in with Facebook
2. Create app → Type: Business → Name: "Oryxa"
3. Add product: **WhatsApp** → Set up
4. Get test number (or connect your own):
   - Test number provided → Copy `Phone number ID` → This is `WHATSAPP_PHONE_NUMBER_ID`
5. Generate access token:
   - Click **Generate Token** → Copy → This is `WHATSAPP_ACCESS_TOKEN` (24hr token)
   - For permanent token: Go to **Business Settings** → **System Users** → Create → Generate token
6. Copy Business Account ID from dashboard → This is `WHATSAPP_BUSINESS_ACCOUNT_ID`
7. Webhook verify token: Make up any random string (e.g., "oryxa_webhook_123") → This is `WHATSAPP_WEBHOOK_VERIFY_TOKEN`

**Important**: For production, you need a verified Business Manager account (takes 1-2 weeks)

---

#### Option B: Twilio (Easier Setup, Paid)

- **Website**: https://www.twilio.com/try-twilio
- **Sign up**: Free trial ($15 credit)
- **What to get**:
  - `TWILIO_ACCOUNT_SID`
  - `TWILIO_AUTH_TOKEN`
  - `TWILIO_WHATSAPP_FROM`

**Steps:**
1. Sign up at https://www.twilio.com/try-twilio
2. Verify phone number
3. Dashboard shows:
   - Account SID → This is `TWILIO_ACCOUNT_SID`
   - Auth Token → This is `TWILIO_AUTH_TOKEN`
4. Go to **Messaging** → **Try it out** → **Send a WhatsApp message**
5. Use Twilio Sandbox number → Format: `whatsapp:+14155238886` → This is `TWILIO_WHATSAPP_FROM`

**Note**: Production requires approved WhatsApp Business Profile (~$25/month after trial)

---

#### Option C: Skip WhatsApp (Email Only)

If you don't need WhatsApp, leave these blank:
```bash
WHATSAPP_PROVIDER=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_ACCESS_TOKEN=
# ... etc
```

---

### ✅ Step 6: Deployment Platform - API (Vercel)

**For hosting your Next.js API routes**

- **Website**: https://vercel.com/signup
- **Sign up**: Free (100GB bandwidth, serverless functions)
- **What to get**: 
  - Vercel account (no keys needed for now)
  - You'll deploy via CLI: `npm i -g vercel && vercel`

**Steps:**
1. Go to https://vercel.com/signup → Sign up with GitHub
2. That's it! You'll deploy later with `vercel` command

**For deployment**: See `DEPLOYMENT.md` section 1

---

### ✅ Step 7: Deployment Platform - Worker (Render or Railway)

**For hosting your background worker process**

#### Option A: Render (Recommended)

- **Website**: https://dashboard.render.com/register
- **Sign up**: Free tier (750 hours/month)
- **What to get**: Render account (deploy via dashboard)

**Steps:**
1. Sign up at https://dashboard.render.com/register
2. Connect GitHub account
3. You'll deploy later from dashboard

---

#### Option B: Railway

- **Website**: https://railway.app/
- **Sign up**: Free trial ($5 credit)
- **What to get**: Railway account

---

### ✅ Step 8: Landing Page Hosting (Hostinger)

**For your static marketing site**

- **Website**: https://www.hostinger.com/
- **Sign up**: Paid (~$2-5/month for shared hosting)
- **What to get**: 
  - FTP credentials (host, username, password)
  - Or use their file manager

**Steps:**
1. Buy hosting plan (cheapest shared hosting is fine)
2. Get FTP details from control panel
3. Upload `apps/landing/index.html` via FTP or file manager

**Alternative (Free)**: Use Netlify, Vercel, or GitHub Pages for landing page instead

---

## 📝 Complete `.env` Configuration Template

Now copy this to your `.env` file and fill in the values:

```bash
# ============================================
# DATABASE
# ============================================
DATABASE_URL="postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres"

# ============================================
# AUTHENTICATION (Required)
# ============================================
JWT_SECRET="YOUR_RANDOM_32_CHAR_STRING_HERE"
JWT_EXPIRES_IN="7d"

# ============================================
# FILE STORAGE - Backblaze B2 (Required for PDFs)
# ============================================
B2_ACCOUNT_ID="your_b2_account_id"
B2_APPLICATION_KEY="your_b2_application_key"
B2_BUCKET_NAME="oryxa-invoices"
B2_REGION="us-west-004"
B2_ENDPOINT="https://s3.us-west-004.backblazeb2.com"

# ============================================
# EMAIL - SendGrid (Required)
# ============================================
SENDGRID_API_KEY="SG.your_sendgrid_api_key_here"
SENDGRID_FROM_EMAIL="noreply@yourdomain.com"
SENDGRID_FROM_NAME="Oryxa Invoices"

# ============================================
# WHATSAPP - Meta (Option A - Free)
# ============================================
WHATSAPP_PROVIDER="meta"
WHATSAPP_PHONE_NUMBER_ID="123456789012345"
WHATSAPP_ACCESS_TOKEN="EAAxxxxxxxxxxxxx"
WHATSAPP_BUSINESS_ACCOUNT_ID="987654321098765"
WHATSAPP_WEBHOOK_VERIFY_TOKEN="your_random_verify_token"

# ============================================
# WHATSAPP - Twilio (Option B - Paid)
# ============================================
# WHATSAPP_PROVIDER="twilio"
# TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxx"
# TWILIO_AUTH_TOKEN="your_twilio_auth_token"
# TWILIO_WHATSAPP_FROM="whatsapp:+14155238886"

# ============================================
# REDIS/UPSTASH (Optional - for production queue)
# ============================================
# REDIS_URL="redis://localhost:6379"
# Or Upstash:
# REDIS_URL="rediss://default:password@region.upstash.io:6379"

# ============================================
# APPLICATION SETTINGS
# ============================================
NODE_ENV="development"
PORT=3000

# ============================================
# API URLs (for email links, WhatsApp links)
# ============================================
API_BASE_URL="http://localhost:3000"
# In production: "https://api.yourdomain.com"

FRONTEND_BASE_URL="http://localhost:3000"
# In production: "https://app.yourdomain.com"
```

---

## 🎯 Minimal Setup (MVP - Start with These)

If you want to start **quickly** with just basic features:

### Required (4 items):
1. ✅ **DATABASE_URL** - Supabase (free, 5 minutes)
2. ✅ **JWT_SECRET** - Generate random string (30 seconds)
3. ✅ **SENDGRID_API_KEY** - SendGrid (free, 10 minutes)
4. ✅ **B2 Keys** - Backblaze (free, 10 minutes)

### Optional (add later):
- WhatsApp (for SMS notifications)
- Redis (for production queue)
- Deployment platforms (when ready to deploy)

**With just these 4**, you can:
- ✅ Create invoices
- ✅ Generate PDFs
- ✅ Send emails
- ✅ Run automations
- ✅ Full local development

---

## 🚀 Setup Order (Recommended)

Do them in this order for smoothest experience:

1. **JWT_SECRET** (30 seconds) - No signup, just generate
2. **Database** (5 min) - Supabase signup + get URL
3. **SendGrid** (10 min) - Email signup + API key
4. **Backblaze** (10 min) - Storage signup + create bucket
5. **WhatsApp** (20 min) - Optional, can skip for now
6. **Deployment** (later) - When ready to go live

**Total time**: ~25 minutes for MVP, ~45 minutes for full setup

---

## ✅ Verification Checklist

After filling `.env`, verify you have:

```bash
# Check your .env file has these filled:
□ DATABASE_URL starts with "postgresql://"
□ JWT_SECRET is 32+ characters random string
□ B2_ACCOUNT_ID is alphanumeric
□ B2_APPLICATION_KEY is long alphanumeric string
□ B2_BUCKET_NAME matches your bucket
□ B2_ENDPOINT starts with "https://s3."
□ SENDGRID_API_KEY starts with "SG."
□ SENDGRID_FROM_EMAIL is valid email
□ WHATSAPP_PROVIDER is "meta" or "twilio" (or blank to skip)

# Optional but recommended:
□ WHATSAPP_ACCESS_TOKEN (if using WhatsApp)
□ WHATSAPP_PHONE_NUMBER_ID (if using Meta)
□ REDIS_URL (if using Redis queue)
```

---

## 🧪 Test Your Configuration

After setup, test each service:

```bash
# 1. Test database connection
npx prisma db push

# 2. Test API
npm run dev
curl http://localhost:3000/api/health

# 3. Test SendGrid (from worker)
# Create an invoice → It will queue email job

# 4. Test Backblaze (from worker)
# Invoice creation triggers PDF generation

# 5. Test WhatsApp (if configured)
# POST /api/invoices/:id/send with channel=whatsapp
```

---

## 💡 Pro Tips

1. **Use a password manager** (1Password, Bitwarden) to store all these keys
2. **Never commit `.env`** to Git (already in .gitignore)
3. **Different keys for dev/prod** - Create separate accounts/keys for production
4. **Rotate keys regularly** - Especially JWT_SECRET and API keys
5. **Monitor usage** - Check SendGrid, Backblaze dashboards for quota usage

---

## 🆘 Troubleshooting

### "Database connection failed"
- Check `DATABASE_URL` format
- Ensure password has no special characters (or URL-encode them)
- Test: `npx prisma db pull`

### "SendGrid API error"
- Verify sender email is verified in SendGrid dashboard
- Check API key starts with `SG.`
- Test: Try sending test email from SendGrid dashboard

### "B2 upload failed"
- Verify bucket name matches exactly
- Check endpoint region matches bucket region
- Ensure bucket is "Private" not "Public"

### "WhatsApp not sending"
- Meta: Check token hasn't expired (24hr test tokens)
- Twilio: Verify phone number is added to sandbox
- Check webhook verify token matches in `.env` and Meta dashboard

---

## 📚 Next Steps

After completing this checklist:

1. ✅ Run `npm install`
2. ✅ Copy `.env.example` to `.env` and fill with your keys
3. ✅ Run `docker-compose up -d` (if using local database)
4. ✅ Run `npx prisma migrate dev`
5. ✅ Run `node scripts/seed.js`
6. ✅ Run `npm run dev`
7. ✅ Test with `API_EXAMPLES.http`

**See `QUICKSTART.md` for detailed setup walkthrough!**

---

**Last Updated**: October 3, 2025  
**Questions?** Open an issue or check `DEPLOYMENT.md` for production setup
