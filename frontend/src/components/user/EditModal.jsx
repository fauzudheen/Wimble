import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import createAxiosInstance from '../../api/axiosInstance';
import Colors from './misc/Colors';

const EditModal = ({ onClose, endpoint, initialData, title, onSave }) => {
  const [formData, setFormData] = useState(initialData);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = useSelector(state => state.auth.userAccess);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const axiosInstance = createAxiosInstance(token);
      
      let response;
      if (file) {
        const formData = new FormData();
        formData.append('profile', file);
        response = await axiosInstance.patch(endpoint, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await axiosInstance.patch(endpoint, formData);
      }
      console.log('response', response.data);
      setLoading(false);
      onSave(response.data.profile);
      onClose();
    } catch (err) {
      setError('Failed to update');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">{title}</h2>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {title === "Edit Profile Picture" ? (
            <div>
              <label htmlFor="profile" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profile Picture</label>
              <input
                type="file"
                id="profile"
                name="profile"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          ) : (
            Object.keys(initialData).map(key => (
              <div key={key}>
                <label htmlFor={key} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{key}</label>
                <input
                  type="text"
                  id={key}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            ))
          )}
          <div className="flex justify-end space-x-3 mt-6">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
            Cancel
          </button>
          <button type="submit" className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${Colors.tealBlueGradientButton}`}>
            Save Changes
          </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;