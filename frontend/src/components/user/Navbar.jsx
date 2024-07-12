import React from 'react'
import DarkModeToggle from './DarkModeToggle'
import logoImg from '../../assets/Logos/Square Logo.jpeg';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UserProfileDropdown from './UserProfileDropdown';
import Colors from './Colors';

const Navbar = () => {

    const isAuthenticated = useSelector(state => state.auth.isUserAuthenticated)

    return (
        <header className="flex justify-between items-center p-4 bg-white dark:bg-gray-900 shadow-md">
          <div className="flex items-center w-1/2"> 
          <Link to='/home'>
            <img src={logoImg} alt="Wimble Logo" className="h-9 rounded-md" />
            </Link>
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
                  <a className={Colors.tealBlueGradientText}>Pricing</a>
              </Link>
                <Link to='/create-article'>
              <button  className={`${Colors.tealBlueGradientButton} text-white px-4 py-2 rounded-md`}>
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
              <button className={`${Colors.tealBlueGradientButton} text-white px-4 py-2 rounded-md`}>
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
