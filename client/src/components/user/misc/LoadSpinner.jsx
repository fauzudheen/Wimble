import React from 'react'
import Colors from './Colors';

const LoadSpinner = ({ size = 'medium', text = 'Loading...', fullScreen = false }) => {
    const sizeClasses = {
        small: 'w-8 h-8',
        medium: 'w-16 h-16',
        large: 'w-24 h-24'
      };
    
      const textClasses = {
        small: 'text-sm',
        medium: 'text-base',
        large: 'text-lg'
      };
    
      const containerClasses = fullScreen 
        ? 'fixed inset-0 flex items-center justify-center z-50 bg-white dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75' 
        : 'flex flex-col items-center justify-center p-4';
    
        return (
          <div className={containerClasses}>
            <div className={`relative ${sizeClasses[size]}`}>
              <svg 
                className={`animate-spin ${sizeClasses[size]}`} 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                ></circle>
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <div className={`absolute inset-0 flex items-center justify-center ${Colors.tealBlueGradientText}`}>
                <div className={`animate-pulse ${sizeClasses[size]}`}>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M13 10V3L4 14h7v7l9-11h-7z" 
                    />
                  </svg>
                </div>
              </div>
            </div>
            {text && (
              <p className={`mt-4 ${textClasses[size]} font-semibold text-gray-700 dark:text-gray-300 animate-pulse`}>
                {text}
              </p>
            )}
            <div className="mt-8 space-y-2">
              <div className={`h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${size === 'small' ? 'w-16' : 'w-32'}`}></div>
              <div className={`h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${size === 'small' ? 'w-12' : 'w-24'}`}></div>
            </div>
          </div>
        );
        
    };

export default LoadSpinner


// For a small inline loader
{/* <LoadingSpinner size="small" text="" /> */}

// For a medium-sized loader with custom text
{/* <LoadingSpinner size="medium" text="Fetching data..." /> */}

// For a full-screen large loader
{/* <LoadingSpinner size="large" text="Initializing application..." fullScreen={true} /> */}

