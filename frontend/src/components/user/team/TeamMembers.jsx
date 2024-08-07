import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { GatewayUrl } from '../../const/urls';
import { UserPlus, UserMinus, Bell, Users } from 'lucide-react';
import { useSelector } from 'react-redux';
import createAxiosInstance from '../../../api/axiosInstance';

const TeamMembers = () => {
  const { id } = useOutletContext();
  const userId = useSelector(state => state.auth.userId);
  const [teamMembers, setTeamMembers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('existing');
  const [team, setTeam] = useState(null); // Add state for team
  const token = useSelector(state => state.auth.userAccess);
  const navigate = useNavigate();

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
    
    const fetchTeam = async () => { // Fetch team data
      try {
        const { data } = await axios.get(`${GatewayUrl}api/teams/${id}/`); // Adjust API endpoint as necessary
        setTeam(data);
      } catch (error) {
        console.error("Error fetching team:", error);
      }
    };

    fetchTeamMembers();
    fetchTeam(); // Call fetchTeam
  }, [id]);

  const handleRequestAction = async (memberId, action) => {
    try {
      const axiosInstance = createAxiosInstance(token);
      if (action === 'accept') {
        await axiosInstance.put(`${GatewayUrl}api/teams/${id}/members/${memberId}/`, {
          request_status: 'accepted',
        });
      } else if (action === 'reject') {
        await axiosInstance.delete(`${GatewayUrl}api/teams/${id}/members/${memberId}/`);
      }
      const { data } = await axios.get(`${GatewayUrl}api/teams/${id}/members/`);
      setTeamMembers(data.filter(m => m.request_status === "accepted"));
      setPendingRequests(data.filter(m => m.request_status !== "accepted"));
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
    }
  };

  const MemberCard = ({ member, isAdmin }) => (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer ${isAdmin ? 'border-l-4 border-yellow-400' : ''}`}
      onClick={() => navigate(`/user-profile/${member.user_data.id}`)}
    >
      <div className="flex items-center space-x-3">
        <img 
          src={`${GatewayUrl}api/user_service/media/${member.user_data.profile.split('/media/media/')[1]}`}
          alt={`${member.user_data.first_name} ${member.user_data.last_name}`}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100">{member.user_data.first_name} {member.user_data.last_name}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{member.role}</p>
        </div>
      </div>
    </div>
  );

  const RequestCard = ({ request }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <img 
          src={`${GatewayUrl}api/user_service/media/${request.user_data.profile.split('/media/media/')[1]}`}
          alt={`${request.user_data.first_name} ${request.user_data.last_name}`}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100">{request.user_data.first_name} {request.user_data.last_name}</h3>
          <div className="inline-flex px-2 bg-yellow-200 dark:bg-yellow-700 rounded-full">
            <p className="text-xs text-gray-500 dark:text-gray-200">Pending</p>
          </div>
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => handleRequestAction(request.user_data.id, 'accept')}
          className="p-2 rounded-md bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-700 dark:text-green-200 dark:hover:bg-green-600 transition-colors duration-200 flex items-center space-x-2"
        >
          <UserPlus className="h-4 w-4" />
          <span className='text-sm'>Accept</span>
        </button>
        <button
          onClick={() => handleRequestAction(request.user_data.id, 'reject')}
          className="p-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-700 dark:text-red-200 dark:hover:bg-red-600 transition-colors duration-200 flex items-center space-x-2"
        >
          <UserMinus className="h-4 w-4" />
          <span className='text-sm'>Reject</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Team Members</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('existing')}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              activeTab === 'existing'
                ? 'bg-gradient-to-r from-teal-100 to-blue-200 text-teal-800'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Users className="mr-2 h-4 w-4" />
            Existing
          </button>
          {userId === team?.admin_data?.id && ( // Check if team is available
            <button
              onClick={() => setActiveTab('requests')}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                activeTab === 'requests'
                  ? 'bg-gradient-to-r from-teal-100 to-blue-200 text-teal-800'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Bell className="mr-2 h-4 w-4" />
              Requests
              {pendingRequests.length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {pendingRequests.length}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {activeTab === 'existing' ? (
        <>
          <div className="space-y-4">
            {teamMembers
              .filter(member => member.role === 'admin')
              .map(admin => (
                <MemberCard key={admin.id} member={admin} isAdmin={true} />
              ))}
          </div>
          <div className="space-y-4 mt-8">
            {teamMembers
              .filter(member => member.role !== 'admin')
              .map(member => (
                <MemberCard key={member.id} member={member} isAdmin={false} />
              ))}
          </div>
        </>
      ) : (
        <div className="space-y-4">
          {pendingRequests.length > 0 ? (
            pendingRequests.map(request => <RequestCard key={request.id} request={request} />)
          ) : (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">No pending requests.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamMembers;
