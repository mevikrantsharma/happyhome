import React, { useContext, useState } from 'react';
import { WishlistContext } from '../context/WishlistContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaPlus, FaTrash, FaArrowLeft } from 'react-icons/fa';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlists, activeWishlist, setActiveWishlist, loading, error, createWishlist, updateWishlist, deleteWishlist, removeItemFromWishlist } = useContext(WishlistContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: '/wishlist' } });
    }
  }, [isAuthenticated, navigate]);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setFormError('Please enter a name for your wishlist');
      return;
    }
    
    const result = await createWishlist(name, description);
    
    if (result.success) {
      setName('');
      setDescription('');
      setIsCreating(false);
      setFormError('');
      // Set the new wishlist as active
      setActiveWishlist(result.wishlist);
    } else {
      setFormError(result.error || 'Failed to create wishlist');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setFormError('Please enter a name for your wishlist');
      return;
    }
    
    const result = await updateWishlist(activeWishlist._id, name, description);
    
    if (result.success) {
      setIsEditing(false);
      setFormError('');
    } else {
      setFormError(result.error || 'Failed to update wishlist');
    }
  };

  const handleDeleteWishlist = async () => {
    if (!activeWishlist) return;
    
    if (window.confirm(`Are you sure you want to delete "${activeWishlist.name}"? This action cannot be undone.`)) {
      const result = await deleteWishlist(activeWishlist._id);
      
      if (!result.success) {
        alert(result.error || 'Failed to delete wishlist');
      }
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!activeWishlist) return;
    
    if (window.confirm('Are you sure you want to remove this item from your wishlist?')) {
      const result = await removeItemFromWishlist(activeWishlist._id, itemId);
      
      if (!result.success) {
        alert(result.error || 'Failed to remove item from wishlist');
      }
    }
  };

  const startEditing = () => {
    if (activeWishlist) {
      setName(activeWishlist.name);
      setDescription(activeWishlist.description || '');
      setIsEditing(true);
    }
  };

  if (loading) {
    return (
      <div className="wishlist-container">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return (
      <div className="wishlist-container">
        <div className="wishlist-message">
          <h2>Please log in to view your wishlist</h2>
          <button 
            className="primary-button"
            onClick={() => navigate('/login', { state: { from: '/wishlist' } })}
          >
            Log in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      <div className="wishlist-header">
        <h1>
          <FaHeart className="wishlist-icon" /> My Collections
        </h1>
        {!isCreating && !isEditing && (
          <button 
            className="create-wishlist-button"
            onClick={() => setIsCreating(true)}
          >
            <FaPlus /> New Collection
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
      {formError && <div className="error-message">{formError}</div>}

      {isCreating && (
        <div className="wishlist-form-container">
          <h2>Create New Collection</h2>
          <form onSubmit={handleCreateSubmit} className="wishlist-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Collection Name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description (Optional)</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a short description..."
                rows="3"
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="primary-button">Create Collection</button>
              <button 
                type="button" 
                className="secondary-button"
                onClick={() => {
                  setIsCreating(false);
                  setFormError('');
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {isEditing && activeWishlist && (
        <div className="wishlist-form-container">
          <h2>Edit Collection</h2>
          <form onSubmit={handleEditSubmit} className="wishlist-form">
            <div className="form-group">
              <label htmlFor="edit-name">Name</label>
              <input
                type="text"
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Collection Name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-description">Description (Optional)</label>
              <textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a short description..."
                rows="3"
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="primary-button">Save Changes</button>
              <button 
                type="button" 
                className="secondary-button"
                onClick={() => {
                  setIsEditing(false);
                  setFormError('');
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {!isCreating && !isEditing && (
        <div className="wishlist-content">
          <div className="wishlist-sidebar">
            <h3>My Collections</h3>
            <ul className="wishlist-list">
              {wishlists.length === 0 ? (
                <li className="empty-message">No collections yet</li>
              ) : (
                wishlists.map(wishlist => (
                  <li 
                    key={wishlist._id}
                    className={`wishlist-item ${activeWishlist && activeWishlist._id === wishlist._id ? 'active' : ''}`}
                    onClick={() => setActiveWishlist(wishlist)}
                  >
                    <div className="wishlist-item-name">
                      <FaHeart className="wishlist-item-icon" />
                      <span>{wishlist.name}</span>
                    </div>
                    <span className="wishlist-item-count">
                      {wishlist.items.length} {wishlist.items.length === 1 ? 'item' : 'items'}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="wishlist-details">
            {activeWishlist ? (
              <>
                <div className="wishlist-details-header">
                  <h2>{activeWishlist.name}</h2>
                  <div className="wishlist-actions">
                    {!activeWishlist.isDefault && (
                      <button 
                        className="delete-button"
                        onClick={handleDeleteWishlist}
                        title="Delete Collection"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </div>
                
                {activeWishlist.description && (
                  <p className="wishlist-description">{activeWishlist.description}</p>
                )}
                
                {activeWishlist.items.length === 0 ? (
                  <div className="empty-wishlist">
                    <p>No items in this collection yet.</p>
                    <p>Browse the gallery and click the heart icon to add items.</p>
                    <button 
                      className="browse-gallery-button"
                      onClick={() => navigate('/gallery')}
                    >
                      Browse Gallery
                    </button>
                  </div>
                ) : (
                  <div className="wishlist-items-grid">
                    {activeWishlist.items.map(item => (
                      <div key={item._id} className="wishlist-item-card">
                        <div className="wishlist-item-image">
                          <img src={item.image.imageUrl} alt={item.image.title} />
                          <button 
                            className="remove-item-button"
                            onClick={() => handleRemoveItem(item._id)}
                            title="Remove from collection"
                          >
                            <FaTrash />
                          </button>
                        </div>
                        <div className="wishlist-item-info">
                          <h3>{item.image.title}</h3>
                          <p className="item-category">{item.image.category}</p>
                          {item.notes && <p className="item-notes">{item.notes}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="select-wishlist-message">
                <p>Select a collection from the sidebar or create a new one.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
