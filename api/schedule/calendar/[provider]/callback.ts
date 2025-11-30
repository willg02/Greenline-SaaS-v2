import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleCalendarService } from '../../../../apps/api/src/services/google-calendar';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { provider } = req.query;
    const { code } = req.body;

    console.log('OAuth callback:', { provider, hasCode: !!code });

    if (provider === 'google') {
      const googleService = new GoogleCalendarService();
      const tokens = await googleService.getAccessToken(code);

      return res.json({
        success: true,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token
      });
    }

    return res.status(400).json({ error: 'Unsupported provider' });
  } catch (error: any) {
    console.error('Callback error:', error);
    return res.status(500).json({ error: error.message });
  }
}
