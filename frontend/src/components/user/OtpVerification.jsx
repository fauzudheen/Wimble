import React, { useState, useRef, useEffect } from 'react';

const OtpVerification = ({ onVerify }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0].focus();
  }, []);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = () => {
    if (otp.every(digit => digit !== '')) {
      onVerify(otp.join(''));
    }
  };

  return (
    <div className="flex items-center justify-center dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Verify Your Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            We've sent a code to your email. Please enter it below.
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between space-x-2">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  ref={el => inputRefs.current[index] = el}
                  value={data}
                  onChange={e => handleChange(e.target, index)}
                  onKeyDown={e => handleKeyDown(e, index)}
                  maxLength={1}
                  className="w-12 h-12 sm:w-14 sm:h-14 text-center text-2xl font-semibold 
                             border-2 border-gray-300 rounded-lg 
                             focus:border-teal-500 focus:ring-2 focus:ring-teal-200 
                             dark:bg-gray-800 dark:border-gray-600 dark:text-white 
                             dark:focus:border-teal-400 dark:focus:ring-teal-300
                             transition duration-200 ease-in-out"
                />
              ))}
            </div>
            <button
              onClick={handleSubmit}
              className="group relative w-full flex justify-center py-3 px-4 
                         border border-transparent text-sm font-medium rounded-md 
                         text-white bg-teal-600 hover:bg-teal-700 
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500
                         dark:bg-teal-500 dark:hover:bg-teal-600 
                         dark:focus:ring-offset-gray-900 transition duration-150 ease-in-out"
            >
              Verify
            </button>
          </div>
          <div className="text-center">
            <a href="#" className="font-medium text-teal-600 hover:text-teal-500 
                                   dark:text-teal-400 dark:hover:text-teal-300
                                   transition duration-150 ease-in-out">
              Didn't receive a code? Resend
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;