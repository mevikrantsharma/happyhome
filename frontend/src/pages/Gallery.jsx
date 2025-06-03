import React, { useState, useEffect, useContext } from 'react';
import WishlistButton from '../components/shared/WishlistButton';
import { motion } from 'framer-motion';
import { FaSearch, FaHeart, FaCalculator } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Gallery.css';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const { isAuthenticated } = useContext(AuthContext);

  // Fetch images and categories on component mount
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('http://localhost:4000/api/images');
        const data = await response.json();
        
        if (response.ok) {
          setImages(data.data);
          
          // Extract unique categories
          const uniqueCategories = [...new Set(data.data.map(img => img.category))];
          setCategories(uniqueCategories);
        } else {
          setError(data.error || 'Failed to fetch images');
        }
      } catch (err) {
        console.error('Error fetching images:', err);
        setError('Network error. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchImages();
  }, []);

  // Filter images based on selected category and search term
  const filteredImages = images.filter(image => {
    const matchesCategory = selectedCategory === 'all' || image.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (image.description && image.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <h1>Inspiration Gallery</h1>
        <p>Browse our collection of beautiful home renovation ideas</p>
      </div>
      
      <div className="gallery-filters">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search images..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="gallery-action-links">
          {isAuthenticated() && (
            <Link to="/wishlist" className="gallery-action-link collections-link">
              <FaHeart /> My Collections
            </Link>
          )}
          <Link to="/cost-estimator" className="gallery-action-link estimator-link">
            <FaCalculator /> Cost Estimator
          </Link>
        </div>
        
        <div className="category-filters">
          <button
            className={`category-button ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              className={`category-button ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {loading && (
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading beautiful images...</p>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      
      {!loading && !error && filteredImages.length === 0 && (
        <div className="no-results">
          <p>No images found matching your criteria.</p>
        </div>
      )}
      
      <div className="gallery-grid">
        {filteredImages.map(image => (
          <motion.div
            key={image._id}
            className="gallery-item"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            onClick={() => handleImageClick(image)}
          >
            <div className="gallery-image-container">
              <img src={image.imageUrl} alt={image.title} className="gallery-image" />
              {image && image._id && <WishlistButton imageId={image._id} />}
            </div>
            <div className="gallery-item-info">
              <h3>{image.title}</h3>
              <p className="gallery-item-category">{image.category}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      {selectedImage && (
        <div className="image-modal-overlay" onClick={closeModal}>
          <div className="image-modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close-button" onClick={closeModal}>×</button>
            <div className="modal-image-container">
              <img src={selectedImage.imageUrl} alt={selectedImage.title} className="modal-image" />
              {selectedImage && selectedImage._id && <WishlistButton imageId={selectedImage._id} />}
            </div>
            <div className="modal-image-details">
              <h2>{selectedImage.title}</h2>
              <p className="modal-image-category">{selectedImage.category}</p>
              {selectedImage.description && (
                <p className="modal-image-description">{selectedImage.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
