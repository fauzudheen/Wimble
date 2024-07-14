import React, { useState } from 'react'
import logoImg from '../../assets/Logos/Brand and Logo.jpg';
import circleLogoImg from '../../assets/Logos/Circle Logo.png';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { GatewayUrl } from '../../components/const/urls';
import { useDispatch } from 'react-redux';
import { setUserLogin } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverErrors, setServerErrors] = useState({});
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const username = register('username', { required: 'Username is required' });
  const password = register('password', { required: 'Password is required' });

  const onSubmit = async(data) => {
    const dataToSend = {
      username: data.username,
      password: data.password
    }
    try{
      const response = await axios.post(`${GatewayUrl}api/login/`, dataToSend)
      console.log("Data from response", response.data);
      setServerErrors({})
      dispatch(setUserLogin(response.data))
      navigate('/home')
    } catch (error) {
      if (error.response && error.response.data) {
        setServerErrors(error.response.data)
        console.log(serverErrors)
      } else {
        console.error("Error logging user", error)
      }
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen dark:bg-gray-900">
       {/* Background with repeating logos */}
       <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-repeat" style={{
          backgroundImage: `url(${circleLogoImg})`,
          backgroundSize: '30px 30px',
          opacity: 0.3,
          transform: 'rotate(-30deg) scale(1.9)',
        }}></div> 
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-md shadow-md w-full max-w-md z-10 relative">
        <div className="flex justify-center mb-6">
          <img className="h-20 rounded-md max-w-xs" src={logoImg} alt="Logo" />
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold dark:text-gray-300 mb-2" htmlFor="email">
              Username
            </label>
            <input
              className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-300"
              type="text"
              id="username"
              placeholder="Enter your username"
              {...username}
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold dark:text-gray-300 mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-300"
              type="password"
              id="password"
              placeholder="Enter your password"
              {...password}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
            {serverErrors.non_field_errors && serverErrors.non_field_errors.map((error, index) => <p className="text-red-500 text-center my-6" key={index}>{error}</p>)}
          <button
            className="w-full bg-gradient-to-r from-teal-400 to-blue-500 dark:from-teal-400 dark:to-blue-500 text-white py-2 rounded-md hover:opacity-90 transition-opacity duration-300"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
