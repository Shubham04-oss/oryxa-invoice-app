# Oryxa - Quick Start Guide

Get Oryxa running locally in **under 10 minutes**! 🚀

---

## 📋 Prerequisites

- **Node.js 18+** ([download](https://nodejs.org))
- **npm 9+** (comes with Node.js)
- **Git** ([download](https://git-scm.com))
- **Docker Desktop** (optional - for local database) ([download](https://www.docker.com/products/docker-desktop))

---

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/oryxa.git
cd oryxa
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
```bash
cp .env.example .env
```

**Edit `.env` file** with your credentials (at minimum, set these):
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/oryxa
JWT_SECRET=your-super-secret-jwt-key-change-this
SENDGRID_API_KEY=your_sendgrid_api_key  # Optional for testing
```

### 4. Start Local Database (Optional)
```bash
docker-compose up -d
```

Or use a free hosted database:
- **Supabase**: [supabase.com/dashboard/projects](https://supabase.com/dashboard/projects)
- **Neon**: [console.neon.tech/app/projects](https://console.neon.tech/app/projects)

### 5. Run Database Migrations
```bash
npx prisma migrate dev
npx prisma generate
```

### 6. Seed Sample Data (Optional)
```bash
node scripts/seed.js
```

**Demo Login Credentials**:
- Email: `admin@oryxa.com`
- Password: `demo123`

---

## 🎮 Running Locally

### Option 1: All Services Together
```bash
npm run dev
```

This starts:
- API server on `http://localhost:3000`
- Worker process (background jobs)

### Option 2: Individual Services

**Terminal 1 - API Server:**
```bash
npm run dev:api
```

**Terminal 2 - Worker:**
```bash
npm run dev:worker
```

---

## 🧪 Test the API

### Using cURL
```bash
# Health check
curl http://localhost:3000/api/health

# Create invoice (replace YOUR_TOKEN after login)
curl -X POST http://localhost:3000/api/invoices \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "clientName": "Test Client",
    "clientEmail": "test@example.com",
    "items": [
      {
        "description": "Website Development",
        "quantity": 1,
        "unitPrice": 1000,
        "taxRate": 10
      }
    ],
    "dueDate": "2025-12-01",
    "currency": "USD"
  }'
```

### Using Postman/Insomnia
1. Import `API_EXAMPLES.http` into your REST client
2. Update `@token` variable with your JWT token
3. Start making requests!

---

## 📱 View Landing Page

Open `apps/landing/index.html` in your browser or use:
```bash
open apps/landing/index.html  # macOS
xdg-open apps/landing/index.html  # Linux
```

---

## 🗄️ Database Management

### Prisma Studio (Visual Database Editor)
```bash
npm run db:studio
```
Opens at `http://localhost:5555`

### View Tables
```bash
# Connect to local database
psql postgresql://postgres:postgres@localhost:5432/oryxa

# List tables
\dt

# View invoices
SELECT * FROM "Invoice";
```

---

## 🔧 Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all services |
| `npm run dev:api` | Start API server only |
| `npm run dev:worker` | Start worker only |
| `npm run build` | Build for production |
| `npm test` | Run tests |
| `npm run lint` | Check code style |
| `npm run lint:fix` | Fix code style issues |
| `npm run db:migrate` | Run database migrations |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed sample data |
| `npm run docker:up` | Start Docker services |
| `npm run docker:down` | Stop Docker services |

---

## 📂 Project Structure

```
protov1/
├── apps/
│   ├── api/          # Next.js API routes (Vercel)
│   │   └── pages/api/
│   │       ├── invoices/
│   │       └── automations/
│   ├── landing/      # Static landing page (Hostinger)
│   └── web/          # Admin UI (future)
│
├── modules/
│   ├── invoices/     # Invoice business logic
│   ├── automations/  # Automation engine
│   └── shared/       # Shared utilities
│       ├── auth/
│       ├── queue/
│       ├── storage/
│       ├── messaging/
│       └── pdf/
│
├── worker/           # Background job processor
│   └── index.js
│
├── prisma/
│   └── schema.prisma # Database schema
│
└── scripts/
    ├── dev.sh        # Local development setup
    └── seed.js       # Sample data seeder
```

---

## 🐛 Troubleshooting

### Port 3000 Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev:api
```

### Database Connection Error
```bash
# Check if Docker is running
docker ps

# Restart database
docker-compose restart postgres

# Or check connection string in .env
echo $DATABASE_URL
```

### Prisma Client Not Generated
```bash
npx prisma generate
```

### Module Not Found Error
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

---

## 🎯 Next Steps

1. **Create Your First Invoice**
   - Use API_EXAMPLES.http as reference
   - Test PDF generation
   - Send via email (requires SendGrid)

2. **Set Up Automation**
   - Create automation in database
   - Trigger with `/api/automations/simulate`

3. **Customize Branding**
   - Edit `apps/landing/index.html`
   - Update PDF template in `modules/shared/pdf/generator.js`

4. **Deploy to Production**
   - Follow `DEPLOYMENT.md`
   - Set up Vercel, Render, Hostinger

5. **Add Features**
   - Payment gateway integration
   - Recurring invoices
   - Client portal
   - Analytics dashboard

---

## 📚 Documentation

- **Full README**: `README.md`
- **Architecture**: `ARCHITECTURE.md`
- **Deployment**: `DEPLOYMENT.md`
- **Security**: `SECURITY.md`
- **API Examples**: `API_EXAMPLES.http`

---

## 🆘 Getting Help

- **GitHub Issues**: [github.com/your-username/oryxa/issues](https://github.com/your-username/oryxa/issues)
- **Email**: support@oryxa.com
- **Discord**: [discord.gg/oryxa](https://discord.gg/oryxa)

---

## ✅ Quick Checklist

- [ ] Node.js 18+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created and configured
- [ ] Database running (Docker or hosted)
- [ ] Migrations applied (`npx prisma migrate dev`)
- [ ] Sample data seeded (optional)
- [ ] API server running (`npm run dev:api`)
- [ ] Worker running (`npm run dev:worker`)
- [ ] Successfully created test invoice
- [ ] Prisma Studio accessible (`npm run db:studio`)

---

**Ready to build?** Run `npm run dev` and start creating invoices! 🎉
