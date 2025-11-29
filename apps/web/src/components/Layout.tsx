import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/estimates', label: 'Estimates', icon: '📋' },
  { path: '/catalog', label: 'Catalog', icon: '🌿' },
  { path: '/schedule', label: 'Schedule', icon: '📅' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-greenline-700">Greenline</h1>
          <p className="text-sm text-gray-500">SaaS Platform</p>
        </div>
        
        <nav className="flex-1 p-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 mb-1 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-greenline-50 text-greenline-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 bg-greenline-600 rounded-full flex items-center justify-center text-white font-medium">
              U
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Demo User</p>
              <p className="text-xs text-gray-500 truncate">demo@greenline.local</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
