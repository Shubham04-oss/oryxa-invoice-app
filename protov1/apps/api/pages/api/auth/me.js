// GET /api/auth/me - Return authenticated user profile

import { authenticate } from '../../../modules/shared/auth/middleware.js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const user = await authenticate(req);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error('[Auth] Me endpoint error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}
