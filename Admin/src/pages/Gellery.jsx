import React, { useState, useEffect } from 'react';
import './Gallery.css';
import { BackendUrl } from '../BackendUrl';

function Gallery() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [galleryPhotos, setGalleryPhotos] = useState([]);

  // Cloudinary cloud name must match backend settings
  const CLOUDINARY_CLOUD_NAME = 'djbf0hou3';

  // Normalize image URL from backend (Cloudinary or Django media)
  const getImageUrl = (img) => {
    if (!img) return '/placeholder.svg';
    // Absolute URL (Cloudinary or any CDN)
    if (typeof img === 'string' && (img.startsWith('http://') || img.startsWith('https://'))) {
      return img;
    }
    // Object shapes
    if (typeof img === 'object' && img !== null) {
      if (img instanceof File) return URL.createObjectURL(img);
      if (typeof img.url === 'string') return getImageUrl(img.url);
      if (typeof img.image === 'string') return getImageUrl(img.image);
      if (img.file instanceof File) return URL.createObjectURL(img.file);
    }
    // Relative path
    if (typeof img === 'string') {
      const cleanPath = img.startsWith('/') ? img.substring(1) : img;
      if (cleanPath.startsWith('media/') || cleanPath.startsWith('static/')) {
        return `${BackendUrl}/${cleanPath}`;
      }
      // Ensure Cloudinary delivery type prefix exists
      const hasDeliveryPrefix = /^(image|video|raw)\//.test(cleanPath);
      const cloudinaryPath = hasDeliveryPrefix ? cleanPath : `image/upload/${cleanPath}`;
      return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/${cloudinaryPath}`;
    }
    return '/placeholder.svg';
  };

  // Fetch existing gallery photos from backend
  useEffect(() => {
    fetch(`${BackendUrl}/api/gallery/photos/`)
      .then((res) => res.json())
      .then((data) => setGalleryPhotos(data))
      .catch(() => setGalleryPhotos([]));
  }, []);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const newPreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setSelectedFiles((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleAddPhotos = async () => {
    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append('image', file);
      });

      // Upload each photo individually (GalleryPhoto expects one image per POST)
      for (let file of selectedFiles) {
        const singleForm = new FormData();
        singleForm.append('image', file);
        await fetch(`${BackendUrl}/api/gallery/photos/create/`, {
          method: 'POST',
          body: singleForm,
        });
      }

      alert('Photos uploaded successfully!');
      setSelectedFiles([]);
      setPreviews([]);
      // Refresh gallery
      fetch(`${BackendUrl}/api/gallery/photos/`)
        .then((res) => res.json())
        .then((data) => setGalleryPhotos(data))
        .catch(() => setGalleryPhotos([]));
    } catch (error) {
      console.error('Error uploading photos:', error);
      alert('Failed to upload photos. Please try again.');
    }
  };

  const removePhoto = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Delete photo from backend
  const handleDeleteGalleryPhoto = async (id) => {
    if (!window.confirm('Delete this photo?')) return;
    try {
      await fetch(`${BackendUrl}/api/gallery/photos/${id}/delete/`, {
        method: 'DELETE',
      });
      setGalleryPhotos((prev) => prev.filter((photo) => photo.id !== id));
    } catch (error) {
      console.error('Error deleting photo:', error);
      alert('Failed to delete photo. Please try again.');
    }
  };

  return (
    <div className="gallery-container">
      <h2>Add Photos to Gallery</h2>
      <div className="upload-section">
        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          accept="image/*"
          className="file-input"
        />
      </div>
      {previews.length > 0 && (
        <div className="preview-section">
          <h3>Selected Photos:</h3>
          <div className="preview-grid">
            {previews.map((preview, index) => (
              <div key={index} className="preview-item">
                <img src={preview.preview} alt={`Preview ${index}`} />
                <button
                  className="remove-button"
                  onClick={() => removePhoto(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            className="upload-button"
            onClick={handleAddPhotos}
            disabled={selectedFiles.length === 0}
          >
            Upload {selectedFiles.length} Photo{selectedFiles.length !== 1 ? 's' : ''}
          </button>
        </div>
      )}

      {/* Display gallery photos from backend */}
      <div className="gallery-section">
        <h3>Gallery Photos</h3>
        <div className="preview-grid">
          {galleryPhotos.map((photo) => (
            <div key={photo.id} className="preview-item">
              <img src={getImageUrl(photo.image)} alt="Gallery" />
              <button
                className="remove-button"
                onClick={() => handleDeleteGalleryPhoto(photo.id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Gallery;