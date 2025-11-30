# Scheduling & Dispatch Feature Summary

## What We Built

### 1. Advanced Scheduling Interface (`apps/web/src/pages/Schedule.tsx`)

**Features:**
- **Crew Management Sidebar**
  - View all crews with availability status
  - Filter jobs by crew
  - See active job counts per crew
  - Member roster with roles

- **Week Calendar View**
  - 7-day grid layout (Monday-Sunday)
  - Color-coded job cards by crew
  - Job details: client, location, time, duration
  - Status badges (scheduled, in-progress, completed, delayed)
  - Priority indicators (high/medium/low)

- **Real-Time Dispatch Board**
  - Live tracking of in-progress jobs
  - Location information
  - Estimated completion times
  - Quick status updates

- **Job Management**
  - Create new jobs
  - Assign to crews
  - Set priority levels
  - Link to estimates
  - Track plant counts

### 2. Calendar Integration (`apps/web/src/pages/CalendarIntegration.tsx`)

**Providers Supported:**
- Google Calendar
- Outlook Calendar

**Features:**
- OAuth connection flow
- Connection status indicators
- Auto-sync toggle (every 15 minutes)
- Manual sync button with loading state
- Last sync timestamp
- Sync frequency settings
- Conflict resolution options
- Crew detail inclusion toggle

**Settings:**
- Sync frequency selector
- Conflict resolution strategy
- Include crew in event details

### 3. Backend API Routes (`apps/api/src/routes/schedule.ts`)

**Endpoints Created:**

```
GET    /api/schedule/crews              - List all crews
GET    /api/schedule/jobs               - List jobs (with filters)
POST   /api/schedule/jobs               - Create new job
PATCH  /api/schedule/jobs/:id           - Update job
POST   /api/schedule/calendar/google/sync    - Sync with Google Calendar
POST   /api/schedule/calendar/outlook/sync   - Sync with Outlook Calendar
POST   /api/schedule/jobs/optimize-route     - Optimize crew routes
```

**Query Parameters:**
- `startDate`, `endDate` - Filter jobs by date range
- `crewId` - Filter jobs by crew
- `status` - Filter by job status

### 4. Calendar Integration Services

**Google Calendar Service** (`apps/api/src/services/google-calendar.ts`)
- OAuth 2.0 authorization flow
- Access token exchange
- Import events from Google Calendar
- Export Greenline jobs to Google Calendar
- Bidirectional sync with conflict resolution

**Outlook Calendar Service** (`apps/api/src/services/outlook-calendar.ts`)
- Microsoft Graph API integration
- Azure AD OAuth flow
- Import events from Outlook
- Export jobs to Outlook
- Delta query for efficient syncing

### 5. Technologies Used

**Frontend:**
- React 18.2.0 with TypeScript
- date-fns for date manipulation
- lucide-react for icons
- @dnd-kit (ready for drag-and-drop implementation)
- react-big-calendar (ready for calendar views)

**Backend:**
- Express.js REST API
- Ready for googleapis integration
- Ready for @microsoft/microsoft-graph-client integration

## Current Status

### ✅ Completed
- Advanced scheduling UI with crew management
- Calendar integration settings page
- API endpoints for jobs and crews
- Service layer structure for Google/Outlook
- Comprehensive setup documentation
- Link between Schedule and Calendar Integration pages

### 🚧 Ready for Implementation
- OAuth callback handlers (placeholders in services)
- Actual Google Calendar API calls (need googleapis package)
- Actual Microsoft Graph API calls (need @microsoft/microsoft-graph-client)
- Token storage in database
- Webhook endpoints for real-time sync
- Drag-and-drop job assignment
- Route optimization algorithm

### 📋 Next Steps

1. **Set up OAuth credentials**
   - Follow CALENDAR_INTEGRATION.md guide
   - Get Google Cloud Console credentials
   - Get Azure AD application credentials

2. **Install calendar packages**
   ```bash
   cd apps/api
   npm install googleapis
   npm install @microsoft/microsoft-graph-client isomorphic-fetch
   ```

3. **Implement OAuth flows**
   - Add callback routes
   - Implement token exchange
   - Add token refresh logic

4. **Database integration**
   - Add OAuth token models to Prisma schema
   - Store encrypted tokens per user
   - Track sync history

5. **Complete sync logic**
   - Implement actual API calls in service files
   - Add conflict resolution algorithm
   - Build webhook handlers

## How to Use

### Access the Features

1. **Schedule Page**
   - Navigate to http://localhost:5173/Greenline-SaaS-v2/schedule
   - View crew assignments and weekly calendar
   - Filter by crew or view all
   - Click "Calendar Integration" to set up sync

2. **Calendar Integration Page**
   - Navigate to http://localhost:5173/Greenline-SaaS-v2/calendar-integration
   - Connect Google or Outlook calendars
   - Configure sync settings
   - Enable auto-sync

### Testing the API

```bash
# Get all crews
curl http://localhost:4000/api/schedule/crews

# Get all jobs
curl http://localhost:4000/api/schedule/jobs

# Get jobs for specific crew
curl http://localhost:4000/api/schedule/jobs?crewId=1

# Create new job
curl -X POST http://localhost:4000/api/schedule/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Install",
    "client": "Test Client",
    "location": "123 Main St",
    "date": "2025-11-20",
    "startTime": "9:00 AM",
    "endTime": "1:00 PM",
    "crewId": "1"
  }'

# Update job
curl -X PATCH http://localhost:4000/api/schedule/jobs/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "in-progress"}'
```

## Architecture

### Data Flow

```
User Action (Schedule Page)
    ↓
API Request (/api/schedule/*)
    ↓
Express Route Handler (schedule.ts)
    ↓
Calendar Service (if sync enabled)
    ↓
External API (Google/Outlook)
    ↓
Response back to frontend
    ↓
UI Update
```

### Sync Flow

```
Manual/Auto Trigger
    ↓
Fetch local jobs from Greenline DB
    ↓
Fetch remote events from Google/Outlook
    ↓
Compare and detect changes
    ↓
Resolve conflicts (based on settings)
    ↓
Push local changes → Calendar
    ↓
Pull remote changes → Greenline
    ↓
Update sync status and timestamp
```

## Key Files Modified/Created

**Backend:**
- `apps/api/src/main.ts` - Added schedule routes
- `apps/api/src/routes/schedule.ts` - New schedule API endpoints
- `apps/api/src/services/google-calendar.ts` - Google Calendar integration
- `apps/api/src/services/outlook-calendar.ts` - Outlook Calendar integration

**Frontend:**
- `apps/web/src/App.tsx` - Added calendar integration route
- `apps/web/src/pages/Schedule.tsx` - Complete rewrite with advanced features
- `apps/web/src/pages/CalendarIntegration.tsx` - New calendar settings page

**Documentation:**
- `CALENDAR_INTEGRATION.md` - Complete setup guide

## Repository

- **GitHub:** willg02/Greenline-SaaS-v2
- **Live Demo:** https://willg02.github.io/Greenline-SaaS-v2/
- **Latest Commit:** "Add scheduling and calendar integration features"

## Notes

The calendar integration is built with a solid foundation and clear TODO comments for the actual API implementations. The OAuth flows and sync logic are structured but need the actual external API packages to be installed and configured according to the CALENDAR_INTEGRATION.md guide.

All UI components are functional and ready to connect to live API endpoints once the OAuth credentials are configured and the calendar packages are installed.
