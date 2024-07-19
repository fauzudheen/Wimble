import React, { useState, useEffect } from 'react';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/solid';
import Colors from '../../components/user/misc/Colors';
import Buttons from '../../components/user/misc/Buttons';
import axios from 'axios';
import { GatewayUrl } from '../../components/const/urls';

const Tags = () => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
      const fetchInterests = async () => {
        try {
          const response = await axios.get(`${GatewayUrl}api/interests/`);
          console.log('Interests:', response.data)
          setTags(response.data);
        } catch (error) {
          console.error('Error fetching interests:', error);
        }
      };

    fetchInterests();
  }, []);

  return (
    <div className="w-full mx-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md transition-all duration-300 ease-in-out transform">
      <h2 className={`text-2xl font-bold mb-4 ${Colors.tealBlueGradientText}`}>
        Tags
      </h2>
      <div className="flex flex-wrap gap-2 mb-4">
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