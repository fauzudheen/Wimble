import React, { useState } from 'react';
import DarkModeToggle from '../../components/user/DarkModeToggle';
import logoImg from '../../assets/Logos/Brand and Logo.jpg';
import circleLogoImg from '../../assets/Logos/Circle Logo.png';
import axios from 'axios';
import { GatewayUrl } from '../../components/const/urls';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserLogin } from '../../redux/authSlice';
import OtpVerification from '../../components/user/OtpVerification';

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
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
    setIsLoading(false);
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
        navigate('/select-interests', {state: {response: response.data}});
        console.log("---------------------OTP VERIFIED---------------------")
      } catch (error) {
        console.error("Error verifying otp", error)
      }
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
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Wimble</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Your Professional Tech Network</p>
        </div>
        { dataValid ? (
          <OtpVerification onVerify={handleVerify} />
        ) : (
          <form className="grid grid-cols-1 md:grid-cols-2 gap-2" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-2" htmlFor="first-name">
              First Name
            </label>
            <input
              className="text-sm w-full p-2 border dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-300"
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
              className="text-sm w-full p-2 border dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-300"
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
              className="text-sm w-full p-2 border dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-300"
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
              className="text-sm w-full p-2 border dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-300"
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
              className="text-sm w-full p-2 border dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-300"
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
              className="text-sm w-full p-2 border dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-300"
              type="password"
              id="confirm-password"
              placeholder="Confirm your password"
              {...confirmPassword}
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>
          <div className="col-span-1 md:col-span-2 flex justify-center">
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            )}
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </button>
          </div>
        </form>
        )}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <a onClick={() => navigate('/login')} className="text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300 cursor-pointer">
              Log in here
            </a>
          </p>
        </div>
        
      </div>
    </div>
  );
}

export default Signup;
