import React from 'react';
import { Link } from 'react-router-dom';
import { UserGroupIcon, ChatBubbleLeftIcon, PhotoIcon, CheckIcon, LockClosedIcon, LockOpenIcon, EyeIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';

const TeamCard = ({ team }) => {
  const userId = useSelector((state) => state.auth.userId);
  const isPublic = team.privacy === 'public';

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden transition-transform transform duration-200 mb-6 p-4">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {team.profile_image ? (
            <img
              src={team.profile_image.replace('8000', '8004')}
              alt={team.name}
              className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-900 object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full border-4 border-gray-200 dark:border-gray-900 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
              <UserGroupIcon className="w-10 h-10 text-gray-500 dark:text-gray-400" />
            </div>
          )}
        </div>
        <div className="ml-4 flex-grow">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-200">{team.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{team.description}</p>
          <div className="flex items-center text-sm text-gray-700 dark:text-gray-300 mt-2">
            <div className="flex items-center">
              <UserGroupIcon className="w-4 h-4 mr-1" />
              <span>{team.member_count} / {team.maximum_members} members</span>
            </div>
            {team.status && (
              <div className="flex items-center ml-4">
                <div className={`w-2 h-2 rounded-full mr-1 ${team.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                <span className="capitalize">{team.status}</span>
              </div>
            )}
            <div className={`flex items-center ml-4 ${isPublic ? 'text-blue-500' : 'text-yellow-500'}`}>
              {isPublic ? (
                <LockOpenIcon className="w-4 h-4 mr-1" />
              ) : (
                <LockClosedIcon className="w-4 h-4 mr-1" />
              )}
              <span className="capitalize">{team.privacy}</span>
            </div>
            {team.is_member && (
              <div className="flex items-center ml-4">
                <CheckIcon className="w-4 h-4 text-green-500 mr-1" strokeWidth={3} />
                <span>Member</span>
              </div>
            )}
          </div>
        </div>
        {(isPublic || team.is_member) && (
          <Link
          to={`/teams/${team.id}`}
          className={`px-4 py-2 rounded-full text-white flex items-center space-x-1 ${
            'bg-gradient-to-r from-teal-400 to-blue-600 hover:from-teal-500 hover:to-blue-700 dark:bg-gradient-to-r dark:from-teal-600 dark:to-blue-800 dark:hover:from-teal-700 dark:hover:to-blue-900'
          } transition-colors duration-300 text-sm font-semibold`}
          
          
        >
          <EyeIcon className="w-4 h-4" />
          <span>View Team</span>
        </Link>
        
        )}
      </div>
    </div>
  );
};

export default TeamCard;