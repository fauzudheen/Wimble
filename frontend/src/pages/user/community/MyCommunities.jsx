import React, { useEffect, useState } from 'react';
import CommunityCard from './CommunityCard';
import { GatewayUrl } from '../../../components/const/urls';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Colors from '../../../components/user/misc/Colors';

const MyCommunities = () => {
  // Dummy data for user's joined communities
  const [myCommunities, setMyCommunities] = useState([]);
  const userId = useSelector((state) => state.auth.userId);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await axios.get(`${GatewayUrl}api/members/${userId}/admined-communities/`);
        setMyCommunities(response.data);
      } catch (error) {
        console.error('Error fetching communities:', error);
      }
    }
    fetchCommunities(); 
  }, []);

    

  return (
    <div>
      {!myCommunities.length && (
        <p className={`text-center ${Colors.tealBlueGradientText}`}>
          No communities found. Create a new community.
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myCommunities.map((community) => (
          <CommunityCard key={community.id} community={community} />
        ))}
      </div>
    </div>
  );
};

export default MyCommunities;