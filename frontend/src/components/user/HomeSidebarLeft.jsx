import React from 'react'
import { HomeIcon, UserGroupIcon, GlobeAltIcon, TagIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/solid';
import Colors from './misc/Colors';
import PlusPromotion from './PlusPromotion';

const HomeSidebar = () => {
  return (
    <div>
      <nav className="bg-white dark:bg-gray-800 p-4 rounded-md">
        <ul className="space-y-5">
          <li className="group">
            <a href="/home" className="flex items-center justify-between p-2 group-hover:bg-teal-100 dark:group-hover:bg-teal-600 dark:text-white rounded-md transition-all duration-200 ease-in-out transform hover:scale-105">
              <div className="flex items-center">
                <HomeIcon className={`h-7 w-7 mr-2 p-1 ${Colors.tealBlueGradientButton} rounded-full`} />
                <span className="dark:text-white">Home</span>
              </div>
            </a>
          </li>
          <li className="group">
            <a href="#" className="flex items-center justify-between p-2 group-hover:bg-teal-100 dark:group-hover:bg-teal-600 dark:text-white rounded-md transition-all duration-200 ease-in-out transform hover:scale-105">
              <div className="flex items-center">
                <UserGroupIcon className={`h-7 w-7 mr-2 p-1 ${Colors.tealBlueGradientButton} rounded-full`} />
                <span className="dark:text-white">Teams</span>
              </div>
            </a>
          </li>
          <li className="group">
            <a href="/communities" className="flex items-center justify-between p-2 group-hover:bg-teal-100 dark:group-hover:bg-teal-600 dark:text-white rounded-md transition-all duration-200 ease-in-out transform hover:scale-105">
              <div className="flex items-center">
                <GlobeAltIcon className={`h-7 w-7 mr-2 p-1 ${Colors.tealBlueGradientButton} rounded-full`} />
                <span className="dark:text-white">Communities</span>
              </div>
            </a>
          </li>
          <li className="group">
            <a href="/tags" className="flex items-center justify-between p-2 group-hover:bg-teal-100 dark:group-hover:bg-teal-600 dark:text-white rounded-md transition-all duration-200 ease-in-out transform hover:scale-105">
              <div className="flex items-center">
                <TagIcon className={`h-7 w-7 mr-2 p-1 ${Colors.tealBlueGradientButton} rounded-full`} />
                <span className="dark:text-white">Tags</span>
              </div>
            </a>
          </li>
          <li className="group">
            <a href="/faq" className="flex items-center justify-between p-2 group-hover:bg-teal-100 dark:group-hover:bg-teal-600 dark:text-white rounded-md transition-all duration-200 ease-in-out transform hover:scale-105">
              <div className="flex items-center">
                <QuestionMarkCircleIcon className={`h-7 w-7 mr-2 p-1 ${Colors.tealBlueGradientButton} rounded-full`} />
                <span className="dark:text-white">FAQ</span>
              </div>
            </a>
          </li>
        </ul>
      </nav>
      <div className="mt-2 lg:hidden">
        <PlusPromotion />
      </div>
    </div>
  );
};

export default HomeSidebar;
