import React from 'react';

const Dashboard = () => {
  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Website Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400">Total 28.5% Conversion Rate</p>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center">
              <span className="block text-2xl font-bold text-gray-800 dark:text-white">28%</span>
              <span className="text-gray-600 dark:text-gray-400">Sessions</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-bold text-gray-800 dark:text-white">3.1k</span>
              <span className="text-gray-600 dark:text-gray-400">Page Views</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-bold text-gray-800 dark:text-white">1.2k</span>
              <span className="text-gray-600 dark:text-gray-400">Leads</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-bold text-gray-800 dark:text-white">12%</span>
              <span className="text-gray-600 dark:text-gray-400">Conversions</span>
            </div>
          </div>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Average Daily Sales</h2>
          <p className="text-gray-600 dark:text-gray-400">$28,450</p>
          <div className="h-32 bg-gradient-to-b from-teal-400 to-blue-600 rounded-lg mt-4"></div>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Weekly Earnings Overview</h2>
          <p className="text-gray-600 dark:text-gray-400">$468</p>
          <div className="h-32 bg-gradient-to-b from-teal-400 to-blue-600 rounded-lg mt-4"></div>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Support Tracker</h2>
          <p className="text-gray-600 dark:text-gray-400">164 Total Tickets</p>
          <div className="h-32 bg-gradient-to-b from-teal-400 to-blue-600 rounded-lg mt-4"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
