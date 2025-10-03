// POST /api/invoices/:id/send - Send Invoice via Email/WhatsApp

import { getInvoice, updateInvoiceStatus } from '../../../../modules/invoices/service.js';
import { authenticate } from '../../../../modules/shared/auth/middleware.js';
import { enqueueJob } from '../../../../modules/shared/queue/jobQueue.js';
import { z } from 'zod';

const sendInvoiceSchema = z.object({
  method: z.enum(['email', 'whatsapp']),
  recipient: z.string().min(1, 'Recipient is required'),
  message: z.string().optional(),
});

export default async function handler(req, res) {
  try {
    // Authentication
    const user = await authenticate(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id } = req.query;

    // Validate input
    const validation = sendInvoiceSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validation.error.flatten(),
      });
    }

  const { method, recipient, message } = validation.data;

    // Get invoice
    const invoice = await getInvoice(id, user.tenantId);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    // Check if PDF exists
    if (!invoice.pdfUrl) {
      return res.status(400).json({ 
        error: 'PDF not generated yet. Please wait or regenerate.',
      });
    }

    // Queue send job
    const basePayload = {
      invoiceId: invoice.id,
      tenantId: user.tenantId,
      pdfUrl: invoice.pdfUrl,
    };

    const jobId = await enqueueJob({
      type: method === 'email' ? 'send_email' : 'send_whatsapp',
      priority: 'high',
      payload:
        method === 'email'
          ? {
              ...basePayload,
              to: recipient,
            }
          : {
              ...basePayload,
              to: recipient,
              message: message || `Your invoice ${invoice.invoiceNumber} is ready.`,
            },
    });

    // Update invoice status
    await updateInvoiceStatus(id, user.tenantId, 'sent');

    return res.status(200).json({
      success: true,
      jobId,
      message: `Invoice queued for sending via ${method}`,
    });
    
  } catch (error) {
    console.error('Send invoice error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
    });
  }
}
