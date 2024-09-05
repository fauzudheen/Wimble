import React from 'react';
import CompactArticle from '../article/CompactArticle';

const UserArticles = ({ articles, lastArticleRef }) => {
  return (
    <div className="space-y-6">
      {articles.map((article, index) => (
        article.user_data ? (
          <div key={article.id} ref={index === articles.length - 1 ? lastArticleRef : null}>
            <CompactArticle article={article} />
          </div>
        ) : null
      ))}
    </div>
  );
};

export default UserArticles;