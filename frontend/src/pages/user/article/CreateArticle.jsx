import React, { useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import { GatewayUrl } from '../../../components/const/urls';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { useLocation, useNavigate } from 'react-router-dom';
import Colors from '../../../components/user/misc/Colors';
import Buttons from '../../../components/user/misc/Buttons';
import Select from 'react-select';
import { UserGroupIcon } from '@heroicons/react/24/solid';

const CreateArticle = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [user_id, setUserId] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [tags, setTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const token = useSelector(state => state.auth.userAccess);
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
  const communityId = location.state?.communityId;
  const communityName = location.state?.communityName;

  useEffect(() => {
    console.log('communityId', communityId);
    const fetchUserId = async () => {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.user_id);
    };
    fetchUserId();

    // Fetch available tags
    const fetchTags = async () => {
      try {
        const response = await axios.get(`${GatewayUrl}api/interests/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setAvailableTags(response.data.map(tag => ({ value: tag.id, label: tag.name })));
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };
    fetchTags();
  }, [token]);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);

    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  const handleEditorChange = (content, editor) => {
    setContent(content);
  };

  const [previewUrl, setPreviewUrl] = useState('');

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('author', user_id);
    formData.append('title', title);
    formData.append('content', content);
    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }
    if (communityId) {
      formData.append('community_id', communityId);
    }
    console.log('Submitting article:', formData);
  
    try {
      const response = await axios.post(`${GatewayUrl}api/articles/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Article created:', response.data);

      // Add tags to the article
      const articleId = response.data.id;
      const tagData = { interest_ids: tags.map(tag => tag.value) };
      console.log('Tag data:', tagData);
      console.log('tags:', tags);
      await axios.post(`${GatewayUrl}api/articles/${articleId}/tags/`, tagData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      setTitle('');
      setContent('');
      setThumbnail(null);
      setTags([]);
      navigate('/home');
    } catch (error) {
      console.error('Error creating article or tags:', error.response?.data || error.message);
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 dark:bg-gray-800 p-4 sm:p-6 lg:p-8'>
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h2 className={`text-3xl font-bold mb-6 ${Colors.tealBlueGradientText}`}>Create New Article</h2>
          {communityId && (
          <div className="flex items-center space-x-2 mb-6">
            <UserGroupIcon className={`w-6 h-6 ${Colors.tealBlueGradientButton} p-1 rounded-full`} />
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">{communityName}</h3>
          </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Content
              </label>
              <Editor
                apiKey="bwdlxfvbfyhel85gm574u32xo6btkf8ngrstzm21syfw6ono"
                init={{
                  height: 500,
                  menubar: true,
                  plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                  toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                  tinycomments_mode: 'embedded',
                  tinycomments_author: 'Author name',
                  skin: isDarkMode ? 'oxide-dark' : 'oxide',
                  content_css: isDarkMode ? 'dark' : 'default',
                }}
                onEditorChange={handleEditorChange}
                key={isDarkMode}
              />
            </div>
            
            <div>
              <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Thumbnail
              </label>
              {previewUrl && (
                <img 
                  src={previewUrl} 
                  alt="Thumbnail preview"   
                  className="mb-2 max-w-xs rounded-md" 
                />
              )}
              <input
                type="file"
                id="thumbnail"
                onChange={handleThumbnailChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                accept="image/*"
              />
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tags
              </label>
              <Select
                isMulti
                name="tags"
                options={availableTags}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={setTags}
                value={tags}
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    backgroundColor: isDarkMode ? '#374151' : 'white',
                    borderColor: isDarkMode ? '#4B5563' : '#D1D5DB',
                  }),
                  menu: (baseStyles) => ({
                    ...baseStyles,
                    backgroundColor: isDarkMode ? '#374151' : 'white',
                  }),
                  option: (baseStyles, state) => ({
                    ...baseStyles,
                    backgroundColor: isDarkMode
                      ? state.isFocused
                        ? '#4B5563'
                        : '#374151'
                      : state.isFocused
                      ? '#F3F4F6'
                      : 'white',
                    color: isDarkMode ? 'white' : 'black',
                  }),
                  multiValue: (baseStyles) => ({
                    ...baseStyles,
                    backgroundColor: isDarkMode ? '#4B5563' : '#E5E7EB',
                  }),
                  multiValueLabel: (baseStyles) => ({
                    ...baseStyles,
                    color: isDarkMode ? 'white' : 'black',
                  }),
                  multiValueRemove: (baseStyles) => ({
                    ...baseStyles,
                    color: isDarkMode ? 'white' : 'black',
                    ':hover': {
                      backgroundColor: isDarkMode ? '#6B7280' : '#D1D5DB',
                      color: isDarkMode ? 'white' : 'black',
                    },
                  }),
                }}
              />
            </div>
            
            <div className="flex items-center justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/home')}
                className={Buttons.cancelButton}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={Buttons.tealBlueGradientButton}
              >
                Create Article
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}; 

export default CreateArticle;