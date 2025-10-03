#!/bin/bash
# Local development startup script

echo "🚀 Starting Oryxa development environment..."

# Load environment variables
if [ ! -f .env ]; then
  echo "⚠️  .env file not found. Copying from .env.example..."
  cp .env.example .env
  echo "Please edit .env with your credentials and run this script again."
  exit 1
fi

export $(cat .env | grep -v '^#' | xargs)

# Check if Docker is running (for local database)
if command -v docker &> /dev/null; then
  echo "📦 Starting Docker containers..."
  docker-compose up -d
  echo "Waiting for database to be ready..."
  sleep 5
fi

# Install dependencies
echo "📥 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run migrations
echo "🗄️  Running database migrations..."
npx prisma migrate dev

# Seed database (optional)
read -p "Do you want to seed the database with sample data? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "🌱 Seeding database..."
  node scripts/seed.js
fi

echo "✅ Setup complete!"
echo ""
echo "To start development servers, run:"
echo "  Terminal 1: npm run dev:api"
echo "  Terminal 2: npm run dev:worker"
echo ""
echo "Or run all together: npm run dev"
