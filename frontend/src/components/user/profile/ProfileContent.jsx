import React from 'react'
import Article from '../Article'

const ProfileContent = () => {
  return (
    <div className="col-span-2">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-4 text-sm font-medium">
            <button className="text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 pb-3">Posts</button>
            <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">Comments</button>
            <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">Liked posts</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileContent
