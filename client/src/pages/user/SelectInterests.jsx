import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GatewayUrl } from '../../components/const/urls';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import Colors from '../../components/user/misc/Colors';
import Buttons from '../../components/user/misc/Buttons';
import createAxiosInstance from '../../api/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { setUserLogin } from '../../redux/authSlice';

const SelectInterests = ({ token }) => {
  const [interests, setInterests] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.userId);
  const location = useLocation();
  const { response } = location.state || {};
  const dispatch = useDispatch();

  useEffect(() => {
    if (response) {
        console.log("response from select interests", response);
      dispatch(setUserLogin(response));
    } else {
        navigate('/');
    }
  }, [response, dispatch]);

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const response = await axios.get(`${GatewayUrl}api/interests/`);
        setInterests(response.data);
      } catch (error) {
        console.error('Error fetching interests:', error);
      }
    };

    fetchInterests();
  }, []);

  useEffect(() => {
    const fetchUserInterests = async () => {
      try {
        const response = await axios.get(`${GatewayUrl}api/users/${userId}/interests/`);
        console.log('User Interests:', response.data);
        if (response.data.length > 0) {
            navigate('/');
        }
      } catch (error) {
        console.error('Error fetching user interests:', error);
      }
    };

    fetchUserInterests();
  }, [userId]);

  const handleInterestToggle = (interest) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleContinue = () => {
    if (selectedInterests.length >= 3) {
    try {
      const axiosInstance = createAxiosInstance(token);
      console.log("Selected Interests:", selectedInterests);
      axiosInstance.post(`${GatewayUrl}api/users/${userId}/interests-batch/`, {
        interests: selectedInterests,
      });
      navigate('/');
    } catch (error) {
      console.error("Error saving interests:", error);
    }
    }
  };

  const filteredInterests = interests.filter(interest =>
    interest.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] bg-gray-100 dark:bg-black">
    <div className="max-w-5xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md transition-all duration-300 ease-in-out transform">
      <h2 className={`text-3xl font-bold ${Colors.tealBlueGradientText} mb-6 text-center`}>
        Choose Your Interests
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
        Select at least 3 interests to personalize your experience
      </p>
      
      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search interests"
          className="w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
        {filteredInterests.map((interest) => (
          <button
            key={interest.id}
            onClick={() => handleInterestToggle(interest)}
            className={`px-3 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              selectedInterests.includes(interest)
                ? Colors.tealBlueGradientButton + ' text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {interest.name}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {selectedInterests.length} selected
        </p>
        <button
          onClick={handleContinue}
          disabled={selectedInterests.length < 3}
          className={`${Buttons.tealBlueGradientButton} px-6 py-2 rounded-md flex items-center text-sm ${
            selectedInterests.length < 3 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Continue
          <ChevronRightIcon className="h-4 w-4 ml-2" />
        </button>
      </div>
    </div>
    </div>
  );
};

export default SelectInterests;