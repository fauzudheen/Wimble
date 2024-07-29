import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import {
  UserGroupIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  UserIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import MyCommunities from './MyCommunities';
import FindCommunity from './FindCommunity';
import CreateCommunity from './CreateCommunity';
import JoinedCommunities from './JoinedCommunities';

const CommunitiesLayout = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const tabs = [
    { name: 'My Communities', icon: UsersIcon, component: MyCommunities },
    { name: 'Joined Communities', icon: UserGroupIcon, component: JoinedCommunities },
    { name: 'Find Community', icon: MagnifyingGlassIcon, component: FindCommunity },
    { name: 'Create Community', icon: PlusIcon, component: CreateCommunity },
  ];

  return (
    <div className="bg-gray-100 dark:bg-black">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <Tab.List className="flex flex-wrap justify-between space-y-2 sm:space-y-0 rounded-xl bg-white dark:bg-gray-800 p-2 shadow-md">
            {tabs.map((tab, index) => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  `w-full sm:w-auto flex items-center justify-center px-3 py-2 text-xs sm:text-sm font-medium leading-5 rounded-lg transition-all duration-200 ease-in-out focus:outline-none ${
                    selected
                      ? 'bg-gradient-to-r from-teal-400 to-blue-500 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
              >
                <tab.icon className="w-4 h-4 mr-1 sm:w-5 sm:h-5" />
                {tab.name}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-6">
            {tabs.map((tab, index) => (
              <Tab.Panel key={tab.name}>
                <tab.component />
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default CommunitiesLayout;
