import React, { useState } from 'react';
import { Calendar, Clock, Trash2 } from 'lucide-react';
import axios from 'axios';
import { GatewayUrl } from '../../const/urls'; // Adjust the import path as necessary
import { useSelector } from 'react-redux';
import ConfirmModal from '../ComfirmModal';

const getTimeLeft = (startTime, endTime) => {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diff = start - now;

  if (now > end) return 'Meeting Ended';
  if (diff < 0) return 'In progress';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${minutes}m left`;
};

const MeetingCard = ({ meeting, teamId, onDelete }) => {
    const timeLeft = getTimeLeft(meeting.start_time, meeting.end_time);
    const token = useSelector((state) => state.auth.userAccess);
    const [modalIsOpen, setModalIsOpen] = useState(false);
  
    const handleDelete = async () => {
      try {
        await axios.delete(`${GatewayUrl}api/teams/${teamId}/meetings/${meeting.id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        onDelete(meeting.id);
      } catch (error) {
        if (error.response && error.response.status === 204) {
          console.error('deleted');
        } else {
          console.error('Error deleting meeting:', error);
        }
      }
    };
  
    return (
      <div className="bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 rounded-lg shadow-md p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-teal-500" />
              <span className="font-medium text-sm">{new Date(meeting.start_time).toLocaleDateString()}</span>
            </div>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
              timeLeft === 'In progress' ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100' : 
              timeLeft === 'Meeting Ended' ? 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100' :
              'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100'
            }`}>
              {timeLeft}
            </span>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="h-4 w-4 text-teal-500" />
            <span className="text-sm">
              {new Date(meeting.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
              {new Date(meeting.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <h3 className="text-lg font-bold mb-2">{meeting.title}</h3>
          <p className="text-sm mb-4 line-clamp-2">{meeting.description}</p>
        </div>
        <div className="flex justify-between items-center">
          <a 
            href={`/teams/${teamId}/meet?roomID=${meeting.id}`} 
            className="inline-block text-center px-4 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600 transition-colors duration-300"
          >
            Join Meeting
          </a>
          <button 
            onClick={() => setModalIsOpen(true)}
            className="p-2 rounded-md text-gray-500 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900 transition-colors duration-200"
            aria-label="Remove from history"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
  
        <ConfirmModal 
          isOpen={modalIsOpen} 
          onClose={() => setModalIsOpen(false)} 
          title="Confirm Deletion"
          message="Are you sure you want to remove this meeting from your history? This action cannot be undone."
          onConfirm={handleDelete}
          confirmButtonText="Remove"
          cancelButtonText="Cancel"
        />
      </div>
    );
  };
  
  export default MeetingCard;
