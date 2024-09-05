import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { GatewayUrl } from '../const/urls';
import createAxiosInstance from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const Users = () => {
  const [users, setUsers] = useState([]);
  const token = useSelector((state) => state.auth.adminAccess);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async (page) => {
      const axiosInstance = createAxiosInstance(token);
      const response = await axiosInstance.get(`${GatewayUrl}api/users/?page=${page}`);
      setUsers(response.data.results.filter(user => !user.is_superuser));
      setTotalPages(Math.ceil(response.data.count / 10));
    };
    fetchData(currentPage);
  }, [token, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = async (id) => {
    try {
      const axiosInstance = createAxiosInstance(token);
      await axiosInstance.delete(`${GatewayUrl}api/users/${id}/`);
      setUsers(users => users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleBlockToggle = async (id) => {
    try {
      const axiosInstance = createAxiosInstance(token);
      const user = users.find((user) => user.id === id);
      const dataToSend = { is_active: !user.is_active };
      await axiosInstance.patch(`${GatewayUrl}api/users/${id}/`, dataToSend);
      setUsers((users) => 
        users.map((user) =>
          user.id === id ? { ...user, is_active: dataToSend.is_active } : user
        )
      );
    } catch (error) {
      console.error('Error blocking/unblocking user:', error);
    }
  };


  return (
    <div className="container mx-auto px-4 py-2 ">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold leading-tight text-gray-900 dark:text-white text-center flex-grow">
          Users
        </h2>
        <button 
        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white font-semibold py-2 px-4 rounded-lg shadow ml-auto"
        onClick={() => navigate('/admin/users/reports')}>
          Reports
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user.id} className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
            <div className="p-5">
              <div className="flex items-center mb-4">
                {user.profile ? (
                  <img className="w-12 h-12 rounded-full mr-4 object-cover" src={`${GatewayUrl}api/${user.profile}`} alt="" />
                ) : (
                  <img className="w-12 h-12 rounded-full mr-4" src={`https://ui-avatars.com/api/?name=${user.first_name}&background=random`} alt="" />
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{user.first_name} {user.last_name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Username:</span> {user.username}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Account Tier:</span> {user.account_tier}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Joined On:</span> {new Date(user.date_joined).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  user.is_active ? 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-white' : 'bg-red-200 text-red-800 dark:bg-red-700 dark:text-white'
                }`}>
                  {user.is_active ? "Active" : "Blocked"}
                </span>
                <div>
                  <button 
                    onClick={() => handleBlockToggle(user.id)}
                    className={`text-sm mr-2 ${
                      user.is_active ? 'text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300' : 'text-teal-600 dark:text-teal-400 hover:text-teal-900 dark:hover:text-teal-300'
                    }`}
                  >
                    {user.is_active ? 'Block' : 'Unblock'}
                  </button>
                  <button 
                    onClick={() => handleDelete(user.id)} 
                    className="text-sm text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
      <button 
          className={`px-4 py-2 rounded ${
            currentPage === 1 
              ? 'bg-gray-100 text-gray-700 dark:text-white dark:bg-gray-700 cursor-not-allowed text-sm font-semibold' 
              : 'bg-gradient-to-r from-teal-400 to-blue-500 hover:bg-gradient-to-r hover:from-teal-400 hover:to-blue-500 text-white text-sm font-semibold shadow-md'
          } mr-2`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2 text-gray-700 dark:text-gray-300 text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <button 
          className={`px-4 py-2 rounded ${
            currentPage === totalPages 
              ? 'bg-gray-100 text-gray-700 dark:text-white dark:bg-gray-700 cursor-not-allowed text-sm font-semibold' 
              : 'bg-gradient-to-r from-teal-400 to-blue-500 hover:bg-gradient-to-r hover:from-teal-400 hover:to-blue-500 text-white text-sm font-semibold shadow-md'
          } ml-2`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Users;