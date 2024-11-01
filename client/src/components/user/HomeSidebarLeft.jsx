import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HomeIcon, UserGroupIcon, GlobeAltIcon, TagIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/solid';
import Colors from './misc/Colors';
import PlusPromotion from './PlusPromotion';
import { useSelector } from 'react-redux';
import Modal from './Modal';

const HomeSidebar = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isUserAuthenticated);

  const handleTeamsClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault(); 
      setIsLoginModalOpen(true); 
    } else {
      navigate('/teams');
    }
  };

  return (
    <div>
      <nav className="bg-white dark:bg-gray-800 p-4 rounded-md">
        <ul className="space-y-4">
          <li className="group">
            <Link to="/" className="flex items-center justify-between p-2 group-hover:bg-teal-100 dark:group-hover:bg-teal-600 dark:text-white rounded-md transition-all duration-200 ease-in-out transform hover:scale-105">
              <div className="flex items-center">
                <HomeIcon className={`h-7 w-7 mr-2 p-1 ${Colors.tealBlueGradientButton} rounded-full`} />
                <span className="dark:text-white">Home</span>
              </div>
            </Link>
          </li>
          <li className="group">
            <Link to="/teams" onClick={handleTeamsClick} className="flex items-center justify-between p-2 group-hover:bg-teal-100 dark:group-hover:bg-teal-600 dark:text-white rounded-md transition-all duration-200 ease-in-out transform hover:scale-105">
              <div className="flex items-center">
                <UserGroupIcon className={`h-7 w-7 mr-2 p-1 ${Colors.tealBlueGradientButton} rounded-full`} />
                <span className="dark:text-white">Teams</span>
              </div>
            </Link>
          </li>
          {!isAuthenticated && (
            <Modal
              isOpen={isLoginModalOpen}
              onClose={() => setIsLoginModalOpen(false)}
              title="Authentication Required"
              message="Please log in to perform this operation."
              primaryButtonText="Log In"
              primaryButtonUrl="/login"
              secondaryButtonText="Cancel"
            />
          )}
          <li className="group">
            <Link to="/communities" className="flex items-center justify-between p-2 group-hover:bg-teal-100 dark:group-hover:bg-teal-600 dark:text-white rounded-md transition-all duration-200 ease-in-out transform hover:scale-105">
              <div className="flex items-center">
                <GlobeAltIcon className={`h-7 w-7 mr-2 p-1 ${Colors.tealBlueGradientButton} rounded-full`} />
                <span className="dark:text-white">Communities</span>
              </div>
            </Link>
          </li>
          <li className="group">
            <Link to="/tags" className="flex items-center justify-between p-2 group-hover:bg-teal-100 dark:group-hover:bg-teal-600 dark:text-white rounded-md transition-all duration-200 ease-in-out transform hover:scale-105">
              <div className="flex items-center">
                <TagIcon className={`h-7 w-7 mr-2 p-1 ${Colors.tealBlueGradientButton} rounded-full`} />
                <span className="dark:text-white">Tags</span>
              </div>
            </Link>
          </li>
          <li className="group">
            <Link to="/about" className="flex items-center justify-between p-2 group-hover:bg-teal-100 dark:group-hover:bg-teal-600 dark:text-white rounded-md transition-all duration-200 ease-in-out transform hover:scale-105">
              <div className="flex items-center">
                <QuestionMarkCircleIcon className={`h-7 w-7 mr-2 p-1 ${Colors.tealBlueGradientButton} rounded-full`} />
                <span className="dark:text-white">About</span>
              </div>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="mt-2 lg:hidden">
        <PlusPromotion />
      </div>
    </div>
  );
};

export default HomeSidebar;
