import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DocumentTextIcon, HashtagIcon, UserGroupIcon, UserIcon, UsersIcon } from '@heroicons/react/24/outline';
import DarkModeToggle from '../user/DarkModeToggle';
import { GatewayUrl } from '../const/urls';
import { SearchIcon } from 'lucide-react';

const categoryPaths = {
  users: 'users',
  teams: 'teams',
  communities: 'communities',
  articles: 'articles',
  tags: 'tags',
};

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({});
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsSearchFocused(false);
    navigate(`/admin/search-results?query=${searchQuery}`);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md rounded-md">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 flex justify-between">
        <div className="flex items-center justify-between h-16">
          <div className="relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="flex items-center">
              <input
                type="text"
                placeholder="Search..."
                className="px-4 py-2 w-[48vw] sm:w-[30vw]  rounded-l-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-teal-400 to-blue-500 text-white px-4 py-2 rounded-r-lg hover:from-teal-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <SearchIcon className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
  
        <div className="flex items-center space-x-4">
            <DarkModeToggle />
          </div>
        </div>
    </nav>
  );
}


export default Navbar;