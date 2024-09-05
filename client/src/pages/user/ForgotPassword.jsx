import React, { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import axios from 'axios';
import { GatewayUrl } from '../../components/const/urls';
import { useNavigate } from 'react-router-dom';
import logoImg from '../../assets/Logos/Brand and Logo.jpg';
import circleLogoImg from '../../assets/Logos/Circle Logo.png';

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [serverErrors, setServerErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successDialog, setSuccessDialog] = useState('');
  const navigate = useNavigate();
  const [enteredOtp, setEnteredOtp] = useState('');
  const [enteredEmail, setEmail] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${GatewayUrl}api/forgot-password/`, data);
      setEmail(response.data.email);
      setServerErrors({});
      setSuccessDialog(`Otp sent to ${response.data.email}. Please verify.`);
    } catch (error) {
        setServerErrors(error.response?.data || { message: "An error occurred" });
      }
    setIsLoading(false);
  };

  const handleVerifyOtpSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${GatewayUrl}api/reset-password/verify-otp/`, { 
        email: enteredEmail,
        otp: enteredOtp 
      });
      console.log("Response:", response.data);
      setSuccessDialog('Otp verified successfully. Please enter new password.');
      setIsVerified(true);
    } catch (error) {
        console.log("Error:", error);
        setServerErrors(error.response?.data?.message || "Verification failed");
      }
  };

  const handleResetPasswordSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${GatewayUrl}api/reset-password/`, {
        email: enteredEmail,
        password: data.password,
      });
      console.log("Response:", response.data);
      navigate('/login');
    } catch (error) {
        console.log("Error:", error.response);
        setServerErrors(error.response?.data?.message || "Reset failed");
      }
    setIsLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        {/* Background with repeating logos */}
       <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-repeat" style={{
          backgroundImage: `url(${circleLogoImg})`,
          backgroundSize: '30px 30px',
          opacity: 0.3,
          transform: 'rotate(-30deg) scale(1.9)',
        }}></div> 
      </div>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full z-10 max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img className="h-20 rounded-md max-w-xs mb-2" src={logoImg} alt="Logo" />
        {serverErrors.message && <p className="text-red-500">{serverErrors.message}</p>}

          {!successDialog ? (
            <>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Forgot Password</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Enter your email to reset your password</p>
          </>
          ) : isVerified ? (
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Reset Password</h2>
          ) : (
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Verify OTP</h2>
          )}
        </div>
        {successDialog && !isVerified ? (
            <form onSubmit={handleVerifyOtpSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg w-full max-w-sm">
            <div className="text-center">
              <p className="text-sm text-green-500 mb-4">{successDialog}</p>
            </div>
            <div className="grid grid-cols-6 gap-2 mb-6">
              {[...Array(6)].map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  required
                  className="w-full h-10 text-center text-xl rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700"
                  onChange={(e) => {
                    setEnteredOtp((prevOtp) => prevOtp + e.target.value);
                    const nextInput = e.target.nextElementSibling;
                    if (e.target.value.length === 1 && nextInput) {
                      nextInput.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    const prevInput = e.target.previousElementSibling;
                    if (e.key === 'Backspace' && !e.target.value && prevInput) {
                      prevInput.focus();
                    } else if (e.key === 'ArrowLeft' && prevInput) {
                      prevInput.focus();
                    } else if (e.key === 'ArrowRight') {
                      const nextInput = e.target.nextElementSibling;
                      if (nextInput) {
                        nextInput.focus();
                      }
                    }
                  }}
                />
              ))}
            </div>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11V7a3 3 0 016 0v4M5 11h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2zm7 3v3m-3-3h6"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4"/>
                </svg>
            )}
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
          </form>

        ) : isVerified ? (
            <form onSubmit={handleSubmit(handleResetPasswordSubmit)}>
            <div className="text-center">
              <p className="text-sm text-green-500 mb-4">{successDialog}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold dark:text-gray-300 mb-2" htmlFor="password">
                New Password
              </label>
              <input
                className="text-sm w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-300"
                type="password"
                id="password"
                placeholder="Enter new password"
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters long'
                  }
                })}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold dark:text-gray-300 mb-2" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                className="text-sm w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-300"
                type="password"
                id="confirmPassword"
                placeholder="Confirm new password"
                {...register('confirmPassword', { 
                  required: 'Please confirm your password',
                  validate: (value) => value === watch('password') || 'Passwords do not match'
                })}
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11V7a3 3 0 016 0v4M5 11h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2zm7 3v3m-3-3h6"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4"/>
                </svg>
              )}
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
          ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold dark:text-gray-300 mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                className="text-sm w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-300"
                type="email"
                id="email"
                placeholder="Enter your email address"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <button
              className="w-full bg-gradient-to-r from-teal-400 to-blue-500 text-white py-2 rounded-md hover:opacity-90 transition-opacity duration-300 flex items-center justify-center"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {isLoading ? 'Sending...' : 'Reset Password'}
            </button>
          </form>
        )}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;