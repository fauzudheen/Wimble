import React, { useEffect, useState } from 'react';
import { UserGroupIcon, ChatBubbleLeftIcon, PhotoIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import Buttons from '../../../components/user/misc/Buttons';
import axios from 'axios';
import { GatewayUrl } from '../../../components/const/urls';
import { useSelector } from 'react-redux';

const CommunityCard = ({ community }) => {
  const [isMember, setIsMember] = useState(false);
  const userId = useSelector((state) => state.auth.userId);

  const checkIfMember = async () => {
    try {
      const response = await axios.get(`${GatewayUrl}api/communities/${community.id}/members/${userId}/`);
      setIsMember(response.data.isMember);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setIsMember(false);
      } else {
        console.error('Error checking if user is member:', error);
      }
    }
  };

  useEffect(() => {
    checkIfMember();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden transition-transform transform">
      {community.cover_image ? (
        <img
          src={community.cover_image.replace('8000', '8003')}
          alt={community.name}
          className="w-full h-36 md:h-48 object-cover"
        />
      ) : (
        <div className="w-full h-36 md:h-48 flex items-center justify-center bg-gray-200 dark:bg-gray-800">
          <PhotoIcon className="w-12 h-12 text-gray-500 dark:text-gray-400" />
        </div>
      )}
      <div className="relative">
        {community.profile_image ? (
          <img
            src={community.profile_image.replace('8000', '8003')}
            alt={community.name}
            className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white dark:border-gray-900 absolute left-1/2 transform -translate-x-1/2 -top-10"
          />
        ) : (
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white dark:border-gray-900 absolute left-1/2 transform -translate-x-1/2 -top-10 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
            <UserGroupIcon className="w-12 h-12 text-gray-500 dark:text-gray-400" />
          </div>
        )}
      </div>
      <div className="pt-12 px-4 pb-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-200 text-center">
          {community.name}
        </h3>
        <div className="flex items-center justify-between mb-4 text-sm text-gray-800 dark:text-gray-500">
          <div className="flex items-center">
            <UserGroupIcon className="w-5 h-5 mr-1" />
            <span>{community.member_count} members</span>
          </div>
          {isMember && (
            <div className="flex items-center space-x-1">
              <CheckIcon className="w-5 h-5 text-green-500" strokeWidth={3} />
              <p className="dark:text-white text-sm">Joined</p>
            </div>
          )}
        </div>
        <div className="flex justify-center">
          <Link
            to={`/communities/${community.id}`}
            className={`${Buttons.cancelButton} rounded-md text-sm`}
          >
            View Community
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CommunityCard;
