#!/bin/bash

# ===========================================
# Oryxa - Build and Package for Deployment
# ===========================================
# Run this on your LOCAL machine to create
# a deployment package for Hostinger
# ===========================================

set -e

echo "📦 Building Oryxa deployment package..."
echo "========================================"

# Configuration
PACKAGE_DIR="deployment-package"
DATE=$(date +%Y%m%d-%H%M%S)
PACKAGE_NAME="oryxa-deployment-$DATE"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Clean previous packages
print_info "Cleaning previous builds..."
rm -rf $PACKAGE_DIR
rm -f oryxa-deployment-*.tar.gz
print_success "Cleaned"

# Create package directory
print_info "Creating package directory..."
mkdir -p $PACKAGE_DIR
print_success "Created $PACKAGE_DIR"

# Build the application
print_info "Building Next.js application..."
cd apps/api
npm run build
cd ../..
print_success "Build complete"

# Copy necessary files
print_info "Copying files..."

# Core application
cp -r apps $PACKAGE_DIR/
cp -r modules $PACKAGE_DIR/
cp -r worker $PACKAGE_DIR/
cp -r prisma $PACKAGE_DIR/
cp -r scripts $PACKAGE_DIR/
cp package.json $PACKAGE_DIR/
cp package-lock.json $PACKAGE_DIR/

# Environment template (don't copy actual .env)
cat > $PACKAGE_DIR/.env.production << 'EOF'
# ===========================================
# ORYXA PRODUCTION ENVIRONMENT
# ===========================================
# Update these values for your production setup

NODE_ENV=production
PORT=3000
APP_URL=https://app.yourdomain.com

# Authentication
JWT_SECRET=vs04sqfOpaVotjE7nrDLy7iSec/Y9x0gZDE2HuOdlgM=
JWT_EXPIRES_IN=7d

# Database (Hostinger MySQL)
DATABASE_URL=mysql://u705159588_oryxadb:Oryxa@2025@srv1995.hstgr.io:3306/u705159588_oyrxamain

# Storage (Backblaze B2)
STORAGE_PROVIDER=backblaze
B2_ACCOUNT_ID=005077f69ecb36c0000000002
B2_APPLICATION_KEY=K005ugs9hnxjP24iYyPHilK03ePH5rA
B2_BUCKET_NAME=Prototype-oryxa
B2_BUCKET_ID=5007c7ef1609ae7c9b93061c
B2_REGION=us-west-004
B2_ENDPOINT=https://s3.us-west-004.backblazeb2.com
B2_ACCESS_KEY=005077f69ecb36c0000000002
B2_SECRET_KEY=K005ugs9hnxjP24iYyPHilK03ePH5rA

# Email (SendGrid)
SENDGRID_API_KEY=YOUR_SENDGRID_API_KEY_HERE
SENDGRID_FROM_EMAIL=ceo@oryxa.in
SENDGRID_FROM_NAME=Oryxa Invoicing
SENDGRID_SENDER=ceo@oryxa.in

# API URLs
API_BASE_URL=https://app.yourdomain.com
FRONTEND_BASE_URL=https://app.yourdomain.com

# Feature Flags
ENABLE_WHATSAPP=false
ENABLE_AUTOMATIONS=true
ENABLE_PAYMENTS=false
ENABLE_MULTI_TENANT=true

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Webhook
WEBHOOK_SECRET=change-this-to-random-string-for-webhook-validation
EOF

print_success "Files copied"

# Create README
cat > $PACKAGE_DIR/DEPLOY_README.md << 'EOF'
# Oryxa Deployment Package

## 📦 Installation on Hostinger VPS

### 1. Upload this package to your VPS

Using SCP:
```bash
scp -r deployment-package root@your-vps-ip:/var/www/oryxa
```

Or using FTP:
- Upload all files to `/var/www/oryxa/`

### 2. SSH into your VPS

```bash
ssh root@your-vps-ip
```

### 3. Navigate to application directory

```bash
cd /var/www/oryxa
```

### 4. Install dependencies

```bash
npm install --production
```

### 5. Setup environment variables

```bash
cp .env.production .env
nano .env  # Edit with your actual values
```

### 6. Generate Prisma Client

```bash
npx prisma generate
```

### 7. Start with PM2

```bash
# Start API
pm2 start npm --name "oryxa-api" -- run start:api

# Start Worker
pm2 start npm --name "oryxa-worker" -- run start:worker

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### 8. Check status

```bash
pm2 status
pm2 logs oryxa-api
```

### 9. Setup Nginx (if not done already)

See DEPLOYMENT_GUIDE.md for Nginx configuration

### 10. Setup SSL

```bash
certbot --nginx -d app.yourdomain.com
```

## 🔄 Updating

To deploy updates:

1. Build new package locally
2. Stop PM2 processes: `pm2 stop all`
3. Upload new files
4. Run: `npm install --production`
5. Restart PM2: `pm2 restart all`

## 🛠️ Troubleshooting

### Check logs
```bash
pm2 logs oryxa-api --lines 100
pm2 logs oryxa-worker --lines 100
```

### Restart application
```bash
pm2 restart all
```

### Test database connection
```bash
node test-db-connection.js
```

### Check Nginx
```bash
nginx -t
systemctl status nginx
```

## 📞 Support

For issues, check DEPLOYMENT_GUIDE.md in the project root.
EOF

print_success "README created"

# Create compressed archive
print_info "Creating compressed archive..."
tar -czf $PACKAGE_NAME.tar.gz $PACKAGE_DIR
print_success "Archive created: $PACKAGE_NAME.tar.gz"

# Calculate size
SIZE=$(du -sh $PACKAGE_NAME.tar.gz | cut -f1)

echo ""
echo "========================================"
print_success "Package ready for deployment!"
echo "========================================"
echo "📦 Package: $PACKAGE_NAME.tar.gz"
echo "💾 Size: $SIZE"
echo ""
echo "📋 Next Steps:"
echo "1. Upload $PACKAGE_NAME.tar.gz to your Hostinger VPS"
echo "2. Extract: tar -xzf $PACKAGE_NAME.tar.gz"
echo "3. Follow instructions in $PACKAGE_DIR/DEPLOY_README.md"
echo ""
echo "🚀 Upload via SCP:"
echo "scp $PACKAGE_NAME.tar.gz root@your-vps-ip:/var/www/"
echo ""
echo "Or use FileZilla/FTP to upload the file"
echo ""
