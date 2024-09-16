import React, { useState, useEffect } from 'react';
import { Link, Outlet, useParams, useNavigate, useLocation } from 'react-router-dom';
import { GatewayUrl } from '../../../components/const/urls';
import {
  UserGroupIcon,
  ChatBubbleLeftIcon,
  CalendarIcon,
  FolderIcon,
  CogIcon,
  HomeIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Alert, AlertTitle, Button } from '../../../components/ui';
import { LogOut, UserPlus, Clock, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import createAxiosInstance from '../../../api/axiosInstance';

const TeamPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const token = useSelector((state) => state.auth.userAccess);
  const userId = useSelector((state) => state.auth.userId);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const axiosInstance = createAxiosInstance(token);
        const response = await axiosInstance.get(`${GatewayUrl}api/teams/${id}/`);
        setTeam(response.data);
      } catch (error) {
        console.error('Error fetching team data:', error);
        setError('Failed to fetch team data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, [id, token]);


  const handleLeaveTeam = async () => {
    setIsLoading(true);
    try {
      const axiosInstance = createAxiosInstance(token);
      await axiosInstance.delete(`${GatewayUrl}api/teams/${id}/members/${userId}/`);
      setTeam({ ...team, request_status: null });
    } catch (error) {
      console.error('Error leaving team:', error);
      setError('Failed to leave the team. Please try again later.');
    } finally {
      setIsLoading(false);
      setShowLeaveConfirm(false);
    }
  };

  const handleJoinRequest = async () => {
    setIsLoading(true);
    try {
      const axiosInstance = createAxiosInstance(token);
      await axiosInstance.post(`${GatewayUrl}api/teams/${id}/members/`, {});
      setTeam({ ...team, request_status: 'pending' });
    } catch (error) {
      console.error('Error sending join request:', error);
      setError('Failed to send join request. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

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

  const navItems = [
    { name: 'Overview', icon: HomeIcon, id: 'overview' },
    { name: 'Chat', icon: ChatBubbleLeftIcon, id: 'chat' },
    { name: 'Meetings', icon: CalendarIcon, id: 'meetings' },
    // { name: 'Projects', icon: FolderIcon, id: 'projects' },
    { name: 'Members', icon: UserGroupIcon, id: 'members' },
  ];
  
  if (userId === team.admin_data.id) {
    navItems.push({ name: 'Settings', icon: CogIcon, id: 'settings' });
  }

  const Sidebar = ({ mobile = false }) => (
    <div className={`flex flex-col ${mobile ? 'w-64' : 'w-64'} bg-gradient-to-b from-teal-600 to-blue-700 dark:from-teal-900 dark:to-blue-950 text-white h-full overflow-y-auto`}>
      <div className="p-6">
        {team.profile_image ? (
          <img className="h-20 w-20 rounded-full object-cover mx-auto border-4 border-white dark:border-gray-200 shadow-lg" src={team.profile_image} alt={team.name} />
        ) : (
          <div className="h-20 w-20 rounded-full mx-auto border-4 border-white dark:border-gray-200 shadow-lg flex items-center justify-center bg-white bg-opacity-20">
            <UserGroupIcon className="h-12 w-12 text-white" />
          </div>
        )}
        <h2 className="mt-4 text-2xl font-bold text-center text-white">{team.name}</h2>
        <div className="mt-4">
          {team.request_status === 'accepted' ? (
            <Button
              onClick={() => setShowLeaveConfirm(true)}
              disabled={isLoading}
              className="
                relative overflow-hidden
                flex items-center justify-center w-full 
                text-white border border-white border-opacity-20 
                transform transition-all duration-300 ease-in-out
                text-sm
                group
                bg-white bg-opacity-10
                backdrop-filter backdrop-blur-sm
                hover:bg-opacity-20
                rounded-md
              "
            >
              <span className="
                absolute inset-0 bg-white opacity-10
                transition-opacity duration-300 ease-in-out
                rounded-md
              "></span>
              <span className="
                absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0
                group-hover:opacity-100
                transition-opacity duration-300 ease-in-out
                rounded-md
              "></span>
              <span className="relative z-10 flex items-center">
                <LogOut className="w-4 h-4 mr-2" />
                Leave Team
              </span>
            </Button>
          ) : team.request_status === 'pending' ? (
            <div className="
              relative overflow-hidden
              flex items-center justify-center w-full 
              text-white border border-white border-opacity-20 
              text-sm
              bg-white bg-opacity-10
              backdrop-filter backdrop-blur-sm
              rounded-md
            ">
              <span className="
                absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 opacity-50
                rounded-md 
              "></span>
              <span className="relative z-10 flex items-center py-2 font-semibold">
                <Clock className="w-4 h-4 mr-2" />
                Request Pending
              </span>
            </div>
          ) : team.request_status === 'rejected' ? (
            <div className="
              relative overflow-hidden
              flex items-center justify-center w-full 
              text-white border border-white border-opacity-20 
              text-sm
              bg-white bg-opacity-10
              backdrop-filter backdrop-blur-sm
              rounded-md
            ">
              <span className="
                absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-50
                rounded-md
              "></span>
              <span className="relative z-10 flex items-center py-2 font-semibold">
                <X className="w-4 h-4 mr-2" />
                Request Rejected
              </span>
            </div>
          ) : (
            <>
            {team.member_count === team.maximum_members ? (
            <div className="flex items-center justify-center w-full py-2 font-semibold text-sm text-white bg-gradient-to-r from-red-500 to-red-600 rounded-md dark:from-red-800 dark:to-red-700">
            Team Full
          </div>
          ) : (
            <Button
              onClick={handleJoinRequest}
              disabled={isLoading}
              className="
                relative overflow-hidden
                flex items-center justify-center w-full 
                text-white border border-white border-opacity-20 
                transform transition-all duration-300 ease-in-out
                text-sm
                group
                bg-white bg-opacity-10
                backdrop-filter backdrop-blur-sm
                hover:bg-opacity-20
                rounded-md
              "
            >
              <span className="
                absolute inset-0 bg-white opacity-10
                transition-opacity duration-300 ease-in-out
                rounded-md
              "></span>
              <span className="
                absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 opacity-0
                group-hover:opacity-100
                transition-opacity duration-300 ease-in-out
                rounded-md
              "></span>
              <span className="relative z-10 flex items-center">
                <UserPlus className="w-4 h-4 mr-2" />
                Send Join Request
              </span>
            </Button>
          )}
          </>
          )}
        </div>
      </div>
      <nav className="mt-4 px-4">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={`/teams/${id}/${item.id}`}
            className={`flex items-center px-4 py-3 mb-2 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out ${
              location.pathname.includes(item.id)
                ? 'bg-white bg-opacity-20 text-white shadow-md'
                : 'text-blue-100 hover:bg-white hover:bg-opacity-10'
            }`}
            onClick={() => {
              if (mobile) setSidebarOpen(false);
            }}
          >
            <item.icon className="mr-3 h-6 w-6" />
            {item.name}   
          </Link>
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
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-100 dark:bg-black">
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
          <div className="">
            {showLeaveConfirm && (
              <Alert variant="destructive" className="dark:bg-red-900 dark:border-red-700">
                <AlertTitle className="dark:text-white">Are you sure you want to leave this team?</AlertTitle>
                <p className="dark:text-gray-300">This action cannot be undone. You will need to request to join again if you change your mind.</p>
                <div className="mt-4 flex justify-end space-x-4">
                  <Button onClick={() => setShowLeaveConfirm(false)} className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-700 text-gray-800 dark:text-white">
                    Cancel
                  </Button>
                  <Button onClick={handleLeaveTeam} className="bg-red-500 hover:bg-red-600 text-white">
                    Yes, Leave Team
                  </Button>
                </div>
              </Alert>
            )}
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Error</AlertTitle>
                <p>{error}</p>
              </Alert>
            )}
            <Outlet context={{ id }} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeamPage;