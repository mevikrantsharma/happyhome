/**
 * Session validation and management utilities
 */

/**
 * Validates the current session and clears it if invalid
 * This handles cases where server restarts or browser was closed
 */
export const validateSession = async () => {
  const token = localStorage.getItem('token');
  const adminToken = localStorage.getItem('adminToken');
  
  // Clear session if no token (already logged out)
  if (!token && !adminToken) {
    return;
  }
  
  try {
    // Check token validity by making a request to the server
    // For user token
    if (token) {
      const response = await fetch('http://localhost:4000/api/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        // Token is invalid or expired
        console.log('User session invalid, clearing...');
        clearUserSession();
      }
    }
    
    // For admin token
    if (adminToken) {
      const response = await fetch('http://localhost:4000/api/admin/me', {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      
      if (!response.ok) {
        // Token is invalid or expired
        console.log('Admin session invalid, clearing...');
        clearAdminSession();
      }
    }
  } catch (error) {
    console.error('Error validating session:', error);
    // If we can't reach the server, don't log the user out
    // They might just be offline temporarily
  }
};

/**
 * Clears the user session data
 */
export const clearUserSession = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

/**
 * Clears the admin session data
 */
export const clearAdminSession = () => {
  localStorage.removeItem('adminUser');
  localStorage.removeItem('adminToken');
};

/**
 * Clears all session data
 */
export const clearAllSessions = () => {
  clearUserSession();
  clearAdminSession();
};
