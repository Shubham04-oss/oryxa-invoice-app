// GET /api/test/invoices - Test endpoint (no auth required)

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get all invoices with items (no auth required for testing)
    const invoices = await prisma.invoice.findMany({
      include: {
        items: true,
        tenant: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json({
      success: true,
      count: invoices.length,
      invoices,
    });
    
  } catch (error) {
    console.error('Test invoices API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
    });
  }
}
