import React, { useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import createAxiosInstance from '../../../api/axiosInstance';
import { GatewayUrl } from '../../../components/const/urls';
import Colors from '../../../components/user/misc/Colors';
import Buttons from '../../../components/user/misc/Buttons';
import LoadSpinner from '../../../components/user/misc/LoadSpinner';
import { TagIcon } from '@heroicons/react/24/outline';

const EditArticle = () => {
  const { id: articleId } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [currentThumbnail, setCurrentThumbnail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [tags, setTags] = useState([]);
  const [availableInterests, setAvailableInterests] = useState([]);
  const token = useSelector(state => state.auth.userAccess);
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [initialTags, setInitialTags] = useState([]);

  useEffect(() => {
    const fetchArticle = async () => {
        try {
          const axiosInstance = createAxiosInstance(token);
          const response = await axiosInstance.get(`${GatewayUrl}api/articles/${articleId}/`);
          setTitle(response.data.title);
          setContent(response.data.content);
          setCurrentThumbnail(response.data.thumbnail);
          setTags(response.data.tags);
          setInitialTags(response.data.tags.map(tag => tag.interest));
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching article:', error);
          setIsLoading(false);
        }
    };

    const fetchInterests = async () => {
      try {
        const axiosInstance = createAxiosInstance(token);
        const response = await axiosInstance.get(`${GatewayUrl}api/interests/`);
        setAvailableInterests(response.data);
      } catch (error) {
        console.error('Error fetching interests:', error);
      }
    };

    fetchArticle();
    fetchInterests();
  }, [articleId, token]);

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

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
  };

  const handleTagChange = (interestId) => {
    const updatedTags = tags.some(tag => tag.interest === interestId)
      ? tags.filter(tag => tag.interest !== interestId)
      : [...tags, { interest: interestId, interest_name: availableInterests.find(i => i.id === interestId).name }];
    setTags(updatedTags);
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const articleData = new FormData();
    articleData.append('title', title);
    articleData.append('content', content);
    if (thumbnail) {
      articleData.append('thumbnail', thumbnail);
    }
  
    // Determine tags to add and remove
    const currentTagIds = tags.map(tag => tag.interest);
    const tagsToAdd = tags.filter(tag => !initialTags.includes(tag.interest)).map(tag => tag.interest);
    const tagsToRemove = initialTags.filter(id => !currentTagIds.includes(id));
  
    try {
      const axiosInstance = createAxiosInstance(token);
      
      // Update article
      const response = await axiosInstance.patch(`${GatewayUrl}api/articles/${articleId}/`, articleData);
      console.log('Article updated:', response.data);
      
      // Add new tags
      if (tagsToAdd.length > 0) {
        await axiosInstance.post(`${GatewayUrl}api/articles/${articleId}/tags/`, { interest_ids: tagsToAdd }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      }
  
      // Remove old tags
      if (tagsToRemove.length > 0) {
        await axiosInstance.delete(`${GatewayUrl}api/articles/${articleId}/tags/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          data: { interest_ids: tagsToRemove }
        });
      }
  
      navigate(`/article/${articleId}`);
    } catch (error) {
      console.error('Error updating article or tags:', error.response ? error.response.data : error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  
  if (isLoading) {
    return <LoadSpinner size="large" text="Loading article..." />;
  }

  return (
    <div className='min-h-screen bg-gray-100 dark:bg-gray-800 p-4 sm:p-6 lg:p-8'>
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h2 className={`text-3xl font-bold mb-6 ${Colors.tealBlueGradientText}`}>Edit Article</h2>
          
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
                value={content}
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
              {currentThumbnail && (
                <img src={currentThumbnail} alt="Current thumbnail" className="mb-2 max-w-xs rounded-md" />
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {availableInterests.map((interest) => (
                  <button
                    key={interest.id}
                    type="button"
                    onClick={() => handleTagChange(interest.id)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                      tags.some(tag => tag.interest === interest.id)
                        ? 'bg-teal-500 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <TagIcon className="h-4 w-4 mr-1" />
                    {interest.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(`/article/${articleId}`)}
                className={Buttons.cancelButton}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={Buttons.tealBlueGradientButton}
              >
                Update Article
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditArticle;