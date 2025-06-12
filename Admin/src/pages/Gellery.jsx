import React, { useState, useEffect } from 'react';
import './Gallery.css';

function Gellery() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [galleryPhotos, setGalleryPhotos] = useState([]);

  // Fetch existing gallery photos from backend
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/gallery/photos/')
      .then(res => res.json())
      .then(data => setGalleryPhotos(data))
      .catch(() => setGalleryPhotos([]));
  }, []);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const newPreviews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setSelectedFiles(prev => [...prev, ...files]);
    setPreviews(prev => [...prev, ...newPreviews]);
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
        await fetch('http://127.0.0.1:8000/api/gallery/photos/create/', {
          method: 'POST',
          body: singleForm,
        });
      }

      alert('Photos uploaded successfully!');
      setSelectedFiles([]);
      setPreviews([]);
      // Refresh gallery
      fetch('http://127.0.0.1:8000/api/gallery/photos/')
        .then(res => res.json())
        .then(data => setGalleryPhotos(data))
        .catch(() => setGalleryPhotos([]));
    } catch (error) {
      console.error('Error uploading photos:', error);
      alert('Failed to upload photos. Please try again.');
    }
  };

  const removePhoto = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Delete photo from backend
  const handleDeleteGalleryPhoto = async (id) => {
    if (!window.confirm('Delete this photo?')) return;
    await fetch(`http://127.0.0.1:8000/api/gallery/photos/${id}/delete/`, {
      method: 'DELETE',
    });
    setGalleryPhotos(galleryPhotos.filter(photo => photo.id !== id));
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
              <img src={`http://127.0.0.1:8000${photo.image}`} alt="Gallery" />
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

export default Gellery;
