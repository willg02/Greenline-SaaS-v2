import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Badge } from '../components/Badge';
import { Calendar, MapPin, Clock, Users, Plus, ExternalLink, RefreshCw, Filter } from 'lucide-react';
import { format, addDays, startOfWeek, parseISO } from 'date-fns';
import axios from 'axios';

type JobStatus = 'scheduled' | 'in-progress' | 'completed' | 'delayed';
type CrewMember = { id: string; name: string; role: string; };

interface Job {
  id: string;
  title: string;
  client: string;
  location: string;
  date: Date;
  startTime: string;
  endTime: string;
  duration: number;
  crewId: string;
  crewName: string;
  status: JobStatus;
  estimateId?: string;
  plants: number;
  priority: 'low' | 'medium' | 'high';
}

interface Crew {
  id: string;
  name: string;
  members: CrewMember[];
  color: string;
  activeJobs: number;
  availability: 'available' | 'busy' | 'off';
}

export default function Schedule() {
  const [selectedView, setSelectedView] = useState<'week' | 'day'>('week');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCrew, setSelectedCrew] = useState<string>('all');
  const [importedEvents, setImportedEvents] = useState<Job[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  const crews: Crew[] = [
    { id: '1', name: 'Team Alpha', members: [{ id: '1', name: 'John D.', role: 'Lead' }, { id: '2', name: 'Mike S.', role: 'Installer' }], color: 'bg-blue-100 text-blue-800', activeJobs: 2, availability: 'busy' },
    { id: '2', name: 'Team Beta', members: [{ id: '3', name: 'Sarah L.', role: 'Lead' }, { id: '4', name: 'Tom R.', role: 'Installer' }], color: 'bg-purple-100 text-purple-800', activeJobs: 1, availability: 'available' },
    { id: '3', name: 'Team Gamma', members: [{ id: '5', name: 'Lisa M.', role: 'Lead' }], color: 'bg-green-100 text-green-800', activeJobs: 0, availability: 'available' },
  ];

  const startDate = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  const jobs: Job[] = [
    { id: '1', title: 'Residential Install', client: 'Johnson Residence', location: '123 Oak St, Charlotte', date: addDays(startDate, 0), startTime: '8:00 AM', endTime: '12:00 PM', duration: 4, crewId: '1', crewName: 'Team Alpha', status: 'scheduled', plants: 38, priority: 'high', estimateId: 'EST-001' },
    { id: '2', title: 'Garden Center Delivery', client: 'Charlotte GC', location: '456 Main Ave, Matthews', date: addDays(startDate, 0), startTime: '1:00 PM', endTime: '3:00 PM', duration: 2, crewId: '2', crewName: 'Team Beta', status: 'in-progress', plants: 65, priority: 'medium' },
    { id: '3', title: 'Maple Street Project', client: 'Maple HOA', location: '789 Maple St, Charlotte', date: addDays(startDate, 1), startTime: '9:00 AM', endTime: '2:00 PM', duration: 5, crewId: '1', crewName: 'Team Alpha', status: 'scheduled', plants: 42, priority: 'high', estimateId: 'EST-003' },
    { id: '4', title: 'Maintenance Visit', client: 'Riverside Development', location: '321 River Rd, Charlotte', date: addDays(startDate, 2), startTime: '10:00 AM', endTime: '12:00 PM', duration: 2, crewId: '2', crewName: 'Team Beta', status: 'scheduled', plants: 0, priority: 'low' },
    { id: '5', title: 'Emergency Repair', client: 'Sunset Gardens', location: '555 Sunset Blvd, Matthews', date: addDays(startDate, 1), startTime: '3:00 PM', endTime: '5:00 PM', duration: 2, crewId: '3', crewName: 'Team Gamma', status: 'scheduled', plants: 8, priority: 'high' },
  ];

  const filteredJobs = selectedCrew === 'all' ? jobs : jobs.filter(j => j.crewId === selectedCrew);

  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case 'scheduled': return 'border-blue-500 bg-blue-50';
      case 'in-progress': return 'border-yellow-500 bg-yellow-50';
      case 'completed': return 'border-green-500 bg-green-50';
      case 'delayed': return 'border-red-500 bg-red-50';
    }
  };

  const getStatusBadge = (status: JobStatus) => {
    switch (status) {
      case 'scheduled': return <Badge variant="info">Scheduled</Badge>;
      case 'in-progress': return <Badge variant="warning">In Progress</Badge>;
      case 'completed': return <Badge variant="success">Completed</Badge>;
      case 'delayed': return <Badge variant="danger">Delayed</Badge>;
    }
  };

  // Import Google Calendar events
  const importGoogleCalendarEvents = async () => {
    setIsImporting(true);
    setError(null);
    try {
      const accessToken = localStorage.getItem('google_access_token');
      if (!accessToken) {
        setError('No Google Calendar connection found. Please connect your calendar first.');
        return;
      }

      const startDate = format(startOfWeek(selectedDate), 'yyyy-MM-dd');
      const endDate = format(addDays(startOfWeek(selectedDate), 13), 'yyyy-MM-dd'); // Import 2 weeks

      const response = await axios.post(`/api/schedule/calendar/google/import`, {
        accessToken,
        startDate,
        endDate
      });

      // Map Google Calendar events to Job format
      const events = response.data.events.map((event: any, index: number) => ({
        id: `google-${event.id}`,
        title: event.summary,
        client: 'Google Calendar',
        location: event.location || 'No location',
        date: parseISO(event.start),
        startTime: format(parseISO(event.start), 'HH:mm'),
        endTime: format(parseISO(event.end), 'HH:mm'),
        duration: 0,
        crewId: 'imported',
        crewName: 'Imported',
        status: 'scheduled' as JobStatus,
        estimateId: undefined,
        plants: 0,
        priority: 'low' as const,
        source: 'google' // Mark as imported from Google
      }));

      setImportedEvents(events);
      setLastSyncTime(new Date());
      console.log(`Imported ${events.length} events from Google Calendar`);
    } catch (err: any) {
      console.error('Failed to import Google Calendar events:', err);
      setError(err.response?.data?.error || 'Failed to import calendar events');
    } finally {
      setIsImporting(false);
    }
  };

  // Sync jobs to Google Calendar
  const syncToGoogleCalendar = async () => {
    setIsSyncing(true);
    setError(null);
    try {
      const accessToken = localStorage.getItem('google_access_token');
      if (!accessToken) {
        setError('No Google Calendar connection found. Please connect your calendar first.');
        return;
      }

      // Sync all local jobs (not imported ones) to Google Calendar
      const localJobs = jobs.filter(job => !job.id.startsWith('google-'));
      
      for (const job of localJobs) {
        const eventData = {
          summary: `${job.title} - ${job.client}`,
          description: `Estimate: ${job.estimateId}\nCrew: ${job.crewName}\nPriority: ${job.priority}`,
          location: job.location,
          start: `${job.date}T${job.startTime}:00`,
          end: `${job.date}T${job.endTime}:00`
        };

        await axios.post(`/api/schedule/calendar/google/export`, {
          accessToken,
          event: eventData
        });
      }

      setLastSyncTime(new Date());
      alert(`Successfully synced ${localJobs.length} jobs to Google Calendar`);
      
      // Re-import to get updated events
      await importGoogleCalendarEvents();
    } catch (err: any) {
      console.error('Failed to sync to Google Calendar:', err);
      setError(err.response?.data?.error || 'Failed to sync to calendar');
    } finally {
      setIsSyncing(false);
    }
  };

  // Auto-import on component mount
  useEffect(() => {
    const accessToken = localStorage.getItem('google_access_token');
    if (accessToken) {
      importGoogleCalendarEvents();
    }
  }, [selectedDate]);

  // Combine local jobs with imported events
  const allJobs = [...jobs, ...importedEvents];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Schedule & Dispatch</h1>
          <p className="text-gray-500 mt-1">Week of {format(startDate, 'MMM d')} - {format(addDays(startDate, 6), 'MMM d, yyyy')}</p>
          {lastSyncTime && (
            <p className="text-xs text-gray-400 mt-1">
              Last synced: {format(lastSyncTime, 'MMM d, h:mm a')}
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={importGoogleCalendarEvents}
            disabled={isImporting}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${isImporting ? 'animate-spin' : ''}`} />
            {isImporting ? 'Importing...' : 'Import Calendar'}
          </button>
          <button
            onClick={syncToGoogleCalendar}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2 border border-green-600 bg-white text-green-600 rounded-lg hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync to Google'}
          </button>
          <Link to="/calendar-integration" className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50">
            <ExternalLink className="w-4 h-4" />
            Calendar Integration
          </Link>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm">
            <Plus className="w-5 h-5" />
            New Job
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Sync Status */}
      {importedEvents.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm">
            ✓ Showing {importedEvents.length} imported Google Calendar events
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        {/* Crew Status Cards */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Crews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <button
                  onClick={() => setSelectedCrew('all')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedCrew === 'all' ? 'bg-green-50 border border-green-200' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">All Crews</span>
                    <Badge>{crews.reduce((sum, c) => sum + c.activeJobs, 0)} jobs</Badge>
                  </div>
                </button>
                
                {crews.map((crew) => (
                  <button
                    key={crew.id}
                    onClick={() => setSelectedCrew(crew.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCrew === crew.id ? 'bg-green-50 border border-green-200' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{crew.name}</span>
                      <Badge variant={crew.availability === 'available' ? 'success' : crew.availability === 'busy' ? 'warning' : 'default'}>
                        {crew.availability}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500">
                      {crew.members.length} member{crew.members.length > 1 ? 's' : ''} • {crew.activeJobs} active
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">This Week</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Jobs</span>
                <span className="font-semibold text-gray-900">{allJobs.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Local Jobs</span>
                <span className="font-semibold text-blue-600">{jobs.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Imported</span>
                <span className="font-semibold text-purple-600">{importedEvents.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">In Progress</span>
                <span className="font-semibold text-yellow-600">{allJobs.filter(j => j.status === 'in-progress').length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="font-semibold text-green-600">{allJobs.filter(j => j.status === 'completed').length}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendar Grid */}
        <div className="lg:col-span-3">
          <Card padding="none">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <RefreshCw className="w-4 h-4 text-gray-600" />
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedView('week')}
                    className={`px-3 py-1 text-sm rounded ${selectedView === 'week' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    Week
                  </button>
                  <button
                    onClick={() => setSelectedView('day')}
                    className={`px-3 py-1 text-sm rounded ${selectedView === 'day' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    Day
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {allJobs.filter(j => selectedCrew === 'all' || j.crewId === selectedCrew).length} job{allJobs.filter(j => selectedCrew === 'all' || j.crewId === selectedCrew).length !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Week View */}
            <div className="overflow-x-auto">
              <div className="grid grid-cols-7 border-b border-gray-200">
                {weekDays.map((day) => (
                  <div key={day.toISOString()} className="p-3 text-center border-r last:border-r-0 border-gray-200 bg-gray-50">
                    <div className="text-xs text-gray-500 uppercase tracking-wider">{format(day, 'EEE')}</div>
                    <div className="text-lg font-semibold text-gray-900 mt-1">{format(day, 'd')}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 divide-x divide-gray-200">
                {weekDays.map((day) => {
                  const dayJobs = allJobs
                    .filter(job => selectedCrew === 'all' || job.crewId === selectedCrew)
                    .filter(job => {
                      const jobDate = typeof job.date === 'string' ? parseISO(job.date) : job.date;
                      return format(jobDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
                    });
                  
                  return (
                    <div key={day.toISOString()} className="p-3 min-h-[500px] bg-white">
                      <div className="space-y-2">
                        {dayJobs.map((job) => (
                          <div
                            key={job.id}
                            className={`p-3 rounded-lg border-l-4 cursor-pointer hover:shadow-md transition-all ${getStatusColor(job.status)}`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="text-xs font-medium text-gray-700 mb-1">
                                  <Clock className="w-3 h-3 inline mr-1" />
                                  {job.startTime}
                                  {(job as any).source === 'google' && (
                                    <span className="ml-2 px-1.5 py-0.5 bg-purple-100 text-purple-700 text-[10px] rounded">Google</span>
                                  )}
                                </div>
                                <div className="text-sm font-semibold text-gray-900 mb-1">{job.title}</div>
                                <div className="text-xs text-gray-600">{job.client}</div>
                              </div>
                              {job.priority === 'high' && (
                                <Badge variant="danger" className="text-xs">High</Badge>
                              )}
                            </div>
                            
                            <div className="mt-2 pt-2 border-t border-gray-200">
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Users className="w-3 h-3" />
                                <span>{job.crewName}</span>
                              </div>
                              {job.plants > 0 && (
                                <div className="text-xs text-gray-500 mt-1">{job.plants} plants</div>
                              )}
                            </div>
                            
                            <div className="mt-2">
                              {getStatusBadge(job.status)}
                            </div>
                          </div>
                        ))}
                        
                        {dayJobs.length === 0 && (
                          <div className="text-center py-8 text-gray-400 text-sm">
                            No jobs scheduled
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Dispatch Board */}
      <Card>
        <CardHeader>
          <CardTitle>Active Dispatch Board</CardTitle>
          <p className="text-sm text-gray-500 mt-1">Real-time job tracking and crew locations</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {jobs.filter(j => j.status === 'in-progress' || j.status === 'scheduled').slice(0, 3).map((job) => (
              <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-2 h-2 rounded-full ${job.status === 'in-progress' ? 'bg-yellow-500 animate-pulse' : 'bg-blue-500'}`}></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{job.title}</span>
                      {getStatusBadge(job.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {job.crewName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {job.startTime} - {job.endTime}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="px-4 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
