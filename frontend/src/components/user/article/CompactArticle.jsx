import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const CompactArticle = ({ article }) => {
  const {
    id,
    title,
    content,
    likes_count,
    comments_count,
    created_at
  } = article;

  return (
    <Link to={`/article/${id}`}>
      <article className="bg-gray-50 dark:bg-gray-900 p-4 shadow-md rounded-lg mb-4 hover:scale-101 transition-transform duration-200">
        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white hover:text-blue-500 transition-colors duration-200">
          {title}
        </h2>
      
        <div
          className="text-gray-700 dark:text-gray-300 mb-3 line-clamp-2 overflow-hidden"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      
        <footer className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <p>{likes_count}</p>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
            </div>
            <div className="flex items-center space-x-2">
              <p>{comments_count}</p>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div>
            {formatDistanceToNow(new Date(created_at), { addSuffix: true })}
          </div>
        </footer>
      </article>
    </Link>
  );
}

export default CompactArticle;
