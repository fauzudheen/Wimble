import React from 'react';
import CommunityCard from './CommunityCard';

const MyCommunities = () => {
  // Dummy data for user's joined communities
  const myCommunities = [
    {
      id: 1,
      name: 'Tech Enthusiasts',
      description: 'A community for tech lovers and innovators',
      memberCount: 1500,
      imageUrl: 'https://example.com/tech.jpg',
    },
    {
      id: 4,
      name: 'Book Lovers',
      description: 'Discuss your favorite books and authors',
      memberCount: 3000,
      imageUrl: 'https://example.com/books.jpg',
    },
    // Add more dummy communities here
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
        My Communities
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myCommunities.map((community) => (
          <CommunityCard key={community.id} community={community} />
        ))}
      </div>
    </div>
  );
};

export default MyCommunities;