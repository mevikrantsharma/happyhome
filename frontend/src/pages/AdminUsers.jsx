import React, { useState, useEffect } from 'react';
import './AdminUsers.css';
import './AdminUsersDelete.css';
import './SimpleModal.css';
import { FaSearch, FaUserCircle, FaPhone, FaEnvelope, FaCalendarAlt, FaTrash, FaExclamationTriangle } from 'react-icons/fa';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [isAdminToken, setIsAdminToken] = useState(true); // For debugging admin token
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check for admin token
        const token = localStorage.getItem('adminToken');
        if (!token) {
          setIsAdminToken(false);
          throw new Error('Not authorized - No admin token found');
        }
        
        console.log('Using admin token:', token);

        // Use axios instead of fetch for better error handling
        const response = await fetch('/api/admin/users', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error('Non-JSON response:', text);
          throw new Error('Server returned non-JSON response. API proxy may not be configured correctly.');
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch users');
        }

        console.log('User data received:', data);
        
        // The API now returns a direct array of users
        if (Array.isArray(data)) {
          console.log('Setting users from array data');
          setUsers(data);
        } else if (data.users && Array.isArray(data.users)) {
          console.log('Setting users from data.users');
          setUsers(data.users);
        } else {
          console.error('Unexpected data format:', data);
          setUsers([]);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Handle user deletion
  const handleDeleteUser = async () => {
    if (!confirmDelete) return;
    
    setDeleteLoading(true);
    setDeleteError(null);
    setDeleteSuccess(null);
    
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Not authorized - No admin token found');
      }
      
      const response = await fetch(`/api/admin/users/${confirmDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete user');
      }
      
      // On success, update the users list
      setUsers(users.filter(user => user._id !== confirmDelete._id));
      setDeleteSuccess('User deleted successfully');
      
      // Auto close after success
      setTimeout(() => {
        setConfirmDelete(null);
        setDeleteSuccess(null);
      }, 2000);
      
    } catch (err) {
      console.error('Error deleting user:', err);
      setDeleteError(err.message || 'Failed to delete user');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filter users based on search term
  const filteredUsers = users && users.length > 0 ? users.filter(user => 
    (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  ) : [];

  return (
      <div className="admin-users-container">
        <div className="admin-page-header">
          <h1>Registered Users</h1>
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {loading ? (
          <div className="users-loading">
            <div className="loader"></div>
            <p>Loading users...</p>
          </div>
        ) : error ? (
          <div className="users-error">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="retry-button"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="users-stats">
              <div className="stat-card">
                <h3>Total Users</h3>
                <p>{users.length}</p>
              </div>
              <div className="stat-card">
                <h3>New Users (30 days)</h3>
                <p>
                  {users.filter(user => {
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    return new Date(user.createdAt) > thirtyDaysAgo;
                  }).length}
                </p>
              </div>
            </div>

            {filteredUsers.length === 0 ? (
              <div className="no-users-found">
                <p>No users match your search criteria.</p>
              </div>
            ) : (
              <div className="users-table-container">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Registered Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user._id}>
                        <td className="user-info">
                          <div className="user-avatar">
                            <FaUserCircle />
                          </div>
                          <div className="user-name">
                            <p>{user.name}</p>
                          </div>
                        </td>
                        <td>
                          <div className="user-email">
                            <FaEnvelope className="icon" />
                            <span>{user.email}</span>
                          </div>
                        </td>
                        <td>
                          <div className="user-phone">
                            <FaPhone className="icon" />
                            <span>{user.phone || 'N/A'}</span>
                          </div>
                        </td>
                        <td>
                          <div className="user-date">
                            <FaCalendarAlt className="icon" />
                            <span>{formatDate(user.createdAt)}</span>
                          </div>
                        </td>
                        <td>
                          <div className="user-actions">
                            <button 
                              className="delete-user-btn"
                              onClick={() => setConfirmDelete(user)}
                              disabled={user.role === 'admin'}
                              title={user.role === 'admin' ? 'Cannot delete admin accounts' : 'Delete user'}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Simple delete confirmation modal */}
            {confirmDelete && (
              <div className="simple-modal-overlay">
                <div className="simple-modal">
                  <h3>Delete User Account</h3>
                  
                  <div className="simple-modal-content">
                    <div className="warning-icon-container">
                      <FaExclamationTriangle className="warning-icon-large" />
                    </div>
                    
                    <p>Are you sure you want to delete <strong>{confirmDelete.name}</strong>?</p>
                    <p>This will permanently remove the user account and all associated data:</p>
                    <ul>
                      <li>User profile information</li>
                      <li>All saved collections/wishlists</li>
                      <li>Reviews and testimonials</li>
                    </ul>
                    
                    {deleteError && (
                      <div className="simple-error-message">
                        {deleteError}
                      </div>
                    )}
                    
                    {deleteSuccess && (
                      <div className="simple-success-message">
                        {deleteSuccess}
                      </div>
                    )}
                  </div>
                  
                  <div className="simple-modal-actions">
                    <button 
                      onClick={() => {
                        setConfirmDelete(null);
                        setDeleteError(null);
                        setDeleteSuccess(null);
                      }}
                      disabled={deleteLoading}
                      className="simple-cancel-btn"
                    >
                      Cancel
                    </button>
                    
                    <button 
                      onClick={handleDeleteUser}
                      disabled={deleteLoading || deleteSuccess}
                      className="simple-delete-btn"
                    >
                      {deleteLoading ? 'Deleting...' : 'Delete User'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
  );
};

export default AdminUsers;
