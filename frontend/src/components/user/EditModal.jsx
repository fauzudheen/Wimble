import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import createAxiosInstance from '../../api/axiosInstance';

const EditModal = ({ onClose, endpoint, initialData, title }) => {
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false); // Initialize loading state to false initially
  const [error, setError] = useState(null);
  const token = useSelector(state => state.auth.userAccess);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true); 
      const axiosInstance = createAxiosInstance(token);
      const response = await axiosInstance.patch(endpoint, formData);
      console.log(response.data);
      setLoading(false); 
      onClose();
    } catch (err) {
      setError('Failed to update');
      setLoading(false); 
    }
  };

  const determineRows = (content) => {
    const lines = content.split('\n').length;
    return lines < 5 ? 5 : lines; // Minimum 5 rows, more if the content has more lines
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">{title}</h2>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.keys(initialData).map(key => (
            <div key={key}>
              <label htmlFor={key} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{key}</label>
              {typeof formData[key] === 'string' && formData[key].length > 50 ? (
                <textarea
                  id={key}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  rows={determineRows(formData[key])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              ) : (
                <input
                  type="text"
                  id={key}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              )}
            </div>
          ))}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
