import { Link } from 'react-router-dom';
import Buttons from './misc/Buttons';

const PlusPromotion = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mt-4">
      <h3 className="text-sm md:text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">Upgrade to Premium</h3>
      <p className="text-gray-700 dark:text-gray-300 mb-2 text-xs md:text-sm">
        Unlock exclusive features and enhance your experience with our Plus plan.
      </p>
      <div className="space-y-1 mb-2">
        <div className="flex items-center text-xs md:text-sm">
          <svg className="w-4 h-4 md:w-5 md:h-5 text-teal-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span className="text-gray-700 dark:text-gray-300">All Free Tier features</span>
        </div>
        <div className="flex items-center text-xs md:text-sm">
          <svg className="w-4 h-4 md:w-5 md:h-5 text-teal-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span className="text-gray-700 dark:text-gray-300">Meeting scheduling and management</span>
        </div>
      </div>
      <div className='flex justify-center'>
        <Link to="/pricing" className={`text-xs md:text-sm text-white rounded-md shadow ${Buttons.tealBlueGradientHoverButton}`}>
          Check Out Plans
        </Link>
      </div>
    </div>
  );
};

export default PlusPromotion;
