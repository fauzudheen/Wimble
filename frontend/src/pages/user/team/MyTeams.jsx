import React, { useEffect, useState } from 'react'
import createAxiosInstance from '../../../api/axiosInstance';
import { GatewayUrl } from '../../../components/const/urls';
import { useSelector } from 'react-redux';

const MyTeams = () => {
  const [myTeams, setMyTeams] = useState([]);
  const token = useSelector((state) => state.auth.userAccess);

  useEffect(() => {
    const fetchMyTeams = async () => {
      try {
        const axiosInstance = createAxiosInstance(token);
        const response = await axiosInstance.get(`${GatewayUrl}api/member-teams/`);
        console.log(response.data);
        setMyTeams(response.data);
      } catch (error) {
        console.error('Error fetching my teams:', error);
      }
    };
    fetchMyTeams();
  }, []);
  return (
    <div>
      
    </div>
  )
}

export default MyTeams
