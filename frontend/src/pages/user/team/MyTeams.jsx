import React, { useEffect, useState } from 'react'
import createAxiosInstance from '../../../api/axiosInstance';
import { GatewayUrl } from '../../../components/const/urls';
import { useSelector } from 'react-redux';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import TeamCard from '../../../components/user/team/TeamCard';

const MyTeams = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allTeams, setAllTeams] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const token = useSelector((state) => state.auth.userAccess);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    const fetchTeams = async () => {
      setIsLoading(true);
      try {
        const axiosInstance = createAxiosInstance(token);
        const response = await axiosInstance.get(`${GatewayUrl}api/member-teams/?page=${currentPage}`);
        console.log(response.data);
        setAllTeams(response.data.results);
        setTotalCount(response.data.count);
        setTotalPages(Math.ceil(response.data.count / ITEMS_PER_PAGE));
      } catch (error) {
        console.error('Error fetching teams:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeams();
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const filteredTeams = allTeams.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-4 px-4">
      <div className="mb-8 relative">
        <input 
          type="text" 
          placeholder="Search teams" 
          className="w-full px-4 py-3 pl-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <MagnifyingGlassIcon className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredTeams.map((team) => (
            <TeamCard key={team.id} team={team} />
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

export default MyTeams
