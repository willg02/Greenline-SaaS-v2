import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleCalendarService } from '../../../../../apps/api/src/services/google-calendar';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { accessToken, event } = req.body;

    if (!accessToken || !event) {
      return res.status(400).json({ error: 'Access token and event required' });
    }

    const googleService = new GoogleCalendarService();
    const result = await googleService.exportEvent(accessToken, event);

    return res.json({ success: true, eventId: result.id });
  } catch (error: any) {
    console.error('Export error:', error);
    return res.status(500).json({ error: error.message });
  }
}
