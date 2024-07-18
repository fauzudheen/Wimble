import React, { useEffect, useState } from 'react';
import EditProfileModal from './EditProfileModal';
import axios from 'axios';
import { GatewayUrl } from '../../const/urls';
import { EnvelopeIcon, UserIcon, PencilIcon } from '@heroicons/react/24/solid';
import { useSelector } from 'react-redux';
import EditModal from '../EditModal';
import Colors from '../misc/Colors';

const ProfileHeader = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const userId = useSelector(state => state.auth.userId);
  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    tagline: '',
    email: '',
    profile: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    fetchUserDetails();
  }

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`${GatewayUrl}api/users/${userId}/`)
      setUser({
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        profile: response.data.profile,
        tagline: response.data.tagline,
        email: response.data.email,
      });
    } catch (err) {
      console.error("Error getting User", err)
    }
  };

  const handleEditProfilePicture = () => {
    setIsEditing(true);
  };

  const handleSaveProfilePicture = (profile) => {
    setUser(prev => ({ ...prev, profile }));
    setIsEditing(false);
  };

  return (
    <div className="relative">
      <div className="h-40 bg-gray-900 dark:bg-gray-600"></div>
      <div className="w-11/12 sm:w-5/6 md:w-4/5 lg:w-4/5 xl:w-5/6 mx-auto -mt-20">
        <div className="relative pt-16 pb-8 text-center bg-white dark:bg-gray-800 rounded-md shadow-sm">
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-12">
            <div className="relative">
              {user.profile ? (
                <img
                src={`${GatewayUrl}api/user_service/media/${user.profile.split('/media/')[1]}`} 
                  alt={user.first_name}
                  className="w-24 h-24 rounded-full border-4 border-teal-500 dark:border-gray-700"
                />
              ) : (
                <UserIcon className="w-24 h-24 bg-teal-100 text-gray-500 border-4 border-teal-100 dark:border-gray-700 rounded-full" />
              )}
              <button 
                onClick={handleEditProfilePicture} 
                className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md"
              >
                <PencilIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
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
              <span className="font-bold">234</span> followers
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              <span className="font-bold">154</span> following
            </div>
          </div>
          <button
            className={`mt-4 ${Colors.tealBlueGradientButton} px-4 py-2 rounded-md text-sm font-medium`}
            onClick={handleEditProfile}
          >
            Edit Profile
          </button>
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