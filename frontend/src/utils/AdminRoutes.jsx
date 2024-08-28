import { Route, Routes } from 'react-router-dom';
import AdminLogin from '../pages/admin/Login';
import AdminLayout from '../pages/admin/Layout';
import Dashboard from '../components/admin/Dashboard';
import Users from '../components/admin/Users';
import AdminProtectedRoutes from './AdminProtectedRoutes';
import AdminPublicRoutes from './AdminPublicRoutes';
import SkillsAndInterests from '../components/admin/SkillsAndInterests';
import Teams from '../components/admin/Teams';
import Communities from '../components/admin/Communities';
import Articles from '../components/admin/Articles';
import Pricing from '../components/admin/Pricing';
import Search from '../components/admin/Search';
import ReadArticle from '../components/admin/article/ReadArticle';
import ArticleReports from '../components/admin/article/ArticleReports';
import ArticleReportDetails from '../components/admin/article/ArticleReportDetails';

const AdminRoutes = () => {
  return (
    <Routes>

      <Route element={<AdminPublicRoutes />}>
        <Route path='admin/login' element={<AdminLogin />} />
      </Route>

      <Route element={<AdminProtectedRoutes />}>
        <Route path="admin/dashboard" element={<AdminLayout><Dashboard/></AdminLayout>} />
        <Route path="admin/users" element={<AdminLayout><Users/></AdminLayout>} />
        <Route path="admin/teams" element={<AdminLayout><Teams/></AdminLayout>} />
        <Route path="admin/communities" element={<AdminLayout><Communities/></AdminLayout>} />
        <Route path="admin/articles" element={<AdminLayout><Articles/></AdminLayout>} />
        <Route path="admin/skills-and-interests" element={<AdminLayout><SkillsAndInterests/></AdminLayout>} />
        <Route path="admin/pricing" element={<AdminLayout><Pricing/></AdminLayout>} />
        <Route path="admin/search-results" element={<AdminLayout><Search/></AdminLayout>} />
        <Route path="admin/articles/:id" element={<AdminLayout><ReadArticle/></AdminLayout>} />
        <Route path="admin/articles/reports" element={<AdminLayout><ArticleReports/></AdminLayout>} />
        <Route path="admin/articles/:id/reports" element={<AdminLayout><ArticleReportDetails/></AdminLayout>} />
      </Route>

    </Routes>
  );
};

export default AdminRoutes;
