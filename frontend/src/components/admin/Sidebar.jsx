import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ChartBarIcon, UsersIcon, UserGroupIcon, GlobeAltIcon, 
  DocumentTextIcon, AcademicCapIcon, CurrencyRupeeIcon, ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/solid';
import logoImg from '../../assets/Logos/Brand and Logo.jpg';
import { useDispatch } from 'react-redux';
import { setAdminLogout } from '../../redux/authSlice';
import Colors from '../user/misc/Colors';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(setAdminLogout());
  }

  return (
    <aside
      className={`fixed top-0 left-0 z-40 bg-white dark:bg-gray-900 w-64 h-screen shadow-md p-4 transform transition-transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}
    >
      <div className='flex items-center justify-center'>
        <img src={logoImg} className='h-16 rounded-md' alt='Brand Logo' />
      </div>
      <nav className="mt-10 space-y-4">
        <Link
          to="/admin/dashboard"
          className="flex items-center p-2 text-gray-600 dark:text-gray-400 group hover:bg-teal-100 dark:hover:bg-teal-600 rounded-md transition-all duration-200 ease-in-out transform hover:scale-105"
        >
          <ChartBarIcon className={`h-7 w-7 mr-2 p-1 ${Colors.tealBlueGradientButton} rounded-full`} />
          <span className="ml-2 group-hover:text-black dark:group-hover:text-white">Dashboard</span>
        </Link>
        <Link
          to="/admin/users"
          className="flex items-center p-2 text-gray-600 dark:text-gray-400 group hover:bg-teal-100 dark:hover:bg-teal-600 rounded-md transition-all duration-200 ease-in-out transform hover:scale-105"
        >
          <UsersIcon className={`h-7 w-7 mr-2 p-1 ${Colors.tealBlueGradientButton} rounded-full`} />
          <span className="ml-2 group-hover:text-black dark:group-hover:text-white">Manage Users</span>
        </Link>
        <Link
          to="/admin/teams"
          className="flex items-center p-2 text-gray-600 dark:text-gray-400 group hover:bg-teal-100 dark:hover:bg-teal-600 rounded-md transition-all duration-200 ease-in-out transform hover:scale-105"
        >
          <UserGroupIcon className={`h-7 w-7 mr-2 p-1 ${Colors.tealBlueGradientButton} rounded-full`} />
          <span className="ml-2 group-hover:text-black dark:group-hover:text-white">Manage Teams</span>
        </Link>
        <Link
          to="/admin/communities"
          className="flex items-center p-2 text-gray-600 dark:text-gray-400 group hover:bg-teal-100 dark:hover:bg-teal-600 rounded-md transition-all duration-200 ease-in-out transform hover:scale-105"
        >
          <GlobeAltIcon className={`h-7 w-7 mr-2 p-1 ${Colors.tealBlueGradientButton} rounded-full`} />
          <span className="ml-2 group-hover:text-black dark:group-hover:text-white">Manage Communities</span>
        </Link>
        <Link
          to="/admin/articles"
          className="flex items-center p-2 text-gray-600 dark:text-gray-400 group hover:bg-teal-100 dark:hover:bg-teal-600 rounded-md transition-all duration-200 ease-in-out transform hover:scale-105"
        >
          <DocumentTextIcon className={`h-7 w-7 mr-2 p-1 ${Colors.tealBlueGradientButton} rounded-full`} />
          <span className="ml-2 group-hover:text-black dark:group-hover:text-white">Manage Articles</span>
        </Link>
        <Link
          to="/admin/skills-and-interests"
          className="flex items-center p-2 text-gray-600 dark:text-gray-400 group hover:bg-teal-100 dark:hover:bg-teal-600 rounded-md transition-all duration-200 ease-in-out transform hover:scale-105"
        >
          <AcademicCapIcon className={`h-7 w-7 mr-2 p-1 ${Colors.tealBlueGradientButton} rounded-full`} />
          <span className="ml-2 group-hover:text-black dark:group-hover:text-white">Skills and Interests</span>
        </Link>
        <Link
          to="/admin/pricing"
          className="flex items-center p-2 text-gray-600 dark:text-gray-400 group hover:bg-teal-100 dark:hover:bg-teal-600 rounded-md transition-all duration-200 ease-in-out transform hover:scale-105"
        >
          <CurrencyRupeeIcon className={`h-7 w-7 mr-2 p-1 ${Colors.tealBlueGradientButton} rounded-full`} />
          <span className="ml-2 group-hover:text-black dark:group-hover:text-white">Pricing</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center p-2 text-gray-600 dark:text-gray-400 group hover:bg-teal-100 dark:hover:bg-teal-600 rounded-md transition-all duration-200 ease-in-out transform hover:scale-105 w-full"
        >
          <ArrowRightOnRectangleIcon className={`h-7 w-7 mr-2 p-1 ${Colors.tealBlueGradientButton} rounded-full`} />
          <span className="ml-2 group-hover:text-black dark:group-hover:text-white">Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;