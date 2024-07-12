import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { GatewayUrl } from '../../const/urls';
import { useSelector } from 'react-redux';
import EditModal from '../EditModal';
import { PencilIcon } from '@heroicons/react/24/outline';

const UserBio = () => {
  const userId = useSelector(state => state.auth.userId);
  const [bio, setBio] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`${GatewayUrl}api/users/${userId}/`);
      setBio(response.data.bio);
    } catch (err) {
      console.error("Error getting User", err);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const toggleEdit = () => {
    setIsEditing(prev => !prev);
  };

  const handleSave = async (newBio) => {
    try {
      const response = await axios.patch(`${GatewayUrl}api/users/${userId}/`, { bio: newBio });
      setBio(response.data.bio);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating bio", err);
    }
  };

  const handleCloseModal = () => {
    setIsEditing(false);
    fetchUserDetails();
  }

  return (
    <div className="mb-4 bg-white dark:bg-gray-800 p-6 rounded-md shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Bio</h2>
        <button 
          onClick={toggleEdit} 
          className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
          aria-label="Edit Bio"
        >
          <PencilIcon className="h-5 w-5" />
        </button>
      </div>
      <p className="text-gray-700 dark:text-gray-300">{bio}</p>
      {isEditing && (
        <EditModal
          onClose={handleCloseModal}
          endpoint={`${GatewayUrl}api/users/${userId}/`}
          initialData={{ bio }}
          title="Edit Bio"
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default UserBio;