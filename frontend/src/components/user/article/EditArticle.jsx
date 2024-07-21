import React, { useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import createAxiosInstance from '../../../api/axiosInstance';
import { GatewayUrl } from '../../const/urls';
import Colors from '../misc/Colors';
import Buttons from '../misc/Buttons';
import LoadSpinner from '../misc/LoadSpinner';

const EditArticle = () => {
  const { id: articleId } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [currentThumbnail, setCurrentThumbnail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const token = useSelector(state => state.auth.userAccess);
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const axiosInstance = createAxiosInstance(token);
        const response = await axiosInstance.get(`${GatewayUrl}api/articles/${articleId}/`);
        setTitle(response.data.title);
        setContent(response.data.content);
        setCurrentThumbnail(response.data.thumbnail);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching article:', error);
        setIsLoading(false);
      }
    };

    fetchArticle();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    const articleData = new FormData();
    articleData.append('title', title);
    articleData.append('content', content);
    if (thumbnail) {
      articleData.append('thumbnail', thumbnail);
    }
  
    // Log FormData contents
    for (let [key, value] of articleData.entries()) {
      console.log(key, value);
    }
  
    try {
      const axiosInstance = createAxiosInstance(token);
      const response = await axiosInstance.patch(`${GatewayUrl}api/articles/${articleId}/`, articleData);
      console.log('Article updated:', response.data);
      navigate(`/article/${articleId}`);
    } catch (error) {
      console.error('Error updating article:', error.response ? error.response.data : error.message);
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
                <img src={currentThumbnail.replace('8000', '8002')} alt="Current thumbnail" className="mb-2 max-w-xs rounded-md" />
              )}
              <input
                type="file"
                id="thumbnail"
                onChange={handleThumbnailChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                accept="image/*"
              />
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