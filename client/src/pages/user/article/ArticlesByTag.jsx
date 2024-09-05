import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { GatewayUrl } from '../../../components/const/urls';
import Colors from '../../../components/user/misc/Colors';
import CompactArticle from '../../../components/user/article/CompactArticle';

const ArticlesByTag = () => {
  const [articles, setArticles] = useState([]);
  const [tagName, setTagName] = useState('');
  const { interestId } = useParams();

  useEffect(() => {
    const fetchInterest = async () => {
      try {
        const response = await axios.get(`${GatewayUrl}api/interests/${interestId}`);
        setTagName(response.data.name);
      } catch (error) {
        console.error('Error fetching interest:', error);
      }
    };

    const fetchArticlesByTag = async () => {
      try {
        const response = await axios.get(`${GatewayUrl}api/articles/by-tag/${interestId}`);
        setArticles(response.data.filter(article => article.user_data));
        window.scrollTo(0, 0);
      } catch (error) {
        console.error('Error fetching articles by tag:', error);
      }
    };

    fetchInterest();
    fetchArticlesByTag();
  }, [interestId]);

  return (
    <div className="lg:ml-4 bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-4 md:p-6">
      <h2 className={`text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mb-4`}>
        Articles tagged with <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-transparent bg-clip-text">#{tagName}</span>
      </h2>
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto">
          {articles.map((article) => (
            <div key={article.id} className="break-inside-avoid">
              <CompactArticle article={article} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-300 text-sm">No articles found for this tag.</p>
      )}
    </div>
  );
};

export default ArticlesByTag;