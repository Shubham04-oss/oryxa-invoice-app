// POST /api/automations/simulate - Trigger automation manually

import { triggerAutomation } from '../../../modules/automations/engine.js';
import { authenticate } from '../../../modules/shared/auth/middleware.js';
import { z } from 'zod';

const simulateSchema = z.object({
  trigger: z.string().min(1, 'Trigger type is required'),
  data: z.record(z.any()).optional(),
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

    // Validate input
    const validation = simulateSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validation.error.flatten(),
      });
    }

    const { trigger, data } = validation.data;

    // Execute automation
    const result = await triggerAutomation({
      tenantId: user.tenantId,
      trigger,
      data: data || {},
      simulate: true, // Simulation mode - won't actually send messages
    });

    return res.status(200).json({
      success: true,
      trigger,
      actionsTriggered: result.actions,
      executionTime: result.duration,
      message: 'Automation simulated successfully',
    });
    
  } catch (error) {
    console.error('Automation simulate error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
    });
  }
}
