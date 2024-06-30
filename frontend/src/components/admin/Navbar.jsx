import React from 'react';
import DarkModeToggle from '../user/DarkModeToggle';

const Navbar = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-md rounded-md">
      <input
        type="text"
        placeholder="Search (Ctrl+/)"
        className="px-4 py-2 w-full sm:w-1/3 mb-2 sm:mb-0 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white"
      />
      <div className="flex items-center">
        <DarkModeToggle />
        <div className="flex items-center ml-4">
          <img
            src="https://via.placeholder.com/40"
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-gray-300 dark:border-gray-600"
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
