import React from 'react';

export default function Settings() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account and preferences</p>
      </div>

      <div className="max-w-3xl space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Organization Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                defaultValue="Greenline Demo"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-greenline-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-greenline-500 focus:border-transparent">
                <option>Installer</option>
                <option>Garden Center</option>
                <option>Grower/Distributor</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing Defaults</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Wage ($/hr)</label>
              <input
                type="number"
                defaultValue="22"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-greenline-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Margin (%)</label>
              <input
                type="number"
                defaultValue="38"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-greenline-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h2>
          <div className="space-y-3">
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-greenline-600 rounded focus:ring-greenline-500" />
              <span className="ml-3 text-sm text-gray-700">Email notifications for new estimates</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-greenline-600 rounded focus:ring-greenline-500" />
              <span className="ml-3 text-sm text-gray-700">SMS reminders for scheduled jobs</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="w-4 h-4 text-greenline-600 rounded focus:ring-greenline-500" />
              <span className="ml-3 text-sm text-gray-700">Weekly performance reports</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="px-6 py-2 bg-greenline-600 text-white rounded-lg hover:bg-greenline-700">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
