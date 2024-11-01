import React from 'react';
import {
  UserGroupIcon,
  NewspaperIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  HeartIcon,
  UserPlusIcon,
  LightBulbIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const Feature = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
    <Icon className="w-12 h-12 text-teal-500 dark:text-teal-400 mb-4" />
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-sm text-gray-600 dark:text-gray-300 text-center">{description}</p>
  </div>
);

const About = () => {
  const features = [
    {
      icon: NewspaperIcon,
      title: "Article Sharing",
      description: "Share your expertise and insights with the IT community through well-crafted articles.",
    },
    {
      icon: UserGroupIcon,
      title: "Communities",
      description: "Create and join communities focused on specific IT topics or technologies.",
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: "Team Collaboration",
      description: "Conduct meetings and chat with team members in a professional environment.",
    },
    {
      icon: HeartIcon,
      title: "Engagement",
      description: "Like, comment, and follow content and users that interest you.",
    },
    {
      icon: BellIcon,
      title: "Notifications",
      description: "Stay updated with customizable notification preferences.",
    },
    {
      icon: LightBulbIcon,
      title: "Knowledge Sharing",
      description: "Learn from peers and industry experts through shared articles and discussions.",
    },
  ];

  return (
    <div className="bg-gray-100 dark:bg-black min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">Wimble</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            The social media platform for IT professionals to connect, collaborate, and grow together.
          </p>
        </div>

        <div className="mt-10 text-center">
          <div className="mt-4 flex justify-center">
            <div className="inline-flex rounded-md shadow">
            <Link to="/">
                <div className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600">
                    <UserPlusIcon className="w-5 h-5 mr-2" />
                    Get Started
                </div>
            </Link>
            </div>
          </div>
        </div>
        <div className="mt-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Feature key={index} {...feature} />
            ))}
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default About;