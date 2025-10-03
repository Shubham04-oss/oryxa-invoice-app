# 🚂 Deploy Oryxa to Railway.app (FREE)

## ✨ Why Railway?

- ✅ $5 FREE credit monthly (enough for 24/7 uptime)
- ✅ No sleeping like Render
- ✅ MySQL database support
- ✅ Automatic GitHub deployments
- ✅ Free SSL certificate
- ✅ Custom domains supported

---

## 🚀 Step-by-Step Deployment

### **Step 1: Prepare Your Code**

First, let's push your code to GitHub:

```bash
cd /Users/shubham/Projects/protov1

# Initialize Git if not done
git init

# Create .gitignore
cat > .gitignore << 'EOF'
node_modules/
.next/
.env
.env.local
*.log
.DS_Store
uploads/
public/uploads/
deployment-package/
*.tar.gz
EOF

# Commit your code
git add .
git commit -m "Initial commit - Oryxa invoice app"

# Create GitHub repo and push
# (You'll do this manually on GitHub.com)
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/oryxa.git
git push -u origin main
```

---

### **Step 2: Sign Up for Railway**

1. Go to: https://railway.app
2. Click **"Start a New Project"**
3. Sign up with **GitHub** (free, no credit card yet)

---

### **Step 3: Deploy from GitHub**

1. Click **"Deploy from GitHub repo"**
2. Select your `oryxa` repository
3. Railway will detect Next.js automatically

---

### **Step 4: Configure Environment Variables**

In Railway dashboard, go to **Variables** tab and add:

```env
NODE_ENV=production
PORT=3000

# Database (Your Hostinger MySQL)
DATABASE_URL=mysql://u705159588_oryxadb:Oryxa@2025@srv1995.hstgr.io:3306/u705159588_oyrxamain

# Authentication
JWT_SECRET=vs04sqfOpaVotjE7nrDLy7iSec/Y9x0gZDE2HuOdlgM=
JWT_EXPIRES_IN=7d

# Storage (Backblaze B2)
STORAGE_PROVIDER=backblaze
B2_ACCOUNT_ID=005077f69ecb36c0000000002
B2_APPLICATION_KEY=K005ugs9hnxjP24iYyPHilK03ePH5rA
B2_BUCKET_NAME=Prototype-oryxa
B2_BUCKET_ID=5007c7ef1609ae7c9b93061c
B2_REGION=us-west-004
B2_ENDPOINT=https://s3.us-west-004.backblazeb2.com

# Email (SendGrid)
SENDGRID_API_KEY=YOUR_SENDGRID_API_KEY_HERE
SENDGRID_FROM_EMAIL=ceo@oryxa.in
SENDGRID_FROM_NAME=Oryxa Invoicing

# URLs (will update after deployment)
APP_URL=https://your-app.railway.app
API_BASE_URL=https://your-app.railway.app
FRONTEND_BASE_URL=https://your-app.railway.app
```

---

### **Step 5: Configure Build Settings**

In Railway dashboard:

1. Go to **Settings**
2. Set **Root Directory**: `apps/api`
3. Set **Start Command**: `npm start`
4. Set **Build Command**: `npm install && npm run build`

Or create `railway.json` in your project root:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd apps/api && npm install && npm run build"
  },
  "deploy": {
    "startCommand": "cd apps/api && npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

### **Step 6: Deploy!**

Railway will automatically:
1. Build your app
2. Deploy it
3. Give you a URL: `https://your-app-name.railway.app`

---

### **Step 7: Add Custom Domain (Optional)**

1. In Railway, go to **Settings** → **Domains**
2. Click **"Generate Domain"** for a free `.railway.app` domain
3. Or add your custom domain: `app.yourdomain.com`
4. Update DNS in Hostinger:
   - Type: `CNAME`
   - Name: `app`
   - Value: `your-app-name.railway.app`

---

## 🔧 Worker Process Setup (Background Jobs)

Railway can run multiple services. Create another service for the worker:

1. Click **"+ New"** → **"Empty Service"**
2. Link to same GitHub repo
3. Set **Start Command**: `node worker/index.js`
4. Add same environment variables

---

## 💰 Cost Management

### Free Tier:
- $5 credit/month
- ~500 hours uptime/month for 1 service
- ~250 hours for 2 services (API + Worker)

### If You Need More:
- Add credit card (only charged if you exceed $5)
- Each additional $1 = ~100 hours
- $10/month = unlimited usage for small apps

---

## 🔗 Connect with Main Website

Once deployed on Railway:

1. Get your Railway URL: `https://oryxa-production.railway.app`
2. Update `.env` variables with this URL
3. Add link to your main website:

```html
<a href="https://oryxa-production.railway.app">Launch Invoice App</a>
```

---

## 📊 Monitoring

Railway dashboard shows:
- CPU usage
- Memory usage  
- Request logs
- Build logs
- Deployment history

---

## 🔄 Auto-Deployments

Every time you push to GitHub:
```bash
git add .
git commit -m "Update feature"
git push
```

Railway automatically rebuilds and redeploys! 🎉

---

## ✅ Advantages Over VPS

| Feature | Railway (Free) | VPS ($5-10/mo) |
|---------|----------------|----------------|
| Cost | FREE ($5 credit) | $5-10/month |
| Setup Time | 10 minutes | 1-2 hours |
| Auto-Deploy | ✅ Yes | ❌ Manual |
| SSL | ✅ Free | Need Certbot |
| Monitoring | ✅ Built-in | Need to setup |
| Scaling | ✅ Automatic | ❌ Manual |
| Maintenance | ✅ None | ❌ Your responsibility |

---

## 🆘 Troubleshooting

### Build Fails
- Check build logs in Railway dashboard
- Ensure `package.json` has correct scripts
- Verify Node.js version compatibility

### Can't Connect to Database
- Check if Railway IP is whitelisted in Hostinger Remote MySQL
- Add `%` (any IP) in Hostinger remote access

### App Crashes
- Check deployment logs
- Verify environment variables
- Check memory usage (increase if needed)

---

## 🎉 You're Done!

Your app is now live on Railway for FREE! 

Next steps:
1. Share the Railway URL with users
2. Add custom domain (optional)
3. Monitor usage in dashboard
4. Upgrade if you exceed free tier

---

**Much better than paying for VPS when starting out!** 🚀
