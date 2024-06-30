import Navbar from '../../components/user/Navbar';
import HomeSidebar from '../../components/user/HomeSidebarLeft';
import CommunityPromotion from '../../components/user/CommunityPromotion';
import Feed from '../../components/user/Feed';
import Discussions from '../../components/user/Discussions';
import { useSelector } from 'react-redux';

const Home = () => {
  const isAuthenticated = useSelector(state => state.auth.isUserAuthenticated)
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-700">
      <Navbar />
      <div className="container mx-auto p-4 flex flex-wrap">
      <div className="w-full md:w-1/5">
      { isAuthenticated ? null : <CommunityPromotion />}
        <HomeSidebar />
      </div>
      <div className="w-full md:w-3/5">
        <Feed />
      </div>
      <div className="w-full md:w-1/5">
        <Discussions />
      </div>
    </div>
  </div>

  );
}

export default Home;
