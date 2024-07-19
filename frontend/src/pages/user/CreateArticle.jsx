import React, { useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import { GatewayUrl } from '../../components/const/urls';
import { useSelector } from 'react-redux';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Colors from '../../components/user/misc/Colors';
import Buttons from '../../components/user/misc/Buttons';

const CreateArticle = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [user_id, setUserId] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const token = useSelector(state => state.auth.userAccess);
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.user_id);
    };
    fetchUserId();
  }, [token]);

  useEffect(() => {
    // Check if dark mode is active
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);

    // Optional: Listen for changes in dark mode
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
    const articleData = {
      author: user_id,
      title,
      content,
      thumbnail
    };

    console.log('Submitting article:', articleData);

    try {
      const response = await axios.post(`${GatewayUrl}api/articles/`, articleData);
      console.log('Article created:', response.data);
      setTitle('');
      setContent('');
      setThumbnail(null);
      navigate('/home');
    } catch (error) {
      console.error('Error creating article:', error);
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 dark:bg-gray-800 p-4 sm:p-6 lg:p-8'>
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h2 className={`text-3xl font-bold mb-6 ${Colors.tealBlueGradientText}`}>Create New Article</h2>
          
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
                key={isDarkMode} // Re-render Editor component when isDarkMode changes
              />
            </div>
            
            <div>
              <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Thumbnail
              </label>
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
