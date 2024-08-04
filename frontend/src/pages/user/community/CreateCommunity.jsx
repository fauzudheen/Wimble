import React, { useState, useCallback } from 'react';
import { PlusIcon, PhotoIcon, XCircleIcon } from '@heroicons/react/24/solid';
import createAxiosInstance from '../../../api/axiosInstance';
import { GatewayUrl } from '../../../components/const/urls';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

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

  const clearError = useCallback((field) => {
    setErrors(prevErrors => ({ ...prevErrors, [field]: null }));
  }, []);

  const handleChange = useCallback((setter, field) => (e) => {
    setter(e.target.value);
    clearError(field);
  }, [clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      navigate(`/teams/${response.data.id}`);
    } catch (error) {
      if (error.response && error.response.data) {
        console.log(error.response.data);
        setErrors("errors", error.response.data);
      } else {
        setErrors({ general: 'An unexpected error occurred. Please try again.' });
      }
    }
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setProfileImage(file);
      clearError('profile_image');
    }
  };

  const handleImageRemove = () => {
    setProfileImage(null);
    clearError('profile_image');
  };

  const ImageUpload = ({ id, label, image, setImage, isProfile, error }) => (
    <div
      onDrop={handleImageDrop}
      onDragOver={(e) => e.preventDefault()}
      className="col-span-1"
    >
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} border-dashed rounded-md relative`}>
        {image ? (
          <>
            <img 
              src={URL.createObjectURL(image)} 
              alt={label} 
              className={`w-full h-32 object-cover ${isProfile ? 'rounded-full' : 'rounded-md'}`} 
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
                htmlFor={id}
                className="relative cursor-pointer bg-white dark:bg-transparent rounded-md font-medium text-teal-600 hover:text-teal-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-teal-500"
              >
                <span>Upload a file</span>
                <input
                  id={id}
                  name={id}
                  type="file"
                  className="sr-only"
                  onChange={(e) => {
                    setImage(e.target.files[0]);
                    clearError(id);
                  }}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 10MB</p>
          </div>
        )}
      </div>
      {image && <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{image.name}</p>}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );

  const InputField = ({ id, label, value, onChange, error, type = 'text' }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          rows="4"
          className={`block w-full p-3 border ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-teal-500`}
        />
      ) : (
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          className={`block w-full p-3 border ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-teal-500`}
        />
      )}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">Create a New Team</h2>
      {errors.general && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {errors.general}
        </div>
      )}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1 space-y-6">
          <InputField
            id="name"
            label="Team Name"
            value={name}
            onChange={handleChange(setName, 'name')}
            error={errors.name}
          />
          <InputField
            id="description"
            label="Description"
            value={description}
            onChange={handleChange(setDescription, 'description')}
            error={errors.description}
            type="textarea"
          />
          <InputField
            id="maximum_members"
            label="Maximum Members"
            value={maximumMembers}
            onChange={handleChange(setMaximumMembers, 'maximum_members')}
            error={errors.maximum_members}
            type="number"
          />
          <InputField
            id="status"
            label="Status"
            value={status}
            onChange={handleChange(setStatus, 'status')}
            error={errors.status}
            type="select"
          />
          <InputField
            id="privacy"
            label="Privacy"
            value={privacy}
            onChange={handleChange(setPrivacy, 'privacy')}
            error={errors.privacy}
            type="select"
          />
        </div>
        <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageUpload
            id="profile_image"
            label="Profile Image"
            image={profileImage}
            setImage={setProfileImage}
            isProfile={true}
            error={errors.profile_image}
          />
        </div>
        <div className="col-span-1 md:col-span-2 flex justify-end">
          <button type="submit" className="px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold rounded-md shadow-md hover:from-teal-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-colors duration-200">
            Create Team
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTeam;
