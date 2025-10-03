// WhatsApp Helper - Meta WhatsApp Business API & Twilio

const provider = process.env.WHATSAPP_PROVIDER || 'meta';

/**
 * Send WhatsApp message (supports Meta and Twilio)
 */
export async function sendWhatsApp({ to, message, mediaUrl }) {
  if (provider === 'meta') {
    return sendWhatsAppMeta({ to, message, mediaUrl });
  } else if (provider === 'twilio') {
    return sendWhatsAppTwilio({ to, message, mediaUrl });
  } else {
    throw new Error(`Unknown WhatsApp provider: ${provider}`);
  }
}

/**
 * Send via Meta WhatsApp Business API
 */
async function sendWhatsAppMeta({ to, message, mediaUrl }) {
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneId || !accessToken) {
    throw new Error('WHATSAPP_PHONE_ID and WHATSAPP_ACCESS_TOKEN required');
  }

  const url = `https://graph.facebook.com/v18.0/${phoneId}/messages`;

  const payload = {
    messaging_product: 'whatsapp',
    to: to.replace(/\D/g, ''), // Remove non-digits
    type: mediaUrl ? 'document' : 'text',
  };

  if (mediaUrl) {
    payload.document = {
      link: mediaUrl,
      caption: message,
    };
  } else {
    payload.text = {
      body: message,
    };
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'WhatsApp API error');
    }

    console.log(`[WhatsApp Meta] Sent to ${to}`);

    return {
      success: true,
      messageId: data.messages?.[0]?.id,
    };
  } catch (error) {
    console.error('[WhatsApp Meta] Send error:', error);
    throw new Error(`Failed to send WhatsApp (Meta): ${error.message}`);
  }
}

/**
 * Send via Twilio WhatsApp
 */
async function sendWhatsAppTwilio({ to, message, mediaUrl }) {
  const accountSid = process.env.TWILIO_SID;
  const authToken = process.env.TWILIO_TOKEN;
  const fromNumber = process.env.TWILIO_WHATSAPP;

  if (!accountSid || !authToken || !fromNumber) {
    throw new Error('TWILIO_SID, TWILIO_TOKEN, and TWILIO_WHATSAPP required');
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

  const body = new URLSearchParams({
    From: fromNumber,
    To: `whatsapp:${to}`,
    Body: message,
  });

  if (mediaUrl) {
    body.append('MediaUrl', mediaUrl);
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Twilio API error');
    }

    console.log(`[WhatsApp Twilio] Sent to ${to}`);

    return {
      success: true,
      messageId: data.sid,
    };
  } catch (error) {
    console.error('[WhatsApp Twilio] Send error:', error);
    throw new Error(`Failed to send WhatsApp (Twilio): ${error.message}`);
  }
}

/**
 * Send invoice via WhatsApp
 */
export async function sendInvoiceWhatsApp({ to, invoice, pdfUrl }) {
  const message = `Hi ${invoice.clientName}! Your invoice ${invoice.invoiceNumber} is ready. Amount: ${formatCurrency(invoice.total, invoice.currency)}. Due: ${new Date(invoice.dueDate).toLocaleDateString()}. Download: ${pdfUrl}`;

  return sendWhatsApp({
    to,
    message,
    mediaUrl: pdfUrl,
  });
}

/**
 * Send reminder via WhatsApp
 */
export async function sendReminderWhatsApp({ to, invoice, daysOverdue }) {
  const message = `Reminder: Invoice ${invoice.invoiceNumber} is ${daysOverdue > 0 ? `overdue by ${daysOverdue} days` : 'due soon'}. Amount: ${formatCurrency(invoice.total, invoice.currency)}. Please pay at your earliest convenience.`;

  return sendWhatsApp({
    to,
    message,
  });
}

function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}
