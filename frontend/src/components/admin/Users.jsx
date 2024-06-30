import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { GatewayUrl } from '../const/urls';
import createAxiosInstance from '../../api/axiosInstance';
import { useSelector } from 'react-redux';

const Users = () => {
  const [users, setUsers] = useState([]);
  const token = useSelector((state) => state.auth.adminAccess);
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    console.log("useEffect works")
    console.log("current page", currentPage)
    const fetchData = async(page) => {
        const axiosInstance = createAxiosInstance(token);
        console.log("admin Access", token)
        const response = await axiosInstance.get(`${GatewayUrl}api/users/?page=${page}`)
        console.log(response.data)
        setUsers(response.data.results)
        setTotalPages(Math.ceil(response.data.count / 10));
    };
    fetchData(currentPage);
  }, [token, currentPage])

  const handlePageChange = (page) => {
    setCurrentPage(page);
  }

  return (
    <div className="container mx-auto px-4 dark:bg-gray-800">
      <div className="py-8">
        <h2 className="text-2xl font-semibold leading-tight mb-4 dark:text-white">Users</h2>
        
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <div className="w-full sm:w-auto relative">
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full px-4 py-2 border rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current text-gray-500 dark:text-gray-400">
                <path d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z"></path>
              </svg>
            </span>
          </div>
        </div>
        
        <div className="hidden sm:block overflow-x-auto bg-white dark:bg-gray-900 rounded-lg shadow">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Account Tier
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Joined On
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-10 h-10">
                        <img className="w-full h-full rounded-full" src={`https://ui-avatars.com/api/?name=${user.first_name}&background=random`} alt="" />
                      </div>
                      <div className="ml-3">
                        <p className="text-gray-900 dark:text-white whitespace-no-wrap">{user.first_name} {user.last_name}</p>
                        <p className="text-gray-600 dark:text-gray-400 whitespace-no-wrap">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm">
                    <p className="text-gray-900 dark:text-white whitespace-no-wrap">{user.username}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm">
                    <p className="text-gray-900 dark:text-white whitespace-no-wrap">{user.account_tier}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm">
                    <p className="text-gray-900 dark:text-white whitespace-no-wrap">{user.date_joined}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm">
                    <p className="text-gray-900 dark:text-white whitespace-no-wrap">{user.is_superuser ? "Admin" : "User"}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm">
                    <span className={`relative inline-block px-3 py-1 font-semibold ${
                      user.is_active === true 
                        ? 'text-green-900 dark:text-green-200' 
                        : 'text-red-900 dark:text-red-200'
                    } leading-tight`}>
                      <span aria-hidden className={`absolute inset-0 ${
                        user.is_active === true
                          ? 'bg-green-200 dark:bg-green-700'
                          : 'bg-red-200 dark:bg-red-700'
                      } opacity-50 rounded-full`}></span>
                      <span className="relative">{user.is_active ? "Active" : "Blocked"}</span>
                    </span>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm">
                    <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-2">Edit</button>
                    <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sm:hidden space-y-4">
  {users.map((user) => (
    <div key={user.id} className="bg-white dark:bg-gray-900 rounded-lg shadow p-4">
      <div className="flex items-center mb-3">
        <img className="w-10 h-10 rounded-full mr-3" src={`https://ui-avatars.com/api/?name=${user.first_name}&background=random`} alt="" />
        <div>
          <p className="text-gray-900 dark:text-white font-semibold">{user.first_name} {user.last_name}</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{user.email}</p>
        </div>
      </div>
      <div className="mb-2">
        <span className="text-gray-600 dark:text-gray-400 text-sm">Username:</span>
        <span className="ml-2 text-gray-900 dark:text-white">{user.username}</span>
      </div>
      <div className="mb-2">
        <span className="text-gray-600 dark:text-gray-400 text-sm">Account Tier:</span>
        <span className="ml-2 text-gray-900 dark:text-white">{user.account_tier}</span>
      </div>
      <div className="mb-2">
        <span className="text-gray-600 dark:text-gray-400 text-sm">Joined On:</span>
        <span className="ml-2 text-gray-900 dark:text-white">{user.date_joined}</span>
      </div>
      <div className="mb-2">
        <span className="text-gray-600 dark:text-gray-400 text-sm">Role:</span>
        <span className="ml-2 text-gray-900 dark:text-white">{user.is_superuser ? "Admin" : "User"}</span>
      </div>
      <div className="mb-3">
        <span className="text-gray-600 dark:text-gray-400 text-sm">Status:</span>
        <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          user.is_active 
            ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200' 
            : 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-200'
        }`}>
          {user.is_active ? "Active" : "Blocked"}
        </span>
      </div>
      <div className="flex justify-end">
        <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-2">Edit</button>
        <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">Delete</button>
      </div>
    </div>
  ))}
</div>
<div className="mt-4 flex justify-center">
          <button 
            className={`px-3 py-1 rounded ${
              currentPage === 1 ? 'bg-gray-300 dark:bg-gray-700' : 'bg-blue-500 dark:bg-blue-700'
            } text-white`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="mx-2 text-gray-700 dark:text-gray-300">{currentPage} / {totalPages}</span>
          <button 
            className={`px-3 py-1 rounded ${
              currentPage === totalPages ? 'bg-gray-300 dark:bg-gray-700' : 'bg-blue-500 dark:bg-blue-700'
            } text-white`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
</div>
</div>
  );
};

export default Users;