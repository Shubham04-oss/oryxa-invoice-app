// Invoice Utility Functions

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Generate unique invoice number
 * Format: INV-YYYY-NNNN
 */
export async function generateInvoiceNumber(tenantId) {
  const year = new Date().getFullYear();
  const prefix = `INV-${year}-`;

  // Get last invoice number for this year
  const lastInvoice = await prisma.invoice.findFirst({
    where: {
      tenantId,
      invoiceNumber: {
        startsWith: prefix,
      },
    },
    orderBy: {
      invoiceNumber: 'desc',
    },
  });

  let sequence = 1;
  if (lastInvoice) {
    const lastSequence = parseInt(lastInvoice.invoiceNumber.split('-')[2]);
    sequence = lastSequence + 1;
  }

  const invoiceNumber = `${prefix}${sequence.toString().padStart(4, '0')}`;
  return invoiceNumber;
}

/**
 * Calculate invoice totals
 */
export function calculateInvoiceTotals(items) {
  let subtotal = 0;
  let taxTotal = 0;
  let discountTotal = 0;

  items.forEach((item) => {
    const itemSubtotal = item.quantity * item.unitPrice;
    const itemDiscount = (itemSubtotal * (item.discount || 0)) / 100;
    const itemTaxable = itemSubtotal - itemDiscount;
    const itemTax = (itemTaxable * (item.taxRate || 0)) / 100;

    subtotal += itemSubtotal;
    discountTotal += itemDiscount;
    taxTotal += itemTax;
  });

  const total = subtotal - discountTotal + taxTotal;

  return {
    subtotal,
    taxTotal,
    discountTotal,
    total,
  };
}

/**
 * Format currency amount
 */
export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Check if invoice is overdue
 */
export function isInvoiceOverdue(invoice) {
  if (invoice.status === 'paid' || invoice.status === 'cancelled') {
    return false;
  }
  return new Date(invoice.dueDate) < new Date();
}

/**
 * Get days until due (negative if overdue)
 */
export function getDaysUntilDue(invoice) {
  const today = new Date();
  const dueDate = new Date(invoice.dueDate);
  const diffTime = dueDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
