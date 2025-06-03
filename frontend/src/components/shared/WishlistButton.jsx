import React, { useState, useContext, useEffect } from 'react';
// Import icons directly or use fallback text
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { WishlistContext } from '../../context/WishlistContext';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './WishlistButton.css';

// For testing only - remove in production
const DEBUG = true;

const WishlistButton = ({ imageId }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const { wishlists, quickAddToWishlist } = useContext(WishlistContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  // Check if this image is in any wishlist
  useEffect(() => {
    if (wishlists && wishlists.length > 0) {
      const inAnyWishlist = wishlists.some(wishlist => 
        wishlist.items && wishlist.items.some(item => 
          item && item.image && item.image._id === imageId
        )
      );
      setIsInWishlist(inAnyWishlist);
    }
  }, [wishlists, imageId]);

  const handleAddToWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Add to wishlist clicked for image:', imageId);
    
    // Redirect to login if not authenticated
    if (!isAuthenticated()) {
      console.log('User not authenticated, redirecting to login');
      navigate('/login', { state: { from: '/gallery' } });
      return;
    }

    if (isInWishlist) {
      console.log('Image already in wishlist');
      // Show tooltip instead of removing from wishlist
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
      return;
    }

    setIsLoading(true);
    console.log('Attempting to add image to wishlist...');
    
    try {
      // Directly call the API if the context method isn't working
      const response = await fetch('http://localhost:4000/api/wishlists/quick-add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ imageId })
      });

      const data = await response.json();
      console.log('API response:', data);
      
      if (response.ok) {
        console.log('Successfully added to wishlist');
        setIsInWishlist(true);
        // Show success tooltip
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 3000);
      } else {
        console.error('Failed to add to wishlist:', data.error);
        alert(`Failed to add to wishlist: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      alert(`Error adding to wishlist: ${error.message || 'Network error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="wishlist-button-container">
      <button 
        className={`wishlist-button ${isInWishlist ? 'active' : ''} ${isLoading ? 'loading' : ''}`}
        onClick={handleAddToWishlist}
        disabled={isLoading}
        aria-label={isInWishlist ? "Saved to wishlist" : "Add to wishlist"}
      >
        {isInWishlist ? <FaHeart /> : <FaRegHeart />}
        <span className="icon-fallback">{isInWishlist ? '♥' : '♡'}</span>
      </button>
      
      {showTooltip && (
        <div className="wishlist-tooltip">
          {isInWishlist ? (
            <>
              <FaHeart /> Added to collection
              <button 
                className="view-wishlist-link"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate('/wishlist');
                }}
              >
                View collections
              </button>
            </>
          ) : (
            'Failed to add to collection'
          )}
        </div>
      )}
    </div>
  );
};

export default WishlistButton;
