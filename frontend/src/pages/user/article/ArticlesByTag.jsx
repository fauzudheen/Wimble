import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { HandThumbUpIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import { GatewayUrl } from '../../../components/const/urls';
import Colors from '../../../components/user/misc/Colors';
import CompactArticle from '../../../components/user/article/CompactArticle';

const ArticlesByTag = () => {
  const [articles, setArticles] = useState([]);
  const [tagName, setTagName] = useState('');
  const { interestId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterest = async () => {
      try {
        const response = await axios.get(`${GatewayUrl}api/interests/${interestId}`);
        console.log('Interest:', response.data);
        setTagName(response.data.name);
      } catch (error) {
        console.error('Error fetching interest:', error);
      }
    }
    const fetchArticlesByTag = async () => {
      try {
        const response = await axios.get(`${GatewayUrl}api/articles/by-tag/${interestId}`);
        setArticles(response.data);
        window.scrollTo(0, 0);
      } catch (error) {
        console.error('Error fetching articles by tag:', error);
      }
    };

    fetchInterest();
    fetchArticlesByTag();
  }, [interestId]);


  return (
    <div className="ml-4 bg-white dark:bg-gray-800  rounded-lg p-6">
      <h2 className={`text-2xl font-bold ${Colors.tealBlueGradientText} mb-6`}>
        Articles tagged with "#{tagName}"
      </h2>
      {articles.length > 0 ? (
        <div className="space-y-6">
          {articles.map((article) => (
        article.user_data ? (
            <CompactArticle key={article.id} article={article} />
        ) : null
        ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-300">No articles found for this tag.</p>
      )}
    </div>
  );
};

export default ArticlesByTag;
