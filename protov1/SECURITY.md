# Oryxa Security Checklist

## 🔒 Authentication & Authorization

- [ ] **JWT Secret Rotation**: Rotate `JWT_SECRET` every 90 days
- [ ] **Password Policy**: Minimum 8 characters, uppercase, lowercase, number, special char
- [ ] **Password Hashing**: Use bcrypt with salt rounds >= 10
- [ ] **Session Management**: Implement session timeout (7 days default)
- [ ] **Multi-Factor Authentication**: Enable 2FA for admin accounts (optional but recommended)
- [ ] **Role-Based Access Control**: Enforce least privilege principle

## 🌐 API Security

- [ ] **HTTPS Only**: Enforce TLS 1.2+ for all endpoints
- [ ] **CORS Configuration**: Restrict origins in production
  ```js
  // next.config.js
  headers: [
    {
      key: 'Access-Control-Allow-Origin',
      value: 'https://yourdomain.com'
    }
  ]
  ```
- [ ] **Rate Limiting**: Implement per-IP and per-user limits
  - API: 100 requests/15min
  - Auth: 5 login attempts/15min
- [ ] **Input Validation**: Validate all inputs with Zod schemas
- [ ] **SQL Injection Prevention**: Use Prisma ORM parameterized queries
- [ ] **XSS Prevention**: Sanitize HTML in emails and PDF templates
- [ ] **CSRF Protection**: Implement CSRF tokens for state-changing operations

## 🗄️ Database Security

- [ ] **Connection Encryption**: Use SSL for database connections
- [ ] **Encryption at Rest**: Enable in Supabase/Neon settings
- [ ] **Regular Backups**: Daily automated backups with 30-day retention
- [ ] **Least Privilege**: Database user has only required permissions
- [ ] **Audit Logging**: Log all sensitive operations (invoice send, payment, etc.)

## 🔑 Secrets Management

- [ ] **Environment Variables**: Never commit `.env` to version control
- [ ] **Vercel Environment Variables**: Use Vercel dashboard for production secrets
- [ ] **API Key Rotation Schedule**:
  - SendGrid: Quarterly
  - Backblaze B2: Quarterly
  - Payment gateway: On breach notification
- [ ] **Webhook Signing**: Verify webhook signatures
  ```js
  const signature = req.headers['x-webhook-signature'];
  const isValid = verifySignature(req.body, signature, WEBHOOK_SECRET);
  ```

## 📦 Storage Security

- [ ] **Private Buckets**: Set Backblaze B2 buckets to private by default
- [ ] **Signed URLs**: Use time-limited signed URLs for PDF downloads
- [ ] **File Type Validation**: Restrict uploads to allowed types
- [ ] **Virus Scanning**: Implement virus scanning for user uploads (if applicable)

## 📧 Email & Messaging Security

- [ ] **SPF/DKIM/DMARC**: Configure email authentication records
- [ ] **Rate Limiting**: Max 100 emails/hour per tenant
- [ ] **Unsubscribe Links**: Include in all automated emails
- [ ] **Content Sanitization**: Escape user-generated content in templates

## 🚨 Monitoring & Incident Response

- [ ] **Error Logging**: Use Sentry for production error tracking
- [ ] **Security Alerts**: Monitor failed login attempts, unusual API usage
- [ ] **Uptime Monitoring**: Use UptimeRobot or similar (free tier)
- [ ] **Incident Response Plan**: Document steps for data breach, DDoS, etc.
- [ ] **Security Contact**: security@yourdomain.com

## 🔄 Updates & Patching

- [ ] **Dependency Updates**: Run `npm audit` weekly
- [ ] **Security Patches**: Apply critical patches within 48 hours
- [ ] **Automated Scanning**: Enable Dependabot on GitHub
- [ ] **Node.js Version**: Use LTS version (18.x or 20.x)

## ✅ Compliance (Optional but Recommended)

- [ ] **Privacy Policy**: Create and link in footer
- [ ] **Terms of Service**: Create and link in footer
- [ ] **GDPR Compliance**: Data export, deletion on request (if EU users)
- [ ] **PCI DSS**: If storing card data (use Stripe/Razorpay instead)
- [ ] **SOC 2**: For enterprise customers (use Vanta for automation)

## 🧪 Penetration Testing

- [ ] **OWASP Top 10**: Test for common vulnerabilities
- [ ] **Third-party Audit**: Consider annual security audit (when scaling)
- [ ] **Bug Bounty Program**: Implement when mature (HackerOne/Bugcrowd)

---

## Quick Security Setup (10 minutes)

1. **Generate strong JWT secret**:
   ```bash
   openssl rand -base64 32
   ```

2. **Enable rate limiting** (create `modules/shared/middleware/rateLimit.js`):
   ```js
   import rateLimit from 'express-rate-limit';
   
   export const apiLimiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100, // limit each IP to 100 requests per windowMs
     message: 'Too many requests from this IP'
   });
   ```

3. **Add security headers** in `next.config.js`:
   ```js
   headers: [
     {
       key: 'X-Frame-Options',
       value: 'DENY'
     },
     {
       key: 'X-Content-Type-Options',
       value: 'nosniff'
     },
     {
       key: 'Referrer-Policy',
       value: 'origin-when-cross-origin'
     }
   ]
   ```

4. **Enable Prisma connection encryption** in `schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
     // Add: ?sslmode=require
   }
   ```

5. **Setup Sentry error tracking**:
   ```bash
   npm install @sentry/nextjs
   npx @sentry/wizard -i nextjs
   ```

---

**Last Updated**: October 2025  
**Review Frequency**: Quarterly  
**Owner**: Security Team
