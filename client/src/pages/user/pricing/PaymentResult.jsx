import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, ExclamationCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { GatewayUrl } from '../../../components/const/urls';
import createAxiosInstance from '../../../api/axiosInstance';

const PaymentResult = () => {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const token = useSelector((state) => state.auth.userAccess);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const axiosInstance = createAxiosInstance(token);
        const response = await axiosInstance.get(`${GatewayUrl}api/payments/check-payment-status/`);
        if (response.data.status !== 'pending') {
          setStatus(response.data.status);
          setMessage(response.data.message);
        } else {
          // If status is still pending, poll again after 5 seconds
          setTimeout(checkPaymentStatus, 5000);
        }
      } catch (error) {
        console.error('Error fetching payment status:', error);
        setStatus('error');
        setMessage('An error occurred while checking your payment status.');
      }
    };

    checkPaymentStatus();
  }, [token]);

  const renderIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="h-20 w-20 text-green-500" />;
      case 'refunded':
        return <ExclamationCircleIcon className="h-20 w-20 text-yellow-500" />;
      case 'failed':
      case 'error':
        return <ExclamationCircleIcon className="h-20 w-20 text-red-500" />;
      default:
        return <ArrowPathIcon className="h-20 w-20 text-blue-500 animate-spin" />;
    }
  };

  const renderTitle = () => {
    switch (status) {
      case 'success':
        return 'Payment Successful!';
      case 'refunded':
        return 'Payment Refunded';
      case 'failed':
      case 'error':
        return 'Payment Error';
      default:
        return 'Processing Payment...';
    }
  };

  const renderContent = () => {
    return (
      <div className="text-center">
        <div className="flex justify-center mb-4">{renderIcon()}</div>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
          {renderTitle()}
        </h2>
        <p className="text-base text-gray-600 dark:text-gray-300 mb-6">{message}</p>
        <div className="flex flex-col space-y-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-[90vh] bg-gray-100 dark:bg-black flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-lg px-6 py-8 transform transition-all duration-500 ease-in-out">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;
