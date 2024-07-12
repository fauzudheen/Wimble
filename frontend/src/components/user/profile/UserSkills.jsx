import React from 'react'

const UserSkills = () => {
  const [showAll, setShowAll] = React.useState(false);
  const skills = [
    "Python (Programming language)",
    "Django",
    "Orm",
    "Web Development",
    "React",
    "JavaScript",
    "SQL",
    "Git"
  ];

  return (
    <div className='bg-white p-6 rounded-md shadow-md mb-10'>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Skills</h2>
      <ul className="space-y-2 text-gray-600 dark:text-gray-400">
        {skills.slice(0, showAll ? skills.length : 4).map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>
      {skills.length > 4 && (
        <button 
          className="mt-4 text-teal-600 dark:text-teal-400 hover:underline"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  )
}

export default UserSkills
