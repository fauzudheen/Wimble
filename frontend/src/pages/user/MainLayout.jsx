import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CommunityPromotion from '../../components/user/CommunityPromotion';
import HomeSidebar from '../../components/user/HomeSidebarLeft';
import PlusPromotion from '../../components/user/PlusPromotion';

const MainLayout = ({children}) => {
  const isAuthenticated = useSelector(state => state.auth.isUserAuthenticated);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black flex">
      <div className="hidden lg:block max-h-svh w-1/5 h-screen overflow-y-auto fixed m-4">
        {!isAuthenticated && <CommunityPromotion />}
        <HomeSidebar />
        <PlusPromotion />
      </div>
      <div className="w-full lg:w-4/5 lg:ml-[20%] p-4">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
