import React, { useState } from 'react';
import DarkModeToggle from '../../components/user/DarkModeToggle';
import logoImg from '../../assets/Logos/Brand and Logo.jpg';
import axios from 'axios';
import { GatewayUrl } from '../../components/const/urls';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserLogin } from '../../redux/authSlice';
import OtpVerification from '../../components/user/OtpVerification';

const Signup = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [serverErrors, setServerErrors] = useState({});
  const [ dataValid, setDataValid ] = useState(false)
  const firstName = register('firstName', { required: 'First name is required' });
  const lastName = register('lastName', { required: 'Last name is required' });
  const username = register('username', { required: 'Username is required' });
  const email = register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } });
  const password = register('password', { required: 'Password is required' });
  const confirmPassword = register('confirmPassword', { required: 'Confirm password is required', validate: value => value === watch('password') || 'Passwords do not match' });
  const [emailToSend, setEmailToSend] = useState('');

  const onSubmit = async (data) => {
    setServerErrors({})
    try {
      const response = await axios.post(`${GatewayUrl}api/signup/`, {
        username: data.username,
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        password: data.password,
      });
      console.log("Data from response", response.data);
      setServerErrors({});
      setDataValid(true)
      setEmailToSend(data.email)
    } catch (error) {
      if (error.response && error.response.data) {
        setServerErrors(error.response.data);
      } else {
        console.error("Error signing up user", error);
      }
    }
  };
    

    const handleVerify = async(otp) => {
      console.log("Verifying OTP:", otp);
      console.log("emailtosend:", emailToSend);
      const data = {
        "email": emailToSend,
        "otp": otp
      }
      try {
        const response = await axios.post(`${GatewayUrl}api/signup/verify-otp/`, data)
        console.log("Data from response", response.data)
        dispatch(setUserLogin(response.data))
        navigate('/home')
      } catch (error) {
        console.error("Error verifying otp", error)
      }
    };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-md shadow-md w-full max-w-3xl">
        <div className="flex justify-center mb-6">
          <img className="h-20 rounded-md max-w-xs" src={logoImg} alt="Logo" />
        </div>
        { dataValid ? (
          <OtpVerification onVerify={handleVerify} />
        ) : (
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-2" htmlFor="first-name">
              First Name
            </label>
            <input
              className="w-full p-2 border dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-300"
              type="text"
              id="first-name"
              placeholder="Enter your first name"
              {...firstName}
            />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
            {serverErrors.first_name && <p className="text-red-500 text-xs mt-1">{serverErrors.first_name[0]}</p>}
          </div>
          <div className="mb-4">
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-2" htmlFor="last-name">
              Last Name
            </label>
            <input
              className="w-full p-2 border dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-300"
              type="text"
              id="last-name"
              placeholder="Enter your last name"
              {...lastName}
            />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
            {serverErrors.last_name && <p className="text-red-500 text-xs mt-1">{serverErrors.last_name[0]}</p>}
          </div>
          <div className="mb-4">
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-2" htmlFor="username">
              Username
            </label>
            <input
              className="w-full p-2 border dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-300"
              type="text"
              id="username"
              placeholder="Enter your username"
              {...username}
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
            {serverErrors.username && <p className="text-red-500 text-xs mt-1">{serverErrors.username[0]}</p>}
          </div>
          <div className="mb-4">
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="w-full p-2 border dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-300"
              type="email"
              id="email"
              placeholder="Enter your email"
              {...email}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            {serverErrors.email && <p className="text-red-500 text-xs mt-1">{serverErrors.email[0]}</p>}
          </div>
          <div className="mb-4">
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="w-full p-2 border dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-300"
              type="password"
              id="password"
              placeholder="Enter your password"
              {...password}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            {serverErrors.password && serverErrors.password.map((error, index) => <p className="text-red-500 text-xs mt-1" key={index}>{error}</p>)}
          </div>
          <div className="mb-4">
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-2" htmlFor="confirm-password">
              Confirm Password
            </label>
            <input
              className="w-full p-2 border dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-300"
              type="password"
              id="confirm-password"
              placeholder="Confirm your password"
              {...confirmPassword}
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>
          <div className="col-span-1 md:col-span-2 flex justify-center">
            <button
              className="w-full md:w-2/5 bg-gradient-to-r from-teal-400 to-blue-500 dark:from-teal-400 dark:to-blue-500 text-white py-2 rounded-md hover:opacity-90 transition-opacity duration-300"
              type="submit"
            >
              Signup
            </button>
          </div>
        </form>
        )}
        
      </div>
    </div>
  );
}

export default Signup;
