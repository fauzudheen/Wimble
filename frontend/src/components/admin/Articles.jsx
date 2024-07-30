import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { GatewayUrl } from '../const/urls';
import createAxiosInstance from '../../api/axiosInstance';
import { ChatBubbleLeftIcon, HandThumbUpIcon } from '@heroicons/react/24/outline';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const token = useSelector((state) => state.auth.adminAccess);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const ARTICLES_PER_PAGE = 6;


    const fetchData = async () => {
      try {
        const axiosInstance = createAxiosInstance(token);
        const response = await axiosInstance.get(`${GatewayUrl}api/articles/?page=${currentPage}`);
        setArticles(response.data.results);
        setTotalCount(response.data.count);
        setNextPage(response.data.next);
        setPrevPage(response.data.previous);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };


useEffect(() => {
    fetchData();
  }, [token, currentPage]);

  const handlePageChange = (url) => {
    if (url) {
      const urlObj = new URL(url);
      const pageNumber = urlObj.searchParams.get('page');
      setCurrentPage(pageNumber ? Number(pageNumber) : 1);
    }
  };

  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.user_data.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.user_data.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-2">
      <h2 className="text-2xl font-bold leading-tight mb-6 text-gray-900 dark:text-white text-center">Articles</h2>
      
      <div className="mb-6">
        <input 
          type="text" 
          placeholder="Search articles" 
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredArticles.map((article) => (
          <div key={article.id} className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
            <div className="p-5">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{article.title}</h3>
              <div className="flex items-center mb-4">
                <img 
                  src={`${GatewayUrl}api/user_service/media/${article.user_data.profile.split('/media/media/')[1]}`} 
                  alt={`${article.user_data.first_name} ${article.user_data.last_name}`}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{article.user_data.first_name} {article.user_data.last_name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{article.user_data.tagline}</p>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Published:</span> {new Date(article.created_at).toLocaleDateString()}
                </p>
                {article.community_id && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Community Article</span> 
                </p>
                )}
              </div>
              <div className="flex justify-between items-center">
                <div className="flex space-x-3">
                  <span className="flex items-center text-gray-600 dark:text-gray-400">
                    <ChatBubbleLeftIcon className="h-5 w-5 mr-1" />
                    {article.comments_count}
                  </span>
                  <span className="flex items-center text-gray-600 dark:text-gray-400">
                    <HandThumbUpIcon className="h-5 w-5 mr-1" />
                    {article.likes_count}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center items-center">
        <button 
        className={`px-4 py-2 rounded ${
            !prevPage ? 'bg-gray-100 text-gray-700 dark:text-white dark:bg-gray-700 cursor-not-allowed text-sm font-semibold' : 'bg-gradient-to-r from-teal-400 to-blue-500 hover:bg-gradient-to-r hover:from-teal-400 hover:to-blue-500 text-white text-sm font-semibold shadow-md'
        } mr-2`}
        onClick={() => handlePageChange(prevPage)}
        disabled={!prevPage}
        >
        Previous
        </button>
        <span className="px-4 py-2 text-gray-700 dark:text-gray-300 text-sm ">
        Page {currentPage} of {Math.ceil(totalCount / ARTICLES_PER_PAGE)}
        </span>
        <button 
        className={`px-4 py-2 rounded ${
            !nextPage ? 'bg-gray-100 text-gray-700 dark:text-white dark:bg-gray-700 cursor-not-allowed text-sm font-semibold' : 'bg-gradient-to-r from-teal-400 to-blue-500 hover:bg-gradient-to-r hover:from-teal-400 hover:to-blue-500 text-white text-sm font-semibold shadow-md'
        } ml-2`}
        onClick={() => handlePageChange(nextPage)}
        disabled={!nextPage}
        >
        Next
        </button>

      </div>
    </div>
  );
};

export default Articles;