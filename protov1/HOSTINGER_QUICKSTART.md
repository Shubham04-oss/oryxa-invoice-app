# 🚀 Hostinger Deployment - Quick Start Guide

## 📋 What You Need

Before starting, make sure you have:

1. ✅ **Hostinger VPS or Cloud Hosting** (Node.js support required)
2. ✅ **Domain or Subdomain** (e.g., `app.yourdomain.com`)
3. ✅ **SSH Access** to your Hostinger server
4. ✅ **Database Already Configured** (MySQL on Hostinger ✓)

---

## 🎯 Choose Your Deployment Method

### Method 1: Automated Build & Upload (Recommended)

**Step 1:** Build deployment package locally
```bash
cd /Users/shubham/Projects/protov1
./scripts/build-deployment.sh
```

This creates: `oryxa-deployment-YYYYMMDD-HHMMSS.tar.gz`

**Step 2:** Upload to Hostinger VPS
```bash
# Via SCP (replace with your VPS IP)
scp oryxa-deployment-*.tar.gz root@your-vps-ip:/var/www/

# Or use FileZilla/FTP
```

**Step 3:** SSH into your VPS
```bash
ssh root@your-vps-ip
```

**Step 4:** Extract and setup
```bash
cd /var/www
tar -xzf oryxa-deployment-*.tar.gz
cd deployment-package
cp .env.production .env
nano .env  # Update APP_URL to your domain
```

**Step 5:** Install dependencies
```bash
npm install --production
npx prisma generate
```

**Step 6:** Start with PM2
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Follow the command it gives you
```

---

### Method 2: Git Deployment

**Step 1:** Push code to GitHub
```bash
cd /Users/shubham/Projects/protov1
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/oryxa.git
git push -u origin main
```

**Step 2:** SSH into VPS and clone
```bash
ssh root@your-vps-ip
cd /var/www
git clone https://github.com/yourusername/oryxa.git
cd oryxa
```

**Step 3:** Setup
```bash
npm install
cp .env.production .env
nano .env  # Update APP_URL
npm run build
```

**Step 4:** Start
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## 🔧 Server Setup (First Time Only)

Run this script on your VPS to install Node.js, PM2, Nginx, etc.:

```bash
# Download and run setup script
curl -o setup.sh https://raw.githubusercontent.com/yourusername/oryxa/main/scripts/hostinger-deploy.sh
chmod +x setup.sh
sudo ./setup.sh
```

Or manually install:

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Install PM2
npm install -g pm2

# Install Nginx
apt install nginx -y

# Install Certbot for SSL
apt install certbot python3-certbot-nginx -y
```

---

## 🌐 Configure Nginx Reverse Proxy

Create Nginx configuration:

```bash
nano /etc/nginx/sites-available/oryxa
```

Paste this (replace `app.yourdomain.com` with your actual domain):

```nginx
server {
    listen 80;
    server_name app.yourdomain.com;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

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
        
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
    }

    client_max_body_size 50M;
}
```

Enable and test:

```bash
ln -s /etc/nginx/sites-available/oryxa /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

---

## 🔒 Setup SSL Certificate

```bash
certbot --nginx -d app.yourdomain.com
```

Follow the prompts. Certbot will automatically:
- Get SSL certificate
- Update Nginx config
- Setup auto-renewal

---

## 🌐 Setup Subdomain in Hostinger

1. Login to **Hostinger hPanel**
2. Go to **Domains** → **Subdomains**
3. Click **"Create Subdomain"**
4. Enter: `app` (for app.yourdomain.com)
5. Point to your VPS IP address

Or update DNS manually:
- **Type**: A Record
- **Name**: app
- **Value**: Your VPS IP
- **TTL**: 3600

Wait 5-30 minutes for DNS propagation.

---

## 🔗 Connect with Main Website

### Option 1: Add Button/Link

In your main website (`www.yourdomain.com`), add:

```html
<a href="https://app.yourdomain.com" class="btn btn-primary">
    Launch Invoice App
</a>

<!-- Or with JavaScript -->
<button onclick="window.open('https://app.yourdomain.com', '_blank')">
    Open Dashboard
</button>
```

### Option 2: Embed as iframe (Not recommended for auth)

```html
<iframe 
    src="https://app.yourdomain.com" 
    width="100%" 
    height="800px"
    frameborder="0">
</iframe>
```

### Option 3: Single Sign-On Integration

If you want seamless login between main site and app:

1. Share JWT tokens between domains
2. Set cookies for `.yourdomain.com`
3. Implement OAuth2 or similar

---

## ✅ Post-Deployment Checklist

After deployment, verify:

- [ ] Application accessible at `https://app.yourdomain.com`
- [ ] SSL certificate active (green padlock in browser)
- [ ] Can login with: `admin@oryxa.com` / `demo123`
- [ ] Can create invoices
- [ ] Can generate PDFs
- [ ] Can send emails
- [ ] PM2 processes running: `pm2 status`
- [ ] Nginx status OK: `systemctl status nginx`
- [ ] Database connection working
- [ ] File uploads working (Backblaze B2)

---

## 🛠️ Common Commands

### PM2 Process Management

```bash
# Check status
pm2 status

# View logs
pm2 logs oryxa-api
pm2 logs oryxa-worker

# Restart app
pm2 restart all

# Stop app
pm2 stop all

# Monitor resources
pm2 monit
```

### Nginx

```bash
# Test configuration
nginx -t

# Reload
systemctl reload nginx

# Restart
systemctl restart nginx

# Check logs
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

### Database

```bash
# Test connection
cd /var/www/oryxa
node test-db-connection.js

# Access MySQL
mysql -h srv1995.hstgr.io -u u705159588_oryxadb -p u705159588_oyrxamain
```

### Deployment Updates

```bash
# Stop app
pm2 stop all

# Update code (if using Git)
git pull origin main

# Install dependencies
npm install --production

# Build
npm run build

# Restart
pm2 restart all
```

---

## 🆘 Troubleshooting

### Application won't start

```bash
# Check PM2 logs
pm2 logs oryxa-api --lines 100

# Check if port 3000 is in use
lsof -ti:3000

# Restart PM2
pm2 delete all
pm2 start ecosystem.config.js
```

### Can't access website

1. Check DNS propagation: https://dnschecker.org
2. Check Nginx: `nginx -t && systemctl status nginx`
3. Check firewall: `ufw status`
4. Check PM2: `pm2 status`

### Database errors

```bash
# Test connection
node test-db-connection.js

# Check .env file
cat .env | grep DATABASE_URL
```

### SSL certificate issues

```bash
# Renew certificate
certbot renew

# Force renew
certbot renew --force-renewal
```

---

## 📞 Need Help?

1. Check PM2 logs: `pm2 logs`
2. Check Nginx logs: `/var/log/nginx/error.log`
3. Check application logs in the console
4. Review `.env` configuration
5. Ensure all services are running

---

## 🎉 You're Done!

Your Oryxa application is now live at:
**https://app.yourdomain.com**

Login with:
- Email: `admin@oryxa.com`
- Password: `demo123`

Create a new user for production use!

---

**Made with ❤️ by Oryxa Team**
