import React, { useState } from 'react';
import { PlusIcon, PhotoIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import createAxiosInstance from '../../../api/axiosInstance';
import { GatewayUrl } from '../../../components/const/urls';

const CreateCommunity = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [rules, setRules] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
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
      formData.append('rules', rules);
      if (profileImage) {
        formData.append('profile_image', profileImage);
      }
      if (coverImage) {
        formData.append('cover_image', coverImage);
      }

      const axiosInstance = createAxiosInstance(token);
      const response = await axiosInstance.post(`${GatewayUrl}api/communities/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Community created:', response.data);
      navigate(`/communities/${response.data.id}`);
    } catch (error) {
      if (error.response && error.response.data) {
        console.log(error.response.data);
        setErrors(error.response.data);
      } else {
        console.error('Error creating community:', error);
        setErrors({ general: 'An unexpected error occurred. Please try again.' });
      }
    }
  };

  const handleImageDrop = (e, setImage) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleImageRemove = (setImage) => {
    setImage(null);
  };

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.id]: undefined, // Clear error for this field
    }));
  };

  return (
    <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">Create a New Community</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="flex flex-col space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Community Name
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
              <label htmlFor="rules" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Community Rules
              </label>
              <textarea
                id="rules"
                value={rules}
                onChange={handleChange(setRules)}
                rows="4"
                required
                className={`block w-full p-3 border ${errors.rules ? 'border-red-500' : 'border-gray-300'} dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-teal-500`}
              />
              {errors.rules && <p className="mt-2 text-sm text-red-600">{errors.rules[0]}</p>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1">
            <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Profile Image
            </label>
            <div
              onDrop={(e) => handleImageDrop(e, setProfileImage)}
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
                    onClick={() => handleImageRemove(setProfileImage)}
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

          <div className="col-span-1">
            <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cover Image
            </label>
            <div
              onDrop={(e) => handleImageDrop(e, setCoverImage)}
              onDragOver={(e) => e.preventDefault()}
              className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md relative"
            >
              {coverImage ? (
                <>
                  <img
                    src={URL.createObjectURL(coverImage)}
                    alt="Cover"
                    className="w-full h-40 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleImageRemove(setCoverImage)}
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
                      htmlFor="coverImage"
                      className="relative cursor-pointer bg-white dark:bg-transparent rounded-md font-medium text-teal-600 hover:text-teal-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-teal-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="coverImage"
                        name="coverImage"
                        type="file"
                        className="sr-only"
                        onChange={(e) => setCoverImage(e.target.files[0])}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold rounded-md shadow-md hover:from-teal-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-colors duration-200"
          >
            Create Community
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCommunity;
