import React, { useEffect, useState } from 'react'
import {jwtDecode} from 'jwt-decode';
import Navbar from '../../../components/user/Navbar'
import ProfileHeader from '../../../components/user/profile/ProfileHeader'
import ProfileSidebar from '../../../components/user/profile/ProfileSidebar'
import ProfileContent from '../../../components/user/profile/ProfileContent'

const ProfilePage = () => {
    
  return (
    <div className="bg-gray-100 dark:bg-gray-700 min-h-screen">
      <main className="">
        <ProfileHeader/>
        <div className="w-11/12 sm:w-5/6 md:w-4/5 lg:w-4/5 xl:w-5/6 mx-auto">
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 container mx-auto">
          <ProfileSidebar/>
          <ProfileContent />
        </div>
        </div>
      </main>
    </div>
  )
}

export default ProfilePage
