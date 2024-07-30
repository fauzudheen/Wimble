import Sidebar from '../../components/admin/Sidebar'
import Navbar from '../../components/admin/Navbar'
import { Bars3Icon } from '@heroicons/react/24/solid'
import { useState } from 'react'

const Layout = ({children}) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-blue-100 dark:bg-black">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 md:ml-64"> {/* Add left margin for large screens */}
        <div className="md:hidden fixed top-4 left-4 z-50">
          <button onClick={toggleSidebar} className="text-gray-600 dark:text-gray-400">
            <Bars3Icon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4">
          <Navbar />
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout