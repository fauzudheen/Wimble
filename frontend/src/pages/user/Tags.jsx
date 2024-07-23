import React, { useState, useEffect } from 'react';
import { XMarkIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import Colors from '../../components/user/misc/Colors';
import Buttons from '../../components/user/misc/Buttons';
import axios from 'axios';
import { GatewayUrl } from '../../components/const/urls';
import createAxiosInstance from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const Tags = ({ token }) => {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showInput, setShowInput] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const response = await axios.get(`${GatewayUrl}api/interests/`);
        console.log('Interests:', response.data);
        setTags(response.data);
      } catch (error) {
        console.error('Error fetching interests:', error);
      }
    };

    fetchInterests();
  }, []);

  const handleAddTag = async () => {
    if (newTag.trim()) {
      try {
        const axiosInstance = createAxiosInstance(token);
        const response = await axiosInstance.post(`${GatewayUrl}api/interests/`, { name: newTag.trim() });
        setTags([...tags, response.data]);
        setNewTag('');
        setShowInput(false);
      } catch (error) {
        console.error('Error adding new tag:', error);
      }
    }
  };

  const filteredTags = tags.filter(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="ml-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md transition-all duration-300 ease-in-out transform">
      <div className="mb-6">
        <h2 className={`text-2xl font-bold ${Colors.tealBlueGradientText} mb-4`}>
          Tags
        </h2>
        <div className="flex items-center mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tags"
            className="flex-grow px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <MagnifyingGlassIcon className="h-5 w-5 ml-2 text-teal-500" />
        </div>
        {showInput ? (
          <div className="flex items-center mb-4">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add new tag"
              className="flex-grow px-3 py-2 text-sm border rounded-l-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              onClick={handleAddTag}
              className={`${Colors.tealBlueGradientButton} px-4 py-2 rounded-r-md flex items-center text-sm`}
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add
            </button>
            <XMarkIcon
              className="h-5 w-5 ml-2 text-red-500 cursor-pointer"
              onClick={() => setShowInput(false)}
            />
          </div>
        ) : (
          <button
            onClick={() => setShowInput(true)}
            className={Buttons.tealBlueGradientButton + ' px-4 py-2 rounded-md flex items-center text-sm'}
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add New Tag
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {filteredTags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => navigate(`/articles-by-tag/${tag.id}`)}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            # {tag.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tags;
