import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserGroupIcon, ChatBubbleLeftIcon, PencilIcon, PlusIcon, PhotoIcon } from '@heroicons/react/24/outline';
import Buttons from '../../../components/user/misc/Buttons';
import axios from 'axios';
import { GatewayUrl } from '../../../components/const/urls';
import { useSelector } from 'react-redux';

const CommunityPage = () => {
  const { id } = useParams();
  const [community, setCommunity] = useState({});
  const userId = useSelector((state) => state.auth.userId);

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const response = await axios.get(`${GatewayUrl}api/communities/${id}/`);
        console.log("Response", response.data)
        setCommunity(response.data);
      } catch (error) {
        console.error('Error fetching community:', error);
      }
    }
    fetchCommunity(); 
  }, []);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      {/* Header Sections */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {/* Cover Image */}
          <div className="relative w-full h-[40vh]">
            {community.cover_image ? (
              <img
                src={community.cover_image.replace('8000', '8003')}
                alt={`${community.name} cover`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                <PhotoIcon className="w-12 h-12 text-gray-500 dark:text-gray-400" />
              </div>
            )}
            {/* Profile Image */}
            <div className="absolute left-6 bottom-0 transform translate-y-1/2">
              {community.profile_image ? (
                <img
                  src={community.profile_image.replace('8000', '8003')}
                  alt={`${community.name} profile`}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                  <UserGroupIcon className="w-12 h-12 text-gray-500 dark:text-gray-400" />
                </div>
              )}
            </div>
          </div>
          {/* Content Below */}
          <div className="relative px-6 pb-4 pt-20 sm:pt-24">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{community.name}</h1>
                <div className="flex space-x-4 text-sm text-gray-300 sm:text-gray-600 dark:text-gray-300 mt-2">
                  <span className="flex items-center">
                    <UserGroupIcon className="w-6 h-6 mr-1" />
                    {community.member_count} members
                  </span>
                  <span className="flex items-center">
                    <ChatBubbleLeftIcon className="w-6 h-6 mr-1" />
                    {community.article_count} posts
                  </span>
                </div>
              </div>
              <div className="mt-4 sm:mt-0 flex space-x-4">
                <button className={`${Buttons.tealBlueGradientOutlineButton} flex items-center`}>
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Join Community
                </button>
                <button className={`${Buttons.tealBlueGradientOutlineButton} flex items-center`}>
                  <ChatBubbleLeftIcon className="w-5 h-5 mr-2" />
                  Chat
                </button>
                <button className={`${Buttons.tealBlueGradientButton} flex items-center`}>
                  <PencilIcon className="w-5 h-5 mr-2" />
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">About Community</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{community.description}</p>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>Created: {new Date(community.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Community Rules</h2>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                {community.rules && community.rules.split('\r\n').map((rule, index) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>
            </div>
          </div>


          {/* Main Content Area */}
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Articles</h2>
                <button className={Buttons.tealBlueGradientButton}>Post Article</button>
              </div>
              
              {/* Sample Articles */}
              {[1, 2, 3].map((article) => (
                <div key={article} className="border-b border-gray-200 dark:border-gray-700 py-4 last:border-b-0">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Sample Article Title {article}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">This is a sample article content. It can include text, images, and other media.</p>
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Posted by: User{article}</span>
                    <span>2 hours ago</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;