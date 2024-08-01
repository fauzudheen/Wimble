import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { GatewayUrl } from '../../../components/const/urls';

import {
  UserGroupIcon,
  ChatBubbleLeftIcon,
  CalendarIcon,
  FolderIcon,
  ChartBarIcon,
  CogIcon,
  HomeIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import TeamChat from '../../../components/user/team/TeamChat';
import TeamMeetings from '../../../components/user/team/TeamMeetings';
import TeamProjects from '../../../components/user/team/TeamProjects';
import TeamMembers from '../../../components/user/team/TeamMembers';
import TeamSettings from '../../../components/user/team/TeamSettings';
import TeamOverview from '../../../components/user/team/TeamOverview';

const TeamPage = () => {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await axios.get(`${GatewayUrl}api/teams/${id}/`);
        setTeam(response.data);
      } catch (error) {
        console.error('Error fetching team data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-teal-600 dark:from-blue-800 dark:to-teal-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!team) {
    return <div className="text-center text-2xl mt-10 text-gray-800 dark:text-gray-200">Team not found</div>;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <TeamOverview id={team.id} />;
      case 'chat':
        return <TeamChat id={team.id} />;
      case 'meetings':
        return <TeamMeetings id={team.id} />;
      case 'projects':
        return <TeamProjects id={team.id} />;
      case 'members':
        return <TeamMembers id={team.id} />;
      case 'settings':
        return <TeamSettings id={team.id} />;
      default:
        return <TeamOverview id={team.id} />;
    }
  };

  const navItems = [
    { name: 'Overview', icon: HomeIcon, id: 'overview' },
    { name: 'Chat', icon: ChatBubbleLeftIcon, id: 'chat' },
    { name: 'Meetings', icon: CalendarIcon, id: 'meetings' },
    { name: 'Projects', icon: FolderIcon, id: 'projects' },
    { name: 'Members', icon: UserGroupIcon, id: 'members' },
    { name: 'Settings', icon: CogIcon, id: 'settings' },
  ];

  const Sidebar = ({ mobile = false }) => (
    <div className={`flex flex-col ${mobile ? 'w-64' : 'w-64'} bg-gradient-to-b from-teal-600 to-blue-700 dark:from-teal-900 dark:to-blue-950 text-white h-full overflow-y-auto`}>
      <div className="p-6">
        <img className="h-20 w-20 rounded-full mx-auto border-4 border-white dark:border-gray-200 shadow-lg" src={team.profile_image.replace('8000', '8004')} alt={team.name} />
        <h2 className="mt-4 text-2xl font-bold text-center text-white">{team.name}</h2>
      </div>
      <nav className="mt-8 px-4">
        {navItems.map((item) => (
          <a
            key={item.name}
            href="#"
            className={`flex items-center px-4 py-3 mb-2 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out ${
              activeTab === item.id
                ? 'bg-white bg-opacity-20 text-white shadow-md'
                : 'text-blue-100 hover:bg-white hover:bg-opacity-10'
            }`}
            onClick={() => {
              setActiveTab(item.id);
              if (mobile) setSidebarOpen(false);
            }}
          >
            <item.icon className="mr-3 h-6 w-6" />
            {item.name}
          </a>
        ))}
      </nav>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar for larger screens */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Sidebar for smaller screens */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true" onClick={() => setSidebarOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gradient-to-b from-teal-600 to-blue-700 dark:from-teal-900 dark:to-blue-950">
            <div className="absolute top-0 right-14 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-100 dark:bg-gray-900">
        {/* Toggle button for smaller screens */}
        <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between bg-white dark:bg-gray-800 p-4 shadow-md">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{team.name}</h1>
          <button
            className="text-gray-500 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-100 focus:outline-none focus:text-gray-600 dark:focus:text-gray-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeamPage;