import React from 'react';
import { UserGroupIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import Buttons from '../../../components/user/misc/Buttons';

const CommunityCard = ({ community }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105">
      <img
        src={community.imageUrl}
        alt={community.name}
        className="w-full h-36 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-200">
          {community.name}
        </h3>
        <p className="text-gray-800 dark:text-gray-400 mb-4 text-sm">
          {community.description}
        </p>
        <div className="flex items-center justify-between mb-4 text-sm text-gray-800 dark:text-gray-500">
          <div className="flex items-center">
            <UserGroupIcon className="w-5 h-5 mr-1" />
            <span>{community.memberCount} members</span>
          </div>
          <div className="flex items-center">
            <ChatBubbleLeftIcon className="w-5 h-5 mr-1" />
            <span>{community.postCount || 0} articles</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Link
            to={`/community/${community.id}`}
            className={`${Buttons.tealBlueGradientButton} px-4 py-2 rounded-md text-sm`}
          >
            View Community
          </Link>
          <button
            className="bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-teal-700"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityCard;
