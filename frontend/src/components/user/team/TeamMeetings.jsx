import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Plus, X } from 'lucide-react';
import { GatewayUrl } from '../../const/urls';
import createAxiosInstance from '../../../api/axiosInstance';
import MeetingCard from './MeetingCard';

const TeamMeetings = () => {
  const { id: teamId } = useOutletContext();
  const [meetings, setMeetings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const token = useSelector((state) => state.auth.userAccess);
  const [teamMembers, setTeamMembers] = useState([]);
  const userId = useSelector((state) => state.auth.userId);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [showSubscribeDialog, setShowSubscribeDialog] = useState(false);

  const fetchTeamMembers = async () => {
    try {
      const { data } = await axios.get(`${GatewayUrl}api/teams/${teamId}/members/`);
      const acceptedMembers = data.filter((m) => m.request_status === 'accepted');
      console.log('team members', acceptedMembers);
      setTeamMembers(acceptedMembers.filter((m) => m.user !== userId));
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, [teamId, token]);

  const fetchTeam = async () => {
    try {
      const axiosInstance = createAxiosInstance(token);
      const response = await axiosInstance.get(`${GatewayUrl}api/teams/${teamId}/`);
      console.log('team data', response.data);
      if(response.data.request_status && response.data.request_status === 'accepted') {
        fetchMeetings();
      } else {
        setShowJoinDialog(true);
      }
    } catch (error) {
      console.error('Error fetching team data:', error);
    }
  };
  
  useEffect(() => {
    fetchTeam();
  }, [teamId, token]);


  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`${GatewayUrl}api/users/${userId}/`);
      if (response.data.account_tier === 'free') {
        setShowSubscribeDialog(true);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [token]);

  const fetchMeetings = async () => {
    try {
      const response = await axios.get(`${GatewayUrl}api/teams/${teamId}/meetings/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('team meetings', response.data);
      setMeetings(response.data);
    } catch (error) {
      console.error('Error fetching team meetings:', error);
    }
  };

  const handleScheduleMeeting = async (e) => {
    e.preventDefault();
    try {
      const axiosInstance = createAxiosInstance(token);
      await axiosInstance.post(`${GatewayUrl}api/teams/${teamId}/meetings/`, {
        title,
        description,
        start_time: startDateTime,
        end_time: endDateTime,
        members: selectedMembers,
      });
      resetForm();
      fetchMeetings();
    } catch (error) {
      console.error('Error scheduling meeting:', error);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStartDateTime('');
    setEndDateTime('');
    setSelectedMembers([]);
    setShowForm(false);
  };

  const toggleMemberSelection = (userId) => {
    setSelectedMembers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleDeleteMeeting = (deletedMeetingId) => {
    setMeetings(prevMeetings => prevMeetings.filter(meeting => meeting.id !== deletedMeetingId));
  };

  return (
    <div className="p-4 bg-gray-100 dark:bg-black">
      {showJoinDialog && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 max-w-sm w-full mx-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Unauthorized</h2>
            <p className="text-sm text-gray-800 dark:text-gray-300 mt-3">
              You are not a member of this team and cannot access this page. Please contact your team administrator to be added as a member.
            </p>
            <div className="flex justify-end mt-3">
              <Link to={`/teams/${teamId}/overview`}>
                <button className="rounded-md px-3 py-2 text-sm font-medium bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600">
                  Go Back to Overview
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
      {showSubscribeDialog && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 max-w-sm w-full mx-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Upgrade Your Account</h2>
            <p className="text-sm text-gray-800 dark:text-gray-300 mt-3">
              Your account tier is currently free. Please upgrade your account to access this feature.
            </p>
            <div className="flex justify-end mt-3">
              <Link to={`/teams/${teamId}/overview`}>
                <button className="rounded-md px-3 py-2 text-sm font-medium bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600">
                  Go Back to Overview
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Team Meetings</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 px-4 py-2 rounded-md text-xs sm:text-sm font-medium bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          <span>{showForm ? 'Cancel' : 'Create Meeting'}</span>
        </button>
      </div>

      {showForm && (
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Schedule a Meeting</h3>
          <form onSubmit={handleScheduleMeeting} className="space-y-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full px-3 py-2 bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full px-3 py-2 bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <div className="flex space-x-4">
              <input
                type="datetime-local"
                value={startDateTime}
                onChange={(e) => setStartDateTime(e.target.value)}
                className="flex-1 px-3 py-2 bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="datetime-local"
                value={endDateTime}
                onChange={(e) => setEndDateTime(e.target.value)}
                className="flex-1 px-3 py-2 bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Select Team Members</p>
              <div className="flex flex-wrap gap-2">
                {teamMembers.map((member) => (
                  <button
                    key={member.user}
                    type="button"
                    onClick={() => toggleMemberSelection(member.user)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedMembers.includes(member.user)
                        ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {member.user_data.first_name} {member.user_data.last_name}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <button type="submit" className="px-4 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600">
                Schedule Meeting
              </button>
            </div>
          </form>
        </div>
      )}

      {meetings.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">No meetings scheduled. Create a new meeting to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {meetings.map((meeting) => (
            <MeetingCard 
              key={meeting.id} 
              meeting={meeting} 
              teamId={teamId} 
              onDelete={handleDeleteMeeting}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamMeetings;
