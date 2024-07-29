import React, { useState } from 'react';
import { PlusIcon, PhotoIcon, XCircleIcon } from '@heroicons/react/24/solid';
import Buttons from '../../../components/user/misc/Buttons';
import Colors from '../../../components/user/misc/Colors';
import { GatewayUrl } from '../../../components/const/urls';
import createAxiosInstance from '../../../api/axiosInstance';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CreateCommunity = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [rules, setRules] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const token = useSelector(state => state.auth.userAccess);
  const navigate = useNavigate()

  const handleSubmit = async(e) => {
    e.preventDefault();
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
      console.log('Response:', response.data);
      navigate(`/communities/${response.data.id}`);
        setName('');
        setDescription('');
        setRules('');
        setProfileImage(null);
        setCoverImage(null);
    } catch (error) {
      console.error('Error creating community:', error);
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

  const ImageUpload = ({ id, label, image, setImage, isProfile }) => (
    <div
      onDrop={(e) => handleImageDrop(e, setImage)}
      onDragOver={(e) => e.preventDefault()}
      className="col-span-1"
    >
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md relative">
        {image ? (
          <>
            <img src={URL.createObjectURL(image)} alt={label} className={`w-full h-32 object-cover ${isProfile ? 'rounded-full' : 'rounded-md'}`} />
            <button
              type="button"
              onClick={() => handleImageRemove(setImage)}
              className="absolute top-2 right-2"
            >
              <XCircleIcon className="w-6 h-6 text-red-600" />
            </button>
          </>
        ) : (
          <div className="space-y-1 text-center">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor={id}
                className="relative cursor-pointer bg-white rounded-md font-medium text-teal-600 hover:text-teal-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-teal-500"
              >
                <span>Upload a file</span>
                <input
                  id={id}
                  name={id}
                  type="file"
                  className="sr-only"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
        )}
      </div>
      {image && <p className="mt-2 text-sm text-gray-500">{image.name}</p>}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
      <h2 className={`text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100`}>
        Create a New Community
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Community Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition duration-150 ease-in-out"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition duration-150 ease-in-out"
            />
          </div>
          <div>
            <label htmlFor="rules" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rules
            </label>
            <textarea
              id="rules"
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition duration-150 ease-in-out"
            />
          </div>
        </div>
        <div className="col-span-1 space-y-6">
          <ImageUpload id="profileImage" label="Profile Image" image={profileImage} setImage={setProfileImage} isProfile />
          <ImageUpload id="coverImage" label="Cover Image" image={coverImage} setImage={setCoverImage} />
        </div>
        <div className="col-span-2 flex justify-end">
          <button
            type="submit"
            className={`${Buttons.tealBlueGradientButton} inline-flex items-center`}
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Create Community
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCommunity;
