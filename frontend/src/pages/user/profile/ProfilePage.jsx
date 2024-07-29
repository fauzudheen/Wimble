import React from 'react';
import Navbar from '../../../components/user/Navbar';
import ProfileHeader from '../../../components/user/profile/ProfileHeader';
import ProfileSidebar from '../../../components/user/profile/ProfileSidebar';
import ProfileContent from '../../../components/user/profile/ProfileContent';

const ProfilePage = () => {
  return (
    <div className="bg-gray-100 dark:bg-black min-h-screen">
      <main className="">
        <ProfileHeader />
        <div className="container mx-auto w-11/12 sm:w-5/6 md:w-4/5 lg:w-4/5 xl:w-5/6 lg:mt-6 md:mt-4 sm:mt-2 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:gap-4 md:gap-3">
            <ProfileSidebar />
            <ProfileContent />
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProfilePage;
