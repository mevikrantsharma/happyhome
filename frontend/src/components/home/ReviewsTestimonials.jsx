import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from '../shared/AnimatedSection';
import { FaQuoteLeft, FaChevronLeft, FaChevronRight, FaStar, FaCamera, FaUser } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import './ReviewsTestimonials.css';

const ReviewsTestimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [serviceStats, setServiceStats] = useState({});
  const { isAuthenticated } = useContext(AuthContext);

  // Fetch featured reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:4000/api/reviews?featured=true&limit=5');
        const data = await response.json();
        
        if (response.ok) {
          setReviews(data.data);
          
          // If there are no featured reviews yet, use the default testimonials
          if (data.data.length === 0) {
            setReviews(defaultTestimonials);
          }
        } else {
          setError(data.error || 'Failed to fetch reviews');
          setReviews(defaultTestimonials);
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Network error. Please check your connection.');
        setReviews(defaultTestimonials);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, []);

  // Fetch service stats for all services
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const services = ['kitchen', 'bathroom', 'bedroom', 'living', 'full-house'];
        const stats = {};
        
        for (const service of services) {
          const response = await fetch(`http://localhost:4000/api/reviews/stats?service=${service}`);
          const data = await response.json();
          
          if (response.ok) {
            stats[service] = data.data;
          }
        }
        
        setServiceStats(stats);
      } catch (err) {
        console.error('Error fetching service stats:', err);
      }
    };
    
    fetchStats();
  }, []);

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
        }
      ],
      createdAt: new Date('2025-04-10')
    }
  ];

  const handlePrev = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => 
      (prevIndex + 1) % reviews.length
    );
  };

  // Format date to readable string
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  // Get active review or default to first
  const activeReview = reviews.length > 0 ? reviews[activeIndex] : null;
  
  if (!activeReview) return null;

  return (
    <section className="reviews-section section">
      <div className="container">
        <div className="reviews-content">
          <div className="rating-summary">
            <h3>Client Satisfaction</h3>
            
            <div className="rating-categories">
              {Object.keys(serviceStats).map(service => {
                const stats = serviceStats[service];
                if (!stats || stats.count === 0) return null;
                
                return (
                  <div key={service} className="service-rating">
                    <h4>{service.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Renovations</h4>
                    <div className="rating-bars">
                      <div className="rating-bar">
                        <span className="rating-label">Quality</span>
                        <div className="bar-container">
                          <div 
                            className="bar-fill" 
                            style={{ width: `${(stats.avgQuality / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className="rating-value">{stats.avgQuality.toFixed(1)}</span>
                      </div>
                      
                      <div className="rating-bar">
                        <span className="rating-label">Timeliness</span>
                        <div className="bar-container">
                          <div 
                            className="bar-fill" 
                            style={{ width: `${(stats.avgTimeliness / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className="rating-value">{stats.avgTimeliness.toFixed(1)}</span>
                      </div>
                      
                      <div className="rating-bar">
                        <span className="rating-label">Value</span>
                        <div className="bar-container">
                          <div 
                            className="bar-fill" 
                            style={{ width: `${(stats.avgValue / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className="rating-value">{stats.avgValue.toFixed(1)}</span>
                      </div>
                      
                      <div className="rating-bar">
                        <span className="rating-label">Overall</span>
                        <div className="bar-container">
                          <div 
                            className="bar-fill highlight" 
                            style={{ width: `${(stats.avgOverall / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className="rating-value">{stats.avgOverall.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="review-count">Based on {stats.count} verified reviews</div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="testimonial-slider">
            <button 
              className="testimonial-nav prev" 
              onClick={handlePrev}
              aria-label="Previous testimonial"
            >
              <FaChevronLeft />
            </button>

            <div className="testimonial-container">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeReview._id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="testimonial"
                >
                  <div className="testimonial-content">
                    <div className="testimonial-header">
                      <h3 className="testimonial-title">{activeReview.title}</h3>
                      <div className="service-badge">
                        {activeReview.service.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                    </div>
                    
                    <FaQuoteLeft className="quote-icon" />
                    <p className="testimonial-quote">{activeReview.content}</p>
                    
                    <div className="testimonial-ratings">
                      <div className="rating-item">
                        <span>Quality</span>
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < activeReview.ratings.quality ? 'filled' : ''} />
                          ))}
                        </div>
                      </div>
                      
                      <div className="rating-item">
                        <span>Timeliness</span>
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < activeReview.ratings.timeliness ? 'filled' : ''} />
                          ))}
                        </div>
                      </div>
                      
                      <div className="rating-item">
                        <span>Value</span>
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < activeReview.ratings.value ? 'filled' : ''} />
                          ))}
                        </div>
                      </div>
                      
                      <div className="rating-item overall">
                        <span>Overall</span>
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < activeReview.ratings.overall ? 'filled' : ''} />
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="testimonial-meta">
                      <div className="client-info">
                        {activeReview.user.avatar ? (
                          <img 
                            src={activeReview.user.avatar} 
                            alt={activeReview.user.name} 
                            className="client-avatar"
                          />
                        ) : (
                          <div className="default-avatar">
                            <FaUser />
                          </div>
                        )}
                        <div>
                          <h4 className="client-name">{activeReview.user.name}</h4>
                          <p className="client-location">{activeReview.location}</p>
                          <p className="review-date">{formatDate(activeReview.createdAt)}</p>
                        </div>
                      </div>
                      
                      {activeReview.images && activeReview.images.length > 0 && (
                        <div className="photo-indicator">
                          <FaCamera /> {activeReview.images.length} Photo{activeReview.images.length !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {activeReview.images && activeReview.images.length > 0 && (
                    <div className="testimonial-images">
                      {activeReview.images.map((image, index) => (
                        <div key={index} className="review-image-container">
                          <img 
                            src={image.imageUrl} 
                            alt={image.caption || `Project photo ${index + 1}`} 
                            className="review-image"
                          />
                          {image.caption && (
                            <div className="image-caption">{image.caption}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <button 
              className="testimonial-nav next" 
              onClick={handleNext}
              aria-label="Next testimonial"
            >
              <FaChevronRight />
            </button>
          </div>
          
          <div className="testimonial-actions">
            <div className="pagination">
              {reviews.map((_, index) => (
                <button 
                  key={index}
                  className={`pagination-dot ${activeIndex === index ? 'active' : ''}`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Go to review ${index + 1}`}
                />
              ))}
            </div>
            
            <div className="cta-buttons">
              {isAuthenticated() && (
                <Link to="/submit-review" className="submit-review-button">
                  Share Your Experience
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsTestimonials;
