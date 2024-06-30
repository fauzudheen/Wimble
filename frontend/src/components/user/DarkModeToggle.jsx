import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid'; // Import Heroicons
import { toggleDarkMode } from '../../redux/authSlice';

const DarkModeToggle = () => {
    const dispatch = useDispatch();
    const darkMode = useSelector(state => state.auth.darkMode);

    const handleDarkModeToggle = () => {
      dispatch(toggleDarkMode());
    }

    useEffect(() => {
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }, [darkMode]);
  
    return (
      <button
          onClick={handleDarkModeToggle}
          className="bg-gray-600 dark:bg-gray-200 p-2 rounded-full flex items-center justify-center focus:outline-none"
      >
          {darkMode ? (
              <SunIcon className="h-5 w-5 text-teal-600" /> // Sun icon for light mode
          ) : (
              <MoonIcon className="h-5 w-5 text-teal-100 dark:text-gray-200" /> // Moon icon for dark mode
          )}
          <span className="sr-only">{darkMode ? 'Turn off dark mode' : 'Turn on dark mode'}</span>
      </button>
  );
};

export default DarkModeToggle
