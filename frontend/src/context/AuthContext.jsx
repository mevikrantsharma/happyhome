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
      
      // Check for session timeout (24 hours)
      const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      const currentTime = new Date().getTime();
      const sessionTime = sessionTimestamp ? parseInt(sessionTimestamp) : 0;
      
      if (currentTime - sessionTime > SESSION_TIMEOUT) {
        // Session expired, clear storage
        console.log('Session expired due to timeout');
        clearSession();
        setLoading(false);
        return;
      }

      if (storedUser && storedToken) {
        try {
          // Validate token with the server
          const response = await fetch('http://localhost:4000/api/users/me', {
            headers: {
              'Authorization': `Bearer ${storedToken}`
            }
          });
          
          if (response.ok) {
            // Token is valid
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
            // Update session timestamp
            localStorage.setItem('sessionTimestamp', currentTime.toString());
          } else {
            // Token is invalid
            console.log('Invalid token, clearing session');
            clearSession();
          }
        } catch (error) {
          console.error('Error validating token:', error);
          // On error (like server not responding), don't auto-logout
          // Just use stored data but don't update timestamp
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
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
        token,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        isAuthenticated,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
