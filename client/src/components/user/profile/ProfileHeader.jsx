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
import { FlagIcon } from '@heroicons/react/24/outline';
import FormModal from '../FormModal';
import Modal from '../Modal';
import { UsersIcon } from 'lucide-react';

const ProfileHeader = () => {
  const { id } = useParams(); 
  const location = useLocation(); 
  const isMyProfile = location.pathname === '/my-profile'; 
  const userId = isMyProfile ? useSelector(state => state.auth.userId) : id; 
  const uid = useSelector(state => state.auth.userId)
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
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const isAuthenticated = useSelector(state => state.auth.isUserAuthenticated);

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

  const handleReportUser = async (formData) => {
    if (!isAuthenticated) {
      setIsReportModalOpen(false);
      setIsLoginModalOpen(true);
      return;
    }
    try {
      const axiosInstance = createAxiosInstance(token);
      await axiosInstance.post(`${GatewayUrl}api/users/${id}/reports/`, {
        text: formData.reason
      });
      setIsReportModalOpen(false);
    } catch (error) {
      console.error('There was an error reporting the user!', error);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`${GatewayUrl}api/users/${userId}/`);
      console.log("User", response.data);
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

  const reportFields = [
    {
      name: 'reason',
      label: 'Reason for reporting',
      type: 'textarea',
      required: true
    }
  ];

  return (
    <div className="relative">
      <div className="h-32 bg-gray-900 dark:bg-gray-900"></div> 
      <div className="w-11/12 sm:w-5/6 md:w-4/5 lg:w-4/5 xl:w-5/6 mx-auto -mt-16"> 
        <div className="relative pt-12 p-4 pb-6 text-center bg-white dark:bg-gray-800 rounded-md shadow-sm"> 
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-12">
            <div className="relative">
              {user.profile ? (
                <img
                  src={`${GatewayUrl}api/${user.profile}`} 
                  alt={user.first_name}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-teal-500 dark:border-gray-700 object-cover" 
                />
              ) : (
                <UserIcon className="w-20 h-20 md:w-24 md:h-24 bg-teal-100 text-gray-500 border-4 border-teal-100 dark:border-gray-700 rounded-full" />
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {user.first_name} {user.last_name}
            </h1>
            <p className="sm:text-sm md:text-base text-gray-600 dark:text-gray-400 mb-4">{user.tagline}</p>
            
            <div className="flex items-center justify-center mb-4">
              <EnvelopeIcon className="h-5 w-5 text-red-500 mr-2" />
              <p className="sm:text-sm md:text-base text-gray-600 dark:text-gray-400">{user.email}</p>
            </div>
            
            <div className="flex justify-center space-x-6 mb-6">
              <div className="flex items-center">
                <UserIcon className="h-5 w-5 text-blue-500 mr-2" />
                <span className="sm:text-sm md:text-base text-gray-700 dark:text-gray-300">
                  <span className="font-bold">{user.followers_count}</span> followers
                </span>
              </div>
              <div className="flex items-center">
                <UsersIcon className="h-5 w-5 text-green-500 mr-2" />
                <span className="sm:text-sm md:text-base text-gray-700 dark:text-gray-300">
                  <span className="font-bold">{user.followings_count}</span> following
                </span>
              </div>
            </div>
            <div className='flex'>
            {isMyProfile || userId === uid ? (
              <button
                className={`${Buttons.cancelButton} rounded-md text-sm font-medium flex items-center justify-center mx-auto`}
                onClick={handleEditProfile}
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            ) : (
              <button
                className={`${isFollowing ? Buttons.cancelButton : Buttons.tealBlueGradientButton} px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center mx-auto`}
                onClick={handleFollowToggle}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
            {!isMyProfile && (
                <>
                  <button className={`${Colors.tealBlueGradientIcon} p-2 bg-cyan-50 dark:bg-cyan-900 rounded shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400 active:scale-95 transition duration-200 ease-in-out`} 
                  onClick={() => setIsReportModalOpen(true)} title="Report User">
                    <FlagIcon className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                    </button>

                  <FormModal
                    isOpen={isReportModalOpen}
                    onClose={() => setIsReportModalOpen(false)}
                    title="Confirm Report"
                    fields={reportFields}
                    onSubmit={handleReportUser}
                    submitButtonText="Submit Report"
                  />
                </>
              )}
              </div>
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
      <Modal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        title="Authentication Required"
        message="Please log in to perform this operation."
        primaryButtonText="Log In"
        primaryButtonUrl="/login"
        secondaryButtonText="Cancel"
      />
    </div>
  );
};

export default ProfileHeader;