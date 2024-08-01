import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GatewayUrl } from '../../const/urls';
import { UserPlusIcon, UserMinusIcon, BellIcon } from '@heroicons/react/24/solid';

const TeamMembers = ({ id }) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [showRequests, setShowRequests] = useState(false);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const { data } = await axios.get(`${GatewayUrl}api/teams/${id}/members/`);
        setTeamMembers(data.filter(m => m.request_status === "accepted"));
        setPendingRequests(data.filter(m => m.request_status !== "accepted"));
      } catch (error) {
        console.error("Error fetching team members:", error);
      }
    };
    fetchTeamMembers();
  }, [id]);

  const handleRequestAction = async (memberId, action) => {
    try {
      await axios.patch(`${GatewayUrl}api/teams/${id}/members/${memberId}/`, {
        request_status: action === 'accept' ? 'accepted' : 'rejected'
      });
      const { data } = await axios.get(`${GatewayUrl}api/teams/${id}/members/`);
      setTeamMembers(data.filter(m => m.request_status === "accepted"));
      setPendingRequests(data.filter(m => m.request_status !== "accepted"));
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
    }
  };

  const MemberCard = ({ member }) => (
    <div className="bg-white dark:bg-gray-800 rounded p-2 flex items-center space-x-2 text-sm">
      <img 
        src={`${GatewayUrl}api/user_service/media/${member.user_data.profile.split('/media/media/')[1]}`}
        alt={`${member.user_data.first_name} ${member.user_data.last_name}`}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div>
        <h3 className="font-semibold">{member.user_data.first_name} {member.user_data.last_name}</h3>
        <p className="text-xs text-gray-500">{member.user_data.tagline}</p>
        <p className="text-xs text-gray-400">Role: {member.role}</p>
      </div>
    </div>
  );

  const RequestCard = ({ request }) => (
    <div className="bg-white dark:bg-gray-800 rounded p-2 flex items-center justify-between text-sm">
      <div className="flex items-center space-x-2">
        <img 
          src={`${GatewayUrl}api/user_service/media/${request.user_data.profile.split('/media/media/')[1]}`}
          alt={`${request.user_data.first_name} ${request.user_data.last_name}`}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold">{request.user_data.first_name} {request.user_data.last_name}</h3>
          <p className="text-xs text-gray-500">{request.user_data.tagline}</p>
          <span className="text-xs bg-yellow-100 text-yellow-800 px-1 rounded">Pending</span>
        </div>
      </div>
      <div className="flex space-x-1">
        <button onClick={() => handleRequestAction(request.id, 'accept')} className="bg-green-500 text-white p-1 rounded">
          <UserPlusIcon className="h-4 w-4" />
        </button>
        <button onClick={() => handleRequestAction(request.id, 'reject')} className="bg-red-500 text-white p-1 rounded">
          <UserMinusIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-2 py-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Team Members</h2>
        <button
          onClick={() => setShowRequests(!showRequests)}
          className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm ${
            showRequests ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
          }`}
        >
          <BellIcon className="h-4 w-4" />
          <span>Requests</span>
          {pendingRequests.length > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-1">{pendingRequests.length}</span>
          )}
        </button>
      </div>
      
      {showRequests ? (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Pending Requests</h3>
          {pendingRequests.length > 0 ? (
            <div className="space-y-2">
              {pendingRequests.map(request => <RequestCard key={request.id} request={request} />)}
            </div>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400">No pending requests.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {teamMembers.map(member => <MemberCard key={member.id} member={member} />)}
        </div>
      )}
    </div>
  );
};

export default TeamMembers;