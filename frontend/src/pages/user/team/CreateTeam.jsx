import React, { useState } from 'react';
import { PlusIcon, PhotoIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import createAxiosInstance from '../../../api/axiosInstance';
import { GatewayUrl } from '../../../components/const/urls';

const CreateTeam = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [maximumMembers, setMaximumMembers] = useState('');
  const [status, setStatus] = useState('active');
  const [privacy, setPrivacy] = useState('public');
  const [profileImage, setProfileImage] = useState(null);
  const [errors, setErrors] = useState({});
  const token = useSelector(state => state.auth.userAccess);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Reset errors on submit
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('maximum_members', maximumMembers);
      formData.append('status', status);
      formData.append('privacy', privacy);
      if (profileImage) {
        formData.append('profile_image', profileImage);
      }

      const axiosInstance = createAxiosInstance(token);
      const response = await axiosInstance.post(`${GatewayUrl}api/teams/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Team created:', response.data);
      navigate(`/teams/${response.data.id}`);
    } catch (error) {
      if (error.response && error.response.data) {
        console.log(error.response.data);
        setErrors(error.response.data);
      } else {
        console.error('Error creating team:', error);
        setErrors({ general: 'An unexpected error occurred. Please try again.' });
      }
    }
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setProfileImage(file);
    }
  };

  const handleImageRemove = () => {
    setProfileImage(null);
  };

  // Function to clear specific error when user starts editing the field
  const handleChange = (setter) => (e) => {
    setter(e.target.value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.id]: undefined, // Clear error for this field
    }));
  };

  return (
    <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-50">Create a New Team</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="flex flex-col space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Team Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={handleChange(setName)}
                required
                className={`block w-full p-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-teal-500`}
              />
              {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name[0]}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={handleChange(setDescription)}
                rows="4"
                required
                className={`block w-full p-3 border ${errors.description ? 'border-red-500' : 'border-gray-300'} dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-teal-500`}
              />
              {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description[0]}</p>}
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col space-y-4">
            <div>
              <label htmlFor="maximumMembers" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Maximum Members
              </label>
              <input
                type="number"
                id="maximumMembers"
                value={maximumMembers}
                onChange={handleChange(setMaximumMembers)}
                required
                min="1"
                className={`block w-full p-3 border ${errors.maximum_members ? 'border-red-500' : 'border-gray-300'} dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-teal-500`}
              />
              {errors.maximum_members && <p className="mt-2 text-sm text-red-600">{errors.maximum_members[0]}</p>}
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="block w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-teal-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label htmlFor="privacy" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Privacy
              </label>
              <select
                id="privacy"
                value={privacy}
                onChange={(e) => setPrivacy(e.target.value)}
                className="block w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-teal-500"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>
        </div>

        <div className="col-span-1">
          <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Profile Image
          </label>
          <div
            onDrop={handleImageDrop}
            onDragOver={(e) => e.preventDefault()}
            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md relative"
          >
            {profileImage ? (
              <>
                <img 
                  src={URL.createObjectURL(profileImage)} 
                  alt="Profile" 
                  className="w-32 h-32 object-cover rounded-full" 
                />
                <button
                  type="button"
                  onClick={handleImageRemove}
                  className="absolute top-2 right-2"
                >
                  <XCircleIcon className="w-6 h-6 text-red-600" />
                </button>
              </>
            ) : (
              <div className="space-y-1 text-center">
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                <div className="flex text-sm text-gray-600 dark:text-gray-300">
                  <label
                    htmlFor="profileImage"
                    className="relative cursor-pointer bg-white dark:bg-transparent rounded-md font-medium text-teal-600 hover:text-teal-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-teal-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="profileImage"
                      name="profileImage"
                      type="file"
                      className="sr-only"
                      onChange={(e) => setProfileImage(e.target.files[0])}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 10MB</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit" 
            className="px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold rounded-md shadow-md hover:from-teal-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-colors duration-200"
          >
            Create Team
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTeam;
