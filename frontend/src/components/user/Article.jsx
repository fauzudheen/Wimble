import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { TrashIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { GatewayUrl } from '../const/urls';
import Colors from './Colors';

const Article = ({ author, title, content, created_at, profile, thumbnail, tagline, id, likesCount, commentsCount }) => {
  const navigate = useNavigate();
  
  const handleDelete = async(articleId) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        const response = await axios.delete(`${GatewayUrl}api/articles/${articleId}`)
        console.log(response.data)
      } catch(error) {
        console.error('There was an error deleting the article!', error);
      }
        
    }
  };

  const handleTitleClick = () => {
    navigate(`/article/${id}`);
  };

  return (
    <article className="bg-white dark:bg-gray-800 p-6 shadow-lg rounded-lg mb-8 transition-all hover:shadow-xl">
      <header className="flex items-center mb-4">
      {profile && (
        <img src={profile} alt={author} className="h-12 w-12 rounded-full mr-4 border-2 border-blue-500" />
      )}

        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{author}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{tagline}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {formatDistanceToNow(new Date(created_at), { addSuffix: true })}
          </p>
        </div>
      </header>
      
      {thumbnail && (
        <img src={thumbnail} alt={title} className="w-full h-64 object-cover rounded-lg mb-4" />
      )}
      
      <h2 
        className="text-2xl font-bold mb-3 text-gray-900 dark:text-white hover:text-blue-500 cursor-pointer transition-colors duration-200"
        onClick={handleTitleClick}
      >
        {title}
      </h2>
      
      <div 
        className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3 overflow-hidden"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      
      <footer className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
      <div className="flex space-x-4">
        <div className="flex items-center space-x-2">
          <p>{likesCount}</p>
          <button className={Colors.tealBlueGradientIcon} aria-label="Like">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
          </button>
        </div>
        <div className="flex items-center space-x-2">
        <p>{commentsCount}</p>
          <button className={Colors.tealBlueGradientIcon} aria-label="Comment">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      <span>{Math.ceil(content.replace(/<[^>]+>/g, '').split(' ').length / 200)} min read</span>
    </footer>
      
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
      <Link 
        to={`/article/${id}`} 
        className="text-blue-500 hover:underline"
      >
        Read full article
      </Link>
      <button onClick={() => handleDelete(id)} className="text-red-500 hover:text-red-700">
        <TrashIcon className="h-5 w-5" />
      </button>
    </div>
    </article>
  )
}

export default Article;