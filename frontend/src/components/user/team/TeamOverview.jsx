import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Briefcase, Calendar, TrendingUp, CheckCircle, LogOut, UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Alert, AlertTitle, Progress, Button } from '../../ui';
import axios from 'axios';
import { GatewayUrl } from '../../const/urls';
import createAxiosInstance from '../../../api/axiosInstance';
import { useSelector } from 'react-redux';
import { useOutletContext } from 'react-router-dom';

const TeamOverview = () => {
  const { id } = useOutletContext(); // Access the id from context
  const [team, setTeam] = useState({});
  const token = useSelector((state) => state.auth.userAccess);

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
  }, [id]);


  const performanceData = [
    { month: 'Jan', performance: 65 },
    { month: 'Feb', performance: 59 },
    { month: 'Mar', performance: 80 },
    { month: 'Apr', performance: 81 },
    { month: 'May', performance: 56 },
    { month: 'Jun', performance: 55 },
    { month: 'Jul', performance: 40 },
  ];

  const recentActivities = [
    { id: 1, user: "Alice", action: "completed task", project: "Project Alpha", time: "2 hours ago" },
    { id: 2, user: "Bob", action: "commented on", project: "Project Beta", time: "4 hours ago" },
    { id: 3, user: "Charlie", action: "created new task", project: "Project Gamma", time: "Yesterday" },
  ];

  const upcomingDeadlines = [
    { project: "Project Delta", deadline: "2024-08-15", progress: 75 },
    { project: "Project Epsilon", deadline: "2024-08-22", progress: 40 },
    { project: "Project Zeta", deadline: "2024-08-30", progress: 10 },
  ];

  return (
    <div className="space-y-4 p-4 ">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{team.name} Overview</h2>
        
      </div>

        

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{team.member_count} / {team.maximum_members}</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              {team.maximum_members - team.member_count} spots available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Status</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 capitalize">{team.status}</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              {team.privacy} team
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Created</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {new Date(team.created_at).toLocaleDateString()}
            </div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              {new Date(team.created_at).toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Productivity</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">87%</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              +2% from last month
            </p>
          </CardContent>
        </Card>
      </div>
      {
        /*
        <Card>
          <CardHeader>
            <CardTitle>Team Performance Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="performance" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        */
      }

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {recentActivities.map((activity) => (
                <li key={activity.id} className="flex items-start space-x-2">
                  <div className="w-2 h-2 mt-1 rounded-full bg-sky-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{activity.user} {activity.action} {activity.project}</p>
                    <p className="text-xs text-muted-foreground dark:text-gray-400">{activity.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
    
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Project Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {upcomingDeadlines.map((project, index) => (
                <li key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900 dark:text-gray-100">{project.project}</span>
                    <span className="text-sm text-muted-foreground dark:text-gray-400">{project.deadline}</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground dark:text-gray-400">{team.description || "No description provided."}</p>
        </CardContent>
      </Card>

      <Alert>
        <CheckCircle className="h-4 w-4 inline-block mr-2" />
        <AlertTitle className="text-gray-900 dark:text-gray-100">Team Created Successfully!</AlertTitle>
        <p className="text-gray-900 dark:text-gray-100">{team.name} was created on {new Date(team.created_at).toLocaleDateString()}. Start collaborating with your team members!</p>
      </Alert>
    </div>
  );
};

export default TeamOverview;
