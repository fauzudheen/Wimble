import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GatewayUrl } from '../../../components/const/urls';
import Buttons from '../../../components/user/misc/Buttons';
import Colors from '../../../components/user/misc/Colors';
import { 
  PencilIcon, 
  TrashIcon, 
  ShieldCheckIcon, 
  PhotoIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import createAxiosInstance from '../../../api/axiosInstance';
import { useSelector } from 'react-redux';
import ConfirmModal from '../../../components/user/ComfirmModal';

const CommunitySettings = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [community, setCommunity] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const token = useSelector(state => state.auth.userAccess);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const response = await axios.get(`${GatewayUrl}api/communities/${id}/`);
        setCommunity(response.data);
      } catch (error) {
        console.error('Error fetching community:', error);
      }
    }
    fetchCommunity();
  }, [id]);

  const handleInputChange = (e) => {
    setCommunity({ ...community, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(community).forEach(key => {
        if (key !== 'profile_image' && key !== 'cover_image') {
          formData.append(key, community[key]);
        }
      });
      if (profileImage) formData.append('profile_image', profileImage);
      if (coverImage) formData.append('cover_image', coverImage);
      
      const axiosInstance = createAxiosInstance(token);
      const response = await axiosInstance.patch(`${GatewayUrl}api/communities/${id}/`, formData);
      setCommunity(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating community:', error);
    }
  };

  const handleDelete = async () => {
      try {
        const axiosInstance = createAxiosInstance(token);
        const response = await axiosInstance.delete(`${GatewayUrl}api/communities/${id}/`);
        setIsDeleteModalOpen(false);
        console.log(response.data);
        navigate('/communities');
      } catch (error) {
        console.error('Error deleting community:', error);
      }
  };

  const handleImageDrop = (e, setImage) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleImageRemove = (setImage, imageKey) => {
    setImage(null);
    setCommunity({ ...community, [imageKey]: '' });
  };

  const ImageUpload = ({ id, label, image, setImage, currentImage, isProfile }) => (
    <div
      onDrop={(e) => handleImageDrop(e, setImage)}
      onDragOver={(e) => e.preventDefault()}
      className="col-span-1"
    >
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md relative">
        {image || currentImage ? (
          <>
            <img 
              src={image ? URL.createObjectURL(image) : currentImage.replace('8000', '8003')} 
              alt={label} 
              className={`w-full h-32 object-cover ${isProfile ? 'rounded-full' : 'rounded-md'}`} 
            />
            {isEditing && (
            <button
              type="button"
              onClick={() => handleImageRemove(setImage, id)}
              className="absolute top-2 right-2"
            >
              <XCircleIcon className="w-6 h-6 text-red-600" />
            </button>
            )}
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
    <div className='bg-gray-100 dark:bg-gray-700 py-4'>
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800  p-8 rounded-lg shadow-lg">
        <h2 className={`text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100`}>
          Community Settings
        </h2>
        <hr />
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="col-span-1 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Community Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={community.name || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition duration-150 ease-in-out"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows="4"
                value={community.description || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition duration-150 ease-in-out"
              ></textarea>
            </div>

            <div>
              <label htmlFor="rules" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Community Rules
              </label>
              <textarea
                name="rules"
                id="rules"
                rows="4"
                value={community.rules || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition duration-150 ease-in-out"
              ></textarea>
            </div>
          </div>

          <div className="col-span-1 space-y-6">
            <ImageUpload 
              id="profile_image" 
              label="Profile Image" 
              image={profileImage} 
              setImage={setProfileImage} 
              currentImage={community.profile_image}
              isProfile 
            />
            <ImageUpload 
              id="cover_image" 
              label="Cover Image" 
              image={coverImage} 
              setImage={setCoverImage} 
              currentImage={community.cover_image}
            />
          </div>

          <div className="col-span-2 flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
            {isEditing &&
              <>
                <button
                  type="submit"
                  className={`${Buttons.tealBlueGradientButton} flex items-center`}
                >
                  <ShieldCheckIcon className="w-5 h-5 mr-2" />
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className={Buttons.cancelButton}
                >
                  Cancel
                </button>
              </>
            }
            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className={Buttons.tealBlueGradientOutlineButton}
              >
                Edit
              </button>
            )}
          </div>

          {/* Danger Zone */}
        <div className="col-span-2 mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-red-600 dark:text-red-400 mb-4">Danger Zone</h2>
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center"
          >
            <TrashIcon className="w-5 h-5 mr-2" />
            Delete Community
          </button>
          <ConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            title="Confirm Deletion"
            message={`Are you sure you want to delete the community "${community.name}"? This action cannot be undone.`}
            onConfirm={handleDelete}
            confirmButtonText="Delete"
            cancelButtonText="Cancel"
            />
        </div>
      </form>
    </div>
    </div>
  );
};

export default CommunitySettings;
