import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { BellIcon, ChatBubbleLeftIcon, CheckCircleIcon, ClockIcon, HeartIcon, UserPlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import createAxiosInstance from '../../api/axiosInstance';
import { GatewayUrl } from '../const/urls';
import Colors from '../../components/user/misc/Colors';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const token = useSelector((state) => state.auth.userAccess);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllNotifications = async () => {
      try {
        setLoading(true);
        const axiosInstance = createAxiosInstance(token);
        const response = await axiosInstance.get(`${GatewayUrl}api/notifications/`);
        setNotifications(response.data);
        console.log("Notifications", response.data);
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

  const getNotificationIcon = (type, sender=null, team=null) => {
    switch (type) {
      case 'follow':
        if (sender && sender.profile) {
          return <img src={sender.profile} className="h-10 w-10 object-cover rounded-full" alt={sender.username} />;
        } else {
          return <img src="https://cdn-icons-png.flaticon.com/512/847/847969.png" className="h-10 w-10 object-cover rounded-full" alt="Default profile" />;
        }
      case 'like':
       if (sender && sender.profile) {
          return <img src={sender.profile} className="h-6 w-6 object-cover rounded-full" alt={sender.username} />;
        } else {
          return <img src="https://cdn-icons-png.flaticon.com/512/847/847969.png" className="h-6 w-6 object-cover rounded-full" alt="Default profile" />;
        }
      case 'comment':
        if (sender && sender.profile) {
          return <img src={sender.profile} className="h-6 w-6 object-cover rounded-full" alt={sender.username} />;
        } else {
          return <img src="https://cdn-icons-png.flaticon.com/512/847/847969.png" className="h-6 w-6 object-cover rounded-full" alt="Default profile" />;
        }
      case 'meeting':
        if (team && team.profile_image) {
          return <img src={team.profile_image} className="h-10 w-10 object-cover rounded-full" />;
        } else {
          return <ClockIcon className="h-5 w-5 text-purple-500" />;
        }
      default:
        return <BellIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  const handleNotificationClick = (notification) => {
    if (notification.notification_type === 'follow') {
      navigate(`/user-profile/${notification.sender.id}`);
    } else if (notification.notification_type === 'meeting') {
      navigate(`/teams/${notification.team.id}/meetings/`);
    } else if (notification.notification_type === 'like' || notification.notification_type === 'comment') {
      navigate(`/article/${notification.article.id}`);
    }
  };

  const tabs = [
    { name: 'All', value: 'all' },
    { name: 'Meetings', value: 'meeting' },
    { name: 'Follows', value: 'follow' },
    { name: 'Likes', value: 'like' },
    { name: 'Comments', value: 'comment' },
    { name: 'System', value: 'system' },
  ];

  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(n => n.notification_type === activeTab);

  const handleSelectNotification = (id) => {
    setSelectedNotifications(prev => 
      prev.includes(id) ? prev.filter(nId => nId !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    try {
      const axiosInstance = createAxiosInstance(token);
      await Promise.all(selectedNotifications.map(id => 
        axiosInstance.delete(`${GatewayUrl}api/notifications/${id}/`)
      ));
      setNotifications(notifications.filter(n => !selectedNotifications.includes(n.id)));
      setSelectedNotifications([]);
    } catch (error) {
      console.error(error);
    }
  };

  const getNotificationCount = (tabValue) => {
    return tabValue === 'all' 
      ? notifications.length 
      : notifications.filter(n => n.notification_type === tabValue).length;
  };

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
        <nav className="flex justify-between border-b border-gray-200 dark:border-gray-700">
          <div className="flex">
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
                {tab.name} ({getNotificationCount(tab.value)})
              </button>
            ))}
          </div>
          {selectedNotifications.length > 0 && (
            <button
            onClick={handleDeleteSelected}
            className="flex items-center justify-center m-2 h-auto px-3 py-1.5 text-sm font-medium leading-4 rounded-md 
            hover:opacity-90 transition-all duration-200 ease-in-out focus:outline-none 
            bg-gradient-to-r from-red-400 to-red-600 text-white shadow-md"
          >
            <TrashIcon className="h-4 w-4 inline-block mr-1" />
            Delete Selected ({selectedNotifications.length})
          </button>
          
          
          )}
        </nav>
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start p-4 border-b dark:border-gray-700 ${
                !notification.is_read ? 'bg-gradient-to-l from-teal-50 to-blue-50 dark:from-gray-800 dark:to-gray-700' : ''
              } hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 ease-in-out`}
            >
              <div className="flex items-center justify-center mr-4 h-10">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={selectedNotifications.includes(notification.id)}
                  onChange={() => handleSelectNotification(notification.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
                {notification.article ? (
                <div className="flex-shrink-0 mr-4 relative">
                    <img 
                      src={notification.article.thumbnail} 
                      alt={notification.article.title}
                      className="w-10 h-10 object-cover rounded-md"
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
              <div className="flex-grow cursor-pointer" onClick={() => handleNotificationClick(notification)}>
                <p className="text-base text-gray-800 dark:text-gray-200 font-semibold">{notification.content}</p>
                {notification.notification_type === 'comment' && notification.comment && (
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mt-1 italic">"{notification.comment.text}"</p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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