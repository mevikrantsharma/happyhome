import React, { useState, useEffect } from 'react';
import './AdminUsers.css';
import { FaSearch, FaUserCircle, FaPhone, FaEnvelope, FaCalendarAlt } from 'react-icons/fa';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [isAdminToken, setIsAdminToken] = useState(true); // For debugging admin token
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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
        const response = await fetch('/api/users/all', {
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

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
  );
};

export default AdminUsers;
