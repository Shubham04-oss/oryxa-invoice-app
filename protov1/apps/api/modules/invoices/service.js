// Invoice Business Logic

import { PrismaClient } from '@prisma/client';
import { generateInvoiceNumber } from './utils.js';

const prisma = new PrismaClient();

/**
 * Create a new invoice
 */
export async function createInvoice(data) {
  const {
    tenantId,
    clientName,
    clientEmail,
    clientPhone,
    clientAddress,
    items,
    dueDate,
    currency = 'USD',
    notes,
    terms,
  } = data;

  // Calculate totals
  let subtotal = 0;
  let taxTotal = 0;
  let discountTotal = 0;

  const processedItems = items.map((item, index) => {
    const itemSubtotal = item.quantity * item.unitPrice;
    const itemDiscount = (itemSubtotal * (item.discount || 0)) / 100;
    const itemTaxable = itemSubtotal - itemDiscount;
    const itemTax = (itemTaxable * (item.taxRate || 0)) / 100;
    const itemTotal = itemTaxable + itemTax;

    subtotal += itemSubtotal;
    discountTotal += itemDiscount;
    taxTotal += itemTax;

    return {
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      taxRate: item.taxRate || 0,
      discount: item.discount || 0,
      total: itemTotal,
      order: index,
    };
  });

  const total = subtotal - discountTotal + taxTotal;

  // Generate invoice number
  const invoiceNumber = await generateInvoiceNumber(tenantId);

  // Create invoice with items
  const invoice = await prisma.invoice.create({
    data: {
      tenantId,
      invoiceNumber,
      clientName,
      clientEmail,
      clientPhone,
      clientAddress,
      dueDate: new Date(dueDate),
      currency,
      subtotal,
      taxTotal,
      discountTotal,
      total,
      notes,
      terms,
      items: {
        create: processedItems,
      },
    },
    include: {
      items: true,
    },
  });

  return invoice;
}

/**
 * List invoices with filters
 */
export async function listInvoices({ tenantId, page = 1, limit = 20, status, search }) {
  const skip = (page - 1) * limit;

  const where = {
    tenantId,
    ...(status && { status }),
    ...(search && {
      OR: [
        { invoiceNumber: { contains: search, mode: 'insensitive' } },
        { clientName: { contains: search, mode: 'insensitive' } },
        { clientEmail: { contains: search, mode: 'insensitive' } },
      ],
    }),
  };

  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
      },
    }),
    prisma.invoice.count({ where }),
  ]);

  return {
    data: invoices,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get single invoice
 */
export async function getInvoice(id, tenantId) {
  return prisma.invoice.findFirst({
    where: { id, tenantId },
    include: {
      items: true,
      payments: true,
    },
  });
}

/**
 * Update invoice
 */
export async function updateInvoice(id, tenantId, data) {
  return prisma.invoice.update({
    where: { id, tenantId },
    data,
    include: {
      items: true,
      payments: true,
    },
  });
}

/**
 * Update invoice status
 */
export async function updateInvoiceStatus(id, tenantId, status) {
  const updateData = { status };
  
  if (status === 'sent' && !updateData.sentAt) {
    updateData.sentAt = new Date();
  }
  
  if (status === 'paid' && !updateData.paidAt) {
    updateData.paidAt = new Date();
  }

  return prisma.invoice.update({
    where: { id, tenantId },
    data: updateData,
  });
}

/**
 * Delete invoice
 */
export async function deleteInvoice(id, tenantId) {
  return prisma.invoice.delete({
    where: { id, tenantId },
  });
}

/**
 * Update PDF URL after generation
 */
export async function updateInvoicePdf(invoiceId, pdfUrl) {
  return prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      pdfUrl,
      pdfGeneratedAt: new Date(),
    },
  });
}
