import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';
import { GatewayUrl } from '../../../components/const/urls';
import Colors from '../../../components/user/misc/Colors';
import { HandThumbUpIcon, ChatBubbleLeftIcon, FlagIcon, ShareIcon, BookmarkIcon, TrashIcon, PencilIcon, TagIcon } from '@heroicons/react/24/outline';
import { HandThumbUpIcon as ThumbUpIconSolid } from '@heroicons/react/24/solid';
import createAxiosInstance from '../../../api/axiosInstance';
import { useSelector } from 'react-redux';
import CommentSection from '../../../components/user/article/CommentSection';
import Modal from '../../../components/user/Modal';
import ConfirmModal from '../../../components/user/ComfirmModal';
import NoContentPage from '../../../components/user/misc/NoContentPage';
import FormModal from '../../../components/user/FormModal';
import LoadSpinner from '../../../components/user/misc/LoadSpinner';

const ReadArticle = () => {
  const navigate = useNavigate();
  const { id: articleId } = useParams();
  const [article, setArticle] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const token = useSelector((state) => state.auth.userAccess);
  const userId = useSelector((state) => state.auth.userId);
  const isAuthenticated = useSelector((state) => state.auth.isUserAuthenticated);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isArticleDeleted, setIsArticleDeleted] = useState(false);

  const checkIfLiked = async () => {
    try {
      const axiosInstance = createAxiosInstance(token);
      const response = await axiosInstance.get(`${GatewayUrl}api/article-like/`, {
        params: {
          article_id: articleId
        }
      });
      console.log(response.data);
      if (response.data.liked === true) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
    } catch (error) {
      console.error('Error checking if liked:', error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    checkIfLiked();
  }, [isAuthenticated, articleId, token]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    if (isLiked) {
      try {
        const axiosInstance = createAxiosInstance(token);
        const response = await axiosInstance.delete(`${GatewayUrl}api/article-like/?article_id=${articleId}`);
        console.log(response.data);
        setIsLiked(false);
        setArticle((prevArticle) => ({ ...prevArticle, likesCount: prevArticle.likesCount - 1 }));
      } catch (error) {
        console.error('Error unliking article:', error);
      }
    } else {
      try {
        const axiosInstance = createAxiosInstance(token);
        const response = await axiosInstance.post(`${GatewayUrl}api/article-like/`, {
          article_id: articleId,
        });
        console.log(response.data);
        setIsLiked(true);
        setArticle((prevArticle) => ({ ...prevArticle, likesCount: prevArticle.likesCount + 1 }));
      } catch (error) {
        console.error('Error liking article:', error);
      }
    }
  };

  useEffect(() => {
    const fetchArticle = async () => {
      const response = await axios.get(`${GatewayUrl}api/articles/${articleId}/`);
      setArticle({
        articleId,
        author: `${response.data.user_data.first_name} ${response.data.user_data.last_name}`,
        title: response.data.title,
        content: response.data.content,
        created_at: response.data.created_at,
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

  const handleDeleteArticle = async () => {
    try {
      const axiosInstance = createAxiosInstance(token);
      await axiosInstance.delete(`${GatewayUrl}api/articles/${article.articleId}/`);
      setIsDeleteModalOpen(false);
      setIsArticleDeleted(true);
    } catch (error) {
      console.error('There was an error deleting the article!', error);
    }
  };

  const handleReportArticle = async (formData) => {
    if (!isAuthenticated) {
      setIsReportModalOpen(false);
      setIsLoginModalOpen(true);
      return;
    }
    try {
      const axiosInstance = createAxiosInstance(token);
      await axiosInstance.post(`${GatewayUrl}api/articles/${article.articleId}/reports/`, {
        text: formData.reason
      });
      setIsReportModalOpen(false);
    } catch (error) {
      console.error('There was an error reporting the article!', error);
    }
  };

  const reportFields = [
    {
      name: 'reason',
      label: 'Reason for reporting',
      type: 'textarea',
      required: true
    }
  ];

  const handleProfileClick = () => {
    if (article.author_id === userId) {
      navigate(`/my-profile`);
    } else {
      navigate(`/user-profile/${userId}`);
    }
  };

  if (isArticleDeleted) {
    return (
      <NoContentPage 
        message="This article has been removed by the author."
        linkText="Browse other articles"
        linkHref="/home"
      />
    );
  }

  if (!article) {
    return <LoadSpinner size="medium" text="Fetching data..." />
  }


  return (
    <div className='min-h-screen bg-gray-100 dark:bg-gray-800 p-2 sm:p-4 md:p-6 lg:p-8'>
      <article className="max-w-4xl mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden">
        <header className="p-3 sm:p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4">{article.title}</h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center mb-2 sm:mb-0">
              <img src={`${GatewayUrl}api/user_service/media/${article.profile.split('/media/media/')[1]}`} alt={article.author} 
              className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full mr-2 sm:mr-4 cursor-pointer" 
              onClick={handleProfileClick}/>
              <div>
                <h3 className="text-sm sm:text-base md:text-lg font-medium text-gray-900 dark:text-white cursor-pointer"
                onClick={handleProfileClick}>
                {article.author}
                </h3>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex flex-wrap items-center">
                  <span>Published on {new Date(article.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  <span className="mx-1 hidden sm:inline">•</span>
                  <span>{Math.ceil(article.content.replace(/<[^>]+>/g, '').split(' ').length / 200)} min read</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2 sm:space-x-4">
              <button className={`${Colors.tealBlueGradientIcon}`} title="Share">
                <ShareIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
              </button>
              <button className={`${Colors.tealBlueGradientIcon}`} title="Save">
                <BookmarkIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
              </button>
              {article.author_id !== userId && (
                <>
                  <button className={`${Colors.tealBlueGradientIcon}`} onClick={() => setIsReportModalOpen(true)} title="Report">
                    <FlagIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                  </button>
                  <FormModal
                    isOpen={isReportModalOpen}
                    onClose={() => setIsReportModalOpen(false)}
                    title="Confirm Report"
                    fields={reportFields}
                    onSubmit={handleReportArticle}
                    submitButtonText="Submit Report"
                  />
                </>
              )}
              {article.author_id === userId && (
                <>
                  <button className={`${Colors.tealBlueGradientIcon}`} onClick={() => setIsDeleteModalOpen(true)} title="Delete">
                    <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                  </button>
                  <ConfirmModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    title="Confirm Deletion"
                    message={`Are you sure you want to delete the article "${article.title}"?`}
                    onConfirm={handleDeleteArticle}
                    confirmButtonText="Delete"
                    cancelButtonText="Cancel"
                  />
                  <button className={`${Colors.tealBlueGradientIcon}`} onClick={() => navigate(`/edit-article/${article.articleId}`)} title="Edit">
                    <PencilIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                  </button>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Thumbnail Section */}
        {article.thumbnail && (
          <div className="relative">
            <img src={article.thumbnail.replace('8000', '8002')} alt="Article Thumbnail" className="w-full h-32 sm:h-48 md:h-64 object-cover" />
          </div>
        )}

        <div 
          className="max-w-none p-3 sm:p-4 md:p-6 dark:text-gray-50 prose dark:prose-invert prose-sm sm:prose-base md:prose-lg prose-img:rounded-md prose-a:text-blue-600"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <footer className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between pb-2 sm:pb-4">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button 
                onClick={handleLike}
                className={`${Colors.tealBlueGradientIcon} flex items-center space-x-1 sm:space-x-2 transition-colors duration-200`}
              >
                {isLiked ? (
                  <ThumbUpIconSolid className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-500" />
                ) : (
                  <HandThumbUpIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                )}
                <span className="text-xs sm:text-sm md:text-base">{article.likesCount}</span>
              </button>
              <Modal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                title="Authentication Required"
                message="Please log in to perform this operation."
                primaryButtonText="Log In"
                primaryButtonUrl="/login"
                secondaryButtonText="Cancel"
              />
              <button className={`${Colors.tealBlueGradientIcon} flex items-center space-x-1 sm:space-x-2`}>
                <ChatBubbleLeftIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                <span className="text-xs sm:text-sm md:text-base">{article.commentsCount}</span>
              </button>
            </div>
          </div>
          <div className="flex items-center justify-end">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {formatDistanceToNow(new Date(article.created_at), { addSuffix: true })}
            </p>
          </div>

          {/* Related Tags Section */}
          <div className="mt-2 sm:mt-4">
            <h4 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">Related Topics</h4>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {article.tags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => navigate(`/articles-by-tag/${tag.interest}`)}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs sm:text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  #{tag.interest_name}
                </button>
              ))}
            </div>
          </div>

          <CommentSection articleId={articleId} token={token} />
        </footer>
      </article>
    </div>
  );
};


export default ReadArticle;