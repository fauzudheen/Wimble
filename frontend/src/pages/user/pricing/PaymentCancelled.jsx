import React from 'react';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';

const PaymentCancelled = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <div className="text-center">
          <XCircleIcon className="mx-auto h-16 w-16 text-red-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Payment Cancelled
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Your payment was not processed. Don't worry, you can try again anytime.
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow">
            <Link
              to="/pricing"
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Back to Pricing
            </Link>
          </div>
          <div className="text-center">
            <Link
              to="/support"
              className="font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400 dark:hover:text-teal-300"
            >
              Need help? Contact support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelled;