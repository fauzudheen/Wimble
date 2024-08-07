import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { BellIcon, ChatBubbleLeftIcon, CheckCircleIcon, HeartIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import createAxiosInstance from '../../api/axiosInstance';
import { GatewayUrl } from '../const/urls';

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const token = useSelector((state) => state.auth.userAccess);

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      try {
        const axiosInstance = createAxiosInstance(token);
        const response = await axiosInstance.get(`${GatewayUrl}api/unread-notifications/`);
        console.log(response.data);
        setNotifications(response.data);
        setUnreadCount(response.data.length);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUnreadNotifications();
  }, [token]);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8005/ws/notification/?token=${token}`);

    socket.onopen = () => console.log("WebSocket connection established");

    socket.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
    };

    socket.onerror = (error) => console.error("WebSocket error:", error);

    socket.onclose = (event) => {
      if (event.wasClean) {
        console.log(`WebSocket connection closed cleanly, code=${event.code}, reason=${event.reason}`);
      } else {
        console.error('WebSocket connection died');
      }
    };

    return () => socket.close();
  }, [token]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const markAsRead = async (id) => {
    try {
      const axiosInstance = createAxiosInstance(token);
      await axiosInstance.patch(`${GatewayUrl}api/notifications/${id}/`, { is_read: true });
      setNotifications(notifications.filter(n => n.id !== id));
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error(error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'follow':
        return <UserPlusIcon className="h-5 w-5 text-teal-500" />;
      case 'like':
        return <HeartIcon className="h-5 w-5 text-red-500" />;
      case 'comment':
        return <ChatBubbleLeftIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <BellIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="relative z-50">
      <button
        className="flex items-center focus:outline-none"
        onClick={toggleDropdown}
      >
        <div className="relative">
          <BellIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-teal-400 to-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg overflow-hidden">
          <div className="px-4 py-2 bg-gradient-to-r from-teal-400 to-blue-500 text-white">
            <h3 className="text-sm font-semibold">Unread Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 ease-in-out"
                >
                  <div className="flex-shrink-0 mr-3">
                    {getNotificationIcon(notification.notification_type)}
                  </div>
                  <div className="flex-grow">
                    {notification.notification_type === 'follow' ? (
                      <Link to={`/user-profile/${notification.sender}`} className="text-sm text-gray-800 dark:text-gray-200 hover:text-teal-500 dark:hover:text-teal-400">
                        {notification.content}
                      </Link>
                    ) : (
                      <p className="text-sm text-gray-800 dark:text-gray-200">{notification.content}</p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {format(new Date(notification.created_at), 'MMM d, yyyy HH:mm')}
                    </p>
                  </div>
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="ml-2 text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300"
                  >
                    <CheckCircleIcon className="h-5 w-5" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center py-4 text-gray-500 dark:text-gray-400">No unread notifications</p>
            )}
          </div>
          <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 border-t dark:border-gray-600">
            <Link to="/notifications" className="text-sm text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300">
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;