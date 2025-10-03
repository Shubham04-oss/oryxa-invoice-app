# Oryxa - Invoice + Automation SaaS Prototype

> **Low-cost, single-developer, modular monorepo** for invoice management and automation workflows with static landing page (Hostinger) + serverless APIs (Vercel) + background workers (Render/Railway).

---

## 🎯 Project Overview

Oryxa combines invoice generation with workflow automation in a scalable, extractable architecture:
- **Invoices Module**: Create, manage, and send invoices with PDF generation
- **Automations Module**: Event-driven workflows (triggers → actions)
- **Shared Utilities**: PDF generation, storage, messaging, queue management

---

## 📁 Repository Structure

```
protov1/
├── README.md                      # This file
├── package.json                   # Root dependencies & scripts
├── .env.example                   # All required environment variables
├── .gitignore
├── docker-compose.yml             # Optional: Local Postgres + Redis
├── tsconfig.json                  # TypeScript configuration
│
├── apps/
│   ├── landing/                   # Static landing page (Hostinger)
│   │   ├── index.html
│   │   ├── styles.css
│   │   └── deploy.sh              # Deploy to Hostinger via FTP
│   │
│   ├── web/                       # Next.js Admin UI (optional)
│   │   ├── pages/
│   │   ├── components/
│   │   └── public/
│   │
│   └── api/                       # Backend API (Next.js or Express)
│       ├── pages/api/             # Next.js API routes (Vercel)
│       │   ├── invoices/
│       │   └── automations/
│       └── server.js              # Alternative: Express server
│
├── modules/
│   ├── invoices/                  # Invoice domain logic
│   │   ├── service.js
│   │   ├── routes.js
│   │   └── templates/
│   │
│   ├── automations/               # Automation engine
│   │   ├── engine.js
│   │   ├── triggers.js
│   │   └── actions.js
│   │
│   └── shared/                    # Shared utilities
│       ├── db/
│       ├── queue/
│       ├── storage/
│       ├── messaging/
│       ├── pdf/
│       └── auth/
│
├── worker/                        # Background job processor
│   ├── index.js                   # Main worker entry
│   ├── processors/
│   │   ├── pdfGenerator.js
│   │   ├── emailSender.js
│   │   └── whatsappSender.js
│   └── Dockerfile                 # Worker deployment
│
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── migrations/
│
├── scripts/
│   ├── dev.sh                     # Local development
│   └── seed.js                    # Sample data
│
└── .github/
    └── workflows/
        ├── ci.yml                 # Lint + Test
        └── deploy.yml             # Deploy to Vercel + Render
```

---

## 🚀 Prerequisites & Setup Checklist

### 1. **GitHub Repository**
```bash
# Create repo at github.com/your-username/oryxa
git init
git add .
git commit -m "Initial Oryxa scaffold"
git remote add origin https://github.com/your-username/oryxa.git
git push -u origin main
```

### 2. **Hostinger** (Landing Page)
- [ ] Purchase/login to Hostinger account
- [ ] Navigate to File Manager or FTP credentials
- [ ] Note FTP details: `FTP_HOST`, `FTP_USER`, `FTP_PASSWORD`
- [ ] Upload `apps/landing/*` to `public_html/` folder

### 3. **Database - Supabase (Free) or Neon (Free)**
- [ ] Sign up: [supabase.com](https://supabase.com) or [neon.tech](https://neon.tech)
- [ ] Create new project
- [ ] Copy connection string → `DATABASE_URL`
  ```
  postgresql://user:password@host:5432/dbname
  ```

### 4. **Vercel** (API Deployment)
- [ ] Sign up: [vercel.com](https://vercel.com)
- [ ] Install CLI: `npm i -g vercel`
- [ ] Login: `vercel login`
- [ ] Link project: `vercel link`
- [ ] Copy: `VERCEL_TOKEN` (from Settings → Tokens)

### 5. **Render / Railway** (Worker)
- [ ] Sign up: [render.com](https://render.com) or [railway.app](https://railway.app)
- [ ] Create new Background Worker
- [ ] Set build command: `npm install`
- [ ] Set start command: `node worker/index.js`
- [ ] Copy: `RENDER_API_KEY` (optional for automation)

### 6. **Backblaze B2** (Storage)
- [ ] Sign up: [backblaze.com/b2](https://www.backblaze.com/b2)
- [ ] Create bucket (e.g., `oryxa-invoices`)
- [ ] Generate Application Key
- [ ] Copy:
  - `B2_ACCESS_KEY` (keyID)
  - `B2_SECRET_KEY` (applicationKey)
  - `B2_BUCKET` (bucket name)
  - `S3_ENDPOINT` (e.g., `s3.us-west-002.backblazeb2.com`)

### 7. **SendGrid** (Email)
- [ ] Sign up: [sendgrid.com](https://sendgrid.com) (100 emails/day free)
- [ ] Create API key: Settings → API Keys
- [ ] Verify sender email: Settings → Sender Authentication
- [ ] Copy:
  - `SENDGRID_API_KEY`
  - `SENDGRID_SENDER` (verified email)

### 8. **WhatsApp** (Meta or Twilio)

**Option A: Meta WhatsApp Business API** (Free tier)
- [ ] Sign up: [developers.facebook.com](https://developers.facebook.com)
- [ ] Create app → Add WhatsApp product
- [ ] Get test number and token
- [ ] Copy:
  - `WHATSAPP_PHONE_ID`
  - `WHATSAPP_ACCESS_TOKEN`

**Option B: Twilio** ($15 credit free)
- [ ] Sign up: [twilio.com](https://www.twilio.com)
- [ ] Get WhatsApp sandbox number
- [ ] Copy:
  - `TWILIO_SID`
  - `TWILIO_TOKEN`
  - `TWILIO_WHATSAPP` (e.g., `whatsapp:+14155238886`)

### 9. **Upstash Redis** (Optional - Queue)
- [ ] Sign up: [upstash.com](https://upstash.com) (10k commands/day free)
- [ ] Create Redis database
- [ ] Copy:
  - `UPSTASH_REDIS_URL`
  - `UPSTASH_REDIS_TOKEN`

### 10. **Payment Gateway** (Optional)

**Stripe**
- [ ] Sign up: [stripe.com](https://stripe.com)
- [ ] Copy: `STRIPE_SECRET` (sk_test_...)

**Razorpay** (India)
- [ ] Sign up: [razorpay.com](https://razorpay.com)
- [ ] Copy: `RAZORPAY_KEY`, `RAZORPAY_SECRET`

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

See `.env.example` for all required variables with descriptions.

---

## 🛠️ Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Database (Optional - Docker)
```bash
docker-compose up -d
```

### 3. Run Migrations
```bash
npx prisma migrate dev
npx prisma generate
```

### 4. Seed Sample Data
```bash
node scripts/seed.js
```

### 5. Start Development Servers

**Terminal 1 - API Server:**
```bash
npm run dev:api
```

**Terminal 2 - Worker:**
```bash
npm run dev:worker
```

**Terminal 3 - Admin UI (optional):**
```bash
npm run dev:web
```

Access:
- API: `http://localhost:3000/api`
- Admin UI: `http://localhost:3001`
- Landing: Open `apps/landing/index.html` in browser

---

## 📡 API Documentation

### **Invoices**

#### Create Invoice
```http
POST /api/invoices
Content-Type: application/json

{
  "tenantId": "tenant_123",
  "clientName": "Acme Corp",
  "clientEmail": "billing@acme.com",
  "items": [
    {
      "description": "Website Development",
      "quantity": 1,
      "unitPrice": 5000,
      "taxRate": 18
    }
  ],
  "dueDate": "2025-11-01",
  "currency": "USD"
}

Response: 201 Created
{
  "id": "inv_xyz789",
  "invoiceNumber": "INV-2025-001",
  "status": "draft",
  "total": 5900,
  "pdfUrl": null,
  "jobId": "job_abc123"
}
```

#### Get Invoice
```http
GET /api/invoices/:id

Response: 200 OK
{
  "id": "inv_xyz789",
  "invoiceNumber": "INV-2025-001",
  "status": "draft",
  "clientName": "Acme Corp",
  "total": 5900,
  "pdfUrl": "https://b2.backblaze.com/...",
  "createdAt": "2025-10-03T10:30:00Z"
}
```

#### Send Invoice
```http
POST /api/invoices/:id/send
Content-Type: application/json

{
  "method": "email", // or "whatsapp"
  "recipient": "billing@acme.com"
}

Response: 200 OK
{
  "success": true,
  "jobId": "job_send_123",
  "message": "Invoice queued for sending"
}
```

### **Automations**

#### Simulate Automation
```http
POST /api/automations/simulate
Content-Type: application/json

{
  "trigger": "invoice_overdue",
  "data": {
    "invoiceId": "inv_xyz789",
    "daysOverdue": 7
  }
}

Response: 200 OK
{
  "success": true,
  "actionsTriggered": [
    {
      "type": "send_reminder_email",
      "status": "queued",
      "jobId": "job_reminder_456"
    },
    {
      "type": "send_whatsapp",
      "status": "queued",
      "jobId": "job_whatsapp_789"
    }
  ]
}
```

---

## 🎨 Admin UI Wireframe Notes

### **Dashboard** (`/dashboard`)
- Revenue metrics (MTD, YTD)
- Recent invoices table
- Pending automation jobs
- Quick actions: New Invoice, New Automation

### **Invoices** (`/invoices`)
- Filterable table (status, date range, client)
- Actions: View PDF, Send, Mark Paid, Delete
- Bulk actions: Export, Send batch

### **Automations** (`/automations`)
- Visual workflow builder (drag-drop)
- Trigger options: Invoice Created, Payment Received, Overdue
- Action options: Send Email, WhatsApp, Webhook, Update Field
- Execution history with logs

### **Settings** (`/settings`)
- Company profile (logo, address, tax ID)
- Email templates customization
- API keys management
- Billing & subscription

---

## 🚢 Deployment

### **1. Deploy API to Vercel**
```bash
cd apps/api
vercel --prod
```

Set environment variables in Vercel dashboard or CLI:
```bash
vercel env add DATABASE_URL production
vercel env add SENDGRID_API_KEY production
# ... add all env vars
```

### **2. Deploy Worker to Render**
- Push code to GitHub
- In Render dashboard:
  - New → Background Worker
  - Connect GitHub repo
  - Build: `npm install`
  - Start: `node worker/index.js`
  - Add all environment variables

### **3. Deploy Landing Page to Hostinger**
```bash
cd apps/landing
chmod +x deploy.sh
./deploy.sh
```

Or manually via FTP:
- Upload `apps/landing/*` to `public_html/`

---

## 🔒 Security Checklist

- [ ] **TLS/SSL**: Ensure all endpoints use HTTPS (Vercel provides this automatically)
- [ ] **Rate Limiting**: Implement rate limiting on API routes (see `modules/shared/middleware/rateLimit.js`)
- [ ] **Input Validation**: Validate all inputs with Zod schemas
- [ ] **JWT Rotation**: Rotate `JWT_SECRET` every 90 days
- [ ] **API Key Rotation**: Rotate external API keys (SendGrid, Twilio) quarterly
- [ ] **Database Encryption**: Enable encryption at rest (Supabase/Neon default)
- [ ] **Secrets Management**: Never commit `.env` files; use Vercel/Render env vars
- [ ] **CORS Configuration**: Restrict origins in production
- [ ] **SQL Injection**: Use Prisma parameterized queries (ORM handles this)
- [ ] **XSS Protection**: Sanitize HTML in email templates
- [ ] **CSRF Tokens**: Implement for state-changing operations
- [ ] **Audit Logs**: Log all sensitive operations (invoice send, automation trigger)

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run linter
npm run lint

# Type check
npm run type-check
```

---

## 📈 Scaling Path

### **Current (Prototype - $0-20/month)**
- Hostinger static landing
- Vercel free tier (100GB bandwidth)
- Render free tier (750 hours/month)
- Supabase free (500MB database)
- In-memory queue

### **Growth (1-100 users - $50-150/month)**
- Upgrade Vercel to Pro ($20/month)
- Render paid worker ($7/month)
- Supabase Pro ($25/month)
- Upstash Redis ($10/month)
- Backblaze B2 (pay-as-you-go)

### **Scale (100+ users - $200+/month)**
- Dedicated Postgres (AWS RDS or managed)
- BullMQ with Redis cluster
- CDN for PDF assets (Cloudflare)
- Horizontal worker scaling
- Monitoring (Sentry, LogRocket)

---

## 🏗️ Architecture Rationale

This stack is optimized for **single-developer, low-cost, future-proof** SaaS development:

**Why This Stack Works:**
- **Monorepo Modularity**: Modules (`invoices`, `automations`, `shared`) are independently extractable into microservices when needed, avoiding premature architecture complexity.
- **Static Landing + Serverless**: Hostinger ($2-5/month) hosts the static landing page with zero server maintenance, while Vercel's serverless functions handle API routes with automatic scaling and generous free tier (100GB/month bandwidth).
- **Worker Separation**: Background jobs (PDF generation, email/WhatsApp) run in an isolated Node.js worker (Render free tier: 750 hours/month) preventing API timeouts and enabling independent scaling.
- **Cost-Effective Services**: Supabase/Neon (free Postgres), Backblaze B2 ($0.005/GB storage vs AWS S3's $0.023), SendGrid (100 emails/day free), and in-memory queue (upgradeable to Upstash Redis 10k ops/day free) keep monthly costs under $20 initially.
- **Developer Velocity**: Next.js + Prisma ORM + TypeScript provide type safety and rapid iteration, while the monorepo structure allows running everything locally with a single `npm install`.
- **Future-Proof**: When revenue justifies it, extract modules into dedicated services, swap in-memory queue for Redis/BullMQ, migrate to Kubernetes, or adopt event streaming—all without rewriting core business logic.

---

## 📝 License

MIT License - See LICENSE file for details.

---

## 🤝 Support

For issues or questions:
- GitHub Issues: https://github.com/your-username/oryxa/issues
- Email: support@oryxa.com
- Docs: https://docs.oryxa.com
