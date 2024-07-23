import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import CompactArticle from '../article/CompactArticle';

const UserComments = ({ comments }) => {
  return (
    <div className="space-y-8">
      {comments.map((comment) => (
        <div key={comment.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow hover:scale-101 transition-transform duration-300">
          {comment.article && <CompactArticle article={comment.article} />}
          <p className="mt-2 text-gray-800 dark:text-gray-200">{comment.text}</p>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserComments;
