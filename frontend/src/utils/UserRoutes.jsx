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

const UserRoutes = () => {
  return (
    <Routes>
        <Route element={<UserPublicRoutes />}>
            <Route path='/login' element={<UserLogin />} />
            <Route path='/signup' element={<UserSignup />} />
        </Route>
        
        <Route element={<NavbarLayout />}>
              <Route path='/home' element={<UserHome />} />
          <Route element={<UserProtectedRoutes />}>
              <Route path='/profile' element={<ProfilePage />} />
              <Route path='/create-article' element={<CreateArticle />} />
          </Route>
              <Route path='/article/:id' element={<ReadArticle />} />
        </Route>
    </Routes>
  );
};

export default UserRoutes;
