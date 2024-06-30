import React from 'react';

const Discussions = () => {
  return (
    <aside className="bg-white dark:bg-gray-800 shadow-md p-4 rounded-md">
  <h2 className="text-xl font-bold mb-4 dark:text-white">Active discussions</h2>
  <ul className="space-y-2">
    <li className="group">
      <a href="#" className="block p-2  group-hover:bg-gray-100 dark:group-hover:bg-gray-700 dark:text-gray-300">Meme Monday</a>
    </li>
    <li className="group">
      <a href="#" className="block p-2  group-hover:bg-gray-100 dark:group-hover:bg-gray-700 dark:text-gray-300">Writing clean code</a>
    </li>
    <li className="group">
      <a href="#" className="block p-2  group-hover:bg-gray-100 dark:group-hover:bg-gray-700 dark:text-gray-300">Best practices for building scalable React applications</a>
    </li>
    <li className="group">
      <a href="#" className="block p-2  group-hover:bg-gray-100 dark:group-hover:bg-gray-700 dark:text-gray-300">I don't need microservices, or do I?</a>
    </li>
    <li className="group">
      <a href="#" className="block p-2  group-hover:bg-gray-100 dark:group-hover:bg-gray-700 dark:text-gray-300">Contributing to open-source projects. Why do you think it's important?</a>
    </li>
  </ul>
  <a href="#" className="text-blue-500 dark:text-blue-400 mt-4 block">More &gt;&gt;&gt;</a>
</aside>

  );
}

export default Discussions;
