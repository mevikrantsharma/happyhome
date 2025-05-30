import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaHeart, FaRegHeart, FaEdit, FaTrash, FaCamera, FaPlus } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { WishlistContext } from '../context/WishlistContext';
import PageHeader from '../components/shared/PageHeader';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const { wishlists, activeWishlist, setActiveWishlist, loading: wishlistLoading } = useContext(WishlistContext);
  const navigate = useNavigate();
  
  const [userReviews, setUserReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState(null);
  const [activeTab, setActiveTab] = useState('collections');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: '/dashboard' } });
    }
  }, [isAuthenticated, navigate]);
  
  // Fetch user's reviews
  useEffect(() => {
    const fetchUserReviews = async () => {
      if (!user) return;
      
      try {
        setReviewsLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:4000/api/reviews/user', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        console.log('User reviews response:', data);
        
        if (response.ok && data.success) {
          setUserReviews(data.data); // Extract the reviews array from the response
        } else {
          setReviewsError(data.error || 'Failed to fetch your reviews');
        }
      } catch (err) {
        setReviewsError('Network error. Please check your connection.');
        console.error('Error fetching user reviews:', err);
      } finally {
        setReviewsLoading(false);
      }
    };
    
    fetchUserReviews();
  }, [user]);
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Calculate average rating
  const calculateAverageRating = (ratings) => {
    if (!ratings) return 0;
    const sum = Object.values(ratings).reduce((acc, curr) => acc + curr, 0);
    return (sum / Object.values(ratings).length).toFixed(1);
  };
  
  // Open delete confirmation modal
  const confirmDelete = (review) => {
    setReviewToDelete(review);
    setShowDeleteModal(true);
    setDeleteError(null);
  };
  
  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setReviewToDelete(null);
    setDeleteError(null);
  };
  
  // Handle review deletion
  const handleDeleteReview = async () => {
    if (!reviewToDelete) return;
    
    setDeleteLoading(true);
    setDeleteError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/reviews/${reviewToDelete._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Remove the deleted review from state
        setUserReviews(prevReviews => 
          prevReviews.filter(review => review._id !== reviewToDelete._id)
        );
        setDeleteSuccess(true);
        
        // Close modal after short delay
        setTimeout(() => {
          setShowDeleteModal(false);
          setReviewToDelete(null);
          setDeleteSuccess(false);
        }, 1500);
      } else {
        setDeleteError(data.error || 'Failed to delete review');
      }
    } catch (err) {
      console.error('Error deleting review:', err);
      setDeleteError('Network error. Please check your connection.');
    } finally {
      setDeleteLoading(false);
    }
  };
  
  return (
    <motion.div
      className="user-dashboard-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader
        title="My Dashboard"
        subtitle="Manage your collections and reviews in one place"
        backgroundImage="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"
        metaDescription="View and manage your saved collections and submitted reviews for Happy Home Renovation services."
      />
      
      <div className="container">
        <div className="dashboard-container">
          <div className="dashboard-sidebar">
            <div className="user-info">
              <div className="user-avatar">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <h3>{user?.name || 'User'}</h3>
              <p>{user?.email || 'email@example.com'}</p>
            </div>
            
            <div className="dashboard-tabs">
              <button 
                className={`tab-button ${activeTab === 'collections' ? 'active' : ''}`}
                onClick={() => setActiveTab('collections')}
              >
                <FaHeart className="tab-icon" />
                My Collections
              </button>
              <button 
                className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                <FaStar className="tab-icon" />
                My Reviews
              </button>
            </div>
            
            <div className="dashboard-actions">
              <Link to="/profile" className="dashboard-action-btn">
                Edit Profile
              </Link>
              <Link to="/cost-estimator" className="dashboard-action-btn">
                Cost Estimator
              </Link>
              {activeTab === 'reviews' && (
                <Link to="/submit-review" className="dashboard-action-btn primary">
                  <FaPlus className="btn-icon" /> New Review
                </Link>
              )}
            </div>
          </div>
          
          <div className="dashboard-content">
            {activeTab === 'collections' && (
              <div className="collections-section">
                <div className="section-header">
                  <h2>My Collections</h2>
                  <Link to="/wishlist" className="view-all-link">
                    Manage All Collections
                  </Link>
                </div>
                
                {wishlistLoading ? (
                  <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading collections...</p>
                  </div>
                ) : wishlists.length === 0 ? (
                  <div className="empty-state">
                    <FaHeart className="empty-icon" />
                    <h3>No Collections Yet</h3>
                    <p>Start saving your favorite renovation ideas from our gallery.</p>
                    <Link to="/gallery" className="cta-button">
                      Browse Gallery
                    </Link>
                  </div>
                ) : (
                  <div className="collections-grid">
                    {wishlists.map(wishlist => (
                      <div key={wishlist._id} className="collection-card">
                        <div className="collection-header">
                          <h3>{wishlist.name}</h3>
                          <span className="item-count">
                            {wishlist.items.length} {wishlist.items.length === 1 ? 'item' : 'items'}
                          </span>
                        </div>
                        
                        <div className="collection-preview">
                          {wishlist.items.length > 0 ? (
                            <>
                              <div className="preview-image">
                                <img 
                                  src={wishlist.items[0].image.imageUrl} 
                                  alt={wishlist.items[0].image.title || 'Collection item'} 
                                />
                              </div>
                              {wishlist.items.length > 1 && (
                                <div className="more-items">
                                  +{wishlist.items.length - 1} more
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="empty-collection">
                              <FaRegHeart className="empty-icon" />
                              <span>Empty collection</span>
                            </div>
                          )}
                        </div>
                        
                        <Link to="/wishlist" className="view-collection-btn" onClick={() => setActiveWishlist(wishlist)}>
                          View Collection
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div className="reviews-section">
                <div className="section-header">
                  <h2>My Reviews</h2>
                </div>
                
                {reviewsLoading ? (
                  <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading reviews...</p>
                  </div>
                ) : reviewsError ? (
                  <div className="error-message">
                    {reviewsError}
                  </div>
                ) : userReviews.length === 0 ? (
                  <div className="empty-state">
                    <FaStar className="empty-icon" />
                    <h3>No Reviews Yet</h3>
                    <p>Share your experience with our renovation services.</p>
                    <Link to="/submit-review" className="cta-button">
                      Write a Review
                    </Link>
                  </div>
                ) : (
                  <div className="reviews-list">
                    {userReviews.map(review => (
                      <div key={review._id} className="review-item">
                        <div className="review-header">
                          <div className="review-title-area">
                            <h3>{review.title}</h3>
                            <div className="service-badge">
                              {review.service.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </div>
                          </div>
                          <div className="review-actions">
                            <button 
                              className="review-action delete" 
                              onClick={() => confirmDelete(review)}
                              aria-label="Delete review"
                            >
                              <FaTrash />
                            </button>
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
                            {review.images.map((image, index) => (
                              <div key={index} className="review-image-container">
                                <img 
                                  src={image.imageUrl} 
                                  alt={image.caption || `Project photo ${index + 1}`} 
                                  className="review-image"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="review-footer">
                          <span className="review-date">Submitted on {formatDate(review.createdAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-content">
              {deleteSuccess ? (
                <div className="success-message">
                  <h3>Review Deleted Successfully!</h3>
                </div>
              ) : (
                <>
                  <h3>Delete Review</h3>
                  <p>Are you sure you want to delete this review? This action cannot be undone.</p>
                  
                  {reviewToDelete && (
                    <div className="review-preview">
                      <h4>{reviewToDelete.title}</h4>
                      <div className="service-badge small">
                        {reviewToDelete.service.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                    </div>
                  )}
                  
                  {deleteError && (
                    <div className="error-message">
                      {deleteError}
                    </div>
                  )}
                  
                  <div className="modal-actions">
                    <button 
                      className="btn cancel-btn" 
                      onClick={cancelDelete}
                      disabled={deleteLoading}
                    >
                      Cancel
                    </button>
                    <button 
                      className="btn confirm-btn" 
                      onClick={handleDeleteReview}
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? 'Deleting...' : 'Confirm'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default UserDashboard;
