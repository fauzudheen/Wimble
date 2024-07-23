import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GatewayUrl } from '../../const/urls';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UserArticles from './UserArticles';
import UserComments from './UserComments';
import UserLikes from './UserLikes';

const ProfileContent = () => {
  const { id } = useParams();
  const location = useLocation();
  const isMyProfile = location.pathname === '/my-profile';
  const userId = isMyProfile ? useSelector(state => state.auth.userId) : id;
  const [activeTab, setActiveTab] = useState('articles');
  const [userInteractions, setUserInteractions] = useState(null);
  const [articles, setArticles] = useState([]);

  const fetchUserInteractions = async () => {
    try {
      const [interactionsResponse, articlesResponse] = await Promise.all([
        axios.get(`${GatewayUrl}api/user-interactions/${userId}/`),
        axios.get(`${GatewayUrl}api/articles/`)
      ]);
      setUserInteractions(interactionsResponse.data);
      setArticles(articlesResponse.data);
    } catch (err) {
      console.error("Error fetching user interactions", err);
    }
  };

  useEffect(() => {
    fetchUserInteractions();
  }, [userId]);

  const renderContent = () => {
    if (!userInteractions) return null;

    const likesWithArticles = userInteractions.likes.map(like => {
      const article = articles.find(article => article.id === like.article);
      return { ...like, article };
    });

    const commentsWithArticles = userInteractions.comments.map(comment => {
      const article = articles.find(article => article.id === comment.article_id);
      return { ...comment, article };
    });

    switch(activeTab) {
      case 'articles':
        return <UserArticles articles={userInteractions.articles} />;
      case 'comments':
        return <UserComments comments={commentsWithArticles} />;
      case 'likes':
        return <UserLikes likes={likesWithArticles} />;
      default:
        return null;
    }
  };

  return (
    <div className="col-span-2">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-4 text-sm font-medium">
            <button 
              onClick={() => setActiveTab('articles')}
              className={`pb-3 ${activeTab === 'articles' ? 'text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              Articles
            </button>
            <button 
              onClick={() => setActiveTab('comments')}
              className={`pb-3 ${activeTab === 'comments' ? 'text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              Comments
            </button>
            <button 
              onClick={() => setActiveTab('likes')}
              className={`pb-3 ${activeTab === 'likes' ? 'text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              Liked articles
            </button>
          </div>
        </div>
        <div className="p-4">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default ProfileContent;
