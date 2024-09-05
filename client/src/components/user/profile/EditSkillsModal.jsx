import React, { useState, useEffect } from 'react';
import { PencilIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';
import Buttons from '../misc/Buttons';
import { GatewayUrl } from '../../const/urls';
import axios from 'axios';
import createAxiosInstance from '../../../api/axiosInstance';
import { useSelector } from 'react-redux';

const EditSkillsModal = ({ isOpen, onClose, initialUserSkills }) => {
  const [userSkills, setUserSkills] = useState(initialUserSkills);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);
  const userId = useSelector(state => state.auth.userId);
  const token = useSelector(state => state.auth.userAccess);

  useEffect(() => {
    setUserSkills(initialUserSkills);
  }, [initialUserSkills]);

  useEffect(() => {
    const fetchAvailableSkills = async () => {
      try {
        const response = await axios.get(`${GatewayUrl}/api/skills/`);
        console.log("Available Skills", response.data);
        setAvailableSkills(response.data);
      } catch (error) {
        console.error('Error fetching available skills:', error);
      }
    };
    fetchAvailableSkills();
  }, []);

  const handleAddSkill = async (newSkill) => {
    if (!userSkills.some(userSkill => userSkill.id === newSkill.id)) {
      try {
        const axiosInstance = createAxiosInstance(token);
        const response = await axiosInstance.post(`${GatewayUrl}/api/users/${userId}/skills/`, { skill: newSkill.id });
        console.log('Response:', response.data);
        setUserSkills([ response.data, ...userSkills]);
        setSearchTerm('');
        setShowSearchBar(false);
      } catch (error) {
        console.error('Error adding skill:', error);
      }
    }
  };

  const handleRemoveSkill = async (userSkillToRemove) => {
    try {
      const axiosInstance = createAxiosInstance(token);
      await axiosInstance.delete(`${GatewayUrl}/api/user-skills/${userSkillToRemove.id}/`);
      setUserSkills(userSkills.filter(userSkill => userSkill.id !== userSkillToRemove.id));
    } catch (error) {
      console.error('Error removing skill:', error);
    }
  };

  const handleClose = () => {
    onClose(userSkills);
    setShowSearchBar(false);
    setSearchTerm('');
  };

  const filteredSkills = availableSkills.filter(skill => 
    skill.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !userSkills.some(userSkill => userSkill.skill === skill.id)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Skills</h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-100">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          {!showSearchBar && (
            <button
              onClick={() => setShowSearchBar(true)}
              className="w-full flex items-center justify-center text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-4 p-2 border border-blue-500 dark:border-blue-400 rounded"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Skill
            </button>
          )}
          
          {showSearchBar ? (
            <div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for a skill..."
                className="w-full p-2 border rounded mb-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              />
              <ul className="max-h-60 overflow-y-auto">
                {filteredSkills.map((skill) => (
                  <li
                    key={skill.id}
                    onClick={() => handleAddSkill(skill)}
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 text-gray-900 dark:text-white"
                  >
                    {skill.name}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div>
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Current Skills:</h4>
              <ul>
                {userSkills.map((userSkill) => (
                  <li key={userSkill.id} className="flex justify-between items-center mb-2 text-gray-900 dark:text-white">
                    {userSkill.skill_name}
                    <button 
                      onClick={() => handleRemoveSkill(userSkill)} 
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
          <button 
            onClick={handleClose}
            className={Buttons.tealBlueGradientButton}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSkillsModal;