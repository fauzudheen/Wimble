import { PencilIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react'
import EditSkillsModal from './EditSkillsModal';
import axios from 'axios';
import { GatewayUrl } from '../../const/urls';
import { useSelector } from 'react-redux';

const UserSkills = () => {
  const [showAll, setShowAll] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userSkills, setUserSkills] = useState([]);
  const userId = useSelector(state => state.auth.userId);

  useEffect(() => {
    const fetchUserSkills = async () => {
      try {
        const response = await axios.get(`${GatewayUrl}/api/users/${userId}/skills/`);
        console.log("userid", userId);
        console.log("user skills", response.data);
        setUserSkills(response.data);
      } catch (error) {
        console.error('Error fetching user skills:', error);
      }
    };
    fetchUserSkills();
  }, [userId]);

  const handleCloseModal = (updatedUserSkills) => {
    setIsEditing(false);
    if (updatedUserSkills) {
      setUserSkills(updatedUserSkills);
    }
  };

  return (
    <div className='mb-4 bg-white dark:bg-gray-800 p-6 rounded-md shadow-md'>
      <div className='flex justify-between mb-2'> 
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Skills</h2>
        <button 
          onClick={() => setIsEditing(true)} 
          className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
          aria-label="Edit Skills"
        >
          <PencilIcon className="h-5 w-5" />
        </button>
      </div>
      <ul className="space-y-2 text-gray-600 dark:text-gray-300">
        {userSkills.slice(0, showAll ? userSkills.length : 4).map((userSkill) => (
          <li key={userSkill.id}>{userSkill.skill_name}</li>
        ))}
      </ul>
      {userSkills.length > 4 && (
        <button 
          className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Show less" : "Show more"}
        </button>
      )}
      <EditSkillsModal
        isOpen={isEditing}
        onClose={handleCloseModal}
        initialUserSkills={userSkills}
      />
    </div>
  )
}

export default UserSkills