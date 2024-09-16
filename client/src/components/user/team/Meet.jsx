import React, { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import axios from 'axios';
import { GatewayUrl } from '../../const/urls';
import { zegoAppId, zegoServerSecret } from '../../const/config';

function randomID(len) {
  let result = '';
  const chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP';
  const maxPos = chars.length;
  len = len || 5;
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

export function getUrlParams(url = window.location.href) {
  const urlStr = url.split('?')[1];
  return new URLSearchParams(urlStr || '');
}

const Meet = () => {
  const { id: teamId } = useOutletContext();
  const userId = useSelector((state) => state.auth.userId);
  const roomID = getUrlParams().get('roomID') || randomID(5);
  const [teamMembers, setTeamMembers] = useState([]);
  const [userIds, setUserIds] = useState([]);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [user, setUser] = useState({});

  const fetchTeamMembers = async () => {
    try {
      const { data } = await axios.get(`${GatewayUrl}api/teams/${teamId}/members/`);
      const acceptedMembers = data.filter((m) => m.request_status === 'accepted');
      setTeamMembers(acceptedMembers);
      setUserIds(acceptedMembers.map((m) => m.user));
      console.log('team members', acceptedMembers);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${GatewayUrl}api/users/${userId}/`);
        console.log(data);
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, [userId]);

  useEffect(() => {
    // Wait until user data is available before initializing Zego
    if (user.first_name && user.last_name) {
      if (!userIds.includes(userId)) {
        setShowJoinDialog(true);
        return;
      }

      const appID = zegoAppId;
      const serverSecret = zegoServerSecret;
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, randomID(5), `${user.first_name} ${user.last_name}`);

      const zp = ZegoUIKitPrebuilt.create(kitToken);

      zp.joinRoom({
        container: document.querySelector('.myCallContainer'),
        sharedLinks: [
          {
            name: 'Personal link',
            url: `${window.location.protocol}//${window.location.host}${window.location.pathname}?roomID=${roomID}`,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.GroupCall,
        },
      });

      return () => {
        zp?.destroy();
      };
    }
  }, [user, roomID, userIds, userId]);

  return (
    <div className="myCallContainer text-gray-900 dark:text-gray-100 p-4">
      {showJoinDialog && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 max-w-sm w-full mx-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Unauthorized</h2>
            <p className="text-sm text-gray-800 dark:text-gray-300 mt-3">
              You are not a member of this team and cannot join the meeting. Please contact your team administrator to be added as a member.
            </p>
            <div className="flex justify-end mt-3">
              <Link to={`/teams/${teamId}/overview`}>
                <button className="rounded-md px-3 py-2 text-sm font-medium bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600">
                  Go Back to Team
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Meet;
