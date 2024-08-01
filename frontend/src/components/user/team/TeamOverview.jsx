import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Clock, Users, Briefcase, TrendingUp, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Alert, AlertTitle, Progress, Avatar, AvatarImage, AvatarFallback } from '../../ui';
import Article from '../Article';

const TeamOverview = ({ id }) => {
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Simulating API call to fetch team data
    const fetchTeamData = async () => {
      // In a real application, replace this with an actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTeamData({
        name: "Innovation Squad",
        members: 12,
        activeProjects: 5,
        completedProjects: 23,
        upcomingMeetings: 3,
        productivity: 87,
        recentActivities: [
          { id: 1, user: "Alice", action: "completed task", project: "Project Alpha", time: "2 hours ago" },
          { id: 2, user: "Bob", action: "commented on", project: "Project Beta", time: "4 hours ago" },
          { id: 3, user: "Charlie", action: "created new task", project: "Project Gamma", time: "Yesterday" },
        ],
        performanceData: [
          { month: 'Jan', performance: 65 },
          { month: 'Feb', performance: 59 },
          { month: 'Mar', performance: 80 },
          { month: 'Apr', performance: 81 },
          { month: 'May', performance: 56 },
          { month: 'Jun', performance: 55 },
          { month: 'Jul', performance: 40 },
        ],
        topPerformers: [
          { name: "David", avatar: "/api/placeholder/32", performance: 95 },
          { name: "Eva", avatar: "/api/placeholder/32", performance: 92 },
          { name: "Frank", avatar: "/api/placeholder/32", performance: 88 },
        ],
        upcomingDeadlines: [
          { project: "Project Delta", deadline: "2024-08-15", progress: 75 },
          { project: "Project Epsilon", deadline: "2024-08-22", progress: 40 },
          { project: "Project Zeta", deadline: "2024-08-30", progress: 10 },
        ],
      });
      setLoading(false);
    };

    fetchTeamData();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading team overview...</div>;
  }

  if (!teamData) {
    return <div className="text-center text-red-500">Failed to load team data</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{teamData.name} Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex justify-between items-center">
              Team Members
              <Users className="h-4 w-4 text-gray-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamData.members}</div>
          </CardContent>
        </Card>
        {/* Repeat similar Card structures for Active Projects, Upcoming Meetings, and Team Productivity */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Performance Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={teamData.performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="performance" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {teamData.recentActivities.map((activity) => (
                <li key={activity.id} className="flex items-start space-x-2">
                  <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{activity.user} {activity.action} {activity.project}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {teamData.topPerformers.map((performer, index) => (
                <li key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarImage src={performer.avatar} />
                      <AvatarFallback>{performer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{performer.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {performer.performance}%
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Project Deadlines</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {teamData.upcomingDeadlines.map((project, index) => (
              <li key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{project.project}</span>
                  <span className="text-sm text-gray-500">{project.deadline}</span>
                </div>
                <Progress value={project.progress} />
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Alert>
        <CheckCircle className="h-4 w-4 inline-block mr-2" />
        <AlertTitle>Team Milestone Achieved!</AlertTitle>
        <p>{teamData.name} has completed {teamData.completedProjects} projects. Great job, team!</p>
      </Alert>
    </div>
  );
};

export default TeamOverview;