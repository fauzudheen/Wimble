import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import EditProfileModal from './EditProfileModal';
import axios from 'axios';
import { GatewayUrl } from '../../const/urls';
import { EnvelopeIcon, UserIcon, PencilIcon } from '@heroicons/react/24/solid';
import { useSelector } from 'react-redux';
import EditModal from '../EditModal';
import Colors from '../misc/Colors';
import createAxiosInstance from '../../../api/axiosInstance';
import Buttons from '../misc/Buttons';

const ProfileHeader = () => {
  const { id } = useParams(); // Get the user ID from URL params
  const location = useLocation(); // Get current URL path
  const isMyProfile = location.pathname === '/my-profile'; // Check if the path is for my profile
  const userId = isMyProfile ? useSelector(state => state.auth.userId) : id; // Set user ID based on path
  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    tagline: '',
    email: '',
    profile: '',
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const token = useSelector(state => state.auth.userAccess);

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    fetchUserDetails();
  }

  useEffect(() => {
    fetchUserDetails();
    fetchRelation();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`${GatewayUrl}api/users/${userId}/`);
      console.log(response.data);
      setUser({
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        profile: response.data.profile,
        tagline: response.data.tagline,
        email: response.data.email,
        followers_count: response.data.followers_count,
        followings_count: response.data.followings_count,
      });
    } catch (err) {
      console.error("Error getting User", err);
    }
  };

  const fetchRelation = async () => {
    console.log("fetching relation")
    try {
      const axiosInstance = createAxiosInstance(token);
      const response = await axiosInstance.get(`${GatewayUrl}api/relations/${userId}/`);
      if (response.data.message === "Followed") {
        setIsFollowing(true);
      } else {
        setIsFollowing(false);
      }
    } catch (err) {
      console.error("Error fetching relation", err);
      setIsFollowing(false);
    }
  };
  const handleEditProfilePicture = () => {
    setIsEditing(true);
  };

  const handleSaveProfilePicture = (profile) => {
    setUser(prev => ({ ...prev, profile }));
    setIsEditing(false);
  };

  const handleFollowToggle = async () => {
    try {
      const axiosInstance = createAxiosInstance(token);
      const response = await axiosInstance.post(`${GatewayUrl}api/relations/${userId}/`);
      console.log(response.data);
      isFollowing ? setUser(prev => ({ ...prev, followers_count: prev.followers_count - 1 })) : setUser(prev => ({ ...prev, followers_count: prev.followers_count + 1 }));
      setIsFollowing(prev => !prev);
    } catch (err) {
      console.error("Error following User", err);
    }
  };

  return (
    <div className="relative">
      <div className="h-40 bg-gray-900 dark:bg-gray-900"></div>
      <div className="w-11/12 sm:w-5/6 md:w-4/5 lg:w-4/5 xl:w-5/6 mx-auto -mt-20">
        <div className="relative pt-16 pb-8 text-center bg-white dark:bg-gray-800 rounded-md shadow-sm">
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-12">
            <div className="relative">
              {user.profile ? (
                <img
                  src={user.profile.replace('8000', '8001')} 
                  alt={user.first_name}
                  className="w-24 h-24 rounded-full border-4 border-teal-500 dark:border-gray-700"
                />
              ) : (
                <UserIcon className="w-24 h-24 bg-teal-100 text-gray-500 border-4 border-teal-100 dark:border-gray-700 rounded-full" />
              )}
              {isMyProfile && (
                <button 
                  onClick={handleEditProfilePicture} 
                  className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md"
                >
                  <PencilIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
              )}
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.first_name} {user.last_name}</h1>
          <p className="text-gray-600 dark:text-gray-400">{user.tagline}</p>
          <div className="flex items-center justify-center space-x-2 mt-2">
            <EnvelopeIcon className="h-5 w-5 text-red-500" />
            <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
          </div>
          <div className="mt-4 flex justify-center space-x-4">
            <div className="text-gray-700 dark:text-gray-300">
              <span className="font-bold">{user.followers_count}</span> followers
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              <span className="font-bold">{user.followings_count}</span> following
            </div>
          </div>
          {isMyProfile ? (
            <button
              className={`mt-4 ${Buttons.cancelButton} rounded-md text-sm font-medium`}
              onClick={handleEditProfile}
            >
              Edit Profile
            </button>
          ) : (
            isFollowing ? (
              <button
                className={`mt-4 ${Buttons.cancelButton} px-4 py-2 rounded-md text-sm font-medium`}
                onClick={handleFollowToggle}
              >
                Following
              </button>
            ) : (
              <button
                className={`mt-4 ${Buttons.tealBlueGradientButton} px-4 py-2 rounded-md text-sm font-medium`}
                onClick={handleFollowToggle}
              >
                Follow
              </button>
            )
          )}

        </div>
      </div>
      {showEditModal && <EditProfileModal onClose={handleCloseModal}/>}
      {isEditing && (
        <EditModal
          onClose={() => setIsEditing(false)}
          endpoint={`${GatewayUrl}api/users/${userId}/`}
          initialData={{}}
          title="Edit Profile Picture"
          onSave={handleSaveProfilePicture}
        />
      )}
    </div>
  );
};

export default ProfileHeader;
