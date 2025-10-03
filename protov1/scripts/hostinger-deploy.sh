#!/bin/bash

# ===========================================
# Oryxa - Hostinger VPS Deployment Script
# ===========================================
# This script automates the deployment process
# Run this on your Hostinger VPS via SSH

set -e  # Exit on any error

echo "🚀 Starting Oryxa deployment on Hostinger VPS..."
echo "================================================"

# Configuration
APP_NAME="oryxa"
APP_DIR="/var/www/$APP_NAME"
DOMAIN="app.yourdomain.com"  # Change this to your domain
NODE_VERSION="18"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    print_error "Please run as root (use sudo)"
    exit 1
fi

print_info "Step 1: Updating system packages..."
apt update && apt upgrade -y
print_success "System updated"

print_info "Step 2: Installing Node.js ${NODE_VERSION}..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
    apt-get install -y nodejs
    print_success "Node.js installed: $(node --version)"
else
    print_success "Node.js already installed: $(node --version)"
fi

print_info "Step 3: Installing PM2 process manager..."
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
    print_success "PM2 installed"
else
    print_success "PM2 already installed"
fi

print_info "Step 4: Installing Git..."
if ! command -v git &> /dev/null; then
    apt install git -y
    print_success "Git installed"
else
    print_success "Git already installed"
fi

print_info "Step 5: Installing Nginx..."
if ! command -v nginx &> /dev/null; then
    apt install nginx -y
    systemctl enable nginx
    systemctl start nginx
    print_success "Nginx installed and started"
else
    print_success "Nginx already installed"
fi

print_info "Step 6: Creating application directory..."
mkdir -p $APP_DIR
print_success "Directory created: $APP_DIR"

print_info "Step 7: Configuring Nginx reverse proxy..."
cat > /etc/nginx/sites-available/$APP_NAME << EOF
server {
    listen 80;
    server_name $DOMAIN;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Proxy to Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # Increase timeout for long-running requests
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
    }

    # Increase max body size for file uploads
    client_max_body_size 50M;
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/

# Test Nginx configuration
if nginx -t; then
    systemctl reload nginx
    print_success "Nginx configured and reloaded"
else
    print_error "Nginx configuration failed"
    exit 1
fi

print_info "Step 8: Installing SSL certificate..."
if ! command -v certbot &> /dev/null; then
    apt install certbot python3-certbot-nginx -y
    print_success "Certbot installed"
fi

print_info "To get SSL certificate, run:"
echo "certbot --nginx -d $DOMAIN"

print_info "Step 9: Setting up firewall..."
if command -v ufw &> /dev/null; then
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw --force enable
    print_success "Firewall configured"
fi

print_success "Base setup complete!"
echo ""
echo "================================================"
echo "📋 Next Steps:"
echo "================================================"
echo "1. Upload your application to: $APP_DIR"
echo "2. Create .env file with production variables"
echo "3. Run: cd $APP_DIR && npm install"
echo "4. Run: npm run build"
echo "5. Run: pm2 start npm --name \"$APP_NAME-api\" -- run start:api"
echo "6. Run: pm2 start npm --name \"$APP_NAME-worker\" -- run start:worker"
echo "7. Run: pm2 save && pm2 startup"
echo "8. Run: certbot --nginx -d $DOMAIN"
echo ""
echo "📍 Application directory: $APP_DIR"
echo "🌐 Domain: http://$DOMAIN (will be https:// after SSL)"
echo "🗄️  Database: Already configured on Hostinger"
echo ""
print_success "Deployment script completed!"
