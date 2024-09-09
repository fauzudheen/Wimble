import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GatewayUrl } from '../const/urls';
import { UserGroupIcon, PhotoIcon } from '@heroicons/react/24/solid';

const Communities = () => {
  const [communities, setCommunities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    const fetchCommunities = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${GatewayUrl}api/communities/?page=${currentPage}`);
        setCommunities(response.data.results);
        setTotalCount(response.data.count);
        setTotalPages(Math.ceil(response.data.count / ITEMS_PER_PAGE));
      } catch (error) {
        console.error('Error fetching communities:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCommunities();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto py-2">
      <h2 className="text-2xl font-bold leading-tight mb-6 dark:text-white text-center">Communities</h2>
      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((community) => (
            <div key={community.id} className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                {community.cover_image ? (
                  <img 
                    src={`${GatewayUrl}api${community.cover_image.startsWith('/') ? '' : '/'}${community.cover_image}`} 
                    alt={`${community.name} cover`} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <PhotoIcon className="w-full h-full object-cover bg-gray-200 dark:bg-gray-700" />
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <h3 className="text-xl font-semibold text-white">{community.name}</h3>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center mb-4">
                  {community.profile_image ? (
                    <img 
                      className="w-12 h-12 rounded-full mr-4 object-cover" 
                      src={`${GatewayUrl}api${community.profile_image.startsWith('/') ? '' : '/'}${community.profile_image}`} 
                      alt={`${community.name} profile`} 
                    />
                  ) : (
                    <UserGroupIcon className="w-12 h-12 rounded-full p-2 text-gray-500 mr-4 bg-gray-100 dark:bg-gray-700" />
                  )}
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {community.member_count} {community.member_count === 1 ? 'member' : 'members'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Created on {new Date(community.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{community.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-center">
      <button 
          className={`px-4 py-2 rounded ${
            currentPage === 1 
              ? 'bg-gray-100 text-gray-700 dark:text-white dark:bg-gray-700 cursor-not-allowed text-sm font-semibold' 
              : 'bg-gradient-to-r from-teal-400 to-blue-500 hover:bg-gradient-to-r hover:from-teal-400 hover:to-blue-500 text-white text-sm font-semibold shadow-md'
          } mr-2`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2 text-gray-700 dark:text-gray-300 text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <button 
          className={`px-4 py-2 rounded ${
            currentPage === totalPages 
              ? 'bg-gray-100 text-gray-700 dark:text-white dark:bg-gray-700 cursor-not-allowed text-sm font-semibold' 
              : 'bg-gradient-to-r from-teal-400 to-blue-500 hover:bg-gradient-to-r hover:from-teal-400 hover:to-blue-500 text-white text-sm font-semibold shadow-md'
          } ml-2`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Communities;