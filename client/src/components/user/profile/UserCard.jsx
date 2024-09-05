import React from 'react';
import { Link } from 'react-router-dom';
import { UserIcon } from '@heroicons/react/24/outline';
import { GatewayUrl } from '../../const/urls';

const UserCard = ({ user }) => {
  return (
    <Link 
      to={`/user-profile/${user.id}`}
      className="block bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          {user.profile ? (
            <img 
              src={`${GatewayUrl}api${user.profile}`} 
              alt={`${user.first_name} ${user.last_name}`} 
              className="h-16 w-16 rounded-full object-cover mr-4"
              
            />
          ) : (
            <div className="h-16 w-16 p-4 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-4">
              <UserIcon className="h-8 w-8 text-gray-400 dark:text-gray-300" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {`${user.first_name} ${user.last_name}`}
            </h3>
            {user.tagline && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {user.tagline}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>Followers: {user.followers_count}</span>
          <span>Following: {user.followings_count}</span>
        </div>
      </div>
    </Link>
  );
};

export default UserCard;