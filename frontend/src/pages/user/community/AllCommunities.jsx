import React from 'react';
import CommunityCard from './CommunityCard';

const AllCommunities = () => {
  // Dummy data for communities
  const communities = [
    {
      id: 1,
      name: 'Tech Enthusiasts',
      description: 'A community for tech lovers and innovators',
      memberCount: 1500,
      imageUrl: 'https://example.com/tech.jpg',
    },
    {
      id: 2,
      name: 'Foodies United',
      description: 'Explore cuisines from around the world',
      memberCount: 2200,
      imageUrl: 'https://example.com/food.jpg',
    },
    {
      id: 3,
      name: 'Fitness Fanatics',
      description: 'Share tips and motivate each other to stay fit',
      memberCount: 1800,
      imageUrl: 'https://example.com/fitness.jpg',
    },
    // Add more dummy communities here
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {communities.map((community) => (
        <CommunityCard key={community.id} community={community} />
      ))}
    </div>
  );
};

export default AllCommunities;