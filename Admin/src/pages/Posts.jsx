import React, { useState, useEffect } from "react";
import axios from "axios";
import { BackendUrl } from "../BackendUrl.jsx";
// import imageCompression from "browser-image-compression";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [formData, setFormData] = useState({
    post_title: "",
    post_content: "",
    post_image: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cloudinary cloud name must match backend settings
  const CLOUDINARY_CLOUD_NAME = "djbf0hou3";

  // Normalize image URL from backend (Cloudinary or Django media)
  const getImageUrl = (img) => {
    if (!img) {
      console.warn("Image is null or undefined, using fallback");
      return "https://via.placeholder.com/300";
    }
    if (typeof img === "string" && (img.startsWith("http://") || img.startsWith("https://"))) {
      return img;
    }
    if (typeof img === "object" && img !== null) {
      if (img instanceof File) return URL.createObjectURL(img);
      if (typeof img.url === "string") return getImageUrl(img.url);
      if (typeof img.post_image === "string") return getImageUrl(img.post_image);
    }
    if (typeof img === "string") {
      const cleanPath = img.startsWith("/") ? img.substring(1) : img;
      if (cleanPath.startsWith("media/") || cleanPath.startsWith("static/")) {
        return `${BackendUrl}/${cleanPath}`;
      }
      const hasDeliveryPrefix = /^(image|video|raw)\//.test(cleanPath);
      const cloudinaryPath = hasDeliveryPrefix ? cleanPath : `image/upload/${cleanPath}`;
      return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/${cloudinaryPath}`;
    }
    console.warn("Image format invalid, using fallback");
    return "https://via.placeholder.com/300";
  };

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BackendUrl}/api/posts/`);
      console.log("Fetch posts response:", response.data);
      const posts = Array.isArray(response.data) ? response.data : [];
      posts.forEach((post, index) => {
        console.log(`Post ${index + 1}:`, {
          id: post.id,
          title: post.post_title,
          image: post.post_image,
          normalizedUrl: getImageUrl(post.post_image),
        });
      });
      setPosts(posts);
      setError(null);
    } catch (err) {
      setError("Failed to fetch posts");
      console.error("Error fetching posts:", err.response || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Compress image before upload
  const compressImage = async (file) => {
    try {
      const options = {
        maxSizeMB: 5,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      console.log("Compressed file size:", compressedFile.size / 1024 / 1024, "MB");
      return compressedFile;
    } catch (error) {
      console.error("Error compressing image:", error);
      return file;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected image file:", file);
    if (!file) {
      setError("No file selected. Please choose an image.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (e.g., JPG, PNG).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit. Please compress or resize the image.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      post_image: file,
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let { post_image } = formData;
      if (post_image && post_image.size > 5 * 1024 * 1024) {
        post_image = await compressImage(post_image);
        if (post_image.size > 10 * 1024 * 1024) {
          setError("Compressed file size exceeds 10MB limit. Please use a smaller image.");
          setLoading(false);
          return;
        }
      }

      const formDataToSend = new FormData();
      formDataToSend.append("post_title", formData.post_title);
      formDataToSend.append("post_content", formData.post_content);
      if (post_image) {
        formDataToSend.append("post_image", post_image);
      }

      for (let [key, value] of formDataToSend.entries()) {
        console.log(`FormData: ${key} =`, value);
      }

      if (editingId) {
        await axios.put(`${BackendUrl}/api/posts/${editingId}/update/`, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await axios.post(`${BackendUrl}/api/posts/create/`, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      setFormData({
        post_title: "",
        post_content: "",
        post_image: null,
      });
      setEditingId(null);
      e.target.reset();
      fetchPosts();
      setError(null);
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.post_image?.[0] ||
        (editingId ? "Failed to update post" : "Failed to create post");
      setError(errorMessage);
      console.error("Error saving post:", err.response || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (post) => {
    setFormData({
      post_title: post.post_title,
      post_content: post.post_content,
      post_image: post.post_image,
    });
    setEditingId(post.id);
  };

  const handleDelete = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        setLoading(true);
        await axios.delete(`${BackendUrl}/api/posts/${postId}/delete/`);
        fetchPosts();
        setError(null);
      } catch (err) {
        setError("Failed to delete post");
        console.error("Error deleting post:", err.response || err.message);
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Post Title</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Image (JPG, PNG, up to 10MB)</label>
          <input
            type="file"
            name="post_image"
            onChange={handleImageChange}
            accept="image/*"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={!editingId}
          />
          {(formData.post_image || (editingId && formData.post_image)) && (
            <div className="mt-2">
              <img
                src={getImageUrl(formData.post_image)}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-md"
                onError={(e) => {
                  console.error("Error loading preview image:", e);
                  e.target.src = "https://via.placeholder.com/150";
                }}
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Processing..." : editingId ? "Update Post" : "Add Post"}
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Added Posts</h2>
        {loading && !posts.length ? (
          <div className="text-center py-4">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-4">No posts available.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white p-4 rounded-lg shadow-md relative">
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(post)}
                    className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                <h3 className="text-xl font-semibold mb-2 pr-16">{post.post_title || "No Title"}</h3>
                <p className="text-gray-600 mb-4">{post.post_content || "No Content"}</p>
                {post.post_image && (
                  <img
                    src={getImageUrl(post.post_image)}
                    alt={post.post_title || "Post image"}
                    className="w-full h-48 object-cover rounded-md"
                    onError={(e) => {
                      console.error(`Error loading image for ${post.post_title || "post"}:`, e);
                      e.target.src = "https://via.placeholder.com/300";
                    }}
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