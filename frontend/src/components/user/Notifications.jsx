import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { BellIcon, ChatBubbleLeftIcon, CheckCircleIcon, HeartIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import createAxiosInstance from '../../api/axiosInstance';
import { GatewayUrl } from '../const/urls';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.auth.userAccess);

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

  const markAsRead = async (id) => {
    try {
      const axiosInstance = createAxiosInstance(token);
      await axiosInstance.patch(`${GatewayUrl}api/notifications/${id}/`, { is_read: true });
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (error) {
      console.error(error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'follow':
        return <UserPlusIcon className="h-6 w-6 text-teal-500" />;
      case 'like':
        return <HeartIcon className="h-6 w-6 text-red-500" />;
      case 'comment':
        return <ChatBubbleLeftIcon className="h-6 w-6 text-blue-500" />;
      default:
        return <BellIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Notifications</h1>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start p-4 border-b dark:border-gray-700 ${
                !notification.is_read ? 'bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900 dark:to-blue-900' : ''
              } hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 ease-in-out`}
            >
              <div className="flex-shrink-0 mr-4">
                {getNotificationIcon(notification.notification_type)}
              </div>
              <div className="flex-grow">
                {notification.notification_type === 'follow' ? (
                  <Link to={`/user-profile/${notification.sender}`} className="text-base text-gray-800 dark:text-gray-200 hover:text-teal-500 dark:hover:text-teal-400">
                    {notification.content}
                  </Link>
                ) : (
                  <p className="text-base text-gray-800 dark:text-gray-200">{notification.content}</p>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {format(new Date(notification.created_at), 'MMM d, yyyy HH:mm')}
                </p>
              </div>
              {!notification.is_read && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="ml-2 text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300"
                >
                  <CheckCircleIcon className="h-6 w-6" />
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-center py-8 text-gray-500 dark:text-gray-400">No notifications</p>
        )}
      </div>
    </div>
  );
};

export default Notifications;