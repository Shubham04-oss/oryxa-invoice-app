# Changelog

All notable changes to Oryxa will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned Features
- Multi-language support (i18n)
- Recurring invoice automation
- Client portal for viewing invoices
- Advanced analytics dashboard
- Mobile app (React Native)
- Payment reminders escalation
- Custom invoice templates
- Expense tracking
- Project time tracking

---

## [1.0.0] - 2025-10-03

### Added
- **Invoice Management**
  - Create, read, update, delete invoices
  - Multi-item invoices with tax and discount calculations
  - Automatic invoice numbering (INV-YYYY-NNNN format)
  - Invoice status tracking (draft, sent, viewed, paid, overdue, cancelled)
  - PDF generation using pdf-lib
  - Invoice history and audit trail

- **Automation Engine**
  - Event-driven workflow system
  - Trigger types: invoice_created, invoice_overdue, payment_received
  - Action types: send_email, send_whatsapp, send_webhook, update_field
  - Condition-based automation (field comparisons, operators)
  - Simulation mode for testing automations
  - Execution history with performance metrics

- **Background Job Processing**
  - In-memory job queue for prototyping
  - Job types: pdf_generation, send_email, send_whatsapp, send_webhook
  - Automatic retry with exponential backoff (3 attempts)
  - Job status tracking in database
  - Optional Redis/Upstash integration for production

- **Messaging Infrastructure**
  - Email sending via SendGrid
  - WhatsApp sending via Meta Business API
  - WhatsApp sending via Twilio (alternative)
  - Invoice email templates with HTML styling
  - Payment reminder templates
  - Attachment support for PDFs

- **Storage Integration**
  - Backblaze B2 S3-compatible storage
  - PDF file uploads with public URLs
  - Signed URL generation for private files
  - File versioning and lifecycle management

- **Authentication & Authorization**
  - JWT-based authentication
  - bcrypt password hashing
  - Role-based access control (admin, member, viewer)
  - Multi-tenant architecture with tenant isolation
  - Session management with 7-day expiration

- **Database Schema**
  - PostgreSQL with Prisma ORM
  - Tables: Tenant, User, Invoice, InvoiceItem, Payment, Automation, AutomationExecution, JobHistory, WebhookLog
  - Automatic migrations with version control
  - Connection pooling support
  - Indexes for performance optimization

- **API Routes**
  - `POST /api/invoices` - Create invoice
  - `GET /api/invoices` - List invoices with pagination
  - `GET /api/invoices/:id` - Get single invoice
  - `PATCH /api/invoices/:id` - Update invoice
  - `DELETE /api/invoices/:id` - Delete invoice
  - `POST /api/invoices/:id/send` - Send invoice via email/WhatsApp
  - `POST /api/automations/simulate` - Test automation workflows

- **Developer Experience**
  - Monorepo structure with workspaces
  - TypeScript support with strict mode
  - ESLint + Prettier for code quality
  - Husky pre-commit hooks
  - Docker Compose for local development
  - Sample data seeding script
  - Comprehensive API documentation

- **Deployment**
  - Vercel deployment for API routes
  - Render/Railway deployment for worker
  - Hostinger static hosting for landing page
  - GitHub Actions CI/CD pipeline
  - Environment variable management
  - Automated deployment on push to main

- **Documentation**
  - Comprehensive README with setup instructions
  - Architecture decision document
  - Security checklist
  - Deployment guide
  - API examples with cURL and Postman/Insomnia
  - Quick start guide

- **Landing Page**
  - Modern dark/glass aesthetic design
  - Responsive layout for mobile/tablet/desktop
  - Feature showcase sections
  - Pricing tiers (Starter, Pro, Enterprise)
  - Call-to-action buttons
  - Footer with legal links

### Security
- HTTPS enforcement
- Input validation with Zod schemas
- SQL injection prevention via Prisma
- XSS protection in templates
- CSRF token support
- Rate limiting middleware
- Security headers (X-Frame-Options, CSP, etc.)
- Secrets management via environment variables

### Performance
- Database query optimization with indexes
- Connection pooling for high concurrency
- Background job processing to prevent API timeouts
- PDF generation caching
- Lazy loading for large datasets

### Infrastructure
- PostgreSQL database (Supabase/Neon compatible)
- Redis queue (optional, Upstash compatible)
- S3-compatible storage (Backblaze B2)
- Serverless API deployment (Vercel)
- Container-based worker deployment (Render/Railway)

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.

---

## Support

- **Issues**: [GitHub Issues](https://github.com/your-username/oryxa/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/oryxa/discussions)
- **Email**: support@oryxa.com
- **Twitter**: [@OryxaHQ](https://twitter.com/OryxaHQ)

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
