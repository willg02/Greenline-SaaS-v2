import React from 'react';
import { Button } from '@greenline/ui';

export default function Estimates() {
  const estimates = [
    { id: 1, client: 'Johnson Residence', amount: 8450, plants: 38, status: 'Pending', date: '2025-11-15' },
    { id: 2, client: 'Charlotte Garden Center', amount: 12300, plants: 65, status: 'Approved', date: '2025-11-14' },
    { id: 3, client: 'Maple Street Project', amount: 5200, plants: 22, status: 'Draft', date: '2025-11-16' },
    { id: 4, client: 'Riverside Development', amount: 18900, plants: 95, status: 'Approved', date: '2025-11-12' },
    { id: 5, client: 'Park Avenue Remodel', amount: 6750, plants: 31, status: 'Pending', date: '2025-11-17' },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Estimates</h1>
          <p className="text-gray-500 mt-1">Manage quotes and project proposals</p>
        </div>
        <Button className="bg-greenline-600 hover:bg-greenline-700">
          + New Estimate
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {estimates.map((est) => (
              <tr key={est.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{est.client}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{est.date}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{est.plants}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">${est.amount.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    est.status === 'Approved' ? 'bg-green-100 text-green-800' :
                    est.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {est.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-greenline-600 hover:text-greenline-900 mr-3">View</button>
                  <button className="text-gray-600 hover:text-gray-900">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
