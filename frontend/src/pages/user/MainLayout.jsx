import { Outlet } from 'react-router-dom';
import { useSelector } from "react-redux";
import CommunityPromotion from "../../components/user/CommunityPromotion";
import HomeSidebar from "../../components/user/HomeSidebarLeft";
import PlusPromotion from '../../components/user/PlusPromotion';

const MainLayout = () => {
    const isAuthenticated = useSelector(state => state.auth.isUserAuthenticated);
    
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-700 flex">
        <div className="max-h-svh w-1/5 h-screen overflow-y-auto fixed m-4">
          {!isAuthenticated && <CommunityPromotion />}
          <HomeSidebar />
          { <PlusPromotion />} 
          </div>
        <div className="w-4/5 ml-[20%] p-4 ">
          <Outlet />
        </div>
      </div>
    );
  };
  
  export default MainLayout;
