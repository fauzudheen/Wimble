import React, { useEffect, useState } from 'react';
import { UserGroupIcon, ChatBubbleLeftIcon, PhotoIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import Buttons from '../misc/Buttons';
import axios from 'axios';
import { GatewayUrl } from '../../const/urls';
import { useSelector } from 'react-redux';

const TeamCard = ({ team }) => {
  const userId = useSelector((state) => state.auth.userId);

  return (
    <Link
    to={`/teams/${team.id}`}
    >
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-101 duration-200 mb-6 p-4">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {team.profile_image ? (
            <img
              src={team.profile_image.replace('8000', '8004')}
              alt={team.name}
              className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-900 object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-900 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
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
              <span>{team.maximum_members} max members</span>
            </div>
            {team.status && (
              <div className="flex items-center ml-4">
                <div className={`w-2 h-2 rounded-full mr-1 ${team.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                <span className="capitalize">{team.status}</span>
              </div>
            )}
            {team.is_member && (
              <div className="flex items-center ml-4">
                <CheckIcon className="w-4 h-4 text-green-500 mr-1" strokeWidth={3} />
                <span>Member</span>
              </div>
            )}
          </div>
        </div>
        
          {team.is_member ? 'View Team' : 'Join Team'}
      </div>
    </div>
        </Link>
  );
};

export default TeamCard;
