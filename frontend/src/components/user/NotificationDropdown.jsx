import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { BellIcon, ChatBubbleLeftIcon, CheckCircleIcon, ClockIcon, HeartIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import createAxiosInstance from '../../api/axiosInstance';
import { GatewayUrl } from '../const/urls';
import { format, parseISO } from 'date-fns';

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const token = useSelector((state) => state.auth.userAccess);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      try {
        const axiosInstance = createAxiosInstance(token);
        const response = await axiosInstance.get(`${GatewayUrl}api/unread-notifications/`);
        setNotifications(response.data);
        console.log("Notifications:", notifications);
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
      console.log("New notification received:", newNotification);
      if (newNotification.created_at) {
        const updatedNotification = {
          ...newNotification,
          sender: newNotification.sender_data ? newNotification.sender_data : null,
          team: newNotification.team_data ? newNotification.team_data : null,
        };
  
        setNotifications(prev => [updatedNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
      } else {
        console.error("Notification received with invalid or missing created_at:", newNotification);
      }
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const markAsRead = async (id, event) => {
    event.stopPropagation();
    try {
      const axiosInstance = createAxiosInstance(token);
      await axiosInstance.patch(`${GatewayUrl}api/notifications/${id}/`, { is_read: true });
      setNotifications(notifications.filter(n => n.id !== id));
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNotificationClick = (notification) => {
    setIsOpen(false);
    if (notification.notification_type === 'follow') {
      navigate(`/user-profile/${notification.sender.id}`);
    } else if (notification.notification_type === 'meeting') {
      navigate(`/teams/${notification.team.id}/meetings/`);
    }
    // Add more navigation logic for other notification types if needed
  };

  const getNotificationIcon = (type, sender=null, team=null) => {
    switch (type) {
      case 'follow':
        if (sender && sender.profile) {
          return <img src={`${GatewayUrl}api${sender.profile}`} className="h-8 w-8 mt-2 object-cover rounded-full " />;
        } else {
            return <img src="https://cdn-icons-png.flaticon.com/512/847/847969.png" className="h-8 w-8 mt-2 text-teal-500" />;
        }
        case 'like':
          if (sender && sender.profile) {
             return <img src={`${GatewayUrl}api${sender.profile}`} className="h-6 w-6 object-cover rounded-full" alt={sender.username} />;
           } else {
             return <img src="https://cdn-icons-png.flaticon.com/512/847/847969.png" className="h-6 w-6 object-cover rounded-full" alt="Default profile" />;
           }
         case 'comment':
           if (sender && sender.profile) {
             return <img src={`${GatewayUrl}api${sender.profile}`} className="h-6 w-6 object-cover rounded-full" alt={sender.username} />;
           } else {
             return <img src="https://cdn-icons-png.flaticon.com/512/847/847969.png" className="h-6 w-6 object-cover rounded-full" alt="Default profile" />;
           }
      case 'meeting':
        if (team && team.profile_image) {
          return <img src={`${GatewayUrl}api${team.profile_image}`} className="h-8 w-8 mt-2 object-cover rounded-full" />;
        } else {
          return <ClockIcon className="h-8 w-8 mt-2 object-cover rounded-full text-purple-500" />;
        }
      default:
        return <BellIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'MMM d, yyyy HH:mm');
    } catch (error) {
      console.error('Invalid date:', dateString);
      return 'Invalid date';
    }
  };

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button
        className="flex items-center focus:outline-none"
        onClick={toggleDropdown}
      >
        <div className="relative">
          <BellIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 dark:text-gray-300" />
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
            <h3 className="text-sm font-semibold">Unread Notifications ({unreadCount})</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 ease-in-out cursor-pointer"
                  onClick={() => handleNotificationClick(notification)}
                >
                    {notification.article ? (
                  <div className="flex-shrink-0 mr-4 relative">
                      <img 
                        src={`${GatewayUrl}api${notification.article.thumbnail}`} 
                        alt={notification.article.title}
                        className="w-8 h-8 object-cover rounded-sm"
                      />
                    <div className="absolute -bottom-2 -right-2">
                      {getNotificationIcon(notification.notification_type, notification.sender, notification.team)}
                    </div>
                  </div>
                  ) : (
                    <div className="flex-shrink-0 mr-4">
                      {getNotificationIcon(notification.notification_type, notification.sender, notification.team)}
                    </div>
                  )}
                  <div className="flex-grow">
                    <p className="text-sm text-gray-800 dark:text-gray-200">{notification.content}</p>
                    {notification.notification_type === 'comment' && notification.comment && (
                      <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mt-1 italic">"{notification.comment.text}"</p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatDate(notification.created_at)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => markAsRead(notification.id, e)}
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
            <Link 
              to="/notifications" 
              className="text-sm text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300"
              onClick={toggleDropdown}>
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;