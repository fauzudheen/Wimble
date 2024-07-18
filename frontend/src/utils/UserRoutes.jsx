import { Route, Routes } from 'react-router-dom';
import UserLogin from '../pages/user/Login';
import UserSignup from '../pages/user/Signup';
import UserHome from '../pages/user/Home';
import UserPublicRoutes from './UserPublicRoutes';
import UserProtectedRoutes from './UserProtectedRoutes';
import ProfilePage from '../pages/user/ProfilePage';
import CreateArticle from '../pages/user/CreateArticle';
import NavbarLayout from '../pages/user/NavbarLayout';
import ReadArticle from '../components/user/article/ReadArticle';
import SettingsLayout from '../pages/user/SettingsLayout';
import General from '../components/user/settings/General';
import Notifications from '../components/user/settings/Notifications';
import Account from '../components/user/settings/Account';
import MainLayout from '../pages/user/MainLayout';
import Tags from '../pages/user/Tags';

const UserRoutes = () => {
  return (
    <Routes>
        <Route element={<UserPublicRoutes />}>
            <Route path='/login' element={<UserLogin />} />
            <Route path='/signup' element={<UserSignup />} />
        </Route>
        
        <Route element={<NavbarLayout />}>
          <Route path="/" element={<MainLayout />}>
            <Route path="home" element={<UserHome />} />
            <Route path="tags" element={<Tags />} />
          </Route>
          <Route element={<UserProtectedRoutes />}>
              <Route path='/profile' element={<ProfilePage />} />
              <Route path='/create-article' element={<CreateArticle />} />
              <Route path="settings" element={<SettingsLayout />}>
                <Route index element={<General />} />
                <Route path="general" element={<General />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="account" element={<Account />} />
              </Route>
          </Route>
              <Route path='/article/:id' element={<ReadArticle />} />
        </Route>
    </Routes>
  );
};

export default UserRoutes;
