import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  
  // Check if user is authenticated
  React.useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token && window.location.pathname !== '/admin/login') {
      navigate('/admin/login');
    }
  }, [navigate]);

  // Get current location to highlight active nav item
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Skip navigation on login page
  const isLoginPage = currentPath === '/admin/login';
  
  if (isLoginPage) {
    return (
      <div className="admin-layout admin-login-layout">
        {children}
      </div>
    );
  }
  
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      <div className="admin-navbar">
        <div className="admin-brand">Happy Home Admin</div>
        <nav className="admin-nav">
          <Link 
            to="/admin/messages" 
            className={`admin-nav-link ${currentPath === '/admin/messages' ? 'active' : ''}`}
          >
            Messages
          </Link>
          <Link 
            to="/admin/images" 
            className={`admin-nav-link ${currentPath === '/admin/images' ? 'active' : ''}`}
          >
            Images
          </Link>
          <Link 
            to="/admin/users" 
            className={`admin-nav-link ${currentPath === '/admin/users' ? 'active' : ''}`}
          >
            Users
          </Link>
          <Link 
            to="/admin/settings" 
            className={`admin-nav-link ${currentPath === '/admin/settings' ? 'active' : ''}`}
          >
            Settings
          </Link>
        </nav>
        <button className="admin-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="admin-content">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
