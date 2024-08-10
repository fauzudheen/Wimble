import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { UserGroupIcon, ChatBubbleLeftIcon, PencilIcon, PlusIcon, PhotoIcon, CogIcon } from '@heroicons/react/24/outline';
import Buttons from '../../../components/user/misc/Buttons';
import axios from 'axios';
import { GatewayUrl } from '../../../components/const/urls';
import { useSelector } from 'react-redux';
import createAxiosInstance from '../../../api/axiosInstance';
import ConfirmModal from '../../../components/user/ComfirmModal';
import { ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/solid';
import CompactArticle from '../../../components/user/article/CompactArticle';

const CommunityPage = () => {
  const { id } = useParams();
  const [community, setCommunity] = useState({});
  const userId = useSelector((state) => state.auth.userId);
  const token = useSelector((state) => state.auth.userAccess);
  const navigate = useNavigate();
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [memberCount, setMemberCount] = useState(0);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetchArticlesByCommunity();
    fetchCommunity(); 
    checkIfMember();
  }, []);

  const fetchCommunity = async () => {
    try {
      const response = await axios.get(`${GatewayUrl}api/communities/${id}/`);
      setCommunity(response.data);
      setMemberCount(response.data.member_count);
    } catch (error) {
      console.error('Error fetching community:', error);
    }
  };

  const checkIfMember = async () => {
    try {
      const response = await axios.get(`${GatewayUrl}api/communities/${id}/members/${userId}/`);
      setIsMember(response.data.isMember);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setIsMember(false);
      } else {
        console.error('Error checking if user is member:', error);
      }
    }
  };

  const handleLeave = () => {
    if (community.admin_id === userId) {
      setIsLeaveModalOpen(true);
    } else {
      leave();
    }
  };

  const leave = async() => {
    try {
      const axiosInstance = createAxiosInstance(token);
      await axiosInstance.delete(`${GatewayUrl}api/communities/${id}/members/${userId}/`);
      setIsLeaveModalOpen(false);
      setIsMember(false);
      setMemberCount(memberCount - 1);
    } catch (error) {
      console.error('Error leaving community:', error);
    }
  };

  const handleJoin = async() => {
    try {
      const axiosInstance = createAxiosInstance(token);
      await axiosInstance.post(`${GatewayUrl}api/communities/${id}/members/`, {});
      setIsMember(true);
      setMemberCount(memberCount + 1);
      setIsJoinModalOpen(false);
    } catch (error) {
      console.error('Error joining community:', error);
    }
  };

  const fetchArticlesByCommunity = async () => {
    try {
      const response = await axios.get(`${GatewayUrl}api/articles/by-community/${id}/`);
      setArticles(response.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-black min-h-screen p-2">
      {/* Header Sections */}
      <div className="relative max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {/* Cover Image */}
          <div className="relative w-full h-[20vh] sm:h-[30vh] md:h-[40vh]">
            {community.cover_image ? (
              <img
                src={community.cover_image.replace('8000', '8003')}
                alt={`${community.name} cover`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                <PhotoIcon className="w-8 h-8 sm:w-10 sm:h-10 text-gray-500 dark:text-gray-400" />
              </div>
            )}
            {/* Profile Image */}
            <div className="absolute left-4 sm:left-6 bottom-0 transform translate-y-1/2">
              {community.profile_image ? (
                <img
                  src={community.profile_image.replace('8000', '8003')}
                  alt={`${community.name} profile`}
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-4 border-white dark:border-gray-800 shadow-lg object-cover"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-4 border-white dark:border-gray-800 shadow-lg flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                  <UserGroupIcon className="w-8 h-8 sm:w-10 sm:h-10 text-gray-500 dark:text-gray-400" />
                </div>
              )}
            </div>
          </div>
          {/* Content Below */}
          <div className="relative px-4 sm:px-6 pb-4 pt-12 sm:pt-16 md:pt-20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{community.name}</h1>
                <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-gray-800 sm:text-gray-700 dark:text-gray-300 mt-2">
                  <span className="flex items-center">
                    <UserGroupIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
                    {memberCount} Members
                  </span>
                  <span className="flex items-center">
                    <ChatBubbleLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
                    {articles.length} Articles
                  </span>
                  {community.admin_id === userId && (
                    <span className="flex items-center border rounded-md px-1 bg-teal-100 dark:bg-teal-800 dark:text-white text-xs">
                      Admin
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
                {isMember ? (
                  <button className={`${Buttons.cancelButton} text-xs sm:text-sm flex items-center`} onClick={handleLeave}>
                    <ArrowLeftStartOnRectangleIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
                    Leave Community
                  </button>
                ) : (
                  <button className={`${Buttons.tealBlueGradientOutlineButton} text-xs sm:text-sm flex items-center`} onClick={() => setIsJoinModalOpen(true)}>
                    <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
                    Join Community
                  </button>
                )}
                {community.admin_id === userId && (
                  <button className={`${Buttons.tealBlueGradientButton} text-xs sm:text-sm flex items-center`} onClick={() => navigate(`/communities/${id}/settings`)}>
                    <CogIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
                    Settings
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 pt-4 sm:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 ">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 sm:p-4 mb-2 sm:mb-2 md:mb-4 lg:mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">About Community</h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-2">{community.description}</p>
              <div className="flex justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                <span>Created: {new Date(community.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 sm:p-4 ">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">Community Rules</h2>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                {community.rules && community.rules.split('\r\n').map((rule, index) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 sm:p-4 mb-4 sm:mb-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Recent Articles</h2>
                {isMember && (
                <Link to="/create-article" state={{ communityId: id, communityName: community.name }}>
                  <button className={`${Buttons.tealBlueGradientButton} text-xs sm:text-sm`}>Post Article</button>
                </Link>
                )}
              </div>
                <hr className='border-gray-200 dark:border-gray-600 mb-2'/>

              {/* Articles */}
              <div className="space-y-4">
                {articles.map((article) => (
                  <CompactArticle key={article.id} article={article} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ConfirmModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        title="Confirm Action"
        message={
          <>
            <p>Are you sure you want to leave <strong>{community.name}</strong>?</p>
            <br />
            <ul className="list-disc list-inside text-sm">
              <li>You are the admin of this community.</li>
              <li>If you leave, you will not be able to join again with the current privileges.</li>
              <li>If you are the last member, the community will be deleted.</li>
            </ul>
          </>
        }
        onConfirm={leave}
        confirmButtonText="Leave"
        cancelButtonText="Cancel"
      />
      <ConfirmModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        title="Confirm Action"
        message={`Please make sure that you have read the rules of the community.`}
        onConfirm={handleJoin}
        confirmButtonText="Join"
        cancelButtonText="Cancel"
      />
    </div>
  );
};

export default CommunityPage;
