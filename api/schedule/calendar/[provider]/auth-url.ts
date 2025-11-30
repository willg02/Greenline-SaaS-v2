import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleCalendarService } from '../../../apps/api/src/services/google-calendar';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { provider } = req.query;

    console.log('Auth URL request for provider:', provider);
    console.log('Environment check:', {
      hasClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      hasRedirectUri: !!process.env.GOOGLE_REDIRECT_URI
    });

    if (provider === 'google') {
      const googleService = new GoogleCalendarService();
      const authUrl = googleService.getAuthUrl();
      console.log('Generated auth URL successfully');
      return res.json({ authUrl });
    }

    return res.status(400).json({ error: 'Unsupported provider' });
  } catch (error: any) {
    console.error('Auth URL error:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({ error: error.message, stack: error.stack });
  }
}
