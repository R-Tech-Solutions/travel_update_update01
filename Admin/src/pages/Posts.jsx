import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [formData, setFormData] = useState({
    post_title: '',
    post_content: '',
    post_image: null
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:8000/api/posts/');
      setPosts(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        post_image: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('post_title', formData.post_title);
      formDataToSend.append('post_content', formData.post_content);
      if (formData.post_image) {
        formDataToSend.append('post_image', formData.post_image);
      }

      if (editingId) {
        // Update existing post
        await axios.put(`http://127.0.0.1:8000/api/posts/${editingId}/update/`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // Create new post
        await axios.post('http://127.0.0.1:8000/api/posts/create/', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      // Reset form and fetch updated posts
      setFormData({
        post_title: '',
        post_content: '',
        post_image: null
      });
      setEditingId(null);
      e.target.reset();
      fetchPosts();
      setError(null);
    } catch (err) {
      setError(editingId ? 'Failed to update post' : 'Failed to create post');
      console.error('Error saving post:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (post) => {
    setFormData({
      post_title: post.post_title,
      post_content: post.post_content,
      post_image: null
    });
    setEditingId(post.id);
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        setLoading(true);
        await axios.delete(`http://127.0.0.1:8000/api/posts/${postId}/delete/`);
        fetchPosts();
        setError(null);
      } catch (err) {
        setError('Failed to delete post');
        console.error('Error deleting post:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create Blog Posts</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Post Title
          </label>
          <input
            type="text"
            name="post_title"
            value={formData.post_title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <textarea
            name="post_content"
            value={formData.post_content}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image
          </label>
          <input
            type="file"
            name="post_image"
            onChange={handleImageChange}
            accept="image/*"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={!editingId}
          />
          {formData.post_image && (
            <div className="mt-2">
              <img 
                src={typeof formData.post_image === 'string' ? formData.post_image : URL.createObjectURL(formData.post_image)} 
                alt="Preview" 
                className="w-32 h-32 object-cover rounded-md"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Processing...' : editingId ? 'Update Post' : 'Add Post'}
        </button>
      </form>

      {/* Display existing posts */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Added Posts</h2>
        {loading && !posts.length ? (
          <div className="text-center py-4">Loading posts...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white p-4 rounded-lg shadow-md relative">
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(post)}
                    className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <h3 className="text-xl font-semibold mb-2 pr-16">{post.post_title}</h3>
                <p className="text-gray-600 mb-4">{post.post_content}</p>
                {post.post_image && (
                  <img 
                    src={`http://127.0.0.1:8000${post.post_image}`}
                    alt={post.post_title} 
                    className="w-full h-48 object-cover rounded-md"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Posts;
