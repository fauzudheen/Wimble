import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GatewayUrl } from '../../const/urls';
import { Card, CardContent, CardHeader, CardTitle, Input, Textarea, Button, Alert, AlertTitle } from '../../ui';
import { User, Shield, Trash2, Save, XCircle, Activity, Upload } from 'lucide-react';
import { useSelector } from 'react-redux';
import createAxiosInstance from '../../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import CustomAlert from '../../ui/CustomAlert';

const TeamSettings = ({ id }) => {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const token = useSelector(state => state.auth.userAccess);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const axiosInstance = createAxiosInstance(token);
        const response = await axiosInstance.get(`${GatewayUrl}api/teams/${id}/`);
        setTeam(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching team data:', error);
        setLoading(false);
      }
    };
    fetchTeam();
  }, [id, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTeam((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrivacyChange = () => {
    setTeam((prev) => ({ ...prev, privacy: prev.privacy === 'public' ? 'private' : 'public' }));
  };

  const handleStatusChange = () => {
    setTeam((prev) => ({ ...prev, status: prev.status === 'active' ? 'inactive' : 'active' }));
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('name', team.name);
    formData.append('description', team.description);
    formData.append('maximum_members', team.maximum_members);
    formData.append('privacy', team.privacy);
    formData.append('status', team.status);
    if (profileImage) {
      formData.append('profile_image', profileImage);
    }

    try {
      const axiosInstance = createAxiosInstance(token);
      const response = await axiosInstance.put(`${GatewayUrl}api/teams/${id}/`, formData);
      console.log('Team updated:', response.data);  
      setSuccess('Team updated successfully');
      setEditMode(false);
    } catch (error) {
      console.error('Error updating team:', error);
      setError('Failed to update team');
    }
  };

  const handleDelete = async () => {
    try {
      const axiosInstance = createAxiosInstance(token);
      await axiosInstance.delete(`${GatewayUrl}api/teams/${id}/`);
      setSuccess('Team deleted successfully');
      console.log('Team deleted');
      navigate('/teams');
    } catch (error) {
      console.error('Error deleting team:', error);
      setError('Failed to delete team');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
    }
  };

  const handleImageRemove = () => {
    setProfileImage(null);
    setTeam((prev) => ({ ...prev, profile_image: null }));
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading team settings...</div>;
  }

  if (!team) {
    return <div className="text-center text-red-500">Failed to load team settings</div>;
  }

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Team Settings</h2>

      <Card className="dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900 dark:text-white">
            <User className="mr-2" />
            Team Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Team Name</label>
              <Input
                id="name"
                name="name"
                value={team.name}
                onChange={handleInputChange}
                disabled={!editMode}
                className="w-full dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="maximum_members" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Maximum Members</label>
              <Input
                id="maximum_members"
                name="maximum_members"
                type="number"
                value={team.maximum_members}
                onChange={handleInputChange}
                disabled={!editMode}
                className="w-full dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <Textarea
                id="description"
                name="description"
                value={team.description}
                onChange={handleInputChange}
                disabled={!editMode}
                className="w-full dark:bg-gray-700 dark:text-white"
                rows={4}
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="profile_image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profile Image</label>
              <div className="flex items-center space-x-4">
                {profileImage || team.profile_image ? (
                  <div className="relative">
                    <img 
                      src={profileImage ? URL.createObjectURL(profileImage) : team.profile_image.replace('8000', '8004')} 
                      alt="Profile" 
                      className="w-24 h-24 object-cover rounded-full" 
                    />
                    {editMode && (
                      <button type="button" onClick={handleImageRemove} className="absolute top-0 right-0 bg-red-500 rounded-full p-1">
                        <XCircle className="w-4 h-4 text-white" />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-400 dark:text-gray-300" />
                  </div>
                )}
                {editMode && (
                  <label className="flex items-center justify-center border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md p-2 cursor-pointer">
                    <Upload className="w-6 h-6 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Upload Image</span>
                    <input
                      id="profile_image"
                      type="file"
                      className="sr-only"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900 dark:text-white">
            <Shield className="mr-2" />
            Privacy Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Team Visibility</span>
            <label className={`relative inline-flex items-center ${editMode ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
              <input
                type="checkbox"
                checked={team.privacy === 'public'}
                onChange={handlePrivacyChange}
                disabled={!editMode}
                className="sr-only"
              />
              <div
                className={`w-10 h-5 rounded-full transition duration-300 ease-in-out ${
                  team.privacy === 'public'
                    ? 'bg-gradient-to-r from-teal-500 to-blue-500' 
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transform transition duration-300 ease-in-out ${
                    team.privacy === 'public' ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </div>
            </label>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {team.privacy === 'public' ? 'Your team is visible to everyone' : 'Your team is only visible to members'}
          </p>
        </CardContent>
      </Card>

      <Card className="dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900 dark:text-white">
            <Activity className="mr-2" />
            Status Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Team Status</span>
            <label className={`relative inline-flex items-center ${editMode ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
              <input
                type="checkbox"
                checked={team.status === 'active'}
                onChange={handleStatusChange}
                disabled={!editMode}
                className="sr-only"
              />
              <div
                className={`w-10 h-5 rounded-full transition duration-300 ease-in-out ${
                  team.status === 'active' 
                    ? 'bg-gradient-to-r from-teal-500 to-blue-500' 
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transform transition duration-300 ease-in-out ${
                    team.status === 'active' ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </div>
            </label>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {team.status === 'active' ? 'The team is currently active' : 'The team is currently inactive'}
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        {editMode ? (
          <>
            <Button onClick={() => setEditMode(false)} className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-700 text-black dark:text-white text-sm">
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-gradient-to-r from-teal-500 to-teal-600 hover:opacity-90 text-white flex text-sm">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </>
        ) : (
          <Button onClick={() => setEditMode(true)} className="bg-gradient-to-r from-teal-500 to-blue-500 hover:opacity-90 text-white text-sm outline-none">
            Edit Team Settings
          </Button>
        )}
      </div>

      <Card className="border-red-500 dark:border-red-700 dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-red-500 dark:text-red-400 flex items-center">
            <Trash2 className="mr-2" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Once you delete a team, there is no going back. Please be certain.
          </p>
          <Button
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:bg-gradient-to-r hover:from-red-600 hover:to-red-700 text-white text-sm"
          >
            Delete Team
          </Button>
        </CardContent>
      </Card>

      {showDeleteConfirm && (
        <Alert variant="destructive" className="dark:bg-red-900 dark:border-red-700">
          <AlertTitle className="dark:text-white">Are you sure you want to delete this team?</AlertTitle>
          <p className="dark:text-gray-300">This action cannot be undone. All data associated with this team will be permanently deleted.</p>
          <div className="mt-4 flex justify-end space-x-4">
            <Button onClick={() => setShowDeleteConfirm(false)} className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-700 text-gray-800 dark:text-white">
              Cancel
            </Button>
            <Button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white">
              Yes, Delete Team
            </Button>
          </div>
        </Alert>
      )}

      {error && (
        <CustomAlert
          type="error"
          message={error}
          onClose={() => setError('')}
        />
      )}
      {success && (
        <CustomAlert
          type="success"
          message={success}
          onClose={() => setSuccess('')}
        />
      )}
    </div>
  );
};

export default TeamSettings;