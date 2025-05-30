import { createContext, useState, useEffect } from 'react';

// Create context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Helper function to clear session data
  const clearSession = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('sessionTimestamp');
    setUser(null);
    setToken(null);
  };

  // Check if user is logged in on initial load and validate token
  useEffect(() => {
    const validateSession = async () => {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      const sessionTimestamp = localStorage.getItem('sessionTimestamp');
      
      // First set the stored values to maintain session across reloads
      if (storedUser && storedToken) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setToken(storedToken);
          
          // Set current time if no timestamp exists
          if (!sessionTimestamp) {
            localStorage.setItem('sessionTimestamp', new Date().getTime().toString());
          }
          
          // Check for session timeout (7 days instead of 24 hours for better UX)
          const SESSION_TIMEOUT = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
          const currentTime = new Date().getTime();
          const sessionTime = sessionTimestamp ? parseInt(sessionTimestamp) : currentTime;
          
          if (currentTime - sessionTime > SESSION_TIMEOUT) {
            // Session expired, clear storage
            console.log('Session expired due to timeout');
            clearSession();
            setLoading(false);
            return;
          }

          // Validate token with the server, but don't logout on failure
          try {
            const response = await fetch('http://localhost:4000/api/users/me', {
              headers: {
                'Authorization': `Bearer ${storedToken}`
              }
            });
            
            if (response.ok) {
              // Token is valid, update timestamp
              localStorage.setItem('sessionTimestamp', currentTime.toString());
            } else {
              // For invalid token, we'll still keep the user logged in
              // but we won't update the timestamp
              console.log('Token validation failed, but keeping user session');
            }
          } catch (error) {
            // On network error, just keep the session
            console.error('Error validating token:', error);
          }
        } catch (error) {
          // If there's an error parsing the user data, clear the session
          console.error('Error parsing stored user data:', error);
          clearSession();
        }
      }
      
      setLoading(false);
    };
    
    validateSession();
  }, []);

  // Register user
  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:4000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        // No longer storing user data or token in localStorage
        // No longer setting user and token in state
        // This prevents automatic login after registration
        
        setError(null);
        return { success: true, message: 'Registration successful! Please log in.' };
      } else {
        setError(data.error || 'Registration failed');
        setUser(null);
        setToken(null);
        return { success: false };
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      console.error('Registration error:', err);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:4000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        
        setUser(data.user);
        setToken(data.token);
        setError(null);
      } else {
        setError(data.error || 'Login failed');
        setUser(null);
        setToken(null);
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    clearSession();
  };
  
  // Delete user account
  const deleteAccount = async (password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:4000/api/users/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        clearSession();
        return { success: true, message: data.message || 'Account deleted successfully' };
      } else {
        setError(data.error || 'Failed to delete account');
        return { success: false, error: data.error || 'Failed to delete account' };
      }
    } catch (err) {
      const errorMessage = 'Network error. Please check your connection.';
      setError(errorMessage);
      console.error('Delete account error:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:4000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        
        setUser(data.user);
        setToken(data.token);
        setError(null);
        return true;
      } else {
        setError(data.error || 'Profile update failed');
        return false;
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      console.error('Update profile error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Check if token is valid and user is authenticated
  const isAuthenticated = () => {
    return !!token && !!user;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        deleteAccount,
        isAuthenticated: () => !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
