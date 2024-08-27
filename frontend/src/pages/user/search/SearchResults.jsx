import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tab } from '@headlessui/react';
import { UserIcon, UsersIcon, UserGroupIcon, DocumentTextIcon, HashtagIcon } from '@heroicons/react/24/outline';
import { GatewayUrl } from '../../../components/const/urls';
import CommunityCard from '../../../components/user/community/CommunityCard';
import TeamCard from '../../../components/user/team/TeamCard';
import CompactArticle from '../../../components/user/article/CompactArticle';
import UserCard from '../../../components/user/profile/UserCard';

const SearchResults = () => {
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('query');
  const [results, setResults] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`${GatewayUrl}api/search/?query=${searchQuery}`);
        const data = await response.json();
        setResults(data);
        console.log('Search results:', data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    fetchResults();
  }, [searchQuery]);

  if (!results) return <div>Loading...</div>;

  const categories = Object.keys(results);
  const tabs = [
    { name: 'Users', icon: UserIcon },
    { name: 'Teams', icon: UsersIcon },
    { name: 'Communities', icon: UserGroupIcon },
    { name: 'Articles', icon: DocumentTextIcon },
    { name: 'Tags', icon: HashtagIcon },
  ].filter(tab => categories.includes(tab.name.toLowerCase()));

  return (
    <div className="container mx-auto px-4 py-2 ">
      <h1 className="text-2xl font-bold mb-6 dark:text-gray-100">Search Results for "{searchQuery}"</h1>

      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="flex flex-wrap justify-between space-y-2 sm:space-y-0 rounded-xl bg-white dark:bg-gray-800 p-2 shadow-md mb-6">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                `w-full sm:w-auto flex items-center justify-center px-3 py-2 text-xs sm:text-sm font-medium leading-5 rounded-lg transition-all duration-200 ease-in-out focus:outline-none ${
                  selected
                    ? 'bg-gradient-to-r from-teal-400 to-blue-500 text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
            >
              <tab.icon className="w-4 h-4 mr-1 sm:w-5 sm:h-5" />
              {tab.name}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          {tabs.map((tab, index) => (
            <Tab.Panel key={tab.name}>
              <div className={`grid ${tab.name === 'Teams' ? 'grid-cols-1' : 'gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                {results[tab.name.toLowerCase()].map((item) => (
                  <React.Fragment key={item.id}>
                    {tab.name === 'Users' && (
                      <UserCard user={item} />
                    )}
                    {tab.name === 'Teams' && (
                      <TeamCard team={item} />
                    )}
                    {tab.name === 'Communities' && (
                      <CommunityCard community={item} />
                    )}
                    {tab.name === 'Articles' && (
                      <div key={item.id}>
                        <CompactArticle article={item} />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
              {tab.name === 'Tags' && (
                <div className="flex flex-wrap gap-2">
                  {results[tab.name.toLowerCase()].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => navigate(`/articles-by-tag/${item.id}`)}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      # {item.name}
                    </button>
                  ))}
                </div>
              )}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default SearchResults;