import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const lastArticleRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const fetchUserInteractions = async () => {
    try {
      const response = await axios.get(`${GatewayUrl}api/user-interactions/${userId}/`);
      console.log("User Interactions:", response.data);
      setUserInteractions(response.data);
    } catch (err) {
      console.error("Error fetching user interactions", err);
    }
  };



  useEffect(() => {
    fetchUserInteractions();
  }, [userId]);



  const renderContent = () => {
    if (!userInteractions) return null;

    switch(activeTab) {
      case 'articles':
        return (
          <UserArticles 
            articles={userInteractions.articles} 
            lastArticleRef={lastArticleRef}
          />
        );
      case 'comments':
        return <UserComments comments={userInteractions.comments} />;
      case 'likes':
        return <UserLikes likes={userInteractions.likes} />;
      default:
        return null;
    }
  };

  return (
    <div className="col-span-2">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex text-sm font-medium gap-4">
            <button 
              onClick={() => {
                setActiveTab('articles');
                setPage(1);
                setArticles([]);
              }}
              className={`w-full sm:w-auto flex items-center justify-center px-4 py-2.5 text-sm font-medium leading-5 rounded-lg transition-all duration-200 ease-in-out focus:outline-none ${activeTab === 'articles' ? 'bg-gradient-to-r from-teal-400 to-blue-500 text-white shadow-lg' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              Articles
            </button>
            <button 
              onClick={() => setActiveTab('comments')}
              className={`w-full sm:w-auto flex items-center justify-center px-4 py-2.5 text-sm font-medium leading-5 rounded-lg transition-all duration-200 ease-in-out focus:outline-none ${activeTab === 'comments' ? 'bg-gradient-to-r from-teal-400 to-blue-500 text-white shadow-lg' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              Comments
            </button>
            <button 
              onClick={() => setActiveTab('likes')}
              className={`w-full sm:w-auto flex items-center justify-center px-4 py-2.5 text-sm font-medium leading-5 rounded-lg transition-all duration-200 ease-in-out focus:outline-none ${activeTab === 'likes' ? 'bg-gradient-to-r from-teal-400 to-blue-500 text-white shadow-lg' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              Liked articles
            </button>
          </div>
        </div>
        <div className="p-4">
          {renderContent()}
          {loading && <div className="text-center py-4">Loading...</div>}
        </div>
      </div>
    </div>
  );
};

export default ProfileContent;