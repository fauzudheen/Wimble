import React, { useEffect, useState } from 'react';
import { UserGroupIcon, ChatBubbleLeftIcon, PhotoIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import Buttons from '../misc/Buttons';
import axios from 'axios';
import { GatewayUrl } from '../../const/urls';
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
          src={community.cover_image}
          alt={community.name}
          className="w-full h-32 md:h-40 object-cover"
        />
      ) : (
        <div className="w-full h-32 md:h-40 flex items-center justify-center bg-gray-200 dark:bg-gray-800">
          <PhotoIcon className="w-10 h-10 text-gray-500 dark:text-gray-400" />
        </div>
      )}
      <div className="relative">
        {community.profile_image ? (
          <img
            src={community.profile_image}
            alt={community.name}
            className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white dark:border-gray-900 absolute left-1/2 transform -translate-x-1/2 -top-8 object-cover"
          />
        ) : (
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white dark:border-gray-900 absolute left-1/2 transform -translate-x-1/2 -top-8 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
            <UserGroupIcon className="w-10 h-10 text-gray-500 dark:text-gray-400" />
          </div>
        )}
      </div>
      <div className="pt-10 px-3 pb-3">
        <h3 className="text-md font-semibold mb-1.5 text-gray-900 dark:text-gray-200 text-center">
          {community.name}
        </h3>
        <div className="flex items-center justify-between mb-3 text-xs text-gray-800 dark:text-gray-500">
          <div className="flex items-center">
            <UserGroupIcon className="w-4 h-4 mr-1" />
            <span>{community.member_count} members</span>
          </div>
          {isMember && (
            <div className="flex items-center space-x-1">
              <CheckIcon className="w-4 h-4 text-green-500" strokeWidth={3} />
              <p className="dark:text-white text-xs">Joined</p>
            </div>
          )}
        </div>
        <div className="flex justify-center">
          <Link
            to={`/communities/${community.id}`}
            className={`${Buttons.cancelButton} rounded-md text-xs`}
          >
            View Community
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CommunityCard;
