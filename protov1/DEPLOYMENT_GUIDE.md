# 🚀 Oryxa - Hostinger Deployment Guide

## Prerequisites Check

Before deploying, verify your Hostinger plan supports:
- ✅ Node.js applications (VPS or Cloud hosting required)
- ✅ SSH access
- ✅ MySQL database (already configured ✓)
- ✅ Custom domain or subdomain

**Important:** Shared hosting doesn't support Node.js apps. You need:
- **VPS Hosting** (recommended)
- **Cloud Hosting**
- **Business/Premium with Node.js support**

## 📋 Deployment Options for Hostinger

### Option 1: Hostinger VPS (Recommended)
Full control, Node.js support, PM2 for process management

### Option 2: Hostinger Cloud
Managed Node.js environment

### Option 3: Static Export + API Subdomain
Export Next.js as static HTML, deploy API separately

---

## 🔧 Option 1: VPS Deployment (Full Stack)

### Step 1: Connect to VPS via SSH

```bash
ssh root@your-vps-ip
# Or use the SSH credentials from Hostinger hPanel
```

### Step 2: Install Node.js on VPS

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Verify installation
node --version
npm --version

# Install PM2 (process manager)
npm install -g pm2
```

### Step 3: Install Git

```bash
apt install git -y
```

### Step 4: Clone Your Repository

```bash
# Navigate to web directory
cd /var/www

# Clone your project (you'll need to push to GitHub first)
git clone https://github.com/yourusername/oryxa.git
cd oryxa

# Or upload via FTP (see instructions below)
```

### Step 5: Setup Application

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Create production .env file
nano .env
```

Copy your production environment variables (see below).

### Step 6: Setup PM2 to Run Application

```bash
# Start the application with PM2
pm2 start npm --name "oryxa-api" -- run start:api
pm2 start npm --name "oryxa-worker" -- run start:worker

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
```

### Step 7: Configure Nginx Reverse Proxy

```bash
# Install Nginx
apt install nginx -y

# Create Nginx configuration
nano /etc/nginx/sites-available/oryxa
```

Paste this configuration:

```nginx
server {
    listen 80;
    server_name app.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable the site
ln -s /etc/nginx/sites-available/oryxa /etc/nginx/sites-enabled/

# Test Nginx configuration
nginx -t

# Restart Nginx
systemctl restart nginx
```

### Step 8: Setup SSL with Let's Encrypt

```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Get SSL certificate
certbot --nginx -d app.yourdomain.com

# Auto-renewal is configured automatically
```

---

## 🔧 Option 2: Manual FTP Upload (No Git)

If you prefer FTP deployment:

### Step 1: Build Locally

```bash
cd /Users/shubham/Projects/protov1
npm run build
```

### Step 2: Create Deployment Package

```bash
# Create a deployment directory
mkdir -p deployment-package
cd deployment-package

# Copy necessary files
cp -r ../apps ./
cp -r ../modules ./
cp -r ../worker ./
cp -r ../prisma ./
cp -r ../scripts ./
cp -r ../node_modules ./
cp ../package.json ./
cp ../.env.production ./
```

### Step 3: Upload via FTP

1. Open FileZilla or your FTP client
2. Connect to Hostinger FTP:
   - Host: `ftp.yourdomain.com`
   - Username: From hPanel
   - Password: From hPanel
   - Port: 21
3. Upload all files to `/public_html/app/` or `/home/username/app/`

### Step 4: Setup via SSH

```bash
ssh username@yourdomain.com
cd app
npm install --production
pm2 start npm --name "oryxa" -- start
```

---

## 🌐 Option 3: Subdomain Setup

### In Hostinger hPanel:

1. Go to **Domains** → **Subdomains**
2. Create subdomain: `app.yourdomain.com`
3. Point to your application directory
4. Configure DNS if needed

---

## 📝 Production Environment Variables

Create `.env.production` with these values:

```env
# PRODUCTION ENVIRONMENT
NODE_ENV=production
PORT=3000
APP_URL=https://app.yourdomain.com

# Authentication
JWT_SECRET=vs04sqfOpaVotjE7nrDLy7iSec/Y9x0gZDE2HuOdlgM=
JWT_EXPIRES_IN=7d

# Database (Hostinger MySQL) ✅ Already configured
DATABASE_URL=mysql://u705159588_oryxadb:Oryxa@2025@srv1995.hstgr.io:3306/u705159588_oyrxamain

# Storage (Use Backblaze for production)
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

# API URLs (Update with your domain)
API_BASE_URL=https://app.yourdomain.com
FRONTEND_BASE_URL=https://app.yourdomain.com
```

---

## 🔗 Connect with Main Website

### Option A: Add Link in Main Website

In your main website (e.g., `www.yourdomain.com`), add a button/link:

```html
<a href="https://app.yourdomain.com" class="btn btn-primary">
  Launch App
</a>
```

### Option B: Single Sign-On Integration

If you want seamless integration between main site and app:

1. **JWT Token Sharing**: Use same JWT_SECRET
2. **Subdomain Cookies**: Set cookies for `.yourdomain.com`
3. **API Integration**: Main site can call app APIs

---

## 🔄 Continuous Deployment

### Setup Auto-Deploy Script

Create `deploy.sh`:

```bash
#!/bin/bash
cd /var/www/oryxa
git pull origin main
npm install
npm run build
pm2 restart all
```

Make it executable:
```bash
chmod +x deploy.sh
```

Deploy new changes:
```bash
./deploy.sh
```

---

## 🛠️ Troubleshooting

### Check Application Status
```bash
pm2 status
pm2 logs oryxa-api
pm2 logs oryxa-worker
```

### Restart Application
```bash
pm2 restart all
```

### Check Nginx
```bash
systemctl status nginx
nginx -t
tail -f /var/log/nginx/error.log
```

### Database Connection Test
```bash
node test-db-connection.js
```

---

## 📊 Monitoring

Setup PM2 monitoring:
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

---

## 🔒 Security Checklist

- [ ] Enable firewall (UFW)
- [ ] Setup fail2ban
- [ ] Use strong SSH keys (disable password auth)
- [ ] Enable SSL certificate
- [ ] Update NODE_ENV=production
- [ ] Secure database connection
- [ ] Setup backup strategy
- [ ] Configure rate limiting
- [ ] Enable CORS properly

---

## 📞 Next Steps

1. **Check your Hostinger plan** - VPS or Cloud?
2. **Setup subdomain** - `app.yourdomain.com`
3. **Choose deployment method** - Git or FTP?
4. **Let me know** - I'll create specific scripts for your setup!
