import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminMessages.css';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    // Fetch messages
    fetchMessages();
  }, [navigate]);

  const fetchMessages = async () => {
    setIsLoading(true);
    setError('');
    console.log('Fetching messages...');
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('adminToken');
      console.log('Using token:', token ? 'Token exists' : 'No token found');
      
      if (!token) {
        navigate('/admin/login');
        return;
      }
      
      const response = await fetch('http://localhost:4000/api/contacts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.log('Response status:', response.status);

      if (response.status === 401) {
        // Unauthorized - token expired or invalid
        console.log('Unauthorized access - redirecting to login');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
        return;
      }

      const data = await response.json();
      console.log('Response data:', data);
      
      if (response.ok) {
        if (data.data && Array.isArray(data.data)) {
          setMessages(data.data);
          console.log(`Loaded ${data.data.length} messages successfully`);
        } else {
          console.error('Unexpected data format:', data);
          setMessages([]);
          setError('Unexpected data format received from server');
        }
      } else {
        console.error('Error response:', data);
        setError(data.error || 'Failed to fetch messages');
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Network error. Please check your connection and make sure the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/api/contacts/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (response.ok) {
        // Update the message in the UI
        setMessages(messages.map(msg => 
          msg._id === id ? { ...msg, isRead: true } : msg
        ));
      }
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/contacts/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (response.ok) {
        // Remove the message from the UI
        setMessages(messages.filter(msg => msg._id !== id));
      }
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="admin-messages-container">
      <div className="admin-header">
        <h1>Contact Messages</h1>
        <div className="admin-controls">
          <button className="refresh-button" onClick={fetchMessages}>
            Refresh Messages
          </button>
          <button className="admin-button" onClick={() => navigate('/admin/images')}>
            Manage Images
          </button>
          <button className="settings-button" onClick={() => navigate('/admin/settings')}>
            Settings
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {error && <div className="admin-error">{error}</div>}

      {isLoading ? (
        <div className="loading-spinner">Loading messages...</div>
      ) : messages.length === 0 ? (
        <div className="no-messages">No contact messages found.</div>
      ) : (
        <div className="messages-grid">
          {messages.map((message) => (
            <div 
              key={message._id} 
              className={`message-card ${!message.isRead ? 'unread' : ''}`}
            >
              <div className="message-header">
                <h3>{message.name}</h3>
                <div className="message-date">{formatDate(message.createdAt)}</div>
              </div>
              
              <div className="message-service">
                Service: <span className="service-tag">{message.service}</span>
              </div>
              
              <div className="message-contact">
                <div><strong>Email:</strong> {message.email}</div>
                <div><strong>Phone:</strong> {message.phone}</div>
              </div>
              
              <div className="message-content">
                <p>{message.message}</p>
              </div>
              
              <div className="message-actions">
                {!message.isRead && (
                  <button 
                    className="mark-read-button"
                    onClick={() => handleMarkAsRead(message._id)}
                  >
                    Mark as Read
                  </button>
                )}
                <button 
                  className="delete-button"
                  onClick={() => handleDelete(message._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
