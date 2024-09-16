import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tab } from '@headlessui/react';
import { UserIcon, UsersIcon, UserGroupIcon, DocumentTextIcon, HashtagIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { GatewayUrl } from '../const/urls';
import createAxiosInstance from '../../api/axiosInstance';
import { useSelector } from 'react-redux';
import CompactArticle from './article/CompactArticle';

const SearchResults = () => {
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('query');
  const [results, setResults] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.adminAccess);

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

  const handleBlockToggle = async (id) => {
    try {
      const axiosInstance = createAxiosInstance(token);
      const user = results.users.find((user) => user.id === id);
      const dataToSend = { is_active: !user.is_active };
      await axiosInstance.patch(`${GatewayUrl}api/users/${id}/`, dataToSend);
      setResults(prevResults => ({
        ...prevResults,
        users: prevResults.users.map(user =>
          user.id === id ? { ...user, is_active: dataToSend.is_active } : user
        )
      }));
    } catch (error) {
      console.error('Error blocking/unblocking user:', error);
    }
  };

  const renderUserCard = (user) => (
    <div key={user.id} className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
      <div className="p-5">
        <div className="flex items-center mb-4">
          {user.profile ? (
            <img src={user.profile} className='w-12 h-12 rounded-full mr-4 object-cover'/>
          ) : (
            <img className="w-12 h-12 rounded-full mr-4" src={`https://ui-avatars.com/api/?name=${user.first_name}&background=random`} alt="" />
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{user.first_name} {user.last_name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
          </div>
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold">Username:</span> {user.username}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold">Account Tier:</span> {user.account_tier}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold">Joined On:</span> {new Date(user.date_joined).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            user.is_active ? 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-white' : 'bg-red-200 text-red-800 dark:bg-red-700 dark:text-white'
          }`}>
            {user.is_active ? "Active" : "Blocked"}
          </span>
          <button 
            onClick={() => handleBlockToggle(user.id)}
            className={`text-sm ${
              user.is_active ? 'text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300' : 'text-teal-600 dark:text-teal-400 hover:text-teal-900 dark:hover:text-teal-300'
            }`}
          >
            {user.is_active ? 'Block' : 'Unblock'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-2">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results[tab.name.toLowerCase()].map((item) => (
                  <React.Fragment key={item.id}>
                  {tab.name === 'Users' && renderUserCard(item)}
                  {tab.name === 'Teams' && (
                    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden p-5">
                      <div className="flex items-center mb-4">
                        {item.profile_image ? (
                          <img src={item.profile_image} className="w-16 h-16 rounded-full object-cover" alt={item.name} />
                        ) : (
                          <UsersIcon className="w-16 h-16 p-2 rounded-full text-blue-500" />
                        )}
                        <div className="ml-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {tab.name === 'Communities' && (
                    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden p-5">
                      <div className="flex items-center mb-4">
                        {item.profile_image ? (
                          <img src={item.profile_image} className="w-16 h-16 rounded-full object-cover" alt={item.name} />
                        ) : (
                          <UserGroupIcon className="w-16 h-16 p-2 rounded-full text-blue-500" />
                        )}
                        <div className="ml-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                        </div>
                      </div>
                      {item.cover_image && (
                        <img src={item.cover_image} className="w-full h-32 object-cover mt-4 rounded" alt="Cover" />
                      )}
                    </div>
                  )}
                  {tab.name === 'Articles' && (
                    <CompactArticle article={item} />
                    )}
                </React.Fragment>
                ))}
              </div>
              
              {tab.name === 'Tags' && (
                <div className="flex flex-wrap gap-2">
                  {results[tab.name.toLowerCase()].map((item) => (
                    <button
                      key={item.id}
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