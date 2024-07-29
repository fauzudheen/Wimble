import React from 'react';
import UserSkills from './UserSkills';
import UserActivites from './UserActivites';
import UserBio from './UserBio';

const ProfileSidebar = () => {
  return (
    <div className=""> 
      <UserBio />
      <UserActivites />
      <UserSkills />
    </div>
  );
};

export default ProfileSidebar;
