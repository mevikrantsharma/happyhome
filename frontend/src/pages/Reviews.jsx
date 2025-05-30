import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaStar, FaChevronLeft, FaChevronRight, FaCamera, FaFilter, FaTimes } from 'react-icons/fa';
import './Reviews.css';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState({
    service: '',
    sort: 'newest'
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        
        // Construct query parameters
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', 6);
        
        if (filter.service) {
          params.append('service', filter.service);
        }
        
        // Sorting logic
        if (filter.sort === 'highest') {
          params.append('sort', '-ratings.overall');
        } else if (filter.sort === 'lowest') {
          params.append('sort', 'ratings.overall');
        } else {
          params.append('sort', '-createdAt');
        }
        
        const response = await fetch(`http://localhost:4000/api/reviews?${params.toString()}`);
        const data = await response.json();
        
        if (response.ok) {
          setReviews(data.data);
          setTotalPages(data.totalPages);
        } else {
          setError(data.error || 'Failed to fetch reviews');
          
          // If no reviews yet, use default testimonials
          if (response.status === 404) {
            setReviews(defaultTestimonials);
            setTotalPages(1);
          }
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Network error. Please check your connection.');
        setReviews(defaultTestimonials);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, [page, filter]);
  
  // Default testimonials to use if no reviews are available yet
  const defaultTestimonials = [
    {
      _id: 1,
      user: {
        name: 'Sarah Johnson',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg'
      },
      location: 'Mumbai, India',
      service: 'kitchen',
      title: 'Amazing Kitchen Renovation',
      content: 'HappyHome transformed our outdated kitchen into a stunning, functional space that has become the heart of our home. Their attention to detail and craftsmanship exceeded our expectations!',
      ratings: {
        quality: 5,
        timeliness: 5,
        value: 4,
        overall: 5
      },
      images: [
        {
          imageUrl: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg',
          caption: 'Our beautiful new kitchen'
        }
      ],
      createdAt: new Date('2025-03-15')
    },
    {
      _id: 2,
      user: {
        name: 'Raj & Priya Patel',
        avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg'
      },
      location: 'Delhi, India',
      service: 'bathroom',
      title: 'Bathroom Remodeling Excellence',
      content: 'We couldn\'t be happier with our new bathrooms. The design team listened to our needs and created spaces that are both beautiful and practical. The project was completed on time and within budget.',
      ratings: {
        quality: 5,
        timeliness: 4,
        value: 5,
        overall: 5
      },
      images: [
        {
          imageUrl: 'https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg',
          caption: 'Modern bathroom design'
        }
      ],
      createdAt: new Date('2025-04-02')
    },
    {
      _id: 3,
      user: {
        name: 'Vikram Sharma',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
      },
      location: 'Bangalore, India',
      service: 'full-house',
      title: 'Complete Home Transformation',
      content: 'HappyHome guided us through a complete home renovation with professionalism and expertise. They transformed our dated property into a modern, open-concept dream home. Highly recommended!',
      ratings: {
        quality: 5,
        timeliness: 5,
        value: 4,
        overall: 5
      },
      images: [
        {
          imageUrl: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
          caption: 'Living room transformation'
        },
        {
          imageUrl: 'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg',
          caption: 'Kitchen renovation'
        }
      ],
      createdAt: new Date('2025-04-10')
    }
  ];
  
  const serviceOptions = [
    { value: '', label: 'All Services' },
    { value: 'kitchen', label: 'Kitchen Renovation' },
    { value: 'bathroom', label: 'Bathroom Renovation' },
    { value: 'bedroom', label: 'Bedroom Renovation' },
    { value: 'living', label: 'Living Room Renovation' },
    { value: 'full-house', label: 'Full House Renovation' },
    { value: 'exterior', label: 'Exterior Renovation' },
    { value: 'other', label: 'Other Services' }
  ];
  
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'highest', label: 'Highest Rated' },
    { value: 'lowest', label: 'Lowest Rated' }
  ];
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({
      ...prev,
      [name]: value
    }));
    setPage(1); // Reset to first page when filter changes
  };
  
  const clearFilters = () => {
    setFilter({
      service: '',
      sort: 'newest'
    });
    setPage(1);
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };
  
  const calculateAverageRating = (ratings) => {
    return ((ratings.quality + ratings.timeliness + ratings.value + ratings.overall) / 4).toFixed(1);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="reviews-page"
    >
      <Helmet>
        <title>Client Reviews | HappyHome</title>
        <meta 
          name="description" 
          content="Read verified client reviews and testimonials about HappyHome renovation services."
        />
      </Helmet>
      
      <div className="reviews-hero">
        <div className="container">
          <h1>Client Reviews</h1>
          <p>Read what our clients have to say about their renovation experiences</p>
        </div>
      </div>
      
      <div className="container">
        <div className="reviews-content">
          <div className="reviews-header">
            <div className="reviews-count">
              Showing {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              {filter.service && (
                <span> for {serviceOptions.find(s => s.value === filter.service)?.label}</span>
              )}
            </div>
            
            <div className="filters-toggle">
              <button 
                className="filter-toggle-btn"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>
          </div>
          
          {showFilters && (
            <div className="filters-section">
              <div className="filters-grid">
                <div className="filter-group">
                  <label htmlFor="service">Filter by Service</label>
                  <select 
                    id="service"
                    name="service"
                    value={filter.service}
                    onChange={handleFilterChange}
                  >
                    {serviceOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="filter-group">
                  <label htmlFor="sort">Sort by</label>
                  <select 
                    id="sort"
                    name="sort"
                    value={filter.sort}
                    onChange={handleFilterChange}
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                {(filter.service || filter.sort !== 'newest') && (
                  <button className="clear-filters-btn" onClick={clearFilters}>
                    <FaTimes /> Clear Filters
                  </button>
                )}
              </div>
            </div>
          )}
          
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading reviews...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p className="error-message">{error}</p>
            </div>
          ) : (
            <>
              <div className="reviews-grid">
                {reviews.map(review => (
                  <div key={review._id} className="review-card">
                    <div className="review-header">
                      <h3 className="review-title">{review.title}</h3>
                      <div className="service-badge">
                        {review.service.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                    </div>
                    
                    <div className="review-rating">
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                            className={i < Math.round(review.ratings.overall) ? 'filled' : ''} 
                          />
                        ))}
                      </div>
                      <div className="rating-score">
                        {calculateAverageRating(review.ratings)}/5
                      </div>
                    </div>
                    
                    <p className="review-content">{review.content}</p>
                    
                    {review.images && review.images.length > 0 && (
                      <div className="review-images">
                        {review.images.slice(0, 1).map((image, index) => (
                          <div key={index} className="review-image-container">
                            <img 
                              src={image.imageUrl} 
                              alt={image.caption || `Project photo ${index + 1}`} 
                              className="review-image"
                            />
                            {review.images.length > 1 && (
                              <div className="more-images-badge">
                                <FaCamera /> +{review.images.length - 1}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="review-meta">
                      <div className="client-info">
                        {review.user.avatar ? (
                          <img 
                            src={review.user.avatar} 
                            alt={review.user.name} 
                            className="client-avatar"
                          />
                        ) : (
                          <div className="default-avatar"></div>
                        )}
                        <div>
                          <div className="client-name">{review.user.name}</div>
                          <div className="client-location">{review.location}</div>
                        </div>
                      </div>
                      
                      <div className="review-date">
                        {formatDate(review.createdAt)}
                      </div>
                    </div>
                    
                    <Link to={`/reviews/${review._id}`} className="view-details-link">
                      View Full Review
                    </Link>
                  </div>
                ))}
              </div>
              
              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    className="page-btn prev"
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                  >
                    <FaChevronLeft /> Previous
                  </button>
                  
                  <div className="page-numbers">
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        className={`page-number ${page === index + 1 ? 'active' : ''}`}
                        onClick={() => setPage(index + 1)}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                  
                  <button 
                    className="page-btn next"
                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                  >
                    Next <FaChevronRight />
                  </button>
                </div>
              )}
            </>
          )}
          
          <div className="reviews-cta">
            <h2>Share Your Experience</h2>
            <p>Had a renovation with us? We'd love to hear about your experience!</p>
            <Link to="/submit-review" className="submit-review-btn">
              Write a Review
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Reviews;
