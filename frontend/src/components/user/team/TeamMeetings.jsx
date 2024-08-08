import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Calendar, Clock } from 'lucide-react';
import { GatewayUrl } from '../../const/urls';
import createAxiosInstance from '../../../api/axiosInstance';

const Card = ({ children, className }) => (
  <div className={`bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 rounded-lg shadow-md ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
    {children}
  </div>
);

const CardContent = ({ children }) => (
  <div className="px-6 py-4">
    {children}
  </div>
);

const Button = ({ children, variant, className, ...props }) => (
  <button
    className={`rounded-md px-4 py-2 font-medium ${
      variant === 'primary'
        ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600'
        : 'bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700'
    } ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Input = ({ className, ...props }) => (
  <input
    className={`bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 ${className}`}
    {...props}
  />
);

const Textarea = ({ className, ...props }) => (
  <textarea
    className={`bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 ${className}`}
    {...props}
  />
);

const DatePicker = ({ className, ...props }) => (
  <input
    type="datetime-local"
    className={`bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 ${className}`}
    {...props}
  />
);

const Select = ({ options, value, onChange, className, ...props }) => (
  <select
    className={`bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 ${className}`}
    value={value}
    onChange={onChange}
    {...props}
  >
    <option value="">Select members</option>
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

const TeamMeetings = () => {
  const { id: teamId } = useOutletContext();
  const [meetings, setMeetings] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const token = useSelector((state) => state.auth.userAccess);
  const [teamMembers, setTeamMembers] = useState([]);
  const [userIds, setUserIds] = useState([]);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await axios.get(`${GatewayUrl}api/teams/${teamId}/meetings/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMeetings(response.data);
      } catch (error) {
        console.error('Error fetching team meetings:', error);
      }
    };
    fetchMeetings();
  }, [teamId, token]);

  const fetchTeamMembers = async () => {
    try {
      const { data } = await axios.get(`${GatewayUrl}api/teams/${teamId}/members/`);
      const acceptedMembers = data.filter((m) => m.request_status === 'accepted');
      console.log('team members', acceptedMembers);
      setTeamMembers(acceptedMembers);
      setUserIds(acceptedMembers.map((m) => m.user));
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const handleScheduleMeeting = async (e) => {
    e.preventDefault();
    try {
      const axiosInstance = createAxiosInstance(token);
      await axiosInstance.post(
        `${GatewayUrl}api/teams/${teamId}/meetings/`,
        {
          title,
          description,
          start_time: startDateTime,
          end_time: endDateTime,
          members: selectedMembers,
        }
      );
      setTitle('');
      setDescription('');
      setStartDateTime(null);
      setEndDateTime(null);
      setSelectedMembers([]);
      // Refetch meetings to update the list
      const response = await axios.get(`${GatewayUrl}api/teams/${teamId}/meetings/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMeetings(response.data);
    } catch (error) {
      console.error('Error scheduling meeting:', error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 p-4 bg-gray-100 dark:bg-black">
      <div className="flex-1 lg:w-3/5">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Team Meetings</h2>
        <div className="grid grid-cols-1 gap-4 mt-4">
          {meetings.map((meeting) => (
            <Card key={meeting.id}>
              <CardHeader>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4 text-gray-900 dark:text-gray-100" />
                  <span className="font-medium text-sm text-gray-900 dark:text-gray-100">{new Date(meeting.start_time).toLocaleDateString()}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4 text-gray-900 dark:text-gray-100" />
                  <span className="text-gray-900 text-sm dark:text-gray-100">{new Date(meeting.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(meeting.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{meeting.title}</p>
                <p className="text-muted-foreground text-sm text-gray-900 dark:text-gray-100">{meeting.description}</p>
                <a href={`/teams/${teamId}/meet?roomID=${meeting.id}`}>
                  <Button variant="primary" className="mt-2 text-sm">Join Meeting</Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className="lg:w-2/5">
      <Card className="bg-white dark:bg-gray-800">
  <CardHeader>
    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Schedule a Meeting</h3>
  </CardHeader>
  <CardContent>
    <form onSubmit={handleScheduleMeeting} className="space-y-3">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
          Title
        </label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="outline outline-1 w-full text-sm py-1"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
          Description
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="outline outline-1 w-full text-sm py-1"
        />
      </div>
      <div>
        <label htmlFor="start-date" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
          Start Date and Time
        </label>
        <DatePicker
          id="start-date"
          value={startDateTime}
          onChange={(e) => setStartDateTime(e.target.value)}
          className="outline outline-1 w-full text-sm py-1"
        />
      </div>
      <div>
        <label htmlFor="end-date" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
          End Date and Time
        </label>
        <DatePicker
          id="end-date"
          value={endDateTime}
          onChange={(e) => setEndDateTime(e.target.value)}
          className="outline outline-1 w-full text-sm py-1"
        />
      </div>
      <div>
        <label htmlFor="members" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
          Select Team Members
        </label>
        <Select
          id="members"
          options={teamMembers.map((member) => ({ value: member.user, label: member.user_data.first_name }))}
          value={selectedMembers}
          onChange={(e) => setSelectedMembers(Array.from(e.target.selectedOptions, (option) => option.value))}
          className="outline outline-1 w-full text-sm py-1"
          multiple
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" variant="primary" className="text-sm py-1 px-3">
          Schedule Meeting
        </Button>
      </div>
    </form>
  </CardContent>
</Card>


      </div>
    </div>
  );
};

export default TeamMeetings;