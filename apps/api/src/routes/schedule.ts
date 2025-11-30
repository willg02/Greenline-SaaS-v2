import express from 'express';

const router = express.Router();

// Get all crews
router.get('/crews', (_req, res) => {
  const crews = [
    { id: '1', name: 'Team Alpha', members: [{ id: '1', name: 'John D.', role: 'Lead' }, { id: '2', name: 'Mike S.', role: 'Installer' }], availability: 'busy' },
    { id: '2', name: 'Team Beta', members: [{ id: '3', name: 'Sarah L.', role: 'Lead' }, { id: '4', name: 'Tom R.', role: 'Installer' }], availability: 'available' },
    { id: '3', name: 'Team Gamma', members: [{ id: '5', name: 'Lisa M.', role: 'Lead' }], availability: 'available' },
  ];
  res.json(crews);
});

// Get all jobs
router.get('/jobs', (req, res) => {
  const { startDate, endDate, crewId, status } = req.query;
  
  let jobs = [
    { id: '1', title: 'Residential Install', client: 'Johnson Residence', location: '123 Oak St, Charlotte', date: '2025-11-18', startTime: '8:00 AM', endTime: '12:00 PM', duration: 4, crewId: '1', crewName: 'Team Alpha', status: 'scheduled', plants: 38, priority: 'high' },
    { id: '2', title: 'Garden Center Delivery', client: 'Charlotte GC', location: '456 Main Ave, Matthews', date: '2025-11-18', startTime: '1:00 PM', endTime: '3:00 PM', duration: 2, crewId: '2', crewName: 'Team Beta', status: 'in-progress', plants: 65, priority: 'medium' },
  ];

  if (crewId) jobs = jobs.filter(j => j.crewId === crewId);
  if (status) jobs = jobs.filter(j => j.status === status);
  
  res.json(jobs);
});

// Create new job
router.post('/jobs', (req, res) => {
  const job = {
    id: Date.now().toString(),
    ...req.body,
    status: 'scheduled',
    createdAt: new Date().toISOString()
  };
  res.status(201).json(job);
});

// Update job
router.patch('/jobs/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  res.json({ id, ...updates, updatedAt: new Date().toISOString() });
});

// Google Calendar sync
router.post('/calendar/google/sync', async (req, res) => {
  // Placeholder for Google Calendar API integration
  const { accessToken } = req.body;
  
  if (!accessToken) {
    return res.status(400).json({ error: 'Access token required' });
  }

  // TODO: Implement Google Calendar API sync
  res.json({ 
    synced: true, 
    eventsImported: 0,
    message: 'Google Calendar integration coming soon'
  });
});

// Outlook Calendar sync
router.post('/calendar/outlook/sync', async (req, res) => {
  // Placeholder for Outlook Calendar API integration
  const { accessToken } = req.body;
  
  if (!accessToken) {
    return res.status(400).json({ error: 'Access token required' });
  }

  // TODO: Implement Outlook Calendar API sync
  res.json({ 
    synced: true, 
    eventsImported: 0,
    message: 'Outlook Calendar integration coming soon'
  });
});

// Route optimization
router.post('/jobs/optimize-route', (req, res) => {
  const { jobIds } = req.body;
  
  // Simple placeholder optimization
  res.json({
    optimizedRoute: jobIds,
    estimatedTime: jobIds.length * 45, // minutes
    totalDistance: jobIds.length * 8.5, // miles
    suggestions: [
      'Start with closest job to crew location',
      'Group jobs by proximity',
      'Consider traffic patterns'
    ]
  });
});

export default router;
