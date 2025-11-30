import { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import axios from 'axios';

interface CalendarConnection {
  provider: 'google' | 'outlook';
  connected: boolean;
  email?: string;
  lastSync?: string;
  syncEnabled: boolean;
  accessToken?: string;
}

const API_URL = 'http://localhost:4000';

export default function CalendarIntegration() {
  const [googleConnection, setGoogleConnection] = useState<CalendarConnection>({
    provider: 'google',
    connected: false,
    syncEnabled: false
  });

  const [outlookConnection, setOutlookConnection] = useState<CalendarConnection>({
    provider: 'outlook',
    connected: false,
    syncEnabled: false
  });

  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for OAuth callback on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const provider = urlParams.get('state'); // We'll use state to identify provider

    if (code) {
      handleOAuthCallback(code, provider || 'google');
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Load saved tokens from localStorage
    const savedGoogleToken = localStorage.getItem('google_access_token');
    if (savedGoogleToken) {
      setGoogleConnection(prev => ({ 
        ...prev, 
        connected: true, 
        accessToken: savedGoogleToken,
        email: localStorage.getItem('google_email') || undefined
      }));
    }
  }, []);

  const handleOAuthCallback = async (code: string, provider: string) => {
    try {
      const response = await axios.post(`${API_URL}/api/schedule/calendar/${provider}/callback`, { code });
      
      if (response.data.success) {
        const { accessToken, refreshToken } = response.data;
        
        // Store tokens (in production, store these securely on backend)
        localStorage.setItem(`${provider}_access_token`, accessToken);
        if (refreshToken) {
          localStorage.setItem(`${provider}_refresh_token`, refreshToken);
        }

        if (provider === 'google') {
          setGoogleConnection(prev => ({ 
            ...prev, 
            connected: true, 
            accessToken,
            email: 'Connected' // TODO: Fetch user email from Google
          }));
        }
      }
    } catch (err: any) {
      setError(`Failed to connect to ${provider}: ${err.message}`);
    }
  };

  const connectGoogle = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/schedule/calendar/google/auth-url`);
      // Redirect to Google OAuth
      window.location.href = response.data.authUrl;
    } catch (err: any) {
      setError(`Failed to initiate Google OAuth: ${err.message}`);
    }
  };

  const connectOutlook = () => {
    setError('Outlook Calendar integration coming soon!');
  };

  const disconnect = (provider: 'google' | 'outlook') => {
    // Clear tokens
    localStorage.removeItem(`${provider}_access_token`);
    localStorage.removeItem(`${provider}_refresh_token`);
    localStorage.removeItem(`${provider}_email`);

    if (provider === 'google') {
      setGoogleConnection({ provider: 'google', connected: false, syncEnabled: false });
    } else {
      setOutlookConnection({ provider: 'outlook', connected: false, syncEnabled: false });
    }
  };

  const toggleSync = (provider: 'google' | 'outlook') => {
    if (provider === 'google') {
      setGoogleConnection(prev => ({ ...prev, syncEnabled: !prev.syncEnabled }));
    } else {
      setOutlookConnection(prev => ({ ...prev, syncEnabled: !prev.syncEnabled }));
    }
  };

  const syncNow = async () => {
    setSyncing(true);
    setError(null);

    try {
      if (googleConnection.connected && googleConnection.accessToken) {
        const response = await axios.post(`${API_URL}/api/schedule/calendar/google/sync`, {
          accessToken: googleConnection.accessToken,
          localEvents: [] // TODO: Pass actual local jobs to sync
        });

        if (response.data.synced) {
          setGoogleConnection(prev => ({ 
            ...prev, 
            lastSync: new Date().toLocaleString() 
          }));
        }
      }
    } catch (err: any) {
      setError(`Sync failed: ${err.message}`);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Calendar Integration</h1>
        <p className="text-gray-600">Connect your Google or Outlook calendar to sync Greenline jobs</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 max-w-4xl p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-900">Error</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            ×
          </button>
        </div>
      )}

      <div className="grid gap-6 max-w-4xl">
        {/* Google Calendar */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Google Calendar</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {googleConnection.connected 
                      ? `Connected as ${googleConnection.email}` 
                      : 'Not connected'}
                  </p>
                </div>
              </div>
              {googleConnection.connected ? (
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-gray-400" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            {googleConnection.connected ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Auto-sync enabled</p>
                    <p className="text-sm text-gray-600">
                      Jobs will sync automatically every 15 minutes
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={googleConnection.syncEnabled}
                      onChange={() => toggleSync('google')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                {googleConnection.lastSync && (
                  <p className="text-sm text-gray-600">
                    Last synced: {googleConnection.lastSync}
                  </p>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={syncNow}
                    disabled={syncing}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                    Sync Now
                  </button>
                  <button
                    onClick={() => disconnect('google')}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-4">
                  Connect your Google Calendar to automatically sync Greenline jobs with your calendar.
                </p>
                <button
                  onClick={connectGoogle}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Connect Google Calendar
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Outlook Calendar */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <CardTitle>Outlook Calendar</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {outlookConnection.connected 
                      ? `Connected as ${outlookConnection.email}` 
                      : 'Not connected'}
                  </p>
                </div>
              </div>
              {outlookConnection.connected ? (
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-gray-400" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            {outlookConnection.connected ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Auto-sync enabled</p>
                    <p className="text-sm text-gray-600">
                      Jobs will sync automatically every 15 minutes
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={outlookConnection.syncEnabled}
                      onChange={() => toggleSync('outlook')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                {outlookConnection.lastSync && (
                  <p className="text-sm text-gray-600">
                    Last synced: {outlookConnection.lastSync}
                  </p>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={syncNow}
                    disabled={syncing}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                    Sync Now
                  </button>
                  <button
                    onClick={() => disconnect('outlook')}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-4">
                  Connect your Outlook Calendar to automatically sync Greenline jobs with your calendar.
                </p>
                <button
                  onClick={connectOutlook}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Connect Outlook Calendar
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sync Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Sync Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sync frequency</p>
                  <p className="text-sm text-gray-600">How often to check for calendar updates</p>
                </div>
                <select className="px-4 py-2 border border-gray-300 rounded-lg">
                  <option>Every 15 minutes</option>
                  <option>Every 30 minutes</option>
                  <option>Every hour</option>
                  <option>Manual only</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Conflict resolution</p>
                  <p className="text-sm text-gray-600">What to do when changes conflict</p>
                </div>
                <select className="px-4 py-2 border border-gray-300 rounded-lg">
                  <option>Greenline takes priority</option>
                  <option>Calendar takes priority</option>
                  <option>Ask me each time</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Include crew in event details</p>
                  <p className="text-sm text-gray-600">Add crew assignments to calendar events</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
