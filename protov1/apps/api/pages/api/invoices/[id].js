// API Route: GET /api/invoices/:id - Get Invoice Details
// PATCH /api/invoices/:id - Update Invoice
// DELETE /api/invoices/:id - Delete Invoice

import { getInvoice, updateInvoice, deleteInvoice } from '../../../modules/invoices/service.js';
import { authenticate } from '../../../modules/shared/auth/middleware.js';

export default async function handler(req, res) {
  try {
    // Authentication
    const user = await authenticate(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { method, query } = req;
    const { id } = query;

    // GET /api/invoices/:id - Get invoice
    if (method === 'GET') {
      const invoice = await getInvoice(id, user.tenantId);
      
      if (!invoice) {
        return res.status(404).json({ error: 'Invoice not found' });
      }

      return res.status(200).json(invoice);
    }

    // PATCH /api/invoices/:id - Update invoice
    if (method === 'PATCH') {
      const updatedInvoice = await updateInvoice(id, user.tenantId, req.body);
      
      if (!updatedInvoice) {
        return res.status(404).json({ error: 'Invoice not found' });
      }

      return res.status(200).json(updatedInvoice);
    }

    // DELETE /api/invoices/:id - Delete invoice
    if (method === 'DELETE') {
      const deleted = await deleteInvoice(id, user.tenantId);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Invoice not found' });
      }

      return res.status(200).json({ 
        success: true,
        message: 'Invoice deleted successfully',
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
