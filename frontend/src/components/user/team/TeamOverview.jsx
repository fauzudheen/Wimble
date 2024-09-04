import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Briefcase, Calendar, TrendingUp, CheckCircle, LogOut, UserPlus, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Alert, AlertTitle, Progress, Button } from '../../ui';
import axios from 'axios';
import { GatewayUrl } from '../../const/urls';
import createAxiosInstance from '../../../api/axiosInstance';
import { useSelector } from 'react-redux';
import { useOutletContext } from 'react-router-dom';
import { format } from 'date-fns';

const TeamOverview = () => {
  const { id } = useOutletContext();
  const [team, setTeam] = useState({});
  const token = useSelector((state) => state.auth.userAccess);
  const [TeamMembers, setTeamMembers] = useState([]);
  const [TeamMeetings, setTeamMeetings] = useState([]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const axiosInstance = createAxiosInstance(token);
        const response = await axiosInstance.get(`${GatewayUrl}api/teams/${id}/`);
        console.log("Team data:", response.data);
        setTeam(response.data);
      } catch (error) {
        console.error('Error fetching team data:', error);
      }
    };
    fetchTeam();
  }, [id, token]);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const { data } = await axios.get(`${GatewayUrl}api/teams/${id}/members/`);
        const acceptedMembers = data.filter((m) => m.request_status === 'accepted');
        console.log('team members', acceptedMembers);
        setTeamMembers(acceptedMembers);
      } catch (error) {
        console.error('Error fetching team members:', error);
      }
    };
    fetchTeamMembers();
  }, [id]);

  useEffect(() => {
    const fetchTeamMeetings = async () => {
      try {
        const { data } = await axios.get(`${GatewayUrl}api/teams/${id}/meetings/`);
        console.log('team meetings', data);
        setTeamMeetings(data);
      } catch (error) {
        console.error('Error fetching team meetings:', error);
      }
    };
    fetchTeamMeetings();
  }, [id]);

  // Prepare data for the member join trend graph
  const memberJoinData = TeamMembers.map((member, index) => ({
    date: format(new Date(member.created_at), 'MMM dd'),
    members: index + 1,
  }));

  // Get recent joiners (last 3)
  const recentJoiners = [...TeamMembers]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 3);

  // Get upcoming meetings (next 3)
  const upcomingMeetings = TeamMeetings
    .filter(meeting => new Date(meeting.start_time) > new Date())
    .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
    .slice(0, 3);

  return (
    <div className="space-y-4 p-4 ">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Overview</h2>
      </div>
      <Card className="mt-4 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900 dark:to-green-800 shadow-md">
        <CardHeader>
          <CardTitle className="text-green-800 dark:text-green-200 text-sm flex items-center">
            <Info className="w-5 h-5 mr-1" />
            Team Description
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-white dark:bg-green-700 p-3 rounded-md shadow-sm">
            <p className="text-green-800 dark:text-green-100 italic text-sm">
              "{team.description || 'No description provided.'}"
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-50">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{TeamMembers.length} / {team.maximum_members}</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              {team.maximum_members - TeamMembers.length} spots available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-50">Team Status</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 capitalize">{team.status}</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              {'Team ' + (team.status === 'active' ? 'is active' : 'is inactive')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-50">Created</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {team.created_at && new Date(team.created_at).toLocaleDateString()}
            </div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              {team.created_at && new Date(team.created_at).toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-50">Team Privacy</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 capitalize">{team.privacy}</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              {'Team ' + (team.privacy === 'public' ? 'is visible to everyone' : 'is only visible to team members')}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="dark:text-gray-100 text-sm">Team Members Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={memberJoinData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="members" stroke="#8884d8" activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
  <Card className="bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800 shadow-md">
    <CardHeader>
      <CardTitle className="text-blue-800 dark:text-blue-200 text-sm flex items-center">
        <UserPlus className="w-5 h-5 mr-1" />
        Recent Joiners
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-3">
        {recentJoiners.map((member) => (
          <li key={member.id} className="flex items-center space-x-2 bg-white dark:bg-blue-700 p-2 rounded-md shadow-sm transition-all hover:shadow">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs">
              {member.user_data.first_name[0]}
            </div>
            <div>
              <p className="text-xs font-medium text-gray-900 dark:text-gray-100">
                {member.user_data.first_name} {member.user_data.last_name}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-300">
                Joined {format(new Date(member.created_at), 'MMM dd, yyyy')}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>

  <Card className="bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900 dark:to-purple-800 shadow-md">
    <CardHeader>
      <CardTitle className="text-purple-800 dark:text-purple-200 text-sm flex items-center">
        <Calendar className="w-5 h-5 mr-1" />
        Upcoming Team Meetings
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-3">
        {upcomingMeetings.map((meeting) => (
          <li key={meeting.id} className="bg-white dark:bg-purple-700 p-3 rounded-md shadow-sm transition-all hover:shadow">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium text-purple-900 dark:text-purple-100 text-sm">{meeting.title}</span>
              <span className="text-xs text-purple-600 dark:text-purple-300 bg-purple-200 dark:bg-purple-600 px-1 py-0.5 rounded-full">
                {format(new Date(meeting.start_time), 'MMM dd, HH:mm')}
              </span>
            </div>
            <Progress value={100} className="h-1 bg-purple-200 dark:bg-purple-600">
              <div className="bg-purple-500 h-full rounded-full" style={{ width: '100%' }} />
            </Progress>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
    </div>
    </div>
  );
};

export default TeamOverview;