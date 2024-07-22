import React, { useState, useEffect } from 'react';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/solid';
import Colors from '../../components/user/misc/Colors';
import Buttons from '../../components/user/misc/Buttons';
import axios from 'axios';
import { GatewayUrl } from '../../components/const/urls';
import createAxiosInstance from '../../api/axiosInstance';

const Tags = ({ token }) => {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');

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
      } catch (error) {
        console.error('Error adding new tag:', error);
      }
    }
  };

  return (
    <div className="w-full mx-auto p-6 ml-4 bg-white dark:bg-gray-800 rounded-xl shadow-md transition-all duration-300 ease-in-out transform">
      <div className="mb-6">
        <h2 className={`text-2xl font-bold ${Colors.tealBlueGradientText} mb-4`}>
          Tags
        </h2>
        <div className="flex items-center">
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
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag.id}
            className={`${Colors.tealBlueGradientButton} px-3 py-1 rounded-full text-sm flex items-center`}
          >
            # {tag.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Tags;