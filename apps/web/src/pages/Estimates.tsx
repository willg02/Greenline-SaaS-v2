import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Search, Filter, Plus, Download, MoreVertical } from 'lucide-react';

export default function Estimates() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const allEstimates = [
    { id: 1, client: 'Johnson Residence', amount: 8450, plants: 38, status: 'Pending', date: '2025-11-15', margin: 38 },
    { id: 2, client: 'Charlotte Garden Center', amount: 12300, plants: 65, status: 'Approved', date: '2025-11-14', margin: 42 },
    { id: 3, client: 'Maple Street Project', amount: 5200, plants: 22, status: 'Draft', date: '2025-11-16', margin: 35 },
    { id: 4, client: 'Riverside Development', amount: 18900, plants: 95, status: 'Approved', date: '2025-11-12', margin: 41 },
    { id: 5, client: 'Park Avenue Remodel', amount: 6750, plants: 31, status: 'Pending', date: '2025-11-17', margin: 39 },
    { id: 6, client: 'Willow Creek HOA', amount: 24500, plants: 120, status: 'Approved', date: '2025-11-10', margin: 45 },
    { id: 7, client: 'Sunset Gardens', amount: 3900, plants: 18, status: 'Draft', date: '2025-11-18', margin: 33 },
  ];

  const estimates = allEstimates.filter(e => 
    (statusFilter === 'All' || e.status === statusFilter) &&
    e.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Estimates</h1>
          <p className="text-gray-500 mt-1">Manage quotes and project proposals</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm">
            <Plus className="w-5 h-5" />
            New Estimate
          </button>
        </div>
      </div>

      {/* Filters */}
      <Card padding="sm" className="mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by client name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option>All</option>
              <option>Draft</option>
              <option>Pending</option>
              <option>Approved</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            {estimates.length} estimate{estimates.length !== 1 ? 's' : ''}
          </div>
        </div>
      </Card>

      {/* Estimates Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plants
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Margin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {estimates.map((est) => (
                <tr key={est.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{est.client}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{new Date(est.date).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{est.plants} plants</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">${est.amount.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{est.margin}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={
                      est.status === 'Approved' ? 'success' :
                      est.status === 'Pending' ? 'warning' :
                      'default'
                    }>
                      {est.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
