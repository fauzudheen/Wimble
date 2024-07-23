
import CompactArticle from '../article/CompactArticle';

const UserArticles = ({ articles }) => {
  return (
    <div className="space-y-6">
      {articles.map((article) => (
        article.user_data ? (
            <CompactArticle key={article.id} article={article} />
        ) : null
        ))}
    </div>
  );
};

export default UserArticles;