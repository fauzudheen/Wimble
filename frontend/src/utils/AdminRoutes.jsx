import { Route, Routes } from 'react-router-dom';
import AdminLogin from '../pages/admin/Login';
import AdminLayout from '../pages/admin/Layout';
import Dashboard from '../components/admin/Dashboard';
import Users from '../components/admin/Users';
import AdminProtectedRoutes from './AdminProtectedRoutes';
import AdminPublicRoutes from './AdminPublicRoutes';
import SkillsAndInterests from '../components/admin/SkillsAndInterests';

const AdminRoutes = () => {
  return (
    <Routes>

      <Route element={<AdminPublicRoutes />}>
        <Route path='admin/login' element={<AdminLogin />} />
      </Route>

      <Route element={<AdminProtectedRoutes />}>
        <Route path="admin/dashboard" element={<AdminLayout><Dashboard/></AdminLayout>} />
        <Route path="admin/users" element={<AdminLayout><Users/></AdminLayout>} />
        <Route path="admin/skills-and-interests" element={<AdminLayout><SkillsAndInterests/></AdminLayout>} />
      </Route>

    </Routes>
  );
};

export default AdminRoutes;
