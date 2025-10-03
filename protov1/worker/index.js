// Background Worker - Processes queued jobs

import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { getNextJob, startProcessing, completeJob, failJob, getQueueStats } from '../modules/shared/queue/jobQueue.js';
import { generateInvoicePDF } from '../modules/shared/pdf/generator.js';
import { sendInvoiceEmail, sendEmail } from '../modules/shared/messaging/email.js';
import { sendInvoiceWhatsApp, sendWhatsApp } from '../modules/shared/messaging/whatsapp.js';
import { updateInvoicePdf } from '../modules/invoices/service.js';

dotenv.config();

const prisma = new PrismaClient();

// Job processors map
const processors = {
  pdf_generation: processPdfGeneration,
  send_email: processSendEmail,
  send_whatsapp: processSendWhatsApp,
  send_webhook: processSendWebhook,
};

/**
 * Main worker loop
 */
async function startWorker() {
  console.log('[Worker] Starting Oryxa background worker...');
  console.log(`[Worker] Environment: ${process.env.NODE_ENV || 'development'}`);

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('[Worker] SIGTERM received, shutting down gracefully...');
    process.exit(0);
  });

  process.on('SIGINT', () => {
    console.log('[Worker] SIGINT received, shutting down gracefully...');
    process.exit(0);
  });

  // Main processing loop
  while (true) {
    try {
      const job = getNextJob();

      if (!job) {
        // No jobs, wait and check again
        await sleep(1000);
        continue;
      }

      console.log(`[Worker] Processing job ${job.id} (${job.type})`);

      const processor = processors[job.type];

      if (!processor) {
        console.error(`[Worker] No processor for job type: ${job.type}`);
        await failJob(job.id, new Error(`Unknown job type: ${job.type}`));
        continue;
      }

      // Mark as processing
      await startProcessing(job.id);

      try {
        // Execute processor
        const result = await processor(job.payload);

        // Mark as completed
        await completeJob(job.id, result);

        console.log(`[Worker] Job ${job.id} completed successfully`);
      } catch (error) {
        console.error(`[Worker] Job ${job.id} failed:`, error);
        await failJob(job.id, error);
      }
    } catch (error) {
      console.error('[Worker] Loop error:', error);
      await sleep(5000); // Wait 5s on error
    }
  }
}

/**
 * Job Processors
 */

async function processPdfGeneration(payload) {
  const { invoiceId, tenantId } = payload;

  console.log(`[PDF] Generating PDF for invoice ${invoiceId}`);

  // Get invoice with items
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      items: true,
      tenant: true,
    },
  });

  if (!invoice) {
    throw new Error(`Invoice ${invoiceId} not found`);
  }

  // Generate PDF
  const pdfUrl = await generateInvoicePDF(invoice, invoice.tenant);

  // Update invoice with PDF URL
  await updateInvoicePdf(invoiceId, pdfUrl);

  console.log(`[PDF] Generated and uploaded: ${pdfUrl}`);

  return {
    invoiceId,
    pdfUrl,
    generatedAt: new Date().toISOString(),
  };
}

async function processSendEmail(payload) {
  const { to, subject, html, invoiceId } = payload;

  console.log(`[Email] Sending email to ${to}`);

  let invoice = null;

  // If invoiceId provided, fetch invoice details
  if (invoiceId) {
    invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        tenant: true,
      },
    });

    if (!invoice) {
      throw new Error(`Invoice ${invoiceId} not found`);
    }

    // Send invoice email
    const result = await sendInvoiceEmail({
      to: to || invoice.clientEmail,
      invoice,
      pdfUrl: invoice.pdfUrl,
    });

    return {
      to: to || invoice.clientEmail,
      messageId: result.messageId,
      sentAt: new Date().toISOString(),
    };
  } else {
    // Send custom email
    const result = await sendEmail({
      to,
      subject,
      html,
    });

    return {
      to,
      messageId: result.messageId,
      sentAt: new Date().toISOString(),
    };
  }
}

async function processSendWhatsApp(payload) {
  const { to, message, invoiceId } = payload;

  console.log(`[WhatsApp] Sending message to ${to}`);

  if (invoiceId) {
    // Get invoice
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        tenant: true,
      },
    });

    if (!invoice) {
      throw new Error(`Invoice ${invoiceId} not found`);
    }

    // Send invoice WhatsApp
    const result = await sendInvoiceWhatsApp({
      to: to || invoice.clientPhone,
      invoice,
      pdfUrl: invoice.pdfUrl,
    });

    return {
      to: to || invoice.clientPhone,
      messageId: result.messageId,
      sentAt: new Date().toISOString(),
    };
  } else {
    // Send custom WhatsApp
    const result = await sendWhatsApp({
      to,
      message,
    });

    return {
      to,
      messageId: result.messageId,
      sentAt: new Date().toISOString(),
    };
  }
}

async function processSendWebhook(payload) {
  const { url, method = 'POST', headers = {}, body } = payload;

  console.log(`[Webhook] Sending ${method} request to ${url}`);

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: method !== 'GET' ? JSON.stringify(body) : undefined,
  });

  const responseData = await response.text();

  // Log webhook
  await prisma.webhookLog.create({
    data: {
      endpoint: url,
      method,
      headers,
      body,
      response: responseData ? JSON.parse(responseData) : null,
      statusCode: response.status,
      success: response.ok,
      error: response.ok ? null : responseData,
    },
  });

  if (!response.ok) {
    throw new Error(`Webhook failed with status ${response.status}`);
  }

  return {
    url,
    statusCode: response.status,
    sentAt: new Date().toISOString(),
  };
}

/**
 * Health check endpoint (optional - for monitoring)
 */
async function healthCheck() {
  const stats = getQueueStats();
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    queue: stats,
  };
}

/**
 * Utility
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Start worker (auto-start in ES modules)
startWorker().catch((error) => {
  console.error('[Worker] Fatal error:', error);
  process.exit(1);
});

export { startWorker, healthCheck };
