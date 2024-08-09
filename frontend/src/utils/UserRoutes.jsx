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
import SettingsNotifications from '../components/user/settings/Notifications';
import Account from '../components/user/settings/Account';
import MainLayout from '../pages/user/MainLayout';
import Tags from '../pages/user/Tags';
import EditArticle from '../pages/user/article/EditArticle';
import ArticlesByTag from '../pages/user/article/ArticlesByTag';
import CommunitiesLayout from '../pages/user/community/CommunitiesLayout';
import CommunityPage from '../pages/user/community/CommunityPage';
import CommunitySettings from '../pages/user/community/CommunitySettings';
import TeamsLayout from '../pages/user/team/TeamsLayout';
import TeamPage from '../pages/user/team/TeamPage';
import TeamOverview from '../components/user/team/TeamOverview';
import TeamChat from '../components/user/team/TeamChat';
import TeamMeetings from '../components/user/team/TeamMeetings';
import TeamProjects from '../components/user/team/TeamProjects';
import TeamMembers from '../components/user/team/TeamMembers';
import TeamSettings from '../components/user/team/TeamSettings';
import Meet from '../components/user/team/Meet';
import Notifications from '../components/user/Notifications';

const UserRoutes = () => {
  return (
    <Routes>
        <Route element={<UserPublicRoutes />}>
            <Route path='/login' element={<UserLogin />} />
            <Route path='/signup' element={<UserSignup />} />
        </Route>
        
        <Route element={<NavbarLayout />}>
            <Route path="/home" element={<MainLayout><UserHome /></MainLayout>} />
            <Route path="/tags" element={<MainLayout><Tags /></MainLayout>} />
            <Route path="/articles-by-tag/:interestId" element={<MainLayout><ArticlesByTag /></MainLayout>} />
            <Route path="/communities" element={<MainLayout><CommunitiesLayout /></MainLayout>} />

            <Route path="/communities/:id" element={<CommunityPage />} />
            <Route path="/communities/:id/settings" element={<CommunitySettings />} />
            <Route path='/user-profile/:id' element={<ProfilePage />} />
            
          <Route element={<UserProtectedRoutes />}>
              <Route path='/my-profile' element={<ProfilePage />} />
              <Route path='/create-article' element={<CreateArticle />} />
              <Route path="/edit-article/:id" element={<EditArticle />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/teams" element={<MainLayout><TeamsLayout /></MainLayout>} />

              <Route path="settings" element={<SettingsLayout />}>
                <Route index element={<General />} />
                <Route path="general" element={<General />} />
                <Route path="notifications" element={<SettingsNotifications />} />
                <Route path="account" element={<Account />} />
              </Route>

              <Route path="/teams/:id" element={<TeamPage />}>
                <Route path="overview" element={<TeamOverview />} />
                <Route path="chat" element={<TeamChat />} />
                <Route path="meetings" element={<TeamMeetings />} />
                <Route path="meet" element={<Meet />} />
                <Route path="projects" element={<TeamProjects />} />
                <Route path="members" element={<TeamMembers />} />
                <Route path="settings" element={<TeamSettings />} />
              </Route>


          </Route>
              <Route path='/article/:id' element={<ReadArticle />} />
        </Route>
    </Routes>
  );
};

export default UserRoutes;
