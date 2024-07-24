import React, { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import CommunityCard from './CommunityCard';
import Buttons from '../../../components/user/misc/Buttons';
import Colors from '../../../components/user/misc/Colors';

const FindCommunity = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Dummy data for all communities
  const allCommunities = [
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
    {
      id: 4,
      name: 'Book Lovers',
      description: 'Discuss your favorite books and authors',
      memberCount: 3000,
      imageUrl: 'https://example.com/books.jpg',
    },
    // Add more dummy communities here
  ];

  const filteredCommunities = allCommunities.filter((community) =>
    community.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search communities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <MagnifyingGlassIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
      {filteredCommunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommunities.map((community) => (
            <CommunityCard key={community.id} community={community} />
          ))}
        </div>
      ) : (
        <p className={`text-center ${Colors.tealBlueGradientText}`}>
          No communities found. Try a different search term.
        </p>
      )}
    </div>
  );
};

export default FindCommunity;