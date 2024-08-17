import React, { useState } from 'react';
import Feed from '../../components/user/Feed';
import Discussions from '../../components/user/Discussions';
import Suggestions from '../../components/user/Suggestions';

const Home = () => {
  const [activeTab, setActiveTab] = useState('feed');

  return (
    <div className="w-full flex flex-wrap md:flex-nowrap">
      <div className="w-full md:w-3/4">
        <div className="md:hidden flex justify-around mb-4">
          <button
            className={`w-1/2 text-sm p-2 ${activeTab === 'feed' ? 'font-bold border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('feed')}
          >
            Feeds
          </button>
          <button
            className={`w-1/2 text-sm p-2 ${activeTab === 'discussions' ? 'font-bold border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('discussions')}
          >
            Suggestions
          </button>
        </div>
        {activeTab === 'feed' && <Feed />}
      </div>
      <div className={`w-full md:w-1/4 ${activeTab === 'discussions' ? '' : 'hidden md:block'}`}>
        <Suggestions />
      </div>
    </div>
  );
};

export default Home;
