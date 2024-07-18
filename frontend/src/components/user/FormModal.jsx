// FormModal.jsx
import React, { useState } from 'react';
import Buttons from './misc/Buttons';
import Colors from './misc/Colors';

const FormModal = ({ isOpen, onClose, title, fields, onSubmit, submitButtonText = "Submit" }) => {
  const [formData, setFormData] = useState({});

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({});
    onClose();
  };

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
        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div key={field.name} className="mt-4">
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {field.label}:
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-2 shadow-sm focus:border-blue-400 dark:focus:border-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none p-2"
                  rows="4"
                  required={field.required}
                ></textarea>
              ) : (
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md  border-2 shadow-sm focus:border-blue-400 dark:focus:border-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none p-2"
                  required={field.required}
                />
              )}
            </div>
          ))}
          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border text-sm border-gray-300 rounded-md font-medium transition-all duration-200 ease-in-out hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={Buttons.tealBlueGradientButton}
            >
              {submitButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormModal;