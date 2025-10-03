// POST /api/invoices - Create Invoice
// GET /api/invoices - List Invoices

import { createInvoice, listInvoices } from '../../../modules/invoices/service.js';
import { authenticate } from '../../../modules/shared/auth/middleware.js';
import { validateRequest } from '../../../modules/shared/validation/validator.js';
import { createInvoiceSchema } from '../../../modules/invoices/validation.js';
import { enqueueJob } from '../../../modules/shared/queue/jobQueue.js';

export default async function handler(req, res) {
  try {
    // Authentication
    const user = await authenticate(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { method } = req;

    // GET /api/invoices - List all invoices
    if (method === 'GET') {
      const { page = 1, limit = 20, status, search } = req.query;
      
      const result = await listInvoices({
        tenantId: user.tenantId,
        page: parseInt(page),
        limit: parseInt(limit),
        status,
        search,
      });

      return res.status(200).json(result);
    }

    // POST /api/invoices - Create new invoice
    if (method === 'POST') {
      // Validate input
      const validation = validateRequest(createInvoiceSchema, req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          error: 'Validation failed', 
          details: validation.errors 
        });
      }

      const invoiceData = {
        ...validation.data,
        tenantId: user.tenantId,
      };

      // Create invoice
      const invoice = await createInvoice(invoiceData);

      // Queue PDF generation job
      const jobId = await enqueueJob({
        type: 'pdf_generation',
        priority: 'high',
        payload: {
          invoiceId: invoice.id,
          tenantId: user.tenantId,
        },
      });

      return res.status(201).json({
        ...invoice,
        jobId,
        message: 'Invoice created successfully. PDF generation queued.',
      });
    }

    // Method not allowed
    return res.status(405).json({ error: 'Method not allowed' });
    
  } catch (error) {
    console.error('Invoice API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
    });
  }
}
