import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Colors from '../../components/user/misc/Colors';


const SettingsLayout = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    const path = location.pathname.split('/')[2] || 'general';
    setActiveTab(path);
  }, [location]);

  const tabs = [
    { name: 'General', path: '/settings/general' },
    { name: 'Notifications', path: '/settings/notifications' },
    { name: 'Account', path: '/settings/account' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h1 className={`text-3xl font-bold text-gray-700 dark:text-gray-100`}>Settings</h1>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Manage your account settings and preferences.
            </p>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700">
            <nav className="flex">
              {tabs.map((tab) => (
                <Link
                  key={tab.name}
                  to={tab.path}
                  className={`px-4 py-4 text-sm font-medium ${
                    activeTab === tab.path.split('/')[2]
                      ? `${Colors.tealBlueGradientText} border-b-2 border-blue-500`
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  {tab.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;