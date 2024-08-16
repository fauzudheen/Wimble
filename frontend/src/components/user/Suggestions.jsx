import React from 'react';

const Suggestions = () => {
  const suggestedArticles = [
    { id: 1, title: "How to Learn React Fast", link: "#" },
    { id: 2, title: "Understanding Django Channels", link: "#" },
    { id: 3, title: "Why Microservices?", link: "#" }
  ];

  const peopleToFollow = [
    { id: 1, name: "John Doe", link: "#" },
    { id: 2, name: "Jane Smith", link: "#" },
    { id: 3, name: "Chris Lee", link: "#" }
  ];

  const trendingHashtags = [
    { id: 1, tag: "#React", link: "#" },
    { id: 2, tag: "#Django", link: "#" },
    { id: 3, tag: "#Microservices", link: "#" }
  ];

  return (
    <aside className="bg-white dark:bg-gray-800 shadow-md p-4 rounded-md">
      <section className="mb-4">
        <h2 className="text-xl font-bold dark:text-white">Suggested Articles</h2>
        <ul className="space-y-2 mt-2">
          {suggestedArticles.map(article => (
            <li key={article.id}>
              <a href={article.link} className="block p-2 group-hover:bg-gray-100 dark:group-hover:bg-gray-700 dark:text-gray-300">
                {article.title}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-bold dark:text-white">People to Follow</h2>
        <ul className="space-y-2 mt-2">
          {peopleToFollow.map(person => (
            <li key={person.id}>
              <a href={person.link} className="block p-2 group-hover:bg-gray-100 dark:group-hover:bg-gray-700 dark:text-gray-300">
                {person.name}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-bold dark:text-white">Trending Hashtags</h2>
        <ul className="space-y-2 mt-2">
          {trendingHashtags.map(tag => (
            <li key={tag.id}>
              <a href={tag.link} className="block p-2 group-hover:bg-gray-100 dark:group-hover:bg-gray-700 dark:text-gray-300">
                {tag.tag}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <a href="#" className="text-blue-500 dark:text-blue-400 mt-4 block">Explore More &gt;&gt;&gt;</a>
    </aside>
  );
};

export default Suggestions;
