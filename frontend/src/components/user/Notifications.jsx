import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { BellIcon, ChatBubbleLeftIcon, CheckCircleIcon, HeartIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import createAxiosInstance from '../../api/axiosInstance';
import { GatewayUrl } from '../const/urls';
import Colors from '../../components/user/misc/Colors';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const token = useSelector((state) => state.auth.userAccess);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllNotifications = async () => {
      try {
        setLoading(true);
        const axiosInstance = createAxiosInstance(token);
        const response = await axiosInstance.get(`${GatewayUrl}api/notifications/`);
        setNotifications(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllNotifications();
  }, [token]);

  const markAsRead = async (id, event) => {
    event.stopPropagation();
    try {
      const axiosInstance = createAxiosInstance(token);
      await axiosInstance.patch(`${GatewayUrl}api/notifications/${id}/`, { is_read: true });
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (error) {
      console.error(error);
    }
  };

  const getNotificationIcon = (type, sender) => {
    switch (type) {
      case 'follow':
        if (sender && sender.profile) {
          return <img src={`${GatewayUrl}api/user_service/media/${sender.profile.split('/media/media/')[1]}`} className="h-10 w-10 object-cover rounded-full" alt={sender.username} />;
        } else {
          return <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" className="h-10 w-10 object-cover rounded-full" alt="Default profile" />;
        }
      case 'like':
        return <HeartIcon className="h-6 w-6 text-red-500" />;
      case 'comment':
        return <ChatBubbleLeftIcon className="h-6 w-6 text-blue-500" />;
      default:
        return <BellIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  const handleNotificationClick = (notification) => {
    if (notification.notification_type === 'follow') {
      navigate(`/user-profile/${notification.sender.id}`);
    }
    // Add more navigation logic for other notification types if needed
  };

  const tabs = [
    { name: 'All', value: 'all' },
    { name: 'Follows', value: 'follow' },
    { name: 'Likes', value: 'like' },
    { name: 'Comments', value: 'comment' },
  ];

  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(n => n.notification_type === activeTab);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="container min-h-screen w-full max-w-full bg-gray-100 px-8 py-12 dark:bg-black box-border">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Notifications</h1>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <nav className="flex border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-4 text-sm font-medium ${
                activeTab === tab.value
                  ? `${Colors.tealBlueGradientText} border-b-2 border-blue-500`
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start p-4 border-b dark:border-gray-700 ${
                !notification.is_read ? 'bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900 dark:to-blue-900' : ''
              } hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 ease-in-out cursor-pointer`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex-shrink-0 mr-4">
                {getNotificationIcon(notification.notification_type, notification.sender)}
              </div>
              <div className="flex-grow">
                <p className="text-base text-gray-800 dark:text-gray-200">{notification.content}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {format(new Date(notification.created_at), 'MMM d, yyyy HH:mm')}
                </p>
              </div>
              {!notification.is_read && (
                <button
                  onClick={(e) => markAsRead(notification.id, e)}
                  className="ml-2 text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300"
                >
                  <CheckCircleIcon className="h-6 w-6" />
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-center py-8 text-gray-500 dark:text-gray-400">No notifications in this category</p>
        )}
      </div>
    </div>
  );
};

export default Notifications;