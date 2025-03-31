import ApiKey from '@/models/ApiKey';

export default function withApiKeyAuth(handler) {
  return async (req, res) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      return res.status(401).json({ error: 'API key required' });
    }

    const keyRecord = await ApiKey.findOne({
      where: { key: apiKey, isActive: true },
    });

    if (!keyRecord) {
      return res.status(403).json({ error: 'Invalid or inactive API key' });
    }

    // Attach the key metadata to request
    req.apiKeyInfo = { name: keyRecord.name };

    return handler(req, res);
  };
}
