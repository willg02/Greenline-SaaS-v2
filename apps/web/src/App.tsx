import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import Estimates from './pages/Estimates';
import Catalog from './pages/Catalog';
import Schedule from './pages/Schedule';
import CalendarIntegration from './pages/CalendarIntegration';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/estimates" element={<Estimates />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/calendar-integration" element={<CalendarIntegration />} />
          <Route path="/auth/google/callback" element={<CalendarIntegration />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
