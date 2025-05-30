import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaStar, FaCamera, FaTimesCircle } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import './SubmitReview.css';

const SubmitReview = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    service: '',
    title: '',
    content: '',
    projectDetails: '',
    location: '',
    ratings: {
      quality: 0,
      timeliness: 0,
      value: 0,
      overall: 0
    },
    images: []
  });
  
  const [previews, setPreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: '/submit-review' } });
    }
  }, [isAuthenticated, navigate]);
  
  const serviceOptions = [
    { value: 'kitchen', label: 'Kitchen Renovation' },
    { value: 'bathroom', label: 'Bathroom Renovation' },
    { value: 'bedroom', label: 'Bedroom Renovation' },
    { value: 'living', label: 'Living Room Renovation' },
    { value: 'full-house', label: 'Full House Renovation' },
    { value: 'exterior', label: 'Exterior Renovation' },
    { value: 'other', label: 'Other Services' }
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const handleRatingChange = (category, value) => {
    setFormData((prev) => ({
      ...prev,
      ratings: {
        ...prev.ratings,
        [category]: value
      }
    }));
    
    // Clear error for this rating if it exists
    if (errors[`ratings.${category}`]) {
      setErrors((prev) => ({
        ...prev,
        [`ratings.${category}`]: null
      }));
    }
  };
  
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + formData.images.length > 5) {
      setErrors((prev) => ({
        ...prev,
        images: 'Maximum 5 images allowed'
      }));
      return;
    }
    
    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          images: 'Each image must be less than 5MB'
        }));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target.result;
        
        setPreviews((prev) => [
          ...prev, 
          { preview, file }
        ]);
        
        setFormData((prev) => ({
          ...prev,
          images: [
            ...prev.images,
            {
              dataUrl: preview,
              caption: ''
            }
          ]
        }));
      };
      
      reader.readAsDataURL(file);
    });
    
    // Clear error if it exists
    if (errors.images) {
      setErrors((prev) => ({
        ...prev,
        images: null
      }));
    }
    
    // Reset the input value so the same file can be selected again
    e.target.value = '';
  };
  
  const handleCaptionChange = (index, caption) => {
    setFormData((prev) => {
      const updatedImages = [...prev.images];
      updatedImages[index].caption = caption;
      return {
        ...prev,
        images: updatedImages
      };
    });
  };
  
  const removeImage = (index) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.service) newErrors.service = 'Please select a service';
    if (!formData.title) newErrors.title = 'Please provide a title';
    if (!formData.content || formData.content.length < 10) {
      newErrors.content = 'Please provide a detailed review (minimum 10 characters)';
    }
    if (!formData.location) newErrors.location = 'Please provide your location';
    
    // Validate all ratings
    if (formData.ratings.quality === 0) newErrors['ratings.quality'] = 'Please rate the quality';
    if (formData.ratings.timeliness === 0) newErrors['ratings.timeliness'] = 'Please rate the timeliness';
    if (formData.ratings.value === 0) newErrors['ratings.value'] = 'Please rate the value';
    if (formData.ratings.overall === 0) newErrors['ratings.overall'] = 'Please provide an overall rating';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setErrors((prev) => ({
          ...prev,
          submit: 'Authentication token not found. Please log in again.'
        }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setLoading(false);
        return;
      }

      console.log('Submitting review to API...');
      const response = await fetch('http://localhost:4000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (response.ok) {
        setSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Reset form after success
        setFormData({
          service: '',
          title: '',
          content: '',
          projectDetails: '',
          location: '',
          ratings: {
            quality: 0,
            timeliness: 0,
            value: 0,
            overall: 0
          },
          images: []
        });
        setPreviews([]);
      } else {
        setErrors((prev) => ({
          ...prev,
          submit: data.error || 'Failed to submit review. Please try again.'
        }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setErrors((prev) => ({
        ...prev,
        submit: 'Network error. Please check your connection and try again.'
      }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };
  
  const StarRating = ({ category, value, onChange }) => {
    return (
      <div className="star-rating">
        {[...Array(5)].map((_, index) => {
          const ratingValue = index + 1;
          return (
            <FaStar
              key={`${category}-${index}`}
              className={ratingValue <= value ? 'star filled' : 'star'}
              onClick={() => onChange(category, ratingValue)}
            />
          );
        })}
      </div>
    );
  };
  
  if (!isAuthenticated()) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="submit-review-page"
    >
      <Helmet>
        <title>Share Your Experience | HappyHome</title>
        <meta 
          name="description" 
          content="Share your experience with HappyHome renovation services and help others make informed decisions."
        />
      </Helmet>
      
      <div className="container">
        <div className="review-form-container">
          <h1 className="page-title">Share Your Experience</h1>
          <p className="page-subtitle">
            Your feedback helps us improve and assists others in making informed decisions.
            All reviews are verified before being published.
          </p>
          
          {success ? (
            <div className="success-message">
              <h2>Thank You for Your Review!</h2>
              <p>
                Your review has been submitted successfully and is pending approval.
                Once approved, it will appear on our website.
              </p>
              <button 
                className="btn primary-btn" 
                onClick={() => navigate('/reviews')}
              >
                View All Reviews
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="review-form">
              {errors.submit && (
                <div className="error-alert">{errors.submit}</div>
              )}
              
              <div className="form-group">
                <label htmlFor="service">Which service did you use?*</label>
                <select 
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className={errors.service ? 'error' : ''}
                >
                  <option value="">Select a service</option>
                  {serviceOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.service && <div className="error-text">{errors.service}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="title">Review Title*</label>
                <input 
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Summarize your experience"
                  maxLength={100}
                  className={errors.title ? 'error' : ''}
                />
                {errors.title && <div className="error-text">{errors.title}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="content">Your Review*</label>
                <textarea 
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Share the details of your experience"
                  maxLength={1000}
                  rows={6}
                  className={errors.content ? 'error' : ''}
                />
                <div className="char-count">
                  {formData.content.length}/1000 characters
                </div>
                {errors.content && <div className="error-text">{errors.content}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="projectDetails">Project Details</label>
                <textarea 
                  id="projectDetails"
                  name="projectDetails"
                  value={formData.projectDetails}
                  onChange={handleChange}
                  placeholder="Describe your project (size, scope, special requirements, etc.)"
                  maxLength={500}
                  rows={4}
                />
                <div className="char-count">
                  {formData.projectDetails.length}/500 characters
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="location">Location*</label>
                <input 
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, State"
                  className={errors.location ? 'error' : ''}
                />
                {errors.location && <div className="error-text">{errors.location}</div>}
              </div>
              
              <div className="ratings-section">
                <h3>Rate Your Experience*</h3>
                
                <div className="rating-row">
                  <div className="rating-label">Quality of Work</div>
                  <div className="rating-input">
                    <StarRating 
                      category="quality" 
                      value={formData.ratings.quality} 
                      onChange={handleRatingChange} 
                    />
                    {errors['ratings.quality'] && (
                      <div className="error-text">{errors['ratings.quality']}</div>
                    )}
                  </div>
                </div>
                
                <div className="rating-row">
                  <div className="rating-label">Timeliness</div>
                  <div className="rating-input">
                    <StarRating 
                      category="timeliness" 
                      value={formData.ratings.timeliness} 
                      onChange={handleRatingChange} 
                    />
                    {errors['ratings.timeliness'] && (
                      <div className="error-text">{errors['ratings.timeliness']}</div>
                    )}
                  </div>
                </div>
                
                <div className="rating-row">
                  <div className="rating-label">Value for Money</div>
                  <div className="rating-input">
                    <StarRating 
                      category="value" 
                      value={formData.ratings.value} 
                      onChange={handleRatingChange} 
                    />
                    {errors['ratings.value'] && (
                      <div className="error-text">{errors['ratings.value']}</div>
                    )}
                  </div>
                </div>
                
                <div className="rating-row">
                  <div className="rating-label">Overall Experience</div>
                  <div className="rating-input">
                    <StarRating 
                      category="overall" 
                      value={formData.ratings.overall} 
                      onChange={handleRatingChange} 
                    />
                    {errors['ratings.overall'] && (
                      <div className="error-text">{errors['ratings.overall']}</div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="form-group">
                <label>Add Photos (Optional)</label>
                <p className="help-text">
                  Show off your completed project! Add up to 5 photos.
                </p>
                
                <div className="image-upload-container">
                  <label htmlFor="image-upload" className="image-upload-label">
                    <FaCamera /> Select Images
                  </label>
                  <input 
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden-file-input"
                  />
                  {errors.images && <div className="error-text">{errors.images}</div>}
                </div>
                
                {previews.length > 0 && (
                  <div className="image-previews">
                    {previews.map((preview, index) => (
                      <div key={index} className="image-preview-item">
                        <div className="preview-image-container">
                          <img 
                            src={preview.preview} 
                            alt={`Preview ${index + 1}`} 
                            className="preview-image"
                          />
                          <button
                            type="button"
                            className="remove-image-btn"
                            onClick={() => removeImage(index)}
                            aria-label="Remove image"
                          >
                            <FaTimesCircle />
                          </button>
                        </div>
                        <input
                          type="text"
                          placeholder="Caption (optional)"
                          value={formData.images[index]?.caption || ''}
                          onChange={(e) => handleCaptionChange(index, e.target.value)}
                          className="image-caption-input"
                          maxLength={50}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn primary-btn"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
              
              <p className="review-policy">
                By submitting a review, you agree to our Review Policy and Terms of Service.
                All reviews are verified and moderated before being published.
              </p>
            </form>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SubmitReview;
