import React, { useEffect, useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import CommunityCard from './CommunityCard';
import Buttons from '../../../components/user/misc/Buttons';
import Colors from '../../../components/user/misc/Colors';
import axios from 'axios';
import { GatewayUrl } from '../../../components/const/urls';
import { useSelector } from 'react-redux';

const JoinedCommunities = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allCommunities, setAllCommunities] = useState([]);
  const userId = useSelector((state) => state.auth.userId);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await axios.get(`${GatewayUrl}api/members/${userId}/communities/`);
        setAllCommunities(response.data);
      } catch (error) {
        console.error('Error fetching communities:', error);
      }
    }
    fetchCommunities(); 
  }, []);


  
  const filteredCommunities = allCommunities.filter((community) =>
    community.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search communities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
          <MagnifyingGlassIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
      {filteredCommunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommunities.map((community) => (
            <CommunityCard key={community.id} community={community} />
          ))}
        </div>
      ) : (
        <p className={`text-center ${Colors.tealBlueGradientText}`}>
          No communities found. Try a different search term.
        </p>
      )}
    </div>
  );
};

export default JoinedCommunities;