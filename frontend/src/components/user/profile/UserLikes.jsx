import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import CompactArticle from '../article/CompactArticle';

const UserLikes = ({ likes }) => {
  return (
    <div className="space-y-8">
      {likes.map((like) => {
        const createdAt = new Date(like.created_at);
        const isValidDate = !isNaN(createdAt);

        return (
          <div key={like.id} className="dark:bg-gray-800 transition-transform duration-300">
            {like.article && <CompactArticle article={like.article} />}
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              {isValidDate ? `Liked ${formatDistanceToNow(createdAt, { addSuffix: true })}` : 'Invalid date'}
            </div>
            <hr className="my-4 border-gray-200 dark:border-gray-600" />
          </div>
        );
      })}
    </div>
  );
};

export default UserLikes;
