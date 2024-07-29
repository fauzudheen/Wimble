import React, { useEffect, useState, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ArrowUturnLeftIcon, PencilIcon, TrashIcon, XCircleIcon } from '@heroicons/react/24/outline';
import createAxiosInstance from '../../../api/axiosInstance';
import { GatewayUrl } from '../../const/urls';
import { useSelector } from 'react-redux';
import Modal from '../Modal';
import axios from 'axios';
import Colors from '../misc/Colors';

const CommentSection = ({ articleId, token }) => {
  const [comments, setComments] = useState([]);
  const [visibleComments, setVisibleComments] = useState(3);
  const [replyingTo, setReplyingTo] = useState(null);
  const commentInputRef = useRef(null);
  const userId = useSelector((state) => state.auth.userId);
  const isAuthenticated = useSelector((state) => state.auth.isUserAuthenticated);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${GatewayUrl}api/articles/${articleId}/comments/`);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [articleId, token]);

  const handleLoadMoreComments = () => {
    setVisibleComments((prevVisible) => prevVisible + 3);
  };

  const handleReply = (commentId) => {
    setReplyingTo(commentId === replyingTo ? null : commentId);
    setTimeout(() => commentInputRef.current?.focus(), 0);
  };

  const handleSubmitComment = async (event, parentId = null) => {
    event.preventDefault();
    if (!isAuthenticated) {
      setIsModalOpen(true);
      return;
    }
    const content = event.target.comment.value;
    if (!content.trim()) return;

    try {
      const axiosInstance = createAxiosInstance(token);
      const response = await axiosInstance.post(`${GatewayUrl}api/articles/${articleId}/comments/`, {
        text: content,
        parent_id: parentId,
      });
      setComments((prevComments) => [response.data, ...prevComments]);
      event.target.comment.value = '';
      setReplyingTo(null);
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleEditComment = async (commentId, newText) => {
    try {
      const axiosInstance = createAxiosInstance(token);
      const response = await axiosInstance.patch(`${GatewayUrl}api/article-comments/${commentId}/`, {
        text: newText,
      });
      setComments(comments.map(comment =>
        comment.id === commentId ? { ...comment, text: newText } : comment
      ));
    } catch (error) {
      console.error('Error editing comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const axiosInstance = createAxiosInstance(token);
      await axiosInstance.delete(`${GatewayUrl}api/article-comments/${commentId}/`);
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const CommentForm = ({ onSubmit, placeholder }) => (
    <form onSubmit={onSubmit} className="mt-4">
      <textarea
        name="comment"
        placeholder={placeholder}
        className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out dark:bg-gray-700 dark:text-white dark:border-gray-600 text-sm sm:text-base"
        rows="3"
        ref={commentInputRef}
      ></textarea>
      <button type="submit" className={`${Colors.tealBlueGradientText} mt-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ease-in-out hover:opacity-80`}>
        Post Comment
      </button>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Authentication Required"
        message="Please log in to perform this operation."
        primaryButtonText="Log In"
        primaryButtonUrl="/login"
        secondaryButtonText="Cancel"
      />
    </form>
  );

  const Comment = ({ comment }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(comment.text);
    const isOwnComment = userId === comment.user_data.id;

    const handleEdit = () => {
      setIsEditing(true);
    };

    const handleSaveEdit = () => {
      handleEditComment(comment.id, editedText);
      setIsEditing(false);
    };

    const handleCancelEdit = () => {
      setEditedText(comment.text);
      setIsEditing(false);
    };

    return (
      <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-md transition-all duration-200 ease-in-out hover:shadow-lg">
        <div className="flex items-start space-x-2 sm:space-x-3">
          <img src={`${GatewayUrl}api/user_service/media/${comment.user_data.profile.split('/media/media/')[1]}`} alt={`${comment.user_data.first_name} ${comment.user_data.last_name}`} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">{`${comment.user_data.first_name} ${comment.user_data.last_name}`}</h4>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
              </span>
            </div>
            {isEditing ? (
              <div className="mt-2">
                <textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 text-sm sm:text-base"
                  rows="3"
                />
                <div className="mt-2 space-x-2 flex justify-end">
                  <button onClick={handleSaveEdit} className={`${Colors.tealBlueGradientText} px-3 py-1 rounded-md text-sm font-medium`}>Save</button>
                  <button onClick={handleCancelEdit} className="text-gray-600 dark:text-gray-400 px-3 py-1 rounded-md text-sm">Cancel</button>
                </div>
              </div>
            ) : (
              <p className="mt-1 text-gray-700 dark:text-gray-300 text-sm sm:text-base break-words">{comment.text}</p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-4">
              <button
                onClick={() => handleReply(comment.id)}
                className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 flex items-center transition-all duration-200 ease-in-out hover:text-blue-800 dark:hover:text-blue-300"
              >
                {replyingTo === comment.id ? (
                  <>
                    <XCircleIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Close
                  </>
                ) : (
                  <>
                    <ArrowUturnLeftIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Reply
                  </>
                )}
              </button>
              {isOwnComment && (
                <>
                  <button
                    onClick={handleEdit}
                    className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 transition-all duration-200 ease-in-out hover:text-green-800 dark:hover:text-green-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 transition-all duration-200 ease-in-out hover:text-red-800 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
            {replyingTo === comment.id && (
              <div className="mt-3">
                <CommentForm onSubmit={(e) => handleSubmitComment(e, comment.id)} placeholder="Write a reply..." />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
      <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">Comments</h3>
      <CommentForm onSubmit={(e) => handleSubmitComment(e)} placeholder="Add a comment..." />

      <div className="space-y-3 sm:space-y-4">
        {comments.slice(0, visibleComments).map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>

      {visibleComments < comments.length && (
        <button onClick={handleLoadMoreComments} className="mt-3 sm:mt-4 w-full py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
          Load More Comments
        </button>
      )}
    </div>
  );
};

export default CommentSection;
