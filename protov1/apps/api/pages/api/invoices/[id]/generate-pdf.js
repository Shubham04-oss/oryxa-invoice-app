// POST /api/invoices/:id/generate-pdf - Generate PDF for Invoice

import { getInvoice } from '../../../../modules/invoices/service.js';
import { updateInvoicePdf } from '../../../../modules/invoices/service.js';
import { authenticate } from '../../../../modules/shared/auth/middleware.js';
import { generateInvoicePDF } from '../../../../modules/shared/pdf/generator.js';

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

    // Get invoice with tenant
    const invoice = await getInvoice(id, user.tenantId);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    // Generate PDF
    console.log(`[PDF] Generating PDF for invoice ${invoice.invoiceNumber}...`);
    const pdfUrl = await generateInvoicePDF(invoice, user.tenant);

    // Update invoice with PDF URL
    await updateInvoicePdf(invoice.id, pdfUrl);

    console.log(`[PDF] PDF generated successfully: ${pdfUrl}`);

    return res.status(200).json({
      success: true,
      pdfUrl,
      message: 'PDF generated successfully',
    });
    
  } catch (error) {
    console.error('Generate PDF error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
    });
  }
}
