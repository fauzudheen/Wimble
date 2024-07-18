import React, { useState } from 'react'
import DarkModeToggle from './DarkModeToggle'
import logoImg from '../../assets/Logos/Square Logo.jpeg';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UserProfileDropdown from './UserProfileDropdown';
import Colors from './misc/Colors';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isAuthenticated = useSelector(state => state.auth.isUserAuthenticated)

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="bg-white dark:bg-gray-900 shadow-md">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link to='/home'>
                            <img src={logoImg} alt="Wimble Logo" className="h-9 rounded-md" />
                        </Link>
                    </div>
                    <div className="hidden md:block flex-1 mx-4">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <Link to='/pricing'>
                                    <a className={Colors.tealBlueGradientText}>Pricing</a>
                                </Link>
                                <Link to='/create-article'>
                                    <button className={`${Colors.tealBlueGradientButton} text-white px-4 py-2 rounded-md`}>
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
                        <UserProfileDropdown />
                    </div>
                    <div className="md:hidden flex items-center">
                        <button onClick={toggleMenu} className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white mb-2"
                        />
                        {isAuthenticated ? (
                            <>
                                <Link to='/pricing'>
                                    <a className={`block ${Colors.tealBlueGradientText} px-3 py-2 rounded-md text-base font-medium`}>Pricing</a>
                                </Link>
                                <Link to='/create-article'>
                                    <a className={`block ${Colors.tealBlueGradientButton} text-white px-3 py-2 rounded-md text-base font-medium`}>Create Article</a>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to='/login'>
                                    <a className="block text-teal-500 dark:text-teal-300 px-3 py-2 rounded-md text-base font-medium">Login</a>
                                </Link>
                                <Link to='/signup'>
                                    <a className={`block ${Colors.tealBlueGradientButton} text-white px-3 py-2 rounded-md text-base font-medium`}>Signup</a>
                                </Link>
                            </>
                        )}
                        <div className="px-3 py-2">
                            <UserProfileDropdown />
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar