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
  const [editingItem, setEditingItem] = useState(null);
  const token = useSelector(state => state.auth.adminAccess);
  const [errors, setErrors] = useState({});
  const [deleteModalState, setDeleteModalState] = useState({ isOpen: false, item: null });

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
        setItems(prev => ({ ...prev, [activeTab]: [...prev[activeTab], response.data].sort((a, b) => a.name.localeCompare(b.name)) }));
        setNewItem('');
        setErrors({});
      } catch (error) {
        if (error.response && error.response.data) {
          setErrors(error.response.data);
        } else {
          console.error('Error creating item:', error);
        }
      }
    }
  };

  const handleEditItem = async (item, newName) => {
    try {
      const axiosInstance = createAxiosInstance(token);
      const response = await axiosInstance.patch(`${GatewayUrl}api/${activeTab}/${item.id}/`, { name: newName });
      setItems(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].map(i => i.id === item.id ? response.data : i).sort((a, b) => a.name.localeCompare(b.name))
      }));
      setEditingItem(null);
      setErrors({});
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        console.error('Error editing item:', error);
      }
    }
  };

  const handleDeleteItem = async () => {
    if (!deleteModalState.item) return;

    try {
      const axiosInstance = createAxiosInstance(token);
      await axiosInstance.delete(`${GatewayUrl}api/${activeTab}/${deleteModalState.item.id}/`);
      setItems(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].filter(i => i.id !== deleteModalState.item.id)
      }));
      setErrors({});
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        console.error('Error deleting item:', error);
      }
    } finally {
      setDeleteModalState({ isOpen: false, item: null });
    }
  };

  const groupItemsByLetter = (items) => {
    return items.reduce((acc, item) => {
      const firstLetter = item.name[0].toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(item);
      return acc;
    }, {});
  };

  const renderGroupedItems = (groupedItems) => {
    return Object.entries(groupedItems).sort().map(([letter, items]) => (
      <div key={letter} className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">{letter}</h3>
        <div className="flex flex-wrap gap-2">
          {items.map(item => (
            <div key={item.id} className="group relative">
              {editingItem?.id === item.id ? (
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  onBlur={() => handleEditItem(item, editingItem.name)}
                  className="px-3 py-1 bg-white dark:bg-gray-700 rounded-full text-sm text-gray-900 dark:text-white border border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  autoFocus
                />
              ) : (
                <span className="px-3 py-1 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-full text-sm shadow-sm">
                  {item.name}
                </span>
              )}
              <div className="absolute top-0 right-0 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setEditingItem(item)}
                  className="p-1 bg-yellow-500 rounded-full text-white hover:bg-yellow-600 transition-colors"
                >
                  <PencilIcon className="h-3 w-3" />
                </button>
                <button
                  onClick={() => setDeleteModalState({ isOpen: true, item })}
                  className="p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                >
                  <TrashIcon className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    ));
  };

  const groupedItems = groupItemsByLetter(items[activeTab]);

  return (
    <div className="container mx-auto py-2 ">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold leading-tight mb-6 text-gray-900 dark:text-white text-center">Skills and Interests</h2>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex mb-6 bg-gray-100 dark:bg-gray-800 rounded-md p-1">
            {['skills', 'interests'].map(tab => (
              <button
                key={tab}
                className={`flex-1 py-2 px-4 mx-6 my-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-teal-400 to-blue-500 text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div className="mb-6 flex">
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
          {renderGroupedItems(groupedItems)}
        </div>
      </div>
      <ConfirmModal 
        isOpen={deleteModalState.isOpen}
        onConfirm={handleDeleteItem}
        onClose={() => setDeleteModalState({ isOpen: false, item: null })}
        title="Confirm Deletion"
        message={`Are you sure you want to delete the ${activeTab.slice(0, -1)} "${deleteModalState.item?.name}"?`}
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
      />
    </div>
  );
};

export default SkillsAndInterests;