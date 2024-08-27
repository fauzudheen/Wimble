import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios'; // Assuming you're using axios for API calls
import DarkModeToggle from './DarkModeToggle';
import logoImg from '../../assets/Logos/Square Logo.jpeg';
import UserProfileDropdown from './UserProfileDropdown';
import Colors from './misc/Colors';
import HomeSidebar from './HomeSidebarLeft';
import NotificationDropdown from './NotificationDropdown';
import { GatewayUrl } from '../const/urls';
import { DocumentTextIcon, HashtagIcon, UserGroupIcon, UserIcon, UsersIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const searchRef = useRef(null);
    const isAuthenticated = useSelector(state => state.auth.isUserAuthenticated);
    const navigate = useNavigate();

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchFocused(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery) fetchSearchResults();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const fetchSearchResults = async () => {
        try {
            const response = await axios.get(`${GatewayUrl}api/search/?query=${searchQuery}`);
            setSearchResults(response.data);
            console.log('Search results:', response.data);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setIsSearchFocused(false);
        navigate(`/search-results?query=${searchQuery}`);
    };

    const categoryPaths = {
        users: 'user-profile',
        teams: 'teams',
        communities: 'communities',
        articles: 'article',
        tags: 'articles-by-tag',
    };

    return (
        <header className="bg-white dark:bg-gray-900 shadow-md">
            <div className="mx-auto px-2 sm:px-4 lg:px-6">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <button onClick={toggleSidebar} className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none mr-2 lg:hidden">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <Link to='/home' className="flex-shrink-0">
                            <img src={logoImg} alt="Wimble Logo" className="h-8 w-auto rounded-md" />
                        </Link>
                    </div>
                    
                    <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-start">
                        <div className="max-w-lg w-full lg:max-w-xs" ref={searchRef}>
                            <form onSubmit={handleSearchSubmit} className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="block w-full pl-10 pr-3 py-2 border dark:text-white border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                />
                                <button type="submit" className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <span className="sr-only">Search</span>
                                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </form>
                            {isSearchFocused && searchResults && (
                                <div className="absolute z-10 mt-1 w-[60%] bg-gray-50 dark:bg-gray-800 shadow-lg max-h-[70vh] rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                    {Object.entries(searchResults).map(([category, items]) => (
                                        <div key={category} className="mb-2">
                                            <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center">
                                                {category === 'users' && <UserIcon className="h-4 w-4 mr-2 text-teal-500" />}
                                                {category === 'teams' && <UsersIcon className="h-4 w-4 mr-2 text-blue-500" />}
                                                {category === 'communities' && <UserGroupIcon className="h-4 w-4 mr-2 text-purple-500" />}
                                                {category === 'articles' && <DocumentTextIcon className="h-4 w-4 mr-2 text-red-500" />}
                                                {category === 'tags' && <HashtagIcon className="h-4 w-4 mr-2 text-green-500" />}
                                                {category}
                                            </h3>
                                            {items.map((item, index) => (
                                                <Link
                                                    key={index}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        navigate(`/${categoryPaths[category]}/${item.id || item.slug}`);
                                                        setIsSearchFocused(false);
                                                        setSearchQuery('');
                                                    }}
                                                    className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150 ease-in-out"
                                                >
                                                    {category === 'users' && (
                                                        item.profile ? (
                                                            <img
                                                                src={`${GatewayUrl}api${item.profile}`}
                                                                alt={item.first_name}
                                                                className="h-8 w-8 md:h-10 md:w-10 object-cover rounded-full border-2 border-teal-500 dark:border-gray-700 mr-3"
                                                            />
                                                        ) : (
                                                            <UserIcon className="h-8 w-8 md:h-10 md:w-10 p-1 bg-gray-100 text-gray-500 border-2 border-teal-100 dark:border-gray-700 rounded-full mr-3" />
                                                        )
                                                    )}
                                                    {category === 'teams' && (
                                                        item.profile_image ? (
                                                            <img
                                                                src={`${GatewayUrl}api${item.profile_image}`}
                                                                alt={item.name}
                                                                className="h-8 w-8 md:h-10 md:w-10 object-cover rounded-full border-2 border-blue-500 dark:border-gray-700 mr-3"
                                                            />
                                                        ) : (
                                                            <UsersIcon className="h-8 w-8 md:h-10 md:w-10 p-1 bg-gray-100 text-gray-500 border-2 border-blue-100 dark:border-gray-700 rounded-full mr-3" />
                                                        )
                                                    )}
                                                    {category === 'communities' && (
                                                        item.profile_image ? (
                                                            <img
                                                                src={`${GatewayUrl}api${item.profile_image}`}
                                                                alt={item.name}
                                                                className="h-8 w-8 md:h-10 md:w-10 object-cover rounded-full border-2 border-purple-500 dark:border-gray-700 mr-3"
                                                            />
                                                        ) : (
                                                            <UserGroupIcon className="h-8 w-8 md:h-10 md:w-10 p-1 bg-gray-100 text-gray-500 border-2 border-purple-100 dark:border-gray-700 rounded-full mr-3" />
                                                        )
                                                    )}
                                                    {category === 'articles' && (
                                                        item.thumbnail ? (
                                                        <img  src={`${GatewayUrl}api${item.thumbnail}`} alt={item.title} className="h-8 w-8 md:h-10 md:w-10 object-cover rounded-md border-2 border-red-500 dark:border-gray-700 mr-3" /> 
                                                        ) : (
                                                        <DocumentTextIcon className="h-8 w-8 md:h-10 md:w-10 p-1 bg-gray-100 text-red-500 border-2 border-red-100 dark:border-gray-700 rounded-full mr-3" />
                                                    )
                                                    )}
                                                    {category === 'tags' && (
                                                        <HashtagIcon className="h-8 w-8 md:h-10 md:w-10 p-2 bg-gray-100 text-green-500 border-2 border-green-100 dark:border-gray-700 rounded-full mr-3" />
                                                    )}
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                            {item.name || item.title || `${item.first_name} ${item.last_name}`}
                                                        </p>
                                                        {item.description && (
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                                {item.description}
                                                            </p>
                                                        )}
                                                        {item.tagline && (
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                                {item.tagline}
                                                            </p>
                                                        )}
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ))}

                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <Link to='/pricing' className={`${Colors.tealBlueGradientText} hidden sm:block`}>
                                    Pricing
                                </Link>
                                <Link to='/create-article'>
                                    <button className={`${Colors.tealBlueGradientButton} text-white px-2 sm:px-3 py-1 sm:py-2 rounded-md`}>
                                        Create Article
                                    </button>
                                </Link>
                                <NotificationDropdown />
                            </>
                        ) : (
                            <>
                                <Link to='/login' className="text-teal-500 dark:text-teal-300 hidden sm:block">
                                    Login
                                </Link>
                                <Link to='/signup'>
                                    <button className={`${Colors.tealBlueGradientButton} text-white px-2 sm:px-3 py-1 sm:py-2 rounded-md`}>
                                        Signup
                                    </button>
                                </Link>
                            </>
                        )}
                        <UserProfileDropdown />
                    </div>
                </div>
            {isSidebarOpen && (
                <div className="fixed inset-0 z-50 flex lg:hidden">
                    <div className="bg-white dark:bg-gray-900 w-64 p-4">
                        <button onClick={toggleSidebar} className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none mb-4">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <HomeSidebar />
                    </div>
                    <div className="flex-1 bg-gray-600 bg-opacity-75" onClick={toggleSidebar}></div>
                </div>
            )}
            </div>
        </header>
    );
};

export default Navbar;
