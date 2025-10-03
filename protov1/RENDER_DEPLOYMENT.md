# 🎨 Deploy Oryxa to Render.com (100% FREE)

## ✨ Why Render?

- ✅ **100% FREE** (no credit card needed!)
- ✅ Zero-config for Node.js
- ✅ Automatic GitHub deployments
- ✅ Free SSL certificate
- ✅ Custom domains supported

**Limitation:** App sleeps after 15 min inactivity (wakes in ~30 seconds)

---

## 🚀 Quick Deployment (10 Minutes)

### **Step 1: Push to GitHub**

```bash
cd /Users/shubham/Projects/protov1

# Initialize Git
git init

# Add .gitignore
echo "node_modules/" >> .gitignore
echo ".next/" >> .gitignore
echo ".env" >> .gitignore
echo "uploads/" >> .gitignore

# Commit
git add .
git commit -m "Initial commit"

# Push to GitHub (create repo on github.com first)
git remote add origin https://github.com/YOUR_USERNAME/oryxa.git
git push -u origin main
```

---

### **Step 2: Sign Up for Render**

1. Go to: https://render.com
2. Click **"Get Started"**
3. Sign up with **GitHub** (free!)

---

### **Step 3: Create Web Service**

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub account
3. Select your `oryxa` repository
4. Configure:

```
Name: oryxa-invoice-app
Region: Singapore (or closest to you)
Branch: main
Root Directory: apps/api
Runtime: Node
Build Command: npm install && npm run build
Start Command: npm start
```

---

### **Step 4: Select Free Plan**

- Choose **"Free"** plan
- 750 hours/month (more than enough!)

---

### **Step 5: Add Environment Variables**

Click **"Advanced"** → **"Add Environment Variable"**:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=mysql://u705159588_oryxadb:Oryxa@2025@srv1995.hstgr.io:3306/u705159588_oyrxamain
JWT_SECRET=vs04sqfOpaVotjE7nrDLy7iSec/Y9x0gZDE2HuOdlgM=
JWT_EXPIRES_IN=7d
STORAGE_PROVIDER=backblaze
B2_ACCOUNT_ID=005077f69ecb36c0000000002
B2_APPLICATION_KEY=K005ugs9hnxjP24iYyPHilK03ePH5rA
B2_BUCKET_NAME=Prototype-oryxa
B2_REGION=us-west-004
B2_ENDPOINT=https://s3.us-west-004.backblazeb2.com
SENDGRID_API_KEY=YOUR_SENDGRID_API_KEY_HERE
SENDGRID_FROM_EMAIL=ceo@oryxa.in
```

---

### **Step 6: Deploy!**

Click **"Create Web Service"**

Render will:
1. Build your app (~5 minutes)
2. Deploy it
3. Give you: `https://oryxa-invoice-app.onrender.com`

---

### **Step 7: Add Worker Service (Optional)**

For background jobs (email queue):

1. Click **"New +"** → **"Background Worker"**
2. Same repository
3. Configure:
   - Root Directory: (leave blank)
   - Build Command: `npm install`
   - Start Command: `node worker/index.js`
4. Add same environment variables

---

## 🌐 Custom Domain

1. In Render dashboard, go to **Settings** → **Custom Domain**
2. Add: `app.yourdomain.com`
3. Update DNS in Hostinger:
   - Type: `CNAME`
   - Name: `app`
   - Value: `oryxa-invoice-app.onrender.com`

---

## 📝 Create render.yaml (Optional)

For easier configuration, create `render.yaml` in project root:

```yaml
services:
  # Main API
  - type: web
    name: oryxa-api
    env: node
    region: singapore
    plan: free
    buildCommand: cd apps/api && npm install && npm run build
    startCommand: cd apps/api && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: SENDGRID_API_KEY
        sync: false

  # Background Worker
  - type: worker
    name: oryxa-worker
    env: node
    region: singapore
    plan: free
    buildCommand: npm install
    startCommand: node worker/index.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        sync: false
```

Then use **"New +"** → **"Blueprint"** and select this file.

---

## ⚡ Keep App Awake (Prevent Sleeping)

Free plan sleeps after 15 min. To keep awake:

### Option 1: Cron Job (External)
Use https://cron-job.org (free) to ping your app every 10 minutes:
- URL: `https://your-app.onrender.com`
- Interval: Every 10 minutes

### Option 2: UptimeRobot (Recommended)
1. Sign up: https://uptimerobot.com (free)
2. Add monitor:
   - Type: HTTP(s)
   - URL: `https://your-app.onrender.com`
   - Interval: 5 minutes

---

## 💰 Free Tier Limits

| Resource | Free Limit |
|----------|------------|
| Uptime | 750 hours/month |
| Services | Unlimited |
| Build Time | 500 min/month |
| Bandwidth | 100 GB/month |
| RAM | 512 MB |
| CPU | Shared |

**Perfect for:** Demo, small production apps, low-medium traffic

---

## 🔄 Auto-Deploy

Push changes to GitHub:
```bash
git add .
git commit -m "Update"
git push
```

Render auto-deploys within 2-5 minutes!

---

## 📊 Monitoring

Render dashboard shows:
- Build logs
- Deploy logs
- App logs (real-time)
- Metrics (CPU, memory, requests)

---

## 🆘 Troubleshooting

### App Sleeps Too Much
- Use UptimeRobot to keep it awake
- Upgrade to paid plan ($7/month) for 24/7 uptime

### Build Fails
- Check Node.js version in `package.json`
- Verify build command is correct
- Check build logs

### Database Connection Issues
- Whitelist Render IPs in Hostinger Remote MySQL
- Or use `%` (any IP) in remote access

---

## ✅ Comparison

| Feature | Render Free | Railway Free | VPS |
|---------|-------------|--------------|-----|
| Cost | FREE | FREE ($5 credit) | $5-10/mo |
| Credit Card | ❌ Not needed | ⚠️ Needed | ✅ Needed |
| Sleeping | ⚠️ Yes (15 min) | ✅ No | ✅ No |
| Setup | 10 min | 10 min | 1-2 hours |
| Custom Domain | ✅ Free | ✅ Free | ✅ Free |

---

## 🎉 Done!

Your invoice app is live at: `https://oryxa-invoice-app.onrender.com`

**No credit card, no VPS, 100% free!** 🚀
