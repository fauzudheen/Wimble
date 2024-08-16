import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { GatewayUrl } from '../const/urls';
import { useSelector } from 'react-redux';

const Article = ({ article }) => {
  const navigate = useNavigate();
  const authId = useSelector(state => state.auth.userId);

  const {
    id,
    user_data: { id: userId, first_name, last_name, profile, tagline },
    title,
    content,
    created_at,
    thumbnail,
    likes_count,
    comments_count
  } = article;

  const author = `${first_name} ${last_name}`;

  const handleTitleClick = () => {
    navigate(`/article/${id}`);
  };

  const handleProfileClick = () => {
    if (userId === authId) {
      navigate(`/my-profile`);
    } else {
      navigate(`/user-profile/${userId}`);
    }
  };

  return (
    <article className="bg-white dark:bg-gray-800 p-2 sm:p-3 shadow-md rounded-lg mb-2 sm:mb-3 transition-all hover:shadow-md">
      <header className="flex items-center mb-2">
        {profile && (
          <img
            src={`${GatewayUrl}api/user_service/media/${profile.split('/media/media/')[1]}`}
            alt={author}
            className="h-7 w-7 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-full mr-2 cursor-pointer object-cover"
            onClick={handleProfileClick}
          />
        )}
        <div>
          <h3
            className="font-semibold text-gray-800 dark:text-white cursor-pointer text-xs sm:text-sm"
            onClick={handleProfileClick}
          >
            {author}
          </h3>
          <p className="text-xs sm:text-xs text-gray-600 dark:text-gray-400">{tagline}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {formatDistanceToNow(new Date(created_at), { addSuffix: true })}
          </p>
        </div>
      </header>
      <Link to={`/article/${id}`} className="hover:text-blue-500">
        {thumbnail && (
          <img
            src={thumbnail.replace('8000', '8002')}
            className="w-full h-36 sm:h-44 md:h-48 lg:h-56 object-cover rounded-lg mb-2 sm:mb-3"
            alt={title}
          />
        )}
        <h2
          className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 text-gray-900 dark:text-white hover:text-blue-500 cursor-pointer transition-colors duration-200"
          onClick={handleTitleClick}
        >
          {title}
        </h2>
        <div
          className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 line-clamp-2 sm:line-clamp-3 overflow-hidden"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </Link>
      <footer className="flex justify-between items-center text-xs sm:text-xs text-gray-600 dark:text-gray-400">
        <div className="flex space-x-2 sm:space-x-3">
          <div className="flex items-center space-x-1 sm:space-x-1.5">
            <p>{likes_count}</p>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-1.5">
            <p>{comments_count}</p>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <span className="text-xs">{Math.ceil(content.replace(/<[^>]+>/g, '').split(' ').length / 200)} min read</span>
      </footer>
    </article>
  );
};

export default Article;
