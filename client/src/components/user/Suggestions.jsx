import React, { useEffect, useState, useCallback } from 'react';
import createAxiosInstance from '../../api/axiosInstance';
import { useSelector } from 'react-redux';
import { GatewayUrl } from '../const/urls';
import { Link, useNavigate } from 'react-router-dom';
import { UserIcon } from '@heroicons/react/24/outline';

const Suggestions = () => {
  const [peopleToFollow, setPeopleToFollow] = useState([]);
  const [trendingHashtags, setTrendingHashtags] = useState([]);
  const token = useSelector(state => state.auth.userAccess);
  const navigate = useNavigate();

  const fetchPeopleToFollow = useCallback(async () => {
    const axiosInstance = createAxiosInstance(token);
    try {
      const response = await axiosInstance.get(`${GatewayUrl}api/users-to-follow-suggestions/`);
      setPeopleToFollow(response.data.map(user => ({ ...user, isFollowing: false })));
    } catch (error) {
      console.error('Error fetching people to follow:', error);
    }
  }, [token]);

  const fetchTrendingTags = useCallback(async () => {
    const axiosInstance = createAxiosInstance(token);
    try {
      const response = await axiosInstance.get(`${GatewayUrl}api/trending-tags/`);
      setTrendingHashtags(response.data);
    } catch (error) {
      console.error('Error fetching trending hashtags:', error);
    }
  }, [token]);

  useEffect(() => {
    fetchPeopleToFollow();
    fetchTrendingTags();
  }, [fetchPeopleToFollow, fetchTrendingTags]);

  const handleFollowToggle = async (userId) => {
    try {
      const axiosInstance = createAxiosInstance(token);
      await axiosInstance.post(`${GatewayUrl}api/relations/${userId}/`);
      setPeopleToFollow(prevPeople =>
        prevPeople.map(user =>
          user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user
        )
      );
    } catch (err) {
      console.error("Error toggling follow status", err);
    }
  };

  return (
    <aside className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl w-full max-w-md mx-auto sm:max-w-sm">
      <section className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-2">People to Follow</h2>
        <ul className="space-y-2 sm:space-y-4">
          {peopleToFollow.map(user => (
            <li key={user.id} className="group">
              <div className="flex items-center rounded-lg transition-all duration-300">
                <Link to={`/user-profile/${user.id}`} className="flex-shrink-0 mr-2 sm:mr-4">
                  {user.profile ? (
                    <img 
                      src={user.profile} 
                      alt={`${user.first_name} ${user.last_name}`} 
                      className="h-8 w-8 sm:h-12 sm:w-12 rounded-full object-cover transition-all duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
                      <UserIcon className="h-5 w-5 sm:h-8 sm:w-8 text-white" />
                    </div>
                  )}
                </Link>
                <div className="flex-grow">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">
                    {`${user.first_name} ${user.last_name}`}
                  </h3>
                  {user.tagline && (
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 sm:mb-2 line-clamp-1">
                      {user.tagline}
                    </p>
                  )}
                  <button 
                    className={`text-xs sm:text-sm font-medium px-2 py-0.5 sm:px-4 sm:py-1 rounded-full transition-all duration-300 ${
                      user.isFollowing
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700'
                        : 'bg-transparent border border-cyan-500 text-cyan-500 hover:bg-cyan-50 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => handleFollowToggle(user.id)}
                  >
                    {user.isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="p-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-4">Trending Hashtags</h2>
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {trendingHashtags.map(tag => (
            <button
              key={tag.id}
              onClick={() => navigate(`/articles-by-tag/${tag.id}`)}
              className="inline-flex items-center px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-all duration-300 hover:shadow-md"
            >
              #{tag.name}
            </button>
          ))}
        </div>
      </section>
    </aside>
  );
};

export default Suggestions;