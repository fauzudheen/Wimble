import React, { useEffect, useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { GatewayUrl } from '../const/urls';
import axios from 'axios';
import createAxiosInstance from '../../api/axiosInstance';
import { useSelector } from 'react-redux';
import ConfirmModal from '../user/ComfirmModal';

const SkillsAndInterests = () => {
  const [activeTab, setActiveTab] = useState('skills');
  const [items, setItems] = useState({ skills: [], interests: [] });
  const [newItem, setNewItem] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const token = useSelector(state => state.auth.adminAccess);
  const [errors, setErrors] = useState({});
  const [deleteModalState, setDeleteModalState] = useState({ isOpen: false, index: null });

  useEffect(() => {
    const fetchSkillsAndInterests = async () => {
      try {
        const skillResponse = await axios.get(`${GatewayUrl}api/skills/`);
        const interestResponse = await axios.get(`${GatewayUrl}api/interests/`);
        setItems({ skills: skillResponse.data, interests: interestResponse.data });
      } catch (error) {
        console.error('Error fetching skills and interests:', error);
      }
    };

    fetchSkillsAndInterests();
  }, []);

  const handleChange = (e) => {
    setNewItem(e.target.value);
    setErrors({});
  };

  const handleAddItem = async () => {
    if (newItem.trim()) {
      try {
        const axiosInstance = createAxiosInstance(token);
        const response = await axiosInstance.post(`${GatewayUrl}api/${activeTab}/`, { name: newItem.trim() });
        console.log('Response:', response.data);
        setItems(prev => ({ ...prev, [activeTab]: [...prev[activeTab], response.data] }));
        setNewItem('');
        setErrors({});
      } catch (error) {
        if (error.response && error.response.data) {
          console.error('Validation errors:', error.response.data);
          setErrors(error.response.data);
        } else {
          console.error('Error creating item:', error);
        }
      }
    }
  };

  const handleEditItem = async (index, value) => {
    try {
      const axiosInstance = createAxiosInstance(token);
      const itemId = items[activeTab][index].id;
      const response = await axiosInstance.patch(`${GatewayUrl}api/${activeTab}/${itemId}/`, { name: value });
      setItems(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].map((item, i) => (i === index ? response.data : item))
      }));
      setEditingIndex(null);
      setErrors({});
    } catch (error) {
      if (error.response && error.response.data) {
        console.error('Validation errors:', error.response.data);
        setErrors(error.response.data);
      } else {
        console.error('Error editing item:', error);
      }
    }
  };

  const handleDeleteItem = async () => {
    const index = deleteModalState.index;
    if (index === null) return;

    try {
      const axiosInstance = createAxiosInstance(token);
      const itemId = items[activeTab][index].id;
      await axiosInstance.delete(`${GatewayUrl}api/${activeTab}/${itemId}/`);
      setItems(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].filter((_, i) => i !== index)
      }));
      setErrors({});
    } catch (error) {
      if (error.response && error.response.data) {
        console.error('Validation errors:', error.response.data);
        setErrors(error.response.data);
      } else {
        console.error('Error deleting item:', error);
      }
    } finally {
      setDeleteModalState({ isOpen: false, index: null });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 dark:bg-gray-800">
      <div className="mx-auto">
        <h2 className="text-2xl font-semibold leading-tight mb-6 dark:text-white text-center">Skills and Interests</h2>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-md shadow-lg border border-gray-200 dark:border-teal-500/30">
          <div className="flex mb-6 bg-gray-100 dark:bg-gray-800 rounded-md p-1">
            {['skills', 'interests'].map(tab => (
              <button
                key={tab}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-teal-400 to-blue-500 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div className="mb-4 flex">
            <input
              type="text"
              value={newItem}
              onChange={handleChange}
              placeholder={`Add new ${activeTab.slice(0, -1)}...`}
              className="flex-grow px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-l-md text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors"
            />
            <button
              onClick={handleAddItem}
              className="bg-gradient-to-r from-teal-400 to-blue-500 text-white px-4 py-2 rounded-r-md hover:from-teal-500 hover:to-blue-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
            >
              <PlusIcon className="h-5 w-5" />
            </button>
          </div>
          {errors.name && (
            <p className="text-red-500 mt-1 text-center mb-2">{errors.name[0]}</p>
          )}
          <ul className="space-y-2">
            {items[activeTab].map((item, index) => (
              <li key={item.id} className="flex items-center bg-gray-50 dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:border-teal-500/50">
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => {
                      const newItems = [...items[activeTab]];
                      newItems[index] = { ...newItems[index], name: e.target.value };
                      setItems({ ...items, [activeTab]: newItems });
                    }}
                    onBlur={() => handleEditItem(index, item.name)}
                    className="flex-grow px-3 py-1 bg-white dark:bg-gray-700 rounded-md text-gray-900 dark:text-white mr-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    autoFocus
                  />
                ) : (
                  <span className="flex-grow text-gray-800 dark:text-gray-200">{item.name}</span>
                )}
                <button
                  onClick={() => setEditingIndex(index)}
                  className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 p-1 transition-colors"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setDeleteModalState({ isOpen: true, index })}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-1 transition-colors"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <ConfirmModal 
        isOpen={deleteModalState.isOpen}
        onConfirm={handleDeleteItem}
        onClose={() => setDeleteModalState({ isOpen: false, index: null })}
        title="Confirm Deletion"
        message={`Are you sure you want to delete the ${activeTab.slice(0, -1)} "${deleteModalState.index !== null ? items[activeTab][deleteModalState.index]?.name : ''}"?`}
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
      />
    </div>
  );
};

export default SkillsAndInterests;