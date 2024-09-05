import React, { useCallback, useEffect, useRef, useState } from 'react';
import Article from './Article';
import axios from 'axios';
import { GatewayUrl } from '../const/urls';
import { useSelector } from 'react-redux';

const Feed = () => {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const token = useSelector(state => state.auth.userAccess);

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

  const fetchFeed = async () => {
    setLoading(true);
    try {
      const url = token 
        ? `${GatewayUrl}api/feed/?page=${page}`
        : `${GatewayUrl}api/articles/?page=${page}`;
      
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.get(url, { headers });
      console.log("response", response.data);
      const newArticles = response.data.results;
      setArticles(prevArticles => [...prevArticles, ...newArticles]);
      setHasMore(response.data.next !== null);
    } catch (error) {
      console.error("Error fetching feed", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFeed();
  }, [page, token]);

  return (
    <main className="flex-1 w-full mx-auto px-0 lg:px-4">
      {articles.map((article, index) => (
        article.user_data ? (
          <div key={article.id} ref={index === articles.length - 1 ? lastArticleRef : null}>
            <Article article={article} />
          </div>
        ) : null
      ))}
      {loading && <div className="text-center py-4">Loading...</div>}
    </main>
  );
};

export default Feed;