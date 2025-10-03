// Health Check Endpoint

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Oryxa API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
}
