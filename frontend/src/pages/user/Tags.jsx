import React, { useState, useEffect } from 'react';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/solid';
import Colors from '../../components/user/misc/Colors';
import Buttons from '../../components/user/misc/Buttons';

const TagsComponent = ({ initialTags = [] }) => {
  const [tags, setTags] = useState(initialTags);
  const [input, setInput] = useState('');

  const addTag = () => {
    if (input && !tags.includes(input)) {
      setTags([...tags, input]);
      setInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && input) {
        addTag();
      }
    };
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [input]);

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
      <h2 className={`text-2xl font-bold mb-4 ${Colors.tealBlueGradientText}`}>
        Awesome Tags
      </h2>
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag) => (
          <span
            key={tag}
            className={`${Colors.tealBlueGradientButton} px-3 py-1 rounded-full text-sm flex items-center`}
          >
            {tag}
            <XMarkIcon
              className="w-4 h-4 ml-2 cursor-pointer"
              onClick={() => removeTag(tag)}
            />
          </span>
        ))}
      </div>
      <div className="flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a tag..."
          className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-teal-400 dark:bg-gray-700 dark:text-white"
        />
        <button
          onClick={addTag}
          className={`${Buttons.tealBlueGradientButton} rounded-l-none flex items-center`}
        >
          <PlusIcon className="w-5 h-5 mr-1" />
          Add
        </button>
      </div>
      <div className="mt-4">
        <button
          onClick={() => setTags([])}
          className={`${Buttons.cancelButton} w-full`}
        >
          Clear All Tags
        </button>
      </div>
    </div>
  );
};

export default TagsComponent;