// Invoice Validation Schemas

import { z } from 'zod';

export const createInvoiceSchema = z.object({
  clientName: z.string().min(1, 'Client name is required'),
  clientEmail: z.string().email('Invalid email address'),
  clientPhone: z.string().optional(),
  clientAddress: z.string().optional(),
  
  items: z.array(
    z.object({
      description: z.string().min(1, 'Description is required'),
      quantity: z.number().positive('Quantity must be positive'),
      unitPrice: z.number().nonnegative('Unit price must be non-negative'),
      taxRate: z.number().min(0).max(100).default(0),
      discount: z.number().min(0).max(100).default(0),
    })
  ).min(1, 'At least one item is required'),
  
  dueDate: z.string().refine((date) => {
    const dueDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate >= today;
  }, 'Due date must be today or in the future'),
  
  currency: z.string().length(3).default('USD'),
  notes: z.string().optional(),
  terms: z.string().optional(),
});

export const updateInvoiceSchema = z.object({
  clientName: z.string().min(1).optional(),
  clientEmail: z.string().email().optional(),
  clientPhone: z.string().optional(),
  clientAddress: z.string().optional(),
  dueDate: z.string().optional(),
  status: z.enum(['draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled']).optional(),
  notes: z.string().optional(),
  terms: z.string().optional(),
});
