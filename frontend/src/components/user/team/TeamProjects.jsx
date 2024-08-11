import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useOutletContext } from 'react-router-dom';
import { GatewayUrl } from '../../const/urls';
import createAxiosInstance from '../../../api/axiosInstance';

const TeamProjects = () => {
  const { id: teamId } = useOutletContext();
  const userId = useSelector((state) => state.auth.userId);
  const [userIds, setUserIds] = useState([]);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const token = useSelector((state) => state.auth.userAccess);

  const fetchTeam = async () => {
    try {
      const axiosInstance = createAxiosInstance(token);
      const response = await axiosInstance.get(`${GatewayUrl}api/teams/${teamId}/`);
      if (response.data.request_status && response.data.request_status === 'accepted') {
        showJoinDialog(false);
      } else {
        setShowJoinDialog(true);
      }
    } catch (error) {
      console.error('Error fetching team data:', error);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);



  return (
    <div>
      {showJoinDialog && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 max-w-sm w-full mx-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Unauthorized</h2>
            <p className="text-sm text-gray-800 dark:text-gray-300 mt-3">
              You are not a member of this team and cannot access this resource. Please contact your team administrator to be added as a member.
            </p>
            <div className="flex justify-end mt-3">
              <Link to={`/teams/${teamId}/overview`}>
                <button className="rounded-md px-3 py-2 text-sm font-medium bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600">
                  Go Back to Overview
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamProjects;
