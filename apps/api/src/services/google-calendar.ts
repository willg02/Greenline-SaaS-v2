import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

/**
 * Google Calendar API Integration
 */

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  attendees?: string[];
}

export class GoogleCalendarService {
  private oauth2Client: OAuth2Client;

  constructor() {
    const clientId = process.env.GOOGLE_CLIENT_ID || '';
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5173/auth/google/callback';

    this.oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  }

  /**
   * Generate OAuth URL for user authorization
   */
  getAuthUrl(): string {
    const scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });
  }

  /**
   * Exchange authorization code for access token
   */
  async getAccessToken(code: string): Promise<{ accessToken: string; refreshToken: string | null | undefined }> {
    const { tokens } = await this.oauth2Client.getToken(code);
    
    return {
      accessToken: tokens.access_token || '',
      refreshToken: tokens.refresh_token
    };
  }

  /**
   * Import events from Google Calendar
   */
  async importEvents(accessToken: string, startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    this.oauth2Client.setCredentials({ access_token: accessToken });
    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items || [];
    
    return events.map(event => ({
      id: event.id || '',
      title: event.summary || 'Untitled Event',
      description: event.description || undefined,
      startTime: event.start?.dateTime || event.start?.date || '',
      endTime: event.end?.dateTime || event.end?.date || '',
      location: event.location || undefined,
      attendees: event.attendees?.map(a => a.email || '').filter(Boolean)
    }));
  }

  /**
   * Export Greenline job to Google Calendar
   */
  async exportEvent(accessToken: string, event: CalendarEvent): Promise<string> {
    this.oauth2Client.setCredentials({ access_token: accessToken });
    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: event.title,
        description: event.description,
        location: event.location,
        start: {
          dateTime: event.startTime,
          timeZone: 'America/New_York', // TODO: Make timezone configurable
        },
        end: {
          dateTime: event.endTime,
          timeZone: 'America/New_York',
        },
        attendees: event.attendees?.map(email => ({ email })),
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 30 },
          ],
        },
      },
    });

    return response.data.id || '';
  }

  /**
   * Update existing event in Google Calendar
   */
  async updateEvent(accessToken: string, eventId: string, event: Partial<CalendarEvent>): Promise<void> {
    this.oauth2Client.setCredentials({ access_token: accessToken });
    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

    await calendar.events.patch({
      calendarId: 'primary',
      eventId: eventId,
      requestBody: {
        summary: event.title,
        description: event.description,
        location: event.location,
        start: event.startTime ? {
          dateTime: event.startTime,
          timeZone: 'America/New_York',
        } : undefined,
        end: event.endTime ? {
          dateTime: event.endTime,
          timeZone: 'America/New_York',
        } : undefined,
      },
    });
  }

  /**
   * Delete event from Google Calendar
   */
  async deleteEvent(accessToken: string, eventId: string): Promise<void> {
    this.oauth2Client.setCredentials({ access_token: accessToken });
    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

    await calendar.events.delete({
      calendarId: 'primary',
      eventId: eventId,
    });
  }

  /**
   * Sync bidirectional changes between Greenline and Google Calendar
   */
  async syncEvents(accessToken: string, localEvents: CalendarEvent[]): Promise<{ imported: number; exported: number; conflicts: any[] }> {
    // Fetch remote events from last 30 days to next 90 days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 90);

    const remoteEvents = await this.importEvents(accessToken, startDate, endDate);
    
    // Simple sync: just count what we imported
    // In a real implementation, you'd:
    // 1. Compare event IDs and timestamps
    // 2. Detect conflicts (both modified since last sync)
    // 3. Apply resolution strategy (latest wins, manual, etc.)
    // 4. Export new local events not in Google
    // 5. Update modified local events
    
    return {
      imported: remoteEvents.length,
      exported: 0, // Would export new local events here
      conflicts: []
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<string> {
    this.oauth2Client.setCredentials({ refresh_token: refreshToken });
    const { credentials } = await this.oauth2Client.refreshAccessToken();
    return credentials.access_token || '';
  }
}
