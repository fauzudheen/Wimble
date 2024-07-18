// General.js
import React from "react";
import InterestsSection from "./InterestsSection";

const General = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Information</h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Update your profile information.</p>
      
      <InterestsSection />
    </div>
  );
};

export default General;