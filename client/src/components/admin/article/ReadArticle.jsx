import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';
import { GatewayUrl } from '../../../components/const/urls';
import { HandThumbUpIcon, ChatBubbleLeftIcon} from '@heroicons/react/24/outline';
import LoadSpinner from '../../../components/user/misc/LoadSpinner';

const ReadArticle = () => {
  const { id: articleId } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      const response = await axios.get(`${GatewayUrl}api/articles/${articleId}/`);
      console.log("article", response.data);
      setArticle({
        articleId,
        author: `${response.data.user_data.first_name} ${response.data.user_data.last_name}`,
        title: response.data.title,
        content: response.data.content,
        created_at: response.data.created_at,
        updated_at: response.data.updated_at,
        profile: response.data.user_data.profile,
        bio: response.data.user_data.bio,
        tagline: response.data.user_data.tagline,
        thumbnail: response.data.thumbnail,
        likesCount: response.data.likes_count,
        commentsCount: response.data.comments_count,
        author_id: response.data.user_data.id,
        tags: response.data.tags,
      });
    };

    fetchArticle();
  }, [articleId]);


  if (!article) {
    return <LoadSpinner size="medium" text="Fetching data..." />
  }

  return (
    <div className=''>
      <article className="max-w-5xl mx-auto bg-white dark:bg-gray-900 shadow-md rounded-md overflow-hidden">
      <header className="p-2 sm:p-3 md:p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-3">{article.title}</h1>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center mb-2 sm:mb-0">
            <img
              src={article.profile}
              alt={article.author}
              className="h-8 w-8 sm:h-10 sm:w-10 md:h-11 md:w-11 rounded-full mr-2 sm:mr-3 object-cover"
            />
            <div>
              <h3
                className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white"
              >
                {article.author}
              </h3>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex flex-wrap items-center">
                <span>Published on {new Date(article.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                <span className="mx-1 hidden sm:inline">•</span>
                <span>{Math.ceil(article.content.replace(/<[^>]+>/g, '').split(' ').length / 200)} min read</span>
              </div>
            </div>
          </div> 
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <span className='text-xs font-semibold text-gray-500 dark:text-gray-400'>
              Updated {new Date(article.updated_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <div className="flex space-x-1 sm:space-x-3">
            </div>
          </div>
        </div>
      </header>
  
        {/* Thumbnail Section */}
        {article.thumbnail && (
          <div className="relative">
            <img src={article.thumbnail} alt="Article Thumbnail" className="w-full h-28 sm:h-40 md:h-56 object-cover" />
          </div>
        )}
  
        <div 
          className="max-w-none p-4 sm:p-6 md:p-8 dark:text-gray-50 prose dark:prose-invert prose-xs sm:prose-sm md:prose-base prose-img:rounded-md prose-a:text-blue-600"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
  
        <footer className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 md:py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between pb-1 sm:pb-2">
            <div className="flex items-center space-x-1 sm:space-x-3">
                <HandThumbUpIcon className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 dark:text-gray-300" />
                <span className="text-xs sm:text-sm md:text-base dark:text-gray-300">{article.likesCount}</span>
                <ChatBubbleLeftIcon className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 dark:text-gray-300" />
                <span className="text-xs sm:text-sm md:text-base dark:text-gray-300">{article.commentsCount}</span>
            </div>
          </div>
          <div className="flex items-center justify-end">
            <p className="text-xs sm:text-xs text-gray-600 dark:text-gray-400">
              {formatDistanceToNow(new Date(article.created_at), { addSuffix: true })}
            </p>
          </div>
  
          {/* Related Tags Section */}
          <div className="mt-1 sm:mt-3">
            <h4 className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">Related Topics</h4>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {article.tags.map((tag) => (
                <button
                  key={tag.id}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs sm:text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  #{tag.interest_name}
                </button>
              ))}
            </div>
          </div>
  
        </footer>
      </article>
    </div>
  );  
};


export default ReadArticle;