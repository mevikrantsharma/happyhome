import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaImages, FaFolder, FaFolderOpen, FaArrowLeft, FaPlus } from 'react-icons/fa';
import './AdminImageUpload.css';

const AdminImageUpload = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(true);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    featured: false,
    image: null
  });

  // Preview image
  const [preview, setPreview] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    // Fetch existing images
    fetchImages();
  }, [navigate]);

  const fetchImages = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:4000/api/images', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
        return;
      }

      const data = await response.json();
      
      if (response.ok) {
        setImages(data.data);
      } else {
        setError(data.error || 'Failed to fetch images');
      }
    } catch (err) {
      console.error('Error fetching images:', err);
      setError('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      // Create a preview URL for the image
      if (files[0]) {
        setPreview(URL.createObjectURL(files[0]));
        setFormData({
          ...formData,
          image: files[0]
        });
      }
    } else if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadLoading(true);
    setError('');
    setSuccess('');

    // Validate form
    if (!formData.title || !formData.description || !formData.category || !formData.image) {
      setError('Please fill in all fields and select an image');
      setUploadLoading(false);
      return;
    }

    try {
      // Create form data for file upload
      const uploadData = new FormData();
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);
      uploadData.append('category', formData.category);
      uploadData.append('featured', formData.featured);
      uploadData.append('image', formData.image);

      const response = await fetch('http://localhost:4000/api/images', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: uploadData
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Image uploaded successfully!');
        setFormData({
          title: '',
          description: '',
          category: '',
          featured: false,
          image: null
        });
        setPreview('');
        // Refresh images list
        fetchImages();
      } else {
        setError(data.error || 'Failed to upload image');
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Network error. Please check your connection.');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image? This cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/images/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        }
      });

      if (response.ok) {
        setSuccess('Image deleted successfully');
        // Refresh images
        fetchImages();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete image');
      }
    } catch (err) {
      console.error('Error deleting image:', err);
      setError('Network error. Please check your connection.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const handleBack = () => {
    navigate('/admin/messages');
  };

  return (
    <div className="admin-images-container">
      <div className="admin-header">
        <h1>Image Management</h1>
        <div className="admin-controls">
          <button className="back-button" onClick={handleBack}>
            Back to Messages
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {error && <div className="admin-error">{error}</div>}
      {success && <div className="admin-success">{success}</div>}

      <div className="admin-content-grid">
        {showUploadForm ? (
        <div className="image-upload-form">
          <div className="form-header">
            <h2>Upload New Image</h2>
            <button 
              type="button" 
              className="close-form-button"
              onClick={() => setShowUploadForm(false)}
            >
              Close
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a category</option>
                <option value="kitchen">Kitchen</option>
                <option value="bathroom">Bathroom</option>
                <option value="living">Living Room</option>
                <option value="bedroom">Bedroom</option>
                <option value="exterior">Exterior</option>
                <option value="basement">Basement</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
              />
              <label htmlFor="featured">Featured Image</label>
            </div>

            <div className="form-group">
              <label htmlFor="image">Image</label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleInputChange}
                accept="image/*"
                required
              />
            </div>

            {preview && (
              <div className="image-preview">
                <h3>Preview</h3>
                <img src={preview} alt="Preview" />
              </div>
            )}

            <button
              type="submit"
              className="upload-button"
              disabled={uploadLoading}
            >
              {uploadLoading ? 'Uploading...' : 'Upload Image'}
            </button>
          </form>
        </div>
        ) : null}

        <div className="images-gallery">
          {/* Album Selection View */}
          {!selectedCategory ? (
            <>
              <div className="albums-header">
                <h2>Photo Albums by Category</h2>
              </div>
              
              {isLoading ? (
                <div className="loading-spinner">Loading albums...</div>
              ) : images.length === 0 ? (
                <div className="no-images">
                  <FaImages className="no-images-icon" />
                  <p>No images found. Start by uploading your first image!</p>
                </div>
              ) : (
                <div className="albums-container">
                  {/* Get unique categories from images */}
                  {Array.from(new Set(images.map(img => img.category))).sort().map(category => {
                    // Filter images for this category
                    const categoryImages = images.filter(img => img.category === category);
                    
                    // Skip empty categories
                    if (categoryImages.length === 0) return null;
                    
                    // Format category name for display
                    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
                    
                    // Get cover image (first image or placeholder)
                    const coverImage = categoryImages[0]?.imageUrl;
                    
                    return (
                      <div 
                        key={category} 
                        className="album-card"
                        onClick={() => setSelectedCategory(category)}
                      >
                        <div className="album-cover">
                          {coverImage ? (
                            <img src={coverImage} alt={categoryName} />
                          ) : (
                            <div className="album-placeholder">
                              <FaFolder />
                            </div>
                          )}
                        </div>
                        <div className="album-info">
                          <h3 className="album-title">
                            <FaFolder /> {categoryName}
                          </h3>
                          <p className="album-count">{categoryImages.length} images</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            /* Selected Category View */
            <>
              <div className="category-header">
                <button 
                  className="back-to-albums-button"
                  onClick={() => setSelectedCategory(null)}
                >
                  <FaArrowLeft /> Back to Albums
                </button>
                <h2>
                  <FaFolderOpen /> {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
                </h2>

              </div>
              
              {isLoading ? (
                <div className="loading-spinner">Loading images...</div>
              ) : (
                <div className="category-images">
                  <div className="admin-images-grid">
                    {images
                      .filter(image => image.category === selectedCategory)
                      .map((image) => (
                        <div key={image._id} className="admin-image-card">
                          <img src={image.imageUrl} alt={image.title} />
                          <div className="admin-image-info">
                            <h3>{image.title}</h3>
                            {image.featured && <span className="featured-badge">Featured</span>}
                            <button
                              className="delete-button"
                              onClick={() => handleDelete(image._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminImageUpload;
