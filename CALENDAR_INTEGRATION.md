# Calendar Integration Setup Guide

This guide will help you set up Google Calendar and Outlook Calendar integration for Greenline SaaS.

## Overview

The calendar integration allows you to:
- Sync Greenline jobs with your Google Calendar or Outlook Calendar
- Automatically create calendar events for scheduled jobs
- Bidirectional sync (changes in either system reflect in both)
- Manage crew schedules across platforms

## Google Calendar Integration

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name (e.g., "Greenline Calendar Integration")
4. Click "Create"

### 2. Enable Google Calendar API

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google Calendar API"
3. Click on it and press "Enable"

### 3. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - User Type: External
   - App name: Greenline SaaS
   - User support email: your email
   - Developer contact: your email
   - Save and Continue
4. Add scopes:
   - `https://www.googleapis.com/auth/calendar`
   - `https://www.googleapis.com/auth/calendar.events`
5. Add test users (your email)
6. Back to Credentials, create OAuth client ID:
   - Application type: Web application
   - Name: Greenline Web Client
   - Authorized redirect URIs: `http://localhost:5173/auth/google/callback` (add production URL later)
7. Copy the Client ID and Client Secret

### 4. Install Google APIs

```bash
cd apps/api
npm install googleapis
```

### 5. Configure Environment Variables

Add to `apps/api/.env`:

```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback
```

## Outlook Calendar Integration

### 1. Register Azure AD Application

1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to "Azure Active Directory"
3. Select "App registrations" → "New registration"
4. Enter application name: "Greenline Calendar Integration"
5. Supported account types: "Accounts in any organizational directory and personal Microsoft accounts"
6. Redirect URI: Web → `http://localhost:5173/auth/outlook/callback`
7. Click "Register"

### 2. Add API Permissions

1. In your app registration, go to "API permissions"
2. Click "Add a permission" → "Microsoft Graph"
3. Select "Delegated permissions"
4. Add these permissions:
   - `Calendars.ReadWrite`
   - `User.Read`
   - `offline_access`
5. Click "Add permissions"
6. Click "Grant admin consent" (if you're an admin)

### 3. Create Client Secret

1. Go to "Certificates & secrets"
2. Click "New client secret"
3. Description: "Greenline API Secret"
4. Expires: Choose duration (12 months recommended)
5. Click "Add"
6. Copy the secret value (you won't see it again!)

### 4. Install Microsoft Graph Client

```bash
cd apps/api
npm install @microsoft/microsoft-graph-client isomorphic-fetch
npm install --save-dev @types/isomorphic-fetch
```

### 5. Configure Environment Variables

Add to `apps/api/.env`:

```env
OUTLOOK_CLIENT_ID=your_application_id_here
OUTLOOK_CLIENT_SECRET=your_client_secret_here
OUTLOOK_REDIRECT_URI=http://localhost:5173/auth/outlook/callback
OUTLOOK_TENANT_ID=common
```

## Implementation Checklist

### Backend (apps/api/src/services/)

- [x] `google-calendar.ts` - OAuth flow and event sync
- [x] `outlook-calendar.ts` - Microsoft Graph integration
- [ ] Implement actual API calls (currently placeholders)
- [ ] Add token refresh logic
- [ ] Implement conflict resolution
- [ ] Add webhook support for real-time updates

### API Routes (apps/api/src/routes/schedule.ts)

- [x] `GET /api/schedule/crews` - List all crews
- [x] `GET /api/schedule/jobs` - List jobs with filters
- [x] `POST /api/schedule/jobs` - Create new job
- [x] `PATCH /api/schedule/jobs/:id` - Update job
- [x] `POST /api/schedule/calendar/google/sync` - Google sync
- [x] `POST /api/schedule/calendar/outlook/sync` - Outlook sync
- [x] `POST /api/schedule/jobs/optimize-route` - Route optimization
- [ ] Add OAuth callback endpoints
- [ ] Add token storage/retrieval
- [ ] Add sync history tracking

### Frontend (apps/web/src/pages/)

- [x] `CalendarIntegration.tsx` - Settings UI for connections
- [x] `Schedule.tsx` - Advanced scheduling interface
- [ ] Add OAuth callback handling
- [ ] Implement sync status indicators
- [ ] Add conflict resolution UI
- [ ] Add sync history view

## Usage

### Connecting Calendar

1. Navigate to Schedule page
2. Click "Calendar Integration" button
3. Select Google or Outlook
4. Click "Connect" button
5. Authorize Greenline to access your calendar
6. Enable auto-sync

### Syncing Jobs

**Manual Sync:**
- Click "Sync Now" button in Calendar Integration page

**Auto Sync:**
- Enable "Auto-sync" toggle
- Jobs will sync every 15 minutes automatically

**Conflict Resolution:**
- Choose priority in settings (Greenline vs Calendar)
- Or manually resolve conflicts when prompted

## Troubleshooting

### Google Calendar

**Error: "redirect_uri_mismatch"**
- Verify redirect URI in Google Cloud Console matches exactly
- Include protocol (http/https) and port number

**Error: "invalid_grant"**
- Token expired, user needs to re-authorize
- Implement token refresh logic

### Outlook Calendar

**Error: "AADSTS50011: redirect URI mismatch"**
- Check Azure AD app registration redirect URIs
- Ensure exact match including trailing slashes

**Error: "insufficient_permissions"**
- Grant admin consent in Azure AD
- Verify correct API permissions are added

## Security Best Practices

1. **Never commit credentials**
   - Keep `.env` files out of version control
   - Use different credentials for dev/staging/production

2. **Token Storage**
   - Store refresh tokens encrypted in database
   - Never send tokens to frontend
   - Implement token rotation

3. **Scope Management**
   - Request minimum necessary permissions
   - Explain to users what data you access

4. **Rate Limiting**
   - Respect API rate limits (Google: 1M requests/day, Outlook: varies)
   - Implement exponential backoff for retries

## Production Deployment

### Google Calendar

1. Update OAuth consent screen to production
2. Add production redirect URI
3. Submit for Google verification (if needed)

### Outlook Calendar

1. Update redirect URI to production URL
2. Consider multi-tenant vs single-tenant
3. Update environment variables

## Next Steps

1. Implement actual API calls in service files
2. Add database models for storing OAuth tokens
3. Build OAuth callback handlers
4. Add webhook endpoints for real-time sync
5. Implement route optimization algorithm
6. Add crew location tracking
7. Build mobile app for crew members

## Resources

- [Google Calendar API Documentation](https://developers.google.com/calendar/api/guides/overview)
- [Microsoft Graph Calendar API](https://learn.microsoft.com/en-us/graph/api/resources/calendar)
- [OAuth 2.0 Best Practices](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)
