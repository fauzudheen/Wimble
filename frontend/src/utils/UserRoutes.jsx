import { Route, Routes } from 'react-router-dom';
import UserLogin from '../pages/user/Login';
import UserSignup from '../pages/user/Signup';
import UserHome from '../pages/user/Home';
import UserPublicRoutes from './UserPublicRoutes';
import UserProtectedRoutes from './UserProtectedRoutes';
import ProfilePage from '../pages/user/profile/ProfilePage';
import CreateArticle from '../pages/user/article/CreateArticle';
import NavbarLayout from '../pages/user/NavbarLayout';
import ReadArticle from '../pages/user/article/ReadArticle';
import SettingsLayout from '../pages/user/SettingsLayout';
import General from '../components/user/settings/General';
import Notifications from '../components/user/settings/Notifications';
import Account from '../components/user/settings/Account';
import MainLayout from '../pages/user/MainLayout';
import Tags from '../pages/user/Tags';
import EditArticle from '../pages/user/article/EditArticle';
import ArticlesByTag from '../pages/user/article/ArticlesByTag';

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
            <Route path="/articles-by-tag/:interestId" element={<ArticlesByTag />} />
          </Route>
            <Route path='/user-profile/:id' element={<ProfilePage />} />
          <Route element={<UserProtectedRoutes />}>
              <Route path='/my-profile' element={<ProfilePage />} />
              <Route path='/create-article' element={<CreateArticle />} />
              <Route path="/edit-article/:id" element={<EditArticle />} />
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
