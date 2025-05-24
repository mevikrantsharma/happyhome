import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Gallery.css';

interface Image {
  _id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  featured: boolean;
  createdAt: string;
}

interface CategoryGroup {
  category: string;
  images: Image[];
}

const Gallery: React.FC = () => {
  const [imageGroups, setImageGroups] = useState<CategoryGroup[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  // Category names mapping
  const categoryNames: { [key: string]: string } = {
    kitchen: 'Kitchen',
    bathroom: 'Bathroom',
    living: 'Living Room',
    bedroom: 'Bedroom',
    exterior: 'Exterior',
    basement: 'Basement',
    other: 'Other'
  };

  useEffect(() => {
    fetchImagesByCategory();
  }, []);

  const fetchImagesByCategory = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:4000/api/images/by-category');
      const data = await response.json();

      if (response.ok) {
        setImageGroups(data.data);
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

  // Filter images based on selected category
  const filteredGroups = selectedCategory === 'all' 
    ? imageGroups 
    : imageGroups.filter(group => group.category === selectedCategory);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const openImageModal = (image: Image) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <section className="gallery-section">
      <div className="container">
        <div className="gallery-header">
          <h2 className="gallery-title">Our Portfolio</h2>
          <p className="gallery-subtitle">Explore our collection of home renovation projects</p>
          
          <div className="gallery-categories">
            <button 
              className={`category-button ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('all')}
            >
              All Categories
            </button>
            
            {imageGroups.map(group => (
              <button 
                key={group.category}
                className={`category-button ${selectedCategory === group.category ? 'active' : ''}`}
                onClick={() => handleCategoryChange(group.category)}
              >
                {categoryNames[group.category] || group.category}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="gallery-loading">Loading gallery...</div>
        ) : error ? (
          <div className="gallery-error">{error}</div>
        ) : filteredGroups.length === 0 ? (
          <div className="gallery-empty">No images found.</div>
        ) : (
          <>
            {filteredGroups.map(group => (
              <div key={group.category} className="gallery-category-section">
                <h3 className="category-title">{categoryNames[group.category] || group.category}</h3>
                
                <motion.div 
                  className="gallery-grid"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {group.images.map(image => (
                    <motion.div 
                      key={image._id} 
                      className="gallery-item"
                      variants={itemVariants}
                      onClick={() => openImageModal(image)}
                    >
                      <div className="gallery-image">
                        <img src={image.imageUrl} alt={image.title} />
                        <div className="gallery-overlay">
                          <h4>{image.title}</h4>
                          <span>{categoryNames[image.category] || image.category}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            ))}
          </>
        )}
      </div>

      {selectedImage && (
        <div className="image-modal" onClick={closeImageModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeImageModal}>×</button>
            <div className="modal-image">
              <img src={selectedImage.imageUrl} alt={selectedImage.title} />
            </div>
            <div className="modal-details">
              <h3>{selectedImage.title}</h3>
              <span className="modal-category">{categoryNames[selectedImage.category] || selectedImage.category}</span>
              <p className="modal-description">{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
