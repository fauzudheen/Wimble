import React, { useState } from 'react'
import DarkModeToggle from './DarkModeToggle'
import logoImg from '../../assets/Logos/Square Logo.jpeg';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UserProfileDropdown from './UserProfileDropdown';
import Colors from './misc/Colors';
import HomeSidebar from './HomeSidebarLeft';
import Notifications from './Notifications';
import NotificationDropdown from './NotificationDropdown';

const Navbar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const isAuthenticated = useSelector(state => state.auth.isUserAuthenticated)

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <header className="bg-white dark:bg-gray-900 shadow-md">
            <div className="mx-auto px-2 sm:px-3 lg:px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <button onClick={toggleSidebar} className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none mr-2 lg:hidden">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <Link to='/home'>
                            <img src={logoImg} alt="Wimble Logo" className="h-6 sm:h-8 rounded-md" />
                        </Link>
                    </div>
                    <div className="flex-1 mx-2 sm:mx-4">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full p-1 sm:p-2 text-xs sm:text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        {isAuthenticated ? (
                            <>
                                <Link to='/pricing'>
                                <a className={`${Colors.tealBlueGradientText} text-xs sm:text-sm md:text-base lg:text-md`}>
                                Pricing
                                </a>
                                </Link>
                                <Link to='/create-article'>
                                    <button className={`${Colors.tealBlueGradientButton} text-white text-xs sm:text-sm md:text-base lg:text-md px-2 sm:px-3 py-1 sm:py-2 rounded-md`}>
                                        Create Article
                                    </button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to='/login'>
                                    <a className="text-teal-500 dark:text-teal-300 text-xs sm:text-sm">Login</a>
                                </Link>
                                <Link to='/signup'>
                                    <button className={`${Colors.tealBlueGradientButton} text-white text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 rounded-md`}>
                                        Signup
                                    </button>
                                </Link>
                            </>
                        )}
                        <NotificationDropdown />
                        <UserProfileDropdown />
                    </div>
                </div>
            </div>
            {/* Sidebar */}
            {isSidebarOpen && (
                <div className="fixed inset-0 z-50 flex">
                    <div className="bg-gray-100 dark:bg-gray-900 p-4 w-64">
                        <button onClick={toggleSidebar} className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none mb-4">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <HomeSidebar />
                    </div>
                    <div className="flex-1" onClick={toggleSidebar}></div>
                </div>
            )}
        </header>
    );
};

export default Navbar;