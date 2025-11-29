import React from 'react';

export default function Schedule() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const events = [
    { day: 0, time: '8:00 AM', job: 'Johnson Install', crew: 'Team A', duration: 4 },
    { day: 1, time: '10:00 AM', job: 'Maple St Delivery', crew: 'Team B', duration: 2 },
    { day: 2, time: '9:00 AM', job: 'Charlotte GC', crew: 'Team A', duration: 3 },
    { day: 3, time: '2:00 PM', job: 'Riverside Project', crew: 'Team B', duration: 4 },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Schedule</h1>
          <p className="text-gray-500 mt-1">Week of November 18-22, 2025</p>
        </div>
        <button className="px-4 py-2 bg-greenline-600 text-white rounded-lg hover:bg-greenline-700">
          + New Job
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-5 border-b border-gray-200">
          {days.map((day, i) => (
            <div key={day} className="p-4 text-center border-r last:border-r-0 border-gray-200 bg-gray-50">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{day}</div>
              <div className="text-lg font-semibold text-gray-900">{18 + i}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-5 divide-x divide-gray-200">
          {days.map((_, dayIndex) => (
            <div key={dayIndex} className="p-4 min-h-[400px]">
              {events
                .filter((e) => e.day === dayIndex)
                .map((event, i) => (
                  <div
                    key={i}
                    className="mb-2 p-3 bg-greenline-50 border-l-4 border-greenline-600 rounded hover:bg-greenline-100 cursor-pointer"
                  >
                    <div className="text-xs font-medium text-greenline-700 mb-1">{event.time}</div>
                    <div className="text-sm font-semibold text-gray-900">{event.job}</div>
                    <div className="text-xs text-gray-600 mt-1">{event.crew} • {event.duration}h</div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
