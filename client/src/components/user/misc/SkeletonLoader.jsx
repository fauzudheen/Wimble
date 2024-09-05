import React from 'react';
import Colors from "../Colors";


// // In your component:
// if (!article) {
//     return <SkeletonLoader type="article" count={1} />;
//   }
  
//   // For loading multiple articles
//   if (!articles) {
//     return <SkeletonLoader type="article" count={5} />;
//   }
  
//   // For loading a profile
//   if (!profile) {
//     return <SkeletonLoader type="profile" count={1} />;
//   }

const SkeletonLoader = ({ type = 'article', count = 1 }) => {
  const shimmer = `${Colors.tealBlueGradientText} animate-pulse`;

  const ArticleSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-4">
      <div className="flex items-center space-x-3">
        <div className={`rounded-full bg-gray-200 dark:bg-gray-700 h-10 w-10 ${shimmer}`}></div>
        <div className="flex-1 space-y-1 py-1">
          <div className={`h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 ${shimmer}`}></div>
          <div className={`h-3 bg-gray-200 dark:bg-gray-700 rounded ${shimmer}`}></div>
        </div>
      </div>
      <div className="space-y-3 mt-4">
        <div className={`h-4 bg-gray-200 dark:bg-gray-700 rounded ${shimmer}`}></div>
        <div className={`h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 ${shimmer}`}></div>
        <div className={`h-4 bg-gray-200 dark:bg-gray-700 rounded ${shimmer}`}></div>
        <div className={`h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6 ${shimmer}`}></div>
      </div>
    </div>
  );

  const ProfileSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-4">
      <div className="flex flex-col items-center">
        <div className={`rounded-full bg-gray-200 dark:bg-gray-700 h-24 w-24 ${shimmer}`}></div>
        <div className={`h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mt-4 ${shimmer}`}></div>
        <div className={`h-3 bg-gray-200 dark:bg-gray-700 rounded w-32 mt-2 ${shimmer}`}></div>
      </div>
      <div className="mt-6 space-y-3">
        <div className={`h-4 bg-gray-200 dark:bg-gray-700 rounded ${shimmer}`}></div>
        <div className={`h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 ${shimmer}`}></div>
        <div className={`h-4 bg-gray-200 dark:bg-gray-700 rounded ${shimmer}`}></div>
      </div>
    </div>
  );

  const skeletons = {
    article: ArticleSkeleton,
    profile: ProfileSkeleton,
  };

  const SelectedSkeleton = skeletons[type];

  return (
    <div className="max-w-2xl mx-auto">
      {[...Array(count)].map((_, index) => (
        <SelectedSkeleton key={index} />
      ))}
    </div>
  );
};

export default SkeletonLoader;