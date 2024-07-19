import { Outlet } from 'react-router-dom';
import { useSelector } from "react-redux";
import CommunityPromotion from "../../components/user/CommunityPromotion";
import HomeSidebar from "../../components/user/HomeSidebarLeft";

const MainLayout = () => {
  const isAuthenticated = useSelector(state => state.auth.isUserAuthenticated);
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-700">
      <div className="container mx-auto pt-4 flex flex-wrap">
        <div className="w-full md:w-1/5">
          { isAuthenticated ? null : <CommunityPromotion />}
          <HomeSidebar />
        </div>
        <div className="w-full md:w-4/5">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
