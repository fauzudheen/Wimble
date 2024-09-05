import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { GatewayUrl } from '../const/urls';
import TeamCard from './team/TeamCard';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const ITEMS_PER_PAGE = 6;


  useEffect(() => {
    const fetchTeams = async () => {
      const response = await axios.get(`${GatewayUrl}api/teams/?page=${currentPage}`);
      setTeams(response.data.results);
      setTotalCount(response.data.count);
      setTotalPages(Math.ceil(response.data.count / ITEMS_PER_PAGE));
    };
    fetchTeams();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto py-2">
      <h2 className="text-2xl font-bold leading-tight mb-6 dark:text-white text-center">Teams</h2>

      {teams.map((team) => (
        <TeamCard key={team.id} team={team} />
      ))}

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
  )
}

export default Teams
