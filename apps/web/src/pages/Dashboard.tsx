import React from 'react';

export default function Dashboard() {
  const stats = [
    { label: 'Active Estimates', value: '12', change: '+2 this week', trend: 'up' },
    { label: 'Upcoming Installs', value: '8', change: '3 this week', trend: 'neutral' },
    { label: 'Open Projects', value: '15', change: '+5 this month', trend: 'up' },
    { label: 'Revenue (MTD)', value: '$45,200', change: '+12% vs last month', trend: 'up' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
            <p className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-gray-600'}`}>
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Estimates</h2>
          <div className="space-y-3">
            {[
              { client: 'Johnson Residence', amount: '$8,450', status: 'Pending' },
              { client: 'Charlotte Garden Center', amount: '$12,300', status: 'Approved' },
              { client: 'Maple Street Project', amount: '$5,200', status: 'Draft' },
            ].map((est, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{est.client}</p>
                  <p className="text-sm text-gray-500">{est.amount}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  est.status === 'Approved' ? 'bg-green-100 text-green-800' :
                  est.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {est.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Schedule</h2>
          <div className="space-y-3">
            {[
              { job: 'Johnson Install', date: 'Tomorrow, 8:00 AM', crew: 'Team A' },
              { job: 'Maple Street Delivery', date: 'Wed, Nov 20, 10:00 AM', crew: 'Team B' },
              { job: 'Charlotte GC Pickup', date: 'Thu, Nov 21, 2:00 PM', crew: 'Team A' },
            ].map((item, i) => (
              <div key={i} className="py-2 border-b last:border-0">
                <p className="font-medium text-gray-900">{item.job}</p>
                <p className="text-sm text-gray-500">{item.date}</p>
                <p className="text-xs text-greenline-600 mt-1">{item.crew}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
