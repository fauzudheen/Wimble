// ConfirmModal.jsx
import React from 'react';
import Colors from './misc/Colors';
import { Button } from '@headlessui/react';
import Buttons from './misc/Buttons';

const ConfirmModal = ({ isOpen, onClose, title, message, onConfirm, confirmButtonText, cancelButtonText }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className={`${Colors.tealBlueGradientText} text-xl font-bold`}>{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div className="mt-4">
          <p className="text-gray-700 dark:text-gray-300">{message}</p>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md font-medium transition-all duration-200 ease-in-out hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
          >
            {cancelButtonText}
          </button>
          <button
            onClick={onConfirm}
            className={`${Buttons.tealBlueGradientOutlineButton} px-4 py-2 rounded-md font-medium transition-all duration-200 ease-in-out hover:opacity-80`}
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;