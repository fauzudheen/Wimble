import React, { useState, useEffect } from 'react';
import { XCircleIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/solid';

const CustomAlert = ({ type = 'info', message, onClose, autoClose = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => setIsVisible(false), autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose]);

  if (!isVisible) return null;

  const getAlertStyle = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-green-400 to-green-600';
      case 'error':
        return 'bg-gradient-to-r from-red-400 to-red-600';
      case 'warning':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      default:
        return 'bg-gradient-to-r from-teal-400 to-blue-500';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-6 h-6 text-white" />;
      case 'error':
        return 
      case 'warning':
        return <ExclamationTriangleIcon className="w-6 h-6 text-white" />;
      default:
        return <InformationCircleIcon className="w-6 h-6 text-white" />;
    }
  };

  return (
    <div className={`fixed top-4 right-4 max-w-sm w-full ${getAlertStyle()} text-white z-50 p-4 rounded-lg shadow-lg flex items-center justify-between transition-all duration-300 ease-in-out transform hover:scale-105`}>
      <div className="flex items-center">
        {getIcon()}
        <span className="ml-3 font-medium">{message}</span>
      </div>
      <button
        onClick={() => {
          setIsVisible(false);
          if (onClose) onClose();
        }}
        className="text-white hover:text-gray-200 transition-colors duration-200"
      >
        <XCircleIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default CustomAlert;