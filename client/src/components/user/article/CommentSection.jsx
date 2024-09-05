import React, { useEffect, useState, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ArrowUturnLeftIcon, XCircleIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import createAxiosInstance from '../../../api/axiosInstance';
import { GatewayUrl } from '../../const/urls';
import { useSelector } from 'react-redux';
import Modal from '../Modal';
import axios from 'axios';
import Colors from '../misc/Colors';

const CommentSection = ({ articleId, token }) => {
  const [comments, setComments] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const userId = useSelector((state) => state.auth.userId);
  const isAuthenticated = useSelector((state) => state.auth.isUserAuthenticated);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const mainCommentInputRef = useRef(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${GatewayUrl}api/articles/${articleId}/comments/`);
        console.log('Comments:', response.data);
        const nestedComments = nestComments(response.data);
        setComments(nestedComments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [articleId, token]);

  const nestComments = (commentsArray) => {
    const commentMap = {};
    const rootComments = [];

    commentsArray.forEach(comment => {
      commentMap[comment.id] = { ...comment, replies: [] };
    });

    commentsArray.forEach(comment => {
      if (comment.parent && commentMap[comment.parent]) {
        commentMap[comment.parent].replies.push(commentMap[comment.id]);
      } else {
        rootComments.push(commentMap[comment.id]);
      }
    });

    return rootComments;
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
      
      setComments(prevComments => {
        const updatedComments = addNewComment(prevComments, response.data, parentId);
        return updatedComments;
      });
      
      event.target.comment.value = '';
      setReplyingTo(null);
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const addNewComment = (comments, newComment, parentId) => {
    if (!parentId) {
      return [{ ...newComment, replies: [] }, ...comments];
    }

    return comments.map(comment => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [{ ...newComment, replies: [] }, ...comment.replies]
        };
      } else if (comment.replies.length > 0) {
        return {
          ...comment,
          replies: addNewComment(comment.replies, newComment, parentId)
        };
      }
      return comment;
    });
  };

  const handleEditComment = async (commentId, newText) => {
    try {
      const axiosInstance = createAxiosInstance(token);
      await axiosInstance.patch(`${GatewayUrl}api/article-comments/${commentId}/`, {
        text: newText,
      });
      setComments(updateCommentInTree(comments, commentId, { text: newText }));
    } catch (error) {
      console.error('Error editing comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const axiosInstance = createAxiosInstance(token);
      await axiosInstance.delete(`${GatewayUrl}api/article-comments/${commentId}/`);
      setComments(removeCommentFromTree(comments, commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const updateCommentInTree = (commentTree, commentId, updatedFields) => {
    return commentTree.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, ...updatedFields };
      }
      if (comment.replies) {
        return { ...comment, replies: updateCommentInTree(comment.replies, commentId, updatedFields) };
      }
      return comment;
    });
  };

  const removeCommentFromTree = (commentTree, commentId) => {
    return commentTree.filter(comment => {
      if (comment.id === commentId) {
        return false;
      }
      if (comment.replies) {
        comment.replies = removeCommentFromTree(comment.replies, commentId);
      }
      return true;
    });
  };

  const CommentForm = ({ onSubmit, placeholder, inputRef }) => (
    <form onSubmit={onSubmit} className="mt-4">
      <textarea
        name="comment"
        placeholder={placeholder}
        className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out dark:bg-gray-800 dark:text-white dark:border-gray-600 text-sm "
        rows="3"
        ref={inputRef}
      ></textarea>
      <button type="submit" className={`${Colors.tealBlueGradientText} mt-2 mx-4 rounded-md text- font-medium transition-all duration-200 ease-in-out hover:opacity-80`}>
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

  const Comment = ({ comment, depth = 0 }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(comment.text);
    const isOwnComment = userId === comment.user_data.id;
    const [showReplies, setShowReplies] = useState(false);
    const replyInputRef = useRef(null);
  
    const handleReply = () => {
      setReplyingTo(replyingTo === comment.id ? null : comment.id);
      setShowReplies(true); // Always show replies when replying
      setTimeout(() => replyInputRef.current?.focus(), 0);
    };
  
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
  
    const toggleReplies = () => {
      setShowReplies(!showReplies);
    };
  
    return (
      <div className={`bg-white dark:bg-gray-800 p-2 sm:p-3 rounded-lg shadow-md transition-all duration-200 ease-in-out hover:shadow-lg ${depth > 0 ? 'ml-2 sm:ml-4' : ''}`}>
        <div className="flex items-start space-x-1 sm:space-x-2">
          <img src={`${GatewayUrl}api${comment.user_data.profile}`} alt={`${comment.user_data.first_name} ${comment.user_data.last_name}`} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full" />
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h4 className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm truncate">{`${comment.user_data.first_name} ${comment.user_data.last_name}`}</h4>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-0 sm:mt-0">
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
              </span>
            </div>
            {isEditing ? (
              <div className="mt-1">
                <textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="w-full p-1 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 text-xs sm:text-sm"
                  rows="2"
                />
                <div className="mt-1 space-x-1 flex justify-end">
                  <button onClick={handleSaveEdit} className={`${Colors.tealBlueGradientText} px-2 py-1 rounded-md text-xs font-medium`}>Save</button>
                  <button onClick={handleCancelEdit} className="text-gray-600 dark:text-gray-400 px-2 py-1 rounded-md text-xs">Cancel</button>
                </div>
              </div>
            ) : (
              <p className="mt-1 text-gray-700 dark:text-gray-300 text-xs sm:text-sm break-words">{comment.text}</p>
            )}
            <div className="mt-1 flex flex-wrap items-center gap-1 sm:gap-2">
              <button
                onClick={handleReply}
                className="text-xs text-blue-600 dark:text-blue-400 flex items-center transition-all duration-200 ease-in-out hover:text-blue-800 dark:hover:text-blue-300"
              >
                {replyingTo === comment.id ? (
                  <>
                    <XCircleIcon className="h-3 w-3 sm:h-3 sm:w-3 mr-1" />
                    Close
                  </>
                ) : (
                  <>
                    <ArrowUturnLeftIcon className="h-3 w-3 sm:h-3 sm:w-3 mr-1" />
                    Reply
                  </>
                )}
              </button>
              {isOwnComment && (
                <>
                  <button
                    onClick={handleEdit}
                    className="text-xs text-gray-700 dark:text-gray-300 transition-all duration-200 ease-in-out hover:text-green-800 dark:hover:text-green-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-xs text-gray-700 dark:text-gray-300 transition-all duration-200 ease-in-out hover:text-red-800 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </>
              )}
              {comment.replies && comment.replies.length > 0 && (
                <button
                  onClick={toggleReplies}
                  className="text-xs text-blue-600 dark:text-blue-400 flex items-center transition-all duration-200 ease-in-out hover:text-blue-800 dark:hover:text-blue-300"
                >
                  {showReplies ? (
                    <>
                      <ChevronUpIcon className="h-3 w-3 sm:h-3 sm:w-3 mr-1" />
                      Hide Replies
                    </>
                  ) : (
                    <>
                      <ChevronDownIcon className="h-3 w-3 sm:h-3 sm:w-3 mr-1" />
                      Show Replies ({comment.replies.length})
                    </>
                  )}
                </button>
              )}
            </div>
            {replyingTo === comment.id && (
              <div className="mt-2">
                <CommentForm 
                  onSubmit={(e) => {
                    handleSubmitComment(e, comment.id);
                    setReplyingTo(null);
                  }} 
                  placeholder="Write a reply..." 
                  inputRef={replyInputRef}
                />
              </div>
            )}
            {(showReplies || replyingTo === comment.id) && comment.replies && comment.replies.length > 0 && (
              <div className="mt-2 space-y-2">
                {comment.replies.map((reply) => (
                  <Comment key={reply.id} comment={reply} depth={depth + 1} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
    
    return (
      <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
        <h3 className="text-md sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-white">Comments</h3>
        <CommentForm 
          onSubmit={(e) => handleSubmitComment(e)} 
          placeholder="Add a comment..." 
          inputRef={mainCommentInputRef}
        />
    
        <div className="space-y-2 sm:space-y-3">
          {comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </div>
      </div>
    );
    
};

export default CommentSection;