import { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

// Create context
export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlists, setWishlists] = useState([]);
  const [activeWishlist, setActiveWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useContext(AuthContext);

  // Fetch user's wishlists when authenticated
  useEffect(() => {
    const fetchWishlists = async () => {
      // Get token directly from localStorage to avoid circular dependency issues
      const storedToken = localStorage.getItem('token');
      
      if (!storedToken || !isAuthenticated()) {
        setWishlists([]);
        setActiveWishlist(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch('http://localhost:4000/api/wishlists', {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setWishlists(data.data);
          
          // Set the default wishlist as active if available
          const defaultWishlist = data.data.find(wishlist => wishlist.isDefault);
          if (defaultWishlist) {
            setActiveWishlist(defaultWishlist);
          } else if (data.data.length > 0) {
            setActiveWishlist(data.data[0]);
          }
        } else {
          setError(data.error || 'Failed to fetch wishlists');
        }
      } catch (err) {
        console.error('Error fetching wishlists:', err);
        setError('Network error. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlists();
  }, [isAuthenticated]);

  // Create a new wishlist
  const createWishlist = async (name, description = '') => {
    try {
      // Get fresh token from localStorage
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setError('Authentication required');
        return { success: false, error: 'Authentication required' };
      }
      
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:4000/api/wishlists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({ name, description }),
      });

      const data = await response.json();

      if (response.ok) {
        setWishlists([...wishlists, data.data]);
        return { success: true, wishlist: data.data };
      } else {
        setError(data.error || 'Failed to create wishlist');
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error('Error creating wishlist:', err);
      setError('Network error. Please check your connection.');
      return { success: false, error: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  // Update a wishlist
  const updateWishlist = async (wishlistId, name, description) => {
    try {
      // Get fresh token from localStorage
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setError('Authentication required');
        return { success: false, error: 'Authentication required' };
      }
      
      setLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:4000/api/wishlists/${wishlistId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({ name, description }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update the wishlist in state
        setWishlists(
          wishlists.map(wishlist => 
            wishlist._id === wishlistId ? data.data : wishlist
          )
        );
        
        // Update active wishlist if it's the one being updated
        if (activeWishlist && activeWishlist._id === wishlistId) {
          setActiveWishlist(data.data);
        }
        
        return { success: true };
      } else {
        setError(data.error || 'Failed to update wishlist');
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error('Error updating wishlist:', err);
      setError('Network error. Please check your connection.');
      return { success: false, error: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  // Delete a wishlist
  const deleteWishlist = async (wishlistId) => {
    try {
      // Get fresh token from localStorage
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setError('Authentication required');
        return { success: false, error: 'Authentication required' };
      }
      
      setLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:4000/api/wishlists/${wishlistId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (response.ok) {
        // Remove the wishlist from state
        const updatedWishlists = wishlists.filter(
          wishlist => wishlist._id !== wishlistId
        );
        setWishlists(updatedWishlists);
        
        // Update active wishlist if it's the one being deleted
        if (activeWishlist && activeWishlist._id === wishlistId) {
          const defaultWishlist = updatedWishlists.find(wishlist => wishlist.isDefault);
          if (defaultWishlist) {
            setActiveWishlist(defaultWishlist);
          } else if (updatedWishlists.length > 0) {
            setActiveWishlist(updatedWishlists[0]);
          } else {
            setActiveWishlist(null);
          }
        }
        
        return { success: true };
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete wishlist');
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error('Error deleting wishlist:', err);
      setError('Network error. Please check your connection.');
      return { success: false, error: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  // Add item to wishlist
  const addItemToWishlist = async (wishlistId, imageId, notes = '') => {
    try {
      // Get fresh token from localStorage
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setError('Authentication required');
        return { success: false, error: 'Authentication required' };
      }
      
      setLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:4000/api/wishlists/${wishlistId}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({ imageId, notes }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update the wishlist in state
        setWishlists(
          wishlists.map(wishlist => 
            wishlist._id === wishlistId ? data.data : wishlist
          )
        );
        
        // Update active wishlist if it's the one being updated
        if (activeWishlist && activeWishlist._id === wishlistId) {
          setActiveWishlist(data.data);
        }
        
        return { success: true };
      } else {
        setError(data.error || 'Failed to add item to wishlist');
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error('Error adding item to wishlist:', err);
      setError('Network error. Please check your connection.');
      return { success: false, error: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  // Quick add to default wishlist
  const quickAddToWishlist = async (imageId, notes = '') => {
    try {
      // Get fresh token from localStorage
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setError('Authentication required');
        return { success: false, error: 'Authentication required' };
      }
      
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:4000/api/wishlists/quick-add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({ imageId, notes }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update wishlists with the new or updated default wishlist
        const updatedWishlists = [...wishlists];
        const defaultWishlistIndex = updatedWishlists.findIndex(
          wishlist => wishlist._id === data.data._id
        );
        
        if (defaultWishlistIndex !== -1) {
          updatedWishlists[defaultWishlistIndex] = data.data;
        } else {
          updatedWishlists.push(data.data);
        }
        
        setWishlists(updatedWishlists);
        
        // Update active wishlist if it's the default one
        if (
          activeWishlist && 
          activeWishlist._id === data.data._id
        ) {
          setActiveWishlist(data.data);
        }
        
        return { success: true };
      } else {
        setError(data.error || 'Failed to add item to wishlist');
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error('Error adding item to wishlist:', err);
      setError('Network error. Please check your connection.');
      return { success: false, error: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  // Remove item from wishlist
  const removeItemFromWishlist = async (wishlistId, itemId) => {
    try {
      // Get fresh token from localStorage
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setError('Authentication required');
        return { success: false, error: 'Authentication required' };
      }
      
      setLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:4000/api/wishlists/${wishlistId}/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Update the wishlist in state
        setWishlists(
          wishlists.map(wishlist => 
            wishlist._id === wishlistId ? data.data : wishlist
          )
        );
        
        // Update active wishlist if it's the one being updated
        if (activeWishlist && activeWishlist._id === wishlistId) {
          setActiveWishlist(data.data);
        }
        
        return { success: true };
      } else {
        setError(data.error || 'Failed to remove item from wishlist');
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error('Error removing item from wishlist:', err);
      setError('Network error. Please check your connection.');
      return { success: false, error: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlists,
        activeWishlist,
        setActiveWishlist,
        loading,
        error,
        createWishlist,
        updateWishlist,
        deleteWishlist,
        addItemToWishlist,
        removeItemFromWishlist,
        quickAddToWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
