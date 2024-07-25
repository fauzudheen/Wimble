import React from 'react';
import { UserGroupIcon, ChatBubbleLeftIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import Buttons from '../../../components/user/misc/Buttons';

const CommunityCard = ({ community }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden transition-transform transform">
      {community.cover_image ? (
        <img
          src={community.cover_image.replace('8000', '8003')}
          alt={community.name}
          className="w-full h-36 object-cover"
        />
      ) : (
        <div className="w-full h-36 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
          <PhotoIcon className="w-12 h-12 text-gray-500 dark:text-gray-400" />
        </div>
      )}
      <div className="relative">
        {community.profile_image ? (
          <img
            src={community.profile_image.replace('8000', '8003')}
            alt={community.name}
            className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-900 absolute left-1/2 transform -translate-x-1/2 -top-10"
          />
        ) : (
          <div className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-900 absolute left-1/2 transform -translate-x-1/2 -top-10 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
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
          <div className="flex items-center">
            <ChatBubbleLeftIcon className="w-5 h-5 mr-1" />
            <span>{community.postCount || 0} articles</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Link
            to={`/communities/${community.id}`}
            className={`${Buttons.cancelButton} rounded-md text-sm`}
          >
            View Community
          </Link>
          <button
            className={`${Buttons.tealBlueGradientHoverButton} rounded-md text-sm`}
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityCard;
