import React, { useState } from 'react';
import logoImg from '../../assets/Logos/Brand and Logo.jpg';
import circleLogoImg from '../../assets/Logos/Circle Logo.png';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { GatewayUrl } from '../../components/const/urls';
import { useDispatch } from 'react-redux';
import { setAdminLogin } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverErrors, setServerErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setServerErrors({});
    setIsLoading(true);
    try {
      const response = await axios.post(`${GatewayUrl}api/admin/login/`, data);
      console.log("Data from response", response.data);
      setServerErrors({});
      dispatch(setAdminLogin(response.data));
      navigate('/admin/dashboard');
    } catch (error) {
      if (error.response && error.response.data) {
        setServerErrors(error.response.data);
        console.log("Server errors ------->", error.response.data);
      } else {
        console.error("Error logging admin", error);
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen dark:bg-gray-900 p-4">
      {/* Background with repeating logos */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-repeat" style={{
          backgroundImage: `url(${circleLogoImg})`,
          backgroundSize: '30px 30px',
          opacity: 0.3,
          transform: 'rotate(-30deg) scale(1.9)',
        }}></div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md z-10 relative">
        <div className="flex flex-col items-center mb-6">
          <img className="h-20 rounded-md max-w-xs mb-2" src={logoImg} alt="Logo" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Wimble Admin</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Admin Portal</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold dark:text-gray-300 mb-2" htmlFor="username">
              <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Username
            </label>
            <input
              className="text-sm w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-300"
              type="text"
              id="username"
              placeholder="Enter your username"
              {...register('username', { required: 'Username is required' })}
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold dark:text-gray-300 mb-2" htmlFor="password">
              <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Password
            </label>
            <input
              className="text-sm w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-300"
              type="password"
              id="password"
              placeholder="Enter your password"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          {serverErrors.non_field_errors && serverErrors.non_field_errors.map((error, index) => (
            <p className="text-sm text-red-500 text-center my-6" key={index}>{error}</p>
          ))}
          <button
            className="w-full bg-gradient-to-r from-teal-400 to-blue-500 dark:from-teal-400 dark:to-blue-500 text-white py-2 rounded-md hover:opacity-90 transition-opacity duration-300 flex items-center justify-center"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            )}
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Admin access only. If you're a regular user,{' '}
            <a onClick={() => navigate('/login')} className="text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300 cursor-pointer">
              login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;