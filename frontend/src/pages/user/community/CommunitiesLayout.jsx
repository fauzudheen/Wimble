import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import { UsersIcon, UserGroupIcon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import AllCommunities from './AllCommunities';
import MyCommunities from './MyCommunities';
import FindCommunity from './FindCommunity';
import CreateCommunity from './CreateCommunity';
import Colors from '../../../components/user/misc/Colors';

const CommunitiesLayout = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 px-4">
      <div className="max-w-7xl mx-auto">
        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <Tab.List className="flex space-x-1 rounded-xl bg-teal-900/20 p-1">
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-teal-700 ring-white ring-opacity-60 ring-offset-2 ring-offset-teal-400 focus:outline-none focus:ring-2 ${
                  selected
                    ? 'bg-white shadow'
                    : 'text-teal-100 hover:bg-white/[0.12] hover:text-white'
                }`
              }
            >
              <div className="flex items-center justify-center">
                <UserGroupIcon className="w-5 h-5 mr-2" />
                My Communities
              </div>
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-teal-700 ring-white ring-opacity-60 ring-offset-2 ring-offset-teal-400 focus:outline-none focus:ring-2 ${
                  selected
                    ? 'bg-white shadow'
                    : 'text-teal-100 hover:bg-white/[0.12] hover:text-white'
                }`
              }
            >
              <div className="flex items-center justify-center">
                <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
                Find Community
              </div>
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-teal-700 ring-white ring-opacity-60 ring-offset-2 ring-offset-teal-400 focus:outline-none focus:ring-2 ${
                  selected
                    ? 'bg-white shadow'
                    : 'text-teal-100 hover:bg-white/[0.12] hover:text-white'
                }`
              }
            >
              <div className="flex items-center justify-center">
                <PlusIcon className="w-5 h-5 mr-2" />
                Create Community
              </div>
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-2">
            <Tab.Panel>
              <MyCommunities />
            </Tab.Panel>
            <Tab.Panel>
              <FindCommunity />
            </Tab.Panel>
            <Tab.Panel>
              <CreateCommunity />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default CommunitiesLayout;