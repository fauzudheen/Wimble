import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';
import { GatewayUrl } from '../../const/urls';
import Colors from '../Colors';
import { HandThumbUpIcon, ChatBubbleLeftIcon, FlagIcon , ShareIcon, BookmarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import { HandThumbUpIcon as ThumbUpIconSolid } from '@heroicons/react/24/solid';
import createAxiosInstance from '../../../api/axiosInstance';
import { useSelector } from 'react-redux';
import CommentSection from './CommentSection';
import Modal from '../Modal';
import ConfirmModal from '../ComfirmModal';
import NoContentPage from '../misc/NoContentPage';
import SkeletonLoader from '../misc/SkeletonLoader';

const ReadArticle = () => {
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
      console.log(response.data)
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
  }, []);

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
  }

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

  const handleReportArticle = async () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    try {
      const axiosInstance = createAxiosInstance(token);
      await axiosInstance.post(`${GatewayUrl}api/article-report/`, {
        article_id: articleId
      });
      setIsReportModalOpen(false);
    } catch (error) {
      console.error('There was an error reporting the article!', error);
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
    return <SkeletonLoader type="article" count={1} />;
  }


  return (
    <div className='min-h-screen bg-gray-100 dark:bg-gray-800 p-4 sm:p-6 md:p-10'>
      <article className="max-w-4xl mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden">
        <header className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">{article.title}</h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center mb-4 sm:mb-0">
              <img src={article.profile} alt={article.author} className="h-12 w-12 rounded-full mr-4" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{article.author}</h3>
                <div className="text-sm text-gray-600 dark:text-gray-400 flex flex-wrap items-center">
                  <span>Published on {new Date(article.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  <span className="mx-2 hidden sm:inline">•</span>
                  <span>{Math.ceil(article.content.replace(/<[^>]+>/g, '').split(' ').length / 200)} min read</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-4">
              <button className={`${Colors.tealBlueGradientIcon}`}>
                <ShareIcon className="h-6 w-6" />
              </button>
              <button className={`${Colors.tealBlueGradientIcon}`}>
                <BookmarkIcon className="h-6 w-6" />
              </button>
              <button className={`${Colors.tealBlueGradientIcon}`} onClick={() => setIsReportModalOpen(true)}>
                <FlagIcon className="h-6 w-6" />
              </button>
              <ConfirmModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                title="Confirm Report"
                message={`Are you sure you want to report the article "${article.title}"?`}
                onConfirm={handleReportArticle}
                confirmButtonText="Report"
                cancelButtonText="Cancel"
              />
              {article.author_id === userId && (
                <>
                  <button className={`${Colors.tealBlueGradientIcon}`} onClick={() => setIsDeleteModalOpen(true)}>
                    <TrashIcon className="h-6 w-6" />
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
                </>
              )}
            </div>
          </div>
        </header>
        
        <div 
          className="max-w-none p-6 dark:text-gray-50"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <footer className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between pb-4">
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleLike}
                className={`${Colors.tealBlueGradientIcon} flex items-center space-x-2 transition-colors duration-200`}
              >
                {isLiked ? (
                  <ThumbUpIconSolid className="h-6 w-6 text-blue-500" />
                ) : (
                  <HandThumbUpIcon className="h-6 w-6" />
                )}
                <span>{article.likesCount}</span>
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
              <button className={`${Colors.tealBlueGradientIcon} flex items-center space-x-2`}>
                <ChatBubbleLeftIcon className="h-6 w-6" />
                <span>{article.commentsCount}</span>
              </button>
            </div>
          </div>
          <div className="flex items-center justify-end">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {formatDistanceToNow(new Date(article.created_at), { addSuffix: true })}
            </p>
          </div>

          <CommentSection articleId={articleId} token={token} />
        </footer>
      </article>
    </div>
  );
};

export default ReadArticle;