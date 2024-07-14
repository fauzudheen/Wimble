import React from 'react';
import Colors from "../Colors";

const NoContentPage = ({ message , linkText, linkHref }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800 p-4">
      <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        <svg 
          className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
        <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
          Content Not Available
        </h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {message}
        </p>
        <div className="mt-6">
          <a 
            href={linkHref} 
            className={`${Colors.tealBlueGradientText} text-sm font-medium hover:underline`}
          >
            {linkText}
          </a>
        </div>
      </div>
    </div>
  );
};

export default NoContentPage;