#!/bin/bash

# ===========================================
# Oryxa - Deployment Readiness Checker
# ===========================================
# Run this before deploying to verify everything is ready

echo "🔍 Checking Oryxa Deployment Readiness..."
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

READY=true

check_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

check_error() {
    echo -e "${RED}✗ $1${NC}"
    READY=false
}

check_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check Node.js
echo "📦 Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    check_success "Node.js installed: $NODE_VERSION"
else
    check_error "Node.js not installed"
fi
echo ""

# Check npm
echo "📦 Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    check_success "npm installed: $NPM_VERSION"
else
    check_error "npm not installed"
fi
echo ""

# Check if dependencies are installed
echo "📦 Checking dependencies..."
if [ -d "node_modules" ]; then
    check_success "node_modules exists"
else
    check_warning "node_modules not found. Run: npm install"
fi
echo ""

# Check environment files
echo "🔧 Checking environment files..."
if [ -f ".env" ]; then
    check_success ".env file exists"
else
    check_error ".env file not found"
fi

if [ -f ".env.production" ]; then
    check_success ".env.production file exists"
else
    check_warning ".env.production file not found (created by deployment script)"
fi
echo ""

# Check database connection
echo "🗄️  Checking database..."
if [ -f "test-db-connection.js" ]; then
    if node test-db-connection.js > /dev/null 2>&1; then
        check_success "Database connection working"
    else
        check_error "Database connection failed. Run: node test-db-connection.js"
    fi
else
    check_warning "test-db-connection.js not found"
fi
echo ""

# Check if build exists
echo "🏗️  Checking build..."
if [ -d "apps/api/.next" ]; then
    check_success "Next.js build exists"
else
    check_warning "No build found. Run: npm run build"
fi
echo ""

# Check Prisma
echo "🔷 Checking Prisma..."
if [ -d "node_modules/@prisma/client" ]; then
    check_success "Prisma client installed"
else
    check_warning "Prisma client not found. Run: npx prisma generate"
fi
echo ""

# Check deployment scripts
echo "📜 Checking deployment scripts..."
if [ -f "scripts/build-deployment.sh" ]; then
    if [ -x "scripts/build-deployment.sh" ]; then
        check_success "build-deployment.sh is executable"
    else
        check_warning "build-deployment.sh not executable. Run: chmod +x scripts/build-deployment.sh"
    fi
else
    check_error "build-deployment.sh not found"
fi

if [ -f "ecosystem.config.js" ]; then
    check_success "ecosystem.config.js exists"
else
    check_error "ecosystem.config.js not found"
fi
echo ""

# Check environment variables
echo "🔐 Checking environment variables..."
if [ -f ".env" ]; then
    if grep -q "DATABASE_URL" .env; then
        check_success "DATABASE_URL configured"
    else
        check_error "DATABASE_URL not found in .env"
    fi
    
    if grep -q "JWT_SECRET" .env; then
        check_success "JWT_SECRET configured"
    else
        check_error "JWT_SECRET not found in .env"
    fi
    
    if grep -q "SENDGRID_API_KEY" .env; then
        check_success "SENDGRID_API_KEY configured"
    else
        check_warning "SENDGRID_API_KEY not configured"
    fi
fi
echo ""

# Check Git
echo "🔀 Checking Git..."
if [ -d ".git" ]; then
    check_success "Git repository initialized"
    
    # Check if there are uncommitted changes
    if git diff-index --quiet HEAD -- 2>/dev/null; then
        check_success "No uncommitted changes"
    else
        check_warning "You have uncommitted changes"
    fi
else
    check_warning "Not a Git repository (optional for FTP deployment)"
fi
echo ""

# Summary
echo "=========================================="
if [ "$READY" = true ]; then
    echo -e "${GREEN}✓ All critical checks passed!${NC}"
    echo ""
    echo "🚀 You're ready to deploy!"
    echo ""
    echo "Next steps:"
    echo "1. Run: ./scripts/build-deployment.sh"
    echo "2. Upload the generated .tar.gz file to your VPS"
    echo "3. Follow the instructions in HOSTINGER_QUICKSTART.md"
else
    echo -e "${RED}✗ Some critical checks failed${NC}"
    echo ""
    echo "Please fix the errors above before deploying"
fi
echo "=========================================="
