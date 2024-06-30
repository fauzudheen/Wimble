import { Route, Routes } from 'react-router-dom';
import UserLogin from '../pages/user/Login';
import UserSignup from '../pages/user/Signup';
import UserHome from '../pages/user/Home';
import UserPublicRoutes from './UserPublicRoutes';

const UserRoutes = () => {
  return (
    <Routes>
        <Route element={<UserPublicRoutes />}>
            <Route path='/login' element={<UserLogin />} />
            <Route path='/signup' element={<UserSignup />} />
        </Route>
        
            <Route path='/home' element={<UserHome />} />
      
    </Routes>
  );
};

export default UserRoutes;
