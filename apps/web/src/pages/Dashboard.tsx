import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Badge } from '../components/Badge';
import { TrendingUp, DollarSign, Users, Calendar, Plus } from 'lucide-react';

const revenueData = [
  { month: 'Jun', revenue: 32000 },
  { month: 'Jul', revenue: 38000 },
  { month: 'Aug', revenue: 35000 },
  { month: 'Sep', revenue: 42000 },
  { month: 'Oct', revenue: 45000 },
  { month: 'Nov', revenue: 48000 }
];

const projectsData = [
  { week: 'Week 1', projects: 8 },
  { week: 'Week 2', projects: 12 },
  { week: 'Week 3', projects: 10 },
  { week: 'Week 4', projects: 15 }
];

export default function Dashboard() {
  const stats = [
    { label: 'Active Estimates', value: '12', change: '+2 this week', trend: 'up', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Upcoming Installs', value: '8', change: '3 this week', trend: 'neutral', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Open Projects', value: '15', change: '+5 this month', trend: 'up', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Revenue (MTD)', value: '$45,200', change: '+12% vs last month', trend: 'up', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm">
          <Plus className="w-5 h-5" />
          New Estimate
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} padding="md">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <p className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-gray-600'}`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`${stat.bg} ${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Last 6 months</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Projects This Month</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Weekly breakdown</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={projectsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Bar dataKey="projects" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Estimates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { client: 'Johnson Residence', amount: '$8,450', status: 'Pending', plants: 38, date: '2 hours ago' },
                { client: 'Charlotte Garden Center', amount: '$12,300', status: 'Approved', plants: 65, date: 'Yesterday' },
                { client: 'Maple Street Project', amount: '$5,200', status: 'Draft', plants: 22, date: '2 days ago' },
              ].map((est, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b last:border-0 hover:bg-gray-50 px-2 rounded transition-colors cursor-pointer">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{est.client}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-sm text-gray-500">{est.amount}</p>
                      <span className="text-xs text-gray-400">•</span>
                      <p className="text-sm text-gray-500">{est.plants} plants</p>
                      <span className="text-xs text-gray-400">•</span>
                      <p className="text-xs text-gray-400">{est.date}</p>
                    </div>
                  </div>
                  <Badge variant={est.status === 'Approved' ? 'success' : est.status === 'Pending' ? 'warning' : 'default'}>
                    {est.status}
                  </Badge>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-sm text-green-600 hover:text-green-700 font-medium">
              View all estimates →
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { job: 'Johnson Install', date: 'Tomorrow, 8:00 AM', crew: 'Team A', location: 'Charlotte, NC', status: 'confirmed' },
                { job: 'Maple Street Delivery', date: 'Wed, Nov 20, 10:00 AM', crew: 'Team B', location: 'Matthews, NC', status: 'confirmed' },
                { job: 'Charlotte GC Pickup', date: 'Thu, Nov 21, 2:00 PM', crew: 'Team A', location: 'Charlotte, NC', status: 'pending' },
              ].map((item, i) => (
                <div key={i} className="py-3 border-b last:border-0 hover:bg-gray-50 px-2 rounded transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900">{item.job}</p>
                    <Badge variant={item.status === 'confirmed' ? 'success' : 'warning'}>
                      {item.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{item.date}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-xs text-green-600 font-medium">{item.crew}</p>
                    <span className="text-xs text-gray-400">•</span>
                    <p className="text-xs text-gray-500">{item.location}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-sm text-green-600 hover:text-green-700 font-medium">
              View full schedule →
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
