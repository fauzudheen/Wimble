import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { GatewayUrl } from '../../const/urls';
import axios from 'axios';

const UserActivites = () => {
  const { id } = useParams(); 
  const location = useLocation();
  const isMyProfile = location.pathname === '/my-profile'; 
  const userId = isMyProfile ? useSelector(state => state.auth.userId) : id;

  const [skillCount, setSkillCount] = useState('');
  const [articleCount, setArticleCount] = useState('');
  const [commentCount, setCommentCount] = useState('');

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`${GatewayUrl}api/users/${userId}/`);
      setSkillCount(response.data.skill_count);
    } catch (err) {
      console.error("Error getting User", err);
    }
  };

  const fetchUserInteractions = async () => {
    try {
      const response = await axios.get(`${GatewayUrl}api/user-interactions/${userId}/`);
      setArticleCount(response.data.articles.length);
      setCommentCount(response.data.comments.length);
    } catch (err) {
      console.error("Error fetching user interactions", err);
    }
  };

  useEffect(() => {
    fetchUserDetails();
    fetchUserInteractions();
  }, [userId]);
  
  return (
    <div className="mb-4 bg-white dark:bg-gray-800 p-6 rounded-md shadow-md">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Activity</h2>
      <ul className="space-y-2 text-gray-600 dark:text-gray-300">
        <li>{articleCount} posts</li>
        <li>{commentCount} comments</li>
        <li>{skillCount} skills</li>
      </ul>
    </div>
  )
}

export default UserActivites
