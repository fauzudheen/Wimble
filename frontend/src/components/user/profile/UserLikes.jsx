import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import CompactArticle from '../article/CompactArticle';

const UserLikes = ({ likes }) => {
  return (
    <div className="space-y-8">
      {likes.map((like) => (
        <div key={like.id} className="dark:bg-gray-800 p-4 rounded-lg shadow transition-transform duration-300">
          {like.article && <CompactArticle article={like.article} />}
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Liked {formatDistanceToNow(new Date(like.created_at), { addSuffix: true })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserLikes;
