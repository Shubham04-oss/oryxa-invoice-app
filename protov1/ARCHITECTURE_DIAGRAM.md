# Oryxa System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          ORYXA ARCHITECTURE                                  │
│                     Invoice + Automation SaaS Platform                       │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                                        │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────────────┐      ┌──────────────────────┐                      │
│  │  Landing Page       │      │  Admin Dashboard     │                      │
│  │  (Hostinger)        │      │  (Future - Next.js)  │                      │
│  │  - Marketing        │      │  - Invoice Mgmt      │                      │
│  │  - Pricing          │      │  - Automation UI     │                      │
│  │  - Static HTML/CSS  │      │  - Analytics         │                      │
│  └─────────────────────┘      └──────────────────────┘                      │
│           │                              │                                   │
│           │                              │                                   │
│           ▼                              ▼                                   │
└───────────────────────────────────────────────────────────────────────────────┘
            │                              │
            │                              │ JWT Token
            │                              │
┌───────────┴──────────────────────────────┴───────────────────────────────────┐
│                           API LAYER (Vercel)                                  │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │  Next.js API Routes (Serverless Functions)                         │     │
│  ├────────────────────────────────────────────────────────────────────┤     │
│  │                                                                     │     │
│  │  ┌──────────────────┐  ┌─────────────────┐  ┌──────────────────┐ │     │
│  │  │ /api/invoices    │  │ /api/automations│  │ /api/auth        │ │     │
│  │  │ - POST (create)  │  │ - POST simulate │  │ - POST login     │ │     │
│  │  │ - GET  (list)    │  │ - GET  list     │  │ - POST register  │ │     │
│  │  │ - PATCH (update) │  │ - POST trigger  │  │ - GET  profile   │ │     │
│  │  │ - DELETE         │  └─────────────────┘  └──────────────────┘ │     │
│  │  └──────────────────┘                                             │     │
│  │           │                        │                   │           │     │
│  └───────────┼────────────────────────┼───────────────────┼──────────┘     │
│              │                        │                   │                 │
└──────────────┼────────────────────────┼───────────────────┼─────────────────┘
               │                        │                   │
               ▼                        ▼                   ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                        BUSINESS LOGIC LAYER                                   │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌────────────────────┐  ┌─────────────────────┐  ┌────────────────────┐   │
│  │ Invoices Module    │  │ Automations Module  │  │ Shared Module      │   │
│  ├────────────────────┤  ├─────────────────────┤  ├────────────────────┤   │
│  │ - service.js       │  │ - engine.js         │  │ - auth/            │   │
│  │ - validation.js    │  │ - triggers.js       │  │ - queue/           │   │
│  │ - utils.js         │  │ - actions.js        │  │ - storage/         │   │
│  └────────┬───────────┘  └──────────┬──────────┘  │ - messaging/       │   │
│           │                         │              │ - pdf/             │   │
│           │      ┌──────────────────┘              │ - validation/      │   │
│           │      │                                 └────────────────────┘   │
│           ▼      ▼                                                           │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                    Job Queue (In-Memory)                            │    │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐               │    │
│  │  │ PDF Generate │ │ Send Email   │ │ Send WhatsApp│  ... more     │    │
│  │  └──────────────┘ └──────────────┘ └──────────────┘               │    │
│  │                                                                     │    │
│  │  Upgrade Path → Redis/Upstash (BullMQ) for production             │    │
│  └─────────────────────────────────┬───────────────────────────────────┘    │
└────────────────────────────────────┼──────────────────────────────────────┘
                                     │
                                     ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                        WORKER LAYER (Render/Railway)                          │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │  Background Worker (Node.js Process)                               │     │
│  ├────────────────────────────────────────────────────────────────────┤     │
│  │                                                                     │     │
│  │  Main Loop:                                                         │     │
│  │  1. Poll queue for jobs                                            │     │
│  │  2. Process job based on type                                      │     │
│  │  3. Update job status in database                                  │     │
│  │  4. Retry on failure (max 3 attempts)                              │     │
│  │                                                                     │     │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐   │     │
│  │  │ PDF Processor   │  │ Email Processor │  │ WhatsApp Proc   │   │     │
│  │  │ - Generate PDF  │  │ - SendGrid API  │  │ - Meta/Twilio   │   │     │
│  │  │ - Upload to B2  │  │ - Attachments   │  │ - Media support │   │     │
│  │  │ - Update DB     │  │ - Templates     │  │ - Delivery conf │   │     │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘   │     │
│  └────────────────────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────────────────────┘
                │                    │                    │
                ▼                    ▼                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                        EXTERNAL SERVICES LAYER                                │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐                │
│  │ Backblaze B2   │  │ SendGrid       │  │ WhatsApp API   │                │
│  │ - PDF Storage  │  │ - Email Send   │  │ - Message Send │                │
│  │ - 10GB Free    │  │ - 100/day Free │  │ - Free Tier    │                │
│  └────────────────┘  └────────────────┘  └────────────────┘                │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────────┐
│                        DATA LAYER (Supabase/Neon)                             │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │  PostgreSQL Database (via Prisma ORM)                              │     │
│  ├────────────────────────────────────────────────────────────────────┤     │
│  │                                                                     │     │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐  ┌─────────────┐   │     │
│  │  │ Tenant   │  │ User     │  │ Invoice      │  │ InvoiceItem │   │     │
│  │  └──────────┘  └──────────┘  └──────────────┘  └─────────────┘   │     │
│  │                                                                     │     │
│  │  ┌──────────┐  ┌─────────────────┐  ┌─────────────┐              │     │
│  │  │ Payment  │  │ Automation      │  │ JobHistory  │              │     │
│  │  └──────────┘  └─────────────────┘  └─────────────┘              │     │
│  │                                                                     │     │
│  │  Features:                                                          │     │
│  │  - Multi-tenancy with tenant isolation                             │     │
│  │  - Automatic timestamps (createdAt, updatedAt)                     │     │
│  │  - Indexes for performance                                         │     │
│  │  - Cascade deletes for data consistency                            │     │
│  │  - Migration version control                                       │     │
│  └────────────────────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════
                              DATA FLOW EXAMPLES
═══════════════════════════════════════════════════════════════════════════════

Example 1: Create Invoice with PDF Generation
──────────────────────────────────────────────

User → POST /api/invoices → Invoice Service
                              │
                              ├─→ Validate input (Zod)
                              ├─→ Calculate totals
                              ├─→ Save to database (Prisma)
                              ├─→ Enqueue PDF job
                              └─→ Return invoice + jobId

Worker → Poll queue
         │
         ├─→ Process PDF job
         ├─→ Generate PDF (pdf-lib)
         ├─→ Upload to B2 Storage
         ├─→ Update invoice.pdfUrl
         └─→ Mark job complete


Example 2: Automation Trigger (Overdue Invoice)
────────────────────────────────────────────────

Cron/Manual → POST /api/automations/simulate
               │
               ├─→ Find matching automations
               ├─→ Check conditions (daysOverdue > 7)
               ├─→ Execute actions:
               │    ├─→ Enqueue email job
               │    └─→ Enqueue WhatsApp job
               └─→ Log execution

Worker → Process email job
         │
         ├─→ Render template
         ├─→ Send via SendGrid
         └─→ Mark complete

Worker → Process WhatsApp job
         │
         ├─→ Format message
         ├─→ Send via Meta/Twilio
         └─→ Mark complete


Example 3: Send Invoice via WhatsApp
──────────────────────────────────────

User → POST /api/invoices/inv_123/send
       │
       ├─→ Validate invoice exists
       ├─→ Check PDF is generated
       ├─→ Enqueue WhatsApp job
       ├─→ Update invoice.status = 'sent'
       └─→ Return jobId

Worker → Process WhatsApp job
         │
         ├─→ Get invoice details
         ├─→ Format message with variables
         ├─→ Attach PDF URL
         ├─→ Send via WhatsApp API
         └─→ Mark complete


═══════════════════════════════════════════════════════════════════════════════
                              SCALING STRATEGY
═══════════════════════════════════════════════════════════════════════════════

Phase 1: MVP (0-100 users)
───────────────────────────
  Monorepo, In-memory queue
  Vercel (free) + Render (free) + Hostinger ($5)
  Cost: $5-20/month
  ✓ Can handle 10-50 invoices/day

Phase 2: Growth (100-1,000 users)
──────────────────────────────────
  Same structure, add Redis queue
  Vercel Pro + Render Starter + Upstash Redis
  Cost: $90-150/month
  ✓ Can handle 500+ invoices/day

Phase 3: Scale (1,000-10,000 users)
────────────────────────────────────
  Extract modules to microservices
  Multiple workers, dedicated DB
  Cost: $500-1,000/month
  ✓ Can handle 5,000+ invoices/day

Phase 4: Enterprise (10,000+ users)
────────────────────────────────────
  Kubernetes, event streaming (Kafka)
  Multi-region, load balancing
  Cost: $2,000-5,000/month
  ✓ Can handle 50,000+ invoices/day


═══════════════════════════════════════════════════════════════════════════════
                              SECURITY LAYERS
═══════════════════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────────────────┐
│ Layer 1: Network (HTTPS/TLS)                                                 │
│ - Vercel auto-provisions SSL certificates                                    │
│ - All traffic encrypted in transit                                           │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ Layer 2: Authentication (JWT + bcrypt)                                       │
│ - JWT tokens with 7-day expiration                                           │
│ - Passwords hashed with bcrypt (10 rounds)                                   │
│ - Token validation on every request                                          │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ Layer 3: Authorization (RBAC + Multi-Tenancy)                                │
│ - Role-based permissions (admin, member, viewer)                             │
│ - Tenant isolation at database level                                         │
│ - All queries scoped to user's tenant                                        │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ Layer 4: Input Validation (Zod)                                              │
│ - All inputs validated against schemas                                       │
│ - Type coercion and sanitization                                             │
│ - Detailed error messages                                                    │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ Layer 5: Database Security (Prisma + PostgreSQL)                             │
│ - Parameterized queries (SQL injection proof)                                │
│ - Encryption at rest (Supabase/Neon default)                                 │
│ - Regular backups with point-in-time restore                                 │
└──────────────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════
                           DEPLOYMENT TOPOLOGY
═══════════════════════════════════════════════════════════════════════════════

                       ┌───────────────────┐
                       │   GitHub Repo     │
                       │   (Source Code)   │
                       └─────────┬─────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
    ┌─────────────────┐ ┌──────────────┐ ┌─────────────────┐
    │  Vercel         │ │  Render      │ │  Hostinger      │
    │  (API Routes)   │ │  (Worker)    │ │  (Landing)      │
    │                 │ │              │ │                 │
    │  Auto-deploy on │ │  Auto-deploy │ │  FTP Upload     │
    │  push to main   │ │  from GitHub │ │  (Manual/Auto)  │
    └─────────┬───────┘ └──────┬───────┘ └─────────────────┘
              │                │
              └────────┬───────┘
                       │
                       ▼
            ┌──────────────────────┐
            │  Supabase/Neon       │
            │  (PostgreSQL DB)     │
            │                      │
            │  Connection via SSL  │
            └──────────────────────┘


Custom Domains:
- Landing:  https://yourdomain.com
- API:      https://api.yourdomain.com
- Admin:    https://app.yourdomain.com (future)


═══════════════════════════════════════════════════════════════════════════════

Legend:
  │  Synchronous call (request/response)
  ┆  Asynchronous job (queued)
  ▼  Data flow direction
  ─  Connection/relationship

Created: October 3, 2025
Version: 1.0.0
```
