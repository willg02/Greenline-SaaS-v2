# Google Calendar Sync - Testing Instructions

## ✅ Completed Features

Your Google Calendar integration is now fully functional! Here's what was implemented:

### 1. **Auto-Import on Schedule Page Load**
- Schedule page automatically imports Google Calendar events when you open it
- Events are imported for the current week + 1 additional week (2 weeks total)
- Imported events are marked with a purple "Google" badge

### 2. **Manual Sync Buttons**
- **Import Calendar** button: Manually refresh Google Calendar events
- **Sync to Google** button: Export all local Greenline jobs to Google Calendar

### 3. **Visual Indicators**
- Last sync timestamp displayed below page title
- Blue info banner shows count of imported Google Calendar events
- Purple "Google" badge on imported events in the calendar
- Loading spinners on buttons during sync operations

### 4. **Updated Statistics**
The sidebar now shows:
- Total Jobs (local + imported)
- Local Jobs count
- Imported events count
- In Progress count
- Completed count

## 🧪 How to Test

### Test 1: View Imported Events
1. Navigate to Schedule page at http://localhost:5174/Greenline-SaaS-v2/schedule
2. Your Google Calendar events should automatically appear
3. Look for purple "Google" badges on imported events
4. Check the blue banner showing "Showing X imported Google Calendar events"

### Test 2: Manual Import
1. Click "Import Calendar" button in the header
2. Wait for spinning icon to stop
3. Verify last sync timestamp updates
4. Check that your latest Google Calendar events appear

### Test 3: Export to Google Calendar
1. Click "Sync to Google" button in the header
2. System will export all local Greenline jobs (the 5 mock jobs) to your Google Calendar
3. Open Google Calendar in a new tab to verify jobs appear there
4. Look for events like "Residential Landscape Installation - Johnson Residence"

### Test 4: Crew Filtering
1. Click on different crews in the sidebar (Team Alpha, Beta, Gamma)
2. Imported events will always show (they have crewId: 'imported')
3. Local jobs will filter based on selected crew

## 🔍 What to Look For

**Successful Import:**
- Purple "Google" badges on imported events
- Events appear in correct date/time slots
- Location from Google Calendar displays
- Blue banner shows import count

**Successful Export:**
- Alert message: "Successfully synced X jobs to Google Calendar"
- Jobs appear in your actual Google Calendar
- Job details preserved (title, location, times)

**Error Handling:**
- If access token missing: Red error banner prompts to connect calendar
- If API fails: Red error banner with specific error message

## 🎯 Current Servers

- **API Server:** http://localhost:4000 (must be running)
- **Web Server:** http://localhost:5174/Greenline-SaaS-v2/ (currently on port 5174)

## 📋 Technical Details

**Auto-Import Trigger:**
- useEffect runs on component mount
- Re-imports when selectedDate changes (week navigation)
- Checks localStorage for 'google_access_token'

**Data Flow:**
1. Frontend calls `/api/schedule/calendar/google/import` with access token
2. Backend uses googleapis to fetch events
3. Events mapped to Job interface format
4. State updated with importedEvents array
5. Combined with local jobs for display

**Sync Flow:**
1. Frontend calls `/api/schedule/calendar/google/export` for each local job
2. Backend creates event in Google Calendar using googleapis
3. Success message displayed
4. Auto-import triggered to refresh view

## 🐛 Troubleshooting

**No events showing?**
- Check browser console for errors (F12)
- Verify API server is running on port 4000
- Check localStorage has 'google_access_token' (DevTools → Application → Local Storage)

**"No Google Calendar connection" error?**
- Go to Calendar Integration page
- Click "Connect Google Calendar"
- Complete OAuth flow again

**API errors?**
- Check API server terminal for detailed logs
- Verify .env has correct GOOGLE_CLIENT_SECRET
- Try disconnecting and reconnecting in Calendar Integration page

## 🚀 Next Steps

After successful testing, you can:
1. Add periodic auto-sync (every 15 minutes)
2. Implement conflict resolution UI
3. Add ability to edit/delete imported events
4. Store events in PostgreSQL database
5. Add two-way sync (update events in both systems)
6. Implement Outlook Calendar integration
