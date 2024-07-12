import React, { useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import { GatewayUrl } from '../../components/const/urls';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const CreateArticle = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [user_id, setUserId] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const token = useSelector(state => state.auth.userAccess);
  const navigate = useNavigate()

  
  useEffect(() => {
    const fetchUserId = async () => {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.user_id);
    };
    fetchUserId();
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
      navigate('/home')
    } catch (error) {
      console.error('Error creating article:', error);
    }
    
  };

  return (
    <div className='min-h-screen bg-gray-100 dark:bg-gray-700 p-10'>
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Create New Article</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white dark:border-gray-600"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="content" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
            Content
          </label>
          <Editor
            apiKey="bwdlxfvbfyhel85gm574u32xo6btkf8ngrstzm21syfw6ono" // TinyMCE API key
            init={{
              height: 500,
              menubar: true,
              plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown',
              toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
              tinycomments_mode: 'embedded',
              tinycomments_author: 'Author name',
            }}
            onEditorChange={handleEditorChange}
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="thumbnail" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
            Thumbnail
          </label>
          <input
            type="file"
            id="thumbnail"
            onChange={handleThumbnailChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white dark:border-gray-600"
            accept="image/*"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create Article
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default CreateArticle;