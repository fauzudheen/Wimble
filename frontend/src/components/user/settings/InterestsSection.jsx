// InterestsSection.js
import React, { useState, useEffect } from "react";
import Buttons from "../misc/Buttons";
import axios from "axios";
import { GatewayUrl } from "../../const/urls";
import { useSelector } from "react-redux";
import createAxiosInstance from "../../../api/axiosInstance";

const InterestsSection = () => {
  const [editing, setEditing] = useState(false);
  const [userInterests, setUserInterests] = useState([]);
  const [availableInterests, setAvailableInterests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const token = useSelector((state) => state.auth.userAccess);
  const userId = useSelector((state) => state.auth.userId);

  useEffect(() => {
    const fetchUserInterests = async () => {
      try {
        const response = await axios.get(`${GatewayUrl}api/users/${userId}/interests/`);
        setUserInterests(response.data);
      } catch (error) {
        console.error("Error fetching user interests:", error);
      }
    }

    const fetchAvailableInterests = async () => {
      try {
        const response = await axios.get(`${GatewayUrl}api/interests/`);
        setAvailableInterests(response.data);
      } catch (error) {
        console.error("Error fetching available interests:", error);
      }
    }
    fetchUserInterests();
    fetchAvailableInterests();
   
  }, [userId, token]);

  const handleAddInterest = async (newInterest) => {
    if (!userInterests.some(userInterest => userInterest.interest === newInterest.id)) {
      try {
        const axiosInstance = createAxiosInstance(token);
        const response = await axiosInstance.post(`${GatewayUrl}api/users/${userId}/interests/`, {
          interest: newInterest.id
        });
        console.log("Interest saved successfully");
        setUserInterests([...userInterests, response.data]);
      } catch (error) {
        console.error("Error saving interests:", error);
      }
    }
  };

  const handleRemoveInterest = async(interest) => {
    try {
      const axiosInstance = createAxiosInstance(token);
      await axiosInstance.delete(`${GatewayUrl}api/user-interests/${interest.id}/`);
      console.log("Interest removed successfully");
      setUserInterests(userInterests.filter(i => i.id !== interest.id));
    } catch (error) {
      console.error("Error removing interest:", error);
    }
  };


  const filteredInterests = availableInterests.filter(
    interest => interest.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
    !userInterests.some(userInterest => userInterest.interest === interest.id)
  );

  return (
    <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Interests</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
          Your interests will be used to personalize your feed.
        </p>
        <div className="mt-5">
          {editing ? (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                {userInterests.map((interest) => (
                  <span
                    key={interest.id}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-teal-500 to-blue-500 text-white dark:bg-gradient-to-r dark:from-teal-500 dark:to-blue-500"
                  >
                    {interest.interest_name}
                    <button
                      onClick={() => handleRemoveInterest(interest)}
                      className="ml-2 text-white hover:text-gray-200"
                      aria-label={`Remove ${interest.interest_name}`}
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              <div className="mb-4">
                <label htmlFor="interest-search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search and Add Interests:
                </label>
                <input
                  type="text"
                  id="interest-search"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Search interests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {filteredInterests.map((interest) => (
                    <button
                      key={interest.id}
                      onClick={() => handleAddInterest(interest)}
                      className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    >
                      {interest.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-blue-500 rounded-md hover:from-teal-600 hover:to-blue-600"
                >
                  Save
                </button>
              </div>
            </>
          ) : (
            <div className="flex justify-between items-center flex-wrap">
              <div className="flex flex-wrap gap-2">
                {userInterests.map((interest) => (
                  <span
                    key={interest.id}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-teal-500 to-blue-500 text-white dark:bg-gradient-to-r dark:from-teal-500 dark:to-blue-500"
                  >
                    {interest.interest_name}
                  </span>
                ))}
              </div>
              <button
                onClick={() => setEditing(true)}
                className="mt-2 sm:mt-0 text-sm text-teal-600 hover:text-teal-500 dark:text-teal-400 dark:hover:text-teal-300"
              >
                Edit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterestsSection;