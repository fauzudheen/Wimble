import React from 'react'

const Article = ({ author, title, content, reactions, comments, readTime }) => {
  return (
    <div className="bg-white dark:bg-gray-800 dark:text-gray-200 p-4 shadow-md rounded-md mb-4">
  <div className="flex items-center mb-4">
    <img src="/path/to/profile-pic.png" alt={author} className="h-10 w-10 rounded-full mr-4" />
    <div>
      <h3 className="text-lg font-semibold dark:text-white">{author}</h3>
      <p className="text-gray-600 dark:text-gray-400">1 hr ago</p>
    </div>
  </div>
  <h2 className="text-2xl font-bold mb-2 dark:text-white">{title}</h2>
  <p className="mb-4 dark:text-gray-300">{content}</p>
  <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
    <div className="flex space-x-4">
      <span>{reactions} reactions</span>
      <span>{comments} comments</span>
    </div>
    <span>{readTime} min read</span>
  </div>
</div>

  )
}

export default Article
