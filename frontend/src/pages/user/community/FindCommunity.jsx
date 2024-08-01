import React, { useEffect, useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { GatewayUrl } from '../../../components/const/urls';
import CommunityCard from '../../../components/user/community/CommunityCard';

const FindCommunity = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allCommunities, setAllCommunities] = useState([]);
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
        setAllCommunities(response.data.results);
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
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const filteredCommunities = allCommunities.filter((community) =>
    community.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-2">
      <div className="mb-6">
        <input 
          type="text" 
          placeholder="Search communities" 
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommunities.map((community) => (
            <CommunityCard key={community.id} community={community} />
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <button 
          className={`px-4 py-2 rounded ${
            currentPage === 1 
              ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-sm font-semibold' 
              : 'bg-gradient-to-r from-teal-400 to-blue-500 hover:bg-gradient-to-r hover:from-teal-400 hover:to-blue-500 text-white text-sm font-semibold shadow-md'
          } text-white mr-2`}
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
              ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-sm font-semibold' 
              : 'bg-gradient-to-r from-teal-400 to-blue-500 hover:bg-gradient-to-r hover:from-teal-400 hover:to-blue-500 text-white text-sm font-semibold shadow-md'
          } text-white ml-2`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FindCommunity;