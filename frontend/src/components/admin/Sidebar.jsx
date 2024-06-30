import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaUserFriends, FaGlobe, FaFileAlt, FaGraduationCap, FaRupeeSign, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import logoImg from '../../assets/Logos/Brand and Logo.jpg';
import { useDispatch } from 'react-redux';
import { setAdminLogout } from '../../redux/authSlice';

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
          className="flex items-center p-2 text-gray-600 dark:text-gray-400 hover:bg-teal-50 dark:hover:bg-gray-700"
        >
          <FaTachometerAlt className="w-6 h-6" />
          <span className="ml-2">Dashboard</span>
        </Link>
        <Link
          to="/admin/users"
          className="flex items-center p-2 text-gray-600 dark:text-gray-400 hover:bg-teal-50 dark:hover:bg-gray-700"
        >
          <FaUsers className="w-6 h-6" />
          <span className="ml-2">Manage Users</span>
        </Link>
        <Link
          to="/admin/teams"
          className="flex items-center p-2 text-gray-600 dark:text-gray-400 hover:bg-teal-50 dark:hover:bg-gray-700"
        >
          <FaUserFriends className="w-6 h-6" />
          <span className="ml-2">Manage Teams</span>
        </Link>
        <Link
          to="/admin/communities"
          className="flex items-center p-2 text-gray-600 dark:text-gray-400 hover:bg-teal-50 dark:hover:bg-gray-700"
        >
          <FaGlobe className="w-6 h-6" />
          <span className="ml-2">Manage Communities</span>
        </Link>
        <Link
          to="/admin/articles"
          className="flex items-center p-2 text-gray-600 dark:text-gray-400 hover:bg-teal-50 dark:hover:bg-gray-700"
        >
          <FaFileAlt className="w-6 h-6" />
          <span className="ml-2">Manage Articles</span>
        </Link>
        <Link
          to="/admin/skills-and-interests"
          className="flex items-center p-2 text-gray-600 dark:text-gray-400 hover:bg-teal-50 dark:hover:bg-gray-700"
        >
          <FaGraduationCap className="w-6 h-6" />
          <span className="ml-2">Skills and Interests</span>
        </Link>
        <Link
          to="/admin/pricing"
          className="flex items-center p-2 text-gray-600 dark:text-gray-400 hover:bg-teal-50 dark:hover:bg-gray-700"
        >
          <FaRupeeSign className="w-6 h-6" />
          <span className="ml-2">Pricing</span>
        </Link>
        <button
          className="flex items-center p-2 text-gray-600 dark:text-gray-400 hover:bg-teal-50 dark:hover:bg-gray-700"
        >
          <FaSignOutAlt className="w-6 h-6" />
          <span onClick={handleLogout} className="ml-2">Logout</span>
        </button>
      </nav>
      <button
        onClick={toggleSidebar}
        className="md:hidden absolute top-4 right-4 text-gray-600 dark:text-gray-400"
      >
        <FaTimes className="w-6 h-6" />
      </button>
    </aside>
  );
};

export default Sidebar;
