import React, { useEffect, useState } from 'react';
import { GatewayUrl } from '../../const/urls';
import EditModal from '../EditModal';
import axios from 'axios';
import { useSelector } from 'react-redux';

const EditProfileModal = ({ onClose }) => {
  const userId = useSelector(state => state.auth.userId);
  const endpoint = `${GatewayUrl}api/users/${userId}/`;
  const [initialData, setInitialData] = useState({});

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${GatewayUrl}api/users/${userId}/`);
        const userData = response.data;

        setInitialData({
          first_name: userData.first_name,
          last_name: userData.last_name,
          tagline: userData.tagline || '',
        });
      } catch (err) {
        console.error("Error getting User", err);
      }
    };

    fetchUserDetails();
  }, [userId]);



  return (
    <EditModal
      onClose={onClose}
      endpoint={endpoint}
      initialData={initialData}
      title="Edit Profile"
      onSave={() => onClose()}
    />
  );
};

export default EditProfileModal;