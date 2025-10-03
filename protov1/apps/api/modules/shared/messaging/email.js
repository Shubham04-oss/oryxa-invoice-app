// Email Helper - SendGrid

import sgMail from '@sendgrid/mail';

const apiKey = process.env.SENDGRID_API_KEY;
const senderEmail = process.env.SENDGRID_SENDER;

if (apiKey) {
  sgMail.setApiKey(apiKey);
}

/**
 * Send email via SendGrid
 */
export async function sendEmail({ to, subject, html, attachments = [] }) {
  if (!apiKey) {
    throw new Error('SENDGRID_API_KEY not configured');
  }

  try {
    const msg = {
      to,
      from: senderEmail,
      subject,
      html,
      attachments: attachments.map((att) => ({
        content: att.content, // Base64 string
        filename: att.filename,
        type: att.type || 'application/pdf',
        disposition: 'attachment',
      })),
    };

    const response = await sgMail.send(msg);
    
    console.log(`[Email] Sent to ${to}: ${subject}`);
    
    return {
      success: true,
      messageId: response[0].headers['x-message-id'],
    };
  } catch (error) {
    console.error('[Email] Send error:', error);
    
    if (error.response) {
      console.error('[Email] Error details:', error.response.body);
    }
    
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

/**
 * Send invoice email with PDF attachment
 */
export async function sendInvoiceEmail({ to, invoice, pdfUrl }) {
  const subject = `Invoice ${invoice.invoiceNumber} from ${invoice.tenant?.name || 'Company'}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #fff; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Invoice ${invoice.invoiceNumber}</h1>
          </div>
          <div class="content">
            <p>Dear ${invoice.clientName},</p>
            <p>Please find attached your invoice <strong>${invoice.invoiceNumber}</strong> for the amount of <strong>${formatCurrency(invoice.total, invoice.currency)}</strong>.</p>
            <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
            <p>You can download your invoice using the button below:</p>
            <center>
              <a href="${pdfUrl}" class="button">Download Invoice PDF</a>
            </center>
            <p>If you have any questions, please don't hesitate to contact us.</p>
            <p>Best regards,<br>${invoice.tenant?.name || 'The Team'}</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to,
    subject,
    html,
  });
}

/**
 * Send reminder email
 */
export async function sendReminderEmail({ to, invoice, daysOverdue }) {
  const subject = `Payment Reminder: Invoice ${invoice.invoiceNumber}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Arial, sans-serif;">
        <h2>Payment Reminder</h2>
        <p>Dear ${invoice.clientName},</p>
        <p>This is a friendly reminder that invoice <strong>${invoice.invoiceNumber}</strong> is ${daysOverdue > 0 ? `overdue by ${daysOverdue} days` : 'due soon'}.</p>
        <p><strong>Amount Due:</strong> ${formatCurrency(invoice.total, invoice.currency)}</p>
        <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
        <p>Please process the payment at your earliest convenience.</p>
        <p>Thank you!</p>
      </body>
    </html>
  `;

  return sendEmail({
    to,
    subject,
    html,
  });
}

function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}
