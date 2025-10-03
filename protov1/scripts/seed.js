// Database seeding script - Sample data for development

import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create tenant
  const tenant = await prisma.tenant.upsert({
    where: { email: 'demo@oryxa.com' },
    update: {},
    create: {
      name: 'Oryxa Demo Company',
      slug: 'oryxa-demo',
      email: 'demo@oryxa.com',
      address: '123 Business St, San Francisco, CA 94102',
      taxId: 'TAX-123456',
      currency: 'USD',
      plan: 'pro',
      status: 'active',
    },
  });

  console.log('✓ Created tenant:', tenant.name);

  // Create user
  const hashedPassword = await bcrypt.hash('demo123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'admin@oryxa.com' },
    update: {},
    create: {
      email: 'admin@oryxa.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'admin',
      tenantId: tenant.id,
    },
  });

  console.log('✓ Created user:', user.email, '(password: demo123)');

  // Create sample invoices
  const invoice1 = await prisma.invoice.create({
    data: {
      tenantId: tenant.id,
      invoiceNumber: 'INV-2025-0001',
      clientName: 'Acme Corporation',
      clientEmail: 'billing@acme.com',
      clientPhone: '+1234567890',
      clientAddress: '456 Client Ave, New York, NY 10001',
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: 'draft',
      currency: 'USD',
      subtotal: 5000,
      taxTotal: 900,
      discountTotal: 0,
      total: 5900,
      notes: 'Thank you for your business!',
      terms: 'Payment due within 30 days.',
      items: {
        create: [
          {
            description: 'Website Development - Initial Design',
            quantity: 1,
            unitPrice: 3000,
            taxRate: 18,
            discount: 0,
            total: 3540,
            order: 0,
          },
          {
            description: 'Website Development - Backend Integration',
            quantity: 1,
            unitPrice: 2000,
            taxRate: 18,
            discount: 0,
            total: 2360,
            order: 1,
          },
        ],
      },
    },
  });

  console.log('✓ Created invoice:', invoice1.invoiceNumber);

  const invoice2 = await prisma.invoice.create({
    data: {
      tenantId: tenant.id,
      invoiceNumber: 'INV-2025-0002',
      clientName: 'TechStart Inc',
      clientEmail: 'accounts@techstart.com',
      clientPhone: '+1987654321',
      issueDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
      dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago (overdue)
      status: 'overdue',
      currency: 'USD',
      subtotal: 2500,
      taxTotal: 450,
      discountTotal: 250,
      total: 2700,
      items: {
        create: [
          {
            description: 'Consulting Services - Q1 2025',
            quantity: 10,
            unitPrice: 250,
            taxRate: 18,
            discount: 10,
            total: 2700,
            order: 0,
          },
        ],
      },
    },
  });

  console.log('✓ Created invoice:', invoice2.invoiceNumber);

  // Create sample automation
  const automation = await prisma.automation.create({
    data: {
      tenantId: tenant.id,
      name: 'Overdue Invoice Reminder',
      description: 'Send reminder email when invoice is 7 days overdue',
      enabled: true,
      trigger: {
        type: 'invoice_overdue',
        conditions: [
          {
            field: 'daysOverdue',
            operator: 'greater_than',
            value: 7,
          },
        ],
      },
      actions: [
        {
          type: 'send_email',
          config: {
            to: '{{clientEmail}}',
            subject: 'Payment Reminder: Invoice {{invoiceNumber}}',
            template: 'Hi {{clientName}}, your invoice {{invoiceNumber}} is overdue by {{daysOverdue}} days. Please pay at your earliest convenience.',
          },
        },
        {
          type: 'send_whatsapp',
          config: {
            to: '{{clientPhone}}',
            message: 'Reminder: Invoice {{invoiceNumber}} is overdue. Amount: {{total}}',
          },
        },
      ],
    },
  });

  console.log('✓ Created automation:', automation.name);

  console.log('\n✅ Seeding complete!');
  console.log('\nLogin credentials:');
  console.log('  Email: admin@oryxa.com');
  console.log('  Password: demo123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
