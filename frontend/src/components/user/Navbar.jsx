import React from 'react'
import DarkModeToggle from './DarkModeToggle'
import logoImg from '../../assets/Logos/Square Logo.jpeg';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UserProfileDropdown from './UserProfileDropdown';

const Navbar = () => {

    const isAuthenticated = useSelector(state => state.auth.isUserAuthenticated)

    return (
        <header className="flex justify-between items-center p-4 bg-white dark:bg-gray-900 shadow-md">
          <div className="flex items-center w-1/2"> 
            <img src={logoImg} alt="Wimble Logo" className="h-9 rounded-md" />
            <input
              type="text"
              placeholder="Search..."
              className="ml-4 p-2 border w-full rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="flex items-center space-x-4">
            { isAuthenticated ? (
              <>
              <Link to='/pricing'>
                  <a className="text-teal-500 dark:text-teal-300">Pricing</a>
              </Link>
                <Link to='/create-article'>
              <button className="bg-gradient-to-r from-teal-400 to-blue-500 dark:bg-gradient-to-r dark:from-teal-400 dark:to-blue-500 text-white px-4 py-2 rounded-md">
                Create Article
              </button>
              </Link>
              </>
            ) : (
              <>
              <Link to='/login'>
                  <a className="text-teal-500 dark:text-teal-300">Login</a>
              </Link>
              <Link to='/signup'>
              <button className="bg-gradient-to-r from-teal-400 to-blue-500 dark:bg-gradient-to-r dark:from-teal-400 dark:to-blue-500 text-white px-4 py-2 rounded-md">
                Signup
              </button>
              </Link>
              </>
            )}
            <div className="flex space-x-4">
              <UserProfileDropdown />
            </div>
          </div>
        </header>
      );
    };

export default Navbar
