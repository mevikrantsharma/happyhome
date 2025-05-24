import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import PageHeader from '../components/shared/PageHeader';
import './UserProfile.css';

const UserProfile = () => {
  const { user, updateProfile, logout, error, loading, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Success message state
  const [success, setSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Load user data when component mounts
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Set form data from user context
    if (user) {
      setFormData(prevState => ({
        ...prevState,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [user, isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    // Clear password error when user types in password fields
    if (['newPassword', 'confirmPassword'].includes(name)) {
      setPasswordError('');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSuccess('');

    const { name, email, phone } = formData;
    
    // Update profile without changing password
    const result = await updateProfile({
      name,
      email,
      phone
    });

    if (result) {
      setSuccess('Profile updated successfully!');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setSuccess('');
    setPasswordError('');

    const { currentPassword, newPassword, confirmPassword } = formData;

    // Validate passwords
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    // Update password
    const result = await updateProfile({
      currentPassword,
      newPassword
    });

    if (result) {
      setSuccess('Password updated successfully!');
      // Clear password fields
      setFormData(prevState => ({
        ...prevState,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader
        title="My Profile"
        subtitle="Manage your account information and preferences"
        backgroundImage="https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg"
        metaDescription="Manage your Happy Home account profile, update your information, and change your password."
      />
      
      <section className="profile-section section">
        <div className="container">
          <div className="profile-container">
            <div className="profile-sidebar">
              <div className="profile-user-info">
                <div className="profile-avatar">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <h3>{user?.name || 'User'}</h3>
                <p>{user?.email || 'email@example.com'}</p>
              </div>
              
              <ul className="profile-menu">
                <li className="active">
                  <button>Profile Settings</button>
                </li>
                <li>
                  <button>Saved Projects</button>
                </li>
                <li>
                  <button>Notifications</button>
                </li>
                <li>
                  <button>Billing Information</button>
                </li>
                <li className="menu-separator"></li>
                <li>
                  <button onClick={handleLogout} className="logout-button">
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
            
            <div className="profile-content">
              <h2>Profile Settings</h2>
              
              {error && <div className="profile-error">{error}</div>}
              {success && <div className="profile-success">{success}</div>}
              
              <div className="profile-settings-container">
                <div className="profile-form-section">
                  <h3>Personal Information</h3>
                  <form onSubmit={handleProfileUpdate} className="profile-form">
                    <div className="form-group">
                      <label htmlFor="name">Full Name</label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      disabled={loading}
                    >
                      {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                  </form>
                </div>
                
                <div className="profile-form-section">
                  <h3>Change Password</h3>
                  <form onSubmit={handlePasswordUpdate} className="profile-form">
                    <div className="form-group">
                      <label htmlFor="currentPassword">Current Password</label>
                      <input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="newPassword">New Password</label>
                      <input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="confirmPassword">Confirm New Password</label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                      {passwordError && <span className="error-message">{passwordError}</span>}
                    </div>
                    
                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      disabled={loading}
                    >
                      {loading ? 'Updating...' : 'Change Password'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default UserProfile;
