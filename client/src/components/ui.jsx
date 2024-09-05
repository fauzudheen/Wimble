import React from 'react';

export const Card = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg shadow ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ children, className = '' }) => (
  <div className={`p-4 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold ${className}`}>
    {children}
  </h3>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`p-4 pt-0 ${className}`}>
    {children}
  </div>
);

export const Alert = ({ children, className = '' }) => (
  <div className={`bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-500 text-blue-700 dark:text-blue-200 p-4 ${className}`} role="alert">
    {children}
  </div>
);

export const AlertTitle = ({ children, className = '' }) => (
  <p className={`font-bold ${className}`}>{children}</p>
);

export const Progress = ({ value, className = '' }) => (
  <div className={`w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 ${className}`}>
    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${value}%` }}></div>
  </div>
);

export const Avatar = ({ children, className = '' }) => (
  <div className={`relative inline-block h-10 w-10 rounded-full overflow-hidden bg-gray-100 ${className}`}>
    {children}
  </div>
);

export const AvatarImage = ({ src, alt = '' }) => (
  <img className="h-full w-full object-cover" src={src} alt={alt} />
);

export const AvatarFallback = ({ children }) => (
  <div className="flex h-full w-full items-center justify-center bg-gray-300 text-gray-600">
    {children}
  </div>
);


// Input Component
export const Input = ({ type = 'text', placeholder = '', className = '', ...props }) => (
  <input
    type={type}
    placeholder={placeholder}
    className={`border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${className}`}
    {...props}
  />
);

// Textarea Component
export const Textarea = ({ placeholder = '', className = '', ...props }) => (
  <textarea
    placeholder={placeholder}
    className={`border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${className}`}
    {...props}
  />
);

// Switch Component
export const Switch = ({ checked, onChange, className = '' }) => (
  <label className={`inline-flex items-center cursor-pointer ${className}`}>
    <input
      type="checkbox"
      className="sr-only"
      checked={checked}
      onChange={onChange}
    />
    <div className="relative">
      <div className={`block w-14 h-8 rounded-full ${checked ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
      <div
        className={`absolute left-1 top-1 w-6 h-6 rounded-full transition-transform duration-200 ease-in-out ${checked ? 'transform translate-x-full bg-blue-500' : 'bg-white'}`}
      ></div>
    </div>
  </label>
);

// Button Component
export const Button = ({ children, className = '', ...props }) => (
  <button
    className={`bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const AlertDescription = ({ children, className = '' }) => (
  <p className={`mt-1 ${className}`}>{children}</p>
);


export const AlertDialog = ({ isOpen, onClose, title, description }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 z-10">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2">{description}</p>
        <div className="mt-4 flex justify-end">
          <button className="bg-blue-600 text-white py-2 px-4 rounded-lg" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};


export const AlertDialogAction = ({ children, className = '', onClick }) => (
  <button
    className={`bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);


export const Chip = ({ children, className = '', selected = false }) => (
  <span
    className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium ${
      selected
        ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white'
        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
    } ${className}`}
  >
    {children}
  </span>
);