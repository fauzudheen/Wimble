import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserCircleIcon, CogIcon, ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/solid'; // Importing Heroicons
import DarkModeToggle from './DarkModeToggle'; // Importing the DarkModeToggle component
import { useDispatch, useSelector } from 'react-redux';
import { setUserLogout } from '../../redux/authSlice';

const UserProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch()
  const isAuthenticated = useSelector(state => state.auth.isUserAuthenticated)

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    dispatch(setUserLogout());
  }

  return (
    <div className="relative z-50">
      <button
        className="flex items-center focus:outline-none"
        onClick={toggleDropdown}
      >
        {/* Placeholder for profile avatar */}
        <div className="w-8 h-8 rounded-full bg-gray-300"></div>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg py-1">
            {isAuthenticated ? (
          <Link
            to="/profile"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
            onClick={() => setIsOpen(false)}
          >
            <UserCircleIcon className="h-5 w-5 mr-2 text-gray-500" />
            My Profile
          </Link>

            ) : null}
          <Link
            to="/settings"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
            onClick={() => setIsOpen(false)}
          >
            <CogIcon className="h-5 w-5 mr-2 text-gray-500" />
            Settings
          </Link>
          {isAuthenticated ? (
          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
            onClick={handleLogout}
          >
            <ArrowRightStartOnRectangleIcon className="h-5 w-5 mr-2 text-gray-500" />
            Logout
          </button>
          ) : null}
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-sm text-gray-700 dark:text-white">Dark Mode</span>
            <DarkModeToggle /> {/* Render DarkModeToggle component */}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;
