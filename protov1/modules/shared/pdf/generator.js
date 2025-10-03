// PDF Generation Helper using pdf-lib

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { formatCurrency } from '../../invoices/utils.js';
import { uploadFile } from '../storage/storage.js';

/**
 * Generate PDF for invoice
 */
export async function generateInvoicePDF(invoice, tenant) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const fontSize = 10;
  const titleFontSize = 20;
  let y = height - 50;

  // Header - Company Info
  page.drawText(tenant.name || 'Your Company', {
    x: 50,
    y,
    size: titleFontSize,
    font: fontBold,
    color: rgb(0, 0, 0),
  });
  y -= 25;

  if (tenant.address) {
    page.drawText(tenant.address, { x: 50, y, size: fontSize, font });
    y -= 15;
  }

  if (tenant.email) {
    page.drawText(tenant.email, { x: 50, y, size: fontSize, font });
    y -= 15;
  }

  if (tenant.taxId) {
    page.drawText(`Tax ID: ${tenant.taxId}`, { x: 50, y, size: fontSize, font });
    y -= 30;
  } else {
    y -= 15;
  }

  // Invoice Title
  page.drawText('INVOICE', {
    x: width - 150,
    y: height - 50,
    size: 24,
    font: fontBold,
    color: rgb(0.2, 0.2, 0.8),
  });

  // Invoice Details (right aligned)
  y = height - 90;
  const rightX = width - 200;

  page.drawText(`Invoice #: ${invoice.invoiceNumber}`, {
    x: rightX,
    y,
    size: fontSize,
    font: fontBold,
  });
  y -= 15;

  page.drawText(`Date: ${new Date(invoice.issueDate).toLocaleDateString()}`, {
    x: rightX,
    y,
    size: fontSize,
    font,
  });
  y -= 15;

  page.drawText(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, {
    x: rightX,
    y,
    size: fontSize,
    font,
  });

  // Bill To
  y = height - 180;
  page.drawText('Bill To:', { x: 50, y, size: fontSize, font: fontBold });
  y -= 15;

  page.drawText(invoice.clientName, { x: 50, y, size: fontSize, font: fontBold });
  y -= 15;

  page.drawText(invoice.clientEmail, { x: 50, y, size: fontSize, font });
  y -= 15;

  if (invoice.clientPhone) {
    page.drawText(invoice.clientPhone, { x: 50, y, size: fontSize, font });
    y -= 15;
  }

  if (invoice.clientAddress) {
    page.drawText(invoice.clientAddress, { x: 50, y, size: fontSize, font });
    y -= 20;
  } else {
    y -= 5;
  }

  // Items Table
  y -= 20;
  const tableTop = y;

  // Table Header
  page.drawRectangle({
    x: 40,
    y: y - 5,
    width: width - 80,
    height: 20,
    color: rgb(0.9, 0.9, 0.9),
  });

  page.drawText('Description', { x: 50, y, size: fontSize, font: fontBold });
  page.drawText('Qty', { x: 320, y, size: fontSize, font: fontBold });
  page.drawText('Rate', { x: 370, y, size: fontSize, font: fontBold });
  page.drawText('Tax', { x: 440, y, size: fontSize, font: fontBold });
  page.drawText('Amount', { x: 490, y, size: fontSize, font: fontBold });
  y -= 25;

  // Table Rows
  for (const item of invoice.items) {
    const itemTotal = formatCurrency(item.total, invoice.currency);
    const unitPrice = formatCurrency(item.unitPrice, invoice.currency);

    page.drawText(item.description.substring(0, 40), { x: 50, y, size: fontSize, font });
    page.drawText(item.quantity.toString(), { x: 320, y, size: fontSize, font });
    page.drawText(unitPrice, { x: 370, y, size: fontSize, font });
    page.drawText(`${item.taxRate}%`, { x: 440, y, size: fontSize, font });
    page.drawText(itemTotal, { x: 490, y, size: fontSize, font });
    y -= 20;

    if (y < 150) {
      // Create new page if needed
      const newPage = pdfDoc.addPage([595, 842]);
      y = height - 50;
    }
  }

  // Totals
  y -= 20;
  const totalsX = 400;

  page.drawText('Subtotal:', { x: totalsX, y, size: fontSize, font });
  page.drawText(formatCurrency(invoice.subtotal, invoice.currency), {
    x: 490,
    y,
    size: fontSize,
    font,
  });
  y -= 15;

  if (invoice.discountTotal > 0) {
    page.drawText('Discount:', { x: totalsX, y, size: fontSize, font });
    page.drawText(`-${formatCurrency(invoice.discountTotal, invoice.currency)}`, {
      x: 490,
      y,
      size: fontSize,
      font,
    });
    y -= 15;
  }

  page.drawText('Tax:', { x: totalsX, y, size: fontSize, font });
  page.drawText(formatCurrency(invoice.taxTotal, invoice.currency), {
    x: 490,
    y,
    size: fontSize,
    font,
  });
  y -= 20;

  // Total (bold)
  page.drawRectangle({
    x: totalsX - 10,
    y: y - 5,
    width: 155,
    height: 20,
    color: rgb(0.9, 0.9, 0.9),
  });

  page.drawText('TOTAL:', { x: totalsX, y, size: fontSize + 2, font: fontBold });
  page.drawText(formatCurrency(invoice.total, invoice.currency), {
    x: 490,
    y,
    size: fontSize + 2,
    font: fontBold,
  });

  // Footer - Notes & Terms
  y -= 40;
  if (invoice.notes) {
    page.drawText('Notes:', { x: 50, y, size: fontSize, font: fontBold });
    y -= 15;
    page.drawText(invoice.notes.substring(0, 100), { x: 50, y, size: fontSize - 1, font });
    y -= 20;
  }

  if (invoice.terms) {
    page.drawText('Terms & Conditions:', { x: 50, y, size: fontSize, font: fontBold });
    y -= 15;
    page.drawText(invoice.terms.substring(0, 100), { x: 50, y, size: fontSize - 1, font });
  }

  // Save PDF
  const pdfBytes = await pdfDoc.save();

  // Upload to storage
  const filename = `invoices/${invoice.tenantId}/${invoice.invoiceNumber}.pdf`;
  const pdfUrl = await uploadFile({
    buffer: Buffer.from(pdfBytes),
    filename,
    contentType: 'application/pdf',
  });

  return pdfUrl;
}

/**
 * Alternative: Generate PDF from HTML template (requires html-pdf-node)
 * Uncomment to use: npm install html-pdf-node
 */

// import htmlPdf from 'html-pdf-node';
//
// export async function generateInvoicePDFFromHTML(invoice, tenant) {
//   const html = `
//     <!DOCTYPE html>
//     <html>
//       <head>
//         <style>
//           body { font-family: Arial, sans-serif; }
//           .invoice-header { text-align: center; margin-bottom: 20px; }
//           .invoice-table { width: 100%; border-collapse: collapse; }
//           .invoice-table th, .invoice-table td { border: 1px solid #ddd; padding: 8px; }
//           .invoice-table th { background-color: #f2f2f2; }
//         </style>
//       </head>
//       <body>
//         <div class="invoice-header">
//           <h1>${tenant.name}</h1>
//           <p>Invoice #${invoice.invoiceNumber}</p>
//         </div>
//         <table class="invoice-table">
//           <tr>
//             <th>Description</th>
//             <th>Qty</th>
//             <th>Rate</th>
//             <th>Amount</th>
//           </tr>
//           ${invoice.items.map(item => `
//             <tr>
//               <td>${item.description}</td>
//               <td>${item.quantity}</td>
//               <td>${formatCurrency(item.unitPrice, invoice.currency)}</td>
//               <td>${formatCurrency(item.total, invoice.currency)}</td>
//             </tr>
//           `).join('')}
//         </table>
//         <h3>Total: ${formatCurrency(invoice.total, invoice.currency)}</h3>
//       </body>
//     </html>
//   `;
//
//   const options = { format: 'A4' };
//   const file = { content: html };
//   const pdfBuffer = await htmlPdf.generatePdf(file, options);
//
//   const filename = `invoices/${invoice.tenantId}/${invoice.invoiceNumber}.pdf`;
//   const pdfUrl = await uploadFile({
//     buffer: pdfBuffer,
//     filename,
//     contentType: 'application/pdf',
//   });
//
//   return pdfUrl;
// }
