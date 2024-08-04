import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserGroupIcon, LockClosedIcon, LockOpenIcon, CheckIcon, ClockIcon, XCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';

const TeamCard = ({ team }) => {
  const userId = useSelector((state) => state.auth.userId);
  const isPublic = team.privacy === 'public';
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (isPublic || team.request_status === 'accepted') {
      navigate(`/teams/${team.id}/overview`);
    }
  };

  const renderStatusIcon = () => {
    switch (team.request_status) {
      case 'accepted':
        return (
          <div className="flex items-center ml-4 text-green-500">
            <CheckIcon className="w-4 h-4 mr-1" strokeWidth={3} />
            <span>Member</span>
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center ml-4 text-yellow-500">
            <ClockIcon className="w-4 h-4 mr-1" strokeWidth={3} />
            <span>Pending</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center ml-4 text-red-500">
            <XCircleIcon className="w-4 h-4 mr-1" strokeWidth={3} />
            <span>Rejected</span>
          </div>
        );
      default:
        return isPublic ? (
          <div className="flex items-center ml-4 text-blue-500">
            <PlusCircleIcon className="w-4 h-4 mr-1" strokeWidth={3} />
            <span>Join</span>
          </div>
        ) : null;
    }
  };

  return (
    <div 
      className={`bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden transition-all duration-200 mb-6 p-4 
        ${(isPublic || team.request_status === 'accepted') ? 'hover:scale-101 cursor-pointer' : ''}`}
      onClick={handleCardClick}
    >
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
            {renderStatusIcon()}
          </div>
        </div>
        {(!isPublic && team.request_status !== 'accepted') && (
          <div className="flex items-center ml-4">
            <LockClosedIcon className="w-6 h-6 text-yellow-500 stroke-2" />
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamCard;