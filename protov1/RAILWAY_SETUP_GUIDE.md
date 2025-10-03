# 🚂 Railway Deployment Guide - Oryxa Invoice App

## ✅ Fixed: Build Configuration Issue

The build error you encountered has been resolved! We've added:
- `railway.toml` - Railway deployment configuration
- `nixpacks.toml` - Nixpacks build configuration
- Updated root `package.json` with proper build/start scripts

## 📋 Step-by-Step Deployment

### 1️⃣ **Sign Up & Connect GitHub**
1. Go to: https://railway.app/
2. Click **"Start a New Project"** or **"Login with GitHub"**
3. Authorize Railway to access your GitHub account

### 2️⃣ **Create New Project**
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose: **`Shubham04-oss/oryxa-invoice-app`**
4. Railway will automatically detect the configuration and start building

### 3️⃣ **Configure Environment Variables** (IMPORTANT!)
Click on your deployed service → **Variables** tab → Add these:

```bash
# Database (Hostinger MySQL)
DATABASE_URL=mysql://u705159588_oryxadb:Oryxa@2025@srv1995.hstgr.io:3306/u705159588_oyrxamain

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production

# Email (SendGrid)
SENDGRID_API_KEY=YOUR_SENDGRID_API_KEY_HERE
SENDGRID_FROM_EMAIL=noreply@oryxa.com
SENDGRID_FROM_NAME=Oryxa Invoicing

# Storage (Backblaze B2)
STORAGE_PROVIDER=b2
B2_APPLICATION_KEY_ID=your_b2_key_id
B2_APPLICATION_KEY=your_b2_application_key
B2_BUCKET_ID=your_b2_bucket_id
B2_BUCKET_NAME=your_b2_bucket_name
B2_REGION=us-west-001

# Application
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-app.up.railway.app

# Optional: WhatsApp (if using)
WHATSAPP_API_KEY=your_whatsapp_api_key
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
```

### 4️⃣ **Configure Build Settings** (Should be automatic now)
Go to **Settings** tab and verify:
- ✅ **Root Directory**: Leave blank (Railway will use root with our config)
- ✅ **Build Command**: Handled by `railway.toml`
- ✅ **Start Command**: Handled by `railway.toml`

### 5️⃣ **Deploy! 🚀**
Railway will automatically:
1. Install dependencies
2. Generate Prisma client
3. Build Next.js app
4. Start the server

**Build Time**: ~3-5 minutes

### 6️⃣ **Get Your Public URL**
1. Go to **Settings** tab
2. Scroll to **Domains** section
3. Click **"Generate Domain"**
4. You'll get: `https://oryxa-production.up.railway.app` (or similar)

### 7️⃣ **Update FRONTEND_URL Variable**
1. Copy your Railway URL
2. Go back to **Variables** tab
3. Update `FRONTEND_URL` with your actual Railway URL
4. Railway will auto-redeploy

### 8️⃣ **Whitelist Railway IP in Hostinger** (CRITICAL!)

Your Hostinger MySQL needs to allow connections from Railway:

**Option A: Allow All IPs (Easiest)**
1. Login to Hostinger
2. Go to **Databases** → **Remote MySQL**
3. Add IP: `%` (allows any IP)

**Option B: Whitelist Railway IPs (More Secure)**
Railway uses dynamic IPs, so either:
- Add multiple Railway IP ranges
- Or use a Railway Database instead (costs extra after free tier)

### 9️⃣ **Test Your Deployment**
1. Visit your Railway URL
2. Login with: `admin@oryxa.com` / `demo123`
3. Create a test invoice
4. Generate PDF ✅
5. Send email ✅

---

## 🎯 Build Configuration Explained

### `railway.toml`
```toml
[build]
builder = "nixpacks"
buildCommand = "npm install && npx prisma generate && cd apps/api && npm install && npm run build"

[deploy]
startCommand = "cd apps/api && npm start"
restartPolicyType = "always"
```

This tells Railway:
- Use Nixpacks builder
- Install root dependencies first (for Prisma)
- Generate Prisma client
- Install API dependencies
- Build Next.js app
- Start from `apps/api` directory

### `nixpacks.toml`
```toml
[phases.setup]
nixPkgs = ["nodejs-18_x"]

[phases.install]
cmds = [
    "npm install",
    "npx prisma generate",
    "cd apps/api && npm install"
]

[phases.build]
cmds = ["cd apps/api && npm run build"]

[start]
cmd = "cd apps/api && npm start"
```

This provides fine-grained control over build phases.

---

## 🐛 Troubleshooting

### ❌ "Build failed: Cannot find module '@prisma/client'"
**Fix**: Make sure `DATABASE_URL` is set in environment variables BEFORE building.

### ❌ "Cannot connect to database"
**Fix**: Whitelist Railway's IP in Hostinger Remote MySQL settings.

### ❌ "Port already in use"
**Fix**: Railway automatically assigns `PORT` env var, don't hardcode port 3000.

### ❌ "Application crashed"
**Check Logs**:
1. Go to your Railway project
2. Click on the service
3. Go to **Deployments** tab
4. Click latest deployment
5. View **Build Logs** and **Deploy Logs**

---

## 💰 Free Tier Limits

Railway gives you **$5 FREE credit per month**, which provides:
- ✅ ~500 hours of uptime (24/7 for the whole month!)
- ✅ 100GB bandwidth
- ✅ 1GB RAM
- ✅ 1 vCPU

Perfect for your invoice app! 🎉

---

## 🔗 Next Steps

1. ✅ Deploy to Railway (you're here!)
2. ⏳ Test all features work online
3. ⏳ Add custom domain (optional)
4. ⏳ Link from your main website
5. ⏳ Set up monitoring/alerts

---

## 📧 Support

If you encounter issues:
- Check Railway docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- GitHub Issues: https://github.com/Shubham04-oss/oryxa-invoice-app/issues

**Happy Deploying! 🚀**
